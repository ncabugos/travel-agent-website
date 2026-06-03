-- =============================================================================
-- Migration: 041_hotel_covers_local_kempinski.sql
-- Description: Set cover_image_url for two Kempinski (Club 1897) hotels to
--              operator-supplied local images (public/media/hotel-programs/
--              kempinski-1897/). Their Virtuoso brochure thumbnails had 404'd.
-- Idempotent: plain UPDATEs keyed on slug; safe to re-run.
-- =============================================================================

update public.luxury_hotels set cover_image_url = '/media/hotel-programs/kempinski-1897/hotel-adlon-kempinski.avif'             where slug = 'hotel-adlon-kempinski-berlin-germany';
update public.luxury_hotels set cover_image_url = '/media/hotel-programs/kempinski-1897/hotel-taschenbergpalais-kempinski.avif' where slug = 'hotel-taschenbergpalais-kempinski-dresden-germany';
