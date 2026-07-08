# Studio services page + homepage banner + lead form

Done-for-you creative/marketing service ("Studio") sold on top of the EAH platform.
Source brief: `~/Desktop/EAH-Services-and-Pricing.md`. Built 2026-06-30.

## Palette (operator decision, 2026-07-07 — supersedes the earlier gold-only pass)
The brand is **purple AND gold together**, per `brand/EAH_Brand_Style_Guide.html` (which matches the
live homepage): purple `#7C3AED`/violet `#A78BFA` + lavender gradient carry **actions/emphasis**
(CTAs, hero headline accent, Most Popular, focus rings); gold `#B49A5A`/`#C9B07A` carries
**editorial accents** (eyebrows, labels, ✓ marks, prices, banner, dark-section glow). Warm neutrals
from globals.css. `docs/brand-positioning.md` §Visual identity now codifies this.

## Terminology (operator decisions)
- **Product name:** "Studio" — brand carried by "Elite Advisor Hub" in nav/footer. Route `/studio`.
- **Plan names:** Essential ($950) · Professional ($1,850, most popular) · Full Service ($3,500)
  + Agency (from $6,000, custom). Operator wanted simple/recognizable — dropped the draft's
  Presence/Signature/**Atelier** ("atelier" is on the brand-voice no-list).
- Lead `source` discriminator value: `studio`.

## What shipped
- [x] **Migration 052** — `consultation_requests.source` CHECK extended with `'studio'`; new nullable
  `plan_interest` column (essential|professional|full-service|agency|unsure). No new RLS needed.
- [x] **lib/actions/studio.ts** — `submitStudioInquiry`, mirrors beta-waitlist (anon server client,
  RLS public insert). Maps business→agency_name, site→existing_website, plan→plan_interest. Honeypot.
- [x] **lib/email.ts** — `sendStudioInquiryNotification` (emails operator on each lead, reply-to = lead).
- [x] **components/marketing/StudioInquiryForm.tsx** — name/email/phone/business/site/plan/message;
  pre-selects plan from `?plan=` and from the in-page `studio:select-plan` event fired by pricing CTAs.
- [x] **components/marketing/StudioPricing.tsx** — 3 plan cards + Agency callout, monthly/annual
  toggle (annual = 2 months free), gold accent.
- [x] **app/studio/page.tsx** — hero, positioning, pricing, full comparison table, how-it-works,
  add-ons + à la carte, scope boundaries, lead form. `buildMarketingMetadata`. Registered in sitemap.
  - Hero: full-bleed bg `/media/hero images/four-seasons-taormina-pool_2-hero.jpg` (previously unused
    anywhere) + dark overlay + light text. Form section: two-column with `/four-seasons-hero.jpg`
    (also previously unused) as a side/stacked image panel. Both verified 0 refs before use.
- [x] **components/marketing/StudioBanner.tsx** + app/page.tsx — dismissible gold promo strip above
  the nav. Uses `--eah-banner-h` CSS var (default 0px everywhere) so MarketingNav offsets cleanly;
  zero impact on other pages. Dismissal remembered in localStorage.
- [x] **MarketingNav.tsx** — nav top + mobile-sheet top/maxHeight now read `--eah-banner-h`.
- [x] **Admin** — `/admin/consultations` list (Studio source chip + plan_interest) and `[id]` detail
  (Studio section, source-aware subtitle).

## Verification
- `npx tsc --noEmit` — clean.
- Preview (375 / ~800 / desktop): /studio hero, pricing (stacks <980px), comparison table
  (h-scrolls on mobile), form all render; plan pre-select event works; homepage banner sits above
  nav (nav top → 40px), dismiss removes it (nav → 0px) + persists; mobile collapses banner text.

## OPEN — before the form can save leads
- **Migration 052 must be applied to the database.** Per `memory/project_migrations_not_auto_applied.md`
  CI auto-applies new migrations on push to main. Until 052 lands, the form insert (which references the
  new `plan_interest` column + `source='studio'`) will fail. Live insert + admin email were NOT tested
  against the un-migrated prod DB. Verify one real submission after 052 is applied.
- No cover/OG image on /studio (operator said no images) — add an OG image later for social shares.
- Branch: built on `hotel-programs-db-source-of-truth` working tree; not committed.
