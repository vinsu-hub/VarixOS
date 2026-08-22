# CLAUDE.md — Obsidian Command Center

## Purpose

This vault is the operational nerve center for Vince Daniel P. Tamis's work across Varix and its portfolio of projects. It is a **work-only** vault — no personal content (songwriting, workouts, etc.).

## Folder Structure

| Folder | Purpose | What lives here | What doesn't |
|--------|---------|-----------------|--------------|
| `content/` | Finished deliverables | Final blog posts, client-ready docs, published work | WIP (→ `projects/`), raw research (→ `wiki/`) |
| `daily-notes/` | Daily work logs | One file per date, quick notes, blockers, wins | Structured plans, finished docs |
| `inbox/` | Unsorted captures | Quick captures, links, ideas before filing | Anything already filed |
| `ops/` | Recurring operational docs | `metrics.md`, `schedule.md`, `headlines.md`, `varix-open-items.md` | Project-specific work, raw research |
| `projects/` | All active work by domain | Plans, roadmaps, session handoffs, STATUS.md per project | Raw research, finished deliverables |
| `system/` | Vault config and automations | Skill definitions, automation configs, plugin notes | Project work |
| `wiki/` | Knowledge base | Raw research (`wiki/raw/`), synthesized playbooks | Project plans, finished deliverables |
| `_archive-vault/` | Retired content | Archived projects, deprecated specs | Active work |

## Navigation Rule

**Always check the nearest `_index.md` before searching a folder manually.** Each folder has one.

## Filing Conventions

New content gets filed based on type:

- **Raw research** → `wiki/raw/` (if relevant to a knowledge base)
- **Deliverables** → `projects/<name>/output/` or `content/`
- **Recurring ops** → `ops/`
- **Quick captures** → `inbox/` (file within 48 hours)

### Per-domain project paths

| Domain | Path |
|--------|------|
| Varix (parent) | `projects/varix/` |
| Oishii Nori (client) | `projects/varix/oishii-nori/` |
| SSA | `projects/ssa/` |
| SMFC Command Suite | `projects/smfc/` |
| Tessora | `projects/tessora/` |
| Veavii | `projects/founder/veavii/` |
| CafeLive | `projects/founder/cafelive/` |
| Mangara | `projects/founder/mangara/` |
| PokeCard PH | `projects/founder/pokecard-ph/` |
| BeautyBooth | `projects/founder/beautybooth/` |
| Kabiyahe | `projects/founder/kabiyahe/` |

## Domain Status Map

| Domain | Status | Deployed |
|--------|--------|----------|
| Varix (parent) | In Progress | — |
| SSA | In Progress | — |
| SMFC Command Suite | **Complete** | Yes (prod) |
| Tessora | In Progress | No |
| CafeLive | In Progress | Yes (Vercel) |
| Veavii | **Complete** | Yes (Vercel) |
| Mangara | In Progress | Yes (Vercel) |
| PokeCard PH | In Progress | No |
| BeautyBooth | In Progress | No (dev) |
| Kabiyahe | Planning | No |
| Oishii Nori | In Progress | No |
| Istoria Coffee | **Complete** | Yes (Vercel) |
| MPI RAG System | In Progress | No (local) |

**Portfolio snapshot: 8 building / 3 shipped / 1 planning**

## Brand Tokens (Varix)

- Background: `#050505`, surfaces `#0a0a0a` / `#0f0f0f`
- Accent gold: `#FFBF47`, borders `rgba(255,191,71,0.12)`
- Text: `#F2F2F2`, muted `rgba(242,242,242,0.6)`
- Display/headings: Cormorant Garamond (serif, italic gold accent)
- Labels/nav/wordmark: JetBrains Mono (uppercase, 8-12% letterspacing)
- Body: Inter (humanist sans)

## Tone & Style

- **Varix/business docs:** Match site voice — direct, confident, no fluff. Short declarative service lines. "Engineered to Adapt."
- **Client-facing:** PH SMB + remote/international client audience, both addressed. Oishii Nori is the only active client project.
- **Varix business docs location:** `D:\VARIX DOCS\DOCUMENTS`

## Open Items

Tracked in `ops/varix-open-items.md`:
- Domain canonicalization: `varix.work` vs `varixph.com` (varix.work appears canonical per site metadata)
- SEO implementation plan

## Skills & Automations

*(Placeholder — to be populated after workflow audit)*

### Active Skills
1. **Project status sync** — reads session handoffs + todos across all projects, produces daily status summary. Cadence: daily. **Wired to the dashboard's Status Sync skill button** (command-center plugin): click runs a native scan of all `SESSION_HANDOFF.md` files + today/schedule progress into a results modal; from there it can log a timestamped entry to `ops/headlines.md` or dispatch a headless agent (`opencode run` / `claude -p`, selectable in plugin settings) to perform the full vault sync. Handoff repo registry lives in `HANDOFF_REPOS` in `.obsidian/plugins/command-center/main.ts`.
2. **Session handoff writer** — auto-generates a handoff doc at end of work session. Cadence: on-demand.
3. **Client update composer** — pulls Oishii Nori project progress into client-facing status message. Cadence: on-demand.

### Dashboard
Command-center plugin in `.obsidian/plugins/command-center/` — dashboard reads from `ops/` files and `projects/<domain>/STATUS.md`.

### Voice Mode
Deferred — no voice control until dashboard + skills are proven manually.
