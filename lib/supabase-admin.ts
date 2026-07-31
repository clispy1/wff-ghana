import { createClient } from '@supabase/supabase-js';

/**
 * Service-role client. Bypasses RLS entirely.
 *
 * SERVER ONLY — never import this from a component that ships to the
 * browser. It is used for writes the public must not be able to forge:
 * creating orders, recording payments, flipping payment_status after a
 * verified Paystack callback.
 */
export function createSupabaseAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is not set. Add it to .env.local — see .env.example.',
    );
  }

  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
