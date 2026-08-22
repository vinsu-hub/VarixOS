---
tags: [saint-michael-pos, client-work, project, status]
---

# Saint Michael POS

Part of [[Varix - Overview]] — a client-built platform, tracked separately from Varix's own site work. **Complete codebase lives at `D:\SMFC_POS\saint_michael_pos\saint_michael_pos`** (all three apps + all 13 backend route modules, verified against its own test suite). `D:\saint_michael_pos` is an older, incomplete snapshot (dashboard-web only, no backend) — don't use it as a reference.

For deep module-by-module detail (order lifecycle, kitchen state machine, payroll engine, Malaya AI grounding, etc.), see [[Saint Michael POS - Capabilities]].

## What it is
The **Saint Michael Command Suite** — a custom-built, multi-tenant restaurant/hospitality operations platform for **Saint Michael Food OPC**, covering POS, inventory, HR/payroll, and executive analytics across **5 companies and 12 physical branches** (Danielito's Home Kitchen, Malaya's Cafe, The Den, D'Venue Events Place, Isabela's Signature Caterer). It is a real, production-deployed system — not a prototype — in active daily use.

It replaces spreadsheets, paper time cards, manual payroll, and phone-call stock coordination with one system that gives employees a branch-specific POS/kiosk clock-in, managers full branch operational control, and executives a consolidated real-time view plus an AI assistant ("Malaya AI") that answers business questions in plain language.

## Three deployed apps
- **`services/api-fastapi`** — single backend (FastAPI/Python) serving all three frontends, 13 route modules (branches, discounts, hr, inventory, inventory_movements, kiosk, loss_records, malaya, products, recipes, stock_requests, summary, transactions, transfers, utility)
- **`apps/dashboard-web`** — employee POS terminal + manager/executive dashboard (React 19 + Vite + shadcn/ui), 20 pages
- **`apps/staff-clock`** — kiosk PIN-based attendance clock-in/out with a localStorage-backed offline queue (`offlineQueue.ts`)

## Stack
FastAPI (Python 3.11+) · Supabase (Postgres, Auth, Storage, Realtime, RLS) · Groq (`llama-3.3-70b-versatile`) for Malaya AI · ReportLab for payslips · React 19 + TypeScript + Vite 7 + Tailwind 4 + shadcn/ui (Radix) · Recharts · Framer Motion · deployed on Vercel, repo `vinsu-hub/SMFC-POS`.

## Multi-tenant model
Each branch has its own theme (colors/typography/logo) so the POS feels brand-specific rather than generic. Inventory, transactions, employees, and attendance are scoped independently per branch at the database level via Row Level Security.

## Capabilities & Use Cases (summary — see [[Saint Michael POS - Capabilities]] for full detail)
- **POS / Order Queue / Kitchen Display** — full order lifecycle with a strict forward-only kitchen state machine, live recipe-based stock deduction per sale, server-verified discounts, PIN-reverified owner's-request comps
- **Inventory & cross-branch stock** — count-and-reconcile, manual movements, a two-layer transfer/request-and-fulfill workflow between branches
- **HR / Payroll / Attendance** — a real DOLE-style pay engine (regular/OT/night-diff/holiday pay, configurable multiplier rules), auto-close safety net for abandoned shifts, PDF payslips, and a PIN-based offline-capable kiosk clock-in
- **Executive Analytics** — live-computed (not mocked) revenue/COGS/margin/loss aggregation per branch and org-wide
- **Malaya AI** — a Groq-backed assistant grounded in deterministic SQL aggregates (not RAG), scoped by role (branch for managers, org-wide for executives)
- **Loss tracking, discounts, utility logging, branch theming** — all backed by real, branch-scoped API routes

**Use cases by role**
- **Employee/cashier** — rings up orders, applies discounts, flags owner's-request orders, counts stock, logs losses, clocks in/out via kiosk
- **Branch Manager** — reviews branch revenue/COGS/margin, HR attendance and payroll overrides, uses Malaya AI scoped to their branch
- **Executive** — views org-wide rollups, configures pay-multiplier rules, queries Malaya AI org-wide

**Roles in code:** `employee`, `manager`, `executive` — enforced server-side via `require_branch_access` in `app/auth.py`, not just UI-level gating.

## Relationship to Varix
A client engagement for Varix — a real, multi-brand hospitality operations platform, distinct from Varix's own product line ([[Tessora - Overview|Tessora]], [[Veavii - Overview|Veavii]], [[CafeLive - Overview|CafeLive]]).
