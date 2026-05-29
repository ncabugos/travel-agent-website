# Supabase migrations — runbook

## The problem this fixes

Migrations in `supabase/migrations/` were applied **by hand** (pasted into the
dashboard SQL editor). There was no CLI link, no tracking table, and no CI — so
some migrations (notably `033`'s data patches) never actually ran against prod,
and the DB drifted from the repo.

This runbook adopts the Supabase CLI as the single source of truth and wires
`supabase db push` into CI so it can't drift again.

---

## Step 1 — Find what's actually live (read-only)

```bash
npm run db:audit
```

Reads `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` from `.env.local`
and probes prod for each migration's effect (tables, columns, key data patches).
Output marks each `✓ live` or `✗ MISS`. **The `✗ MISS` list is the set you must
NOT baseline as applied** (see Step 3) — `db push` will run those.

---

## Step 2 — Link the CLI to prod (one time)

```bash
brew install supabase/tap/supabase
supabase login
export SUPABASE_PROJECT_REF=<ref>     # subdomain in your SUPABASE_URL
npm run db:link                        # supabase link --project-ref $SUPABASE_PROJECT_REF
npm run db:status                      # supabase migration list — remote will look empty
```

---

## Step 3 — Baseline the already-applied migrations (the critical step)

The prod DB already contains most of these migrations, but the CLI's tracking
table doesn't know that. Mark the **live** ones (everything that came back
`✓ live` in Step 1) as applied so `db push` won't try to re-run them — most of
them are NOT idempotent (`001, 002, 003, 009, 014, 015, 016, 017` use bare
`CREATE TABLE`) and would error.

**Audit result (2026-05-28): every migration is live in prod EXCEPT `033`.**
So baseline everything else as applied, and let `db push` run `033`:

```bash
supabase migration repair --status applied \
  001 002 003 004 005 006 007 008 009 010 011 011b 012 013 014 015 016 017 \
  018 019 020 021 022 023 024 025 026 027 028 029 030 031 032 034 035 036
# 033 is intentionally omitted — it's the only one missing, so `db push`
# (Step 4) will run it. Re-run `npm run db:audit` to confirm before you do this.
```

> **`033` is fully missing, not partial** — both its columns
> (`hotel_programs.logo_url_white` / `logo_url_black`) AND its Explora `.webp`
> hero `UPDATE` are absent, so running the whole file is clean (no split needed).
> Note: applying `033` will repoint Explora's cruise hero from the `.jpg` we
> shipped to the original `.webp` (both files exist, so it stays working).

---

## Step 4 — Apply the gap

```bash
npm run db:push        # supabase db push — runs only the un-baselined migrations
npm run db:status      # confirm local and remote now match
```

---

## Step 5 — Going forward (automatic)

`.github/workflows/supabase-migrations.yml` runs `supabase db push` on every push
to `main` that touches `supabase/migrations/**`. Add these repo secrets first
(Settings → Secrets → Actions):

- `SUPABASE_ACCESS_TOKEN` — personal access token
- `SUPABASE_DB_PASSWORD` — project database password
- `SUPABASE_PROJECT_REF` — project ref

After that, a new migration ships with its deploy and the DB never drifts again.

---

## Conventions

- **Unique, ordered version prefixes.** `011` previously collided (two files);
  the second is now `011b`. If your CLI version rejects the letter suffix, renames
  to a free number — order among already-applied migrations doesn't matter.
- **New migrations:** `supabase migration new <name>` (timestamped) is preferred
  over hand-numbering going forward.
- **Make new schema migrations idempotent** (`create table if not exists`,
  `add column if not exists`) so a re-run is always safe.
