#!/usr/bin/env node
/**
 * patch_hotel_covers.js
 *
 * Updates luxury_hotels.cover_image_url for hotels listed in
 * hotels-images-progress.csv (rows where image_status === 'found').
 * Skips rows whose cover_image_url is already a Supabase Storage URL.
 *
 * Run from the repo root (where hotels-images-progress.csv lives):
 *   NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
 *     node scripts/patch_hotel_covers.js [--dry-run]
 */

const { createClient } = require('@supabase/supabase-js')
const fs   = require('fs')
const path = require('path')

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌  Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const DRY_RUN = process.argv.includes('--dry-run')

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const SUPABASE_HOST = new URL(SUPABASE_URL).host

function isAlreadyMirrored(url) {
  if (!url) return false
  try { return new URL(url).host === SUPABASE_HOST } catch { return false }
}

// ─── CSV parser (no external deps) ───────────────────────────────────────────

function parseCSV(text) {
  const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n')
  const headers = splitCSVLine(lines[0])
  return lines.slice(1).filter(Boolean).map(line => {
    const vals = splitCSVLine(line)
    return Object.fromEntries(headers.map((h, i) => [h, vals[i] ?? '']))
  })
}

function splitCSVLine(line) {
  const result = []
  let cur = ''
  let inQuote = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (inQuote && line[i + 1] === '"') { cur += '"'; i++ }
      else inQuote = !inQuote
    } else if (ch === ',' && !inQuote) {
      result.push(cur); cur = ''
    } else {
      cur += ch
    }
  }
  result.push(cur)
  return result
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  // Locate CSV — prefer cwd (repo root), fall back to script's parent dir.
  const candidatePaths = [
    path.resolve(process.cwd(), 'hotels-images-progress.csv'),
    path.resolve(__dirname, '..', 'hotels-images-progress.csv'),
  ]
  const csvPath = candidatePaths.find(p => fs.existsSync(p))
  if (!csvPath) {
    console.error('❌  hotels-images-progress.csv not found. Run from the repo root.')
    process.exit(1)
  }

  console.log(`📄  Reading ${csvPath}`)
  const rows = parseCSV(fs.readFileSync(csvPath, 'utf8'))
  const targets = rows.filter(r => r.image_status === 'found' && r.new_image_url)
  console.log(`🎯  ${targets.length} hotels with image_status=found${DRY_RUN ? '  (DRY RUN)' : ''}`)

  const stats = { updated: 0, skipped_mirrored: 0, not_found: 0, db_error: 0 }

  for (const row of targets) {
    const { slug, new_image_url } = row

    // Look up hotel by slug.
    const { data: hotels, error: selErr } = await supabase
      .from('luxury_hotels')
      .select('id, slug, cover_image_url')
      .eq('slug', slug)
      .limit(1)

    if (selErr) {
      console.log(`✗ ERROR   ${slug}  (${selErr.message})`)
      stats.db_error++
      continue
    }
    if (!hotels || hotels.length === 0) {
      console.log(`✗ NOT FOUND  ${slug}`)
      stats.not_found++
      continue
    }

    const hotel = hotels[0]

    if (isAlreadyMirrored(hotel.cover_image_url)) {
      console.log(`→ SKIP    ${slug}  (already mirrored)`)
      stats.skipped_mirrored++
      continue
    }

    if (DRY_RUN) {
      console.log(`✓ DRY     ${slug}  →  ${new_image_url.slice(0, 80)}…`)
      stats.updated++
      continue
    }

    const { error: updErr } = await supabase
      .from('luxury_hotels')
      .update({ cover_image_url: new_image_url })
      .eq('id', hotel.id)

    if (updErr) {
      console.log(`✗ DB ERR  ${slug}  (${updErr.message})`)
      stats.db_error++
      continue
    }

    console.log(`✓ UPDATED ${slug}`)
    stats.updated++
  }

  console.log('\n──────────── Summary ────────────')
  console.log(`  updated            ${stats.updated}`)
  console.log(`  skipped (mirrored) ${stats.skipped_mirrored}`)
  console.log(`  not found in DB    ${stats.not_found}`)
  console.log(`  db errors          ${stats.db_error}`)
  console.log('─────────────────────────────────')
}

main().catch(err => {
  console.error('\n❌  Fatal:', err)
  process.exit(1)
})
