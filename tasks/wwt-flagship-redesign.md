# Wine & Wellness Travel — flagship redesign → live on wineandwellnesstravel.com

> Goal: rebuild WWT as a bespoke, custom-grade T2 site that looks and feels nothing like the
> other demos — an Aman-grade calm shell wrapped around a human-advisor concierge and forward-
> looking interaction design. Every module redesigned on the front end; **all supplier data pulled
> from the live DB** (no faked logo walls). Then promote it to the production domain.

---

## 0. Decisions (LOCKED 2026-06-23)

1. **AI "Plan with me" concierge** — ✅ build in v1 (needs Anthropic API key + budget).
2. **Live tier** — ✅ `agents.tier = 'custom'` on the real record.
3. **Design palette** — ✅ Wine & Wellness warm adaptation of the Aman system (bordeaux + sage accents, sparing).

---

## 1. The thesis (non-negotiable design DNA)

Aman + 2026 luxury UX point the same way: **quiet, warm, slow, curated, human.** The innovation is
NOT flashy AI — it's a calm, restrained, photography-led shell around a conversational concierge
that *qualifies and hands off to the real advisor*. AI does logistics; design + the human do luxury.

Voice (per `docs/brand-positioning.md` + `feedback_luxury_direct_voice.md`): direct, restrained,
specific. Name real regions, retreats, river lines. **Banned:** "atelier", "the house", "dream
vacation", literary sentence fragments, "affordable/all-in-one/game-changer", template energy.

---

## 2. Architecture — how it goes live cleanly (no hardcoded UUIDs)

Today: `wineandwellnesstravel.com` → middleware rewrites `/` → `/t2/<UUID>`. The bespoke slug
special-cases (`wwt-demo`, `lido-collective`) key off literal slugs, so the **real domain falls
through to the generic Vista layout at Starter gating** — the bespoke build never serves the domain.

Clean fix (avoids scattering literal IDs, per CLAUDE.md §5/§10):
- **Add `agents.bespoke_layout text` column** (migration). Value `'wwt'` selects the WWT homepage.
- In `app/t2/[agentId]/page.tsx`, resolve the agent, and branch on `agent.bespoke_layout` (not slug
  string) → render `<WWTHomeV2 />`. The `wwt-demo` mock keeps working for staging via the same flag
  on its mock record.
- **Set `agents.tier = 'custom'`** on the real record (`14385e4b-…`) so nav + any reused gated
  components behave correctly.
- **Rollout:** build + verify on the `wwt-demo` staging slug first; flip the production record's
  `bespoke_layout` only when signed off. Never push a half-built site to the live domain.

---

## 3. Design system — `--wwt-*` tokens (new, template-scoped)

Adapt the Aman system to wine + wellness. Warm neutral ground, light serif display, uppercase
eyebrow labels, vast whitespace, full-bleed muted photography, slow 600–900ms fade-rise motion,
borderless letter-spaced links. Restrained bordeaux/umber + sage accents used sparingly.

```
--wwt-paper   #F5F1EA   warm paper ground (never #fff)
--wwt-paper-2 #ECE6DB   alternating band
--wwt-sand    #D8CDBC   dividers/fills
--wwt-clay    #B49A7E   hairlines
--wwt-stone   #8A8073   muted text / eyebrow
--wwt-ink     #2A2723   primary text (warm charcoal, never #000)
--wwt-bordeaux#5E2A33   sparing wine accent
--wwt-sage    #6E7561   sparing wellness accent
font-display: Cormorant Garamond / Canela (300–400, large, tight leading)
font-sans:    Inter / Söhne (body 1.7 line-height, eyebrow uppercase 0.2em)
--space-section: clamp(6rem,12vw,12rem)   --measure: 68ch
reveal: translateY(20px)+fade, 800ms cubic-bezier(.22,1,.36,1), gated by prefers-reduced-motion
```

Build as `components/t2/wwt2/` + a scoped stylesheet. **No `t2/*`→other-template imports.**

---

## 4. Modules — every one redesigned, every one DB-wired

| # | Module (redesigned) | Data source (LIVE DB) | Notes |
|---|---|---|---|
| 1 | Cinematic hero (atmospheric video/photo, light serif) | agents (profile) | reduced-motion → still |
| 2 | **"Plan with me" concierge** (decision #1) | LLM → writes `inquiries` | curated cards + human handoff |
| 3 | Advisor-as-voice (`<AdvisorNote>`, signature, optional video) | agents | human-proof moat |
| 4 | Curated-three hotels (not catalog-50) | `hotel_programs` + `agent_hotel_program_selections` | replaces faked logo wall |
| 5 | **Wine River Cruises** feature (§5) | `cruise_lines` (river rows) | flagship section |
| 6 | Wine regions — scroll-driven story | `properties_destinations` + curated copy | replaces static grid |
| 7 | Wellness retreats | `hotel_programs`/`exclusive_experiences` curated | Six Senses / Aman / COMO |
| 8 | Exclusive experiences | `exclusive_experiences` | Growth+ (tier=custom ok) |
| 9 | Villas (custom-tier) | `villas` | curated select, not full 146 |
| 10 | Virtuoso band (redesigned) | static (M05) | restrained |
| 11 | Journal | `blog_posts` (+ prefs) | real posts |
| 12 | Testimonials (redesigned) | static for now | tier=custom ok |
| 13 | Lead capture / enquiry drawer | writes `inquiries` | |
| 14 | Footer (quiet, regional) | agents | |

Shared catalog sub-pages (book-hotel, find-cruise, book-villa, experiences) already DB-backed —
reskin to `--wwt-*` where they render under the WWT shell.

---

## 5. Wine River Cruises (flagship, buildable today)

DB `cruise_lines` already has rich river rows: **amawaterways, uniworld (has video), viking,
scenic** — hero, logo, intro, destinations, experiences, sample journeys, sliders all present.
Build "Wine River Cruises" as a **curated editorial grouping** selecting these slugs (no wine/river
taxonomy exists in DB). Optional later: seed Tauck / Emerald / Riverside / Avalon into `cruise_lines`
(table supports all rich fields).

---

## 6. Future-forward features (the "show what's possible" layer)

1. Conversational concierge → human handoff (decision #1) — the centerpiece.
2. Curated-three, not catalog-fifty (taste as restraint).
3. Scroll-driven cinematic destination/wine story (`IntersectionObserver` / CSS scroll timelines).
4. Advisor as present human voice (recurring signed motif + optional to-camera video).
5. Aman slow micro-interactions site-wide (fade-rise, crossfade, hairline hovers).
6. Context-aware curated surfacing (season / returning visitor) — transparent, with a visible
   "because you were exploring ___" label, never silent.
7. Performance + a11y as the luxury floor (sub-2s, blur-up, keyboard nav, AA+ contrast).
8. AI-agent-legible structured data (JSON-LD `TouristTrip`/`Hotel`/advisor `LocalBusiness`).

---

## 7. Phased build

- **Phase 0 — foundation:** ✅ DONE (verified on staging `/t2/wwt-demo`).
  - migration `051_agents_bespoke_layout.sql` (column only; value set at go-live)
  - `app/t2/wwt2.css` — `--wwt-*` token system (Aman warm-neutral + bordeaux/sage)
  - `components/t2/wwt2/`: `Reveal` (IntersectionObserver fade-rise), `WWT2Nav` (transparent→paper,
    full-screen overlay menu), `WWT2Hero` (cinematic Tuscan hero)
  - `app/t2/[agentId]/wwt-home-v2.tsx` — hero + editorial intro + advisor-voice band
  - dispatch wired in `page.tsx` (slug OR `agent.bespoke_layout === 'wwt'`); layout gives it
    `wwt2-page` class, suppresses generic nav/footer; resilient `getAgentProfile` (won't 500 pre-migration)
  - tsc clean.
- **Phase 1 — DB-wired core:** IN PROGRESS
  - ✅ hero, editorial intro, advisor-voice band (Phase 0)
  - ✅ **Wine River Cruises** — `WWT2WineRiverCruises`, DB `cruise_lines` (river); AmaWaterways +
    Uniworld featured, serene curated imagery (Douro/Porto, sunset river). Verified.
  - ✅ **Curated stays** — `WWT2CuratedStays`, DB `hotel_programs`; Aman/Six Senses/COMO, Aman-style
    alternating image-text rows, Amangiri/serene imagery. Verified.
  - ✅ journal (`blog_posts`, teaser when empty), footer + closing CTA, banner offset fix.
- **Phase 2 — depth:** ✅ wine-region horizontal gallery, Virtuoso value band, villas (DB, Tuscan
  wine-country), all distinct layouts. (wellness folded into curated stays / experiences routing.)
- **Phase 3 — innovation:** ❌ **"Plan with me" concierge REMOVED (2026-07-14, owner decision)** —
  `WWT2Concierge` + `/api/wwt-concierge` deleted (recoverable from git history). The
  `ANTHROPIC_API_KEY` go-live prerequisite no longer applies.
  - ⬜ remaining Phase 3 polish: context-aware surfacing, JSON-LD, motion/perf/a11y hardening.
- **Copy rewrite (2026-07-14):** all WWT copy rewritten from the Aman-literary register to a direct
  Four Seasons voice (benefit-led, second person, imperative, no negation-framing) — hero, intro,
  advisor note, cruises, stays, regions, Virtuoso, villas, journal, footer CTA, mock tagline/bio.
- **"Digital experience" module redesign (2026-07-15):** every homepage module rebuilt with its own
  signature interaction (FS-inspired, monochrome, zero new deps, all reduced-motion-safe):
  - Shared primitives: `WWT2HeadlineReveal` (word mask-rise), `WWT2Parallax` (rAF), `useSectionProgress`
    (pinned scrollytelling engine), `WWT2CountUp`, `WWT2ChapterRail` (fixed Roman-numeral rail,
    mix-blend difference).
  - Hero → split editorial (CSS crossfade slideshow + stacked uppercase serif + solid black CTA);
    nav now solid from load (dark-probe removed from `WWT2Nav`).
  - Intro → line-mask manifesto + parallax figure; Advisor → spoken-word quote + SVG signature draw.
  - `WWT2RiverJourney` (replaces WineRiverCruises) — pinned 110vh/stop scrollytelling, crossfading
    river stops + journey rail; static stacked fallback <900px / reduced-motion.
  - `WWT2StaysPanels` (replaces CuratedStays) — hover/focus-expand panel triptych, tap accordion mobile.
  - `WWT2Atlas` (replaces WineRegions) — hover-driven index + crossfade stage, 5s auto-drift until
    interaction; `useDragScroll` momentum rail on mobile.
  - Virtuoso → counting stat ledger (1,400+/3/1) + hairline-draw rows. Villas → 3-depth parallax.
    Journal → serif dispatch marquee. Footer → sticky curtain finale + word-rise headline.
  - Gotcha fixed twice-over (recorded): single-class color overrides on `.wwt-display` lose to
    `.wwt2-page .wwt-display` — always prefix `.wwt2-page` on display-heading color overrides.
  - Gotcha: word-split reveals — a trailing text space inside an overflow-hidden slot is clipped;
    use margin-right on the slot for the word gap.
- **Phase 2 — depth:** wine-region scrollytelling, wellness, experiences, villas, testimonials,
  Virtuoso band, footer. Reskin shared sub-pages under the WWT shell.
- **Phase 3 — innovation:** "Plan with me" concierge (if approved), context-aware surfacing,
  JSON-LD, motion polish, perf/a11y hardening.
- **Phase 4 — go-live:** set `tier=custom` + `bespoke_layout='wwt'` on real record, `revalidatePath`,
  verify on the live domain at 375 / 768 / 1280, ship.

## Verification per phase
- `npx tsc --noEmit` clean · build passes · preview at 3 breakpoints · ≥1 real DB slug renders live
  supplier data (not mock) · reduced-motion honored · Lighthouse/axe spot-check.

---

## Mobile pass + site completion (2026-06-24)
- **Every section verified at 375px** — hero, overlay menu, intro, advisor note, concierge, Wine
  River Cruises, Curated Stays, Wine Regions (horizontal swipe), Virtuoso, Villas, Journal, CTA,
  footer. Zero horizontal overflow anywhere.
- **Bugs fixed during the pass (also affected desktop):**
  - Mobile nav overflow → hamburger-only + smaller brand + drop redundant Enquire `<600px`.
  - CTA headline + Wine-Region card names rendered dark on imagery — the base `.wwt2-page
    .wwt-display { color }` rule (spec 0,2,0) out-specified single-class color overrides. Fixed by
    raising selector specificity (same fix pattern as the hero). Band-night sections already get
    ivory via `.wwt-band-night .wwt-display`, so only on-image titles outside band-night needed it.
- **Site-wide chrome fix:** WWT2Nav + WWT2Footer moved from the home component into the t2 **layout**,
  so every WWT page (home + book-hotel / find-cruise / book-villa / experiences / journal / contact)
  has the bespoke nav + footer. Nav auto-detects `.wwt2-hero`: transparent over the home hero, solid
  paper on hero-less subpages. Verified: 1 nav + 1 footer per page, no duplication.
- **Known follow-up (not blocking):** subpage *content* still uses the existing `--t2-*` styling
  (gold accents) inside the WWT shell — same Cormorant serif so it blends, but a full `--wwt-*`
  reskin of the catalog subpages is a Phase-2 polish item.

## Review / learnings (fill in as we go)
- **Full-bleed cover images: use CSS `background-image`, not `next/image fill`.** In the WWT2 hero,
  `next/image` with `fill` returned 200/complete but did not paint (and `:global(img)` is invalid in a
  plain `<style>` tag). A background-image layer paints reliably and carries the Ken-Burns drift.
  In-content fixed-size `next/image` (width/height) paints fine — keep using it for cards/figures.
- **Preview verification quirk:** programmatic scroll is blocked in the emulated viewport; to verify
  below-the-fold sections, cap the hero height via eval + use a tall viewport + force `data-inview`.
- Staging-only: the purple "Built on Elite Advisor Hub" demo banner overlaps the fixed nav at
  `/t2/wwt-demo`. It does NOT render on the real domain (isDemoSlug=false), so leave it.
