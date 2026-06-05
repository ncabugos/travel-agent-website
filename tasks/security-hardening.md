# Security Hardening — Critical Fixes (2026-06-04)

Source: 3-agent security audit of eliteadvisorhub.com. Working through CRITICAL → HIGH.

## CRITICAL — DONE (local, not yet deployed)
- [x] C1. `app/api/debug-auth/route.ts` — neutralized to 404 stub (was unauth full PII dump). **rm blocked by sandbox — delete the file/dir manually or grant permission.**
- [x] C2. `app/api/admin/login/route.ts` — neutralized to 404 stub (hardcoded secret `eden2026admin`). **Delete the file/dir manually.**
- [x] C3. `getCurrentSuperAdmin()` guard added to all 17 unguarded `/api/admin/*` handlers (38 handlers total, verified handler-count == guard-count). tsc clean.
- [x] C4. Migration 044: BEFORE UPDATE trigger blocks self-service edits to role/tier/subscription_status/stripe_*/custom_domain/template/auth_user_id (service role bypasses).
- [x] C5. Migration 044: RLS enabled on `admin_notifications` (super_admin read only); defensive RLS on `inquiries` (public insert / advisor + super_admin read). **Migration must be APPLIED to prod Supabase — not auto-run.**

## HIGH (next — not started)
- [ ] H1. Harden Stripe webhook — remove unsigned-body fallback
- [ ] H2. Stored-XSS sanitization for blog/journal/insights render paths
- [ ] H3 (MEDIUM). getSession() → getUser() on privileged paths; escape beta-waitlist email fields

## Review
- 19 files changed: 17 admin routes guarded + 2 neutralized stubs; 1 new migration (044); 1 tracking doc.
- No middleware change (codebase design = per-handler checks; avoids middleware-authz bypass risk).
- Verified: `npx tsc --noEmit` exit 0, 0 errors. Guard is first statement in every handler.
- NOT committed/pushed. NOT deployed. Migration NOT applied. Prod remains vulnerable until deploy + migration apply.

## Notes
- Architecture: middleware gates PAGE routes only; each `/api/admin/*` route must
  self-check via `getCurrentSuperAdmin()` (per lib/admin-auth.ts design comment).
  `agents/[agentId]/subscription/route.ts` already does this correctly — pattern to match.

## Verify
- [ ] `npx tsc --noEmit` clean
- [ ] Anonymous request to a guarded route returns 401

## Review
(to fill in)
