-- =============================================================================
-- Migration: 027_blog_supplier_tags.sql
-- Description: Adds supplier_tags column to blog_posts, enabling articles
--              to be linked to specific hotel programs and cruise lines.
--              Tags are stored as prefixed slugs: 'hotel:<slug>' or 'cruise:<slug>'.
-- =============================================================================

ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS supplier_tags TEXT[] NOT NULL DEFAULT '{}';

COMMENT ON COLUMN public.blog_posts.supplier_tags
  IS 'Array of supplier identifiers in the form "hotel:<slug>" or "cruise:<slug>".';

-- Index for fast array-contains lookups (e.g. find all posts tagged with a supplier)
CREATE INDEX IF NOT EXISTS idx_blog_posts_supplier_tags
  ON public.blog_posts USING GIN (supplier_tags);
