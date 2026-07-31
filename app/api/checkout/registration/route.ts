import { NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase-admin';
import { buildReference, initializeTransaction, siteUrl } from '@/lib/paystack';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Starts payment of the athlete entry fee for an already-submitted
 * registration. Called straight after the registration form saves.
 *
 * The fee is server-side config, not a form field.
 */
export async function POST(request: Request) {
  try {
    const { registration_id } = (await request.json()) as { registration_id?: string };

    if (!registration_id) {
      return NextResponse.json({ error: 'registration_id is required.' }, { status: 400 });
    }

    const admin = createSupabaseAdminClient();

    const { data: registration, error } = await admin
      .from('registrations')
      .select('id, first_name, last_name, email, fee_paid_status')
      .eq('id', registration_id)
      .maybeSingle();

    if (error) throw error;
    if (!registration) {
      return NextResponse.json({ error: 'Registration not found.' }, { status: 404 });
    }
    if (registration.fee_paid_status === 'paid') {
      return NextResponse.json({ error: 'This entry fee has already been paid.' }, { status: 409 });
    }

    const fee = Number(process.env.NEXT_PUBLIC_REGISTRATION_FEE || 0);
    if (!fee || fee <= 0) {
      return NextResponse.json(
        { error: 'Registration fee is not configured. Set NEXT_PUBLIC_REGISTRATION_FEE.' },
        { status: 500 },
      );
    }

    const reference = buildReference('registration');

    await admin
      .from('registrations')
      .update({ fee_amount: fee, currency: 'GHS' })
      .eq('id', registration.id);

    await admin.from('payments').insert({
      reference,
      purpose: 'registration',
      related_id: registration.id,
      amount: fee,
      currency: 'GHS',
      status: 'pending',
      customer_email: registration.email,
    });

    const paystack = await initializeTransaction({
      email: registration.email,
      amount: fee,
      reference,
      callbackUrl: `${siteUrl()}/api/paystack/callback`,
      metadata: {
        purpose: 'registration',
        registration_id: registration.id,
        athlete: `${registration.first_name} ${registration.last_name}`,
      },
    });

    return NextResponse.json({
      authorization_url: paystack.authorization_url,
      reference,
      amount: fee,
    });
  } catch (error) {
    console.error('[checkout/registration]', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Could not start payment.' },
      { status: 500 },
    );
  }
}
