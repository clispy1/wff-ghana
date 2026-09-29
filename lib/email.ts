/**
 * Brevo transactional email (https://www.brevo.com). SERVER ONLY — the
 * API key must never reach the browser.
 *
 * Like SMS, email is a notification, not a critical path: a Brevo outage
 * or missing key must never fail a registration, order or payment. Every
 * function here logs and returns rather than throwing.
 *
 * Needs a REST API key (starts with `xkeysib-`). The `xsmtpsib-` SMTP key
 * from the same Brevo page is for SMTP relay and is rejected here.
 */

const BREVO_SEND_URL = 'https://api.brevo.com/v3/smtp/email';

export interface EmailMessage {
  to: string | null | undefined;
  toName?: string | null;
  subject: string;
  /** Big heading at the top of the email. */
  heading: string;
  /** Body paragraphs, plain text — escaped before going into the HTML. */
  paragraphs: string[];
  /** Label/value rows shown in a summary box (order details etc.). */
  details?: [string, string][];
}

const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function renderHtml({ heading, paragraphs, details }: EmailMessage): string {
  const rows = (details ?? [])
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 0;color:#6b665e;font-size:13px">${escape(label)}</td>` +
        `<td style="padding:6px 0;text-align:right;font-weight:bold;font-size:13px">${escape(value)}</td></tr>`,
    )
    .join('');

  return `<!doctype html><html><body style="margin:0;background:#F6F4EF;font-family:Arial,Helvetica,sans-serif;color:#16130F">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F6F4EF;padding:32px 16px"><tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden">
<tr><td style="height:4px;background:linear-gradient(90deg,#CE1126,#FCD116,#006B3F);background-color:#FCD116"></td></tr>
<tr><td style="padding:32px">
<p style="margin:0 0 8px;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#CE1126;font-weight:bold">WFF Ghana</p>
<h1 style="margin:0 0 20px;font-size:26px;line-height:1.2">${escape(heading)}</h1>
${paragraphs.map((p) => `<p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#3d3830">${escape(p)}</p>`).join('')}
${rows ? `<table width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;border-top:1px solid #eee;border-bottom:1px solid #eee">${rows}</table>` : ''}
</td></tr>
<tr><td style="padding:16px 32px;background:#EEEBE4;font-size:12px;color:#6b665e">World Fitness Federation Ghana · 2026 All Africa Bodybuilding Championship</td></tr>
</table></td></tr></table></body></html>`;
}

function renderText({ heading, paragraphs, details }: EmailMessage): string {
  const rows = (details ?? []).map(([l, v]) => `${l}: ${v}`);
  return [heading, '', ...paragraphs, ...(rows.length ? ['', ...rows] : []), '', '- WFF Ghana'].join('\n');
}

export async function sendEmail(message: EmailMessage): Promise<boolean> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.error('[email] BREVO_API_KEY is not configured — skipping email to', message.to);
    return false;
  }
  if (apiKey.startsWith('xsmtpsib-')) {
    console.error('[email] BREVO_API_KEY is an SMTP key (xsmtpsib-). Create an API key (xkeysib-) in Brevo -> SMTP & API -> API Keys.');
    return false;
  }
  const to = message.to?.trim();
  if (!to) {
    console.error('[email] no recipient address — skipping:', message.subject);
    return false;
  }

  try {
    const res = await fetch(BREVO_SEND_URL, {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          email: process.env.EMAIL_FROM || 'admin@wffghana.com',
          name: process.env.EMAIL_FROM_NAME || 'WFF Ghana',
        },
        to: [{ email: to, ...(message.toName ? { name: message.toName } : {}) }],
        subject: message.subject,
        htmlContent: renderHtml(message),
        textContent: renderText(message),
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      console.error('[email] send failed', { to, status: res.status, data });
      return false;
    }
    return true;
  } catch (err) {
    console.error('[email] send error', { to, err });
    return false;
  }
}

/** GHS 1,200.00 — plain "GHS" rather than ₵, which some mail clients mangle. */
export const cedis = (amount: number | string | null | undefined) =>
  `GHS ${Number(amount ?? 0).toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
