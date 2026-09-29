import { NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase-admin';
import { sendSms, notifyAdmin } from '@/lib/sms';
import { formatEntries } from '@/lib/registrationEntries';
import { sendEmail } from '@/lib/email';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Fired by the registration form right after a successful submit —
 * texts and emails the athlete a confirmation and texts the admin numbers that a
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
      .select('first_name, last_name, email, mobile, category, division, entries, payment_method')
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
      sendEmail({
        to: reg.email,
        toName: athleteName,
        subject: 'Your WFF Ghana registration is received',
        heading: "You're registered",
        paragraphs: [
          `Hi ${reg.first_name}, we have received your registration for the 2026 All Africa Bodybuilding Championship.`,
          'Our team will review your submission and contact you within 48 hours with your status and next steps.',
          // Pay-now athletes get a separate email once Paystack confirms.
          ...(reg.payment_method === 'onsite'
            ? ['You chose to pay later: bring your entry fee to pay in person. Keep this email for your records.']
            : []),
        ],
        details: [['Competing in', entered]],
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    // Never fail the caller over a notification problem.
    console.error('[notify/registration]', error);
    return NextResponse.json({ ok: true });
  }
}
