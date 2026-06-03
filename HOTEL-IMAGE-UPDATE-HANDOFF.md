# Hotel Image Update — Handoff for Claude Code

## Goal
Replace broken hotel directory images with working hero images sourced from each hotel's
official website. Source files live at the repo root:

- `resolved-hotel-images.csv` — **apply these.** 203 rows: `slug, name, new_image_url`. Every
  `new_image_url` is a live image hosted on the hotel's official site or brand/CDN domain.
- `hotels-images-progress.csv` — full working sheet (510 rows). Columns:
  `slug, name, city, country, brand, status, current_url, new_image_url, image_status`.
  `image_status = found` means an official image was located; blank means still missing.

## What to do
For each row in `resolved-hotel-images.csv`, update the hotel record keyed by `slug` so the
directory uses `new_image_url` instead of the dead `current_url`.

Likely target (confirm against the schema before writing):
- Table `featured_hotels` (and/or `hotel_programs` / `collections` as applicable) — the column
  that stores the directory/card image URL.
- Match on the hotel `slug`.

Conventions to respect (per CLAUDE.md):
- Migrations are numbered + immutable — add the next `N+1` migration; don't edit existing ones.
- RLS stays on; use `super_admin` policies, not hardcoded UUIDs.
- After the write, call `revalidatePath` on any public directory pages that render these images
  (known P1 gap).
- Verify with `npx tsc --noEmit` and a browser spot-check of ≥3 slugs at 375/768/1280px.
  (Note: `npm run build` is known to fail in the sandbox — use tsc + eslint.)
- As images are applied, remove the corresponding entries from `hotels-missing-covers.csv` and
  `missing_hotel_images.csv` per the backlog convention.

## Status
- **203 / 510** hotels now have an official image (74 pre-existing + 129 added this pass).
- **307 still missing**:
  - ~25 attempted but unresolved — official sites are fully JavaScript-rendered or block scraping
    (e.g. Ritz Paris, Marina Bay Sands, Passalacqua, Beaverbrook, Llao Llao, Ladera, Daios Cove).
  - ~282 not yet processed (batches 07–19) — run interrupted by an account session limit.
- The remaining hotels will be resolved in a follow-up pass (JS-rendered sites need the
  browser-rendering tool, not a raw fetch). They'll be appended to `resolved-hotel-images.csv`.

## Image selection notes
Each URL is a hero/exterior/facade/pool/aerial shot where one was identifiable on the official
page; otherwise the page's `og:image`. A few are interior/suite shots where no exterior was
exposed (e.g. Breidenbacher Hof, Badrutt's Palace) — flag if you want those re-pulled.
