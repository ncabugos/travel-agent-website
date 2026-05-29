/**
 * scripts/apply-marriott-covers.mjs
 * Applies migration 037 (Marriott Luxury Group cover images) to the live DB
 * by parsing the UPDATE statements and running them through the service-role
 * client. Reports how many rows each touched (0 = slug not found → review).
 *
 * This is the "apply now" path while the supabase CLI pipeline isn't wired up;
 * 037_marriott_luminous_covers.sql remains the canonical record.
 *
 * Usage: node scripts/apply-marriott-covers.mjs
 */
import { readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'

function loadEnv() {
  const txt = readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
  const env = {}
  for (const line of txt.split('\n')) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '').trim()
  }
  return env
}
const env = loadEnv()
const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })

const sql = readFileSync(new URL('../supabase/migrations/037_marriott_luminous_covers.sql', import.meta.url), 'utf8')
const re = /cover_image_url = '([^']+)'\s+where slug = '([^']+)'/g
const pairs = [...sql.matchAll(re)].map(m => ({ url: m[1], slug: m[2] }))

console.log(`\n  Applying ${pairs.length} Marriott cover updates…\n`)
let updated = 0, notFound = 0
for (const { url, slug } of pairs) {
  const { data, error } = await sb
    .from('luxury_hotels')
    .update({ cover_image_url: url })
    .eq('slug', slug)
    .select('slug')
  if (error) { console.log(`  ✗ ERROR ${slug}: ${error.message.split('\n')[0]}`); continue }
  if (!data || data.length === 0) { console.log(`  ⚠ no row for slug: ${slug}`); notFound++; continue }
  console.log(`  ✓ ${slug}`)
  updated++
}
console.log(`\n  Done — ${updated} updated, ${notFound} slug(s) not found.\n`)
