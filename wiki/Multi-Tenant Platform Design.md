---
tags: [multi-tenant, rbac, platform-design, smfc, enterprise]
---

# Multi-Tenant Platform Design

Patterns for serving multiple organizations from a single system, derived from [[Saint Michael POS - Overview|SMFC]].

## The Challenge

5 companies × 12 real branches under one system, each requiring independent login, branding, and theming while sharing one schema and backend.

## Architecture

### Shared Schema, Isolated Data
- Single Postgres database with row-level isolation
- Branch ID as the primary tenant discriminator
- Executive-role null-branch-ID gating for cross-branch access

### Role-Based Access Control
Three tiers: employee / manager / executive
- Employee: own-branch data only
- Manager: branch-wide visibility
- Executive: cross-branch analytics

Source: [[Saint Michael POS - Overview|SMFC]]

### Multi-Theming
Each company has independent branding/theming while sharing the same codebase. Theme tokens applied per-tenant at the UI layer.

Source: [[Saint Michael POS - Overview|SMFC]]

## Real-Time Pipeline

POS → Order Queue → Kitchen Display as one continuous pipeline:
- Station-filtered columns in kitchen display
- Live stat cards and progress indicators
- Inventory-accurate order editing (partial voids/holds without double-crediting stock)
- Audio alerts: mute toggle, `useRef`-tracked previous-poll snapshot to avoid alerting on pre-existing data at first load, browser autoplay-block handling

Source: [[Saint Michael POS - Overview|SMFC]]

## Sensitive-Action Re-Authentication

Server-side PIN hash (bcrypt) verification tied to the acting logged-in account, not just a shared kiosk PIN. Used for owner's request flow and sensitive operations.

Source: [[Saint Michael POS - Overview|SMFC]]

## Idempotent Seed Data

Demo/seed data engineering for realistic testing:
- Scripts that seed real menus/pricing/attendance data
- Safe to re-run (idempotent)
- Explicitly flags placeholder data (`needs_review`) instead of fabricating numbers

Source: [[Saint Michael POS - Overview|SMFC]]

## Related Nodes

- [[Supabase RLS Patterns]] — row-level security implementation
- [[Next.js + Supabase Stack]] — the foundation
- [[Philippine Business Rules]] — statutory computation requirements
