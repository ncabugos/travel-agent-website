-- Re-apply the migration 019 body of handle_new_user.
--
-- The live function was still the 001 version (no email, no role). Every
-- self-signup through /agent-portal/login or /agent-portal/register created an
-- agents row with email = null, and every portal lookup is by email, so those
-- advisors landed on "your email is not linked to an agent account".

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public as $$
begin
  insert into public.agents (id, full_name, agency_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name',   'New Agent'),
    coalesce(new.raw_user_meta_data->>'agency_name', 'My Agency'),
    new.email,
    coalesce(new.raw_user_meta_data->>'role',        'agent')
  );
  return new;
end;
$$;

-- Backfill email on the rows the old trigger created. agents.id is the auth
-- user id for every row, so auth.users is the source. Skip any email another
-- row already holds (agents_email_key).
update public.agents a
set email = u.email
from auth.users u
where u.id = a.id
  and a.email is null
  and not exists (select 1 from public.agents b where b.email = u.email);
