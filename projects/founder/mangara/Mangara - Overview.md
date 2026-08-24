---
tags: [varix, mangara, manga, ai, canvas-editor, project, status]
---

# Mangara

Part of [[Varix - Overview]] — an internal product build, separate codebase from the Varix site
itself. Local project lives at `D:\mangara`. See also [[Session Handoff - Mangara (2026-08-11)]].

## What it is
A browser-based, AI-assisted manga creation workspace. The core idea is that a page is a
**structured document, not a flattened image** — a panel is geometry + image + prompt + status +
notes + version, so every part of it stays independently editable and regenerable. Built to the
seven high-fidelity mockups in `D:\mangara\reference images\`, which are the visual source of
truth for the product surface.

Deployment model is deliberately "one collaborator on a laptop, everything else hosted": Next.js
on Vercel, Supabase for auth/Postgres/Storage, so nothing depends on a dev machine being on.

**Live:** https://mangara-iota.vercel.app
**Repo:** https://github.com/vinsu-hub/mangara

## Capabilities & Use Cases
**Capabilities**
- Email/password auth (Supabase Auth), middleware-gated routes, per-project RLS throughout
- Page editor on Fabric.js — 8 tools (Select, Pan, Panel, Pen, Shape, Text, Bubble, SFX), with
  rectangle, polygon and freeform panel shapes
- Manga page layouting — Split V/H, Merge, and 6 page templates (3 tiers, 2x2, splash, 4 stacked,
  2-top+wide, 6-panel) instantiated against the page's real pixel size with proper gutters
- Panel-to-panel alignment snapping (edges and centres), snap-to-grid, and Photoshop-style ruler
  guides that are dragged out, repositioned, and persisted per page
- Full keyboard map — copy/cut/paste, select-all, duplicate, undo/redo, arrow-key nudge
  (Shift = one grid step), tool and view-toggle shortcuts
- Undo/redo, debounced autosave, PNG export at 1x and 2x rendered from page resolution
- Async AI panel generation — queue returns immediately, work finishes in the background, client
  polls, image lands in the panel. Provider router tries Gemini (quota-gated, needs a key) and
  falls through to Pollinations (no key required)
- Story Board — chapters → scenes → beats, with act tags, synopses, character assignment, and
  page ranges that resolve to real pages (with an offer to create the missing ones)
- Character Ref — identity and basic info, **consistency-lock sliders** that actually shape the
  generation prompt, AI-generated turnarounds/expressions/poses, relationships, usage stats

**Use cases**
- Lay out a manga page from a template, then adjust panels with snapping and guides
- Describe a panel in plain language and have the art generated into it
- Plan a chapter's scenes and beats, then jump straight from a scene to the page it covers
- Define a character once and keep them visually consistent across generated panels

## Stack
- **Framework:** Next.js 16 (App Router), TypeScript, React 19
- **Styling:** Tailwind v4, shadcn/ui (`radix-nova` style), Radix primitives
- **Canvas:** Fabric.js 7
- **State:** Zustand (`lib/store/editor.ts` holds all canvas state, history, guides, viewport)
- **Backend:** Supabase — Postgres (15 tables, RLS on every one), Auth, Storage (public `panels`
  bucket). Access is chained through `SECURITY DEFINER` helpers: project → chapter → page → panel
- **AI:** provider-adapter pattern behind one router (`lib/providers/`), shared background runner
  (`lib/generation/run.ts`) used by both panel and character-art generation
- **Hosting:** Vercel; background generation runs in `waitUntil()` with a 60s Hobby ceiling
- **Typography:** Inter for UI, JetBrains Mono for numerics with tabular figures

## Status
Milestones 0-3 of the build plan are complete and verified, plus Story Board, Character Ref and
panel layouting. Seven Playwright suites in `tests/` all pass against the running app.

**Not built:** Assets library, Main Chat, Prompt Studio, the Reviewing tab's annotation pins,
mask tools (lasso/brush/magic wand), Outputs/batch chapter export, the Pen tool, and Character
Ref's Design/Costumes/Appearance Lock sub-tabs. These render explicit "not built yet" stubs
rather than convincing fake UI — that distinction is intentional and worth preserving.

## Working notes
Two constraints on `supabase/schema.sql`, both learned by breaking them:
- **No `storage.*` DDL.** `storage.objects` is owned by `supabase_storage_admin`, so
  `create policy` on it fails — and the SQL Editor runs the file in one transaction, so that one
  error silently rolls back every table above it. Create buckets via the Storage API instead.
- **Never `drop function`.** Policies depend on the access helpers; use `create or replace`.

Schema changes are applied by pasting that file into the Supabase SQL Editor by hand — the
environment has API keys only, never DB credentials. The file is idempotent and safe to re-run.
