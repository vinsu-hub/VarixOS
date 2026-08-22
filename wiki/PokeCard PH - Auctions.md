---
tags: [pokecard-ph, auctions, bidding, phase-4, realtime, schema]
---

# PokeCard PH — Auctions & Bidding (Phase 4)

Part of [[PokeCard PH - Overview]]. The third sale mode — for rare cards, sealed packs, signed/merch items.

**First phase where Supabase Realtime is a hard requirement.** Bid counts and timers must update without refresh.

## Schema

`listings` gains `sale_type` check `('fixed','auction')` and `item_category` check `('card','sealed_pack','sealed_box','merch','signed_item')`. **`listings.card_id` must become nullable** — sealed product and merch have no catalog card.

| Table | Notes |
|-------|-------|
| `auctions` | one-to-one with listing. Starting bid, increment, reserve, Buy It Now, current bid, counts, start/end time, status |
| `bids` | auction, bidder, amount, `max_proxy_amount`, `is_auto_bid` |
| `auction_watchers` | composite PK on (auction, user) |

### Critical RLS

`bids` SELECT is public for `amount`, `created_at`, masked bidder identity — but `max_proxy_amount` is readable **only by that bidder**. Exposing proxy maximums breaks the auction mechanic.

## Server-Side Logic

**Bid placement** (`/api/auctions/[id]/bid`):
1. Lock the auction row (prevent races)
2. Validate: status `live`, amount ≥ `current_bid + bid_increment`, bidder is not the vendor
3. Resolve proxy bidding server-side — highest max wins, pays minimum to beat second-highest
4. Insert bid; update `current_bid`, `bid_count`
5. **Anti-snipe:** if `now() > end_time - 2 minutes`, extend `end_time` by 2 minutes

**Auction closer** (`/api/auctions/close`, every minute):
- `scheduled` past `start_time` → `live`
- Expired `live` with no bids/reserve not met → `ended_unsold`
- Expired `live` with bids and reserve met → `ended_sold`, create pending `orders` row, 48-hour confirm window

## Screens

**Auctions Browse** — reuses Home/Browse grid filtered to `sale_type = 'auction'`. Shows current bid, bid count, countdown, category badge.

**Auction Detail** — current bid + countdown (live via Realtime), Place Bid, Set Max Bid (proxy), Buy It Now, Watch/Unwatch, Bid History with masked identities, Reserve status (never reveal amount).

**Vendor: Create Auction** — extends Add Listing wizard. Sale Type toggle at Step 1; auction-specific fields at Step 2.

**Vendor Auctions Panel** — Active/Ended tabs. Cancel enabled only while `bid_count = 0`.

## Audio

`--sfx-auction-won` (~2s trimmed) — longest permitted SFX. **Live bid updates get no sound** — they're Realtime-driven, not user-triggered.

## Deliverable

Vendor creates auction → buyers browse/bid/watch → live updates → win by highest bid or Buy It Now → checkout through Phase 1 flow. Anti-snipe and reserve verified. Seed 3 auctions.

## Related Nodes

- [[PokeCard PH - Overview]] — product index
- [[PokeCard PH - Build Phases]] — schema context
- [[Real-Time Systems]] — Supabase Realtime patterns
- [[PokeCard PH - Design System]] — audio rules
