<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# WFF Ghana

Next.js App Router site for the World Fitness Federation Ghana and the 2026
All Africa Bodybuilding Championship. Supabase for data/auth/storage,
Paystack for payments, Tailwind v4.

## Project-specific notes

- `proxy.ts` (was `middleware.ts` before Next.js 16) gates `/admin/*`. It
  verifies the session with `getUser()` — never `getSession()` — and checks
  `admin_users` membership. Runs on the nodejs runtime.
- Four Supabase clients, deliberately distinct — do not collapse them:
  - `lib/supabase.ts` — browser, cookie storage so `proxy.ts` can see the session
  - `lib/supabase-server.ts` — request-scoped as-the-user, plus `requireAdmin()`
  - `lib/supabase/server.ts` — anon reads for public Server Components
  - `lib/supabase-admin.ts` — service role, server only, bypasses RLS
- Public pages are server-rendered from Supabase with no hardcoded fallback
  copy. All content is admin-controlled from `/admin`.
- Payments funnel through `settlePayment()` in `lib/payments.ts`, which is
  idempotent across the Paystack callback and webhook.
- Schema lives in the `supabase_*.sql` files, applied by hand — there is no
  migration tool.
- `MISSION_CONTROL.md` is the roadmap of record. Modules listed under
  "Next: approved build list" are explicitly gated — do not build them
  unless asked.
