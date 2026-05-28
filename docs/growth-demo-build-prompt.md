# Claude Code Prompt — Build the Coast & Compass Growth Demo

**Use this file by:** opening Claude Code in this repo and pasting the prompt in §1 below as your first message. Claude Code will read the referenced files, ask clarifying questions where the spec is intentionally ambiguous, and then implement.

The voice brief in §2 was distilled from amazetravel.com — keep it inline so Claude Code doesn't have to fetch the URL.

---

## 1. The prompt (copy-paste this into Claude Code)

> I'm building a new canonical Growth-tier demo on the `t2` Vista template. It replaces the placeholder `t2-demo` slug with a real persona — Coast & Compass Travel, a coastal escapes and small-ship voyage specialist. The t3 Meridian parallel build will follow in a separate session.
>
> **Read first:**
>
> - `CLAUDE.md` — the project constitution, especially §3 (tier × template lock), §6 (data model), §7 (non-negotiable conventions).
> - `docs/growth-demo-spec.md` — the full spec for what this demo must contain. This is the authoritative outline. Follow it.
> - `docs/demo-feature-checklist.md` §"Tier 2 — Growth" — the required-visible modules for Growth.
> - `docs/brand-positioning.md` — the top-1% voice rules. Apply these even when adapting the Amaze Travel voice (see "voice brief" below — Amaze uses some commodity-register phrasing that conflicts with EAH's top-1% positioning; the brief tells you which patterns to take and which to reject).
> - `lib/demo-agents.ts` — current demo slug registry.
> - `app/t2/[agentId]/page.tsx` — canonical t2 home composition.
> - `components/t2/` — every t2 component you'll be assembling.
>
> **Do not read or rebuild:** the strategic plan, executive summary, or anything else strategic. The spec doc already extracts what you need from those.
>
> **Scope — in this session, you will:**
>
> 1. Add a new demo agent to `lib/demo-agents.ts`:
>    - `slug`: `coast-compass-demo`
>    - `label`: `Coast & Compass Travel (T2 Vista — Growth)`
>    - `template`: `t2`
> 2. Build the demo as an in-memory mock (no Supabase row, no migrations). Follow the pattern that `t2-demo` and `wwt-demo` use today — whichever is cleaner. If neither, the cleanest approach is to extend the existing demo-mock layer.
> 3. Render the canonical t2 Vista home composition in this order (already wired in `app/t2/[agentId]/page.tsx`): T2HeroStatic → T2ServiceCards → T2AdvisorProfile → T2VirtuosoBand → T2PartnerGrid → T2DestinationCarousel → T2ExperienceGrid → T2TestimonialsGrid → T2JournalTeaser → T2InstagramFeed → T2LeadForm.
> 4. Populate every page in the Growth sitemap: `/about`, `/book-hotel` (searchable directory), `/book-hotel/[slug]` (≥8 brand pages — see spec §8), `/find-cruise` (searchable directory), `/find-cruise/[slug]` (≥6 cruise brand pages), `/experiences`, `/plan-a-trip`, `/journal` + `/journal/[slug]`, `/contact`.
> 5. Write all persona copy yourself using the voice brief in §2 of this file. Do not use Lorem Ipsum. Do not write generic luxury travel platitudes — every section should reinforce the coastal + voyage niche.
> 6. Use **placeholder data** for experiences/itineraries — there is no `itineraries` table yet. Seed the 10 itineraries from spec §4.6 as a static array consumed by `T2ExperienceGrid` and the `/experiences` page. Place the seed file at `lib/demo-experiences.ts`. When the real table ships later, the demo will migrate by swapping the import.
> 7. Use **real data** where it exists: hotel programs from `hotel_programs`, cruise lines from `cruise_lines`, blog posts via `blog_posts` with `target_demo_slugs = ['coast-compass-demo']`. If the demo-mock pattern stores posts inline instead of in the table, follow that pattern.
> 8. Seed the 16 blog posts from spec §4.8. Use the voice brief for tone. Operator-broadcast posts should feel co-authored (operator voice with advisor framing); advisor originals should feel first-person.
> 9. Source hero imagery — use placeholder URLs from public coastal stock (Unsplash collections) or commit a single hero image to `public/media/demos/coast-compass/` if that's the established pattern. Don't fabricate paths; check what `t2-demo` and `casa-solis` do.
>
> **Out of scope for this session — flag and move on:**
>
> - T3 Meridian parallel build (separate session — I'll trigger it next).
> - Wiring `T3TestimonialsGrid` and `T3InstagramFeed` into `app/t3/[agentId]/page.tsx` (this is the prerequisite for the t3 build; I'll handle separately).
> - Creating an `itineraries` table (placeholder data approach above).
> - Custom domain wiring for `coastandcompass.com` (operator side; not a code task).
> - The `/book-villa` route on t2 — this demo is Growth, so villa is not surfaced. If you encounter villa references in shared layouts (nav, footer), confirm they're tier-gated and not hard-coded.
>
> **Constraints (from CLAUDE.md):**
>
> - URL composition goes through `lib/tenant-paths.ts`. Don't build `/t2/${agentId}/...` strings inline.
> - Template isolation: stay in `components/t2/`. Don't import from `components/t3/`.
> - SSR from Supabase using `lib/supabase/server.ts` on cacheable pages. The demo-mock layer should already handle the agent lookup; don't go around it.
> - If you add any write paths (you shouldn't — this is a demo seed), wire `revalidatePath` for the affected public route.
> - Keep "Powered by Elite Advisor Hub" visible in the footer. White-label is a Custom add-on, not Growth.
>
> **Acceptance criteria — verify each before reporting done:**
>
> 1. `npm run dev` starts cleanly; `/t2/coast-compass-demo` resolves at 200.
> 2. All 10 routes in the spec sitemap (§3) resolve at 200. Run `curl -I` on each, or open them.
> 3. The home page renders all 11 sections from §5.1 of the spec, in order, with persona content.
> 4. `/book-hotel` shows the searchable directory with at least 30 properties from the 8+ seeded brand pages. Filters work.
> 5. `/find-cruise` shows the searchable directory with at least 6 cruise lines. Each `/find-cruise/[slug]` brand page resolves.
> 6. `/experiences` renders 10 itinerary cards from `lib/demo-experiences.ts`.
> 7. `/plan-a-trip` renders the structured form with all fields listed in spec §4.7. Submitting writes to the `inquiries` table (or the demo-mock equivalent).
> 8. `/journal` lists 16 posts (12 broadcasts + 4 advisor originals). Each post detail page resolves.
> 9. `/contact` renders the short form.
> 10. `npx tsc --noEmit` returns zero new errors.
> 11. Browser-preview at 375 / 768 / 1280 px. No broken layouts on any page.
> 12. The home page contains no Lorem Ipsum and no generic luxury-travel filler. Every paragraph reads like Coast & Compass.
>
> **When you're done:** report what you built, what you placeholdered, what you discovered (any drift from the spec, any data-model gaps), and which open decisions from spec §12 are now decidable.
>
> **One final thing:** if the spec and the codebase disagree, follow the codebase and tell me. The spec is a planning artifact; the code is reality.

---

## 2. Voice brief — adapted from amazetravel.com

This brief is for the persona copy you'll write in this build. It distills the patterns from amazetravel.com (About, Process, Ultra-Luxury Cruising pages) **and applies EAH's top-1% positioning where Amaze drifts into commodity register.**

### Take from Amaze

| Pattern | Example phrasing | Use it for |
|---|---|---|
| Three-pillar framing | "The Complete Experience · Expanded Possibilities · Peace of Mind" | The 3 service cards on the home (T2ServiceCards) |
| Three-verb pacing | "EXPLORE, ENCOUNTER, and ENRICH" | Hero tagline, section-opening lines |
| Signature short phrase | "Effortless elegance" | Hero kicker, journal column header |
| Specific name-drops | "Hidden coves in the Greek Isles, vintage wines in Bordeaux, ancient ports in the South China Sea, sea turtles in the Seychelles" | Brand story, destination carousel captions |
| "Curated for you" register | "Perfectly paired voyages, curated just for you" "Crafting an experience that aligns seamlessly with your interests, pace, and style" | /experiences intro, /plan-a-trip intro |
| Possessive brand framing | "The Coast & Compass Distinction" (parallel to "The Amaze Travel Distinction") | Section header on /about |
| Virtuoso framing | "As a member of the invitation-only Virtuoso network — reserved for the top 1% of travel advisors worldwide" (Amaze says 2%; for EAH brand positioning, use **top 1%**) | T2VirtuosoBand description |
| "Privileged partnerships" / "privileged relationships" | "Privileged partnerships with the world's most esteemed cruise and yachting brands" | T2PartnerGrid intro line |
| Process language | "From the moment we first meet until after your journey concludes, we are dedicated to you" | /about section, /plan-a-trip lead |
| 4-step process pattern | Introduction → Proposal → Confirm → Enjoy | Optional /about section or a dedicated `/process` page (not in the spec — skip unless a stretch goal) |
| Before / during / after | "We are available before, during, and after your trip so that you can travel with confidence" | T2ContactForm intro, /plan-a-trip page |
| Sensory specificity | "Unpack once and let the world come to you" "Toast vintage wines in Bordeaux" "Anchored off the Dalmatian Coast" | Hero copy, /experiences card descriptions |
| Sentence rhythm | Long, comma-rich, image-stacked sentences. Multiple geographic name-drops per paragraph | All long-form prose |

### Reject from Amaze

These phrases appear in Amaze's meta keywords or page copy but conflict with EAH's top-1% positioning rules (`docs/brand-positioning.md`). **Do not use:**

- "Best deals" / "Travel specials" / "Vacation packages" / "Cruise deals" — commodity register, never EAH.
- "Quick weekend getaway" — wrong audience; Coast & Compass plans 7–14 night voyages, not weekend trips.
- "Save money" / "Affordable luxury" / "Best price" — never. Pricing is the floor, not a discount.
- "Dream vacation" — overused; prefer "your next voyage," "the trip you've been imagining," "the journey you've been planning."
- "Amazing" / "Awesome" — too casual.

### EAH-specific upgrades on the Amaze patterns

- Where Amaze says "top 2% of travel agents," EAH says **"top 1% of travel advisors"** (note: advisors, not agents — EAH never uses "agent" except in technical code references like `agentId`).
- Where Amaze says "luxury travel agency," EAH says **"travel advisory"** or **"travel advisor."** "Agency" is reserved for multi-advisor Agency-tier clients in EAH.
- Where Amaze says "VIP treatment," EAH says **"unparalleled access"** or **"recognized at every front desk."**
- Where Amaze says "tailor-made," EAH alternates with **"composed for you"** / **"designed around how you travel."**

### Persona-specific lexicon for Coast & Compass

Use these terms repeatedly so the niche reads through every page:

| Domain | Preferred words |
|---|---|
| Vessels | small ship · yacht · expedition vessel · river ship · super-yacht · voyage |
| Geographies | Mediterranean · Norwegian fjords · Dalmatian Coast · Cyclades · Galápagos · Antarctic Peninsula · Inside Passage · Seychelles |
| Service register | composed · choreographed · paced · anchored · provisioned · charted |
| Sensory cues | golden-hour anchor · tender ashore · the morning light · quiet at the bow · the captain's table |
| Avoid | "cruise package" · "shore excursions package" · "set sail on the trip of a lifetime" (cliché) · "all-inclusive" (commodity) |

### Hero tagline candidates (pick one or write better)

The brief above should let Claude Code write its own. If it asks for a starting point, offer:

- **"The world, at sea level."** (kicker) "Composed voyages for travelers who measure trips in moments, not miles."
- **"Effortless at sea. Considered ashore."** "Small-ship voyages and coastal escapes, designed around how you actually travel."
- **"From the bow, the next harbor."** "Coastal and voyage planning for the top 1%, with Virtuoso access to every ship worth boarding."

---

## 3. After this build session

When Claude Code reports back, the natural next steps are:

1. **Visual pass on the canonical t2 demo.** Open every route at 375 / 768 / 1280 px. The spec lists this as step 8 of the build sequence — confirm the agent actually did it.
2. **Schedule the t3 Meridian parallel build.** Open a new Claude Code session, point at `docs/growth-demo-spec.md`, and request the t3 version. Note that this session requires the T3 component-wiring follow-up first.
3. **T3 component-wiring follow-up.** Add `T3TestimonialsGrid` and `T3InstagramFeed` to `app/t3/[agentId]/page.tsx` (sections 10 and 11 in the spec's §5.2). 30-minute task; can be its own small PR.
4. **Decide on the open questions from spec §12** that Claude Code surfaces during the build — particularly the persona name, the slug convention (`coast-compass-demo` vs `t2-demo`), and whether to wire the `coastandcompass.com` custom domain on the demo.
5. **Update `lib/demo-agents.ts` cleanup.** Once `coast-compass-demo` is live, decide whether to retire the old `t2-demo` slug or keep it as a generic fallback.

---

## 4. Quick-reference build sequence (matches spec §11)

For Claude Code's planning step, this is the time budget the spec calls for:

| # | Step | Time |
|---|---|---|
| 1 | Agent record + slug + route check | 20 min |
| 2 | Persona content (bio, brand story, hero copy, testimonials) | 45 min |
| 3 | Seed 20–28 hotel programs + ~30 featured properties | 45 min |
| 4 | Seed 15 cruise lines + 6 cruise brand pages | 30 min |
| 5 | Seed 10 experience/itinerary cards (placeholder array) | 45 min |
| 6 | Draft 16 blog posts (use `eah-journal-writer` skill) | 90 min |
| 7 | Hero imagery sourcing | 30 min |
| 8 | Responsive pass at 375 / 768 / 1280 px | 30 min |
| 9 | Cross-template audit (see `docs/demo-feature-checklist.md`) | 15 min |
| | **Total** | **~6 hours** |

---

## 5. If Claude Code asks you a clarifying question

The spec intentionally leaves a handful of decisions to the operator. Likely questions and the recommended answers:

| Likely question | Recommended answer |
|---|---|
| "Slug — `coast-compass-demo` or keep `t2-demo`?" | `coast-compass-demo` (persona-named slugs read better in URLs) |
| "Persona name — Coast & Compass Travel?" | Yes, unless you've decided otherwise |
| "Advisor name?" | "Marin Halloway" or pick something fresh — flag for review |
| "Where do experience itineraries live?" | Static seed file at `lib/demo-experiences.ts` |
| "How should I source hero imagery?" | Use Unsplash placeholder URLs; commit to `public/media/demos/coast-compass/` only if that matches the existing pattern |
| "Should I create a `/process` page like Amaze has?" | No — not in the spec. Note it as a stretch goal |
| "Custom domain `coastandcompass.com` — wire it now?" | No — operator decision, not a code task |
| "Should I write the 16 blog posts in this session or scaffold them empty?" | Write at least the 3 most-recent of each category (so journal feels populated); the rest can be drafted by `eah-journal-writer` afterward |
