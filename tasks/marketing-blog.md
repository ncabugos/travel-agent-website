# Marketing Blog for eliteadvisorhub.com — implementation plan

**Goal:** A company blog at `eliteadvisorhub.com/blog`, publishable from the admin console, built
to the strategy's SEO/AEO standard. **Fully separate** from the advisor `blog_posts` system — EAH
content must never flow onto advisor tenant sites.

**Decisions (confirmed with operator 2026-06-04):** separate tables · full AEO build · seed the two
Week 1 posts as drafts.

---

## A. Database — migration `043_marketing_blog.sql`

- [ ] `marketing_categories`: `id`, `slug` (unique), `label`, `description`, `pillar_key` (P1–P5),
      `sort_order`, `is_active`, `created_at`.
- [ ] `marketing_posts`: `id`, `title`, `slug` (unique), `status` (draft|published), `excerpt`,
      `body_html`, `cover_image_url`, `category_id` (FK → marketing_categories — one pillar per post,
      per strategy §4), `author_name` (default "Nick Cabugos"), `author_credentials`
      (default "Virtuoso-affiliated advisor, founder of Elite Advisor Hub"), `seo_title`,
      `seo_description`, `og_image_url`, `faq` jsonb `[{q,a}]` (FAQPage schema), `read_minutes`,
      `featured` bool, `published_at`, `updated_at` (trigger), `created_at`.
- [ ] RLS: public read where `status='published'`; `super_admin` full access (no hardcoded UUID).
- [ ] Seed the 5 pillar categories (P1 Digital Presence, P2 Inside the Platform, P3 Proof &
      Portfolio, P4 Founder's Desk, P5 The Luxury Travel Business).

## B. Data layer — `lib/marketing-blog.ts`
- [ ] Service-client reads: `getPublishedPosts`, `getFeaturedPost`, `getPostBySlug`,
      `getPostsByCategory`, `getCategories`; admin reads `getAdminPosts`, `getAdminPost`.

## C. Admin console
- [ ] Nav: add `{ href: '/admin/marketing-blog', label: 'Marketing Blog', icon: Icons.edit }` to
      `app/admin/layout.tsx`.
- [ ] `app/admin/marketing-blog/page.tsx` — list (title, pillar, status, date, edit/delete, "New",
      link to categories).
- [ ] `app/admin/marketing-blog/new` + `/[id]` — wrap `MarketingPostEditor`.
- [ ] `app/admin/marketing-blog/categories/page.tsx` — manage the 5 pillars.
- [ ] `components/admin/MarketingPostEditor.tsx` — lean Tiptap editor (title, auto-slug, excerpt,
      body, cover via existing `ImageUpload`, single pillar select, author fields, SEO title/desc,
      OG image, FAQ repeater, featured toggle, read-time, draft/publish, published_at). Reuses
      `ImageUpload`; **does not touch** the advisor `PostEditor` (zero regression risk).
- [ ] API: `app/api/admin/marketing-posts/route.ts` (GET/POST + auto-slug),
      `.../[id]/route.ts` (GET/PUT/DELETE + `revalidatePath('/blog')` and the post path on publish),
      `app/api/admin/marketing-categories/route.ts` (GET/POST) + `[id]` (PUT).

## D. Public surface
- [ ] `app/blog/page.tsx` — index: featured hero + grid, pillar filter chips, `MarketingNav` +
      `MarketingFooter`, metadata.
- [ ] `app/blog/[slug]/page.tsx` — detail: cover hero, pillar badge, byline + credentials +
      published/"Updated" date + read time, body (`dangerouslySetInnerHTML` + reuse `autop`), FAQ
      block, CTAs to `/beta` + `/schedule-consultation` (UTM-tagged), related posts.
      `generateMetadata` (title/desc/OG). JSON-LD: Article + Person + Organization + BreadcrumbList +
      FAQPage (strategy §5.2).
- [ ] `app/blog/category/[slug]/page.tsx` — pillar archive (AEO cluster pages).
- [ ] `app/blog/author/nick/page.tsx` — E-E-A-T author page (LinkedIn + Wine & Wellness Travel).
- [ ] `app/blog/rss.xml/route.ts` — RSS feed (strategy §5.3).
- [ ] `app/sitemap.ts` — make async; add `/blog`, posts, category pages, author page.

## E. Homepage module
- [ ] `components/marketing/MarketingBlogTeaser.tsx` — async server component, "From the Elite
      Advisor Hub Blog" / latest 3 published posts → `/blog`. Distinct from the existing
      `MarketingCuratedEditorial` (which sells the advisor-content *product*); this is EAH's own
      thought-leadership. Mounted at the **bottom** of `app/page.tsx`, after Demos, before footer.

## F. Nav + footer
- [ ] Add "Blog" to `MarketingNav` (real `/blog` route) — desktop + mobile.
- [ ] Add "Blog" to `MarketingFooter`.

## G. Seed (eah-journal-writer skill) — saved as **drafts**
- [ ] "The first impression you never get to make" — P1 manifesto / launch post.
- [ ] "How much does a travel agent website cost in 2026?" — P1 AEO magnet w/ comparison table + FAQ.

## Verification
- [ ] `npx tsc --noEmit` clean · `npm run build` clean.
- [ ] Preview `/blog`, a post, homepage module at 375 / 768 / 1280px.
- [ ] RSS renders; sitemap lists posts; JSON-LD present on detail page.
- [ ] Spot-check a demo advisor blog — confirm marketing posts do **not** appear (separate table).
- [ ] Confirm `revalidatePath` fires on publish.

## Out of scope (flagged)
- Buffer/social scheduling, Studio syndication.
- (Analytics is no longer out of scope — instrumentation layer built, see below.)

---

## Review — built 2026-06-04

**Refinements from operator:** EAH-only (no Wine & Wellness Travel anywhere) · analytics wired now,
dormant until keys · blog named **"Insights"**, route `/insights`.

**Shipped (tsc clean · `npm run build` clean · `/insights` renders 200):**
- Migration `043_marketing_blog.sql` — `marketing_posts` + `marketing_categories`, RLS, 5 seeded pillars.
- `lib/marketing-blog.ts` data layer · types in `types/index.ts`.
- Admin: nav item, `/admin/insights` (list), `/new`, `/[id]` editor (`MarketingPostEditor`), `/categories`.
- API: `/api/admin/marketing-posts(+/[id])`, `/api/admin/marketing-categories(+/[id])` with `revalidatePath`.
- Public: `/insights`, `/insights/[slug]` (Article+Person+Org+Breadcrumb+FAQPage JSON-LD), `/insights/category/[slug]`,
  `/insights/author/nick`, `/insights/rss.xml`; sitemap now async + includes posts/categories.
- Homepage `MarketingInsightsTeaser` (bottom, before footer; hidden until posts exist).
- Nav + footer "Insights" links.
- Analytics: `lib/analytics.ts` (track/pageview/withUtm) + `components/AnalyticsScripts.tsx` (conditional
  GA4/PostHog + delegated `[data-event]` clicks), mounted in root layout. UTM-tagged CTAs on every post.
- Seed: `scripts/seed_insights.js` — the two Week 1 posts as **drafts** (idempotent upsert on slug).

**Operator action required (production DB — not run by Claude):**
1. `npm run db:push` to apply migration 043.
2. `node scripts/seed_insights.js` to load the two Week 1 drafts.
3. Optional: set `NEXT_PUBLIC_GA_ID` / `NEXT_PUBLIC_POSTHOG_KEY` (+ `NEXT_PUBLIC_FOUNDER_LINKEDIN`) to light up analytics + the author LinkedIn link.
</content>
</invoke>
