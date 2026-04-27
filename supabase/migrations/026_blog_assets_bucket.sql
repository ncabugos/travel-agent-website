-- =============================================================================
-- Migration: 026_blog_assets_bucket.sql
-- Description: Creates a public Supabase Storage bucket for blog/journal
--              assets (cover images, gallery images, inline editor images).
--              Admin and agent-portal uploads go through service_role via
--              the /api/admin/upload endpoint.
-- =============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'blog-assets',
  'blog-assets',
  true,
  10 * 1024 * 1024,                       -- 10 MB ceiling per image
  array['image/jpeg','image/png','image/webp','image/gif']
)
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Public read — anyone can view blog images.
create policy "blog-assets: public read"
  on storage.objects for select
  using (bucket_id = 'blog-assets');

-- Writes via service_role (admin upload API).
create policy "blog-assets: service-role write"
  on storage.objects for insert
  with check (bucket_id = 'blog-assets' and auth.role() = 'service_role');

create policy "blog-assets: service-role update"
  on storage.objects for update
  using (bucket_id = 'blog-assets' and auth.role() = 'service_role');

create policy "blog-assets: service-role delete"
  on storage.objects for delete
  using (bucket_id = 'blog-assets' and auth.role() = 'service_role');
