# Starter Demo — Outline & Sitemap

**Tier:** Starter · $89/mo · $499 setup
**Template:** `frontend` (only template eligible at this tier)
**Demo slug:** `starter-demo` (replaces colliding `demo-agent` slug)
**Persona used in this spec:** Aspen Alpine Travel — alpine & mountain luxury specialist. _Swap the persona freely; the structure stays the same._
**Source of truth:** `Elite_Advisor_Hub_Feature_Matrix.xlsx` sheets 1, 2, 3, 4, and 6.

This spec is build-ready. A junior dev or the operator can hand this to `scripts/seed_*.js` and produce a complete demo in ~4 hours.

---

## 1. What this demo has to prove

A prospect lands here from the pricing page after reading the Starter row. The demo has to answer three questions in under sixty seconds:

1. **"Is $89/month enough website for me to look credible to a luxury client?"** Yes — and the way the demo proves it is the brand-story prose, the Virtuoso lockup, and the supplier-programs grid on the home page.
2. **"What am I giving up vs. Growth?"** No searchable hotel directory, no `/experiences`, no `/plan-a-trip`, no Instagram feed, no testimonials grid. The demo should _feel complete_ without those — so the prospect doesn't feel cheated, but also clearly sees the gap when they compare to a Growth demo on `t2-demo` or `t3-demo`.
3. **"Can I see myself running this in 30 days?"** The blog has a real cadence (1 post/month operator broadcast + 1 advisor post), the inquiry form works, and the about page reads like a real advisor's about page.

---

## 2. Sitemap

```
aspenalpinetravel.com  (custom domain → middleware → /frontend/starter-demo)
│
├── /                                 (Home — M01·M02·M03·M04·M05·M06·M07·M08·M11·M18·M20)
│
├── /about                            (Brand story + advisor profile detail + supplier programs)
│
├── /hotels                           (M11 Curated Hotels Grid — ProgramLogoGrid, NOT searchable)
│   └── /hotels/[programSlug]         (M09 Hotel Brand Page — per-supplier)
│
├── /blog                             (M18 Journal — full archive)
│   └── /blog/[slug]                  (Single post)
│
├── /resources                        (Frontend-only soft page — bonus "what I offer" copy)
│
├── /media                            (Frontend-only soft page — operator broadcasts + press)
│
├── /contact                          (M20 Contact / inquiry form)
│
├── /privacy-policy                   (Auto-rendered from lib/legal)
├── /terms-of-service                 (Auto-rendered from lib/legal)
└── /sitemap.xml                      (M33 SEO)
```

**Note on route naming:** the `frontend` template uses `/hotels` and `/blog` (not `/book-hotel` and `/journal`). The Feature Matrix sheet 4 labels these as "/book-hotel (curated programs grid)" and "/journal" — those are the conceptual names; the actual routes on the `frontend` template are `/hotels` and `/blog`. Don't refactor.

**What is intentionally absent from the sitemap** (so prospects feel the upgrade path):

- `/find-cruise` — Growth+
- `/experiences` — Growth+
- `/plan-a-trip` — Growth+
- `/book-villa` — Custom+
- `/advisors`, `/advisors/[slug]` — Agency only
- `/atelier`, `/press` — t4 Casa Solis only

---

## 3. Page-by-page outline

### 3.1 Home (`/frontend/starter-demo`)

Canonical section order — already implemented in `app/frontend/[agentId]/page.tsx`. Render in this order, top to bottom:

| # | Section | Component | Module | What the prospect sees |
|---|---|---|---|---|
| 1 | Hero (full-bleed slider, 2–3 slides) | `HeroSlider` | M01 | Alpine cinematic frames; tagline + primary CTA "Plan your alpine escape" → /contact |
| 2 | Advisor intro band | `TeamIntroBand` | M02 | Headshot, name, "Virtuoso Travel Advisor — Aspen, CO", 2-line bio |
| 3 | Brand story | `BrandStory` | M04 | 180-word narrative — why alpine, who they serve, what makes their planning different |
| 4 | Why work with me | `WhyTravelWithUs` | M03 | 3 cards: "Virtuoso perks at no extra cost" · "20+ years on the mountain" · "One advisor, every detail" |
| 5 | Curated journal preview | `CuratedExperiences` | M08 | 3 most recent blog posts as image cards → /blog |
| 6 | Hotel programs grid | `ProgramLogoGrid` | M07 | 12–16 supplier program logos: Belmond, Aman, Auberge, Six Senses, Cheval Blanc, Rosewood, Four Seasons, etc. → each → /hotels/[programSlug] |
| 7 | Testimonial carousel | `TestimonialsCarousel` | M19-lite | 3 short client quotes — alpine specific (Verbier, Aspen Highlands, Niseko) |
| 8 | Contact band | `ContactSection` | M20 | Inquiry form (name, email, dates, destination interest, budget tier) |

**Sections to REMOVE from the standard frontend home for Starter (already off by default but explicit here):**

- ❌ `SocialFeed` (M17) — Growth+. Comment out the `<SocialFeed />` line on this demo only.
- ❌ Any "experiences" or "plan-a-trip" CTA buttons. Hero CTA goes to `/contact`, not `/plan-a-trip`.

### 3.2 About (`/about`)

A frontend `/about` already exists with a richer story. For Starter, populate it with:

| Section | Content |
|---|---|
| Page hero | Single full-width image (alpine — Aspen Mountain at first chair) + page title "About Aspen Alpine Travel" |
| Founder story (long) | ~500 words. Origin, why alpine luxury, Virtuoso credential, what's earned vs. taught |
| Single-advisor team band | Just one card. **Do NOT use the multi-member team grid Eden uses** — that's a Growth/Agency look |
| Credentials strip | Virtuoso · Aspen Snowmass preferred · Cheval Blanc partner · Belmond connoisseur |
| Supplier programs grid | `ProgramLogoGrid` (same component as home, full list this time) |
| CTA band | "Start planning →" → /contact |

### 3.3 Hotels (`/hotels`)

This is the Starter version — curated grid, **not** searchable directory. Implementation note: the existing `frontend` template uses `ProgramLogoGrid` here, which is correct.

| Section | Content |
|---|---|
| Page hero | "Our preferred hotel partners" + 1-line lead |
| `ProgramLogoGrid` | Full list of 16–24 programs the advisor has access to |
| Cross-link band | "Cruise specialist? Ask about our cruise partners" → /contact (signals Growth-tier upsell without showing /find-cruise) |

Each logo links to `/hotels/[programSlug]` (the M09 brand page).

### 3.4 Hotel Brand Page (`/hotels/[programSlug]`)

One page per supplier program. Pull from `hotel_programs` table. Each page contains:

- Hero — supplier brand imagery
- Brand description (~150 words)
- Member perks block (room upgrade, daily breakfast, $100 hotel credit, late checkout)
- Featured properties (4–8 cards) — from `featured_hotels` table
- "Plan a stay" CTA → /contact with `?supplier=<slug>` for lead attribution

**For the Starter demo, seed at least 6 brand pages** so the grid feels real when prospects click around:
Aman · Belmond · Cheval Blanc · Auberge · Four Seasons · Rosewood.

### 3.5 Blog (`/blog`) — M18 Journal

| Section | Content |
|---|---|
| Page hero | "The Alpine Journal" + tag chips for categories |
| Post grid | 6 most recent posts (paginated past 6) |
| Sidebar / aside | Author bio mini-card + "Subscribe to monthly letter" form |

**Posts to seed in this demo (8 total — enough that the archive feels lived-in):**

1. **Operator broadcast (categories: Mountain Luxury)** — "The St. Regis Aspen vs. The Little Nell: how I'd choose for first-timers"
2. **Operator broadcast (Wellness on the Mountain)** — "Why Vail's mid-week spa days outperform a Friday arrival"
3. **Advisor original (Trip Reports)** — "What I learned planning a 14-day Aspen-Verbier-Niseko triple"
4. **Operator broadcast (Cruise & Mountain)** — "The Alaska cruise → Banff land combo, paced for adults" _(operator pushes this — it's also a soft cross-sell for Growth tier)_
5. **Advisor original (How I Work)** — "What goes into your itinerary before you ever see it"
6. **Operator broadcast (Virtuoso Perks)** — "Five Belmond perks worth more than the room rate"
7. **Advisor original (Destination)** — "Two days in Telluride that locals would book"
8. **Operator broadcast (Seasonal)** — "When to book powder week 2027 (it's already this fall)"

This gives Starter the right cadence — **1/month operator broadcast** is exactly 1/month over the prior 6–8 months, and 3 advisor originals sprinkled in. Don't exceed 1 operator broadcast per month or the cadence implies Growth.

### 3.6 Resources (`/resources`)

Frontend-only soft page that doesn't exist on t2/t3/t4 — it's a Starter signature surface. Populate as a downloadable / linkable mini library:

- "Alpine packing list, by season" (markdown content rendered inline)
- "Virtuoso vs. AAA: what changes when you book through me" (operator-written)
- "Tipping in the Alps vs. Aspen vs. Niseko" (advisor-written)
- "What 'travel insurance' should actually cover for ski trips" (advisor-written)

No PDF gating, no email-wall. This page exists to capture long-tail SEO and demonstrate expertise.

### 3.7 Media (`/media`)

Frontend-only — softer than `/resources`, used by Eden today as a press / video page. For Starter persona, populate sparingly:

- 1–2 short founder videos (use `VideoEmbed` component, Mux player) — embed placeholder is fine for the demo
- A "featured in" strip (Travel + Leisure, Forbes Travel Guide A-List — even if placeholder)
- One operator broadcast linked from here as "EAH journal coverage"

If video assets aren't ready for the demo, **remove `/media` from the nav entirely** rather than ship an empty page. A missing tertiary route is better than a Lorem Ipsum video block.

### 3.8 Contact (`/contact`)

Standard `ContactSection` form. For Starter, the form fields are:

- Name (required)
- Email (required)
- Phone (optional)
- Trip destination interest (free text)
- Approximate dates (optional)
- "How can I help?" textarea

**Do NOT add to the Starter contact form** (these are Growth+ signals):

- Trip budget tier dropdown — that belongs on `/plan-a-trip`
- Number of travelers structured input — same
- Multi-step / progress-bar UI — same

The contact form should feel direct and personal, not transactional.

---

## 4. Navigation

**Header nav (left → right):**

```
About · Hotels · Blog · Resources · Contact  →  [Plan a trip] (button → /contact)
```

`Media` is reachable from the footer only.

**Footer columns:**

```
Aspen Alpine Travel        Explore             Plan                  Connect
[logo + 1-line]             About               Contact               IG @aspen.alpine (display only)
                            Hotels              Resources             Email link
                            Blog                Media                 [Virtuoso lockup]
                            Privacy · Terms     Sitemap
                            © 2026
```

**Mobile nav:** hamburger drawer with the same items, "Plan a trip" pinned at the bottom as a full-width CTA.

---

## 5. Module → Component map

For the dev who'll build this — every module the Feature Matrix marks as required at Starter and which component renders it on the `frontend` template:

| Module | Component | File |
|---|---|---|
| M01 Hero | `HeroSlider` | `components/home/HeroSlider.tsx` |
| M02 Advisor Profile | `TeamIntroBand` | `components/home/TeamIntroBand.tsx` |
| M03 Service Cards | `WhyTravelWithUs` | `components/home/WhyTravelWithUs.tsx` |
| M04 Brand Story | `BrandStory` | `components/home/BrandStory.tsx` |
| M05 Virtuoso Band | (inline in `TeamIntroBand` / footer) | — |
| M06 Partner Tabs | `SupplierGrid` | `components/suppliers/SupplierGrid.tsx` |
| M07 Hotel Programs | `ProgramLogoGrid` | `components/hotel-programs/ProgramLogoGrid.tsx` |
| M08 Destination Carousel | `CuratedExperiences` | `components/home/CuratedExperiences.tsx` |
| M09 Hotel Brand Page | `/hotels/[slug]` route | `app/frontend/[agentId]/hotels/[slug]/page.tsx` |
| M11 Curated Hotels Grid | `ProgramLogoGrid` (on /hotels) | same as M07 |
| M18 Journal | `/blog` + `/blog/[slug]` | `app/frontend/[agentId]/blog/*` |
| M19-lite Testimonials | `TestimonialsCarousel` | `components/home/TestimonialsCarousel.tsx` |
| M20 Contact | `ContactSection` | `components/home/ContactSection.tsx` |
| M31 Custom Domain | middleware rewrite | `middleware.ts` (existing logic) |
| M33 SEO | `lib/seo` + `lib/tenant-paths` + `sitemap.ts` | — |

---

## 6. Demo data requirements

Things to seed before this demo is "complete":

**Agent record** (`agents` table):
- `id`: new UUID
- `slug`: `starter-demo`
- `agency_name`: Aspen Alpine Travel
- `tier`: `starter`
- `template`: `frontend`
- `custom_domain`: `aspenalpinetravel.com` (placeholder — for demo, can be unset)
- `advisor_name`: pick a plausible name (e.g. "Sloan Whitfield")
- `advisor_email`: contact@aspenalpinetravel.com (demo-only)
- `bio` + `bio_long`: alpine-luxury narrative, ~250 / 500 words
- `headshot_url`: placeholder advisor photo
- `cst_number`: blank (advisor isn't CA-based in this persona)

**Hotel programs** (`agent_hotel_program_selections`):
Select 16–24 programs from existing `hotel_programs` catalog. Suggested anchors:
Aman · Belmond · Cheval Blanc · Auberge · Four Seasons · Rosewood · Six Senses · Mandarin Oriental · Park Hyatt · Peninsula · Ritz-Carlton · St. Regis · COMO · Bulgari · Aman Niseko (cross-tag with skiing) · The Little Nell (Aspen) · Cheval Blanc Courchevel · Cheval Blanc St. Tropez (for shoulder season cross-sell).

**Blog posts** (`blog_posts` + `agent_blog_preferences`):
Seed the 8 posts listed in §3.5 above. Tag with `target_demo_slugs = ['starter-demo']` for operator broadcasts. Categories: Mountain Luxury · Wellness on the Mountain · Trip Reports · How I Work · Virtuoso Perks · Seasonal.

**Testimonials:**
Currently the `TestimonialsCarousel` reads from a hardcoded array. Either (a) keep the existing set if alpine-relatable, or (b) swap in 3 short alpine-flavored quotes via the component prop.

**Suppliers data:** uses the global `hotel_programs` table — already seeded.

---

## 7. SEO checklist

Per `lib/seo.ts`:

- **Title pattern:** `Aspen Alpine Travel — Virtuoso Luxury Travel Advisor for Alpine & Mountain Escapes`
- **Description:** ~155 chars, mentions Virtuoso, alpine, Aspen, mountain luxury, custom itineraries.
- **JSON-LD:** `TravelAgency` + `leadAdvisorSchema` (already wired in `app/frontend/[agentId]/page.tsx`).
- **Open Graph image:** alpine cinematic hero, 1200×630.
- **Sitemap:** `/sitemap.xml` already auto-generates per tenant. Verify it lists all 7 public routes.

---

## 8. What this demo must NOT look like

Common drift to watch for during build:

- ❌ A searchable hotel directory at `/hotels`. The `ProgramLogoGrid` is the Starter answer. Searchable = Growth.
- ❌ An `/experiences` or `/plan-a-trip` route. If a nav link points to either, remove it.
- ❌ An Instagram feed block on the home. `SocialFeed` is wired in the frontend template but **must be removed for this demo** (it's a Growth+ module).
- ❌ A multi-advisor team grid on `/about`. One advisor only — multi-advisor is an Agency signal.
- ❌ A `/journal` route. The frontend template uses `/blog` — keep that. (T2/T3/T4 use `/journal`; it's a template difference, not a tier difference.)
- ❌ A villa surface anywhere. Villa is Custom+. If the demo's nav, footer, or any content mentions villas, remove it.
- ❌ More than ~1 operator broadcast per month in the blog. If the cadence implies Growth, the demo over-promises.
- ❌ A "Powered by Elite Advisor Hub" tag suppressed. White-label is a Custom add-on; Starter wears the EAH chrome.

---

## 9. Build sequence (4 hours)

1. **15 min** — create the agent record + `starter-demo` slug; confirm `/frontend/starter-demo` resolves.
2. **30 min** — write the persona content (bio, brand story, about-page long-form, hero copy, testimonial quotes).
3. **30 min** — select & seed the 16–24 hotel programs via `agent_hotel_program_selections`.
4. **60 min** — draft the 8 blog posts (use `eah-journal-writer` skill for the operator-broadcast posts — they're exactly the cadence the skill is built for).
5. **30 min** — record / source the hero slider imagery (3 alpine frames, 2400×1200).
6. **15 min** — remove `SocialFeed` from this demo's home render (config flag or conditional render guarded on `tier === 'starter'`).
7. **45 min** — pass through `/about`, `/hotels`, `/blog`, `/contact`, `/resources` at 375 / 768 / 1280 px. Fix any layout drift.
8. **15 min** — run `cross-template audit checklist` from `docs/demo-feature-checklist.md` §"Cross-template audit checklist."

---

## 10. Open decisions (decide before kicking off)

These are above-my-pay-grade and you should land them before the build starts:

1. **Persona — keep "Aspen Alpine Travel" or swap?** The structure works for any solo-advisor niche (sailing, safari, culinary). The alpine niche was chosen because (a) it's clearly different from Wine & Wellness and Eden, and (b) it photographs well for Hero slider imagery.
2. **Custom domain — wire `aspenalpinetravel.com` or leave on the EAH subpath?** A custom domain on a demo is the strongest signal that the platform supports it. The cost is one demo domain registration.
3. **Resources page — keep or remove?** It exists on the frontend template but Eden uses it heavily. For a clean Starter demo it's optional. Keeping it strengthens the Starter pitch ("you get more than t2/t3 demos suggest"). Removing it simplifies the build.
4. **Media page — keep or remove?** Same trade-off as Resources, but more dependent on having real video/press assets. Recommend removing for the demo unless placeholder video assets are ready.
