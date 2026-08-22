---
tags: [tessora, agent-harness, delegation, claude-code, opencode, ruflo]
---

# Tessora Agent Harness

The loop contract between Claude Code, OpenCode, and Ruflo for building [[Tessora - Overview|Tessora]].

## Roles

### Claude Code — Architect
- Plans features, reviews code, makes architecture decisions
- Writes task files in `agent-vault/tasks/` for mechanical work
- Handles anything requiring judgment: naming, security, design patterns
- Blocks tasks that are ambiguous or risky
- Verifies completed work against specifications
- Never does mechanical edits that could be delegated

### OpenCode — Executor
- Picks up pending tasks from `agent-vault/tasks/`
- Executes exactly what the task file says — no scope expansion
- Handles: scaffolding, config, boilerplate, file creation, repetitive code
- Marks tasks as `blocked` if judgment is needed
- Reports completion with diff summary in the task file
- Never makes architecture, security, or naming decisions

### Ruflo — Coordinator
- Manages shared memory across sessions (`ruflo memory store/search`)
- Routes tasks to the right agent
- Tracks progress and learns patterns
- Autopilot: re-engages idle agents when tasks remain

## Task Loop

```
Human (Vince) → sets direction, approves decisions
       ↓
Claude Code (Architect) → reads plan, writes task files
       ↓
OpenCode (Executor) → claims tasks, executes exactly
       ↓
Claude Code → reviews completed work, judges blocked tasks
       ↓
Human → reviews demo, gives next direction
```

## Task File Format

```yaml
---
id: short-slug
status: pending | claimed | in-progress | done | blocked
assignee: unassigned | claude | opencode
files:
  - path/to/file.py
created: 2026-07-22T05:10:00Z
claimed_at:
completed_at:
---

## Task
Exact description of what to change.

## Result
Filled in on completion: what changed, diff summary, any issues.
```

## Claiming Protocol

1. List every task file in `claimed` or `in-progress` status
2. Compare this task's `files:` list against each claimed task's `files:`
3. If ANY overlap → do NOT claim
4. If no overlap → claim it (set `status: claimed`, `assignee: your-identity`)
5. Save the file (this IS the lock)
6. Set `status: in-progress` and begin work

## Blocking Protocol

If a task requires judgment beyond your role:
1. Set `status: blocked`
2. Add note explaining why
3. Do NOT keep working past that point
4. Append to `log.md` noting the block

## Memory Protocol (Ruflo)

After completing meaningful work, store context:
```bash
ruflo memory store -k "tessora-<topic>" -v "<description>" --namespace project
```

Before starting work, search for relevant context:
```bash
ruflo memory search -q "<what you're looking for>" --namespace project
```

## Sync Points

| Moment | Action |
|--------|--------|
| Phase transition | Claude Code reviews all Phase N tasks before starting Phase N+1 |
| Architecture decisions | Claude Code decides, stores in memory, OpenCode reads before implementing |
| Blocking resolution | Claude Code unblocks by doing the work directly or rewriting the task |
| Binary packaging | OpenCode builds, Claude Code verifies on clean machine |

## Loop Cadence

1. Human sets direction → "Build Phase 1"
2. Claude Code reads plan, writes 8-10 task files
3. OpenCode claims and executes tasks sequentially
4. Claude Code reviews completed work
5. OpenCode fixes any review feedback
6. Claude Code marks phase complete
7. Human reviews demo, gives next direction
8. Repeat

## Related Nodes

- [[Tessora - Overview]] — product index
- [[Tessora Build Plan]] — the plan being executed
- [[Session Handoff Protocol]] — work continuity pattern
- [[Claude Working Protocols]] — general workflow rules
