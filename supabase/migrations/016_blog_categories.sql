-- =============================================================================
-- Migration: 016_blog_categories.sql
-- Description: Creates formal table for blog categories and opt-in preferences.
-- =============================================================================

-- 1. blog_categories (Admin only writes, public reads)
create table public.blog_categories (
  id          uuid        primary key default gen_random_uuid(),
  slug        text        unique not null,
  label       text        not null,
  description text,
  sort_order  int         not null default 0,
  is_active   boolean     not null default true,
  created_at  timestamptz not null default now()
);

comment on table public.blog_categories is 'Platform-wide blog categories managed by admin.';

-- RLS: Public read, no inserts/updates
alter table public.blog_categories enable row level security;
create policy "blog_categories: public read"
  on public.blog_categories for select using (true);


-- 2. agent_blog_preferences (Agent reads/writes own)
create table public.agent_blog_preferences (
  agent_id    uuid        not null references public.agents(id) on delete cascade,
  category_id uuid        not null references public.blog_categories(id) on delete cascade,
  is_enabled  boolean     not null default true,
  created_at  timestamptz not null default now(),
  primary key (agent_id, category_id)
);

comment on table public.agent_blog_preferences is 'Tracks which categories an agent has enabled.';

-- RLS: Agent manages own preferences
alter table public.agent_blog_preferences enable row level security;
create policy "agent_blog_preferences: select own"
  on public.agent_blog_preferences for select using (auth.uid() = agent_id);
create policy "agent_blog_preferences: insert own"
  on public.agent_blog_preferences for insert with check (auth.uid() = agent_id);
create policy "agent_blog_preferences: update own"
  on public.agent_blog_preferences for update using (auth.uid() = agent_id);
create policy "agent_blog_preferences: delete own"
  on public.agent_blog_preferences for delete using (auth.uid() = agent_id);


-- 3. blog_post_categories (Join table)
create table public.blog_post_categories (
  post_id     uuid        not null references public.blog_posts(id) on delete cascade,
  category_id uuid        not null references public.blog_categories(id) on delete cascade,
  primary key (post_id, category_id)
);

comment on table public.blog_post_categories is 'Links blog posts structured categories.';

-- RLS: Public read, Agent writes if they own the post. Admin uses service_role.
alter table public.blog_post_categories enable row level security;
create policy "blog_post_categories: public read"
  on public.blog_post_categories for select using (true);
create policy "blog_post_categories: insert own post"
  on public.blog_post_categories for insert with check (
    exists (select 1 from public.blog_posts where id = post_id and agent_id = auth.uid())
  );
create policy "blog_post_categories: delete own post"
  on public.blog_post_categories for delete using (
    exists (select 1 from public.blog_posts where id = post_id and agent_id = auth.uid())
  );
