# Wire up Stripe annual checkout

## Context

We just shipped a Monthly/Annual toggle on the marketing pricing section
(`components/marketing/MarketingPricing.tsx`). The UI shows annual prices and
"Save $X/yr" callouts, but the **Annual** CTA currently routes to
`/schedule-consultation?tier=X&billing=annual` because Stripe annual price IDs
don't exist yet. Your job is to wire it up end-to-end so Annual goes straight
to a real Stripe checkout, just like Monthly does today.

The discount level is **16.7% — "2 months free"** (pay for 10 months, get 12).
Don't change this number — it's been chosen deliberately to stay above
Founding pricing and below Webflow/Squarespace's commodity-level discounts.

## Annual prices (already reflected in the UI — match these in Stripe)

| Tier | Monthly | Annual (one charge / yr) | Effective $/mo |
|---|---|---|---|
| Starter | $89 | **$890** | $74 |
| Growth  | $179 | **$1,790** | $149 |
| Custom  | $349 | **$3,490** | $291 |
| Agency  | — | — (consultation only) | — |

Setup fees stay the same as monthly (one-time on first invoice):
$499 / $1,499 / $2,999.

## What's already done — don't redo

- `components/marketing/MarketingPricing.tsx` — toggle UI, annual price display,
  `Save $X/yr` callout, CTA branching on cycle. **Read this file first** —
  the pricing data lives here (`PRICING_TIERS`).
- The Annual CTA currently calls `Link` to consultation; you'll be replacing
  that with a `<CheckoutButton tier={…} billingCycle="annual" />` once the
  CheckoutButton supports it.

## Files you'll touch

1. **Stripe dashboard** (live mode) — create 3 new recurring prices on the
   **existing** products. Do **not** create new products; reuse:
   - Starter product: `prod_UL1AMnVvNsNdOS` → new price `$890/year`
   - Growth product:  `prod_UL1CqmRyDAyIsY` → new price `$1,790/year`
   - Custom product:  `prod_UL1Dq1k2RMpTfI` → new price `$3,490/year`

   Capture the three resulting `price_…` IDs. Use the Stripe CLI or web UI;
   ask me for the IDs if you can't create them yourself.

2. **`lib/stripe.ts`** — extend `TIER_PRICES` to include an `annual` key per
   tier (alongside the existing `monthly` and `setup`). Keep the comment style
   that's there. Example shape:

   ```ts
   starter: {
     monthly: 'price_1TX7jk8v2wD2qM7NPeCGVf4z',   // $89/mo
     annual:  'price_…',                          // $890/yr — NEW
     setup:   'price_1TX7kB8v2wD2qM7Nt2qubW0a',   // $499 one-time
     product: 'prod_UL1AMnVvNsNdOS',
   },
   ```

   Agency stays `''` for `annual` (consultation-only — preserve the existing
   TODO comment).

3. **`app/api/stripe/checkout/route.ts`** — accept an optional
   `billingCycle: 'monthly' | 'annual'` field on the POST body. Default to
   `'monthly'` for backward compatibility. Pick `prices.annual` vs
   `prices.monthly` based on the cycle. Reject the request with a 400 if
   `billingCycle === 'annual'` for a tier that has no annual price configured
   (agency, or any tier whose annual price string is empty). The setup-fee
   line item stays the same on both cycles. The founding-plan branch is
   monthly-only and should reject `billingCycle: 'annual'` with a clear error.

4. **`components/stripe/CheckoutButton.tsx`** — add an optional
   `billingCycle?: 'monthly' | 'annual'` prop (default `'monthly'`), pass it
   through to the `fetch` body. No visual changes.

5. **`components/marketing/MarketingPricing.tsx`** — in `PricingCta`, replace
   the annual-cycle `<Link>` branch for self-serve tiers (`cta === 'checkout'`)
   with a `<CheckoutButton tier={…} billingCycle="annual" popular={plan.popular}>
   Begin Setup</CheckoutButton>`. Custom (`cta === 'consultation'`) keeps its
   consultation link in both cycles. The label can stay "Begin Setup" or
   become "Start Annual Plan" — your call, but keep it consistent.

## Verification (don't skip)

- `npx tsc --noEmit` — must be clean
- `npm run lint` — must be clean on the changed files
- `npm run build` — must succeed locally; this catches RSC boundary issues
  that `tsc` misses
- **Stripe test-mode end-to-end:** create equivalent test-mode prices, run
  `stripe listen --forward-to localhost:3000/api/stripe/webhook`, click each
  tier's Annual CTA, complete checkout with `4242 4242 4242 4242`, confirm:
  - The Stripe invoice shows the correct annual line item + setup fee
  - The webhook fires `customer.subscription.created` with the right `tier`
    metadata
  - The `agents` row reflects an `annual` interval (you may need to persist
    `billingCycle` to the row — check `app/api/stripe/webhook/route.ts` and
    decide whether the schema needs a column for it, or whether reading
    `subscription.items[0].price.recurring.interval` at query time is enough)
- **Monthly checkout still works** — regression-test that the unchanged
  monthly path still completes for at least Starter.

## EAH conventions to honor (per repo `CLAUDE.md`)

- Stripe webhook is the source of truth for billing state — don't infer
  subscription state on the client.
- If you add a column to `agents` for billing interval, write a new numbered
  migration (don't edit existing ones), include RLS in the same migration,
  and use `super_admin` for any admin read policy.
- The `lib/supabase/service.ts` import is server-only — never let it land in
  a client component.

## Out of scope (don't do these)

- Don't change the discount level or the prices in the UI — they're locked.
- Don't touch the agent-portal billing page in this PR; that's a separate
  upgrade-flow task.
- Don't wire annual for Agency — it stays consultation-only.
- Don't create a "switch to annual" flow for existing monthly subscribers
  yet — that's a Stripe `subscription.update` flow with proration, separate
  PR.

## Deliverable

A single PR with the Stripe price IDs added, the route + button + pricing UI
updated, and a short note in the PR description listing the three new
`price_…` IDs (live mode) so I can verify them in the dashboard.
