-- Onboarding intake fields captured by the advisor wizard (host agency, network
-- affiliations, certifications, inspiration sites) and a separate logo slot
-- alongside the existing avatar_url headshot.
alter table public.agents
  add column if not exists logo_url text,
  add column if not exists host_agency text,
  add column if not exists network_affiliations text[] not null default '{}',
  add column if not exists certifications text[] not null default '{}',
  add column if not exists inspiration_sites text[] not null default '{}';

-- Public bucket for advisor headshots and logos. Uploads go through
-- /api/agent-portal/upload with the service role; reads are public because the
-- images render on the advisor's public site.
insert into storage.buckets (id, name, public)
values ('agent-assets', 'agent-assets', true)
on conflict (id) do nothing;

create policy "agent-assets: public read"
  on storage.objects for select
  using (bucket_id = 'agent-assets');
