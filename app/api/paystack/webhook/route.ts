import { NextResponse } from 'next/server';
import { isValidWebhookSignature, verifyTransaction } from '@/lib/paystack';
import { settlePayment } from '@/lib/payments';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Paystack webhook. Register it at:
 *   Paystack Dashboard -> Settings -> API Keys & Webhooks -> Webhook URL
 *   https://your-domain.com/api/paystack/webhook
 *
 * Always returns 200 on a signed request, even for events we ignore —
 * a non-2xx makes Paystack retry for hours.
 */
export async function POST(request: Request) {
  // Must read the raw text: the signature is over the exact bytes sent.
  const rawBody = await request.text();
  const signature = request.headers.get('x-paystack-signature');

  if (!isValidWebhookSignature(rawBody, signature)) {
    console.warn('[paystack/webhook] rejected: bad signature');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  let event: { event?: string; data?: { reference?: string } };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const reference = event.data?.reference;

  if (event.event !== 'charge.success' || !reference) {
    return NextResponse.json({ received: true, ignored: event.event });
  }

  try {
    // Re-verify rather than trusting the payload's amount/status.
    const data = await verifyTransaction(reference);
    const result = await settlePayment(data);
    return NextResponse.json({ received: true, result: result.status });
  } catch (error) {
    console.error('[paystack/webhook] settle failed', reference, error);
    // 500 so Paystack retries — the transaction is real, we just failed
    // to record it.
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
  }
}
