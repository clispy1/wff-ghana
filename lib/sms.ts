/**
 * Clifze SMS integration (https://www.clifze.shop). SERVER ONLY — the
 * API key must never reach the browser.
 *
 * SMS is a notification, not a critical path: a Clifze outage or
 * misconfiguration must never fail a registration, vendor application,
 * contact message or payment. Every function here swallows its own
 * errors (logs and returns) rather than throwing.
 */

const CLIFZE_SEND_URL = 'https://www.clifze.shop/api/v1/send';

function normalizeGhanaNumber(raw: string): string {
  const digits = raw.replace(/[^\d]/g, '');
  if (digits.startsWith('233')) return digits;
  if (digits.startsWith('0')) return `233${digits.slice(1)}`;
  return digits;
}

export async function sendSms(recipient: string, message: string): Promise<boolean> {
  const apiKey = process.env.CLIFZE_API_KEY;
  if (!apiKey) {
    console.error('[sms] CLIFZE_API_KEY is not configured — skipping SMS to', recipient);
    return false;
  }
  if (!recipient?.trim()) {
    console.error('[sms] no recipient number — skipping SMS:', message.slice(0, 40));
    return false;
  }

  const body = new URLSearchParams({
    api_key: apiKey,
    sender_id: process.env.CLIFZE_SENDER_ID || 'WFFGHANA',
    recipient: normalizeGhanaNumber(recipient),
    message,
  });

  try {
    const res = await fetch(CLIFZE_SEND_URL, {
      method: 'POST',
      body,
      signal: AbortSignal.timeout(8000),
    });
    const data = await res.json().catch(() => null);

    if (!res.ok || data?.status !== 'success') {
      console.error('[sms] send failed', { recipient, status: res.status, data });
      return false;
    }
    return true;
  } catch (err) {
    console.error('[sms] send error', { recipient, err });
    return false;
  }
}

/** Sends the same message to every configured admin number (comma-separated). */
export async function notifyAdmin(message: string): Promise<void> {
  const numbers = (process.env.ADMIN_NOTIFY_PHONE || '')
    .split(',')
    .map((n) => n.trim())
    .filter(Boolean);

  if (numbers.length === 0) {
    console.error('[sms] ADMIN_NOTIFY_PHONE is not configured — skipping admin notify');
    return;
  }

  await Promise.all(numbers.map((n) => sendSms(n, message)));
}
