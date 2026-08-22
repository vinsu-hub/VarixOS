---
tags: [supabase, rls, row-level-security, postgres, security, RLS]
---

# Supabase RLS Patterns

Row-Level Security implementation patterns across [[Varix - Overview]] projects.

## Core Principle

Postgres RLS is the actual runtime authority — not app-layer checks. ORM (Prisma) reserved for admin/service-role use and background jobs only.

Source: [[CafeLive - Overview]]

## Asymmetric Policy Pattern

Two separate UPDATE policies OR'd together so a request's sender and recipient have different, non-overlapping permissions on the same row.

**Use case**: Messaging system where sender can update their own messages but not the recipient's, and vice versa.

Source: [[CafeLive - Overview]]

## Silent No-Op Write Bug

**Symptom**: Write operation returns success but no data changes.

**Cause**: Missing RLS UPDATE policy on `anon`-role RPC. The database silently rejects the update without raising an error.

**Fix**: Add the missing policy, or use `SECURITY DEFINER` on the RPC function.

**Lesson**: Always check RLS policies when writes silently fail. Don't assume app-layer checks are sufficient.

Source: [[Veavii - Overview]]

## Auth → App-User Sync

Supabase Auth creates users in `auth.users`, but RLS blocks user self-insert into `public.User`. Solution: Postgres triggers on `auth.users`:
- `INSERT` → create `public.User` row
- `UPDATE EMAIL` → sync email
- `DELETE` → cascade or soft-delete

Source: [[CafeLive - Overview]]

## Storage Bucket Policies

| Bucket Type | Access Pattern | Example |
|------------|---------------|---------|
| Public | Read-heavy, public-facing | Product photos, logos, avatars |
| Private | Sensitive, signed-URL | Loss photos, payroll signatures |

Provisioned via Storage admin API when no CLI/dashboard link exists.

Source: [[SMFC - Overview]], [[CafeLive - Overview]]

## SECURITY DEFINER Pattern

Functions that need to bypass RLS for legitimate reasons (e.g., admin operations, cross-user reads) use `SECURITY DEFINER` to execute with the function owner's privileges.

**Caution**: Must be paired with app-layer authorization checks. RLS bypass is powerful and must be intentional.

## Debugging Checklist

1. Check if the policy exists for the operation type (SELECT/INSERT/UPDATE/DELETE)
2. Verify the policy condition matches the user's role
3. Test with `anon` role vs. authenticated role
4. Check for missing policies on RPC functions
5. Verify storage bucket policies if using file uploads

## Related Nodes

- [[Security Review Patterns]] — broader security practices
- [[Next.js + Supabase Stack]] — the foundation
- [[Content Moderation Patterns]] — RLS for moderation workflows
