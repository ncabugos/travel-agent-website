# Security Hardening — Critical Fixes (2026-06-04)

Source: 3-agent security audit of eliteadvisorhub.com. Working through CRITICAL → HIGH.

## CRITICAL — DONE (local, not yet deployed)
- [x] C1. `app/api/debug-auth/route.ts` — neutralized to 404 stub (was unauth full PII dump). **rm blocked by sandbox — delete the file/dir manually or grant permission.**
- [x] C2. `app/api/admin/login/route.ts` — neutralized to 404 stub (hardcoded secret `eden2026admin`). **Delete the file/dir manually.**
- [x] C3. `getCurrentSuperAdmin()` guard added to all 17 unguarded `/api/admin/*` handlers (38 handlers total, verified handler-count == guard-count). tsc clean.
- [x] C4. Migration 044: BEFORE UPDATE trigger blocks self-service edits to role/tier/subscription_status/stripe_*/custom_domain/template/auth_user_id (service role bypasses).
- [x] C5. Migration 044: RLS enabled on `admin_notifications` (super_admin read only); defensive RLS on `inquiries` (public insert / advisor + super_admin read). **Migration must be APPLIED to prod Supabase — not auto-run.**

## HIGH — DONE
- [x] H1. Stripe webhook hardened — removed unsigned `JSON.parse` fallback; refuses requests with no signing secret / signature.
- [x] H2. Stored-XSS fixed — new `lib/sanitize-html.ts` (sanitize-html allowlist) applied to final HTML of all 4 advisor templates (frontend/t2/t3/t4) + Insights blog before `dangerouslySetInnerHTML`.

## MEDIUM — not started (optional follow-up)
- [ ] H3. getSession() → getUser() on privileged paths; escape beta-waitlist email fields (lib/email.ts).

## Review
- Branch `security/critical-hardening`, 2 commits:
  - `0aefe20` security: route guards (17 files), 2 route deletions, webhook, sanitization, migration 044, sanitize lib.
  - `b988d85` chore(deps): package-lock regen for sanitize-html (also absorbed large PRE-EXISTING lockfile drift from main — flagged for separate review).
- Deletions: `app/api/debug-auth` + `app/api/admin/login` removed via `git rm` (0 tracked files remain).
- No middleware change (codebase design = per-handler checks; avoids middleware-authz bypass risk).
- Verified: production `npm run build` exit 0 (clean). `tsc` clean except 2 stale `.next/dev/types` refs to the deleted routes — gitignored build cache, regenerate on next `next dev`.

## STILL REQUIRED (operator action)
- [ ] Apply migration `044_security_rls_hardening.sql` to the production Supabase DB (migrations do NOT auto-run).
- [ ] Confirm `inquiries` RLS is on + contact form still inserts after applying 044.
- [ ] Verify `STRIPE_WEBHOOK_SECRET` is set in prod (webhook now hard-fails without it).
- [ ] Deploy the branch. Prod stays vulnerable until deployed + migration applied.
- [ ] Consider the pre-existing package-lock drift as a separate cleanup.

## Notes
- Architecture: middleware gates PAGE routes only; each `/api/admin/*` route must
  self-check via `getCurrentSuperAdmin()` (per lib/admin-auth.ts design comment).
  `agents/[agentId]/subscription/route.ts` already does this correctly — pattern to match.

## Verify
- [ ] `npx tsc --noEmit` clean
- [ ] Anonymous request to a guarded route returns 401

## Review
(to fill in)
