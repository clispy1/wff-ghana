import { createSupabaseAdminClient } from './supabase-admin';
import { fromSubunit, type PaystackVerifyData } from './paystack';
import { sendSms, notifyAdmin } from './sms';
import { sendEmail, cedis } from './email';
import { formatEntries } from './registrationEntries';

/**
 * Single place where a Paystack transaction is turned into "this order
 * is paid". Both the callback route and the webhook funnel through here,
 * so it must be idempotent — whichever arrives first wins and the second
 * is a no-op.
 *
 * SERVER ONLY.
 */
export async function settlePayment(
  data: PaystackVerifyData,
): Promise<{ status: 'success' | 'failed' | 'ignored'; purpose?: string; relatedId?: string | null }> {
  const admin = createSupabaseAdminClient();
  const reference = data.reference;

  const { data: payment } = await admin
    .from('payments')
    .select('*')
    .eq('reference', reference)
    .maybeSingle();

  if (!payment) {
    // A reference we never issued. Don't create value for it.
    return { status: 'ignored' };
  }

  const paidAmount = fromSubunit(data.amount);
  const succeeded = data.status === 'success';

  // Underpayment guard: Paystack returns what was actually charged. If
  // it doesn't cover what we asked for, treat it as failed rather than
  // shipping goods.
  const amountOk = paidAmount + 0.001 >= Number(payment.amount);
  const settledOk = succeeded && amountOk;

  if (payment.status === 'success') {
    return { status: 'success', purpose: payment.purpose, relatedId: payment.related_id };
  }

  await admin
    .from('payments')
    .update({
      status: settledOk ? 'success' : 'failed',
      channel: data.channel ?? null,
      gateway_response: amountOk
        ? (data.gateway_response ?? null)
        : `Amount mismatch: expected ${payment.amount}, received ${paidAmount}`,
      customer_email: data.customer?.email ?? payment.customer_email,
      raw: data as unknown as Record<string, unknown>,
      verified_at: new Date().toISOString(),
    })
    .eq('reference', reference);

  if (!settledOk) {
    await markRelatedFailed(admin, payment.purpose, payment.related_id);
    return { status: 'failed', purpose: payment.purpose, relatedId: payment.related_id };
  }

  const paidAt = data.paid_at || new Date().toISOString();

  switch (payment.purpose) {
    case 'shop': {
      const { data: order } = await admin
        .from('shop_orders')
        .update({ payment_status: 'paid', paystack_ref: reference, paid_at: paidAt })
        .eq('id', payment.related_id)
        .select('buyer_name, buyer_email, total')
        .single();

      if (order) {
        sendEmail({
          to: order.buyer_email,
          toName: order.buyer_name,
          subject: 'Your WFF Ghana order is confirmed',
          heading: 'Order confirmed',
          paragraphs: [
            `Hi ${order.buyer_name}, thank you for your order. Your payment is confirmed and we are preparing your items for dispatch.`,
            'We will be in touch when your order is on its way.',
          ],
          details: [['Amount paid', cedis(order.total)], ['Reference', reference]],
        }).catch(() => {});
      }
      break;
    }

    case 'ticket': {
      const { data: order } = await admin
        .from('ticket_orders')
        .update({ payment_status: 'paid', paystack_ref: reference, paid_at: paidAt })
        .eq('id', payment.related_id)
        .select('buyer_name, buyer_email, buyer_phone, quantity, total, ticket_tiers(name)')
        .single();

      if (order) {
        const tier = (order.ticket_tiers as { name?: string } | null)?.name || 'Championship';
        const passes = `${order.quantity} x ${tier} ticket${order.quantity === 1 ? '' : 's'}`;
        Promise.all([
          order.buyer_phone
            ? sendSms(
                order.buyer_phone,
                `Payment received! ${passes} for the WFF Ghana All Africa Championship. Show this reference at the entrance: ${reference} - WFF Ghana`,
              )
            : Promise.resolve(),
          notifyAdmin(`Ticket sale: ${order.buyer_name} bought ${passes}. Ref: ${reference}.`),
          sendEmail({
            to: order.buyer_email,
            toName: order.buyer_name,
            subject: 'Your WFF Ghana championship tickets',
            heading: 'Tickets confirmed',
            paragraphs: [
              `Hi ${order.buyer_name}, your payment is confirmed. See you at the 2026 All Africa Bodybuilding Championship!`,
              'Show your reference at the entrance, either in this email or the SMS we sent you.',
            ],
            details: [
              ['Tickets', passes],
              ['Amount paid', cedis(order.total)],
              ['Reference', reference],
            ],
          }),
        ]).catch(() => {});
      }
      break;
    }

    case 'registration': {
      const { data: reg } = await admin
        .from('registrations')
        .update({
          fee_paid_status: 'paid',
          payment_method: 'paystack',
          paystack_ref: reference,
          paid_at: paidAt,
        })
        .eq('id', payment.related_id)
        .select('first_name, last_name, email, mobile, category, division, entries')
        .single();

      if (reg) {
        // Best-effort — a payment that just cleared must never fail
        // over an SMS problem.
        Promise.all([
          sendSms(
            reg.mobile,
            `Payment received! Your WFF Ghana entry fee for ${formatEntries(reg)} is confirmed. See you at the championship. - WFF Ghana`,
          ),
          notifyAdmin(
            `Payment confirmed: ${reg.first_name} ${reg.last_name} paid their registration fee (${formatEntries(reg)}). Ref: ${reference}.`,
          ),
          sendEmail({
            to: reg.email,
            toName: `${reg.first_name} ${reg.last_name}`.trim(),
            subject: 'Your WFF Ghana entry fee is confirmed',
            heading: 'Entry fee received',
            paragraphs: [
              `Hi ${reg.first_name}, your entry fee payment is confirmed.`,
              'Your application is with the selection committee. We will contact you once it has been reviewed.',
            ],
            details: [
              ['Competing in', formatEntries(reg)],
              ['Amount paid', cedis(paidAmount)],
              ['Reference', reference],
            ],
          }),
        ]).catch(() => {});
      }
      break;
    }

    case 'vendor': {
      const { data: vendor } = await admin
        .from('vendors')
        .update({ payment_status: 'paid', paystack_ref: reference, paid_at: paidAt })
        .eq('id', payment.related_id)
        .select('name, email, phone, category, package_name')
        .single();

      if (vendor) {
        Promise.all([
          vendor.phone
            ? sendSms(
                vendor.phone,
                `Payment received! Your WFF Ghana vendor package (${vendor.package_name || vendor.category}) is confirmed. - WFF Ghana`,
              )
            : Promise.resolve(),
          notifyAdmin(
            `Payment confirmed: vendor ${vendor.name} paid for their package. Ref: ${reference}.`,
          ),
          sendEmail({
            to: vendor.email,
            toName: vendor.name,
            subject: 'Your WFF Ghana vendor payment is confirmed',
            heading: 'Vendor payment received',
            paragraphs: [
              `Hi ${vendor.name}, your payment for your vendor package is confirmed.`,
              'We are reviewing your application. Once approved, you will appear in the event vendor directory.',
            ],
            details: [
              ['Package', vendor.package_name || vendor.category],
              ['Amount paid', cedis(paidAmount)],
              ['Reference', reference],
            ],
          }),
        ]).catch(() => {});
      }
      break;
    }
  }

  return { status: 'success', purpose: payment.purpose, relatedId: payment.related_id };
}

async function markRelatedFailed(
  admin: ReturnType<typeof createSupabaseAdminClient>,
  purpose: string,
  relatedId: string | null,
) {
  if (!relatedId) return;

  if (purpose === 'shop') {
    await admin.from('shop_orders').update({ payment_status: 'failed' }).eq('id', relatedId);
  } else if (purpose === 'ticket') {
    await admin.from('ticket_orders').update({ payment_status: 'failed' }).eq('id', relatedId);
  } else if (purpose === 'vendor') {
    await admin.from('vendors').update({ payment_status: 'failed' }).eq('id', relatedId);
  }
  // Registrations stay 'pending' on a failed attempt so the athlete can
  // retry without the record looking rejected.
}
