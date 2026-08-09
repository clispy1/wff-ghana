import { createSupabaseAdminClient } from './supabase-admin';
import { fromSubunit, type PaystackVerifyData } from './paystack';

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
    case 'shop':
      await admin
        .from('shop_orders')
        .update({ payment_status: 'paid', paystack_ref: reference, paid_at: paidAt })
        .eq('id', payment.related_id);
      break;

    case 'ticket':
      await admin
        .from('ticket_orders')
        .update({ payment_status: 'paid', paystack_ref: reference, paid_at: paidAt })
        .eq('id', payment.related_id);
      break;

    case 'registration':
      await admin
        .from('registrations')
        .update({
          fee_paid_status: 'paid',
          payment_method: 'paystack',
          paystack_ref: reference,
          paid_at: paidAt,
        })
        .eq('id', payment.related_id);
      break;

    case 'vendor':
      await admin
        .from('vendors')
        .update({ payment_status: 'paid', paystack_ref: reference, paid_at: paidAt })
        .eq('id', payment.related_id);
      break;
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
