# Meridian (T3) UI overhaul — plan

## Tier matrix change — May 2026 (logged for cross-session visibility)

- **Curated editorials are now hard-gated to Growth+.** Starter no longer gets the 1-post/month
  curated drumbeat; the journal module (M18) stays on Starter for advisor-written posts only.
  Upgrade to Growth is the only path to the curated stream.
- **Tiers are described by features, not by template.** Marketing surfaces should say
  "custom-branded site, features per tier" — never "Starter gets the frontend template" or
  "Growth gets Vista or Meridian." The internal template each build sits on is an implementation
  detail.
- **Agency's headline differentiator is the Agent Directory.** Call it out by name on every
  surface that compares tiers.
- Updated in this sweep: `CLAUDE.md` §3 · `Elite_Advisor_Hub_Feature_Matrix.xlsx` (Sheets 1 + 2,
  M18 + M32) · `components/marketing/MarketingPricing.tsx` · `components/marketing/MarketingCuratedEditorial.tsx`
  · `app/agent-portal/register/page.tsx` · `Beta_Invite_Personal_Email.md` ·
  `EAH_Onboarding_Email_Templates.md` (Email 1).
- Not touched: `app/templates/page.tsx` and `components/marketing/MarketingBrandedWebsite.tsx` —
  those are template showcases by purpose, not tier explainers.

## Done already (committed `ea27673`)
- [x] Removed "How to book" banner from program detail page
- [x] Removed eyebrow `———` dashes on program detail page (added `t3-eyebrow-plain` modifier)

## Workstream A — Hotel program detail page modules
Make T3 program detail match T2's content depth. Currently 6 sections; T2 has richer modules.

- [ ] **A1.** Add a "Featured properties" module — surface 4–6 representative hotels in the program with photo + name + city. T2 has `T2FeaturedProperties`; build `T3FeaturedProperties` in the Meridian aesthetic (editorial cards, less product-y).
- [ ] **A2.** Add a "Related journal posts" rail — pull 3 latest posts tagged with the brand or category. Reuse the existing `T3JournalTeaser` component or build a slim variant.
- [ ] **A3.** Inline the eligibility/booking notes lower in the CTA copy or as a small italic line under the CTA — don't lose the info, just don't banner it.
- [ ] **A4.** Add a quiet "Other programs you might consider" strip — 3 sibling programs from the same category with logo + name. Closes the loop instead of dead-ending at the CTA.

## Workstream B — Design-system standardization
Token-up the ad-hoc values that are causing inconsistency.

- [ ] **B1.** Add `--t3-content-narrow: 760px`, `--t3-content-prose: 820px`, `--t3-content-default: 1200px` tokens; sweep pages to replace inline `maxWidth: 760/820/1200` with these.
- [ ] **B2.** Add gap tokens: `--t3-gap-tight: 24px`, `--t3-gap: 48px`, `--t3-gap-loose: 80px`. Sweep grid `gap`/`rowGap` calls.
- [ ] **B3.** Standardize section vertical rhythm — most sections use `--t3-section-pad`; about page quote section + hero variants don't. Audit + normalize.
- [ ] **B4.** Standardize breakpoints: pick **single set** of `1024px` (tablet) + `720px` (phone). Currently pages use 600/640/720/900/1000/1024 inconsistently. Sweep all `@media` and inline breakpoint strings.

## Workstream C — Mobile polish
- [ ] **C1.** Fix fixed-pixel heights that don't scale: `app/t3/[agentId]/contact/page.tsx:15` (140px nav spacer), `about` quote section `minHeight: 520`.
- [ ] **C2.** Replace fixed `fontSize: 10/12/13/14` strings with `clamp()` or class tokens. Most offenders in `book-hotel/page.tsx` and `find-cruise/page.tsx`.
- [ ] **C3.** Audit grids that jump 3-col → 1-col with no 2-col tablet step (find-cruise listing, about stats). Add intermediate breakpoint.
- [ ] **C4.** Verify nav tap targets ≥ 44px and verify all CTAs are reachable on iPhone SE width (375px).

## Workstream D — Thin pages
- [ ] **D1.** Contact page (currently 2 sections): add a "what to expect" 3-step strip + a small testimonial above the form.
- [ ] **D2.** Plan-a-trip (3 sections): add a service tier comparison or a quote/proof block before the form.
- [ ] **D3.** Journal index (1 section): add an editor's intro paragraph + featured-post hero slot above the grid.

## Verification approach
After each workstream:
- Browser preview at 375px / 768px / 1280px widths
- Spot-check at least 3 program slugs (Aman, Four Seasons, Marriott)
- `tsc --noEmit` clean
- One commit per workstream, screenshots in commit body

---

# Business Model v2 — Phase 1 (July 2026)

Strategy: docs/business-model-v2.md (land $59 site / expand via portal / monetize supplier network).

- [x] docs/business-model-v2.md written (canonical)
- [x] lib/pricing.ts — central display-pricing constants (base, modules, services, agency)
- [x] Stripe: starter → $59 interim price ID (shared w/ founding-starter), no setup fee, 30-day trial + payment_method_collection on public starter checkout; webhook sets `trialing` for trialed standard checkouts
- [x] MarketingPricing.tsx rewritten — one plan + modules + services + agency, "with our compliments" voice, no toggle/ribbon/green badges
- [x] MarketingClosingCTA scarcity line → complimentary-30-days; "Explore Tiers" → "Explore Pricing"
- [x] ConsultationForm labels → v2 (tier submit values unchanged); billing toggle removed (monthly-only)
- [x] Portal billing page + admin AgentSubscriptionPanel stale prices fixed
- [x] Portal Services & Modules page (request-based ordering via edit_requests) + nav entry
- [x] brand-positioning.md + CLAUDE.md §3 updated

## Operator to-dos (Stripe dashboard)
- [x] Dedicated base $59/mo price live (price_1TvlHU6lYeMpqwzvVyDg1H42, 2026-07-21) — swapped into TIER_PRICES.starter.monthly
- [ ] Optional: $590/yr annual price if annual billing returns
- [x] Beta/founding funnel retired — /beta page, waitlist form/action, and waitlist email removed 2026-07-21; inbound links repointed to /#pricing

## Phase 2 — module entitlement backend (built 2026-07-21)
- [x] Migration 053: agent_modules table + RLS + agents.active_modules cache (applies via CI on push)
- [x] lib/tier-features: featureAllowed(tier, modules, feature) — tier bundle OR à-la-carte module
- [x] MODULE_PRICES map in lib/stripe.ts (EMPTY — modules stay request-only until operator mints the 5 prices)
- [x] /api/agent-portal/modules GET/POST/DELETE — prorated Stripe subscription items on the base sub
- [x] Webhook reconciles subscription items → agent_modules (+ cancels all on subscription.deleted)
- [x] Portal Services page: self-serve add/remove with request-flow fallback
- [x] Gates wired: T2 villa page, cruise directory split, Instagram section, nav/footer links, and the curated editorial stream in lib/blog.ts (now truly Growth+/module-gated; base plan sees own posts only)

## Phase 2 operator to-dos (Stripe dashboard)
- [x] 5 live module prices created + wired into MODULE_PRICES 2026-07-21 (price_1TvsG4…–price_1TvsG7…)

## Remaining backlog
- [ ] T3/T4 enforcement gaps (pre-existing): hotel directory ungated everywhere; T4 testimonials/Instagram hardcoded; T3/T4 cruise ungated
- [ ] Trial-expiry gating on subscription_status (middleware) + dunning on invoice.payment_failed
- [ ] Auto-provisioning (prerequisite for trial volume)
- [ ] Supplier media kit at ~30 advisors

## Homepage conversion redesign — Aug 2026 (branch fix/lead-capture-and-contact-obfuscation)
Source: `../Landing-Page-Conversion-Research.md`. Principles applied: clear benefit headline, one primary
goal (start the 30 days) with subordinate secondaries, direct-to-checkout CTA + click-trigger microcopy,
static hero (no slideshow), social proof strip above the fold, Hero → Problem → Plan → Proof → Benefits →
Offer → FAQ → CTA order, sticky mobile CTA, FAQ objection handling, purple reserved for CTAs (Von Restorff),
16px+ body, warm neutrals only.

- [x] CheckoutButton: accept `className`/`style` overrides
- [x] Hero rewrite (static image, left-aligned, checkout CTA, microcopy, proof strip)
- [x] MarketingHowItWorks (problem + 3-step plan)
- [x] MarketingProof (Eden For Your World in production + founder line + numbers)
- [x] MarketingFAQ (+ FAQPage JSON-LD)
- [x] MarketingStickyCTA (mobile-only, after hero)
- [x] Features/Demos restyle (no purple on non-CTA, no tier badges, 16px body)
- [x] Reorder sections; drop StudioBanner from `/`
- [x] MarketingClosingCTA primary → checkout; MarketingPricing CTA copy → first person
- [x] Verify: tsc, 375/768/1280 screenshots

Review (2026-08-17): tsc + eslint clean; verified 375/768/1280 via headless-Chrome CDP full-page captures
(Browser-pane screenshots went stale when the pane was hidden). Not done on purpose: no testimonial quote
(none exists yet — slot noted in MarketingProof); StudioBanner + HeroSlideshow left in place but unused on `/`.
Known dev-env: POST /api/stripe/checkout returns "No such price" locally (live price ID + test key) — pre-existing.
- [x] Web Interface Guidelines pass (2026-08-18): AA contrast sweep, `<main>` + skip link, `scroll-padding-top`,
      inert nav sheet + sticky CTA, nav focus management, CheckoutButton error/aria-busy state, demo thumbs → next/image,
      Curated Editorial rail keyboard/click controls (`ScrollRailControls`), sticky CTA hides over closing/footer,
      focus-visible rings, reduced-motion gating, `role="list"`, tabular nums, semantic lists in Pricing/Studio promo
- [ ] Pre-existing lint errors (not homepage): StudioBanner/StudioInquiryForm/StudioServices `set-state-in-effect`, SupportForm unescaped `'`

---

## Hotel-programme catalogue repair — 2026-08-31

Triggered by "Six Senses has no image content" on wineandwellnesstravel.com/book-hotel/six-senses.
Root cause was data, not assets: the shared `hotel_programs` rows were incomplete.

- [x] Six Senses: `image_url` + 11 `slider_images` from `public/media/hotel-programs/six-senses`
- [x] Jumeirah Passport, Preferred Hotels & Resorts, Couture: hero + 10 slides each
- [x] Benefits filled for the 4 programmes that had `benefits: []` — all 24 now have them
- [x] **Cross-tenant brand leak fixed.** 19 rows hardcoded "Eden for Your World" in
      `eligibility_notes` / `booking_notes`, and the t2 book-hotel + find-cruise promo fallbacks
      hardcoded it in template code. `hotel_programs` is a single global catalogue shared by every
      advisor, so it now uses the `{{agency_name}}` token (same convention as blog shortcodes),
      resolved per-advisor via `applyAgencyTokens()` in `lib/hotel-programs.ts`.
- [x] `Couture` → `Couture by Langham`. The row described it as "the most exclusive tier of the
      Preferred collection", which is wrong — the logo and `public/media/hotel-programs/couture-by-langham`
      confirm it is Langham Hospitality Group's advisor programme.
- [x] `T2BenefitsGrid` redesigned: white band, centred, no cards/borders/fills. Flex-wrap rather
      than a fixed grid so an incomplete final row stays centred (programmes carry 4–8 benefits).

### Needs operator verification
Benefit copy for Six Senses / Jumeirah / Preferred / Couture was written from the standard
preferred-partner amenity structure these programmes publish, not from the consortium portal.
The credit lines say "typically USD 100 equivalent" — confirm the real value per programme before
treating them as a client-facing promise.
