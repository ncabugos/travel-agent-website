/**
 * Sync cruise_lines content (tagline, description, logo_url, hero_image_url,
 * highlights, ships, slider_images) from the canonical MOCK_CRUISE_LINES in
 * lib/cruise-lines.ts into the DB, matched by slug. Does NOT touch
 * logo_url_white / logo_url_black (owned by migration 048) or cruise_types.
 * Re-runnable. Usage: node scripts/sync-cruise-content.js
 */
require('dotenv').config({ path: '.env.local' })
const fs = require('fs')
const { createClient } = require('@supabase/supabase-js')

const src = fs.readFileSync('lib/cruise-lines.ts', 'utf8')
const startTok = 'MOCK_CRUISE_LINES: CruiseLine[] ='
const start = src.indexOf('[', src.indexOf(startTok))
const end = src.indexOf('\nconst MOCK_PROGRAM_PROPERTIES')
const arrText = src.slice(start, src.lastIndexOf(']', end) + 1)
// eslint-disable-next-line no-eval
const lines = eval('(' + arrText + ')')

const FIELDS = ['tagline','description','logo_url','hero_image_url','highlights','ships','slider_images']

;(async () => {
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  let ok = 0, miss = 0
  for (const l of lines) {
    const patch = {}
    for (const f of FIELDS) patch[f] = l[f] ?? null
    const { data, error } = await sb.from('cruise_lines').update(patch).eq('slug', l.slug).select('slug')
    if (error) { console.log('ERR', l.slug, error.message); continue }
    if (!data || data.length === 0) { console.log('NO DB ROW for slug:', l.slug); miss++; continue }
    ok++
  }
  console.log(`synced ${ok}/${lines.length} cruise lines (no-match: ${miss})`)
})()
