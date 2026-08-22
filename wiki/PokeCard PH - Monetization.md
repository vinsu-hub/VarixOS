---
tags: [pokecard-ph, billing, monetization, phase-5, xendit, gmv]
---

# PokeCard PH — Monetization (Phase 5)

Part of [[PokeCard PH - Overview]]. Implements the pricing strategy from [[PokeCard PH - Business Model]].

## What It Is

Vendor billing system: **60-day free trial → GMV-tiered monthly subscription → growth surcharge → Xendit invoicing → payouts**.

Scope: vendor billing only. Sponsored search, ads, featured listings, Buyer Pro are out.

## The Tier Ladder

Stored as editable rows in `billing_tiers` — retune pricing by editing the table, no redeploy.

| GMV range (₱) | Base fee (₱) | Overage |
|---------------|-------------|---------|
| 0 – 5,000 | 275 | — |
| 5,001 – 15,000 | 800 | — |
| 15,001 – 30,000 | 1,500 | — |
| 30,001 – 50,000 | 2,300 | — |
| 50,001 – 100,000 | 4,200 | — |
| 100,001 – 200,000 | 7,600 | — |
| 200,001 – 350,000 | 12,000 | — |
| 350,001 – 500,000 | 17,000 | — |
| 500,001+ | 17,500 | 3% of GMV above 500K |

**Growth surcharge:** if month-over-month GMV growth exceeds 25%, add 2% of the increase on top of the tier fee. Config-driven via `billing_config`.

## Schema

`shops` gains: `trial_ends_at`, `trial_gmv_cap` (default 5000), `trial_gmv_used`, `onboarded_at`, `billing_status` check `('trial','active','past_due','restricted')`.

| Table | Purpose |
|-------|---------|
| `billing_tiers` | the ladder; public read, service-role write |
| `billing_config` | growth threshold and surcharge rate |
| `vendor_gmv_history` | monthly GMV snapshot per shop |
| `vendor_monthly_billing` | invoice — gmv, tier fee, surcharge, amount due, Xendit refs |
| `vendor_payouts` | amount, method, status, reference |

**RLS:** vendors SELECT only their own. **No client-side INSERT/UPDATE** — written exclusively by server-side functions.

## Scheduled Jobs

**`gmv-aggregator`** (nightly) — sums completed order items + trade value per shop. Upserts into `vendor_gmv_history`. For trial shops: increments `trial_gmv_used`, ends trial early if cap exceeded.

**`monthly-invoicer`** (1st of month) — trial shops get `waived_trial` row; otherwise resolve bill, insert pending row, call Xendit Invoice API, notify vendor.

**`trial-reminder`** (daily) — finds shops 7 or 1 days from trial end, projects first bill, sends in-app + email.

**`invoice-webhook`** — on payment confirmation: set `paid` + `paid_at`. Overdue → `past_due` → `restricted` after grace period.

## Restricted State

If `billing_status = 'restricted'`: block Add Listing and Create Auction. **Existing live listings stay visible to buyers** — don't punish buyers for a vendor's unpaid invoice.

## Audio

`--sfx-tier-up` on crossing a billing tier. Be deliberate: a tier increase means the bill went up — if the framing can't read as honestly about growth, drop the cue.

## Related Nodes

- [[PokeCard PH - Overview]] — product index
- [[PokeCard PH - Business Model]] — pricing strategy
- [[PokeCard PH - Build Phases]] — schema context
