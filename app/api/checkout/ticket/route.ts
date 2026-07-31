import { NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase-admin';
import { buildReference, initializeTransaction, siteUrl } from '@/lib/paystack';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Creates a pending ticket order and returns a Paystack checkout URL.
 * The tier price comes from the database, not the request body.
 */
export async function POST(request: Request) {
  try {
    const { ticket_tier_id, buyer_name, buyer_email, buyer_phone, quantity } =
      (await request.json()) as {
        ticket_tier_id?: string;
        buyer_name?: string;
        buyer_email?: string;
        buyer_phone?: string;
        quantity?: number;
      };

    if (!ticket_tier_id || !buyer_name || !buyer_email) {
      return NextResponse.json(
        { error: 'Ticket type, name and email are required.' },
        { status: 400 },
      );
    }

    const qty = Math.max(1, Math.min(20, Math.floor(Number(quantity) || 1)));
    const admin = createSupabaseAdminClient();

    const { data: tier, error: tierError } = await admin
      .from('ticket_tiers')
      .select('id, name, price')
      .eq('id', ticket_tier_id)
      .maybeSingle();

    if (tierError) throw tierError;
    if (!tier) {
      return NextResponse.json({ error: 'That ticket type is no longer on sale.' }, { status: 400 });
    }

    const unitPrice = Number(tier.price);
    const total = Number((unitPrice * qty).toFixed(2));

    if (total <= 0) {
      return NextResponse.json({ error: 'Ticket total must be greater than zero.' }, { status: 400 });
    }

    const reference = buildReference('ticket');

    const { data: order, error: orderError } = await admin
      .from('ticket_orders')
      .insert({
        reference,
        ticket_tier_id: tier.id,
        buyer_name,
        buyer_email,
        buyer_phone: buyer_phone || null,
        quantity: qty,
        unit_price: unitPrice,
        total,
        currency: 'GHS',
        payment_status: 'pending',
      })
      .select('id')
      .single();

    if (orderError) throw orderError;

    await admin.from('payments').insert({
      reference,
      purpose: 'ticket',
      related_id: order.id,
      amount: total,
      currency: 'GHS',
      status: 'pending',
      customer_email: buyer_email,
    });

    const paystack = await initializeTransaction({
      email: buyer_email,
      amount: total,
      reference,
      callbackUrl: `${siteUrl()}/api/paystack/callback`,
      metadata: {
        purpose: 'ticket',
        order_id: order.id,
        tier: tier.name,
        quantity: qty,
      },
    });

    return NextResponse.json({
      authorization_url: paystack.authorization_url,
      reference,
      order_id: order.id,
      total,
    });
  } catch (error) {
    console.error('[checkout/ticket]', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Ticket checkout failed.' },
      { status: 500 },
    );
  }
}
