# EAH Beta Launch — Build Kit

Two things in this file:

- **Part A — Founding Advisor Pricing Approach.** The detailed Stripe implementation plan
  for the beta offer.
- **Part B — Claude Code Prompts.** Paste-ready prompts to build the code-side checklist
  items, plus the manual (non-code) setup that runs alongside.

Companion files: `EAH_Advisor_Onboarding_and_Beta_Launch_Strategy.docx`,
`EAH_Onboarding_Email_Templates.md`, `EAH_Social_Content_Calendar.xlsx`.

---

# Part A — Founding Advisor Pricing Approach

## The goal

Deliver the beta offer: **$0 setup fee, 3 months free, then a locked founding rate held
for the life of the subscription**, with a card on file from day one that auto-converts
at month 4. Invitation-only — not claimable by the public.

## The mechanism: dedicated founding prices + a 90-day Stripe trial

**Do not use coupons for this.** A Stripe coupon has a single duration — `once`,
`repeating` (N months), or `forever`. It cannot express "100% off for 3 months, then
~33% off forever." Stacking two coupons isn't cleanly supported in Checkout, and a
percentage coupon would also discount the setup fee.

Instead, the discount is not a discount at all — it is simply a different price:

1. Create new recurring **founding prices** in Stripe at the discounted monthly rate.
2. Start the subscription with a **90-day free trial** (`trial_period_days: 90`).
3. **Omit the setup-fee line item** entirely for founding checkouts.

This makes "locked for life" automatic. The subscription sits on the founding price
indefinitely; there is no coupon to expire and nothing to re-apply.

## What to create in Stripe (test mode first)

On the **three existing products** already referenced in `lib/stripe.ts`
(`prod_UL1A…` Starter, `prod_UL1C…` Growth, `prod_UL1D…` Custom), add one new recurring
monthly price each. Keep them on the same products so revenue reporting stays unified.

| Price nickname | Amount | Product |
|---|---|---|
| `founding-starter` | $59 / mo | Starter product |
| `founding-growth` | $119 / mo | Growth product |
| `founding-custom` | $249 / mo | Custom product |

No new setup-fee prices are needed — the founding setup fee is $0, handled by leaving
the setup line item out of the Checkout session.

## How a founding checkout differs from a standard one

The current `app/api/stripe/checkout/route.ts` builds a subscription session with two
line items (monthly + setup fee) and `allow_promotion_codes: true`. A founding session
changes four things:

| Setting | Standard checkout | Founding checkout |
|---|---|---|
| Line items | monthly price + setup price | founding monthly price **only** |
| `subscription_data.trial_period_days` | none | `90` |
| `payment_method_collection` | default | `'always'` — forces card capture even though $0 is due today |
| `subscription_data.metadata` | `{ tier }` | `{ tier, plan: 'founding', cohort: 'beta-1' }` |
| `allow_promotion_codes` | `true` | `false` — the deal is already baked into the price |

At day 90 Stripe automatically charges the founding price and the subscription continues
at that rate. No re-sell conversation, no manual step.

## Gating — keep it invitation-only

The founding deal must not be claimable by the public. **Recommended:** the operator
generates a one-time Checkout link per invited advisor from the admin console — a small
admin action that calls the checkout route with `plan=founding` for a specific tier.
That link goes into Email 2. The public `/#pricing` checkout path stays untouched on the
standard prices. This avoids a guessable promo code and keeps the four beta seats
controlled.

## Data model

Add two columns to `agents` in a new numbered migration (next number is **031**), with
RLS policies written in the same migration per the project conventions:

- `plan text not null default 'standard'` — values: `standard` | `founding`
- `beta_cohort text` — e.g. `beta-1`, nullable

The Stripe webhook writes `plan` and `beta_cohort` onto the agent record from the
subscription metadata.

## Billing lifecycle (webhook)

`app/api/stripe/webhook/route.ts` is the source of truth for billing state. Handle:

- `checkout.session.completed` — subscription created in `trialing` status; write the
  agent's tier, `plan`, `beta_cohort`, and subscription status.
- `customer.subscription.trial_will_end` — Stripe fires this ~3 days before day 90.
  Optional: send a courtesy email ("your founding rate begins in 3 days").
- `invoice.payment_succeeded` at trial end — subscription flips to `active`; existing
  status sync covers it.
- `invoice.payment_failed` — the known P1 dunning gap. For four advisors this can be
  handled manually, but it is worth wiring while you are in this file.

## The numbers

Assuming the recommended cohort of **1 Starter + 2 Growth + 1 Custom**:

| | Founding | Standard equivalent |
|---|---|---|
| Recurring / mo (after free quarter) | $546 | $796 |
| Setup fees | $0 | $6,496 one-time |
| First 90 days | Free | — |

The beta "costs" roughly **$6,496 in forgone setup fees**, a **~$250/mo ongoing
discount**, and **one free quarter (~$1,638 of value)**. That is the price of four
testimonials, two portfolio-grade case studies, up to eight referral introductions, and
a validated onboarding system. It is a reasonable customer-acquisition investment, not a
loss.

## Decision to lock in

**"For life" = as long as the subscription stays continuously active.** If it lapses,
re-subscription is at the standard rate. This is automatic with the price-based approach
and is a strong retention hook. State it plainly in the one-page Founding Advisor
Agreement so there is no ambiguity later.

## Test plan

Stripe **test mode only** — never test against live. Use `stripe listen` for webhooks.

1. Generate a test founding checkout link; confirm $0 due today and that a card is still
   captured.
2. Confirm the subscription is created in `trialing`, with `trial_end` ~90 days out and
   `plan`/`cohort` metadata present.
3. Use a Stripe **test clock** to fast-forward 90 days; confirm the auto-charge lands at
   the founding price and the subscription flips to `active`.
4. Confirm the agent record shows `plan = 'founding'` and the correct `beta_cohort`.

---

# Part B — Claude Code Prompts

Prompts to run in the EAH repo to build the code-side checklist items. Use them with
Claude Code in the repo root.

**How to use these:**

- Run them **one at a time**, in order. Prompt 2 depends on Prompt 1.
- Each is scoped to one PR. **Review the diff before merging.**
- Every prompt assumes Claude Code reads `CLAUDE.md` (and any nested `CLAUDE.md`) first
  and follows the project conventions — numbered immutable migrations, RLS in the same
  migration, `lib/tenant-paths.ts` for URLs, `revalidatePath` after public-page writes,
  and verification with `npx tsc --noEmit` plus `npm run build`.

---

## Prompt 1 — Stripe Founding Advisor pricing

```
Read CLAUDE.md and the nested CLAUDE.md files first, then implement the "Founding
Advisor" beta pricing path. Background and the full approach are in
EAH_Beta_Launch_Build_Kit.md, Part A — read it before starting.

Scope:
1. In Stripe TEST MODE, I have created (or will create) three new recurring monthly
   prices on the existing starter/growth/custom products: founding-starter $59,
   founding-growth $119, founding-custom $249. Add a FOUNDING_PRICES map (or a
   `founding` sub-key on TIER_PRICES) in lib/stripe.ts with placeholder price IDs and a
   clear TODO to paste the real test-mode IDs.
2. Add migration 031 adding to `agents`: `plan text not null default 'standard'`
   (standard | founding) and `beta_cohort text` nullable. Write the RLS policy updates
   in the same migration; do not edit any existing migration.
3. Update app/api/stripe/checkout/route.ts to accept an optional `plan: 'founding'` in
   the POST body. When plan is 'founding': use the founding monthly price only (no
   setup-fee line item), set subscription_data.trial_period_days = 90,
   payment_method_collection = 'always', subscription_data.metadata =
   { tier, plan: 'founding', cohort: 'beta-1' }, and allow_promotion_codes = false.
   Standard checkout behavior must be unchanged when plan is absent.
4. Update app/api/stripe/webhook/route.ts to read plan and cohort from the subscription
   metadata and persist them onto the agent record, and to handle the
   customer.subscription.trial_will_end event (log it for now; leave a TODO for the
   courtesy email).

Constraints: Stripe test mode only — never touch live. Keep the standard pricing path
untouched. Verify with `npx tsc --noEmit` and `npm run build`. Summarize what changed
and list anything I need to do manually in the Stripe dashboard.
```

---

## Prompt 2 — Admin: generate a founding checkout link per advisor

```
Read CLAUDE.md and app/admin/CLAUDE.md first. Depends on Prompt 1 being merged.

Add an admin-only action so I can generate an invitation-only Founding Advisor checkout
link for a specific advisor. In the admin console (app/admin), on the agent
detail/management view, add a "Generate Founding Advisor checkout link" control that
lets me pick a tier (starter/growth/custom) and produces a Stripe Checkout URL by
calling the checkout route with plan: 'founding'. Display the URL so I can copy it into
the Welcome email.

Requirements: the action must be restricted to super_admin via RLS / server-side auth
checks — it must not be reachable by an advisor. Do not expose the founding plan on any
public page or the public /#pricing checkout. Verify with `npx tsc --noEmit` and
`npm run build`. Tell me if any server action or API route needs an auth guard I should
double-check.
```

---

## Prompt 3 — Beta waitlist landing page

```
Read CLAUDE.md and app/CLAUDE.md first.

Build a public beta waitlist landing page at /beta (app/beta/page.tsx). It should
explain the Founding Advisor beta briefly and let an interested advisor submit their
name, email, business name, and current website URL. On submit, write a row to the
existing consultation_requests table.

First inspect the consultation_requests schema (migration 022) and lib/actions/
consultation.ts to reuse the existing insert pattern. If consultation_requests has no
way to distinguish a beta-waitlist signup from a Custom/Agency sales lead, add a
`source` or `lead_type` text column in a new numbered migration (use the next available
number) with an RLS-safe default, and set it to 'beta-waitlist' for these submissions
so they show up correctly in app/admin/consultations.

Match the EAH brand and the marketing site's existing visual style. The page is the
link-in-bio destination, so make it fast and mobile-first. Confirm the admin
consultations view renders the new submissions. Verify with `npx tsc --noEmit` and
`npm run build`, and check the page at 375px / 768px / 1280px.
```

---

## Prompt 4 — Public template showcase page

```
Read CLAUDE.md, app/CLAUDE.md, and components/CLAUDE.md first.

Build a public template showcase page at /templates (app/templates/page.tsx) that
presents the three templates — Vista (t2), Meridian (t3), and Casa Solis (t4) — each
with a short description and a "View live demo" link. Use the seeded demo agents
(t2-demo, t3-demo, casa-solis) for the demo links, and compose every URL through
lib/tenant-paths.ts — do not hand-build /t2/[agentId] strings.

This page is a primary sales asset and the destination for marketing posts and the
invitation emails, so it must look polished and load fast. Match the marketing site's
visual style. Add appropriate SEO metadata via lib/seo.ts and make sure it is included
in the sitemap. Verify with `npx tsc --noEmit` and `npm run build`, and check it at
375px / 768px / 1280px.
```

---

## Prompt 5 — Wire the onboarding emails into Resend

```
Read CLAUDE.md and lib/CLAUDE.md first.

The file EAH_Onboarding_Email_Templates.md in the repo root contains seven onboarding
emails (Beta Invitation, Welcome & Register, Intake Received, Intake Reminder, Site
Preview, You're Live, Week-2 Check-in) plus a Custom/Agency Consultation variant.

Add these as branded, reusable templates in lib/email.ts using the existing Resend
setup. Match the existing email-sending pattern in that file. Build a simple shared
branded HTML wrapper (centered EAH logo, a thin gold rule, the signature block from the
template file) and render each email's copy inside it. Expose a typed function per
email that accepts the merge fields used in the template ({{First Name}}, {{Brand
Name}}, {{Tier}}, {{Portal Link}}, {{Intake Link}}, {{Preview Link}}, {{Consult Link}},
{{Site URL}}).

Do not send anything automatically yet — just make the functions available so I can
trigger them manually or wire them later. Verify with `npx tsc --noEmit`. Tell me which
env vars or Resend config (verified sending domain, from-address) I need to confirm
before these can send.
```

---

## Prompt 6 — Audit the registration and onboarding flow

```
Read CLAUDE.md and app/agent-portal/CLAUDE.md first. This is an AUDIT — do not change
code yet; report findings.

I'm about to invite four beta advisors. Before I do, trace and report on the path an
advisor takes from receiving a portal link to a provisioned site:

1. The magic-link OTP account creation / registration flow — does it work end to end
   for a brand-new advisor, and what exactly does the portal link in an email need to
   point to?
2. The five-step agent-portal onboarding wizard — what does it require, and does it
   assume a Stripe checkout has already completed (the founding checkout from Prompt 1
   redirects to /agent-portal/onboarding)?
3. The handoff from a completed onboarding wizard to a live, provisioned site — what is
   manual today, and what would block a beta advisor from going live?

Give me a punch list of anything broken, missing, or manual that I need to handle for a
four-advisor beta. Don't fix anything — just report.
```

---

## Manual setup (not Claude Code)

These run in parallel with the prompts above and must be done before Email 1 goes out:

- **Lock + document the Founding Advisor offer** — finalize the pricing in Part A and
  write the one-page Founding Advisor Agreement (the "for life = continuously active"
  clause, testimonial/referral expectations).
- **Create the three founding prices in Stripe** (test mode first, then live) and paste
  the IDs into `lib/stripe.ts` where Prompt 1 left the TODO.
- **Scheduling link** — set up a "Founding Advisor Conversation" event in Calendly (or
  similar) for the `{{Consult Link}}` field.
- **Build the Tally intake form** from the question bank in the strategy doc, Part 3.
- **Set up the Notion intake tracker** — one row per advisor, status field.
- **Domain email authentication** — confirm SPF, DKIM, and DMARC are set so the
  invitations don't land in spam; confirm the Resend sending domain is verified.
- **Finalize the four advisor names** (Eden is locked as Advisor 1).

## Suggested sequence

1. Prompt 1 → Prompt 2 (Stripe pricing, then the admin link generator).
2. Prompt 3 and Prompt 4 (waitlist + showcase — independent, can run in either order).
3. Prompt 5 (emails).
4. Prompt 6 (audit) — run last so it reflects the new checkout redirect.
5. Manual setup throughout. Do not send Email 1 until Prompt 1's Stripe path is tested
   and the founding price IDs are live.
