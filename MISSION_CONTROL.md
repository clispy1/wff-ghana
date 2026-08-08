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

## Next: approved build list (user-selected)

Build order TBD. The user picked all of these but said **"don't build yet."**

- [ ] **Budget & Finance** — income (tickets, sponsorships, registrations, merch) vs expenses (venue, staging, production, judges, flights, marketing, medals); live P&L.
- [ ] **Competition Results Manager** — enter winners per division; auto-publish results to the public site.
- [ ] **Athlete Ops Board** — class/division assignment, weigh-in window, bib number, music track (audio_track_url), check-in status.
- [ ] **Gate Entry / QR Check-in** — scan ticket QR codes at the door to validate + count attendance.
- [ ] **Run-of-Show Timeline** — minute-by-minute stage board (heats, finals, presentations), separate from the public schedule.
- [ ] **VIP & Guest RSVP List** — VIPs, officials, media; confirmations, plus-ones, seating.
- [ ] **Sponsorship Tracker** — deal amounts, paid status, deliverables (logo, banners).
- [ ] **Promo Calendar** — 56-day plan: countdown posts, athlete spotlights, ticket pushes.
- [ ] **Vendors** — vendor directory + managing them from the admin dashboard (added by request; pages/spec TBD).

## Event Master Plan modifications

- [x] Bulk task import (JSON + CSV/TSV paste) — done.
- [ ] More modifications pending — user will specify.

## Notes / context

- `app/wellness/page.tsx` was intentionally deleted by the owner (removed from nav too).
- `app/federation/FederationClient.tsx` — executive board members temporarily commented out by owner; keep as-is.
- The `output: 'standalone'` in `next.config.ts` fails the final trace-copy step on this Windows/pnpm machine (EPERM symlink); the app itself compiles and all 36 pages generate. Pre-existing environment issue.
