-- =============================================================================
-- Migration: 004_blog_broadcast.sql
-- Description: Adds broadcast support, per-agent targeting, and gallery images
--              to the blog_posts table.
-- Run in Supabase SQL editor after migration 003.
-- =============================================================================

-- Add broadcast flag (true = show on all agent sites)
alter table public.blog_posts
  add column if not exists is_broadcast boolean not null default false;

-- Optional list of target agent UUIDs; empty array = all agents
alter table public.blog_posts
  add column if not exists target_agent_ids uuid[] not null default '{}';

-- JSON array of gallery images: [{url: string, caption: string}]
alter table public.blog_posts
  add column if not exists gallery_images jsonb not null default '[]'::jsonb;

-- Index to efficiently query broadcast posts
create index if not exists idx_blog_posts_broadcast on public.blog_posts(is_broadcast)
  where is_broadcast = true;

comment on column public.blog_posts.is_broadcast       is 'When true, post appears on all agent sites (broadcast).';
comment on column public.blog_posts.target_agent_ids   is 'Specific agent UUIDs to broadcast to. Empty = all agents.';
comment on column public.blog_posts.gallery_images     is 'JSON array [{url, caption}] for post image gallery.';
