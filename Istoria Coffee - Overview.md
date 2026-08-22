---
tags: [varix, client-work, istoria, project, status, graphify]
---

# Istoria Coffee

Part of [[Varix - Overview]] — a client website build, tracked separately from Varix's own
[[Website Project]]/[[Website Variant (Static Build)]]. See also [[Istoria Coffee - Architecture Map]].

## What it is
Marketing site + ordering info + a community "Freedom Wall" guestbook for a cafe called Istoria
Coffee (Bay, Laguna), now with a full admin panel (`/login` → `/admin`, hidden from public nav)
for menu management, Freedom Wall moderation, and a moderated customer-photo/comment feature at
`/community`. Local project lives at `D:\istoria2`.

## Capabilities & Use Cases
**Capabilities**
- Public menu browsing (`/menu`) with hot/iced split pricing and add-ons, fetched live from Supabase rather than a static file
- Order routing to GrabFood/foodpanda — no on-site cart or payment, just deep links
- Freedom Wall ("Kwentuhan Wall") guestbook — short public text notes, no pre-approval, one post per device per day, profanity-filtered
- Community photo/comment submissions — held `pending` until admin approval before appearing publicly
- Admin panel (`/login` → `/admin`, hidden from public nav, Supabase Auth + `admin_users` allowlist): Freedom Wall moderation (view/delete notes), Community moderation (approve/reject queue), menu CRUD (items and prices, not yet categories)

**Use cases**
- Customer checks the live drinks/food menu and pricing before visiting or ordering
- Customer orders delivery via GrabFood/foodpanda through the site's links
- Customer shares a short public note on the Freedom Wall, or submits a photo/comment to the Community page
- Cafe staff/owner logs in to moderate wall notes and community submissions and update menu items/prices without a code deploy

## Stack
- **Framework:** Vite + React 19, TypeScript
- **Routing:** wouter
- **Styling:** Tailwind, Radix UI primitives, shadcn-style `components/ui`
- **Backend:** Express (local dev) + Vercel serverless functions (`/api`) — every resource
  (notes/menu/submissions/admin-auth) has one shared transport-agnostic module plus a thin
  adapter per runtime (Vercel handler, Express route, Vite dev-middleware plugin)
- **Auth:** Supabase Auth (email+password), admin status checked server-side against an
  `admin_users` allowlist table on every admin API call — no public signup
- **Data:** Supabase Postgres — `freedom_wall_notes` (falls back to Upstash Redis, then a local
  JSON file, if env vars aren't configured — see `supabase/freedom_wall.sql`), plus
  `menu_categories`/`menu_items` and `community_submissions` (Supabase-only, no fallback tier —
  see `supabase/admin_and_menu.sql`). No staging project — local dev and production share the
  same real Supabase project (`kdvypyeggfytmnnpeaja`, "istorya").
- **Deployment:** Vercel — `vince-tamis/istoria`, production domain `istoria-vince-tamis.vercel.app`
  (alias `istoria-dusky.vercel.app`) — publicly reachable as of 2026-07-29 (Deployment Protection
  disabled)
- **GitHub:** `https://github.com/vinsu-hub/istoria-coffee` (replaced an old Next.js build of the
  same site as a new commit on top of existing history — not force-pushed)

## Design direction
Selected approach from `ideas.md`: **"Warm Minimalism" — Wabi-Sabi Editorial.** Japanese wabi-sabi
meets indie cafe zine culture — warm off-white backgrounds (`#F5F0EB`), deep charcoal text
(`#2A2520`), espresso-brown accents (`#4A3728`), honey-wood and butter-cream secondary tones.
Quiet confidence over loud branding; scroll-driven narrative; paper-texture overlays; a
sticky-note aesthetic for the Freedom Wall. Two other directions ("Noir Coffee House" dark-luxury,
"Barangay Modern" Filipino-contemporary) were considered and not selected.

## Structure
```
client/src/
  pages/          Home, Menu, Board (Freedom Wall), Contact, Order, Community, Login, NotFound
                  admin/  AdminLayout (tabbed shell), AdminNotes, AdminMenu, AdminCommunity
  components/     Hero, Nav, Footer, MenuGrid/MenuCard, SocialGrid, LocationMap, CommunityPreview,
                  Board/ (Freedom Wall UI), Reveal (scroll fade-in), ui/ (shadcn primitives)
  hooks/          useDeviceId, useCanPostToday, useInView, useComposition, useMenu
  lib/            frames.ts (hero scroll animation), supabase.ts (real client), useAdminSession.ts
  data/menu.json  legacy seed source for the menu migration — no longer read at runtime
server/
  index.ts        Express app (local dev / non-Vercel prod)
  notes.ts        Freedom Wall — Supabase → Redis → JSON fallback chain, incl. deleteNote()
  adminAuth.ts    requireAdmin() — the real security boundary on every admin endpoint
  menu.ts         Menu CRUD, Supabase-only
  submissions.ts  Community submissions CRUD + moderation, Supabase-only
api/              notes.ts, admin-notes.ts, menu.ts, admin-menu.ts, submissions.ts,
                  admin-submissions.ts — thin Vercel adapters over the server/*.ts modules
supabase/         freedom_wall.sql, admin_and_menu.sql (admin_users, menu_*, community_submissions)
```
`Login`/`AdminLayout` are lazy-loaded in `App.tsx` — see the 2026-07-29 handoff for why that
matters (a Supabase-client bug there previously took down the *entire* site).

## Status (as of 2026-07-29)
Deployed and working, including the full admin panel — see
[[Session Handoff - 2026-07-29]] for the build, the bugs found/fixed, and verification steps.
Open items (full detail in `D:\istoria2\SESSION_HANDOFF.md`):
- [ ] Finish wiring the `Reveal` scroll-fade-in component into `Menu.tsx`, `Board.tsx`,
      `Contact.tsx`, `Order.tsx` (only `Home.tsx` has it so far — carried over from 2026-07-28)
- [ ] Reconcile the address text shown on the site vs. `menu.json`'s meta address
- [ ] Dead Upstash/Redis code path in `server/notes.ts` could be removed for cleanliness
- [ ] `www.istoria.site` custom domain still not purchased/pointed at Vercel
- [ ] No staging Supabase project — local dev and prod share the same real database
- [ ] `menu_categories` aren't admin-editable yet, only items are

**How to apply:** when picking this project back up, check `D:\istoria2\SESSION_HANDOFF.md` and
`git log` first — this note is a snapshot, not the live source of truth.
