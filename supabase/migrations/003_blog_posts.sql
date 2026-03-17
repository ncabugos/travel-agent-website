-- =============================================================================
-- Migration: 003_blog_posts.sql
-- Description: Blog posts table with per-agent support.
-- =============================================================================

create type public.blog_status as enum ('draft', 'published');

create table public.blog_posts (
  id              uuid          primary key default gen_random_uuid(),
  agent_id        uuid          not null references public.agents(id) on delete cascade,
  title           text          not null,
  slug            text          not null,
  published_at    timestamptz   not null default now(),
  excerpt         text,
  body_html       text          not null default '',
  cover_image_url text,
  categories      text[]        not null default '{}',
  tags            text[]        not null default '{}',
  status          public.blog_status not null default 'published',
  created_at      timestamptz   not null default now(),
  updated_at      timestamptz   not null default now(),

  unique(agent_id, slug)
);

comment on table public.blog_posts               is 'Agent blog posts.';
comment on column public.blog_posts.agent_id     is 'The agent who owns this post.';
comment on column public.blog_posts.body_html    is 'Full post body as HTML.';
comment on column public.blog_posts.categories   is 'Array of category slugs, e.g. {africa, safari}.';
comment on column public.blog_posts.status       is 'draft = hidden from frontend, published = visible.';

-- Indexes
create index idx_blog_posts_agent on public.blog_posts(agent_id, published_at desc);
create index idx_blog_posts_slug  on public.blog_posts(agent_id, slug);

-- Auto-update updated_at
create trigger blog_posts_updated_at
  before update on public.blog_posts
  for each row execute procedure public.handle_updated_at();

-- RLS
alter table public.blog_posts enable row level security;

-- Anyone can read published posts (frontend is public)
create policy "blog_posts: public read published"
  on public.blog_posts
  for select
  using (status = 'published');

-- Agent CRUD on own posts
create policy "blog_posts: agent insert own"
  on public.blog_posts
  for insert
  with check (auth.uid() = agent_id);

create policy "blog_posts: agent update own"
  on public.blog_posts
  for update
  using    (auth.uid() = agent_id)
  with check (auth.uid() = agent_id);

create policy "blog_posts: agent delete own"
  on public.blog_posts
  for delete
  using (auth.uid() = agent_id);
