import { NextResponse } from 'next/server';
import { verifyTransaction, siteUrl } from '@/lib/paystack';
import { settlePayment } from '@/lib/payments';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Where Paystack sends the customer back to after checkout.
 *
 * Landing here proves nothing on its own, so we call Verify before
 * treating the order as paid. The webhook is the authoritative path
 * (it fires even if the customer closes the tab); this exists so the
 * customer sees the right screen immediately.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const reference = url.searchParams.get('reference') || url.searchParams.get('trxref');

  const redirect = (params: Record<string, string>) =>
    NextResponse.redirect(
      `${siteUrl()}/payment/status?${new URLSearchParams(params).toString()}`,
    );

  if (!reference) {
    return redirect({ status: 'error', message: 'Missing payment reference.' });
  }

  try {
    const data = await verifyTransaction(reference);
    const result = await settlePayment(data);

    if (result.status === 'ignored') {
      return redirect({
        status: 'error',
        reference,
        message: 'We could not match this payment to an order.',
      });
    }

    return redirect({
      status: result.status,
      reference,
      purpose: result.purpose || '',
    });
  } catch (error) {
    console.error('[paystack/callback]', error);
    return redirect({
      status: 'error',
      reference,
      message: 'We could not confirm this payment. Contact support with your reference.',
    });
  }
}
