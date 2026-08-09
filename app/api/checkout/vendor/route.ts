import { NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase-admin';
import { buildReference, initializeTransaction, siteUrl } from '@/lib/paystack';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Starts payment of a vendor application's package fee. Called straight
 * after the apply form saves the application row.
 *
 * The price is re-read from vendor_packages server-side — the browser
 * only ever sends the application id, so a tampered request cannot
 * change what is charged.
 */
export async function POST(request: Request) {
  try {
    const { vendor_id } = (await request.json()) as { vendor_id?: string };

    if (!vendor_id) {
      return NextResponse.json({ error: 'vendor_id is required.' }, { status: 400 });
    }

    const admin = createSupabaseAdminClient();

    const { data: vendor, error } = await admin
      .from('vendors')
      .select('id, name, email, package_id, payment_status, paystack_ref')
      .eq('id', vendor_id)
      .maybeSingle();

    if (error) throw error;
    if (!vendor) {
      return NextResponse.json({ error: 'Vendor application not found.' }, { status: 404 });
    }
    if (vendor.payment_status === 'paid') {
      return NextResponse.json({ error: 'This application has already been paid.' }, { status: 409 });
    }
    if (!vendor.email) {
      return NextResponse.json(
        { error: 'An email is required to pay online. Contact us to arrange payment.' },
        { status: 400 },
      );
    }
    if (!vendor.package_id) {
      return NextResponse.json(
        { error: 'No package selected. Go back and choose a sponsorship or booth package.' },
        { status: 400 },
      );
    }

    // Authoritative price: re-read from the package catalogue, not the
    // snapshot the browser wrote when the form was submitted.
    const { data: pkg, error: pkgError } = await admin
      .from('vendor_packages')
      .select('id, name, price, is_active')
      .eq('id', vendor.package_id)
      .maybeSingle();

    if (pkgError) throw pkgError;
    if (!pkg || !pkg.is_active) {
      return NextResponse.json(
        { error: 'That package is no longer available. Choose another package.' },
        { status: 400 },
      );
    }

    const price = Number(pkg.price);
    if (!price || price <= 0) {
      return NextResponse.json(
        { error: 'That package has no price set. Contact us to arrange payment.' },
        { status: 400 },
      );
    }

    const reference = buildReference('vendor');

    await admin
      .from('vendors')
      .update({ package_name: pkg.name, package_price: price })
      .eq('id', vendor.id);

    await admin.from('payments').insert({
      reference,
      purpose: 'vendor',
      related_id: vendor.id,
      amount: price,
      currency: 'GHS',
      status: 'pending',
      customer_email: vendor.email,
    });

    const paystack = await initializeTransaction({
      email: vendor.email,
      amount: price,
      reference,
      callbackUrl: `${siteUrl()}/api/paystack/callback`,
      metadata: {
        purpose: 'vendor',
        vendor_id: vendor.id,
        package: pkg.name,
      },
    });

    return NextResponse.json({
      authorization_url: paystack.authorization_url,
      reference,
      amount: price,
    });
  } catch (error) {
    console.error('[checkout/vendor]', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Could not start payment.' },
      { status: 500 },
    );
  }
}
