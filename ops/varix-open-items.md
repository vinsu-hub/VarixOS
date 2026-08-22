# Varix Open Items

Tracked across all Varix projects and business operations.
Last scanned: 2026-08-21

## Business-Level
- [ ] **Domain canonicalization** — `varix.work` vs `varixph.com`. `varix.work` / `www.varix.work` appears canonical per site metadata. Reconcile business templates (`D:\VARIX DOCS\DOCUMENTS`) with live site config.
- [ ] **SEO implementation plan** — referenced in past Claude Code work, needs formalization.

## Per-Project Blockers

### Oishii Nori (IN PROGRESS)
- [ ] GitHub auth broken — `gh auth login -h github.com` needed (target remote `vinsu-hub/OishiiNori`)
- [ ] Add `hr` to Supabase Dashboard → Settings → API → Exposed schemas (blocks Milestone 5 live verification)
- [ ] Ingredient stock = 0 across the board — needs first Count Stock / receiving pass before real use

### PokeCard PH (NOT DEPLOYED)
- [ ] Deploy to Vercel (43 local commits)
- [ ] Apply migration `0019_card_detail_condition_and_price_history.sql`
- [ ] Google OAuth setup (Google Cloud Console)
- [ ] Xendit provisioning for payments
- [ ] GitHub push blocked (gh auth)

### Tessora
- [ ] Target vertical undecided (BPO / real estate / manufacturing-logistics)
- [ ] Founder role split (Vince vs Neil) not finalized
- [ ] Phase 2 auth model open question (local profiles vs sync vs thin hosted)

### MPI RAG System
- [ ] Human expert evaluation session not run (thesis defense blocker)
- [ ] 12 golden answers needed for revised query sample
- [ ] Q26 hallucination documented but not fixed at pipeline level

### Kabiyahe
- [ ] Validate with Laguna Tourism Council (Cynthia Mamon) before committing dev
- [ ] Anchor partner interest (Enchanted Kingdom) not confirmed
- [ ] App name needs IPOPHL trademark search

### CafeLive
- [ ] No admin moderation UI — reports, shop-claims, chat reports sit unreviewed in DB
- [ ] Analytics/reviews/menu/gallery tabs are mocked (no backing data models)
- [ ] Stripe billing schema exists but not wired

### Mangara
- [ ] Gemini API key needed for Prompt Studio
- [ ] Reviewing tab is highest-value next step
- [ ] Vercel Hobby 60s waitUntil ceiling may hit with slower providers

### BeautyBooth
- [ ] Replace development demo login with secure admin onboarding
- [ ] Configure real GCash merchant details and QR assets
- [ ] Validate production Google Maps credentials and storage settings

### Istoria Coffee (minor)
- [ ] `www.istoria.site` custom domain not purchased/pointed
- [ ] No staging Supabase project (dev and prod share same DB)
- [ ] Reveal component not wired into Menu/Board/Contact/Order pages

### Veavii (minor)
- [ ] Custom domain (still on vivea-three.vercel.app)
- [ ] Password rotation (original bootstrap password still in place)
