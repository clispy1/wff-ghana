import crypto from 'crypto';

/**
 * Paystack helpers. SERVER ONLY — everything here uses the secret key.
 */

const PAYSTACK_BASE = 'https://api.paystack.co';

export type PaystackPurpose = 'registration' | 'shop' | 'ticket';

export interface PaystackVerifyData {
  status: string; // 'success' | 'failed' | 'abandoned' | ...
  reference: string;
  amount: number; // subunit (pesewas)
  currency: string;
  channel?: string;
  gateway_response?: string;
  paid_at?: string;
  customer?: { email?: string };
  metadata?: Record<string, unknown>;
}

function secretKey(): string {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) {
    throw new Error(
      'PAYSTACK_SECRET_KEY is not set. Add it to .env.local — see .env.example.',
    );
  }
  return key;
}

export function siteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
    'http://localhost:3000'
  );
}

/** Paystack works in the currency subunit. GHS 12.50 -> 1250 pesewas. */
export function toSubunit(amount: number): number {
  return Math.round(amount * 100);
}

export function fromSubunit(subunit: number): number {
  return Math.round(subunit) / 100;
}

/**
 * Reference format: WFF-<PURPOSE>-<timestamp36>-<random>. Prefixing by
 * purpose makes reconciliation in the Paystack dashboard readable.
 */
export function buildReference(purpose: PaystackPurpose): string {
  const rand = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `WFF-${purpose.toUpperCase()}-${Date.now().toString(36).toUpperCase()}-${rand}`;
}

export async function initializeTransaction(params: {
  email: string;
  amount: number; // major units
  reference: string;
  currency?: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
}): Promise<{ authorization_url: string; access_code: string; reference: string }> {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secretKey()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: params.email,
      amount: toSubunit(params.amount),
      reference: params.reference,
      currency: params.currency || 'GHS',
      callback_url: params.callbackUrl,
      metadata: params.metadata || {},
    }),
    cache: 'no-store',
  });

  const json = await res.json();
  if (!res.ok || !json.status) {
    throw new Error(json.message || 'Paystack initialization failed');
  }
  return json.data;
}

export async function verifyTransaction(
  reference: string,
): Promise<PaystackVerifyData> {
  const res = await fetch(
    `${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: { Authorization: `Bearer ${secretKey()}` },
      cache: 'no-store',
    },
  );

  const json = await res.json();
  // json.status is whether the API call worked; json.data.status is
  // whether the customer actually paid. They are not the same thing.
  if (!res.ok || !json.status) {
    throw new Error(json.message || 'Paystack verification failed');
  }
  return json.data as PaystackVerifyData;
}

/**
 * Paystack signs webhooks with HMAC SHA512 over the raw request body,
 * keyed on the secret key. Compare in constant time and always against
 * the raw text — re-serialising the parsed JSON will not match.
 */
export function isValidWebhookSignature(
  rawBody: string,
  signature: string | null,
): boolean {
  if (!signature) return false;

  const expected = crypto
    .createHmac('sha512', secretKey())
    .update(rawBody)
    .digest('hex');

  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
