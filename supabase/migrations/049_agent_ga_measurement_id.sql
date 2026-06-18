-- Per-advisor Google Analytics (GA4) measurement ID.
--
-- Each advisor can have their own GA4 property in addition to the platform-wide
-- property. Their public tenant site fires both. Read via service-role client
-- in lib/agent-ga.ts; surfaced on the advisor's tenant layout.

alter table public.agents
  add column if not exists ga_measurement_id text;

alter table public.agents
  drop constraint if exists agents_ga_measurement_id_format;

alter table public.agents
  add constraint agents_ga_measurement_id_format
  check (ga_measurement_id is null or ga_measurement_id ~ '^G-[A-Z0-9]{4,}$');

comment on column public.agents.ga_measurement_id is
  'GA4 measurement ID (G-XXXXXXXX) for the advisor''s own Google Analytics property, fired on their public tenant site in addition to the platform property.';

-- Eden For Your World (edenforyourworld.com)
update public.agents
  set ga_measurement_id = 'G-BJK7FMBR0J'
  where id = '2e18df43-171a-4565-b840-aade259cab69';
