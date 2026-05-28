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
