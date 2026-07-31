import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Request-scoped Supabase client that reads the caller's session from
 * cookies. Use inside route handlers and server components to act *as
 * the logged-in user* — RLS still applies, so this is what you want for
 * anything an admin triggers from the dashboard.
 *
 * Never share the returned client between requests.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component, where cookies are
            // read-only. Middleware refreshes the session instead.
          }
        },
      },
    },
  );
}

/**
 * Returns the current user if — and only if — they are in admin_users.
 * Returns null otherwise. Route handlers should treat null as 403.
 */
export async function requireAdmin() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: adminRow } = await supabase
    .from('admin_users')
    .select('user_id, role')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!adminRow) return null;
  return { user, role: adminRow.role as string };
}
