# CLAUDE.md — Elite Advisor Hub (EAH)

> This file is auto-loaded by Claude Code at session start. It is the project's **constitution** —
> the things every new session must know before touching code. Keep it tight (~300 lines).
> Anything that changes monthly belongs in `memory/`, not here.

---

## 1. What this is

**Elite Advisor Hub** (eliteadvisorhub.com) is a multi-tenant SaaS that lets independent travel
advisors and boutique luxury agencies launch Virtuoso-grade websites in days, not months.

- **Operator** controls a shared supplier database (Virtuoso hotels, cruise partners, villas).
- **Each advisor** gets: a branded public site, a self-service portal that includes a blog with the option to select categories that pushes blog posts written by the operator to push to the agent's blog page.

- **Templates stack** — upgrading a tier adds modules; it never rebuilds the site, and gives the travel advisor different options such as a social media feed, custom features, page and premium modules.


---

## 2. Three product surfaces

| Surface | Path | Audience |
|---|---|---|
| **Admin console** | `/admin` | Platform operator |
| **Agent portal** | `/agent-portal` | The advisor (self-service) |
| **Public advisor sites** | `/frontend/[agentId]` · `/t2/[agentId]` · `/t3/[agentId]` · `/t4/[agentId]` | The advisor's clients |

Custom domains are rewritten to the right template surface by `middleware.ts` (5-minute domain cache
keyed on `agents.custom_domain → { agentId, template }`).

---

## 3. Tier × feature matrix (May 2026)

Every tier ships a **custom-branded site** — built to the advisor's identity, not handed a stock
template. Tiers differ by features, not by which design they receive. (The internal template the
build sits on is an implementation detail, not a marketing axis.)

| Tier | Monthly | Setup | Curated editorial stream | Villa | Headline differentiator |
|---|---|---|---|---|---|
| Starter | $89 | $499 | — (advisor-written only; clean editor included) | — | Custom-branded site, supplier catalog, lead inbox, portal |
| Growth | $179 | $1,499 | 1 post/week | — | + Curated editorial stream |
| Custom | $349 | $2,999 | 2 posts/week + topic requests | included | + Villa module, custom features, premium modules, bespoke design |
| Agency | from $899 | from $4,999 | 2 posts/week per advisor, co-authored option | included | + **Agent directory**, multi-advisor management, unified billing |

**Curated editorials are hard-gated to Growth+.** Starter advisors get the journal module (M18) so
they can publish their own pieces via the Tiptap editor, but the operator-produced curated stream
does not flow to Starter sites. Upgrade to Growth is the only path in.

**Core modules on every tier:** M05 Virtuoso · M06 Partner Tabs · M07 Hotel Programs teaser ·
M09/M10 brand pages · M18 Journal (writeable on all tiers; curated stream Growth+) · M20 Contact.

**Villa module** lives at Custom and above only. The villa catalog is being refined for specialized
advisors; do not surface villas on Starter or Growth UIs.

**Agent directory** is the Agency-tier differentiator — a unified listing of advisors under one
agency brand, with individual profiles, agency-wide lead routing, and a shared content library.

The Feature Matrix that drives this lives in `Elite_Advisor_Hub_Feature_Matrix.xlsx` at the repo
root. **Source of truth for "which module is required on which tier."**

### Product layers above the SaaS

The website SaaS is the foundation. Two additional product layers sit on top — both documented
fully in `Elite_Advisor_Hub_Strategic_Plan.docx`:

- **Studio (content syndication)** — operator-produced articles, social posts, and email templates
  that advisors rebrand and push to their own clients. Sold standalone ($79/$149/$399+ tiers) or
  bundled with SaaS. Launches Phase 3 (Month 9+, late 2026 / early 2027), not at SaaS launch.
- **Supplier Partnerships (sponsored content network)** — luxury suppliers (Aman, Belmond, cruise
  lines) pay for sponsored content distributed across the advisor network with FTC-compliant
  disclosure. Year-2 product, requires installed base of 30+ advisors first.

### Brand positioning

EAH is for **the top 1% of travel advisors** — invitation-worthy, not commodity. Marketing copy and
visual identity should reflect that floor. See `docs/brand-positioning.md` for the voice brief,
forbidden phrases, and example before/after copy.

---

## 4. Tech stack

| Layer | Tool | Notes |
|---|---|---|
| Framework | Next.js 16 (App Router) + React 19 | Server components by default; SSR fetch from Supabase |
| Styling | Tailwind v4 | Use template-scoped CSS vars (`--t3-*`, `--t2-*`) for design tokens |
| DB / Auth | Supabase | Magic-link OTP; RLS on every table |
| Billing | Stripe | Subscriptions + setup-fee line items; `TIER_PRICES` map in `lib/stripe.ts` |
| Email | Resend | `lib/email.ts` (welcome, admin alerts) |
| Editor | Tiptap v3 | Advisor blog composer only |
| CMS (partial) | Sanity | Scaffolded; **undecided — do not extend without confirming intent** |
| Hosting | Vercel | Custom domains via middleware rewrite |

Env vars: see `.env.local.example`. Production URL is `https://eliteadvisorhub.com`.

---

## 5. Repo map (where to look first)

```
app/
  admin/              Operator console (agents, blog, requests, consultations)
  agent-portal/       Advisor self-service (5-step onboarding, blog, billing, profile)
  api/                Route handlers — admin, agent-portal, stripe, hotels
  frontend/[agentId]/ Starter-tier public site
  t2/[agentId]/       "Vista" template (Growth/Custom) — cinematic, ~30 components
  t3/[agentId]/       "Meridian" template (Growth/Custom) — sans-serif grid, ~20 components
  t4/[agentId]/       "Casa Solis" template (Custom flagship) — quiet-luxury, ~15 components
components/
  t2/ t3/ t4/         Template-scoped components. Each template owns its own design system.
  admin/ dashboard/   Operator and advisor portal UI
  ui/                 Cross-template shared primitives
lib/
  supabase/           client.ts (browser) · server.ts (RSC) · service.ts (service role) · admin.ts
  stripe.ts           TIER_PRICES, checkout helpers
  hotel-programs.ts   Curated supplier perks catalog (Virtuoso, Belmond, etc.)
  collections.ts      Hotel collections per template
  blog.ts             Public blog reads (with revalidation TODO)
  seo.ts              Sitemap + metadata helpers
  tenant-paths.ts     URL composition per template — single source of truth
middleware.ts         Custom-domain → /t2|t3|t4/[agentId] rewrite + auth gating
supabase/migrations/  ~30 numeric migrations. Read latest 3 before any schema change.
scripts/              One-off seeders (hotels, villas) + image mirror utility
memory/               Long-lived conversational learning (separate from CLAUDE.md, see §11)
tasks/todo.md         Current active workstream (Meridian T3 overhaul as of May 2026)
```

**Top-level strategic docs** (treat as reference, not code):
- `Elite_Advisor_Hub_Executive_Summary.docx` — mission, tiers, status
- `Elite_Advisor_Hub_Feature_Matrix.xlsx` — module × tier matrix (authoritative)
- `elite-advisor-hub-saas-map.pdf` — 14-section lifecycle, gap dashboard, P1/P2/P3

---

## 6. Data model essentials

| Table | Purpose | Owner |
|---|---|---|
| `agents` | One row per advisor. Tier, Stripe IDs, template, `custom_domain`, `role` (`agent` / `admin` / `super_admin`) | System + self |
| `blog_posts`, `blog_categories` | Published content + taxonomy | Advisor + admin |
| `agent_blog_preferences` | Which categories an advisor surfaces | Advisor |
| `hotel_programs`, `featured_hotels`, `collections` | Global supplier catalog | Admin |
| `agent_hotel_program_selections` | Per-advisor supplier affinities | Advisor |
| `cruise_lines`, `villas` | Global catalogs | Admin |
| `supplier_tags`, `supplier_promos` | Filters & promo overlays | Admin |
| `inquiries` | Contact-form leads (per advisor) | Public → Advisor |
| `consultation_requests` | Custom/Agency sales leads from marketing site | Public → Admin |
| `edit_requests` | Advisor → admin change requests | Advisor → Admin |
| `admin_notifications` | Signup / churn / onboarding events | System |

**Three Supabase clients — use the right one:**
- `lib/supabase/client.ts` — browser, anon key, respects RLS.
- `lib/supabase/server.ts` — RSC, anon key with cookie auth, respects RLS.
- `lib/supabase/service.ts` — service-role, **bypasses RLS**. Never import from a Client Component.
- `lib/supabase/admin.ts` — admin-API helpers (creating users, etc.).

---

## 7. Non-negotiable conventions

1. **RLS is on for every table.** When adding tables, write the policies in the same migration. Use
   `super_admin` for "read all" admin policies, NOT a hardcoded UUID.
2. **Migrations are numbered + immutable once committed.** Never edit `001…N`. Add `N+1`.
3. **Tiers stack — never rebuild.** When adding a feature for Growth, check whether it should also
   appear (in reduced form) on Starter, and where it would slot in the Custom flagship. The Feature
   Matrix is the arbiter.
4. **Template isolation.** A `t3/*` component must not import from `t2/*`. Cross-template primitives
   live in `components/ui/`.
5. **URL composition goes through `lib/tenant-paths.ts`.** Don't build `/frontend/${agentId}/...`
   strings inline — past refactors got bitten by this (see `.claude/settings.local.json` for the
   grep that flushed them out).
6. **Public reads = SSR from Supabase.** Use `lib/supabase/server.ts` in server components. No
   client-side fetch on cacheable pages.
7. **`revalidatePath` after writes that affect public pages.** This is a known P1 gap — when you
   ship a write path (blog publish, profile update), wire the revalidate.
8. **Stripe webhook is the source of truth for billing state.** Don't infer subscription state from
   the client. `app/api/stripe/webhook/route.ts` writes back to `agents`.
9. **`hotels-missing-covers.csv` and `missing_hotel_images.csv` are backlogs, not dead files.**
   When adding hotel imagery, remove entries from these CSVs.

---

## 8. Current priorities (May 2026)

See `tasks/todo.md` for the active workstream. As of right now, **Meridian (T3) UI overhaul** is in
flight: design-system tokenization, mobile polish, deepening thin pages.

**Pre-launch P1 gaps** (from the SaaS map):
- `T3ServiceCards` component (blocks t3 Starter home)
- t2 curated variants of `HotelProgramsGrid` + `CruisePartnersGrid`
- On-demand revalidation (`revalidatePath` after writes)
- Stripe dunning on `invoice.payment_failed`
- Auto-provisioning after onboarding (currently manual 24–48h)
- Analytics on signup funnel (GA4 / PostHog)

**P2 launch-cut items** — domain auto-attach, Stripe Tax, reply composer in lead inbox.

When the user says **"P1 work"** they mean items in this list, in priority order.

---

## 9. How to verify changes

| Change type | Verification |
|---|---|
| TypeScript edit | `npx tsc --noEmit` (zero new errors) |
| UI change | Browser preview at **375px / 768px / 1280px**; spot-check ≥3 demo slugs (`t3-demo`, `t2-demo`, `casa-solis`, real: Wine & Wellness Travel) |
| Schema change | Apply migration locally, query the new table/column, confirm RLS with a non-admin token |
| Stripe change | Use Stripe test mode + `stripe listen` for webhooks; never test against live |
| Public-page write path | Confirm the corresponding `revalidatePath` call exists |

Lint: `npm run lint`. Dev: `npm run dev` (port 3000). Build: `npm run build` (catches RSC issues
that `tsc` misses).

---

## 10. Things that have burned us

- **Hardcoded `/frontend/${agentId}/...` URLs** scattered through pages. Fixed by routing through
  `lib/tenant-paths.ts`. If you see a fresh one, that's a bug.
- **Service-role key in client code.** Always check the file's directive — `'use server'` or RSC
  only for `lib/supabase/service.ts`.
- **Sanity is scaffolded but not active.** ~7k references exist. Do not extend Sanity without
  confirming with the operator whether it's being kept or removed.
- **Magic-link OTP only** — there is no password reset. If a user loses email access, only the
  operator can recover via service-role.
- **Demo agents** (`t2-demo`, `t3-demo`, `casa-solis`) are seeded fixtures. Don't mutate their rows
  in dev unless you also update `scripts/seed_*.js`.

---

## 11. CLAUDE.md vs. `memory/` — read this once

- **CLAUDE.md** (this file + nested ones in subdirectories) = **stable project constitution**.
  Always loaded. Edit only when the architecture, conventions, or strategy changes.
- **`memory/`** = **evolving learning across sessions**. Things you (Claude) discovered or were
  corrected on. Each entry is a small file with frontmatter; the index is `memory/MEMORY.md`. Loaded
  only when relevant. See the auto-memory section in the global system prompt for the schema.

Rule of thumb: if you'd say "this is true about EAH forever" → CLAUDE.md. If you'd say "Nick
prefers this style of pull request" or "the operator told me on May 10 to skip Sanity work" →
`memory/`.

---

## 12. Nested CLAUDE.md files

Subdirectory CLAUDE.md files extend (not override) this one and are loaded when work happens in
their tree. Current nested files:

- `app/CLAUDE.md` — App Router conventions, route ownership, RSC vs client component rules
- `components/CLAUDE.md` — Template isolation, design-token discipline, naming
- `supabase/CLAUDE.md` — Migration discipline, RLS patterns, common queries
- `lib/CLAUDE.md` — Which Supabase client to import where; data-fetching boundaries
- `app/agent-portal/CLAUDE.md` — Onboarding wizard contract, Tiptap config, Stripe portal handoff
- `app/admin/CLAUDE.md` — Super-admin RLS expectations, notification routing

(If any of the above don't exist yet, they will be created as the surfaces evolve. Ask before
writing a new one — the cost of a stale nested file is higher than its benefit.)

---

## 13. The operator

User profile in `memory/user_role.md`: operator + advisor (Wine & Wellness Travel). When the user
says **"add me"** / **"my site"** — that's Wine & Wellness Travel, real client record. Public info
from wineandwellnesstravel.com is fair game; ask before fabricating anything personal (legal name,
phone, CST, etc.). The @lesbourgeoistravel and "Bourgeois Traveler" handles have been retired —
all social presence has consolidated under Wine & Wellness Travel branding.

**First paying client / brand ambassador:** Eden For Your World (John Oberacker, edenforyourworld.com,
Growth tier on `frontend` template). When the user references "Eden" or "Eden's site," that's a
real agent — NOT the legacy `demo-agent` slug, which is stale and should be renamed.

---

## 14. Working principles (always-on)

Four behavioral guardrails for every task. Detailed version lives in the
`karpathy-guidelines` skill (`.claude/skills/karpathy-guidelines/SKILL.md`).

**Think before coding.** State assumptions explicitly. If multiple interpretations exist,
surface them — don't pick silently. If something is unclear, stop and ask. Don't manage
confusion silently.

**Simplicity first.** Minimum code that solves the problem. No features beyond what was
asked. No abstractions for single-use code. No "flexibility" or "configurability" that
wasn't requested. If a senior engineer would call it overcomplicated, rewrite it.

**Surgical changes.** Touch only what the request requires. Don't "improve" adjacent code,
comments, or formatting. Don't refactor things that aren't broken. Match existing style.
Clean up imports/variables your changes orphaned — leave pre-existing dead code alone
unless asked. Every changed line should trace directly to the user's request.

**Goal-driven execution.** Translate the task into verifiable success criteria before
starting. "Add validation" → "tests for invalid inputs pass." "Fix the bug" → "test that
reproduces it now passes." For multi-step work, state a brief plan with a verify step
per item.

For trivial tasks, use judgment — these guidelines bias toward caution over speed.
