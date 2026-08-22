# Istoria Coffee

## Last Session Summary
Complete — deployed to production. Full admin system built and shipped: hidden `/login` → `/admin` (Supabase Auth + `admin_users` allowlist), Freedom Wall moderation, Menu moved to Supabase (full CRUD), Community submissions with moderation. 4 real bugs fixed (uncaught Supabase errors crashing dev server, `.env.local` not reaching server-side, live site blanked by missing env vars, Vercel Deployment Protection blocking public access). Reveal scroll fade-in component built but not wired into all pages.

## Current Phase
**Complete** — deployed and live. Minor polish remaining.

## Key Blockers
- [ ] `www.istoria.site` custom domain not purchased/pointed
- [ ] No staging Supabase project (dev and prod share same DB)
- [ ] Reveal component not wired into Menu/Board/Contact/Order pages
- [ ] Address discrepancy in contact info
- [ ] Dead Upstash/Redis code path
- [ ] Categories not admin-editable

## Last Updated
2026-07-29
