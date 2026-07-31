import { NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase-admin';
import { buildReference, initializeTransaction, siteUrl } from '@/lib/paystack';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface IncomingItem {
  product_id: string;
  quantity: number;
  size?: string | null;
}

/**
 * Creates a pending merchandise order and hands back a Paystack
 * checkout URL.
 *
 * Prices are re-read from the database here — the browser only ever
 * sends product ids and quantities, so a tampered cart cannot change
 * what is charged.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      buyer_name,
      buyer_email,
      buyer_phone,
      shipping_address,
      shipping_city,
      shipping_country,
      items,
    } = body as {
      buyer_name?: string;
      buyer_email?: string;
      buyer_phone?: string;
      shipping_address?: string;
      shipping_city?: string;
      shipping_country?: string;
      items?: IncomingItem[];
    };

    if (!buyer_name || !buyer_email) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Your cart is empty.' }, { status: 400 });
    }
    if (items.length > 50) {
      return NextResponse.json({ error: 'Too many line items.' }, { status: 400 });
    }

    const admin = createSupabaseAdminClient();

    const productIds = [...new Set(items.map((i) => i.product_id))];
    const { data: products, error: productError } = await admin
      .from('ecommerce_products')
      .select('id, name, price')
      .in('id', productIds);

    if (productError) throw productError;
    if (!products || products.length !== productIds.length) {
      return NextResponse.json(
        { error: 'One or more items are no longer available.' },
        { status: 400 },
      );
    }

    const priceById = new Map(products.map((p) => [p.id, p]));

    let subtotal = 0;
    const lineItems = items.map((item) => {
      const product = priceById.get(item.product_id)!;
      const quantity = Math.max(1, Math.min(99, Math.floor(Number(item.quantity) || 1)));
      const unitPrice = Number(product.price);
      const lineTotal = Number((unitPrice * quantity).toFixed(2));
      subtotal += lineTotal;

      return {
        product_id: product.id,
        product_name: product.name,
        unit_price: unitPrice,
        quantity,
        line_total: lineTotal,
        size: item.size || null,
      };
    });

    subtotal = Number(subtotal.toFixed(2));
    const shippingFee = Number(process.env.NEXT_PUBLIC_SHOP_SHIPPING_FEE || 0);
    const total = Number((subtotal + shippingFee).toFixed(2));

    if (total <= 0) {
      return NextResponse.json({ error: 'Order total must be greater than zero.' }, { status: 400 });
    }

    const reference = buildReference('shop');

    const { data: order, error: orderError } = await admin
      .from('shop_orders')
      .insert({
        reference,
        buyer_name,
        buyer_email,
        buyer_phone: buyer_phone || null,
        shipping_address: shipping_address || null,
        shipping_city: shipping_city || null,
        shipping_country: shipping_country || null,
        subtotal,
        shipping_fee: shippingFee,
        total,
        currency: 'GHS',
        payment_status: 'pending',
      })
      .select('id')
      .single();

    if (orderError) throw orderError;

    const { error: itemsError } = await admin
      .from('shop_order_items')
      .insert(lineItems.map((li) => ({ ...li, order_id: order.id })));

    if (itemsError) throw itemsError;

    await admin.from('payments').insert({
      reference,
      purpose: 'shop',
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
      metadata: { purpose: 'shop', order_id: order.id, buyer_name },
    });

    return NextResponse.json({
      authorization_url: paystack.authorization_url,
      reference,
      order_id: order.id,
      total,
    });
  } catch (error) {
    console.error('[checkout/shop]', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Checkout failed.' },
      { status: 500 },
    );
  }
}
