---
tags: [pokecard-ph, auth, google-oauth, supabase, phase-1b]
---

# PokeCard PH — Auth & Google Sign-In

Part of [[PokeCard PH - Overview]]. Phase 1b — a gate that must clear before Phase 2, not a numbered phase.

## Core Decisions

- **Google Sign-In is primary**, email is fallback (magic link, not password)
- **One combined login/signup page** — Supabase handles new-vs-returning transparently
- **Everyone starts as a buyer** — vendor status is never chosen at signup
- **No new motion vocabulary** — reuses tokens from [[PokeCard PH - Design System]]

## The Trigger

```sql
create or replace function public.handle_new_user() returns trigger as $$
begin
  insert into public.profiles (id, role, display_name, avatar_url)
  values (new.id, 'buyer',
    coalesce(new.raw_user_meta_data->>'full_name',
             new.raw_user_meta_data->>'name', 'Collector'),
    new.raw_user_meta_data->>'avatar_url');
  return new;
end; $$ language plpgsql security definer;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();
```

`profiles` never needs a manual insert after signup.

## The Soft-Gate Pattern

The most consequential UX decision:

- **Public** — Home/Browse, Card Detail, Shop Storefront, Auctions Browse
- **Gated at intent** — Buy Now, Add to Cart, Place Bid, Propose Trade, Message Vendor → opens a **modal** (not full-page redirect)
- **On success, the original action completes automatically** — signing in to add to cart actually adds it

**Middleware-protected routes:** `/cart`, `/checkout`, `/orders/*`, `/trade/*`, `/vendor/*`, `/messages`

## Redirect Behavior

- New user → buyer Home + welcome toast
- Returning user → back to whatever page they were trying to reach
- Signed-in buyer hitting `/vendor/*` → `/vendor/onboarding`

## Configuration

- Enable Google provider in Supabase Auth
- Google Cloud Console OAuth consent screen
- **New env var: `NEXT_PUBLIC_SITE_URL`** — preview and production need separate authorized redirect entries

## Related Nodes

- [[PokeCard PH - Overview]] — product index
- [[PokeCard PH - Build Phases]] — where 1b sits in the ladder
- [[PokeCard PH - Design System]] — motion tokens reused
- [[Supabase RLS Patterns]] — RLS policies key off `auth.uid()`
