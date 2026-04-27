-- =============================================================================
-- Migration: 024_hotel_covers_bucket.sql
-- Description: Creates a public Supabase Storage bucket for mirrored hotel
--              cover images. The Virtuoso CDN (media.virtuoso.com) rotates /
--              privacy-gates its brochure assets over time, so we mirror them
--              into our own bucket for durability. See scripts/mirror_hotel_images.js.
-- =============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'hotel-covers',
  'hotel-covers',
  true,
  20 * 1024 * 1024,                       -- 20 MB ceiling per image
  array['image/jpeg','image/png','image/webp']
)
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Public read — anyone can view mirrored hotel covers from any website.
create policy "hotel-covers: public read"
  on storage.objects for select
  using (bucket_id = 'hotel-covers');

-- Writes are restricted to service-role (used by scripts/mirror_hotel_images.js).
-- No agent or end-user should be able to write here.
create policy "hotel-covers: service-role write"
  on storage.objects for insert
  with check (bucket_id = 'hotel-covers' and auth.role() = 'service_role');

create policy "hotel-covers: service-role update"
  on storage.objects for update
  using (bucket_id = 'hotel-covers' and auth.role() = 'service_role');

create policy "hotel-covers: service-role delete"
  on storage.objects for delete
  using (bucket_id = 'hotel-covers' and auth.role() = 'service_role');
