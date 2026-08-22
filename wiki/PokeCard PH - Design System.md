---
tags: [pokecard-ph, design-system, tokens, motion, animation, responsive]
---

# PokeCard PH — Design System & Motion

Part of [[PokeCard PH - Overview]]. **This file outranks the reference images.** Where a mockup conflicts with a token, follow the token and flag the conflict.

## Brand Identity

Two feelings:
- **Collector-grade trust** — real money and rare cards change hands; precise, verified, calm
- **Marketplace energy** — browsing should feel light, fast, a little fun

## Color Tokens

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-primary` | `#E4002B` | Primary actions, active nav, links, focus rings |
| `--color-primary-hover` | `#C40025` | Primary button hover/active |
| `--color-primary-subtle` | `#FDECEE` | Selected rows, active tab zone, badge fills |
| `--color-ink` | `#0B0F1A` | Footer, reversed surfaces, dark chrome |
| `--color-grade-bg` | `#EEF2F6` | Grade/condition badge fill |
| `--color-grade-text` | `#334155` | Grade/condition badge text |
| `--color-bg` | `#FFFFFF` | Page/card background |
| `--color-bg-muted` | `#F9FAFB` | Page canvas behind cards |
| `--color-border` | `#E5E7EB` | Card borders, table dividers |
| `--color-text-primary` | `#111827` | Headings, primary body |
| `--color-text-secondary` | `#4B5563` | Subtext, metadata |
| `--color-text-muted` | `#6B7280` | Placeholders, disabled |

### Status Colors

| Meaning | Text | Background |
|---------|------|-----------|
| Success / Completed | `#047857` | `#D1FAE5` |
| In progress / Info | `#1D4ED8` | `#DBEAFE` |
| Attention / Warning | `#B45309` | `#FEF3C7` |
| Danger / Cancelled | `#B91C1C` | `#FEE2E2` |
| Paid / Purple | `#6D28D9` | `#EDE9FE` |
| Neutral / Shipped | `#0F766E` | `#CCFBF1` |

## Typography

| Role | Size | Weight |
|------|------|--------|
| Display | 32px | 700 |
| H2 | 24px | 600 |
| H3 | 18px | 600 |
| Body | 14px | 400 |
| Caption | 12px | 400 |
| Price/Number | inherits | 700 |

## Spacing & Layout

- Base unit 4px, scale: 4/8/12/16/24/32/48
- Card padding: 24px desktop / 16px mobile
- Radius: `8px` buttons/inputs, `12px` cards, `full` pills

## Layout Shells

- **Buyer** — top nav, full-width content, max-width 1280px
- **Vendor** — fixed left sidebar + main + right rail (slide-over below 1024px)
- **Wizards** — numbered step indicator, fields left/center, live preview pinned right

## Responsive Breakpoints

| Range | Behavior |
|-------|----------|
| `< 640px` | Single column, bottom tab bar, filters in sheet |
| `640–1023px` | Two-column grids, bottom tab bar |
| `1024–1279px` | Desktop nav, sidebars inline |
| `≥ 1280px` | Full desktop, capped at 1280px |

## Motion System

```css
--ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
--ease-out-soft: cubic-bezier(0.16, 1, 0.3, 1);
--ease-in-soft:  cubic-bezier(0.7, 0, 0.84, 0);
--duration-instant: 100ms;
--duration-fast:    180ms;
--duration-base:    250ms;
--duration-slow:    400ms;
```

**Never exceed 400ms** for UI-triggered animation. Sanctioned exceptions: order confirmation, auction win, stat count-up (~600ms), Events silhouette cross-dissolve (~800ms).

## Audio System

Sound confirms visual state changes — never carries information alone.

| Token | Moment | Phase |
|-------|--------|-------|
| `--sfx-select` | Tapping a card | 1 |
| `--sfx-cart-add` | Add to Cart | 1 |
| `--sfx-order-complete` | Order completed | 1 |
| `--ambient-storefront` | Shop storefront (ambient bed) | 1 |
| `--sfx-listing-live` | Listing published | 2 |
| `--sfx-auction-won` | Winning an auction | 4 |
| `--sfx-tier-up` | Crossing billing tier | 5 |
| `--sfx-reveal` | Events silhouette reveal | 6 |

**Rules:** Muted by default, opt-in per session. Persistent mute toggle in header. `prefers-reduced-motion` suppresses non-essential audio. One sound per event. Audio never carries information alone.

## Related Nodes

- [[PokeCard PH - Overview]] — product index
- [[PokeCard PH - Build Phases]] — phase ownership of tokens
- [[PokeCard PH - Events]] — silhouette reveal animation
- [[Brand Identity]] — parent company design standards
