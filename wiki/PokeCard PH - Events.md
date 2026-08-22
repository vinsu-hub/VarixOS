---
tags: [pokecard-ph, events, giveaway, gamification, phase-6, silhouette]
---

# PokeCard PH — "Who's That Pokémon?" Events (Phase 6)

Part of [[PokeCard PH - Overview]]. Vendor-hosted weekly silhouette giveaway.

## Concept

Vendor offers a gift, uploads its photo. Platform renders it as a black silhouette. Buyers guess which Pokémon. One winner drawn **uniformly at random from correct guessers** — not first-to-guess.

**Two deliberate layers of randomness:**
1. When the event goes live is randomized inside a vendor-chosen window (never exact time)
2. Who wins among correct guessers is random (knowledge, not reflexes)

## Discovery

Events appear **only in a dedicated Events tab**. Not in Home/Browse, search, or storefronts. The tab becomes its own reason to open the app.

## Schema

| Table | Notes |
|-------|-------|
| `pokemon_events` | shop, gift details, silhouette image, correct answer + aliases, window times, status, winner |
| `event_guesses` | event, user, guess text, server-computed `is_correct`, **unique (event_id, user_id)** — one guess per user |

### RLS

- `status = 'scheduled'` rows not publicly readable (prevents go-live time leak)
- User can SELECT only their own guess row (prevents crowd-copying)
- Vendors get aggregate counts via function, never raw row access

## The No-Early-Reveal Rule

After submitting: input locks, user sees "Guess submitted! Winners announced when event closes." Correctness never revealed until close. API returns only "guess recorded."

## Event Resolver (Cron, every 5 minutes)

1. **Go-live pass** — resolve random point inside window, store as `actual_start_time` (first time only — re-randomizing each pass means the event never starts)
2. **Close pass** — `live` events past `ends_at` → `closed`
3. **Winner pass** — draw uniformly at random from correct guesses. Zero correct → `winner_selected` with `winner_id = null` (gift stays with vendor)

## Screens

**Events tab** — Live Now (silhouette, countdown, guess count), Coming This Week (no hint, notify bell), Past Winners (revealed answer, masked winner, "N people guessed correctly").

**Event detail** — full silhouette, countdown, aggregate guess counter, single guess input.

**Winner announcement** — silhouette cross-dissolves to real image (~800ms, sanctioned exception to 400ms cap). Three states: Won (claim flow), Guessed right but didn't win (warm acknowledgment), Wrong/didn't play (answer + winner).

**Vendor create** — gift image, answer + aliases, guess duration, randomization window. Preview shows generated silhouette. One event per shop per week.

## Fulfillment

Winner claims through **existing Phase 1 order/shipping flow at ₱0**. Vendor fulfills through **existing Phase 2 Vendor Orders panel**. No parallel system.

## Silhouette Generation

Background-removal on upload, rendered as solid `#000000` on transparent. Deliberately not sophisticated — clean black cutout is enough.

## Audio

`--sfx-reveal` (`whos-that-pokemon.mp3`) — trim to score the 800ms cross-dissolve. Licensing caveat: this is the most visible IP surface in the product.

## Related Nodes

- [[PokeCard PH - Overview]] — product index
- [[PokeCard PH - Build Phases]] — schema context
- [[PokeCard PH - Design System]] — audio rules, motion tokens
- [[Content Moderation Patterns]] — admin review patterns
