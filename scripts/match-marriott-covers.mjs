/**
 * scripts/match-marriott-covers.mjs
 * Matches the new Marriott "Luxury Group" cover images (in
 * public/media/hotel-programs/marriott-stars---luminous/) to the
 * luxury_hotels slugs that are missing images (from hotels-missing-images.csv).
 * Prints a mapping for review — does NOT touch the DB.
 */
import { readFileSync, readdirSync } from 'node:fs'

const IMG_DIR = 'public/media/hotel-programs/marriott-stars---luminous'
const URL_BASE = '/media/hotel-programs/marriott-stars---luminous'
const BRAND = 'Luxury Group at Marriott International'

const STOP = new Set([
  'a', 'the', 'hotel', 'resort', 'spa', 'and', 'luxury', 'collection', 'autograph',
  'ritz', 'carlton', 'reserve', 'beach', 'resorts', 'of', 'de', 'di', 'du',
])

function tokens(s) {
  return s
    .toLowerCase()
    .replace(/\.[a-z]+$/, '')        // drop extension
    .replace(/&/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .split(' ')
    .filter(t => t && !STOP.has(t))
}

// ── load images ──
const images = readdirSync(IMG_DIR).filter(f => /\.(jpe?g|png|webp)$/i.test(f) && !f.includes('logo'))

// ── load marriott hotels from the missing-images CSV ──
const csv = readFileSync('hotels-missing-images.csv', 'utf8').split('\n').filter(Boolean)
const header = csv[0].split(',')
const slugI = header.indexOf('slug'), nameI = header.indexOf('name'), brandI = header.indexOf('brand')
// naive CSV row split that respects simple double-quoted fields
function splitCsv(line) {
  const out = []; let cur = ''; let q = false
  for (const ch of line) {
    if (ch === '"') q = !q
    else if (ch === ',' && !q) { out.push(cur); cur = '' }
    else cur += ch
  }
  out.push(cur); return out
}
const hotels = csv.slice(1).map(splitCsv)
  .filter(r => (r[brandI] || '').includes('Marriott'))
  .map(r => ({ slug: r[slugI], name: r[nameI], toks: new Set(tokens(r[nameI] + ' ' + r[slugI])) }))

// ── match each image to the best hotel ──
const used = new Set()
const rows = []
for (const img of images.sort()) {
  const it = tokens(img)
  let best = null, bestScore = 0
  for (const h of hotels) {
    if (used.has(h.slug)) continue
    const overlap = it.filter(t => h.toks.has(t)).length
    const score = overlap / Math.max(it.length, 1)
    if (overlap > bestScore || (overlap === bestScore && score > (best?._s ?? 0))) {
      // prefer more raw token overlap, tiebreak by ratio
    }
    if (overlap > (best?._o ?? 0)) { best = { ...h, _o: overlap, _s: score } }
  }
  if (best) used.add(best.slug)
  rows.push({ img, imgToks: it.join(' '), slug: best?.slug, name: best?.name, overlap: best?._o ?? 0 })
}

console.log(`\n  ${images.length} images · ${hotels.length} missing-image Marriott hotels in CSV\n`)
for (const r of rows) {
  const flag = r.overlap >= 2 ? '✓' : r.overlap === 1 ? '~' : '✗'
  console.log(`  ${flag} [${r.overlap}] ${r.img}`)
  console.log(`        → ${r.slug || '(NO MATCH)'}  ${r.name ? '· ' + r.name : ''}`)
}
console.log('\n  ── SQL preview ──')
for (const r of rows) {
  if (r.slug && r.overlap >= 1) {
    console.log(`  update public.luxury_hotels set cover_image_url = '${URL_BASE}/${r.img}' where slug = '${r.slug}';`)
  }
}
const weak = rows.filter(r => r.overlap < 2)
if (weak.length) {
  console.log('\n  ⚠ REVIEW (low/no confidence):')
  for (const r of weak) console.log(`    ${r.img} → ${r.slug || '(none)'} [overlap ${r.overlap}]`)
}
console.log('')
