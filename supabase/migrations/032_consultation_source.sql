-- =============================================================================
-- Migration: 032_consultation_source.sql
-- Description: Adds a `source` column to consultation_requests so public
--              Founding Advisor beta-waitlist signups (from /beta) can be
--              distinguished from Custom/Agency sales leads (from
--              /schedule-consultation) in the admin inbox.
--
--              RLS is unchanged. The existing policies on consultation_requests
--              already cover this column:
--                • "public insert" is WITH CHECK (true) — anon may insert and
--                  set `source`; the /beta form sets source='beta-waitlist'.
--                • The DEFAULT 'consultation' labels every existing row and any
--                  insert (e.g. the consultation form) that omits the column,
--                  so no backfill and no policy change is required.
-- =============================================================================

alter table public.consultation_requests
  add column if not exists source text not null default 'consultation'
    check (source in ('consultation', 'beta-waitlist'));

comment on column public.consultation_requests.source is
  'Origin of the request: ''consultation'' (the /schedule-consultation Custom/Agency form, default) or ''beta-waitlist'' (the public /beta Founding Advisor waitlist).';

create index if not exists consultation_requests_source_idx
  on public.consultation_requests (source);
