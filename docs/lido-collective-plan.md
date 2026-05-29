# The Lido Collective — Agency Demo Implementation Plan

> Route: `/t2/lido-collective` · Template base: T2 (Vista) · Tier: Agency

---

## 1. Brand Identity

**Name:** The Lido Collective  
**Positioning:** A curated collective of ultra-luxury travel specialists — Aman at sea, Orient Express sailing yachts, Four Seasons yachts, expedition voyages. Invitation-worthy. Not a travel agency — a collective of people who happen to book the world's most unrepeatable trips.

**Voice:** Whispered authority, not broadcast confidence. The places that don't need to advertise. Short sentences. No exclamation marks. Think Soho House editorial meets Aman brand copy.

**Palette — navy only, no gold:**

| Token | Value | Use |
|---|---|---|
| `--lido-bg` | `#06101E` | Near-black deep navy — primary background |
| `--lido-bg-mid` | `#0D1A2E` | Mid navy — card/panel surfaces |
| `--lido-bg-raised` | `#142338` | Raised surface — hover states, drawers |
| `--lido-bg-light` | `#F0EDE8` | Warm off-white — used sparingly for contrast beats only |
| `--lido-text` | `#EDEAE4` | Warm near-white (not pure white — avoids clinical) |
| `--lido-text-muted` | `rgba(237,234,228,0.50)` | Secondary text |
| `--lido-text-dark` | `#06101E` | Text on light sections |
| `--lido-accent` | `#EDEAE4` | White IS the accent — no color accent at all |
| `--lido-divider` | `rgba(237,234,228,0.10)` | Hairline rule on dark bg |
| `--lido-divider-strong` | `rgba(237,234,228,0.28)` | Visible rule for section breaks |
| `--lido-radius` | `16px` | Default rounded container |
| `--lido-radius-lg` | `28px` | Hero-scale rounded containers |

Using warm near-white (`#EDEAE4`) as the sole accent — not pure white, not any color — reads as exceptionally refined on deep navy and aligns directly with Soho House's monochromatic identity.

**Logo:**  
File: `public/demos/the-lido-collective/lido-collective-logo.png`  
The logo has two elements: a stacked "LC" monogram with an elegant ligature, and the wordmark `THE LIDO / COLLECTIVE` in a high-contrast serif with wide tracking. Use the PNG as the `<img>` source in the nav. On dark navy backgrounds, apply `filter: invert(1) brightness(1)` in CSS to render it white — no separate white version needed.

```tsx
<Image
  src="/demos/the-lido-collective/lido-collective-logo.png"
  alt="The Lido Collective"
  width={120}
  height={60}
  style={{ filter: 'invert(1) brightness(1)', objectFit: 'contain' }}
/>
```

In the mobile nav bar (docked state), use a smaller instance at `width: 80px`. In the expanded full-screen menu, the logo renders at `width: 140px`, centered.

**Typography:**  
The Lido Collective logo uses a **Bodoni/Didot-style high-contrast serif** — ultra-thin hairline strokes against thick vertical stems, classical terminals, wide letter-spacing. This is distinct from Cormorant Garamond (T4's Renaissance-style font) which has lower stroke contrast.

Primary display font: **Bodoni Moda** (Google Fonts) — the closest freely-available match to the logo's typographic character.

```tsx
// next/font/google
import { Bodoni_Moda } from 'next/font/google'
const bodoniModa = Bodoni_Moda({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--lido-font-display',
})
```

Body font: **DM Sans** (already loaded globally in the T4 stack — no new import needed).

Add `bodoniModa.variable` to the `<html>` className in the Lido layout. Then in CSS:

```css
.lido-page {
  --lido-font-display: var(--font-bodoni-moda, 'Bodoni Moda', 'Didot', Georgia, serif);
  --lido-font-body:    var(--font-dm-sans, 'DM Sans', system-ui, sans-serif);
}
```

All display headings use `font-family: var(--lido-font-display)`. The high stroke contrast of Bodoni Moda reads as unmistakably luxury at large sizes and stays cohesive with the logo wordmark style.

**Creative direction — what makes this genuinely different from all three existing demos:**

All existing demos (T2 Vista, T3 Meridian, T4 Casa Solis) are image-heavy with conventional grid layouts. Lido is **type-driven and editorially structured** — the typography is the primary design element; photography plays a supporting, atmospheric role.

| Element | T2 / T3 / T4 | Lido Collective |
|---|---|---|
| Default background | Ivory or white | Deep navy (`#06101E`) |
| Color accent | Gold (T2/T4) or none (T3) | None — white only |
| Hero layout | Full-bleed image + overlay text | Massive oversized type + floating inset image |
| Section markers | Eyebrow labels | Large transparent ordinal numerals (`01.`, `02.`) |
| Image cards | Sharp-edged or mild radius | Large rounded (`28px`) with cool-tinted treatment |
| Grid rhythm | Equal columns, uniform rows | Asymmetric splits (30/70, 40/60) + staggered placement |
| Destination cards | Portrait (3/4) or carousel | Ultra-wide cinematic stills (`21/9`) |
| CTAs | Filled buttons or ghost | Thin white-border pills + text-with-arrow links |
| Section dividers | Background color changes | Full-viewport hairline rules with eyebrow text |

**Five signature design moves:**

1. **Oversized ordinal numbers** — `01.`, `02.`, `03.` rendered in Bodoni Moda at ~180–220px, `opacity: 0.06`, positioned behind section headings as a background layer. Gives the page an editorial magazine quality with zero decoration added.

2. **Magazine-rule section headers** — each section opens with a full-width `1px` rule (`--lido-divider-strong`), the eyebrow label flush-left in tracked caps, and an optional right-aligned CTA. Borrowed from print editorial design. Completely absent from current templates.

3. **Cinematic destination cards** — `aspect-ratio: 21/9` (ultra-wide) with `border-radius: var(--lido-radius-lg)`. Images desaturated + blue-overlay tint (`mix-blend-mode: multiply` with a `#0D1A2E` layer at 30% opacity) to stay tonally within the navy palette. Entirely unlike T2's portrait sliders or T3's square tiles.

4. **Type-forward hero** — the headline is the visual hero. Text at `~120–140px` (desktop), breaking across 3 lines, with a secondary rounded image inset that floats adjacent to (not behind) the headline. The image is smaller than the type, not larger — inverts every other template's hierarchy.

5. **Monochromatic photography treatment** — images carry a CSS filter (`brightness(0.88) saturate(0.5)`) + a `#0D1A2E` overlay at 20% opacity. This keeps the photography immersive without fighting the navy palette. Makes the site feel coherent at a glance, not like a random photo collection.

---

## 2. Route Structure

All routes live under the existing `/t2/[agentId]/` tree. Agent ID: `lido-collective`.

```
/t2/lido-collective/                     → homepage (lido-home.tsx variant)
/t2/lido-collective/destinations/        → destination index (NEW)
/t2/lido-collective/destinations/europe/ → destination detail (NEW)
/t2/lido-collective/destinations/mediterranean/
/t2/lido-collective/destinations/caribbean-mexico/
/t2/lido-collective/destinations/indian-ocean/
/t2/lido-collective/destinations/asia-pacific/
/t2/lido-collective/advisors/            → agent directory (existing route)
/t2/lido-collective/advisors/[slug]/     → agent profile (existing route)
/t2/lido-collective/hotels/              → hotel directory (existing route)
/t2/lido-collective/hotels/[hotelSlug]/  → hotel detail (existing route)
/t2/lido-collective/journal/             → blog/journal (existing route)
/t2/lido-collective/contact/             → contact (existing route)
```

No new route segments needed beyond `destinations/` and `destinations/[destination]/`.

---

## 3. Implementation Steps

### Step 1 — Design system tokens

**File:** `app/t2/globals-t2.css`  
Add a `.lido-page` scoped block (parallel to existing `.t2-page` base tokens). The Lido variant overrides colors, radius, and section padding without touching the T2 base — template isolation preserved.

Key adds:
- Full token set from Section 1 palette above
- `--lido-font-display` / `--lido-font-body` (alias to T4 font vars already loaded globally)
- `--lido-radius` / `--lido-radius-lg` as new design primitives
- `--lido-section-pad: clamp(96px, 12vw, 160px)` (matches T4)

Add `.lido-page` wrapper to the T2 layout in `app/t2/[agentId]/layout.tsx` — detect `agentId === 'lido-collective'` and swap class from `t2-page` to `lido-page`. All child components then inherit Lido vars automatically.

---

### Step 2 — Homepage (`lido-home.tsx`)

**File:** `app/t2/[agentId]/lido-home.tsx`  
Wire into `app/t2/[agentId]/page.tsx` alongside `ytc-home.tsx` and `wwt-home.tsx`:

```tsx
if (agentId === 'lido-collective') return <LidoHomePage agentId={agentId} ... />
```

**Section stack (top to bottom):**

#### 01 — Hero (type-forward, image secondary)
Background: `--lido-bg` (deep navy). **No full-bleed background image** — the typography IS the visual hero.

- Full-width section, `min-height: 100svh`
- Headline: Bodoni Moda at `clamp(64px, 9vw, 140px)`, weight 300, line-height 0.9, breaks across 3 lines:
  ```
  Travel
  at its most
  uncompromising.
  ```
- Floating inset image — a rounded (`var(--lido-radius-lg)`) image card, ~380px wide, positioned to the right of "uncompromising" at desktop, with a cool-tint CSS filter. The image is **smaller than the text**, not behind it.
- Sub (DM Sans, 16px, 60% opacity): `A collective of specialists. Aman. Four Seasons. Orient Express. The places that require knowing someone.`
- CTAs: `Plan a Journey` (thin white-border pill, white text) · `The Collective →` (plain text link, tracked caps)
- No eyebrow label — the name is in the nav; the headline speaks for itself.

#### 02 — Press Bar
Thin full-width `1px` rule (`--lido-divider-strong`) above and below this band. Center-aligned.  
Label (tracked caps, 10px, 50% opacity): `OUR ADVISORS HAVE BEEN FEATURED IN`  
Logos: Condé Nast Traveler · The New York Times · Vogue · Travel + Leisure · Town & Country  
Style: white SVG logos at 35% opacity; hover to 80%. No marquee, no scroll animation — static, restrained.

#### 03 — Who We Are (staggered 30/70 split)
Two-column CSS grid, `grid-template-columns: 1fr 2.2fr`. Section opens with the magazine-rule header (full-width hairline + `01. WHO WE ARE` flush-left).

Left column (30%): Large ordinal `01.` in Bodoni Moda at ~180px, `opacity: 0.06`, absolutely positioned. Below it, a single rounded image (`aspect-ratio: 5/6`, cinematic tint treatment).

Right column (70%): 
- Headline (Bodoni Moda, 48px): `Not a travel agency. A collective.`
- Body: 3–4 sentences. Mention Aman, expedition voyages, Orient Express by name.
- Pull-quote: `"The places that don't need to advertise."` — rendered in Bodoni Moda italic at 28px, near-white, no gold, no color.
- CTA: `The Story →` (text link with tracked arrow)

#### 04 — Services (cinematic wide cards)
Magazine-rule header: `02. WHAT WE DO`  
Three cards, each `aspect-ratio: 21/9` (ultra-wide cinematic), `border-radius: var(--lido-radius-lg)`, stacked vertically with generous gap. Each card has:
- Full-bleed image with cool-tint overlay (`brightness(0.75) saturate(0.4)` + navy multiply layer)
- Service name bottom-left: Bodoni Moda 36px, white
- 1-line descriptor: DM Sans 13px, 65% opacity
- Hover: overlay lightens slightly, `→` arrow appears bottom-right

Services: `01 · Voyages` (yachts/expedition) · `02 · Stays` (hotels/estates) · `03 · Journeys` (crafted itineraries)

The vertical stacking of wide cinematic cards is visually unlike anything in the current templates, which all use horizontal carousels or portrait grids.

#### 05 — Partner Band
Magazine-rule header: (no ordinal — this is a transitional band, not a numbered section)  
Background: `--lido-bg-mid`. Eyebrow text: `PREFERRED PARTNER RELATIONSHIPS`  
Logo strip (white at 40% opacity): Virtuoso · Aman · Four Seasons · Belmond · Orient Express · Rosewood  
No button — the logos speak; linking them all to `/hotels` is sufficient.

#### 06 — Destinations (cinematic horizontal scroll)
Magazine-rule header: `03. DESTINATIONS`  
Horizontally scrollable strip (CSS scroll-snap). Cards at `aspect-ratio: 4/3`, `border-radius: var(--lido-radius-lg)`, `min-width: clamp(280px, 35vw, 480px)`. Cool-tint image treatment. Destination name in Bodoni Moda 32px bottom-left. Hover: subtle brightness lift.

Five destinations: `Mediterranean` · `Europe` · `Indian Ocean` · `Caribbean & Mexico` · `Asia Pacific`  
Each links to `/t2/lido-collective/destinations/[slug]`

At the right edge of the scroll strip: a `View All Destinations →` text card in navy-on-near-white (inverted) to visually signal "there's more."

#### 07 — The Collective (advisor grid)
Magazine-rule header: `04. THE COLLECTIVE`  
**Custom layout** — not `T2AdvisorsDirectory` directly. 6 advisors in a `3 × 2` grid where:
- Portrait photo is circle-cropped, 120px diameter, near top of card
- Name in Bodoni Moda 22px
- Specialty tags: small tracked-caps labels, `--lido-divider-strong` border, white text at 70%
- No card borders — white hairline bottom only
- Hover: name underlines, photo scales 1.05

Heading: `People, not pipelines.`  
Sub: `Each member of The Lido Collective specializes in one corner of the world. You work with the right person — not the next available one.`  
CTA: `Meet the Collective →`

#### 08 — Journal (editorial rows)
Magazine-rule header: `05. FROM THE FIELD`  
Background: `--lido-bg-mid` — provides a subtle depth shift from the main bg without a color change.

Three journal posts in a **`1fr 1fr 1fr` grid**, each with:
- Rounded image (`aspect-ratio: 3/2`, cool-tint treatment)
- Category label (tracked caps, 10px, 50% opacity)
- Headline in Bodoni Moda 26px, line-height 1.1
- Date + "Read →" text link

No reuse of `T2JournalTeaser` — custom markup within `lido-home.tsx` to control the exact typographic rhythm.

#### 09 — Instagram Mosaic
Magazine-rule header: `FIND US` (no ordinal — this is a closing social section)  
Handle text: `@lidocollective` in Bodoni Moda italic 48px, centered, above the mosaic.

**NEW component** `LidoInstagramMosaic` — CSS Grid asymmetric layout:

```
Desktop grid (6 columns × 3 rows):
[  A: col 1–3, row 1–2  ] [ B: col 4–5, row 1 ] [ C: col 6, row 1   ]
                           [ D: col 4–5, row 2 ] [ E: col 6, row 2   ]
[ F: col 1–2, row 3     ] [ G: col 3–4, row 3 ] [ H: col 5–6, row 3 ]
```

All tiles: `border-radius: var(--lido-radius)`. Hover: white overlay at 10% + Instagram icon centered. No gold, no color tinting on hover — just white.

Cool-tint CSS filter on all tiles matches the rest of the photography treatment.

#### 10 — Contact / CTA band
Full-width dark section (`--lido-bg`). Generous vertical padding (`clamp(120px, 16vw, 200px)`).

Large centered Bodoni Moda headline (60px): `Ready to begin?`  
Sub (DM Sans, 17px, 55% opacity): `Conversations start with a note. We respond personally within 24 hours.`

Email input: `background: transparent`, `border: 1px solid --lido-divider-strong`, white placeholder text, `border-radius: 4px`. Adjacent `Begin →` button: thin white-border pill — **no filled background, no color**. Hover: background becomes `rgba(237,234,228,0.08)`.

The restraint of the CTA (no colored button, no urgency copy) is deliberate — it signals confidence, not desperation.

---

### Step 3 — Destination Index Page

**File:** `app/t2/[agentId]/destinations/page.tsx` (NEW)

Hero: full-bleed map-style image or abstract gradient. Headline: `Explore the World with The Lido Collective`

Below hero: 5 destination cards in a 2-col asymmetric grid — large rounded images, destination name, 1-line editorial hook, `Explore →` link.

---

### Step 4 — Destination Detail Pages

**File:** `app/t2/[agentId]/destinations/[destination]/page.tsx` (NEW)

Destination config object maps slug → content:

```ts
const DESTINATIONS = {
  europe: {
    label: 'Europe',
    headline: 'From the Amalfi to the Aegean.',
    intro: 'Europe remains the world\'s most...',
    heroImage: '...',
    galleryImages: ['...', '...', '...'],
    hotelFilter: 'europe', // maps to hotel_programs region filter
    blogCategory: 'europe',
  },
  // mediterranean, caribbean-mexico, indian-ocean, asia-pacific
}
```

**Page sections:**

1. **Hero** — Full-bleed image with cool-tint treatment (`brightness(0.7) saturate(0.35)` + navy overlay). Destination name in Bodoni Moda at `clamp(72px, 10vw, 150px)`, stacked bold and loose, centered. 2-sentence intro below in DM Sans 17px at 70% opacity. No CTA in the hero — the page earns scroll.

2. **Editorial Intro** — Magazine-rule header. 2-col staggered layout (`40/60`): left column has 2 rounded images stacked with a small gap (top: `aspect-ratio: 4/3`, bottom: `aspect-ratio: 1/1`), both with cool-tint treatment. Right column: 3–4 paragraphs of editorial copy in Bodoni Moda 20px (readable serif, not body size) + a pull-quote in Bodoni Moda italic 30px.

3. **Gallery Strip** — 3 full-width rounded images side by side (`aspect-ratio: 16/9`, `border-radius: var(--lido-radius)`), each with the cool-tint treatment. No captions, no labels — purely atmospheric. Gap between tiles: 12px.

4. **Hotel Directory** — Magazine-rule header: `PROPERTIES`. Reuse `T2HotelDirectory` with `region` pre-filtered. Filter bar shows; destination is pre-selected but changeable. Hotel cards get `border-radius: var(--lido-radius)` + cool-tint image treatment to stay in palette.

5. **Journal Posts** — Magazine-rule header: `STORIES FROM [DESTINATION]`. 3-col grid of journal cards matching the homepage journal section style.

6. **CTA Band** — Same restrained design as homepage Section 10. Copy: `Planning [destination]? Begin a conversation.`

**All content is placeholder copy** — no new DB tables. Destinations hook into the existing `getHotels({ region: ... })` query.

---

### Step 5 — Lido Advisor Roster

**File:** `lib/agency-advisors.ts`  
Add `LIDO_ADVISORS` array and extend `getAgencyAdvisors()` to return it when `agencyId === 'lido-collective'`.

**6 placeholder advisors:**

| Slug | Name | Title | Specialty |
|---|---|---|---|
| `claire-hartwell` | Claire Hartwell | Founder & Principal | European estates, Italy, France |
| `marco-desilva` | Marco De Silva | Voyages Lead | Yacht charters, Aman at Sea, expedition |
| `yuki-aomori` | Yuki Aomori | Asia-Pacific Specialist | Japan, Bali, Maldives, Bhutan |
| `diana-osei` | Diana Osei | Africa & Indian Ocean | Safari, Seychelles, Maldives, Zanzibar |
| `james-bellamy` | James Bellamy | Caribbean & Americas | Caribbean, Patagonia, private islands |
| `sofia-reyes` | Sofia Reyes | Celebrations & Wellness | Weddings, honeymoons, spa retreats |

Each advisor gets: full bio, 4 specialties, 3–4 destinations, languages, placeholder email.  
Photos: reuse existing `/media/team/` images.

**Advisor profile pages** already exist at `/t2/[agentId]/advisors/[slug]/page.tsx` — no new route needed. The Lido-variant styling will flow through the `.lido-page` CSS tokens on the layout.

---

### Step 6 — Nav Update

**File:** `components/t2/T2Nav.tsx`  
Detect `agentId === 'lido-collective'` and render a Lido-specific nav link set:

```
[logo img white]    Destinations  Advisors  Hotels  Journal  Plan a Journey [thin-border pill]
```

Left: `<Image src="/demos/the-lido-collective/lido-collective-logo.png" ... style={{ filter: 'invert(1)' }} />` at `width: 100px`. Nav links in DM Sans tracked caps 11px. CTA pill: white border, white text, no fill. On scroll, nav gains `backdrop-filter: blur(12px)` for legibility over light sections.

---

### Step 7 — Mobile Navigation ("The Lido Bar")

**New file:** `components/t2/LidoMobileNav.tsx` (client component — `'use client'`)  
**Rendered in:** `app/t2/[agentId]/layout.tsx` — shown only when `agentId === 'lido-collective'` and only on mobile (`< 768px` via Tailwind or CSS class).

#### Concept — Two States

The mobile nav has two states: **docked** and **expanded**. It never slides in from the side (standard drawer) and never pushes down from the top (standard hamburger). It lives at the bottom of the screen — thumb-reachable — and expands upward to full-screen.

---

#### State 1 — Docked Bar (always visible)

A floating pill anchored `fixed bottom-6 left-4 right-4`, `z-index: 9999`.

```
┌────────────────────────────────────────────────────────┐
│  ≡        [ 🏨 Hotels ]   [ 👤 Advisor ]        ···   │
└────────────────────────────────────────────────────────┘
```

- Background: `rgba(13, 26, 46, 0.88)` + `backdrop-filter: blur(20px) saturate(1.4)`
- Border: `1px solid rgba(237,234,228,0.14)`
- Border-radius: `20px`
- Height: `58px`
- Shadow: `0 8px 40px rgba(6,16,30,0.7)` (dark, tight — not visible on navy pages, subtle on light-section pages)
- Safe-area bottom inset: `padding-bottom: env(safe-area-inset-bottom)` for iPhone home bar

**Left — menu trigger:**  
`≡` icon (3 lines, `ti-menu-2`, 20px) at 75% opacity. Tap → opens full-screen.

**Center — two quick-access pills:**  
Each pill: `background: rgba(237,234,228,0.09)`, `border: 1px solid rgba(237,234,228,0.15)`, `border-radius: 10px`, `padding: 7px 14px`, `font-size: 11px`, `letter-spacing: 0.1em`, white text.
- `🏨` replaced by `ti-building` icon (Tabler, 14px) + `HOTELS` label
- Person icon (`ti-user`, 14px) + `ADVISOR` label
- Hotels → `/t2/lido-collective/hotels`
- Advisor → `/t2/lido-collective/contact`

**Right — logo or close:**  
In docked state: the logo `<Image>` at `width: 54px`, `filter: invert(1)`, `opacity: 0.5`.  
In expanded state: this slot becomes the `✕` close button (`ti-x`, 20px, full opacity).

---

#### State 2 — Expanded Full-Screen

When `≡` is tapped, the bar stays in place and a full-screen overlay rises above it:

- Overlay: `position: fixed; inset: 0 0 0 0`, `background: rgba(6,16,30,0.97)`, `backdrop-filter: blur(24px)`
- Opens with: `opacity: 0 → 1` + `transform: translateY(16px) → translateY(0)` over 340ms, `cubic-bezier(0.32, 0.72, 0, 1)`
- The docked bar remains visible at the bottom — `≡` swaps to `✕` (crossfade, not morph)

**Full-screen layout (top to bottom):**

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│                                                     │
│   [logo img — white, 140px wide, centered]          │
│                                                     │
│   ─────────────────────────                         │
│                                                     │
│   Destinations                 →                    │
│   Advisors                     →                    │
│   Hotels                       →                    │
│   Journal                      →                    │
│   Contact                      →                    │
│                                                     │
│   ─────────────────────────                         │
│                                                     │
│   [ 🏨 Book a Hotel ]   [ 👤 Connect with Advisor ] │
│                                                     │
├─────────────────────────────────────────────────────┤
│  ✕        [ 🏨 Hotels ]   [ 👤 Advisor ]       [×] │  ← bar
└─────────────────────────────────────────────────────┘
```

Logo in expanded state: `<Image src="/demos/the-lido-collective/lido-collective-logo.png" width={140} height={70} style={{ filter: 'invert(1)', opacity: 0.9, objectFit: 'contain' }} />` — centered, with `margin-bottom: 28px`.

**Nav links** (Bodoni Moda, `clamp(34px, 8vw, 50px)`, weight 400, line-height 1.1):
- Each link stagger-animates in: delay `n × 45ms`, slides up 10px + fades in
- Right-aligned `→` arrow (DM Sans, 18px, 50% opacity) on each row
- Tap → navigates + closes menu (100ms delay so the tap registers visually)

**Hairline rules** (`1px solid rgba(237,234,228,0.14)`) above and below the nav links — same magazine-rule aesthetic as the desktop design.

**Quick-access buttons** (above the bar in the expanded state):
Larger versions of the docked pills — `height: 52px`, full border, `border-radius: 14px`.  
`[ ti-building  BOOK A HOTEL ]` · `[ ti-user  CONNECT WITH AN ADVISOR ]`  
These are always visible in the expanded menu regardless of scroll, providing immediate conversion paths.

**Close `✕`:**  
The right slot of the docked bar becomes a white `✕` (`ti-x`, 20px). Tap → closes with the reverse animation (overlay fades + slides down 12px). The `≡` crossfades back in.

---

#### Animation Summary

| Action | Duration | Easing |
|---|---|---|
| Open overlay | 340ms | `cubic-bezier(0.32, 0.72, 0, 1)` |
| Link stagger | 45ms per link | `ease-out` |
| Close overlay | 240ms | `cubic-bezier(0.4, 0, 1, 1)` (ease-in) |
| `≡` ↔ `✕` swap | 180ms | `ease` crossfade |
| Quick-pill tap feedback | `scale(0.96)` 100ms | `ease` |

No page scroll lock needed — the overlay covers the page naturally. No `overflow: hidden` on `<body>` (avoids iOS scroll-position jump).

---

#### Implementation Notes

- `useState(false)` for open/closed — simple, no external state library
- `useEffect` adds `Escape` key listener when open
- `'use client'` directive required
- Standard T2 nav (`T2Nav`) gets `className="lido-hide-on-mobile"` → `@media (max-width: 767px) { display: none }` — hides the desktop nav on mobile for Lido only
- The `LidoMobileNav` component only renders on Lido (`agentId === 'lido-collective'`) and is excluded from SSR nav on desktop via a CSS media query wrapper (not JS — avoids layout shift)

---

### Step 9 — Seed Data (Agent Record)

Add a row to the `agents` table for `lido-collective` (via a script or admin console, not a migration):

```sql
INSERT INTO agents (id, full_name, agency_name, email, template, tier, ...)
VALUES ('lido-collective', 'The Lido Collective', 'The Lido Collective', 
        'hello@lidocollective.com', 't2', 'agency', ...);
```

Or add it to the existing demo seed script.

---

## 4. New Files Summary

| File | Type | Description |
|---|---|---|
| `app/t2/[agentId]/lido-home.tsx` | New | Homepage variant — all 10 sections |
| `app/t2/[agentId]/destinations/page.tsx` | New | Destination index |
| `app/t2/[agentId]/destinations/[destination]/page.tsx` | New | Destination detail (dynamic) |
| `components/t2/LidoInstagramMosaic.tsx` | New | Asymmetric mosaic Instagram grid |
| `components/t2/LidoPressBar.tsx` | New | "Featured in" logo strip |

| File | Type | Change |
|---|---|---|
| `app/t2/globals-t2.css` | Modified | Add `.lido-page` token block |
| `app/t2/[agentId]/layout.tsx` | Modified | Detect `lido-collective`, swap CSS class |
| `app/t2/[agentId]/page.tsx` | Modified | Add `lido-collective` branch → `LidoHomePage` |
| `components/t2/T2Nav.tsx` | Modified | Lido nav links + destinations entry |
| `lib/agency-advisors.ts` | Modified | Add `LIDO_ADVISORS` + branch in `getAgencyAdvisors` |

---

## 5. Placeholder Blog Posts to Seed

Add 5 posts to `blog_posts` attributed to `lido-collective` agentId (or as operator-written curated posts pushed to Lido):

1. **Seven Nights on Aman at Sea: The Aegean in June** — category: `Voyages`, region: `mediterranean`
2. **Orient Express Corinthian: A First Look** — category: `Hotels & Stays`, region: `mediterranean`
3. **Why the Maldives Still Wins** — category: `Destinations`, region: `indian-ocean`
4. **The Case for Slow Travel in Tuscany** — category: `Destinations`, region: `europe`
5. **Planning a Private Yacht Charter: What No One Tells You** — category: `Insider Guide`, region: `general`

All placeholder copy — 200–400 words each. Link from destination detail pages.

---

## 6. What's Explicitly Out of Scope

- No new Supabase tables or migrations
- No new auth or billing logic
- Destinations pull from the existing `luxury_hotels` table via `getHotels({ region })` — no new catalog
- Instagram mosaic uses the same static placeholder tiles as `T2InstagramFeed` — no new API integration
- Advisor profile pages use the existing `/t2/[agentId]/advisors/[slug]/page.tsx` — no new route file needed

---

## 7. Build Sequence

1. CSS tokens (Step 1) — unlocks all visual work
2. Advisor data (Step 5) — needed by Steps 2 + homepage
3. Homepage (Step 2) — largest single file; build section by section
4. New components (`LidoInstagramMosaic`, `LidoPressBar`) — can be built alongside homepage
5. Nav update (Step 6) — 30-min task, do after homepage renders
6. Destination index (Step 3) — straightforward listing page
7. Destination detail (Step 4) — most complex new route; do last
8. Seed agent record + blog posts

Total estimated effort: ~3–4 focused sessions.

---

## 8. Conversion Strategy Notes

Elements pulled from landing page best practices (applied to each homepage section):

- **Hero:** Single clear CTA above the fold. Headline answers "what is this" in 6 words or fewer.
- **Immediate social proof:** Press bar before any product description — establishes credibility before the ask.
- **Specificity over category:** "Aman. Four Seasons. Orient Express." beats "luxury hotels." Names signal the insider access.
- **Advisor faces early:** Section 07 shows real people before the contact form. Reduces anonymous-agency anxiety.
- **Low-friction inquiry:** Email-only field in CTA band (no name/phone/dates required) — lowers the mental cost of first contact.
- **Scarcity signal:** "A small collective" framing throughout — implies selectivity, creates desire to qualify.
