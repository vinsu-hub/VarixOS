---
tags: [veavii, website, project, status]
---

# Veavii

Part of [[Varix - Overview]] (founder's personal/portfolio project, not Varix client work). See also the portfolio entry in [[Vince Tamis - Overview]]. Session build log: [[Session Handoff - 2026-08-06]].

## What it is
A two-sided literary submission platform. Veavii is "a space for words to breathe" — a community where writers share original poems and prose and readers discover, read, and celebrate them.

The name was made up by the founder mid-session (rebranded from "Vi Vea"): **Vea** = dearest/love, **Vii** = written/writings. A submitted piece is called **"a Vii"** — that terminology is scoped deliberately to the submit flow only; `/read` and admin keep neutral wording.

## Objective
Give original voices a home: writers publish original work ("a Vii") that gets curated before it goes live, readers get a safe, kind, inclusive space to browse heartfelt work, and a single host (the founder) moderates what gets published. Values on the site: authenticity, empathy, diversity, integrity, growth.

## Capabilities & Use Cases
**Capabilities**
- Account-free public submission of original writing ("a Vii") — poem, prose, short story, essay, lyrics, flash fiction, letter, or spoken word — via a rich-text (Tiptap) editor with up to 5 images
- Content-safety metadata at submission time: optional trigger warning + required note, mood/category tag (love, grief, hope, identity, etc.), language tag (English/Tagalog)
- Editorial moderation pipeline: `pending → approved → published` (or `rejected`), single-host review queue with inline approve/publish/reject/delete and a full-screen per-submission editor
- Public reading catalog (`/read`): search, filter by type/category/language/time, Latest/Trending/Most Loved tabs, anonymous per-browser like counter, related-works suggestions
- Slug-based permalinks generated on publish; only published work is visible to the public (enforced by Postgres RLS, not just app logic)

**Use cases**
- **Writer** submits a poem/essay anonymously under a pen name, optionally tags content warnings/mood/language and attaches art, then waits for curation
- **Reader** browses/filters published work by mood or genre, reads a full piece, likes and shares it
- **Founder/host (sole admin)** triages incoming submissions, edits or cleans up text before publishing, and moderates what represents the platform

- **Live:** https://vivea-three.vercel.app
- **Repo:** https://github.com/vinsu-hub/vivea (branch `master`)
- **Vercel:** `vince-tamis/vivea`
- **Supabase project:** `zvslvmtuxfahekhdurtm`
- **Local codebase:** `D:\Vi vea`

## Stack
- **Framework:** Next.js 16 (App Router, Turbopack), React 19, TypeScript
- **Styling:** Tailwind CSS v4 (CSS-first `@theme` in `src/app/globals.css`, no `tailwind.config.ts`)
- **Rich text:** Tiptap (`@tiptap/react` + StarterKit, underline, link, text-align, text-style, color)
- **Data:** Supabase Postgres + Storage (public `submission-images` bucket) with RLS
- **Auth:** custom single-host auth — `jose` JWT session cookie, `constantTimeEqual`, in-memory rate limit
- **Sanitization:** `sanitize-html` (server-side, no jsdom — chosen after `isomorphic-dompurify` broke in Vercel's serverless bundling)
- **Deployment:** Vercel, GitHub-connected

## How it works

### Public side (no accounts)
Visitors read, browse, and submit — there are no user accounts.

- `/` — redirects straight to `/about`.
- `/about` — story, "What is Veavii / For Writers / For Readers / For Everyone / Built on Respect" cards, five values, founder section.
- `/guidelines` — six submission guidelines (original work only, respect & kindness, appropriate content, credit & transparency, privacy, Veavii's rights), what's encouraged, contact.
- `/read` — catalog of published work. Server-fetched with `revalidate = 30` (ISR). Client-side `ReadBrowser`: Latest / Trending / Most Loved tabs (Trending and Most Loved sort by like count), search (title/pen name), filters (type, category, language, time range), pagination (6/page), sidebar counts for type and popular categories.
- `/read/[slug]` — full published piece: title, pen name, optional TikTok handle, publish date, type/category/language badges, trigger-warning box, image gallery, sanitized body, anonymous Like/Share bar, `AuthorBox`, `RelatedWorks` (up to 3 others).
- `/submit` — "Submit your Vii": type (8), optional title, Tiptap editor, up to 5 images, required pen name, optional TikTok username, optional trigger warning + required note, "I confirm this is my original work" checkbox, agree-to-guidelines.

### Submission pipeline
`pending → approved → published` (or `rejected`).

1. Writer submits → images upload client-side straight to Supabase Storage (`submission-images/pending/...`), then `POST /api/submissions` with the rest.
2. Server validates: type must be one of 8, `body_html` and `pen_name` non-empty, image URLs must be ≤5 and start with the exact storage-prefix, trigger warning note required if flagged. HTML is sanitized. Inserted with `status = 'pending'`.
3. RLS lets anonymous writers **insert** only rows with `status = 'pending' and slug is null`, and the public can **read** only `status = 'published'`.
4. Host reviews in `/dashboard`, transitions status server-side (service-role key bypasses RLS). Publishing generates a slug (title + first 8 chars of id) and sets `published_at` if not already set — slug is stable across approve/publish cycles.

### Likes
Anonymous and per-browser: `localStorage` key (`vivea_liked_<id>`) prevents repeat likes; UI optimistically increments, then calls `increment_like()` (Postgres RPC). The function is `SECURITY DEFINER` because the `anon` role has no UPDATE policy — otherwise the write silently no-ops while the UI appears to work (this exact bug happened and was fixed).

### Admin side (single host account)
- `/login` → `POST /api/admin/login`: constant-time username/password compare against `ADMIN_USERNAME` / `ADMIN_PASSWORD` env vars; rate-limited to 5 attempts / 10 min per IP (in-memory map, resets on cold start); issues an 8-hour JWT `vivea_admin_session` cookie (httpOnly, `SameSite=strict`, secure in prod).
- `src/proxy.ts` (Next 16 middleware convention) verifies the session on every `/dashboard*` request and redirects to `/login` if invalid. An optional `ADMIN_HOST` env var can split public/admin onto separate hosts (currently unset — both resolve on the same host).
- `/dashboard` — table of all submissions: Pending/Approved/Published/Rejected tabs, search, Newest/Oldest sort, submitted timestamp, trigger-warning marker, inline approve/publish/reject/delete, and a right-hand Reading Panel preview (click a row or the eye icon). A "Full Screen" link jumps to `/dashboard/[id]`.
- `/dashboard/[id]` — full editor: edit type/title/body/pen name/TikTok/language/category/trigger-warning fields, admin notes, status transitions, delete, and a "Next" button that steps through all submissions in fixed newest-first order (works regardless of how the page was reached).
- `/dashboard/settings` — host account info (username, reminder that password lives in env vars, no in-app rotation yet) and submission counts by status.

## Structure
```
src/
  proxy.ts                Next 16 middleware — session gate on /dashboard*, optional ADMIN_HOST split
  app/
    page.tsx              redirect("/about")
    layout.tsx            fonts (Playfair Display + Inter), metadata, dark-mode FOUC-prevention script
    globals.css           Tailwind v4 @theme, :root / :root.dark semantic CSS variables
    about/  guidelines/   public content pages
    read/                 catalog + /read/[slug] full piece (revalidate = 30)
    submit/               hero + SubmissionForm
    login/                host login form
    dashboard/            layout (sidebar + reading-panel target), table, [id] editor, settings (force-dynamic)
    api/
      submissions/        POST — validate + sanitize + insert (status=pending)
      admin/
        login/ logout/    session issue / destroy
        submissions/[id]/ PATCH (status / content / admin notes) + DELETE, admin-auth guarded
  components/             Navbar, HeroSection, ThemeToggle, SubmissionForm, RichTextEditor,
                          ReadBrowser, WorkCard, LikeShareBar, AuthorBox, RelatedWorks,
                          FounderSection, GuidelineCard, FloralDecoration,
                          admin/ (SubmissionsTable, SubmissionEditor), ui/ (Button, Card, Input, ...)
  lib/
    types.ts              Submission type + TYPE/CATEGORY/LANGUAGE label maps (single source of truth)
    data.ts               public reads (published only) + HTML excerpt/text/word-count helpers
    admin-data.ts         service-role reads + status/content/notes/delete mutations, slugify
    sanitize.ts           sanitize-html allowlist (tags, styles, colors restricted to CSS vars)
    auth.ts               jose JWT sign/verify, constantTimeEqual, cookie constants
    rate-limit.ts         in-memory 5/10min limiter
    supabase/             client.ts (anon) + server.ts (service-role, server-only)
supabase/
  schema.sql              authoritative schema — enums, submissions table, RLS, increment_like(),
                          storage bucket + policies (NOTE: it's CREATE TABLE, not idempotent)
```

## Design direction
Soft, literary, lavender-and-purple. Headings in Playfair Display (`font-display`), body in Inter. Light mode `--bg-lavender #f5f0fa`, dark mode `#121120`; accent `#5b3a8e` (light) / `#a084d6` (dark).

- **Dark mode:** manual sun/moon toggle, persisted to `localStorage` (`veavii-theme`), FOUC-prevention inline script in `layout.tsx`. Implemented by re-defining semantic CSS variables under `:root.dark` — components re-theme automatically with zero per-component `dark:` classes.
- **Colored text:** 4-swatch pastel palette (red/green/blue/violet) in the rich-text toolbar, stored as `color: var(--text-red)` etc. rather than literal hex — a colored piece re-tints to the correct pastel shade in whichever theme it's viewed in.
- **Heroes:** full-bleed background images with dark gradient scrims and white overlay text; a `--heading-shadow` text-shadow glow keeps headings readable over busy art. The `/submit` hero uses a CSS `::before` background-art system (`backgroundArt` prop on `HeroSection`) with breakpoint-specific sizing/positioning and contrast-verified scrims (see handoff).
- **Admin chrome:** the sidebar uses its own fixed `--sidebar-bg` token (permanent dark chrome) so it never washes out when the site theme changes.

## Database schema (summary)
`submissions` table — enums: `type` (poem, prose, short_story, essay, lyrics, flash_fiction, letter, spoken_word), `status` (pending, approved, published, rejected), `language` (english, tagalog), `category` (love, heartbreak, grief, hope, family, friendship, identity, nature, healing, nostalgia, other). Key columns: `body_html`, `pen_name`, `tiktok_username`, `like_count`, `admin_notes`, `has_trigger_warning` + `trigger_warning_note` (CHECK constraint: flag implies note), `image_urls text[]`, `published_at`, `slug` (unique). Storage bucket `submission-images` (public, 5MB, image/* only). Full definition: `supabase/schema.sql`.

Schema changes are applied **directly to the live Supabase project** (one-off `pg` scripts), not by re-running `schema.sql` (it's `CREATE TABLE` — enums can't be re-created). `schema.sql` is the readable source of truth for standing up a fresh project.

## Security notes
- RLS everywhere: anon insert limited to `pending + null slug`, anon select limited to `published`, no anon update/delete — all mutations go through service-role admin routes.
- Server-side HTML sanitization with a strict allowlist (tags, text-align styles, link schemes, `rel="noopener noreferrer"`), and inline `color` restricted to the 4 CSS-var patterns — never arbitrary values.
- Login: constant-time compares, in-memory rate limiting, httpOnly `SameSite=strict` cookie, JWT verified in both the login route and `src/proxy.ts`.

## Status (as of 2026-08-06)
Fully built, deployed, and live. See [[Session Handoff - 2026-08-06]] for the build history, bugs found/fixed, and verification steps. Known gaps / deliberately deferred (from the handoff):
- [ ] Admin submissions table scrolls horizontally on mobile rather than collapsing to cards
- [ ] No in-app password rotation — credentials via `ADMIN_USERNAME` / `ADMIN_PASSWORD` env vars (rotate in Vercel + redeploy); original bootstrap password still in place
- [ ] No custom domain yet — still on `vivea-three.vercel.app`; `ADMIN_HOST` split hook exists but unset
- [ ] Images only (no video/generic files) — deliberate
- [ ] Colored-text palette fixed at 4 colors — extendable on request
- [ ] Submit hero work was shipped after the handoff doc was written — already committed (`git log` shows `ab5e2c4`, `116ed45`, `08b4469`) and working tree is clean

**How to apply:** when picking this project back up, check `git log` and `SESSION_HANDOFF.md` in `D:\Vi vea` first — this note is a snapshot, not the live source of truth.
