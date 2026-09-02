# Wine & Wellness Travel — organic SEO fix (2026-09-01)

Live site: https://wineandwellnesstravel.com → `/t2/14385e4b-7dbe-4642-88b8-1a1a0279f5d2`
(tier custom, bespoke_layout `wwt`, renders from DB). `wwt-demo` is a pre-launch leftover.

## Plan

- [x] **1. t2 sitemap + robots** — `app/t2/[agentId]/sitemap.xml/route.ts` and
      `app/t2/[agentId]/robots.txt/route.ts`; vanity-domain absolute URLs via `canonicalUrl`.
      Verify: `curl wineandwellnesstravel.com/sitemap.xml` → 200 XML, every loc returns 200.
- [x] **2. SEO facts keyed to the real tenant** — `AGENT_SEO_DATA['14385e4b…'] = WWT_FACTS`,
      OG image `/demos/wine_and_wellness.jpg`. Verify: homepage `og:image` + `· Virtuoso` title.
- [x] **3. Retire `wwt-demo`** — remove from `DEMO_AGENTS` / `PUBLISHED_DEMO_SLUGS`, drop
      `isWwtDemo` mock routing, `T2LeadForm` pathname check → `bespoke_layout`, middleware 301
      `/t2/wwt-demo/*` → `https://wineandwellnesstravel.com/*`. Add live site to homepage DEMOS +
      footer. Verify: `curl -I eliteadvisorhub.com/t2/wwt-demo` → 301 to vanity domain.
- [x] **4. Metadata on gap pages** — `journal/[slug]` (article + cover), `book-hotel/[programSlug]`,
      `find-cruise/[cruiseSlug]`, `hotels/[hotelSlug]` via `buildMetadata`. Verify: canonical +
      tenant-branded title on each, live.
- [x] **5. JSON-LD** — TravelAgency + Person on home, Article + Breadcrumb on journal posts,
      ContactPage, Service on program pages. Verify: `script[type=application/ld+json]` present.
- [x] **6. tsc + lint + build clean** (deploy + live re-probe pending operator push)

Follow-up (not this PR): tenant-aware link base so internal links stop 301-ing; operator sets
`NEXT_PUBLIC_SITE_URL` on Vercel prod; Search Console verification + sitemap submit; GA id for WWT.

## Review (2026-09-01)

Verified locally with `curl -H "Host: wineandwellnesstravel.com" localhost:3000/...`:
- `/robots.txt` 200 → points at `https://wineandwellnesstravel.com/sitemap.xml`; `/sitemap.xml` 200 with
  73 URLs (12 static incl. gated experiences/book-villa, 2 posts, 24 programs, 30 cruise lines,
  2 safaris, 1 jet). `/hotels/<slug>` deliberately excluded (cross-tenant duplicate catalog).
- Home: title `… | Wine and Wellness Travel · Virtuoso`, og:image `/demos/wine_and_wellness.jpg`,
  JSON-LD `TravelAgency`/`LocalBusiness`. Contact → `ContactPage`; journal → `Blog`; post →
  `Article` + `BreadcrumbList` with `og:type=article` + cover image; program → `Service` + breadcrumbs.
- `/t2/wwt-demo/*` on platform host → 301 to the live site. Other demos unchanged (200).
- Light lead form now renders on the live domain (was the dark default — pathname check bug).
- `tsc` clean, `next build` clean. Two pre-existing lint findings left alone (unescaped `'` in
  hotels/[hotelSlug]:177, unused import in find-cruise/[cruiseSlug]).

Not done here: tenant-aware link base (internal links still 301 via middleware); Vercel
`NEXT_PUBLIC_SITE_URL`; Search Console; WWT `ga_measurement_id`.
