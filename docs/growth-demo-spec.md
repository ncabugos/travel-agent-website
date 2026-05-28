# Growth Demo — Outline & Sitemap

**Tier:** Growth · $179/mo · $1,499 setup
**Templates:** `t2 Vista` AND `t3 Meridian` (two demos required — prospects choose their look)
**Demo slugs:** `t2-demo` and `t3-demo` (existing placeholders — this spec is what they should become)
**Persona used in this spec:** Coast & Compass Travel — coastal escapes and small-ship voyage specialist. _Same persona on both templates so content and supplier data are reusable._
**Source of truth:** `Elite_Advisor_Hub_Feature_Matrix.xlsx` sheets 1, 2, 3, 4, and 6.

This spec is build-ready. Each template implementation is ~6 hours end-to-end via `scripts/seed_*.js` once the persona content and supplier selections are written.

---

## 1. Why Growth needs TWO demos

Growth is the only tier where the prospect picks the template at signup. A prospect reading the Growth row on the pricing page has to be able to click into both Vista and Meridian to choose. If only one demo exists, the template they didn't see feels theoretical — and prospects who would have liked the other look churn before signup.

The two demos use the **same persona, same suppliers, same blog content** — only the template differs. This lets a prospect compare the looks head-to-head with the variable they actually care about (visual identity) isolated.

| Template | Strength | Best fit |
|---|---|---|
| **t2 Vista** | Cinematic, dramatic full-bleed imagery, emotional pacing | Romance, wellness, destination-luxury, coastal |
| **t3 Meridian** | Editorial sans-serif grid, catalog density, structured | Cruise specialists, multi-supplier portfolios, advisors who lead with content |

The Coast & Compass persona works on both because the niche (coastal escapes + small-ship voyages) draws cinematic imagery for Vista and dense catalog content for Meridian.

---

## 2. What this demo has to prove

A prospect lands here from the pricing page after reading the Growth row. The demo has to answer four questions:

1. **"Is $179/month enough website to actually compete for $30k–$80k trips?"** Yes — the searchable hotel directory, searchable cruise directory, and Experiences module together prove the advisor has real inventory depth, not just a marketing site.
2. **"What does Growth add that Starter doesn't?"** The searchable directories, `/experiences`, `/plan-a-trip`, Instagram feed, and testimonials grid are visible and tangible. A prospect can flip between `starter-demo` and this demo and feel the gap immediately.
3. **"What's the upgrade path to Custom?"** The villa add-on isn't visible (correct — it's an add-on, not standard at Growth). No `/atelier`, no `/press`, no bespoke layout. Custom feels earned, not arbitrary.
4. **"Do I like the look?"** Two templates, same persona, side-by-side. The prospect picks before they buy.

---

## 3. Sitemap (identical structure on both templates)

```
coastandcompass.com  (custom domain → middleware → /t2/coast-compass-demo OR /t3/coast-compass-demo)
│
├── /                                 (Home — see §5 for template-specific section orders)
│
├── /about                            (Brand story + advisor profile + single-advisor team)
│
├── /book-hotel                       (M13 Searchable Hotel Directory — filterable)
│   └── /book-hotel/[slug]            (M09 Hotel Brand Page — per-supplier)
│
├── /find-cruise                      (M14 Searchable Cruise Directory — filterable)
│   └── /find-cruise/[slug]           (M10 Cruise Brand Page — per-cruise-line)
│
├── /experiences                      (M15 — curated trip ideas / itineraries)
│
├── /plan-a-trip                      (M16 — structured intake form)
│
├── /journal                          (M18 — full archive)
│   └── /journal/[slug]               (Single post)
│
├── /contact                          (M20 — short contact form, distinct from plan-a-trip)
│
├── /privacy + /terms                 (Auto-rendered)
└── /sitemap.xml                      (M33)
```

**What is intentionally absent** (so prospects feel the upgrade path):

- `/book-villa` — Custom+ (or $29/mo Growth add-on, not surfaced in standard Growth demo)
- `/atelier`, `/press` — t4 Casa Solis only (Custom)
- `/advisors`, `/advisors/[slug]` — Agency only
- `/resources`, `/media` — frontend-only soft pages (Starter template signature)

**Two route notes on the templates:**
- t2 has a `/book-villa` route in the codebase today. **For the Growth demo, do not link to it from the nav or footer.** It's there because t2 is also used at Custom tier where villa ships.
- t3 doesn't have `/book-villa` yet (P2 gap). No action needed.

---

## 4. Page-by-page outline (shared content)

The content is the same across both templates. Section ordering and visual treatment diverge — see §5.

### 4.1 About (`/about`)

| Section | Content |
|---|---|
| Page hero | Full-width coastal image (Amalfi or Norwegian fjord) + page title "About Coast & Compass Travel" |
| Founder story | ~500 words. Why coastal + voyage, sailing background, how the catalog was assembled |
| Single-advisor team band | One advisor card. Do NOT use multi-member grid — that's Agency |
| Credentials strip | Virtuoso · Cruise Lines International Association (CLIA) Master · Aman Voyages · Crystal Cruises Connoisseur · Ponant Préférence |
| Supplier programs grid | Full list of selected programs (matches /book-hotel) |
| CTA band | "Plan your voyage →" → /plan-a-trip |

### 4.2 Hotels (`/book-hotel`) — M13 Searchable Directory

| Section | Content |
|---|---|
| Page hero | "Our preferred hotels and resorts" + 1-line lead |
| Filter bar | Filter by: region · style (resort / boutique / villa-style) · destination · brand |
| Result grid | Filtered cards from `featured_hotels` table. ~30–40 properties seeded for this demo |
| Pagination | 12 per page |

Each card → `/book-hotel/[slug]` (the M09 brand page).

**Critical distinction from Starter:** Starter shows `ProgramLogoGrid` here (logos only, curated). Growth shows actual property cards with filtering. The visual difference is what Growth advisors are paying for.

### 4.3 Hotel Brand Page (`/book-hotel/[slug]`)

Same shape as the Starter brand page, but Growth-tier sites also show:

- A "More properties in this collection" rail
- A "Plan a stay" CTA → /plan-a-trip (with `?supplier=<slug>` for attribution), not /contact

**Seed at least 8 brand pages** for the Growth demo:
Aman · Belmond · Six Senses · Rosewood · Mandarin Oriental · Four Seasons · Auberge · Cheval Blanc.

### 4.4 Cruise (`/find-cruise`) — M14 Searchable Cruise Directory

This is the headline Growth surface for the Coast & Compass persona.

| Section | Content |
|---|---|
| Page hero | "Cruise & voyage partners" |
| Filter bar | Filter by: cruise type (ocean / river / expedition / yacht) · region · cruise line · ship size |
| Result grid | Cards from `cruise_lines` table — ~15–20 cruise lines seeded |

Each card → `/find-cruise/[slug]`.

### 4.5 Cruise Brand Page (`/find-cruise/[slug]`)

Per-cruise-line brand page:

- Hero — cruise line brand imagery
- Brand narrative (~150 words)
- Fleet highlights (3–6 ship cards)
- Featured itineraries (4–6 voyage cards with departure dates)
- "Plan your voyage" CTA → /plan-a-trip

**Seed at least 6 cruise brand pages:**
Silversea · Crystal Cruises · Ponant · Seabourn · Regent Seven Seas · Aman Voyages.

### 4.6 Experiences (`/experiences`) — M15

| Section | Content |
|---|---|
| Page hero | "Trip ideas crafted for you" |
| Experience cards | 8–12 curated itinerary cards |

**Seed 10 itinerary cards** keyed to the persona:

1. "Norwegian fjords by small ship — 9 nights"
2. "Mediterranean coastal grand tour — Sorrento, Capri, Amalfi, 12 nights"
3. "Galápagos expedition + Quito stopover — 11 nights"
4. "Alaska inside passage by yacht — 7 nights"
5. "Croatian Dalmatian coast by sailing yacht — 8 nights"
6. "Caribbean Leewards small-ship — 7 nights"
7. "Greek Cyclades private charter — 10 nights"
8. "Antarctic peninsula expedition — 14 nights"
9. "Japan coastal + Seto inland sea — 12 nights"
10. "Iceland circumnavigation by expedition ship — 8 nights"

Each card opens an itinerary detail page OR links directly to `/plan-a-trip?itinerary=<slug>` depending on what's built.

### 4.7 Plan a Trip (`/plan-a-trip`) — M16

The structured lead form. Fields:

- Name, email, phone
- Trip type (Cruise / Land / Combo)
- Region of interest (multi-select)
- Approximate dates (month picker)
- Number of travelers
- Budget tier ($10–25k / $25–50k / $50–100k / $100k+)
- Travel companions (couple / family / multi-gen / friends)
- "Tell me about the trip you're imagining" (textarea)
- "How did you hear about us?"

This is intentionally heavier than the Starter `/contact` form — it's the conversion of a serious prospect into a serious lead.

### 4.8 Journal (`/journal`) — M18

| Section | Content |
|---|---|
| Page hero | "The Journal" + category tag chips |
| Post grid | Most recent 9 posts (3×3 grid), paginated past 9 |
| Sidebar / aside | Author bio + "Subscribe to the weekly letter" |

**Posts to seed (16 total — Growth runs 1/week broadcast cadence, demo carries ~4 months of content):**

Operator broadcasts (12 — 1 per week for 12 weeks):

1. "Why expedition cruising is the fastest-growing luxury cruise segment"
2. "Ponant vs. Silversea expedition fleet — what changes for the traveler"
3. "When to book Antarctic 2027 (it's now)"
4. "The Mediterranean shoulder season case — late September through early November"
5. "Five small-ship cruise lines worth the premium"
6. "How to think about cabin selection on a 100-passenger ship vs. a 1,000-passenger ship"
7. "Aman Voyages first year — what the early sailings actually delivered"
8. "Greek Cyclades by private charter — what $80k buys vs. $40k"
9. "Single-supplement-free sailings worth knowing about"
10. "The Norwegian fjord pacing problem — and the itinerary that solves it"
11. "Caribbean repositioning cruises and the hidden value in November transitions"
12. "Why Galápagos is harder to plan than Antarctica (and how I do it)"

Advisor originals (4 — sprinkled in):

13. "What I bring to a first call with a new client"
14. "How I select a cabin without seeing the ship"
15. "Three voyages I'd take in 2027"
16. "What I learned from sailing Crystal's relaunch"

### 4.9 Contact (`/contact`)

Short form for low-intent prospects who don't want to fill the long form:

- Name, email
- "What can I help you with?" textarea

Distinct from `/plan-a-trip`. The two CTAs sit in different places — short Contact in the nav, long Plan-a-Trip as the primary button.

---

## 5. Home page section order — divergence by template

The persona content is identical. The home page composition is where t2 Vista and t3 Meridian diverge.

### 5.1 T2 Vista home (canonical Growth demo — lead with this)

Render in this order — already wired in `app/t2/[agentId]/page.tsx` default:

| # | Section | Component | Module | What the prospect sees |
|---|---|---|---|---|
| 1 | Full-bleed cinematic hero | `T2HeroStatic` | M01 | Single dramatic frame: small ship at golden-hour anchor in Amalfi. Tagline + dual CTA: "Plan a voyage" → /plan-a-trip · "Explore experiences" → /experiences |
| 2 | Service cards | `T2ServiceCards` | M03 | 3 tiles: "Curated voyages" · "Coastal expertise" · "Virtuoso perks every time" |
| 3 | Advisor profile | `T2AdvisorProfile` | M02 | Founder portrait, bio, credentials lockup |
| 4 | Virtuoso band | `T2VirtuosoBand` | M05 | Virtuoso member affiliation + 6–8 supplier-credential logos |
| 5 | Partner grid | `T2PartnerGrid` | M06 | Tabbed hotels / cruise lines / villas (villa tab disabled — see §8) |
| 6 | Destination carousel | `T2DestinationCarousel` | M08 | Featured destinations: Amalfi · Norwegian fjords · Greek isles · Antarctica · Galápagos · Croatian Dalmatian coast |
| 7 | Experiences grid | `T2ExperienceGrid` | M15 | 4–6 itinerary tiles → /experiences |
| 8 | Testimonials grid | `T2TestimonialsGrid` | M19 | 6-card grid of voyage-flavored testimonials |
| 9 | Journal teaser | `T2JournalTeaser` | M18 | 3 most recent posts → /journal |
| 10 | Instagram feed | `T2InstagramFeed` | M17 | 6-image IG embed (use a placeholder handle for demo) |
| 11 | Lead form band | `T2LeadForm` | M16-lite | Compact inline lead form → submits to inquiries |

### 5.2 T3 Meridian home

T3's default page already renders most sections. **Two components must be ADDED to the demo** that aren't in the default route file today:

- `T3TestimonialsGrid` (component exists, not in `app/t3/[agentId]/page.tsx` yet)
- `T3InstagramFeed` (component exists, not in the default page yet)

Order:

| # | Section | Component | Module | What the prospect sees |
|---|---|---|---|---|
| 1 | Split hero | `T3HeroSplit` | M01 | Editorial split: hero image left, headline + sub-headline + CTA right |
| 2 | Philosophy | `T3Philosophy` | M04 | Editorial brand-story paragraph (~120 words) |
| 3 | Service cards | `T3ServiceCards` | M03 | 3 sans-serif cards, no imagery |
| 4 | Advisor profile | `T3AdvisorProfile` | M02 | Two-column layout: portrait + structured bio with bullets |
| 5 | Virtuoso band | `T3VirtuosoBand` | M05 | Sans-serif credentials strip |
| 6 | Partner tabs | `T3PartnerTabs` | M06 | Tabbed structured partner index |
| 7 | Destination scroll | `T3DestinationScroll` | M08 | Horizontal-scroll editorial destination cards |
| 8 | Full-bleed feature | `T3FullBleedFeature` | M04-extension | One full-bleed cinematic frame breaking the grid — typically the marquee experience |
| 9 | Journal teaser | `T3JournalTeaser` | M18 | 3-card editorial journal preview |
| 10 | **ADD: Testimonials grid** | `T3TestimonialsGrid` | M19 | **Not in default route — add for this demo** |
| 11 | **ADD: Instagram feed** | `T3InstagramFeed` | M17 | **Not in default route — add for this demo** |
| 12 | Contact section | `T3ContactSection` | M20 | Editorial contact band, no separate lead form (Meridian uses one CTA flow) |

**T3 design note:** T3 has no equivalent of T2's `T2ExperienceGrid` on the home. The `/experiences` page still ships (T3ExperienceEditorial), but it isn't surfaced on the home. This is intentional — Meridian uses the journal and destination scroll to do the editorial work that Vista does with the experience grid. The `T3FullBleedFeature` slot can be used to spotlight one signature experience as a workaround if you want the home to telegraph the Experiences page.

---

## 6. Navigation

**Header nav (both templates):**

```
About · Hotels · Cruise · Experiences · Journal · Contact  →  [Plan a Trip] (button → /plan-a-trip)
```

Mobile nav: hamburger drawer, same items, "Plan a trip" pinned full-width at bottom.

**Footer columns (both templates):**

```
Coast & Compass Travel       Explore           Plan                  Connect
[logo + 1-line]               About             Plan a Trip            IG @coastandcompass
                              Hotels            Contact                Email link
                              Cruise            Experiences            [Virtuoso lockup]
                              Journal           Privacy · Terms        [Powered by EAH]
                              Sitemap
                              © 2026
```

The "Powered by EAH" lockup stays — white-label is a Custom add-on, not Growth.

---

## 7. Module → Component map (per template)

| Module | T2 Vista component | T3 Meridian component |
|---|---|---|
| M01 Hero | `T2HeroStatic` | `T3HeroSplit` |
| M02 Advisor Profile | `T2AdvisorProfile` | `T3AdvisorProfile` |
| M03 Service Cards | `T2ServiceCards` | `T3ServiceCards` |
| M04 Brand Story | (inline in T2 home / about page) | `T3Philosophy` |
| M05 Virtuoso Band | `T2VirtuosoBand` | `T3VirtuosoBand` |
| M06 Partner Tabs | `T2PartnerGrid` | `T3PartnerTabs` |
| M07 Hotel Programs Teaser | `T2HotelProgramsGrid` (use on /about, not home) | (use Partner Tabs slot) |
| M08 Destination Carousel | `T2DestinationCarousel` | `T3DestinationScroll` |
| M09 Hotel Brand Page | `app/t2/[agentId]/book-hotel/[slug]/page.tsx` | `app/t3/[agentId]/book-hotel/[slug]/page.tsx` |
| M10 Cruise Brand Page | `app/t2/[agentId]/find-cruise/[slug]/page.tsx` | `app/t3/[agentId]/find-cruise/[slug]/page.tsx` |
| M13 Searchable Hotels | `FindHotelClient` | `T3HotelDirectory` |
| M14 Searchable Cruise | `FindCruiseClient` | `T3CruiseGrid` |
| M15 Experiences | `T2ExperienceGrid` (home) + `T2ExperiencesGrid` (page) | `T3ExperienceEditorial` |
| M16 Plan-a-Trip | `T2LeadForm` + `/plan-a-trip` route | `/plan-a-trip` route (uses T3-flavored form — verify wired) |
| M17 Instagram Feed | `T2InstagramFeed` | `T3InstagramFeed` (must ADD to home) |
| M18 Journal | `T2JournalTeaser` + `/journal` | `T3JournalTeaser` + `/journal` |
| M19 Testimonials | `T2TestimonialsGrid` | `T3TestimonialsGrid` (must ADD to home) |
| M20 Contact | `T2ContactForm` | `T3ContactSection` |
| M31 Custom Domain | middleware (existing) | middleware (existing) |
| M33 SEO | `lib/seo` + per-template metadata helpers | same |

---

## 8. Demo data requirements

**Agent record** (`agents` table):
- `id`: new UUID
- `slug`: `t2-demo` (and parallel `t3-demo`)
- `agency_name`: Coast & Compass Travel
- `tier`: `growth`
- `template`: `t2` (and parallel `t3`)
- `custom_domain`: blank or `coastandcompassdemo.com`
- `advisor_name`: pick a plausible name (e.g. "Marin Halloway")
- `bio` + `bio_long`: voyage-specialist narrative
- `headshot_url`: placeholder advisor photo

**Hotel programs** (`agent_hotel_program_selections`):
Select 20–28 programs anchored on coastal and resort properties. Suggested:
Aman · Belmond · Six Senses · Rosewood · Mandarin Oriental · Four Seasons · Auberge · Cheval Blanc · Como · Bulgari · Park Hyatt · Peninsula · Ritz-Carlton · St. Regis · One&Only · Anantara · Bvlgari · Capella · Raffles · Cap Juluca (Belmond) · Splendido (Belmond) · Le Sirenuse Positano · Hotel du Cap Eden-Roc · Hotel Cala di Volpe.

**Featured hotels** (`featured_hotels`): ~30–40 properties across the 8 brand pages, weighted toward coastal Mediterranean, Caribbean, and Norwegian/Alaskan ports.

**Cruise lines** (`cruise_lines`):
Silversea · Crystal Cruises · Ponant · Seabourn · Regent Seven Seas · Aman Voyages · Explora Journeys · Scenic Eclipse · Hapag-Lloyd · Lindblad Expeditions · National Geographic · Atlas Ocean Voyages · Sea Cloud Cruises · Star Clippers · Windstar.

**Blog posts** (`blog_posts` + `agent_blog_preferences`):
Seed the 16 posts listed in §4.8. Tag operator broadcasts with `target_demo_slugs = ['t2-demo', 't3-demo']` so both demos share the content (same persona = shared journal).

**Experiences/itineraries:**
The 10 itinerary cards listed in §4.6. If there isn't a structured itineraries table yet, seed them as a static array consumed by `T2ExperienceGrid` / `T3ExperienceEditorial`. (This may surface a small data-model gap worth flagging — see §11.)

**Testimonials:**
6 voyage-flavored quotes, attributed to first-name + last-initial + city. Examples:

- "Marin built our 12-day Norwegian fjord voyage around my husband's photography. Every port, every lunch, perfectly cued." — Lauren K., Chicago
- "I'd cruised twice with another advisor before. Coast & Compass was the first time it felt designed for us, not booked from a catalog." — Daniel W., San Francisco
- (and 4 more)

**Instagram:**
Use a placeholder handle like `@coastandcompass.demo` and seed 9 image URLs. If the IG embed component needs real public IG data, drop a static 9-image grid fallback for the demo.

---

## 9. SEO checklist

- **Title pattern:** `Coast & Compass Travel — Virtuoso Coastal & Voyage Specialist`
- **Description:** ~155 chars mentioning Virtuoso, coastal escapes, small-ship voyages, Mediterranean, Norwegian fjords, custom itineraries.
- **JSON-LD:** `TravelAgency` + `leadAdvisorSchema` (wired per template).
- **Open Graph image:** 1200×630 coastal cinematic — Amalfi or Norwegian fjord.
- **Sitemap:** verify `/sitemap.xml` lists all 8 public routes on each template.
- **Keywords (informational, not declared):** small ship cruise advisor, expedition cruise advisor, Mediterranean luxury cruise, Norwegian fjord voyage, Galápagos expedition planner.

---

## 10. What this demo must NOT look like

- ❌ A villa route in the nav, footer, or any home section. Villa is Custom+ (or a $29/mo Growth add-on — not standard in the demo).
- ❌ An `/atelier` or `/press` route. Those are t4 Casa Solis Custom only.
- ❌ A multi-advisor team grid on `/about`. Single advisor — multi-advisor is Agency.
- ❌ "Powered by EAH" suppressed. White-label is a $999 Custom add-on, not Growth.
- ❌ A `/resources` or `/media` page. Those are frontend-template-only soft pages (Starter signature).
- ❌ A bespoke hero treatment that doesn't match the standard t2 or t3 hero component. Custom layout is Custom tier.
- ❌ The blog cadence implying more than 1 operator broadcast per week. 12 broadcasts over ~12 weeks is exactly the Growth cadence; more implies Custom (2/week).
- ❌ Generic "luxury travel" copy. The persona is a voyage and coastal specialist — every page should reinforce that niche or the demo reads like a placeholder.

---

## 11. Build sequence (~6 hours per template)

For the canonical t2 Vista build, in order:

1. **20 min** — create agent record, slug, confirm `/t2/coast-compass-demo` resolves.
2. **45 min** — write persona content (bio, brand story, about-page long-form, hero copy, service-card copy, testimonial quotes).
3. **45 min** — select & seed 20–28 hotel programs + ~30 featured properties.
4. **30 min** — select & seed 15 cruise lines + 6 cruise brand pages with fleet/itinerary data.
5. **45 min** — seed 10 experience/itinerary cards (decide on data-model approach — see §12).
6. **90 min** — draft 16 blog posts (use `eah-journal-writer` skill — exactly its sweet spot at 1/week cadence).
7. **30 min** — source hero imagery (1 dramatic coastal frame for T2HeroStatic + IG fallback grid).
8. **30 min** — pass at 375 / 768 / 1280 px; fix any layout drift on /book-hotel, /find-cruise, /experiences, /plan-a-trip.
9. **15 min** — run the cross-template audit checklist from `docs/demo-feature-checklist.md`.

**For the parallel t3 Meridian build (~4 hours after t2 is done):** persona content, blog posts, supplier data, cruise lines, and experiences are all reusable. The t3-specific work is:
- 30 min — wire `T3TestimonialsGrid` and `T3InstagramFeed` into `app/t3/[agentId]/page.tsx` (these components exist but aren't in the default route today).
- 45 min — adapt hero imagery to the T3HeroSplit treatment (needs both an image and a tighter headline).
- 30 min — verify the `/plan-a-trip` form is wired on t3 (it's a Growth-headline module; confirm it submits to `inquiries`).
- 90 min — visual pass; t3 has tighter typographic discipline than t2 and may need copy trimming.

---

## 12. Open decisions (decide before kicking off)

1. **One template first, or both in parallel?** Recommend leading with t2 Vista — it's the canonical Growth template per the matrix, and the t2 default page composition is already complete. The t3 build benefits from the t2 content being written first.
2. **Persona — keep "Coast & Compass" or swap?** Alternatives worth considering: "Romance & Honeymoon" specialist (per Strategic Plan §6 addition) or "Wellness Travel" (refresh of wwt-demo). The Coast & Compass niche was chosen because it showcases all three Growth headline modules (hotel directory, cruise directory, experiences) and works on both templates equally.
3. **Slugs — keep `t2-demo` / `t3-demo` or rename to `coast-compass-t2-demo` / `coast-compass-t3-demo`?** The existing slugs are generic and template-named; persona-named slugs read better in URLs but require a small `lib/demo-agents.ts` update.
4. **Experiences/itineraries — static seed array or structured table?** The Feature Matrix references M15 Experiences but the data model behind itinerary content isn't tracked there. If there's no `itineraries` table today, the demo will surface that gap. Either decide to ship the table (small migration) before the demo, or accept that the demo's `/experiences` reads from a static seed file.
5. **Custom domain — wire `coastandcompass.com` or stay on the EAH subpath?** A custom domain on the canonical Growth demo is the strongest signal that the platform supports them. Cost is one demo domain.
6. **Villa add-on — surface it as a $29/mo upgrade chip somewhere on this demo, or fully hide?** Hiding it keeps the demo clean and lets villa stay a Custom-tier story; surfacing it (e.g. a "+ Villa add-on for Growth advisors" line on /about) demonstrates the Growth → Custom upgrade lever.
