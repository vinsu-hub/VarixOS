---
tags: [design, review, ux, audit, playwright, screenshot, workflow]
---

# Design Review Workflow

Standardized approach for evaluating and improving UI across [[Varix - Overview]] projects.

## Process

### 1. Screenshot Before Claims
Don't evaluate a site from source code alone:
1. Start a local static server (`python -m http.server`)
2. Use Playwright (`webapp-testing` skill) to capture desktop + mobile screenshots
3. Read the rendered output before writing any critique

### 2. Audit Framework
For comprehensive reviews:
- **Nielsen heuristic scoring** (via `impeccable` skill)
- **WCAG-dimension audits** (contrast, keyboard nav, screen reader)
- **Persona-based testing** (different user types)
- **Anti-slop checks** (via `taste-skill` — eyebrow-label limits, hero discipline, banned defaults)

### 3. Verify Fixes the Same Way
After a CSS/JS change:
1. Re-screenshot or Playwright check
2. Verify computed styles, class toggling, `getComputedStyle`
3. Confirm pixel-identical on desktop AND mobile
4. Don't assume — verify

### 4. Design System Consistency
- Check new UI against existing design tokens
- Verify typography scale adherence
- Confirm color contrast ratios (WCAG AA minimum)
- Validate spacing rhythm

Source: `D:\OBSIDIAN\Varix\Claude Working Protocols.md`

## Tools

| Tool | Use Case |
|------|----------|
| `webapp-testing` skill | Playwright screenshots + browser automation |
| `impeccable` skill | Nielsen heuristic scoring, WCAG audit |
| `taste-skill` | Anti-slop checks, premium design validation |
| `ui-ux-pro-max` | Style/palette/font reference queries |
| `emil-design-eng` | Animation/motion craft review |

## Common Patterns Found

- **Eyebrow label overuse**: max 1 per 3 sections
- **Duplicate CTA intent**: two buttons doing the same thing
- **Hero layout violations**: max 2-line headline, CTA must not wrap
- **Banned defaults**: generic gradients, stock fonts, AI-typical patterns

## Related Nodes

- [[Claude Working Protocols]] — full workflow rules
- [[Brand Identity]] — design standards to audit against
- [[Voice & Positioning]] — copy review standards
