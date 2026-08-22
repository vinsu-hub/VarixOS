---
tags: [session, handoff, protocol, workflow, continuity]
---

# Session Handoff Protocol

Standardized pattern for maintaining work continuity across sessions and machines, derived from [[Varix - Overview]] projects.

## Why It Exists

Solo full-stack delivery across multiple projects requires that work resumes correctly even when:
- Sessions are separated by days/weeks
- Different machines are used (PC ↔ laptop)
- Different AI agents handle continuation

## Handoff Document Structure

Each handoff captures:

1. **Production Status** — what's live, what's broken
2. **Pending Migrations** — DB schema changes not yet applied
3. **Known Gaps** — incomplete features, tech debt
4. **Dated Changelog** — what changed in this session
5. **Next Steps** — prioritized list for the following session

Source: [[SMFC - Overview]], [[CafeLive - Overview]]

## Session Handoff Index

All recorded handoffs:

| Date | Project | Location |
|------|---------|----------|
| 2026-08-11 | Varix Website | `D:\OBSIDIAN\Varix\Session Handoffs\` |
| 2026-08-10 | Varix Website | `D:\OBSIDIAN\Varix\Session Handoffs\` |
| 2026-08-11 | PokeCard PH | `D:\OBSIDIAN\Varix\PokeCard PH\` |
| 2026-08-11 | Mangara | `D:\OBSIDIAN\Varix\Mangara\` |
| 2026-08-06 | Veavii | `D:\OBSIDIAN\Varix\Veavii\` |
| 2026-07-29 | Istoria Coffee | `D:\OBSIDIAN\Varix\Istoria Coffee\` |
| 2026-07-22–27 | Varix (multiple) | `D:\OBSIDIAN\Varix\Session Handoffs\` |

## Workflow

1. **End of session**: Generate handoff doc with current state
2. **Start of session**: Read latest handoff for the target project
3. **Cross-project**: Check `ops/varix-open-items.md` for global blockers
4. **Daily**: `ops/today.md` captures immediate tasks, `ops/schedule.md` captures upcoming

## Related Nodes

- [[Claude Working Protocols]] — how agents should approach work
- [[Design Review Workflow]] — screenshot-first verification pattern
- [[Varix - Overview]] — company index
