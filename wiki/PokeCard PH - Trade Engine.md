---
tags: [pokecard-ph, trade, phase-3, meetup, schema]
---

# PokeCard PH — Trade Engine (Phase 3)

Part of [[PokeCard PH - Overview]]. Card-for-card trading with in-person meetup coordination.

## What It Is

A buyer offers cards from their personal inventory in exchange for a vendor's listed card, proposes a value-adjusted trade, and both sides coordinate an **in-person meetup** through a tracked, staged flow.

**No money moves through the platform for a pure trades.** Trades settle in person. The only monetary hook is the optional "protected trade fee" (deferred to Phase 5).

## Key Modeling Decision

A buyer's tradeable cards live in a **new `trade_cards` table**, not in `listings`. Listings belong to shops; `trade_cards` belong to individual profiles.

`trade_items` enforces asymmetry with a check constraint — `offered` side references `trade_card_id` with null `listing_id`, `requested` side the reverse.

## Schema

| Table | Notes |
|-------|-------|
| `trade_cards` | buyer's personal inventory; publicly readable when `status = 'available'` |
| `trades` | `proposer_id` + `shop_id`, status ladder, `value_difference`, meetup details |
| `trade_items` | `side` check `('offered','requested')` with XOR constraint |
| `trade_activity` | append-only log — actor, action, note, timestamp |
| `meetup_locations` | seeded manually; public read, admin-only write |

## The Status Ladder

Nine states, seven forward progress:

```
proposed → accepted → plan_created → meetup_scheduled
        → cards_verified → value_confirmed → completed
                                    (+ cancelled, declined)
```

Status advances via **Server Actions only**. Every transition writes a `trade_activity` row.

## Routes

```
/app/(buyer)/trade/page.tsx              — My Trade Cards + Build Your Trade
/app/(buyer)/trade/[tradeId]/page.tsx    — Trade detail/progress (SHARED)
/app/(vendor)/vendor/trade-requests/page.tsx
```

`/trade/[tradeId]` is **one page shared by both faces** — rendered conditionally based on `auth.uid()` matching `proposer_id` or vendor of `shop_id`.

## Screens

**Buyer Trade Hub** — My Trade Cards grid + Build Your Trade (You Offer / You Want columns), live totals, Value Difference banner, Recommended Matches sidebar.

**Trade Detail / Progress** — two-card comparison, Trade Plan stepper (7 steps), Choose Trading Location panel, Activity log, Trade Actions (Propose Adjustment, Cancel, Report).

**Vendor Trade Requests** — incoming trades filtered by status, Accept/Decline at `proposed`.

## Deliverable

End to end: buyer adds cards → builds offer → submits → vendor accepts → both choose meetup → progress through verification → completed → inventories update.

Seed ~10 `trade_cards` and 2–3 `meetup_locations`.

## Related Nodes

- [[PokeCard PH - Overview]] — product index
- [[PokeCard PH - Build Phases]] — schema context
- [[Real-Time Systems]] — Supabase Realtime for trade status
