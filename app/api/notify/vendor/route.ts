import { NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase-admin';
import { sendSms, notifyAdmin } from '@/lib/sms';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Fired by the vendor application form right after a successful submit
 * — texts the vendor a confirmation and texts the admin numbers that a
 * new application came in. Best-effort: SMS failures here never surface
 * to the applicant, the application itself already succeeded.
 */
export async function POST(request: Request) {
  try {
    const { vendor_id } = (await request.json()) as { vendor_id?: string };
    if (!vendor_id) {
      return NextResponse.json({ error: 'vendor_id is required.' }, { status: 400 });
    }

    const admin = createSupabaseAdminClient();
    const { data: vendor } = await admin
      .from('vendors')
      .select('name, phone, category, package_name')
      .eq('id', vendor_id)
      .maybeSingle();

    if (!vendor) {
      return NextResponse.json({ ok: true });
    }

    await Promise.all([
      vendor.phone
        ? sendSms(
            vendor.phone,
            `Hi ${vendor.name}, your WFF Ghana vendor application is received! We'll review it and be in touch. - WFF Ghana`,
          )
        : Promise.resolve(),
      notifyAdmin(
        `New vendor application: ${vendor.name} (${vendor.category}${vendor.package_name ? `, ${vendor.package_name}` : ''}). Review in /admin.`,
      ),
    ]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[notify/vendor]', error);
    return NextResponse.json({ ok: true });
  }
}
