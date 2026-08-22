---
tags: [claude, protocols, skills, workflow, ai-agent, meta]
---

# Claude Working Protocols

How Claude Code should approach work across sessions on [[Varix - Overview]] projects. Read before starting any work.

## Skills Installed

**Current count: 185** across design/UX, language/framework, architecture, and review categories.

### Design/UX Core
- **emilkowalski/skills** — animation/motion craft (GPU-only properties, sub-300ms durations, custom easing, `prefers-reduced-motion`)
- **pbakaus/impeccable** — structured frontend design review (Nielsen heuristics, WCAG audits, persona testing)
- **leonxlnx/taste-skill** — anti-slop frontend rules (eyebrow-label limits, hero layout discipline, banned defaults)
- **nextlevelbuilder/ui-ux-pro-max** — searchable design database (84 styles, 192 palettes, 74 font pairings, 98 UX guidelines)

### Language/Framework Specialists
`python-pro`, `typescript-pro`, `rust-engineer`, `nextjs-developer`, `react-expert`, `postgres-pro`, `django-expert`, `laravel-specialist`, and more.

### Architects
`api-designer`, `architecture-designer`, `microservices-architect`, `rag-architect`

### Review/Analysis
`code-reviewer`, `security-reviewer`, `spec-miner`, `debugging-wizard`

Source: `D:\OBSIDIAN\Varix\Claude Working Protocols.md`

## Workflow Rules

1. **Screenshot before making UI claims** — don't evaluate from source alone; start local server, capture screenshots, read rendered output
2. **Verify fixes the same way** — re-screenshot or Playwright check after changes
3. **Stop local servers when done** — don't leave background processes running
4. **Trace bugs to root cause before patching** — find the working sibling pattern, not just the symptom
5. **Scope fixes to what's asked** — implement exactly what was approved, don't bundle adjacent findings
6. **Report-only vs. implement are different requests** — "give me a critique" ≠ "fix X"
7. **CSS fixes can resolve multiple findings** — check if a tweak overlaps known open issues

## Project-Level Scoping

When a project has its locked design system, subordinate skills to it. Example: PokeCard PH's `CLAUDE.md` forbids `ui-ux-pro-max --design-system` to avoid generating competing tokens.

## Gotchas

- `godmode/` skills must be flattened to top level (no root `SKILL.md` in bundle)
- `ui-ux-pro-max` script paths need repointing after reinstall
- `ai-artist`/`ai-multimodal`/`chrome-devtools` dependencies don't exist locally — AI image gen paths will fail

## Related Nodes

- [[Session Handoff Protocol]] — how work continuity is maintained
- [[Design Review Workflow]] — screenshot-first verification detail
- [[Security Review Patterns]] — security-specific review
- [[Varix - Overview]] — company index
