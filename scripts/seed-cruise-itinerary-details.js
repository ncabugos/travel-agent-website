/**
 * Loads the Christmas market itineraries' full-page content and sailing dates
 * from scripts/data/christmas-itineraries.json. Safe to re-run. It only touches
 * AmaWaterways, Viking and Uniworld, and replaces those itineraries' dates.
 *
 *   node scripts/seed-cruise-itinerary-details.js          content, dates, inclusions
 *   node scripts/seed-cruise-itinerary-details.js --ships  AmaWaterways ship list and photos
 *   node scripts/seed-cruise-itinerary-details.js --line=viking  one line only, so edits to the others are kept
 *
 * Run --ships only after the photos in public/media/cruises/ama-waterways/ships
 * are deployed, or live pages will point at files that don't exist yet.
 */
require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')
const data = require('./data/christmas-itineraries.json')

// The sample itinerary is new to the catalog; the other nine already exist.
const NEW_ITINERARY = {
  slug: 'icons-of-the-danube-christmas-markets',
  image_url: '/media/cruises/ama-waterways/amawaterways-amamagna-xmas_market-1500.jpg',
  source_url: 'https://www.amawaterways.com/river-cruises/europe/danube/icons-danube/christmas-markets',
  sort_order: 0,
}

async function main() {
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  const check = (error, what) => {
    if (error) throw new Error(`${what}: ${error.message}`)
  }

  const { data: lines, error: linesError } = await sb
    .from('cruise_lines')
    .select('id, slug')
    .in('slug', ['amawaterways', 'viking', 'uniworld'])
  check(linesError, 'read lines')
  const lineId = Object.fromEntries(lines.map((line) => [line.slug, line.id]))

  if (process.argv.includes('--ships')) {
    const { error } = await sb.from('cruise_lines').update({ ships: data.amawaterways_ships }).eq('id', lineId.amawaterways)
    check(error, 'update ships')
    console.log(`AmaWaterways ships updated: ${data.amawaterways_ships.length}`)
    return
  }

  const { data: collection, error: collectionError } = await sb
    .from('cruise_collections')
    .select('id')
    .eq('slug', 'christmas-markets')
    .single()
  check(collectionError, 'read collection')

  const onlyLine = process.argv.find((arg) => arg.startsWith('--line='))?.split('=')[1]

  for (const [slug, included] of Object.entries(data.included)) {
    if (onlyLine && slug !== onlyLine) continue
    const { error } = await sb.from('cruise_lines').update({ included }).eq('id', lineId[slug])
    check(error, `update included ${slug}`)
  }

  for (const item of data.itineraries) {
    if (onlyLine && item.line_slug !== onlyLine) continue
    const fields = {
      nights: item.nights,
      route: item.route,
      overview: item.overview,
      highlights: item.highlights,
      region: item.region,
      countries: item.countries,
      days_direction: item.days_direction,
      days: item.days,
      departures_note: item.departures_note ?? null,
      updated_at: new Date().toISOString(),
    }
    const isNew = item.slug === NEW_ITINERARY.slug
    const { data: row, error } = await sb
      .from('cruise_itineraries')
      .upsert(
        {
          cruise_line_id: lineId[item.line_slug],
          slug: item.slug,
          name: item.name,
          ...fields,
          ...(isNew ? { blurb: item.blurb, collection_id: collection.id, image_url: NEW_ITINERARY.image_url, source_url: NEW_ITINERARY.source_url, sort_order: NEW_ITINERARY.sort_order } : {}),
        },
        { onConflict: 'cruise_line_id,slug' },
      )
      .select('id')
      .single()
    check(error, `upsert ${item.slug}`)

    const { error: deleteError } = await sb.from('cruise_itinerary_departures').delete().eq('itinerary_id', row.id)
    check(deleteError, `clear dates ${item.slug}`)
    const { error: insertError } = await sb
      .from('cruise_itinerary_departures')
      .insert(item.departures.map((departure) => ({ itinerary_id: row.id, ...departure })))
    check(insertError, `insert dates ${item.slug}`)
    console.log(`${item.line_slug}/${item.slug}: ${item.days.length} days, ${item.departures.length} dates`)
  }
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
