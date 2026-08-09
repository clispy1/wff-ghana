# WFF Ghana — Admin "Mission Control" Roadmap

> Goal: the admin dashboard is mission control for the **All Africa Bodybuilding
> Championship** — every offline and online piece of the event, from planning to
> the night itself to the results people share afterwards.
>
> Saved: 8 Aug 2026 · **56 days to launch** (championship Oct 2–4, 2026).
> Status here is the *agreed* plan; work is gated — do not build until told.

---

## In production already

- [x] Dashboard overview (admin_dashboard_stats RPC)
- [x] Homepage content CMS, Gallery, News & Media
- [x] Events & Logistics, Event Schedule, Accommodations, Ticket Tiers
- [x] Athlete Registrations + Athletes Roster
- [x] Armory Shop + Orders, Payments/Paystack, Inbox, System Settings
- [x] Sponsors, Federation Staff (public-facing data)
- [x] **Event Master Plan** (phases, kanban checklists, task assignments, private design library)
- [x] **Bulk task import** — paste JSON (string list or rich objects) or CSV/TSV from Sheets into the checklists page; live preview, name resolution, duplicate + error reporting (8 Aug 2026)
- [x] **Vendors (phase 1)** — vendor directory; admin CRUD at `/admin/vendors` + public approved list at `/championship/vendors` (8 Aug 2026). `supabase_vendors.sql` run.
- [x] **Homepage: server-rendered, no defaults** — homepage data fetched on the server (sponsors, news, products, active event, home content, gallery, approved vendors); client page rendered from props; `app/loading.tsx` skeleton + per-section skeletons replace the old default/fallback copy; all content controlled from the admin dashboard.
- [x] **Vendors (phase 2): public self-registration + payment** — a vendor applies at `/championship/vendors/apply`, picks an admin-managed package (`/admin/vendor-packages`), pays online via Paystack (same ledger/webhook as shop orders), then the admin reviews it in `/admin/vendors` and flips status to approved to publish it to the public directory. Homepage + directory now link to the apply page. Run `supabase_vendor_apply.sql`.
- [x] **Homepage: section components + admin visibility toggles** — the 721-line `HomeClient.tsx` is split into one component per section under `components/home/`, composed by `HomeClient`; a `home_sections_visibility` row in `site_content` (public read / admin write via existing RLS) drives which sections render, toggled from Admin -> Homepage Content -> Section Visibility (hero always shown). Every section defaults to ON when the row is missing. A dedicated **Become a Vendor** pitch section (benefits list + apply CTA) is CMS-editable and sits right after the Event Vendors block. Run `supabase_home_sections.sql` (optional — the code defaults handle a missing row); re-run `supabase_homepage_content.sql` to seed the `home_become_vendor` content row.

## Next: approved build list (user-selected)

Then the existing "approved build list" continues.

Build order TBD. The user picked all of these but said **"don't build yet."**

- [ ] **Budget & Finance** — income (tickets, sponsorships, registrations, merch) vs expenses (venue, staging, production, judges, flights, marketing, medals); live P&L.
- [ ] **Competition Results Manager** — enter winners per division; auto-publish results to the public site.
- [ ] **Athlete Ops Board** — class/division assignment, weigh-in window, bib number, music track (audio_track_url), check-in status.
- [ ] **Gate Entry / QR Check-in** — scan ticket QR codes at the door to validate + count attendance.
- [ ] **Run-of-Show Timeline** — minute-by-minute stage board (heats, finals, presentations), separate from the public schedule.
- [ ] **VIP & Guest RSVP List** — VIPs, officials, media; confirmations, plus-ones, seating.
- [ ] **Sponsorship Tracker** — deal amounts, paid status, deliverables (logo, banners).
- [ ] **Promo Calendar** — 56-day plan: countdown posts, athlete spotlights, ticket pushes.

## Event Master Plan modifications

- [x] Bulk task import (JSON + CSV/TSV paste) — done.
- [ ] More modifications pending — user will specify.

## Notes / context

- `/federation` is the general WFF Ghana about page (board, map/stats, rulebook, competition classes). Event content lives under `/championship`: partnerships moved to `/championship/partnerships`, vendors at `/championship/vendors`.
- `app/wellness/page.tsx` was intentionally deleted (wellness section removed from federation too); all links to `/federation#wellness` removed.
- `app/partnerships/page.tsx` now redirects to `/championship/partnerships`.
- `app/federation/FederationClient.tsx` — executive board members temporarily commented out by owner; keep as-is.
- The `output: 'standalone'` in `next.config.ts` fails the final trace-copy step on this Windows/pnpm machine (EPERM symlink); the app itself compiles and all 36 pages generate. Pre-existing environment issue.
