---
tags: [nextjs, supabase, vercel, react, typescript, frontend, stack]
---

# Next.js + Supabase Stack

The primary full-stack pattern across [[Varix - Overview]] projects. Used in 7 of 13 domains.

## Projects Using This Stack

| Project | Next.js | Supabase | Deployed |
|---------|---------|----------|----------|
| [[Varix - Overview\|Varix Website]] | 16 (App Router) | Auth, Storage | Yes |
| [[Veavii - Overview\|Veavii]] | 16 (App Router) | Auth, Storage, Realtime | Yes |
| [[CafeLive - Overview\|CafeLive]] | 16 (App Router) | Auth, Storage, Realtime, Postgres | Yes |
| [[Mangara - Overview\|Mangara]] | 16 (App Router) | Storage | Yes |
| [[Istoria Coffee - Overview\|Istoria]] | Vite + React 19 | Auth, Storage | Yes |
| [[PokeCard PH - Overview\|PokeCard PH]] | 16 (App Router) | Auth, Storage, Realtime | No |
| [[Kabiyahe - Overview\|Kabiyahe]] | Planned | Auth, pgvector | No |

## App Router Patterns

- Server Components as default, `"use client"` only when needed
- Middleware-based auth gating (`middleware.ts` at root)
- Route Handlers for API endpoints (`app/api/*/route.ts`)
- `generateMetadata` for per-page SEO
- `loading.tsx` / `error.tsx` boundaries for streaming UX

Source: [[Veavii - Overview]]

## Auth Pattern

JWT session via `jose`, cookie-based, enforced through Next.js middleware. Supabase Auth → app-user sync via Postgres triggers (`auth.users` → `public.User` on insert/update-email/delete).

Source: [[Veavii - Overview]], [[CafeLive - Overview]]

## Row-Level Security

Postgres RLS as runtime authority — ORM (Prisma) reserved for admin/service-role use only. Directional/asymmetric policies (e.g., two separate UPDATE policies OR'd for sender vs. recipient permissions).

### Debugging Pattern
Silent no-op writes caused by missing RLS UPDATE policies on `anon`-role RPCs → fixed via `SECURITY DEFINER`.

Source: [[Veavii - Overview]], [[CafeLive - Overview]]

## Storage Buckets

- **Public**: read-heavy public images (product photos, logos, avatars)
- **Private/signed-URL**: sensitive documents (loss photos, payroll signatures)
- Client-side direct-to-supabase upload pipelines with size/type constraints

Source: [[Saint Michael POS - Overview|SMFC]], [[CafeLive - Overview]]

## Deployment

Vercel production + preview environments. Multi-project deploys (separate Vercel project per service, explicit `vercel --prod` per service, no git auto-deploy for monorepos).

### Dev-vs-Prod Divergence
Bugs that only appear under serverless bundling or static prerendering, not `next dev`:
- jsdom dependency chain failures
- Stale statically-prerendered pages → fixed with `force-dynamic`/ISR

Source: [[Veavii - Overview]]

## Related Nodes

- [[Real-Time Systems]] — Supabase Realtime, WebRTC patterns
- [[Vercel Deployment Patterns]] — deployment details
- [[Supabase RLS Patterns]] — security deep-dive
- [[Next.js + Supabase Stack]]
