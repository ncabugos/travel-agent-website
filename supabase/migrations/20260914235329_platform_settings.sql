-- Operator-level key/value settings (admin Settings page). First key:
-- notification_email, the inbox that receives signup, onboarding, and
-- inquiry alerts. Writes go through the service role from
-- /api/admin/settings; super_admins may read and update via RLS.

create table if not exists public.platform_settings (
  key text primary key,
  value text,
  updated_at timestamptz not null default now()
);

alter table public.platform_settings enable row level security;

drop policy if exists "platform_settings: super_admin read" on public.platform_settings;
create policy "platform_settings: super_admin read"
  on public.platform_settings
  for select
  using (
    exists (
      select 1 from public.agents a
      where a.id = auth.uid() and a.role = 'super_admin'
    )
  );

drop policy if exists "platform_settings: super_admin update" on public.platform_settings;
create policy "platform_settings: super_admin update"
  on public.platform_settings
  for update
  using (
    exists (
      select 1 from public.agents a
      where a.id = auth.uid() and a.role = 'super_admin'
    )
  )
  with check (
    exists (
      select 1 from public.agents a
      where a.id = auth.uid() and a.role = 'super_admin'
    )
  );
-- No INSERT/DELETE policies: those happen only via the service role, which
-- bypasses RLS.

insert into public.platform_settings (key, value)
values ('notification_email', 'cabugosb3@gmail.com')
on conflict do nothing;
