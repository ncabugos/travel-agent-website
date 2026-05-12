# Aurora (t5) — Concept Doc

> The Signature-tier template. A categorically different advisor website.
> Dogfooded on wineandwellnesstravel.com starting Month 6. Live as a paid tier in Month 9–10.
> Companion to: `Elite_Advisor_Hub_Strategic_Plan.docx` §5 and `Elite_Advisor_Hub_Feature_Matrix.xlsx` (sheet 4: Add-ons).

---

## The core insight

Traditional advisor websites organize around the *supplier's* worldview — destinations on the menu, hotels in a grid, cruise lines in tabs. The traveler is required to translate their actual desire ("we want to slow down and eat well for two weeks somewhere we haven't been") into the supplier ontology ("Italy → Tuscany → Castello di Reschio"). That translation is what advisors do for a living. The existing templates make the customer perform the work before they reach the advisor.

Aurora inverts the surface. The supplier catalog is still the engine — but the lens is the traveler's mental model, not the supplier's. Three radical UX moves carry the inversion.

## UX move 1 — Discovery by feeling, not destination

The homepage replaces destination cards with **mood cards**. Initial set:

- **Slow Mornings** — places designed for stillness and presence; one-of-a-kind hotels, late breakfasts, no rush.
- **Wide-Open Spaces** — wilderness, Patagonia, the Highlands, the Big Sky, the wide American West.
- **Architectural Pilgrimages** — Kyoto, Marrakech, Mexico City, the small towns of Apulia.
- **Two Weeks With Kids** — family travel that respects the adults too.
- **Once-In-A-Lifetime** — anniversary, retirement, milestone trips; bigger budgets, more orchestration.
- **Quietly Romantic** — honeymoons that do not look like honeymoons.

Each mood is a curated lens onto the catalog — 8–12 properties, 4–6 experiences, 2–3 journal posts, all selected by the advisor (or by Claude on the advisor's behalf, then approved). The traveler picks the mood that matches the trip they are trying to take. The catalog is presented through a lens that converts.

Implementation: a `moods` table with `slug`, `name`, `description`, `hero_image_url`; a `mood_curation` table linking moods to hotel_programs, cruise_lines, experiences, and blog_posts with display ordering. Each advisor has their own curation; defaults can be operator-seeded.

## UX move 2 — The AI trip composer is a first-class surface

Not a chat bubble in the corner. Not buried in a "Plan a Trip" form. The composer is on the homepage, above the fold, with a prompt-style input: "Tell me about your next escape."

A traveler types — or speaks — something like: *"10 days in Italy in October, 40th birthday, $25k budget, two adults, want to drive part of it."* The composer streams a draft itinerary:

- 3 nights at Hotel de Russie, Rome
- 2 days driving north, recommended Cinque Terre stop
- 4 nights at Castello di Reschio, Umbria
- 1 night in Florence before departure
- Estimated total: $22,000 – $28,000

Each property card has the photo, the Virtuoso perks the advisor has access to, the approximate nightly rate band. Each day has 1–2 experience suggestions (private cooking class with a Michelin-starred chef, vineyard helicopter tour, etc.).

At the bottom: a "Send this to my advisor with my notes" button. One click serializes the itinerary into an `inquiries` row with `itinerary_draft_json` attached. The advisor receives a fully-qualified lead with a half-built trip, not a one-line form submission.

This is the feature no Squarespace template can match. It requires the maintained Virtuoso catalog (EAH has it) and Claude API access (EAH has it). Both pieces are structural advantages that compound.

## UX move 3 — The Living Portfolio

The homepage's middle section shows **real recent trips the advisor has planned**, anonymized — "Anniversary in Kyoto, May 2026," "Three weeks in Patagonia, March 2026," "Family of five in Provence, August 2025." Each entry is a 200–300 word planning story:

- What the clients asked for.
- The surprise the advisor sourced (a private cooking class, a helicopter transfer instead of a long drive, a Michelin reservation pre-booked four months ahead).
- A handful of large photographs.
- What the clients said after.

This is fashion-magazine editorial content for travel. It does three things at once: builds trust through specificity (abstract testimonials are weak; planning stories are visceral), teaches the prospect what an advisor actually does (most prospects do not know), and gives Claude infinite material to write from in the journal pipeline.

Schema: `trip_stories` table — agent_id, title, destination_summary, trip_dates, body (Tiptap JSON), client_quote, photos (jsonb), display_order, status.

## Tier positioning — Signature

Aurora is its own tier, not a Custom add-on.

- **Price: $599/mo + $7,499 setup**.
- **Volume: capped at 5 paid Signature advisors in year one**. Maintain scarcity and design attention.
- **Stripe product: separate SKU**, not a checkbox on Custom. Aurora has different unit economics (Claude API cost per advisor) and a different sales motion (application + interview, not self-serve).
- **Year 2: convert Aurora to a $200/mo add-on** available to existing Custom advisors once cost economics and usage patterns are proven.

The progression mirrors how Apple launches new product categories: a premium, low-volume first generation builds the proof; a more accessible second generation scales the market once the proof exists.

## Dogfooding sequence

| Phase | Month | Action |
|---|---|---|
| Build on real account | Nov 2026 (Month 6) | Implement `t5/[agentId]` route. Wire to Nick's Wine & Wellness account first. Launch on wineandwellnesstravel.com. |
| Collect data | Nov 2026 – Jan 2027 | 60 days of trip-composer interaction data: which queries, which moods, which itineraries, which clients convert. Document cost per active advisor. |
| Refine | Jan 2027 (Month 8) | Refine system prompts, catalog query layer, cost containment. Document the cost-per-active-advisor curve. |
| First paid Signature | Feb–Mar 2027 (Months 9–10) | Onboard first paid Signature advisor — likely Eden (edenforyourworld.com, brand ambassador) or hand-picked from network. |
| Open applications | Apr 2027 (Month 11+) | Selective applications. Cap at 5 Signature advisors year one. |

## Technical architecture

**Server components fetch the catalog.** Standard Next.js 16 RSC pattern. The advisor's full hotel_programs, cruise_lines, villas, and experiences load on the server, with mood-curation filters applied.

**Claude API call composes itinerary.** Streaming response so the user watches the itinerary materialize — that materialization is the wow moment. Per-advisor system prompt loaded with:
- Advisor's bio, specialties, supplier affinities
- 3–5 sample Living Portfolio stories (style transfer)
- The advisor's catalog as a structured context block
- Tone and disclosure rules

**Output renders structurally.** Not a wall of Claude's text — the response is parsed into structured itinerary components (day cards, property cards, experience cards, budget bands). Reliability matters; use structured JSON output with a fallback.

**Cost containment.** Cache common compositions keyed on normalized query hash. Rate-limit by IP (3 free compositions per session, then email gate). Email gate doubles as lead capture. Per-advisor monthly cap on Claude API spend; alert operator if any advisor approaches it.

**"Send to advisor" button.** Serializes the itinerary draft into `inquiries` with `itinerary_draft_json`, marks the inquiry with `source = 'aurora_composer'` for analytics, and triggers a Resend email to the advisor with the structured draft.

## Data model additions for Aurora

A single migration (`032_aurora.sql` after the agency migration):

```sql
-- Moods
CREATE TABLE public.moods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  hero_image_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0
);

-- Per-advisor mood curation
CREATE TABLE public.mood_curation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  mood_id UUID NOT NULL REFERENCES public.moods(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('hotel_program','cruise_line','experience','blog_post')),
  item_id UUID NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  UNIQUE(agent_id, mood_id, item_type, item_id)
);

-- Living portfolio stories
CREATE TABLE public.trip_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  destination_summary TEXT,
  trip_dates TEXT,
  body JSONB NOT NULL,
  client_quote TEXT,
  photos JSONB,
  display_order INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Itinerary drafts attached to inquiries
ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS itinerary_draft_json JSONB;
ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS source TEXT;
```

Plus RLS policies for all three new tables following the existing patterns.

## What success looks like

Year 1: 5 Signature advisors, $35,995/yr in setup fees + $35,940/yr in subscriptions = ~$72K ARR from Aurora alone. Average composition-to-inquiry conversion rate of >8% on wineandwellnesstravel.com over the 60-day dogfooding window (industry travel-website conversion is typically 1–3%). At least one Aurora-converted client booking that the advisor publicly attributes to the trip composer.

Year 2: Open as $200/mo add-on. Target 30+ Custom advisors on Aurora by end of Year 2 = additional ~$72K/yr at minimal incremental cost.

## Open questions for the build

- Does Aurora need its own design system, or does it extend t4 Casa Solis with new section types? Lean toward "extend" — keep the design language coherent across premium tiers.
- Voice input on the composer — ship in v1 or v2? Vote v2; text is faster to ship and the composition quality matters more than the input mode.
- Multi-trip portfolios — Aurora's Living Portfolio is one trip per entry; should there be a "Series" concept (e.g., "Family trips in Tuscany, 3 years running")? Defer to v2.
- Operator-curated moods vs. advisor-customized moods — start operator-curated, allow advisor customization after first 60 days of data.

These get answered during the dogfooding window, not before.
