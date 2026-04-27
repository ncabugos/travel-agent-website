-- =============================================================================
-- Migration: 028_blog_demo_targeting.sql
-- Description: Adds target_demo_slugs to blog_posts so master admins can
--              broadcast posts to demo sites (which have no rows in the
--              agents table). Demo slugs are text, not UUIDs, so they can't
--              go into target_agent_ids (uuid[]).
-- =============================================================================

alter table public.blog_posts
  add column if not exists target_demo_slugs text[] not null default '{}';

comment on column public.blog_posts.target_demo_slugs is
  'Demo site slugs to broadcast this post to (e.g. ''ytc-demo'', ''casa-solis''). Empty alongside empty target_agent_ids means broadcast-to-all (real agents + all demos).';

-- Optional: index for fast demo-slug lookups on broadcast posts.
-- GIN works well for array containment queries (?|, &&, @>, <@).
create index if not exists idx_blog_posts_target_demo_slugs
  on public.blog_posts using gin (target_demo_slugs);
