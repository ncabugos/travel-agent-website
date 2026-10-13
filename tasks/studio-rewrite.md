# Studio page rewrite: analysis and proposal

Page: https://www.eliteadvisorhub.com/studio (source `app/studio/page.tsx`,
`components/marketing/StudioServices.tsx`, `StudioPricing.tsx`, `StudioInquiryForm.tsx`).
Drafted 2026-10-13. Status: implemented 2026-10-13 (uncommitted at time of writing).

---

## What the data says

- **Zero Studio leads since launch.** `consultation_requests` has 9 `consultation` leads (latest
  2026-10-09) and 0 with `source = 'studio'`.
- The form is not broken. Migration 052 is applied (`source` allows `studio`, `plan_interest`
  column exists), and the insert only needs first name, last name, email.
- So there are two separate problems: **few people find the page**, and **the ones who do are not
  sure what they are buying.** Copy fixes the second. The first needs entry points (see Decisions).

## What is wrong with the current page

### 1. Jargon an advisor will not understand
| Current | Problem |
|---|---|
| "Blog and GEO content", "GEO-optimized articles" | GEO is search-industry slang. Most advisors have never heard it. |
| "AI visibility", "multi-engine tracking", "Be the answer, and be right" | Unclear what is being sold or why it matters. |
| "Written for AI Overviews, ChatGPT, and Perplexity" | Two of three names mean nothing to this reader. |
| "Source-of-truth page: one authoritative page AI can trust" | Technical concept with no plain benefit. |
| "Creative and marketing layer on top of your site" | "Layer" is software language. |
| "Automated welcome and re-engagement sequences" | Email-tool vocabulary. |

### 2. Agency mechanics leak into the copy
"Unlimited requests, queued", "one active request at a time", "priority queue", "plan window",
"scope stays sane". This is how design subscriptions describe themselves to other tech people. An
advisor wants to know: how do I ask, how fast do I get it, do I approve it first.

### 3. Headlines are creative, not plain
Every section has an eyebrow plus a clever headline: "A feed that never goes quiet", "Journals
written to be quoted", "Stay in the inbox, not just the feed", "A subscription, not a project",
"Beyond the monthly plan", "Not a design queue. A marketing partner who knows your world." The
eyebrows are already the right plain labels. Promote them to headings and delete the clever lines.

### 4. Too much to read
Seven sections, five service rows with three bullets each, three plan cards with four bullets
each, a 10-row comparison table, six add-ons, seven one-time projects, and a "what stays out"
paragraph. Roughly 45 separate list items. The add-ons, one-time projects, and comparison table
repeat information or answer questions few visitors have yet.

### 5. Unclear who it is for
The hero says "Your website is built. Now keep it alive" and the homepage promo says "for advisors
on the platform," but the one-time list sells website builds to people without one. A visitor
cannot tell if they qualify.

### 6. Small fixes
- Meta title uses an em dash.
- "Request a conversation" is soft. The approved house wording is "Schedule a consultation."
- The nav label "Studio" does not say what it is.

---

## Proposed structure

Six sections, down from eight. No eyebrows.

1. **Hero**: plain headline, one sentence, one main button
2. **What you get**: the five services, plain names, keep the animated mockups
3. **How it works**: three steps
4. **Plans**: three cards plus the agency row (comparison table removed)
5. **Common questions**: replaces Add-ons, One-time projects, and "what stays out"
6. **Schedule a consultation**: the form

Removed: "Why Studio" (its one useful idea moves into the hero), the comparison table, the add-on
and one-time lists.

---

## Proposed copy

### Meta
- Title: `Done-for-You Marketing for Travel Advisors | Elite Advisor Hub`
- Description: `We handle your social media, blog, newsletter, and design. You approve everything and stay with your clients. Plans for solo advisors and agencies.`

### 1. Hero
- H1: **Marketing for travel advisors, done for you.**
- Sub: We post to your social media, write your blog, send your newsletter, and design what you
  need. You approve everything. You stay with your clients.
- Buttons: `Schedule a consultation` (primary) · `See the plans` (secondary)

### 2. What you get
- H2: **What you get**
- Intro: Five things we take off your plate.

**Social media**
We plan, design, and post to your Instagram and Facebook *(confirm platforms; current copy says "one to two platforms")*. You approve the month's posts in advance.
- Posts, stories, and reels
- A monthly calendar you approve
- Posted for you

**Blog articles**
Articles about your destinations and specialties, written and published on your site for you. They
help new clients find you on Google and ChatGPT.
- One to four or more articles a month
- Written in your voice
- Published to your site for you

**AI search**
More travelers now ask ChatGPT and Google to recommend an advisor. We check what they say about
you and fix anything wrong or missing.
- A report on what AI search says about you
- We correct wrong or outdated details
- Checked monthly on Full Service

**Email newsletter**
A newsletter to your past clients and leads, written and sent for you, so they think of you when
it is time to book.
- Monthly newsletter
- Emails for special offers and announcements
- Automatic welcome emails for new leads

**Design**
Social graphics, client presentations, and flyers in your brand colors and fonts. Ask for it and
we make it.
- Graphics, presentations, and flyers
- Changes until you are happy
- You keep every file

### 3. How it works
- H2: **How it works**
1. **Schedule a consultation.** Tell us about your business and where you need help. We recommend a plan.
2. **Send us what you need.** Ask anytime. We work through requests in order and keep the regular posts and articles on schedule.
3. **You approve, we publish.** Nothing goes out without your OK. Changes are included.

### 4. Plans
- H2: **Plans**
- Intro: Every plan includes changes until you are happy, and you keep every file.
  *(Plus one line on pricing, depending on the decision below.)*

**Essential**: For solo advisors who want to stay visible.
- 8 to 12 social posts a month
- One blog article a month
- Monthly newsletter
- Delivered in 2 to 3 business days

**Professional** (Most popular): For busy advisors who want social, blog, and email working together.
- 16 to 20 posts, stories, and reels a month
- Two to four blog articles a month
- Newsletter and special offer emails
- A dedicated contact, delivered in 1 to 2 business days

**Full Service**: For top advisors and small teams who want all of it handled.
- Every platform, a full posting calendar
- Four or more blog articles a month
- Automatic follow-up emails
- A monthly strategy call

**Agency**: One plan for your whole team of advisors, delivered under your agency brand.

Button on each: `Schedule a consultation` (still pre-selects the plan in the form).

### 5. Common questions
- H2: **Common questions**

**Do I need an Elite Advisor Hub website?** *(Answer depends on the decision below.)*

**How do I send a request?** *(Needs operator answer: email, portal, or both.)*

**What is not included?** Ad spend, photo and video shoots, and printing. We can arrange them and
quote them separately.

**Can I start with a single project?** Yes. Common starting points are a month of social posts,
four blog articles, or a brand refresh. We quote each one.

**Who owns the work?** You do. Every file is yours to keep.

### 6. Form
- H2: **Schedule a consultation**
- Body: Tell us where you need help. We reply personally with a recommendation. No obligation.
- Plan field label: "Which plan fits" becomes "Which plan interests you"
- Message placeholder: "For example: my Instagram has gone quiet, or I never have time to write a blog."
- Plan slugs stay `essential | professional | full-service | agency | unsure` (DB CHECK constraint).

---

## Decisions for the operator

1. **Show prices? And which prices?** Commit `5e31eac` removed them on purpose. The docs also
   disagree: `tasks/studio-plan.md` (June) lists Essential $950, Professional $1,850, Full Service
   $3,500, Agency from $6,000 a month, while CLAUDE.md (September) prices portal studio services
   per item (social from $500 a month, design refresh from $750). Which is current? For a non-technical buyer,
   "quoted on a conversation" is a reason to leave. Options: full prices, "from $950 a month" on
   Essential only, or keep hidden.
2. **Nav label.** "Studio" tells a visitor nothing. Rename the link (not the product) to
   "Marketing" or "Marketing services". Likely the single biggest lift for visits. It also
   untangles the name: "Studio" currently means three things in the docs (the content-syndication
   product, the portal Services page, and this page).
3. **Who is it for?** Only advisors on Elite Advisor Hub, or any advisor? This sets the hero, the
   first FAQ answer, and whether a website build stays on the list.
4. **How do clients send requests?** Email, the portal Services page, or both.

## Traffic (separate from copy)
- Nav label change (Decision 2).
- Homepage promo line: "Done-for-you social, content, and design for advisors on the platform"
  becomes "We handle your social media, blog, and newsletter. See Studio plans."
- Link to /studio from the portal Services page and from each homepage pricing card.
- Consider one Insights post on "marketing for travel advisors" that links to the page.

## Operator decisions (2026-10-13)
- Nav label: "Marketing services" (product name Studio and route /studio unchanged).
- Audience: any travel advisor, not only Elite Advisor Hub customers.
- Requests: by email or the portal.
- Prices: no answer given, so they stay hidden ("We quote your plan after a short consultation").
- Promotion: the operator will email and promote the page to new clients.

## Implementation checklist
- [x] `app/studio/page.tsx`: new meta, plain hero, Why Studio removed, How it works to 3 steps, Common questions (with FAQPage JSON-LD) replaces add-ons and one-time lists, form section reworded
- [x] `StudioServices.tsx`: plain service names as headings, eyebrows and creative titles removed, jargon removed from mockups (GEO badges, "engines", Perplexity)
- [x] `StudioPricing.tsx`: shorter cards, "Most popular", comparison table removed, CTAs "Schedule a consultation"
- [x] `StudioInquiryForm.tsx`: plan label, placeholder, button, thank-you copy
- [x] Nav and footer label "Marketing services"; homepage band copy
- [x] Nav fit: links no longer wrap; gap tightens below 1180px; hamburger now below 1024px (was 860px)

## Review
- `npx tsc --noEmit`: no errors in source (only stale `.next/dev` generated types).
- ESLint on touched files: no new findings (2 pre-existing `set-state-in-effect` errors in StudioServices).
- Browser at 375, 768, 1000, 1024, 1180, 1280: no horizontal scroll, nav fits on one line, FAQ stacks on phones.
- Plan link pre-select still works (Full Service link sets the form to `full-service`).
- No em or en dashes in changed copy.
