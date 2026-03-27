#!/usr/bin/env node
/**
 * seed_hotels.js
 * Reads Virtuoso_Hotels_Database.xlsx and upserts all rows into
 * Supabase `luxury_hotels`. Image URLs are already available in the spreadsheet.
 *
 * Run: SUPABASE_SERVICE_ROLE_KEY=... NEXT_PUBLIC_SUPABASE_URL=... node scripts/seed_hotels.js
 */

const XLSX = require('xlsx')
const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌  Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

async function main() {
  console.log('📂  Reading Virtuoso_Hotels_Database.xlsx…')
  const wb    = XLSX.readFile('Virtuoso_Hotels_Database.xlsx')
  const ws    = wb.Sheets[wb.SheetNames[0]]
  const rows  = XLSX.utils.sheet_to_json(ws, { header: 1 })

  // Row 0 = headers, Row 1+ = data
  const headers  = rows[0]
  const dataRows = rows.slice(1).filter(r => r[0]) // must have hotel name

  // Map header names to indices
  const h = (name) => headers.indexOf(name)

  const slugCount = {}

  const hotels = dataRows.map((r, i) => {
    const name    = String(r[h('Hotel Name')] || '').trim()
    const country = String(r[h('Country')]    || '').trim()
    const hotelId = r[h('Hotel ID')] ? String(r[h('Hotel ID')]).trim() : null

    // Dedupe slugs
    let base = slugify(`${name} ${country}`)
    if (!base) base = `hotel-${i}`
    slugCount[base] = (slugCount[base] || 0) + 1
    const slug = slugCount[base] > 1 ? `${base}-${slugCount[base]}` : base

    const experiencesRaw = r[h('Experiences')] ? String(r[h('Experiences')]).trim() : ''
    const experiences = experiencesRaw
      ? experiencesRaw.split(',').map(e => e.trim()).filter(Boolean)
      : []

    return {
      hotel_id:        hotelId,
      name,
      slug,
      city:            r[h('City')]            ? String(r[h('City')]).trim()            : null,
      state_region:    r[h('State / Region')]  ? String(r[h('State / Region')]).trim()  : null,
      country,
      neighborhood:    r[h('Neighborhood')]    ? String(r[h('Neighborhood')]).trim()    : null,
      hotel_company:   r[h('Hotel Company')]   ? String(r[h('Hotel Company')]).trim()   : null,
      hotel_type:      r[h('Type')]            ? String(r[h('Type')]).trim()            : null,
      room_count:      r[h('Room Count')]      ? Number(r[h('Room Count')])             : null,
      room_style:      r[h('Room Style')]      ? String(r[h('Room Style')]).trim()      : null,
      vibe:            r[h('Vibe')]            ? String(r[h('Vibe')]).trim()            : null,
      experiences,
      description:     r[h('Description')]     ? String(r[h('Description')]).trim()    : null,
      cover_image_url: r[h('Image URL')]       ? String(r[h('Image URL')]).trim()      : null,
      detail_url:      r[h('Detail URL')]      ? String(r[h('Detail URL')]).trim()      : null,
      sort_order:      i,
      is_active:       true,
    }
  })

  console.log(`📤  Upserting ${hotels.length} hotels into Supabase…`)

  const BATCH = 100
  for (let i = 0; i < hotels.length; i += BATCH) {
    const batch = hotels.slice(i, i + BATCH)
    const { error } = await supabase.from('luxury_hotels').upsert(batch, { onConflict: 'slug' })
    if (error) {
      console.error('❌  Batch error:', error.message)
      process.exit(1)
    }
    console.log(`  ✓ ${Math.min(i + BATCH, hotels.length)}/${hotels.length}`)
  }

  console.log('\n✅  Hotel seed complete!')
}

main().catch(err => { console.error(err); process.exit(1) })
