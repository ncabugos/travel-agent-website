# Claude Code Prompt — Update Hotel Cover Images from CSV

Paste the following prompt into Claude Code at the repo root:

---

I need you to update `cover_image_url` in the `luxury_hotels` table for 133 hotels, then mirror all new images into Supabase Storage. Here's the exact plan:

## Step 1 — Read the source CSV

Read `hotels-images-progress.csv` from the repo root. It has these columns:
`slug, name, city, country, brand, status, current_url, new_image_url, image_status`

Filter rows where `image_status === 'found'` — those are the 133 hotels with confirmed new image URLs.

## Step 2 — Write a patch script

Create `scripts/patch_hotel_covers.js` that does the following:

```js
// scripts/patch_hotel_covers.js
// Updates luxury_hotels.cover_image_url for hotels sourced in hotels-images-progress.csv.
// Skips rows whose cover_image_url is already a Supabase Storage URL (already mirrored).
// Run: NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/patch_hotel_covers.js
// Dry run: add --dry-run flag
```

The script should:
1. Parse `hotels-images-progress.csv` (use Node's built-in `fs` + a simple CSV parse — no external deps beyond what's already in `package.json`)
2. For each row with `image_status === 'found'` and a non-empty `new_image_url`:
   - Look up the hotel in `luxury_hotels` by `slug`
   - If found and `cover_image_url` is NOT already a Supabase Storage URL (i.e. does not contain the project's Supabase hostname), update `cover_image_url` to `new_image_url`
   - Log `✓ UPDATED slug` or `→ SKIP slug (already mirrored)` or `✗ NOT FOUND slug`
3. Print a summary at the end: total updated, skipped, not found

Use `lib/supabase/service.ts` pattern — but since this is a Node script (not Next.js), import `@supabase/supabase-js` directly and create a service-role client using `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` env vars. Mirror the exact pattern in `scripts/mirror_hotel_images.js`.

## Step 3 — Run the patch script

```bash
# Dry run first to verify matches
NEXT_PUBLIC_SUPABASE_URL=$(grep NEXT_PUBLIC_SUPABASE_URL .env.local | cut -d= -f2) \
SUPABASE_SERVICE_ROLE_KEY=$(grep SUPABASE_SERVICE_ROLE_KEY .env.local | cut -d= -f2) \
node scripts/patch_hotel_covers.js --dry-run

# Real run after confirming
NEXT_PUBLIC_SUPABASE_URL=$(grep NEXT_PUBLIC_SUPABASE_URL .env.local | cut -d= -f2) \
SUPABASE_SERVICE_ROLE_KEY=$(grep SUPABASE_SERVICE_ROLE_KEY .env.local | cut -d= -f2) \
node scripts/patch_hotel_covers.js
```

## Step 4 — Mirror images to Supabase Storage

After the patch script confirms updates, run the existing mirror script **only for the newly patched hotels** (use `--only-broken` to skip any that are already on Supabase):

```bash
NEXT_PUBLIC_SUPABASE_URL=$(grep NEXT_PUBLIC_SUPABASE_URL .env.local | cut -d= -f2) \
SUPABASE_SERVICE_ROLE_KEY=$(grep SUPABASE_SERVICE_ROLE_KEY .env.local | cut -d= -f2) \
node scripts/mirror_hotel_images.js --only-broken
```

This will:
- Download each new image from its brand CDN (aman.com, fourseasons.com, cache.marriott.com, etc.)
- Upload it to the `hotel-covers` Supabase Storage bucket
- Rewrite `cover_image_url` to the permanent Supabase public URL

## Step 5 — Verify

After mirroring, spot-check 5–10 hotels by querying the DB:

```bash
NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node -e "
const { createClient } = require('@supabase/supabase-js');
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
sb.from('luxury_hotels').select('slug,name,cover_image_url').in('slug', [
  'aman-kyoto-japan',
  'four-seasons-hotel-chicago-united-states',
  'the-ritz-carlton-chicago-united-states',
  'fairmont-empress-canada',
  'mandarin-oriental-tokyo-japan'
]).then(({data}) => data.forEach(h => console.log(h.slug, h.cover_image_url)));
"
```

Confirm each URL starts with your Supabase Storage hostname (not a third-party CDN).

## Notes

- `hotels-images-progress.csv` is at the repo root
- The mirror script is at `scripts/mirror_hotel_images.js` — read it before writing the patch script to match the client/env pattern exactly
- The Supabase bucket is `hotel-covers` (created in migration `024_hotel_covers_bucket.sql`)
- The table is `public.luxury_hotels`, unique key is `slug`
- Use service-role key for all writes — never anon key
- Do NOT commit `.env.local` values to any file
