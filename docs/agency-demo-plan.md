# Agency Demo Build Plan — `ytc-demo` enhancement

> Concrete build plan to turn `/t2/ytc-demo` into a publishable Agency-tier exemplar.
> Source of demo registry: `lib/demo-agents.ts` · slug `ytc-demo` · label "Your Travel Center (T2)" · template `t2`.
> Companion to: `Elite_Advisor_Hub_Feature_Matrix.xlsx` (sheet 8: Demos) and the Strategic Plan.

---

## Why this demo exists

The Agency tier sits at $899+/mo + $4,999+ setup. No serious agency prospect will pay that without seeing what an Agency site looks like in production. The current `ytc-demo` is a fuller t2 site, but it lacks the features that distinguish Agency from Custom — and those distinguishing features (advisor directory, lead routing, multi-author bylines) are the same P3 items the SaaS map flagged as Agency-tier blockers. **The demo and the production feature ship together.**

## Components to build

In priority order. Each component lives in `components/t2/` and follows the template-isolation rule from CLAUDE.md.

### 1. `T2AdvisorsDirectory` — `/advisors` listing

The agency homepage's "Meet the Collective" hero variant teases 4–6 advisors and links to `/advisors`. The directory page surfaces every advisor in the agency with photo, specialty, and a "View profile" link to `/advisors/[slug]`.

Data shape needed: agents filtered by `parent_agency_id` (new field — see schema additions below). For the demo, this is mock data in `lib/demo-agents.ts` extended with a `team` array per agency demo.

Sizing: ~1 day. Layout reuses `T2HotelCard` rhythm with rounded portraits and 2-line bios.

### 2. `T2AdvisorProfile` — `/advisors/[slug]`

Each advisor in the collective gets their own profile page: hero with portrait, bio, specialties, supplier affinities, journal posts authored by them, and a contact form scoped to that advisor.

Data shape: extends current single-advisor pattern but takes `parent_agency_id` from URL context. Inquiries submitted here carry `advisor_id` for lead routing.

Sizing: ~1.5 days. The hardest part is wiring the inquiry form to capture the right `advisor_id` while keeping the existing `inquiries` table schema.

### 3. `T2MeetTheCollective` — homepage hero variant

A new homepage section that swaps the standard advisor hero for a 4–6 advisor grid (portrait + name + specialty) above a "Meet the team" link to `/advisors`. Replaces, not adds to, the existing solo-advisor hero on Agency-tier sites.

Sizing: ~0.5 days. Mostly composition.

### 4. Multi-author byline support on journal posts

`blog_posts.agent_id` already exists. What is missing is the UI to *display* the author on the post page and to filter the journal index by author. Wire both — and on `/advisors/[slug]`, surface "Posts by [Advisor Name]."

Sizing: ~0.5 days. Mostly UI plumbing.

### 5. Lead routing UI in admin + agent portal

In `/admin/requests` and `/agent-portal/requests`, add an "Assigned to" column that defaults to the agency owner and is editable from a dropdown of agency advisors. When an inquiry arrives with `advisor_id` set (from `/advisors/[slug]/contact`), it auto-routes; otherwise it lands in a triage queue.

Sizing: ~1 day for the UI; ~1 day for the routing logic and email notification.

### 6. Agency-admin role and per-advisor portal access

New `role = 'agency_admin'` on `agents`. Agency admin sees all advisors in their agency in `/agent-portal`; individual advisors see only their own profile, blog posts, and inquiries.

Sizing: ~1.5 days. RLS policies need careful audit — write tests for "can advisor A see advisor B's inquiries?" (answer: no).

## Schema additions

These belong in a single new migration. Number it `031_agency_tier.sql` (the latest existing migration is `030`).

```sql
-- 031_agency_tier.sql

-- Link advisors to a parent agency
ALTER TABLE public.agents ADD COLUMN IF NOT EXISTS parent_agency_id UUID REFERENCES public.agents(id);

-- New role for agency admins
ALTER TABLE public.agents DROP CONSTRAINT IF EXISTS agents_role_check;
ALTER TABLE public.agents ADD CONSTRAINT agents_role_check
  CHECK (role IN ('super_admin', 'admin', 'agency_admin', 'agent'));

-- Inquiries can be assigned to a specific advisor
ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS assigned_advisor_id UUID REFERENCES public.agents(id);

-- Index for "show me my agency's inquiries" queries
CREATE INDEX IF NOT EXISTS idx_inquiries_assigned_advisor ON public.inquiries(assigned_advisor_id);

-- RLS: agency_admin can read all advisors in their agency
CREATE POLICY "agents: agency_admin read team"
  ON public.agents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.agents me
      WHERE me.id = auth.uid()
        AND me.role = 'agency_admin'
        AND (me.id = agents.parent_agency_id OR me.parent_agency_id = agents.parent_agency_id)
    )
  );

-- (Plus equivalent policies for inquiries, blog_posts, edit_requests scoped to agency)
```

Audit checklist for the migration: every existing query that references `agents` should still work for solo-advisor accounts (where `parent_agency_id` is null). RLS smoke tests for the new role before merging.

## Demo content to seed

After the components and migration ship, populate `ytc-demo` with realistic mock data so the demo sells.

A fictional 5-advisor collective called "Your Travel Center" — name kept as the slug suggests. Sample composition:

- **Margaret Chen** — Senior advisor, 15 years, Japan and Southeast Asia specialist.
- **David Okafor** — African safaris, expedition travel, Antarctica.
- **Sofia Petrov** — Mediterranean villas, Italy, France, family travel.
- **Henry Brookes** — Cruise specialist, river and expedition cruising.
- **Aisha Rahman** — Wellness retreats, India, Bhutan, Indonesia.

Each gets a portrait (operator-curated from licensed stock or AI-generated with consistent style), 100–150 word bio, 3–5 destination specialties, supplier affinity selections (different per advisor to demonstrate the variety the platform supports), and 4–6 journal posts authored by them. Use the `eah-journal-writer` skill to generate posts at speed.

Seeder file: `scripts/seed_demo_agency.js` modeled on the existing `scripts/seed_hotels.js` pattern.

## Total sizing

| Item | Days |
|---|---|
| Components 1–4 | 3.5 |
| Component 5 (lead routing) | 2 |
| Component 6 (agency-admin role + RLS) | 1.5 |
| Migration `031_agency_tier.sql` | 0.5 |
| Demo content seeding | 1.5 |
| **Total** | **~9 days** |

Reasonable parallelization: a focused two-week sprint, with the migration as gate 1 and the demo seed as gate 2.

## Verification before publishing the demo

`tsc --noEmit` clean. Browser preview at 375 / 768 / 1280 px on `/t2/ytc-demo`, `/t2/ytc-demo/advisors`, and at least 2 advisor profile pages. Submit a test inquiry from `/advisors/margaret-chen/contact` and confirm it routes to her in the inquiry inbox. Confirm a logged-in agency-admin can see all 5 advisors in the portal and an individual advisor sees only their own data.

After verification, link `/t2/ytc-demo` from the marketing-site pricing page as "See an Agency-tier site in action."
