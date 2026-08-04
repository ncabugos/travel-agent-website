-- 054_inquiries_table.sql
-- Creates public.inquiries — the contact-form lead table.
--
-- lib/actions/contact.ts has always inserted every public contact-form
-- submission into public.inquiries as the audit trail, but the table was never
-- in version control (044_security_rls_hardening.sql §3 flagged this and
-- guarded its RLS work behind existence checks so it silently no-ops). The
-- table does not exist in production, so that insert has been failing on every
-- submission — the error is caught and logged, then execution continues to the
-- Resend send, which is why the form still appears to work. Email has been the
-- only copy of every lead.
--
-- Columns mirror the payload built in lib/actions/contact.ts exactly. `message`
-- holds the composed body (hotel of interest, vacation type, traveler count,
-- advisor preference, free text), not just the textarea.
--
-- agent_id is nullable and ON DELETE SET NULL: submissions from the marketing
-- site carry no agent, and an advisor's leads must outlive their account row.

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid references public.agents(id) on delete set null,
  name text not null,
  email text not null,
  phone text,
  destination text,
  message text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

-- Lead inbox reads are always "this advisor's leads, newest first".
create index if not exists inquiries_agent_created_idx
  on public.inquiries (agent_id, created_at desc);

alter table public.inquiries enable row level security;

-- Policies match the intent 044 declared. Re-created here (rather than relying
-- on 044) because 044's existence check found no table and skipped them.

-- Public contact form (anon + authenticated) may submit leads. Insert-only:
-- there is no anon SELECT policy, so leads are never publicly readable.
drop policy if exists "inquiries: public insert" on public.inquiries;
create policy "inquiries: public insert"
  on public.inquiries for insert
  to anon, authenticated
  with check (true);

-- Owning advisor reads their own leads (agents.id = auth.uid()).
drop policy if exists "inquiries: agent read own" on public.inquiries;
create policy "inquiries: agent read own"
  on public.inquiries for select
  using (auth.uid() = agent_id);

-- Super admins read all leads.
drop policy if exists "inquiries: super_admin read" on public.inquiries;
create policy "inquiries: super_admin read"
  on public.inquiries for select
  using (
    exists (
      select 1 from public.agents a
      where a.id = auth.uid() and a.role = 'super_admin'
    )
  );

-- No UPDATE/DELETE policies: status changes and cleanup happen through the
-- service-role client, which bypasses RLS.
