---
tags: [cafelive, product, project, status]
---

# CafeLive

Part of [[Varix - Overview]]. Local project lives at `D:\CAFETEMP` (Next.js codebase, working name in the repo predates the CafeLive rebrand).

## What it is
A live, map-first way to find great coffee nearby. Cafes appear as colored pins on a soft cream globe/map, ranked by tier. Anyone can browse; shop owners claim their shop; admins keep the map honest. Social pings let visitors wave at cafes they love, and owners can reply with what's fresh.

## Tiers (core mechanic)
| Tier | Pin color | What it means |
|------|-----------|---------------|
| T1 Starter | green | standard listing: name, hours, address, photo |
| T2 Grow | blue | + description, gallery, social links, owner reply |
| T3 Featured | gold | + featured slot, larger glow, order/deal link, priority rank |

Pins rank visually: featured rise to the top, then grow, then starter. Premium Plus (add-on) and Complete Package (enterprise, standalone) are defined but not part of the first build.

## Key flows
1. **Browse** — open map, see pins by tier, tap one for the shop panel.
2. **Owner flow** — confirm ownership of a shop, edit listing, respond to pings.
3. **Status** — a shop's open/getting-ready/closed state is authoritative on the pin + panel, falling back to schedule with an "unconfirmed" cue if not explicitly set.
4. **Social ping** — tap "ping" on a cafe you love; owners see pings in their inbox and can reply.
5. **Admin** — verify shops, moderate content, handle reports, block bad actors.

## Stack
Next.js · Supabase (Auth + Postgres) · deployed on Vercel.

## Capabilities & Use Cases
**Capabilities (verified in code, not just PRODUCT.md's pitch)**
- Live map with tier-colored, status-colored pins; shop data fetched from Supabase with a 42-shop hardcoded fallback seed list if unreachable
- Real open/closed status logic: a 4-way owner toggle (Open / Closed / Temporarily Closed / Closing Soon) plus kitchen status, seat counts, and amenities
- **Social ping system** — fully wired end-to-end: request/response, live Supabase Realtime subscription, sound effect, owner dashboard badge
- **Presence + peer messaging** — live presence, consent-gated 1:1 direct messages (Instagram-style request/accept), and a persisted Global Chat
- **Owner ("Business") portal** — 12 real routes (dashboard, live-status, hours, menu, gallery, pings, analytics, reviews, notifications, settings, profile, help), shop-claim and ownership-scoped queries
- Support ticket flow (real model + Storage bucket + form)
- **Not implemented despite schema/docs implying it: no `/admin` route exists anywhere.** Reports, shop-claim requests, and chat-message reports insert correctly but nothing reads or surfaces them — they sit unreviewed in the DB
- **Mocked/UI-only:** Analytics, Reviews, Menu, and Gallery tabs in the owner portal have no backing data models yet; per-table seat layout exists in schema but has no UI; Stripe subscription billing has a session-id field but isn't wired

**Use cases**
- Coffee drinker browses the live map, filters by tier/status, views shop detail (hours, seats, amenities, today's special), pings a shop, sees other live users nearby, DMs a matched peer, or joins Global Chat
- Shop owner claims a listing, toggles live status, sets specials, manages seat/queue counts, responds to pings, edits hours (menu/gallery editing is UI-only for now)
- Admin — a `Role.ADMIN` exists in the schema (unlocks all-shops visibility) but has no dedicated moderation UI; this is the clearest gap versus the original product pitch

**Data sourcing:** the 42 seed cafes are real Luzon cafe names/coordinates pulled once via OpenStreetMap's Overpass API (`SCRAPING_PLAN.md`, `scripts/scrape-luzon-coffee.js`) — a one-time scrape, not a live pipeline.

## Relationship to Varix
A Varix product, distinct from the client cafe site [[Istoria Coffee - Overview|Istoria Coffee]] (a single-cafe marketing site) — CafeLive is a multi-cafe discovery platform.
