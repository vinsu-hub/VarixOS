---
tags: [vercel, deployment, hosting, ci-cd, environment]
---

# Vercel Deployment Patterns

Deployment practices across [[Varix - Overview]] projects.

## Deployed Projects

| Project | Vercel URL | Method |
|---------|-----------|--------|
| [[Varix - Overview\|Varix]] | varix.work | Git auto-deploy |
| [[SMFC - Overview\|SMFC]] | dashboard-web-two-sigma.vercel.app | Explicit `vercel --prod` |
| [[CafeLive - Overview\|CafeLive]] | cafetemp-three.vercel.app | Git auto-deploy |
| [[Veavii - Overview\|Veavii]] | vivea-three.vercel.app | Git auto-deploy |
| [[Mangara - Overview\|Mangara]] | mangara-iota.vercel.app | Git auto-deploy |
| [[Istoria Coffee - Overview\|Istoria]] | istoria-vince-tamis.vercel.app | Git auto-deploy |

## Single-Project Deploy

Standard for simple apps: one Vercel project per repo, git push to `main` triggers production deploy, preview deploys on PRs.

Used by: Veavii, CafeLive, Mangara, Istoria

Source: [[Veavii - Overview]]

## Multi-Service Deploy (SMFC Pattern)

Separate backend + multiple frontend apps, each its own Vercel project:
- No git auto-deploy — deploys are explicit `vercel --prod` per service
- Per-service, per-environment env var management
- GitHub Actions CI on push, then manual deploy trigger

Source: [[Saint Michael POS - Overview|SMFC]]

## Environment Variables

- Production + preview environments with separate var sets
- Sensitive keys (Supabase service role, API keys) only in production
- `NEXT_PUBLIC_*` for client-side, server-only for secrets

## Dev-vs-Prod Divergence

Bugs that only appear under serverless bundling or static prerendering:
- **jsdom dependency chain**: fails in serverless, works in `next dev`
- **Stale prerendered pages**: fixed with `force-dynamic` or ISR revalidation
- **Missing server dependencies**: some packages need explicit `serverComponentsExternalPackages`

Source: [[Veavii - Overview]]

## Vercel + Supabase Integration

Direct-to-storage upload pipelines (Supabase Storage buckets with size/type constraints). Client-side upload to Supabase, bypassing Vercel function body-size limits.

Source: [[Veavii - Overview]]

## Related Nodes

- [[Next.js + Supabase Stack]] — the framework being deployed
- [[Real-Time Systems]] — deployment considerations for WebSocket features
- [[Supabase RLS Patterns]] — security layer
