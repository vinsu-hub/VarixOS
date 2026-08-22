---
tags: [varix, website, nextjs, vercel, marketing, blog]
---

# Varix Website Project

Marketing site + blog for [[Varix - Overview]]. Repo: `github.com/vinsu-hub/Varix`. Deployed at `www.varix.work`.

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, TypeScript, strict mode) |
| Styling | Tailwind CSS v4 (CSS-first config) |
| Data | Supabase Postgres — blog posts + contact form submissions |
| Deployment | Vercel, GitHub-connected |
| Domain | `www.varix.work` |

## Structure

```
src/
  app/            routes (App Router)
  components/
    layout/       Header, Footer, Container, Section
    ui/           Button, Card
    home/         home-page sections
    work/         portfolio components
    blog/         blog components
    contact/      contact form
  lib/
    data/         config-driven placeholder content
    supabase/     Supabase client factory
    site-config.ts  site name/url/description
    seo.ts        metadata/OG builder
```

Services, portfolio projects, team members, and testimonials are config-driven — add an entry and it shows up automatically.

## What's Built

1. Design system tokens, root layout, shared components
2. Services page
3. Home page — hero, services overview, featured work, process, testimonials
4. About page with placeholder team roster
5. Work/portfolio index + project detail pages
6. Blog wired to Supabase — posts table, RLS, index + detail pages
7. Contact form with Supabase submission + honeypot spam protection
8. 404 page + placeholder legal pages
9. `sitemap.xml` + `robots.txt`

## Reskin (2026-07-26)

Dark/gold CRT identity ported from the static variant build. Gold `#FFBF47` on near-black `#050505`, Cormorant Garamond / JetBrains Mono / Inter, Three.js scene, CRT scanlines, hairline 1px-gap grids. **This repo is the canonical Varix site.**

Source: [[Brand Identity]]

## Known Placeholders

- **Copy:** About page story, team bios, testimonials, case studies — all placeholder
- **Legal:** `/privacy` and `/terms` are stub pages
- **Domain:** `siteConfig.url` assumes `https://www.varix.work`

## Deploy Plan

1. Push to GitHub (done)
2. Import into Vercel
3. Set env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Create Supabase project, run `supabase/schema.sql`
5. Point `www.varix.work` at Vercel (CNAME)

Source: [[Vercel Deployment Patterns]]

## Related Nodes

- [[Varix - Overview]] — company index
- [[Brand Identity]] — design tokens applied in reskin
- [[Vercel Deployment Patterns]] — deployment patterns
- [[Next.js + Supabase Stack]] — the foundation
- [[Blog Cover Image Prompts]] — cover image generation workflow
