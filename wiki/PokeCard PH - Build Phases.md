---
tags: [pokecard-ph, schema, supabase, phases, roadmap, rls]
---

# PokeCard PH — Build Phases & Schema

Part of [[PokeCard PH - Overview]].

## Phase Ladder

| Phase | Scope | Status |
|-------|-------|--------|
| **1** | Buyer core loop — Home/Browse, Card Detail, Cart, Checkout, Order Tracking. Seed 20 cards / 3 shops. | Built |
| **1b** | Auth & Google Sign-In — real Supabase Auth, OAuth, `handle_new_user` trigger, soft-gate modal | Built |
| **2** | Vendor core loop — onboarding, Dashboard, Add Listing wizard, All Listings, Vendor Orders | Built |
| **3** | Trade engine — Buyer Trade Hub, shared trade detail, vendor Trade Requests | Built |
| **4** | Auctions & bidding — first hard Supabase Realtime dependency | Built |
| **5** | Monetization — tiered billing, growth surcharge, trial logic, Xendit invoicing | Not built |
| **6** | "Who's That Pokémon?" events — vendor-hosted weekly silhouette giveaway | Not built |
| **7** | Scan & 3D — capture wizard + 3D viewer (spec divergence from built feature) | Not built |
| **8** | Messaging & Notifications | Not built |
| **9** | Search autocomplete, legal pages, 404, empty-state audit, loading skeletons | Not built |

### Phase Discipline

**Do not build a later phase's tables or UI while working an earlier one**, even when a screenshot's sidebar shows the feature. Stub the nav link, leave the page unbuilt, come back when its phase starts.

## Base Schema (Phase 1 — 13 tables, RLS on every one)

| Table | Purpose |
|-------|---------|
| `profiles` | `id` → `auth.users`, `role` check `('buyer','vendor')`, display name, avatar |
| `shops` | vendor storefront — name, logo, tier, rating, review/follower counts |
| `cards` | **shared catalog reference data** — one Charizard row, many listings pointing at it |
| `listings` | shop's instance of a card — grading, price, photos, status |
| `orders` | buyer purchase — subtotal, shipping, platform fee, total, payment, status |
| `order_items` | line items with `shop_id` and `price_at_purchase` |
| `trades`, `trade_items` | see [[PokeCard PH - Trade Engine]] |
| `conversations`, `messages` | buyer ↔ shop threads, Supabase Realtime |

### Key Modeling Choice

The `cards` table being shared reference data (not per-listing) is what makes cross-vendor search, price history, and trade matching by `card_id` overlap possible.

## Per-Phase Schema Additions

- **Phase 2** — shop columns: `banner_url`, `description`, `positive_feedback_pct`, `avg_response_time`
- **Phase 3** — `trade_cards`, `trade_activity`, `meetup_locations`
- **Phase 4** — `auctions`, `bids`, `auction_watchers`; `listings.card_id` becomes nullable
- **Phase 5** — `billing_config`, `vendor_payouts`; shop trial/billing columns
- **Phase 6** — `pokemon_events`, `event_guesses`
- **Phase 1b** — `handle_new_user()` trigger on `auth.users`

## RLS Policy Intent

- `profiles` — read/update own row only
- `shops` — public read; vendor updates only their own
- `listings` — public read where `status = 'active'`; vendor CRUDs only their own
- `orders` — buyer reads own; vendor reads only `order_items` matching their `shop_id`
- `trades` — readable/writable only by proposer or shop's vendor
- `messages` — readable only by conversation participants

## Deployment

Each phase deploys to the same Vercel project. Migrations in `/supabase/migrations`, applied via `supabase db push`.

## Related Nodes

- [[PokeCard PH - Overview]] — product index
- [[PokeCard PH - Auth]] — Phase 1b detail
- [[PokeCard PH - Trade Engine]] — Phase 3 detail
- [[PokeCard PH - Auctions]] — Phase 4 detail
- [[PokeCard PH - Monetization]] — Phase 5 detail
- [[PokeCard PH - Events]] — Phase 6 detail
- [[Supabase RLS Patterns]] — RLS implementation
