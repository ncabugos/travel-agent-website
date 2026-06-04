-- =============================================================================
-- Migration: 043_marketing_blog.sql
-- Description: Company "Insights" blog for the marketing site (eliteadvisorhub.com).
--   COMPLETELY SEPARATE from the advisor blog (blog_posts / blog_categories), which
--   serves per-tenant advisor sites. Marketing content must NEVER flow onto an
--   advisor site, so it lives in its own tables with no agent_id and no broadcast
--   targeting. One pillar (category) per post, per the 90-day content strategy.
-- =============================================================================

-- 1. marketing_categories — the five content pillars (P1–P5). Admin writes via
--    service role; public reads active rows.
create table public.marketing_categories (
  id          uuid        primary key default gen_random_uuid(),
  slug        text        unique not null,
  label       text        not null,
  description text,
  pillar_key  text,                       -- 'P1'..'P5' from the strategy doc
  sort_order  int         not null default 0,
  is_active   boolean     not null default true,
  created_at  timestamptz not null default now()
);

comment on table public.marketing_categories is
  'Content pillars for the eliteadvisorhub.com Insights blog. Separate from advisor blog_categories.';

alter table public.marketing_categories enable row level security;
create policy "marketing_categories: public read"
  on public.marketing_categories for select using (true);
create policy "marketing_categories: super_admin all"
  on public.marketing_categories for all
  using (exists (select 1 from public.agents where id = auth.uid() and role = 'super_admin'))
  with check (exists (select 1 from public.agents where id = auth.uid() and role = 'super_admin'));


-- 2. marketing_posts — the Insights articles. Single-owner (EAH), SEO/AEO-shaped.
create table public.marketing_posts (
  id                 uuid        primary key default gen_random_uuid(),
  title              text        not null default '',
  slug               text        unique not null,
  status             text        not null default 'draft' check (status in ('draft','published')),
  excerpt            text,
  body_html          text        not null default '',
  cover_image_url    text,
  category_id        uuid        references public.marketing_categories(id) on delete set null,
  author_name        text        not null default 'Nick Cabugos',
  author_credentials text        not null default 'Founder of Elite Advisor Hub',
  seo_title          text,
  seo_description    text,
  og_image_url       text,
  faq                jsonb       not null default '[]'::jsonb,  -- [{ "q": "...", "a": "..." }]
  read_minutes       int,
  featured           boolean     not null default false,
  published_at       timestamptz not null default now(),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

comment on table public.marketing_posts is
  'Articles for the eliteadvisorhub.com Insights blog. Never surfaced on advisor tenant sites.';

create index marketing_posts_status_published_idx
  on public.marketing_posts (status, published_at desc);
create index marketing_posts_category_idx
  on public.marketing_posts (category_id);

-- Keep updated_at fresh on every write.
create or replace function public.touch_marketing_posts_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
create trigger marketing_posts_set_updated_at
  before update on public.marketing_posts
  for each row execute function public.touch_marketing_posts_updated_at();

-- RLS: public reads published posts only; super_admin has full access. Admin
-- writes go through the service-role client (bypasses RLS) like the rest of the
-- admin console, but the super_admin policy lets the anon/RSC client read drafts
-- when authenticated as the operator.
alter table public.marketing_posts enable row level security;
create policy "marketing_posts: public read published"
  on public.marketing_posts for select using (status = 'published');
create policy "marketing_posts: super_admin all"
  on public.marketing_posts for all
  using (exists (select 1 from public.agents where id = auth.uid() and role = 'super_admin'))
  with check (exists (select 1 from public.agents where id = auth.uid() and role = 'super_admin'));


-- 3. Seed the five content pillars (90-Day Content Strategy §4).
insert into public.marketing_categories (slug, label, description, pillar_key, sort_order) values
  ('digital-presence',       'The Advisor''s Digital Presence', 'Why DIY sites lose bookings, what a luxury-grade advisor site requires, SEO/AEO for advisors, and converting referrals who Google you.', 'P1', 1),
  ('inside-the-platform',    'Inside the Platform',            'Template reveals, module spotlights, comparisons vs Squarespace/Wix/custom developers, and the supplier catalog as a moat.',            'P2', 2),
  ('proof-and-portfolio',    'Proof & Portfolio',              'Advisor sites, before/after builds, case studies, testimonials, and build-in-public milestones.',                                     'P3', 3),
  ('founders-desk',          'Founder''s Desk',                'Operator essays, honest build updates, and opinions on the luxury-travel industry''s tooling.',                                        'P4', 4),
  ('luxury-travel-business', 'The Luxury Travel Business',     'Running an independent practice: the Virtuoso ecosystem, host agency vs independent, lead generation, and client experience.',        'P5', 5);
