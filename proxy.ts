import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Server-side gate for the admin dashboard.
 *
 * The client-side redirect in app/admin/(dashboard)/layout.tsx only
 * hides the UI; this runs before the page is ever served, and it checks
 * membership in admin_users rather than merely "is logged in".
 *
 * Named `proxy` (was `middleware` before Next.js 16). Runs on the
 * nodejs runtime, which is the only runtime `proxy` supports.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // getUser() revalidates the token with Supabase — do not swap this for
  // getSession(), which trusts whatever cookie the browser sent.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === '/admin/login';

  let isAdmin = false;
  if (user) {
    const { data: adminRow } = await supabase
      .from('admin_users')
      .select('user_id')
      .eq('user_id', user.id)
      .maybeSingle();
    isAdmin = !!adminRow;
  }

  if (!isAdmin && !isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    // Signed in but not on the admin list — say so rather than looping.
    url.searchParams.set('error', user ? 'forbidden' : 'unauthenticated');
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  if (isAdmin && isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = request.nextUrl.searchParams.get('next') || '/admin';
    url.search = '';
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*'],
};
