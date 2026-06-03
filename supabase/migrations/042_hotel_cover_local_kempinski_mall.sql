-- =============================================================================
-- Migration: 042_hotel_cover_local_kempinski_mall.sql
-- Description: Set cover_image_url for Kempinski Hotel Mall of the Emirates
--              (Dubai) to an operator-supplied local image. Its Virtuoso
--              brochure thumbnail had 404'd.
-- Idempotent: plain UPDATE keyed on slug; safe to re-run.
-- =============================================================================

update public.luxury_hotels set cover_image_url = '/media/hotel-programs/kempinski-1897/mall-of-the-emirates-kempsinski.avif' where slug = 'kempinski-hotel-mall-of-the-emirates-dubai-united-arab-emirates';
