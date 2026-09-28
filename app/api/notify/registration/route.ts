import { NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase-admin';
import { sendSms, notifyAdmin } from '@/lib/sms';
import { formatEntries } from '@/lib/registrationEntries';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Fired by the registration form right after a successful submit —
 * texts the athlete a confirmation and texts the admin numbers that a
 * new application came in. Best-effort: SMS failures here never surface
 * to the athlete, the registration itself already succeeded.
 */
export async function POST(request: Request) {
  try {
    const { registration_id } = (await request.json()) as { registration_id?: string };
    if (!registration_id) {
      return NextResponse.json({ error: 'registration_id is required.' }, { status: 400 });
    }

    const admin = createSupabaseAdminClient();
    const { data: reg } = await admin
      .from('registrations')
      .select('first_name, last_name, mobile, category, division, entries, payment_method')
      .eq('id', registration_id)
      .maybeSingle();

    if (!reg) {
      return NextResponse.json({ ok: true });
    }

    const athleteName = `${reg.first_name} ${reg.last_name}`.trim();
    const entered = formatEntries(reg);

    await Promise.all([
      sendSms(
        reg.mobile,
        `Hi ${reg.first_name}, your WFF Ghana registration for ${entered} is received! We'll review and reach out within 48 hours. - WFF Ghana`,
      ),
      notifyAdmin(
        `New athlete registration: ${athleteName} - ${entered}. Payment: ${reg.payment_method || 'unpaid'}. Review in /admin/registrations.`,
      ),
    ]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    // Never fail the caller over a notification problem.
    console.error('[notify/registration]', error);
    return NextResponse.json({ ok: true });
  }
}
