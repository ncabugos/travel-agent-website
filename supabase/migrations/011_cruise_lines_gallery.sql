-- Migration: extend cruise_lines table for gallery + multi-type support
-- Run this against your Supabase project

ALTER TABLE cruise_lines
  ADD COLUMN IF NOT EXISTS tagline         text,
  ADD COLUMN IF NOT EXISTS slider_images   jsonb    NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS cruise_types    text[]   NOT NULL DEFAULT ARRAY['ocean'];

-- Seed cruise_types from existing cruise_type column (if it exists)
UPDATE cruise_lines SET cruise_types = ARRAY[cruise_type] WHERE cruise_types = '{}' OR cruise_types IS NULL;

-- highlights column may already be jsonb; ensure ships column exists with correct type
ALTER TABLE cruise_lines
  ALTER COLUMN highlights SET DEFAULT '[]'::jsonb,
  ALTER COLUMN ships       SET DEFAULT '[]'::jsonb;

-- Example: mark Viking as both ocean and river
-- UPDATE cruise_lines SET cruise_types = ARRAY['ocean', 'river'] WHERE slug = 'viking';
