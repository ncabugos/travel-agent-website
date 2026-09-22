# EAH Business Model v2 — Land, Expand, Monetize the Network

> **September 2026 update (v2.1): three public tiers.** The one-plan offer below was replaced
> on 2026-09-22 by three tiers on the homepage `#pricing` section (`PUBLIC_TIERS` in
> `lib/pricing.ts`, rendered by `components/marketing/MarketingPricing.tsx`):
>
> | Tier | Setup | Monthly | Internal key |
> |---|---|---|---|
> | Starter | $1,499 | $59 | `starter` |
> | Boutique Agency (highlighted, "Most popular") | $2,500 | $79 | `growth` |
> | Agency | $4,999 | Quoted on number of sites, never shown | `agency` |
>
> Positioning: "The site your CRM doesn't give you." Rationale: Starter sits above CRM tools
> (TravelJoy, Tern) but those are not sites; against a freelance build ($800 to $6,500 upfront
> plus $20 to $5,000/mo maintenance) $1,499 to launch is cheap and $59/mo replaces an open-ended
> bill. Boutique Agency undercuts a custom agency build by half. Agency beats a ten-advisor
> shop's Travefy bill before they have paid for a single website; use that math in outreach,
> not on the site. Feature lists live in `CLAUDE.md` §3.
>
> Still on the old model until wired: Stripe (bills the $79 no-setup base plan with the
> 30-day complimentary period), the portal billing page, and the Stripe section below.
> Open: per-tier prices, setup-fee line items, whether the complimentary period survives.
> Listed but not built: YouTube integration, CRM integration, white-label, per-advisor lead
> routing, affiliate site management.

> Adopted July 2026. Supersedes the tier-ladder pricing in `docs/brand-positioning.md` §"Why this
> works for a $89 Starter tier" and the May 2026 tier matrix in `CLAUDE.md` §3.
> Reference model: HubSpot (cheap land, paid expansion, ecosystem revenue) and
> ApproachGuides (supplier-funded advisor network — approachguides.com/clients-partners).

---

## The model in one line

Sell the site nearly at cost to grow the advisor network fast, make expansion revenue self-serve
in the portal, and make luxury suppliers the profit engine once the network has scale.
**The site is the land; the portal is the store; the network is the product.**

## Layer 1 — The Site (land)

One public entry product. No tier maze, no setup fee, no four-figure number at signup.

- **$79/month. No setup fee. First 30 days complimentary** ("with our compliments" — never
  "free trial" in copy). Card on file at signup; Stripe auto-converts on day 30.
- Includes: custom-branded site on the advisor's domain, full supplier catalog (hotel programs),
  journal + editor, lead inbox, advisor portal.
- **Agency** remains consultative/quoted (from $899/mo) — different buyer, different sale.
- Deliberately thin margin. Its only job is advisor count: supplier revenue (Layer 3) is not
  sellable below ~30 installed advisors.

Internal note: Growth/Custom tier machinery stays in the codebase for feature gating and
grandfathered accounts (Eden For Your World keeps founding-growth terms). They are no longer
marketed as public tiers.

## Layer 2 — Portal expansion (expand)

À-la-carte modules and services, purchased from inside the agent portal.

**Monthly modules** (map internally to existing tier gates until per-module entitlements ship):

| Module | Price | Legacy gate |
|---|---|---|
| Curated editorial stream (1 post/week) | $49/mo | Growth |
| Editorial+ (2/week + topic requests) | $99/mo | Custom |
| Searchable hotel + cruise directories (1,795+ properties) | $39/mo | Growth |
| Instagram feed | $19/mo | Growth |
| Villa catalog | $29/mo | Custom |

A fully-loaded advisor lands ≈ $235–295/mo — the old Growth–Custom band, without the cliff
between $89 and $179.

**Services** (one-time / retainer — Studio pulled forward from Phase 3 into the portal):
new custom page from $450 · design refresh from $750 · social media management from $500/mo ·
bespoke landing pages · email marketing. Order intake rides the existing `edit_requests` flow;
invoicing is manual until Stripe prices exist per service.

## Layer 3 — Supplier partnerships (monetize the network)

Luxury suppliers pay for placement and distribution across the advisor network
(the ApproachGuides play):

- **Featured brand placement** — homepage collections, catalog priority, promo overlays.
  `supplier_promos` / `featured_hotels` already model this; today it is given away.
- **Sponsored editorial** — a supplier feature published across every opted-in advisor journal
  in one push, FTC-disclosed. The curated-stream pipeline is the distribution mechanism.
- **The pitch is measurability** — per-tenant GA4 + the platform property support
  "X advisor sites, Y qualified luxury pageviews, attributable clicks to your brand."
- Indicative pricing: featured placement $1,500–3,000/quarter; sponsored editorial
  $750–1,500/post network-wide. At 50 advisors × 6 partners ≈ $40–60k/yr near-pure margin.
- Warm first calls: brands already featured on advisor sites (Belmond, Windstar, Uniworld).

**The flywheel:** cheap entry grows the network → scale makes supplier inventory sellable →
supplier content enriches every advisor site at no advisor cost → richer sites attract advisors.

## Sequencing

1. **Now (Phase 1, shipped with this doc):** 30-day complimentary period, $0 setup, $79 base,
   marketing site restructured to one-plan + expansion menu, portal Services tab (request-based).
2. **Phase 2:** self-serve module billing (Stripe subscription items + per-module entitlement
   columns), trial-expiry gating on `subscription_status`, dunning on `invoice.payment_failed`.
3. **At ~30 advisors:** supplier media kit + first sponsored placements.

## Known risks / open items

- **Auto-provisioning is a prerequisite, not a P1 nice-to-have.** A volume trial funnel feeding a
  manual 24–48h hand-build breaks first. (CLAUDE.md §8.)
- **Founding-starter ($59/mo) is a $20/mo discount off the $79 base** again, now that the public
  price has moved up. It shares a Stripe price ID with the base plan until the $79 price is minted
  (see Stripe state below); the two must be decoupled at that point.
  Decide whether the beta funnel is still worth running.
- **Editorial COGS**: curated content at $49/mo must be modeled against production cost at scale.
- **Trial expiry is enforced only by Stripe auto-conversion** (card on file). No in-app gating on
  `subscription_status` yet — middleware gates auth only.
- **Grandfathering**: existing paying accounts keep their terms; never let a restructure read as
  a demotion.

## Stripe state (Phase 1)

- **2026-09-09: live $79/mo price `price_1UDsH76lYeMpqwzvvcrVbrqg` wired into
  `TIER_PRICES.starter.monthly`.** Founding-starter keeps `price_1TZg2r6lYeMpqwzvoUUoY30Z` ($59/mo).
  The 30-day trial is applied by the checkout route (`trial_period_days`), not by the price object.
- Starter annual and setup-fee price IDs are retired from public checkout (annual returns once a
  $790/yr price exists).
- Module + service prices have no Stripe IDs yet (Phase 2).
