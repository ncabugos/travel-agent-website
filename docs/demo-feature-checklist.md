# Demo-Ready Feature Checklist

**Updated:** May 2026
**Status:** Authoritative, derived from `Elite_Advisor_Hub_Feature_Matrix.xlsx` sheets 2, 3, and 6.
**Purpose:** Audit each demo slug against its row. Anything missing = a sales gap that blocks closing that tier.

Use this doc when:

- Auditing an existing demo (`t2-demo`, `t3-demo`, `casa-solis`, etc.).
- Spec'ing a new demo before running `scripts/seed_*.js`.
- Walking a prospect through a tier — every section below should be visible on the demo you point them at.

---

## How to read this doc

Each tier section lists, in order:

1. **Tier pricing line** — the contract price + setup.
2. **Templates eligible** — which template(s) the demo is allowed to use.
3. **Routes that must exist** — file-system / Next.js routes that 404 if missing.
4. **Modules that must render** — `M0X` IDs map back to the Feature Matrix.
5. **Demo-specific call-outs** — what makes this demo recognizable as that tier.

A module is "must render" if a prospect would reasonably expect to see it after reading the pricing page for that tier. A missing must-render module is a refund-risk on day one.

---

## Tier 1 — Starter · $89/mo · $499 setup

**Templates eligible:** `frontend` only.
**Why locked to frontend:** Removes the t2/t3-curated-grid build dependency from launch. Curated t2/t3 Starter variants follow in Month 2–3 (Feature Matrix sheet 7, P2).

### Required routes

- `/` (home)
- `/about`
- `/contact`
- `/book-hotel` (curated programs grid — not searchable directory)
- `/book-hotel/[slug]` (supplier brand page)
- `/journal` + `/journal/[slug]` (or `/blog` on frontend)
- `/privacy-policy` + `/terms-of-service`
- `/sitemap.xml`

### Modules that must render

- **M01 Hero** — `HeroSlider`
- **M02 Advisor Profile** — `TeamIntroBand`
- **M03 Service Cards** — `WhyTravelWithUs`
- **M04 Brand Story** — `BrandStory`
- **M05 Virtuoso Band** — Virtuoso lockup with supplier credentials
- **M06 Partner Tabs** — `SupplierGrid` (frontend equivalent)
- **M07 Hotel Programs Teaser** — `ProgramLogoGrid` on home
- **M08 Destination Carousel** — `CuratedExperiences`
- **M11 Curated Hotels Grid** — `/book-hotel` shows curated programs (not directory)
- **M18 Journal Teaser** — recent blog post strip
- **M20 Contact** — `ContactSection` + inquiry form
- **M31 Custom Domain** — middleware rewrite working
- **M33 SEO** — sitemap + JSON-LD `TravelAgency` schema

### Must NOT render (these would mislead prospects)

- M13 Searchable Hotel Directory
- M14 Searchable Cruise Directory
- M15 Experiences
- M16 Plan-a-Trip
- M17 Instagram Feed (Starter doesn't get social embed by default)
- M19 Testimonials grid (carousel testimonial is fine; full grid implies Growth)
- M21 Villa
- M22 Custom bespoke layout
- M25 Advisors Directory

### Demo identifier

- **Demo slug:** `demo-agent` → **rename to `starter-demo` or `aspen-demo`** (current label conflicts with the real Eden client, who is on Growth tier and is the brand ambassador).
- **Label:** "Aspen Mountain Travel (Frontend)" or equivalent.

---

## Tier 2 — Growth · $179/mo · $1,499 setup

**Templates eligible:** `t2 Vista` OR `t3 Meridian`.
**Two demos are required at this tier** — one for each template, so prospects can choose the look.

### Required routes (in addition to Starter)

- `/plan-a-trip`
- `/find-cruise` (searchable directory)
- `/find-cruise/[slug]` (cruise brand page)
- `/experiences`
- `/journal` + `/journal/[slug]`
- `/book-hotel` becomes the searchable directory (not curated grid)

### Modules that must render (in addition to Starter)

- **M13 Searchable Hotel Directory** — `T2 FindHotelClient` or `T3HotelDirectory`
- **M14 Searchable Cruise Directory** — `FindCruiseClient` or `T3CruiseGrid`
- **M15 Experiences** — `T2ExperienceGrid` or `T3ExperienceEditorial`
- **M16 Plan-a-Trip** — structured intake form
- **M17 Instagram Feed** — `T2InstagramFeed` / `T3InstagramFeed`
- **M19 Testimonials** — `T2TestimonialsGrid` / `T3TestimonialsGrid`
- **M32 Curated Editorial Stream** — at least one operator-authored curated post visible in the journal feed (Growth cadence: 1/week). Growth+ only; Starter is advisor-written.

### Optional / add-on (visible if purchased)

- **M21 Villa** — `$29/mo` add-on; if shown, must use `T2 FindVillaClient` (t3 doesn't have villa yet — see Gaps P2).

### Must NOT render

- M22 Custom bespoke layout (no hand-tuned hero)
- M23 `/atelier` or `/press`
- M24 White-label (footer still shows "Powered by EAH")
- M25–M27 Agency modules

### Demo identifiers

- **`t2-demo`** ("Vista — Standard") — generic Growth Vista demo. Refresh on next pass.
- **`t3-demo`** ("Meridian Travel — Standard") — Growth Meridian demo. T3 UI overhaul currently in flight (`tasks/todo.md`).
- **`wwt-demo`** → **rename to `wellness-demo` / "Lumière Wellness Travel"**. Frees Wine & Wellness branding for the real account on `wineandwellnesstravel.com`.

### Niche Growth demos (per Strategic Plan §6 — NOT YET BUILT)

| New demo | Template | Niche | Why |
| --- | --- | --- | --- |
| `romance-demo` | t2 | Romance / Honeymoon | Conversion lift on honeymoon prospects |
| `cruise-demo` | t3 | Cruise specialist | Demonstrates t3 versatility, leans on catalog depth |
| `family-demo` | t2 | Family luxury | Different demographic — complements romance & wellness |

Each is ~4 hours end-to-end via the `scripts/seed_*.js` pattern.

---

## Tier 3 — Custom · $349/mo · $2,999 setup

**Templates eligible:** any (`frontend`, `t2`, `t3`, `t4` Casa Solis).
**Why "any":** Custom is where bespoke design and the flagship `t4` template live. A Custom advisor may want a polished `frontend` site too, just hand-tuned.

### Required routes (in addition to Growth)

- `/book-villa` + villa supplier pages
- `/atelier` (t4-only, optional)
- `/press` (t4-only, optional)
- All Growth routes, on whichever template

### Modules that must render (in addition to Growth)

- **M21 Villa** — `/book-villa` + villa cards (visible on the chosen template; today only t2 has the components — t3/t4 villa is in Gaps P2)
- **M22 Custom Layout / Bespoke** — at least one element that wouldn't ship on a stock Growth site (hand-tuned hero, custom section, design polish)
- **M23 Atelier / Press** — if the chosen template is t4, `/atelier` and `/press` should be visible

### Optional add-ons

- **M24 White-label** — `$999` one-time add-on (when wired — see Gaps P2)

### Must NOT render

- M25 Advisors Directory
- M26 Per-Advisor Lead Routing
- M27 Co-author broadcasts

### Demo identifier

- **`casa-solis`** ("Casa Solis — Custom") — the t4 flagship demo. Live but needs a pass to confirm villa + atelier are fully populated.
- **A Custom-on-t2 or Custom-on-t3 demo does not currently exist.** Consider whether one is needed before public launch — the t4 demo alone may make Custom feel "t4-only" to prospects.

### Demo-specific call-outs (t4 Casa Solis)

- t4 has no `/about` route — the brand story lives in `T4Manifesto` on the home and `/atelier`.
- t4 has no `/experiences` route by default — the editorial moves into `/atelier`.
- t4 has no `T4ServiceCards` — the Manifesto serves the same purpose. This is intentional design, not a gap.

---

## Tier 4 — Agency · from $899/mo · from $4,999 setup

**Templates eligible:** typically `t2` (multi-advisor density). `t3` and `t4` Agency variants are not viable until P3 gaps close.

### Required routes (in addition to Custom)

- `/advisors` (team page)
- `/advisors/[slug]` (per-advisor page)
- Plus all Custom-tier routes

### Modules that must render (in addition to Custom)

- **M25 Advisors Directory** — `T2AdvisorsDirectory` rendering all agency advisors
- **M26 Per-Advisor Lead Routing** — `/contact` form selects an advisor; inquiry persists with `assigned_advisor_id` (backend, see Gaps P3)
- **M27 Co-author Broadcasts** — at least one operator-drafted journal post visible with the agency principal as co-author byline
- **M24 White-label** — Agency includes white-label by default; footer shows agency brand only

### Demo identifier

- **`ytc-demo`** ("Your Travel Center") — designated Agency exemplar. Enhancement plan in `docs/agency-demo-plan.md`. Build is **pending** — needs:
  - `AdvisorsDirectory` component refresh
  - `/advisors` and `/advisors/[slug]` routes wired
  - Multi-advisor hero (current hero is single-advisor)
  - Lead-routing UI on contact form
  - At least one co-authored broadcast in the journal

### Must NOT render

- Anything that implies a single-advisor practice (single-advisor hero, single-headshot footer).

---

## Future — Aurora (Signature) · $599/mo · $7,499 setup

**Status:** Phase 3 launch (Nov 2026+). Capped at 5 paid advisors year one. Separate Stripe SKU.
**Template:** `t5` (not yet built).

### Distinctives (per `docs/aurora-concept.md`)

- Mood-based home organization (not destination-based)
- AI trip composer (Claude API, streaming response)
- Living Portfolio (anonymized real trips, editorial format)
- Per-advisor system prompt loaded with bio, specialties, supplier affinities

### Demo plan

- **Month 6 (Nov 2026):** Dogfood on `wineandwellnesstravel.com`.
- **Month 9–10:** First paid Signature advisor onboarded (likely Eden).
- **Month 11+:** Open to selective applications. Cap at 5 year one.

No public `aurora-demo` slug exists yet. **Do not promise Aurora during Phase 1 / Phase 2 advisor conversations** — Strategic Plan §5.

---

## Cross-template audit checklist (use before any public demo push)

Run this against every demo slug before a coordinated push:

1. **Home page renders without console errors** at 375 px, 768 px, 1280 px.
2. **All required routes** for the demo's tier are present in the file system (see tier sections above).
3. **All "must render" modules** appear on the home page in the canonical section order.
4. **No "must NOT render" modules** appear — these mislead the prospect about what they're buying.
5. **The journal has ≥3 posts.** Starter demos show advisor-written posts only (no curated/operator broadcast). Growth+ demos additionally carry at least one curated editorial post at the tier's cadence (1/wk Growth, 2/wk Custom & Agency).
6. **Supplier data is real** — no Lorem Ipsum hotel names. The curated grids / searchable directories should reflect the real Virtuoso catalog.
7. **The advisor profile** is plausible (headshot, bio, specialties, CST or equivalent shown where present).
8. **The contact form submits** to the inquiries table without erroring.
9. **The mobile nav** opens, closes, and routes correctly.
10. **One full happy-path** — Home → /book-hotel → supplier brand page → /contact → inquiry submit — completes end-to-end.

---

## Drift list — surfaced May 2026

Items where the existing demos already diverge from this checklist:

- `demo-agent` slug + "Eden — Custom (Frontend)" label collides with the real Eden For Your World agent record. Rename pending.
- `wwt-demo` label conflicts with the real Wine & Wellness Travel account. Rename pending.
- `t3-demo` is mid-overhaul (T3 UI tokenization, mobile polish).
- `casa-solis` Villa module needs an audit — t4 villa components do not exist yet; the demo may be showing the t2 villa surface or nothing.
- `ytc-demo` is not yet Agency-ready — see `docs/agency-demo-plan.md`.
- No `frontend`-on-Custom or `t2`-on-Custom demo exists. Prospects evaluating Custom only see the t4 flagship.
- No niche Growth demos exist (`romance-demo`, `cruise-demo`, `family-demo`) — listed as Strategic Plan §6 additions.

---

## Source of truth

When this checklist and the Feature Matrix disagree, the **Feature Matrix wins**. Update this doc to match. The Matrix is at `Elite_Advisor_Hub_Feature_Matrix.xlsx`, sheets 2 (Module × Tier), 3 (Module × Template), and 6 (Demo Readiness).
