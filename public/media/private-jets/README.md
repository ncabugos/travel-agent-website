# Private jet & safari imagery — drop zone

These operators are seeded in `private_journeys` with copy, itineraries and
pricing, but **no photography** — the pages render a typographic hero and skip
the gallery until files land here.

Source from the supplier's partner/media portal, not the public marketing site.

## Expected filenames

Per operator directory:

- `hero-2000.jpg`  — 2000×1125 or wider, used for the page hero
- `slider-1-1500.jpg` … `slider-6-1500.jpg` — square or 4:5, used for the gallery

## Directories

- `public/media/private-jets/four-seasons-private-jet/`
- `public/media/safaris/abercrombie-kent/`
- `public/media/safaris/micato/`

## Wiring them up

Once the files are in place, set the DB columns — nothing in the page code
needs to change:

```sql
update private_journeys set
  hero_image_url = '/media/safaris/micato/hero-2000.jpg',
  slider_images  = to_jsonb(array[
    '/media/safaris/micato/slider-1-1500.jpg',
    '/media/safaris/micato/slider-2-1500.jpg'
  ])
where slug = 'micato-safaris';
```

Logos go in `public/assets/supplier logos/{black,white} transparent/` and are
set via `logo_url_white` / `logo_url_black`.
