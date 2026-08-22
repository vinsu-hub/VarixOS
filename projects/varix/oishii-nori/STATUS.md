# Oishii Nori

## Last Session Summary
Phase 2 closed out 2026-08-21 — formal QA pass (`services/api-fastapi/scripts/qa_phase2.py`) ran live against the DB with **22/22 checks passed** (discount role-gating, transactions × discounts math, both loss-record deduction paths; `hr`/`kiosk` cleanly skipped pending schema exposure). Migration `0014` **kept** per user decision (verified additive/RLS-safe). Subagent autonomy resolved: **check-in required** for any destructive or schema-changing operation. Phase 3-7 frontend build kicked off same day (port-and-adapt from the SMFC reference): **Milestone 1** (app scaffolding + shared shell, both apps wired to the live backend) and **Milestone 2** (POS Terminal + Order Queue, verified live incl. discount/tax math and Owner's Request flow) done. Dev servers: dashboard `:3000`, staff-clock `:5174`, backend `:8000`.

## Current Phase
**IN PROGRESS** — Phase 3-7 frontend build, Milestones 2/6 done. Next: Milestone 3 (Kitchen Display — 5 real stations, rolls-used checklist as completion gate, Sushi Boat premium-roll exclusion enforced).

## Progress
```
███████████░░░░░░░░░ 56% — 5/9 units (Phases 0-2 ✓ + Frontend milestones 2/6)
```

## Key Blockers
- [ ] GitHub auth broken — needs `gh auth login -h github.com` (target remote `vinsu-hub/OishiiNori`)
- [ ] Expose `hr` schema in Supabase Dashboard → Settings → API → Exposed schemas (blocks Milestone 5 live verification)
- [ ] Ingredient stock = 0 across the board — informational, not a bug; needs first Count Stock / receiving pass before real use

## Last Updated
2026-08-21
