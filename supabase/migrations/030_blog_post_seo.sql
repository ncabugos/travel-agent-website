-- =============================================================================
-- Migration: 030_blog_post_seo.sql
-- Description: Adds Shopify-style SEO override fields to blog_posts.
--              `seo_title` and `seo_description` are optional per-post
--              overrides. When NULL or empty, the render layer falls back to
--              the post's `title` and `excerpt` respectively.
-- =============================================================================

alter table public.blog_posts
  add column if not exists seo_title       text,
  add column if not exists seo_description text;

comment on column public.blog_posts.seo_title is
  'Per-post override of the <title> tag and OG title. Empty/NULL falls back to title.';
comment on column public.blog_posts.seo_description is
  'Per-post override of the meta description and OG description. Empty/NULL falls back to excerpt.';
