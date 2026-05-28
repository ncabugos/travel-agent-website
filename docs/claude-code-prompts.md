# Claude Code Starter Prompts

> Copy-paste-ready first messages for common EAH workstreams.
> The pattern: point at the goal and the guardrails; CLAUDE.md handles the rest.

## How to use this file

1. `cd` to the project root and run `claude`.
2. Pick the relevant prompt below and paste it as your first message.
3. Let Claude Code plan before editing — say "show me the plan first" if it doesn't volunteer one.
4. Commit per logical unit (per file, per component, per migration). Roll back is cheap; surprises are expensive.

Each prompt below assumes a clean working tree. If you have uncommitted changes, mention them in the prompt or commit them first.

---

## Prompt 1 — Marketing-site brand positioning rewrite

**Use when:** Rewriting public-facing copy on eliteadvisorhub.com to match the locked top-1% positioning. Information architecture stays the same; only the language changes.

```
We're rewriting the public marketing-site copy on eliteadvisorhub.com to match the new "top 1% of travel advisors" brand positioning. The locked tier matrix is in CLAUDE.md §3; the brand voice brief is in docs/brand-positioning.md.

Goal this session: rewrite the copy on the public-facing marketing surfaces — NOT the advisor-tenant sites. Information architecture stays the same; only the language changes.

Scope (in priority order):
1. Homepage (app/page.tsx + any home/* components used there)
2. Pricing section/page — must show the locked tier matrix from CLAUDE.md §3 ($89 / $179 / $349 / from $899)
3. Schedule-consultation page (app/schedule-consultation/page.tsx)
4. About / Why EAH section if it exists on the homepage
5. Footer microcopy + nav labels
6. Transactional email templates in lib/email.ts (welcome, admin alerts) — voice consistency only, not structural rewrites

Constraints:
- Use the forbidden-phrases list in docs/brand-positioning.md. Strike them all.
- Lead with restraint, not enthusiasm. Specificity over abstraction. See the before/after examples in the brief.
- DO NOT change the tier prices. Those are locked in CLAUDE.md §3.
- DO NOT touch advisor-site templates (frontend/, t2/, t3/, t4/). Only the marketing-site surfaces.
- DO NOT restructure components. Copy rewrites only. If you find architectural problems, flag them, don't fix them.

Approach:
1. Read CLAUDE.md and docs/brand-positioning.md first.
2. Identify files in scope by grepping the marketing-site routes (app/page.tsx, app/schedule-consultation, components/home/, components/marketing/).
3. Make a plan with the rewrites file-by-file. Present it before editing.
4. Execute one file at a time. Commit per file with a clear message.
5. After each file: `npx tsc --noEmit` clean. Then `npm run dev` and preview at 375 / 768 / 1280 px.

Final verification:
- `npx tsc --noEmit` clean
- `npm run lint` clean
- Browser preview at all three viewports for every changed page
- One commit summary listing every changed file
```

---

## Prompt 2 — Demo slug rename (`demo-agent` → `starter-demo`, `wwt-demo` → `wellness-demo`)

**Use when:** Renaming the stale demo slugs documented in `Elite_Advisor_Hub_Feature_Matrix.xlsx` (sheet 8) and CLAUDE.md §13. Run this AFTER the brand positioning session is complete and committed.

```
Two demo slug renames per CLAUDE.md §13 and the Feature Matrix (sheet 8: Demos).

Renames:
1. demo-agent → starter-demo
   - New label: "Aspen Mountain Travel (Frontend)" (or pick a similar fictional name — confirm with me before committing)
   - Template stays: frontend
   - Represents: Starter tier
2. wwt-demo → wellness-demo
   - New label: "Lumière Wellness Travel (T2)"
   - Template stays: t2
   - Represents: Wellness niche on Growth tier

Why: "demo-agent" labeled "Eden — Custom (Frontend)" conflicts with the real Eden client (edenforyourworld.com — see memory/first_client_eden.md). "wwt-demo" must be renamed to free up the Wine & Wellness branding for the real account (wineandwellnesstravel.com).

Scope:
1. lib/demo-agents.ts — the canonical demo registry
2. All TypeScript/TSX references in the codebase
3. Any JSON/SQL seed scripts in scripts/
4. A new migration scaffold (do NOT run it yet) that updates blog_posts.target_demo_slugs values from old slugs to new slugs. Number it correctly relative to supabase/migrations/ (latest is 030).
5. CLAUDE.md and the Feature Matrix already document the renames — do NOT edit those.

Constraints:
- Migrations are immutable. Don't edit existing numeric migrations. Add a new one.
- This is a mechanical rename, not a redesign. Don't touch demo content or component structure.
- Don't seed new mock blog posts or update visual content. That's a separate session.

Verification:
- `npx tsc --noEmit` clean
- `grep -rn "demo-agent\|wwt-demo"` returns zero matches in app/, components/, lib/, scripts/ (excluding the new migration and CLAUDE.md / xlsx which document the rename)
- `npm run dev` and confirm:
  - http://localhost:3000/frontend/starter-demo renders
  - http://localhost:3000/t2/wellness-demo renders
  - http://localhost:3000/frontend/demo-agent returns 404 (expected — old slug gone)
- Single commit with the rename. Plus the migration scaffold as a separate commit (so it can be applied or held independently).
```

---

## Prompt 3 — Stripe dunning on `invoice.payment_failed`

**Use when:** Wiring the P1 launch-blocking dunning flow. Per Feature Matrix sheet 7.

```
Wire dunning on Stripe's invoice.payment_failed webhook event. This is a P1 launch blocker per Elite_Advisor_Hub_Feature_Matrix.xlsx (sheet 7).

Goal: when a charge fails, the advisor gets a clear email, the subscription enters a 7-day grace period (not immediately disabled), and the operator gets an admin_notification.

Scope:
1. app/api/stripe/webhook/route.ts — add the invoice.payment_failed handler
2. lib/email.ts — new template: "Payment failed — please update your card" with a link to the Stripe customer portal
3. New column on agents: payment_grace_period_until (timestamptz, nullable). New migration in supabase/migrations/ (next number after 030).
4. admin_notifications insert on every payment failure
5. After the grace window expires (cron or webhook on next failure), if still unpaid, set subscription_status = 'past_due' and disable public site rendering (middleware check)

Constraints:
- Stripe webhook is source of truth for billing state. Don't infer from client. (CLAUDE.md §7.8)
- Use lib/supabase/service.ts for the webhook write — RLS bypass needed. (CLAUDE.md §6)
- Test with Stripe test mode + `stripe listen` for webhooks. NEVER hit live. (CLAUDE.md §9)

Approach:
1. Read CLAUDE.md, lib/supabase/service.ts, app/api/stripe/webhook/route.ts, lib/email.ts.
2. Plan the implementation. Present the plan including the new migration SQL.
3. Implement. One commit per logical unit: migration, webhook handler, email template, middleware grace-period check.
4. Test with `stripe trigger invoice.payment_failed` against a local subscription.

Verification:
- `npx tsc --noEmit` clean
- New migration applies cleanly
- Triggering a test invoice.payment_failed creates the admin_notification, sends the email (Resend dev console shows it), and writes payment_grace_period_until on the agent row
- After grace expires, the advisor's public site stops rendering
```

---

## Prompt 4 — `revalidatePath` wiring on advisor write paths

**Use when:** Closing the P1 staleness gap so advisor edits surface immediately on public pages.

```
Wire revalidatePath on every advisor-side write path that affects a public route. This is a P1 launch blocker (CLAUDE.md §7.7).

Today: a blog publish or profile edit doesn't surface on the public site until SSR cache misses or a redeploy. Goal: writes trigger targeted revalidations.

Scope (find via grep — any server action or API route that writes to advisor data):
- Blog publish (app/api/agent-portal/blog/* and lib/actions/* if relevant)
- Profile edit (app/api/agent-portal/onboarding/*, profile updates)
- Site settings (tagline, socials, domain)
- Blog category preferences (target_demo_slugs)
- Admin edits to any advisor (app/api/admin/agents/*)

Pattern:
- Identify the route(s) the write affects (use lib/tenant-paths.ts to compose).
- revalidatePath(path) for each affected route after the DB write succeeds.
- For multi-page changes (e.g., new blog post = /journal index AND /journal/[slug]), revalidate both.

Constraints:
- URLs go through lib/tenant-paths.ts. NEVER inline string-build a path. (CLAUDE.md §7.5)
- If a write affects all advisor sites (curated editorial post), revalidate the affected paths across all advisors who opted in — efficiently, not in a loop of 100 revalidations.

Verification:
- `npx tsc --noEmit` clean
- Manual: publish a blog post in agent-portal, refresh the public site URL — post is visible without rebuild
- Manual: edit profile tagline, refresh public site home — new tagline is visible immediately
```

---

## Prompt 5 — Agency demo enhancement (ytc-demo)

**Use when:** Building the Agency-tier exemplar AND the production Agency-tier features simultaneously. See docs/agency-demo-plan.md.

```
Build the Agency-tier feature set, with ytc-demo as the exemplar. Full plan in docs/agency-demo-plan.md.

Scope follows the plan exactly: T2AdvisorsDirectory, T2AdvisorProfile, T2MeetTheCollective, multi-author byline support, lead-routing UI, agency-admin role + RLS. Plus migration 031_agency_tier.sql per the plan.

Approach:
1. Read CLAUDE.md, docs/agency-demo-plan.md, and the relevant existing files: lib/demo-agents.ts, app/t2/[agentId]/*, components/t2/*, supabase/migrations/030_*.sql.
2. Plan the build sequence: migration first, then components in priority order from the plan, then demo content seeding.
3. Execute one component at a time, committing per component. Verification per CLAUDE.md §9 after each.

Constraints:
- Migrations are immutable. New migration is 031, after 030. (CLAUDE.md §7.2)
- Template isolation. t2 components don't import from t3/t4. (CLAUDE.md §7.4)
- RLS smoke test required before merging: "can advisor A see advisor B's inquiries?" — answer must be no.

Sizing budget per the plan: ~9 days total. Plan to break this into multiple sessions, not one. Commit and pause cleanly between components.
```

---

## Session hygiene rules

**Commit per logical unit.** One component, one migration, one prompt — one commit. The rule of thumb: would a sane reviewer want this rolled back in one click? If yes, separate commit.

**Plan before editing on anything non-trivial.** Even when Claude Code wants to dive in, ask for the plan first. The plan often surfaces constraints you forgot to mention.

**Use TodoWrite for multi-file work.** Claude Code does this automatically for complex tasks. If it's not happening and you're in a multi-step session, prompt for it.

**End-of-session ritual:**
1. `git status` clean OR all uncommitted work intentional
2. `npx tsc --noEmit` clean
3. Update tasks/todo.md or create a new task file if the workstream has more sessions ahead
4. If you discovered something Claude should remember in future sessions, save it to memory/ before closing

**When to clear context vs. continue.** Long sessions accumulate context noise. If the next task is unrelated to what you just shipped, start a new session — the loaded CLAUDE.md + memory will rehydrate the project context in seconds, and you get a clean slate.
