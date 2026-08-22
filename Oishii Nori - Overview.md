---
tags: [oishii-nori, client-work, project, status]
---

# Oishii Nori Command Suite

Part of [[Varix - Overview]] — a client-built platform, tracked separately from Varix's own site work. **Local codebase root:** `D:\ioshinori\oishii-nori-command-suite` (Phases 0-2 built and QA-passed as of 2026-08-21; Phase 3-7 frontend build underway). **Reference spec:** `D:\ioshinori\Oishii_Nori_Menu_Ingredients.xlsx`.

## What it is
A POS/inventory/HR prototype for **Oishii Nori** (sushi + cafe), structurally modeled on the production [[Saint Michael POS - Overview|Saint Michael Command Suite]] (same author pattern: FastAPI + Supabase + React/Vite, three-app shape) but built on **entirely fresh infrastructure** — no shared repo history, database, or credentials with SMFC. SMFC is a structural reference only, read from `D:\SMFC_POS\saint_michael_pos\saint_michael_pos` — never cloned or pulled from.

**Status: IN PROGRESS (Phases 0-2 built + QA-passed 22/22; Phase 3-7 frontend build underway, milestones 2/6 done).** Two manual steps outstanding: GitHub auth (`gh auth login`) and exposing the Supabase `hr` schema. Migration `0014` kept per user decision; subagent autonomy policy set (check-in required for destructive ops).

## Scope decisions (locked 2026-08-20)
- **Single branch, two departments** (kitchen, cafe). SMFC's `organizations`/`branches`/RLS multi-tenancy scaffolding is deliberately NOT ported — this is the single biggest schema-complexity cut versus SMFC.
- **HR/Payroll/Staff-Clock IS in scope** (not deferred). All three apps are being built: API, dashboard, staff-clock kiosk.

## Three planned apps (mirrors SMFC's shape)
- `services/api-fastapi` — FastAPI backend
- `apps/dashboard-web` — POS Terminal + Order Queue + Kitchen Display + Inventory + HR/Payroll dashboard (React + Vite)
- `apps/staff-clock` — kiosk PIN-based attendance clock-in (React + Vite), offline-queue pattern ported from SMFC's `offlineQueue.ts`

## Infra (as of 2026-08-20)
- **Vercel**: `oishii-nori-api`, `oishii-nori-dashboard`, `oishii-nori-staff-clock` created under the `vince-tamis` team scope, not yet deployed.
- **Supabase**: using a project the user provisioned directly (ref `vaagbeyvhzgvudxtwkmm`) rather than the `vinsu-tams` org — that org is capped at 2 free-tier projects (already held by "vinsu-hub's Project" and "istorya"), so a 3rd couldn't be created there without an upgrade or pause/delete. Credentials live in gitignored `.env.local` files per app, never committed. Migrations `0001`–`0015` applied live and seeded (50 products, 60 product_sizes, 73 ingredients, 294 recipe_items, 5 bundle_components).
- **GitHub repo**: blocked — `gh auth status` shows an invalid keyring token for `vinsu-hub`. Local git repo is initialized at the codebase root but has no remote yet. User needs to run `gh auth login -h github.com` before the repo can be pushed/created on GitHub.

## Reference-spec facts (from the xlsx, verified 2026-08-20 — supersede any earlier estimate)
- **50 distinct products, 60 (product, size) rows**, across 12 categories, 299 total ingredient lines, **59 flagged REVIEW**.
- **5 real kitchen stations**: Sushi Bar, Sushi Bar / Oven, Hot Line, Salad/Cold Bar, Cafe Bar (not the 3 originally assumed).
- `product_sizes` scale-factor model confirmed valid — ingredient quantities scale by one consistent factor per item across its size tiers (verified on Baked Kani Sushi: x1.9 Small→Medium, x1.184 Medium→Large across all 5 ingredients).
- 72 ingredients in Ingredient Master; 6 flagged High/Medium-High cost volatility (Salmon, Scallop, Tuna raw — High; Shrimp/Prawn raw, Angus beef, Crushed pistachio — Medium-High) — these are the ones Phase 5's cost-check nudge should target.
- 5 bundle/platter rows, all "log actual rolls used, do NOT auto-deduct proportionally at MVP." The Sushi Boat "classic flavors" question was **resolved 2026-08-21**: it excludes premium rolls (Dragon/Oishii Maki) — the `bundle_components.notes` REVIEW flag text itself is still unedited, cleanup deferred to Milestone 6 integration QA.

## Relationship to Varix
A client engagement for Varix, same author/pattern as [[Saint Michael POS - Overview|Saint Michael POS]] but a separate, unrelated deployment.

## Knowledge graph
`graphify` was run across the SMFC structural reference + the xlsx spec and merged (1,790 nodes, 4,109 edges). The per-entity notes live in **[[Graph]]** (`Oishii Nori/Graph/`), not the vault root — the first export landed ~1,983 loose notes flat in the vault root and was moved here to avoid cluttering the top level. Local build artifacts (`graph.json`, `graph.html`, `GRAPH_REPORT.md`) are at `D:\ioshinori\oishii-nori-command-suite\graphify-out\`; query with `graphify query "<question>"` from that directory.

## See also
- [[Saint Michael POS - Overview]] / [[Saint Michael POS - Capabilities]] — the structural reference this build patterns off of.
- [[Claude Working Protocols]] — durable Claude Code working notes for Varix projects generally.
