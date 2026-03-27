#!/usr/bin/env node
/**
 * seed_villas.js
 * Reads Villa_Collection_Database.xlsx, scrapes og:image from each onefinestay
 * source URL (deduped by URL), generates slugs, and upserts into Supabase `villas`.
 *
 * Run: SUPABASE_SERVICE_ROLE_KEY=... NEXT_PUBLIC_SUPABASE_URL=... node scripts/seed_villas.js
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

// ── helpers ──────────────────────────────────────────────────────────────────

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

// ── main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('📂  Reading Villa_Collection_Database.xlsx…')
  const wb   = XLSX.readFile('Villa_Collection_Database.xlsx')
  const ws   = wb.Sheets[wb.SheetNames[0]]
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1 })

  // Row 0 = title, Row 1 = headers, Row 2+ = data
  const dataRows = rows.slice(2).filter(r => r[1]) // must have a villa name

  // Columns: 0=Country, 1=Name, 2=Neighborhood, 3=City/Region, 4=Country(Detail),
  //          5=Type, 6=Bedrooms, 7=Bathrooms, 8=MaxGuests, 9=Price,
  //          10=SourceURL, 11=Source, 12=CoverImageURL

  const villas = dataRows.map((r, i) => {
    const name    = String(r[1] || '').trim()
    const country = String(r[0] || '').trim()
    const sourceUrl   = r[10] ? String(r[10]).trim() : null
    const coverImage  = r[12] ? String(r[12]).trim() : null
    return {
      name,
      slug:            slugify(`${name} ${country}`),
      country,
      neighborhood:    r[2] ? String(r[2]).trim() : null,
      city_region:     r[3] ? String(r[3]).trim() : null,
      villa_type:      r[5] ? String(r[5]).trim() : 'Villa',
      bedrooms:        r[6]  ? Number(r[6]) : null,
      bathrooms:       r[7]  ? Number(r[7]) : null,
      max_guests:      r[8]  ? Number(r[8]) : null,
      price_per_night: r[9]  ? Number(r[9]) : null,
      cover_image_url: coverImage,
      source_url:      sourceUrl,
      source:          r[11] ? String(r[11]).trim() : 'onefinestay',
      sort_order:      i,
      is_active:       true,
    }
  })

  console.log(`\n📤  Upserting ${villas.length} villas into Supabase…`)

  const BATCH = 50
  for (let i = 0; i < villas.length; i += BATCH) {
    const batch = villas.slice(i, i + BATCH)
    const { error } = await supabase.from('villas').upsert(batch, { onConflict: 'slug' })
    if (error) { console.error('❌  Batch error:', error.message); process.exit(1) }
    console.log(`  ✓ ${Math.min(i + BATCH, villas.length)}/${villas.length}`)
  }

  console.log('\n✅  Villa seed complete!')
}

main().catch(err => { console.error(err); process.exit(1) })
