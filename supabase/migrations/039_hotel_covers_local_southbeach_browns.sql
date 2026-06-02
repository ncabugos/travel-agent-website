-- =============================================================================
-- Migration: 039_hotel_covers_local_southbeach_browns.sql
-- Description: Set cover_image_url for two hotels to operator-supplied local
--              images (committed under public/media/hotel-programs/). Their
--              Virtuoso brochure thumbnails had 404'd and the official origins
--              block server-side mirroring, so the covers are served locally.
-- Idempotent: plain UPDATEs keyed on slug; safe to re-run.
-- =============================================================================

update public.luxury_hotels set cover_image_url = '/media/hotel-programs/1hotel-southbeach.webp'                                  where slug = '1-hotel-south-beach-united-states';
update public.luxury_hotels set cover_image_url = '/media/hotel-programs/rocco-forte/rocco-forte-hotel-brown_s-hotel-facade.avif' where slug = 'browns-hotel-a-rocco-forte-hotel-united-kingdom';
