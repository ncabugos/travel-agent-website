-- =============================================================================
-- Migration: 040_hotel_covers_local_7pines.sql
-- Description: Set cover_image_url for the two 7Pines (Hyatt Privé) resorts to
--              operator-supplied local images (public/media/hotel-programs/
--              hyatt-prive/). Their Virtuoso brochure thumbnails had 404'd and
--              the origins block server-side mirroring, so covers are local.
-- Idempotent: plain UPDATEs keyed on slug; safe to re-run.
-- =============================================================================

update public.luxury_hotels set cover_image_url = '/media/hotel-programs/hyatt-prive/7pines-Ibiza-resort-pool-mediterranean.webp' where slug = '7pines-resort-ibiza-spain';
update public.luxury_hotels set cover_image_url = '/media/hotel-programs/hyatt-prive/7pines-resort-sardinia.webp'                 where slug = '7pines-resort-sardinia-italy';
