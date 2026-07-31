import { NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const { name, email, phone, subject, message, website } =
      (await request.json()) as Record<string, string | undefined>;

    // Honeypot: real users never fill a hidden field.
    if (website) {
      return NextResponse.json({ ok: true });
    }

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: 'Name, email and message are required.' },
        { status: 400 },
      );
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'That email address looks invalid.' }, { status: 400 });
    }
    if (message.length > 5000) {
      return NextResponse.json({ error: 'Message is too long.' }, { status: 400 });
    }

    const admin = createSupabaseAdminClient();
    const { error } = await admin.from('contact_messages').insert({
      name: name.trim().slice(0, 200),
      email: email.trim().slice(0, 200),
      phone: phone?.trim().slice(0, 50) || null,
      subject: subject?.trim().slice(0, 200) || null,
      message: message.trim(),
      status: 'new',
    });

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[contact]', error);
    return NextResponse.json(
      { error: 'Could not send your message. Please try again.' },
      { status: 500 },
    );
  }
}
