import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Browser client. Uses cookie storage (not localStorage) so that
// middleware.ts can see the admin session server-side.
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
