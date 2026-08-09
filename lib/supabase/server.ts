import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Server-only Supabase client for Server Components.
 *
 * Public pages fetch their data here (server-side, anon reads) so the
 * HTML that reaches crawlers and first paints already contains the real
 * content — never client-side `useEffect` fetches or default copy.
 */
export async function createServerSupabase() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {
          // Public pages never write cookies; admin mutations go through
          // the browser client instead.
        },
      },
    },
  );
}
