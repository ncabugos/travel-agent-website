/**
 * scripts/audit-migrations.mjs
 *
 * READ-ONLY audit: probes the production Supabase project to detect which
 * migrations' effects are actually live, so the Supabase CLI baseline
 * (`supabase migration repair`) can mark the right ones applied vs. leave
 * the missing ones for `supabase db push`.
 *
 * Only runs SELECTs (head/count + single-row reads). Never writes.
 *
 * Usage:  npm run db:audit   (reads NEXT_PUBLIC_SUPABASE_URL +
 *         SUPABASE_SERVICE_ROLE_KEY from .env.local)
 */
import { readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'

// ── tiny .env.local parser ──────────────────────────────────────────────────
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
const url = env.NEXT_PUBLIC_SUPABASE_URL
const key = env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}
const sb = createClient(url, key, { auth: { persistSession: false } })

// ── probes ──────────────────────────────────────────────────────────────────
// kind: 'table' | 'column' | 'data'
const TABLE = (mig, table) => ({ mig, kind: 'table', table, label: `table ${table}` })
const COLUMN = (mig, table, column) => ({ mig, kind: 'column', table, column, label: `${table}.${column}` })

const probes = [
  TABLE('001', 'agents'),
  TABLE('001', 'global_suppliers'),
  TABLE('002', 'hotel_programs'),
  TABLE('003', 'blog_posts'),
  TABLE('009', 'cruise_lines'),
  TABLE('009', 'featured_partners'),
  TABLE('009', 'program_featured_properties'),
  COLUMN('011', 'cruise_lines', 'slider_images'),
  TABLE('012', 'supplier_products'),
  TABLE('013', 'supplier_promos'),
  TABLE('014', 'villas'),
  TABLE('015', 'luxury_hotels'),
  TABLE('016', 'blog_categories'),
  TABLE('016', 'agent_blog_preferences'),
  TABLE('017', 'edit_requests'),
  COLUMN('019', 'agents', 'role'),
  COLUMN('020', 'agents', 'onboarding_completed_at'),
  COLUMN('020', 'agents', 'travel_specialties'),
  TABLE('020', 'admin_notifications'),
  TABLE('022', 'consultation_requests'),
  TABLE('023', 'agent_hotel_program_selections'),
  COLUMN('027', 'blog_posts', 'supplier_tags'),
  COLUMN('028', 'blog_posts', 'target_demo_slugs'),
  COLUMN('029', 'agents', 'first_name'),
  COLUMN('030', 'blog_posts', 'seo_title'),
  COLUMN('033', 'hotel_programs', 'logo_url_white'),
  COLUMN('033', 'hotel_programs', 'logo_url_black'),
  COLUMN('035', 'agents', 'plan'),
  COLUMN('035', 'agents', 'beta_cohort'),
  COLUMN('036', 'consultation_requests', 'source'),
]

async function probe(p) {
  try {
    if (p.kind === 'table') {
      const { error, count } = await sb.from(p.table).select('*', { head: true, count: 'exact' })
      if (error) return { ...p, ok: false, detail: error.message.split('\n')[0] }
      return { ...p, ok: true, detail: `${count ?? '?'} rows` }
    }
    if (p.kind === 'column') {
      const { error } = await sb.from(p.table).select(p.column).limit(1)
      if (error) return { ...p, ok: false, detail: error.message.split('\n')[0] }
      return { ...p, ok: true, detail: 'column present' }
    }
  } catch (e) {
    return { ...p, ok: false, detail: String(e).split('\n')[0] }
  }
}

// ── data-patch checks (migration-specific) ──────────────────────────────────
async function dataChecks() {
  const out = []

  // 010 — seed data: cruise_lines populated
  {
    const { count, error } = await sb.from('cruise_lines').select('*', { head: true, count: 'exact' })
    out.push({ mig: '010', label: 'cruise_lines seeded', ok: !error && (count ?? 0) > 0, detail: error ? error.message.split('\n')[0] : `${count} rows` })
  }

  // 033 (data patch) — Explora hero repointed to .webp
  {
    const { data, error } = await sb.from('cruise_lines').select('slug,hero_image_url,logo_url').eq('slug', 'explora-journeys').maybeSingle()
    if (error) out.push({ mig: '033d', label: 'explora hero .webp patch', ok: false, detail: error.message.split('\n')[0] })
    else if (!data) out.push({ mig: '033d', label: 'explora hero .webp patch', ok: false, detail: 'no explora-journeys row' })
    else out.push({ mig: '033d', label: 'explora hero .webp patch', ok: String(data.hero_image_url || '').endsWith('.webp'), detail: `hero=${data.hero_image_url}` })
  }

  // 034 — sea-cloud / amadeus cruise lines removed
  {
    const { data, error } = await sb.from('cruise_lines').select('slug').or('slug.ilike.%sea-cloud%,slug.ilike.%amadeus%')
    out.push({ mig: '034', label: 'sea-cloud/amadeus removed', ok: !error && (data?.length ?? 0) === 0, detail: error ? error.message.split('\n')[0] : (data?.length ? `still present: ${data.map(r => r.slug).join(', ')}` : 'none present (removed)') })
  }

  return out
}

// ── run ─────────────────────────────────────────────────────────────────────
const results = []
for (const p of probes) results.push(await probe(p))
const dataResults = await dataChecks()

const pad = (s, n) => String(s).padEnd(n)
console.log('\n  MIGRATION AUDIT  (production, read-only)\n')
console.log(`  ${pad('mig', 6)}${pad('check', 42)}status   detail`)
console.log('  ' + '─'.repeat(86))
for (const r of [...results, ...dataResults.map(d => ({ ...d, label: d.label }))]) {
  const status = r.ok ? '✓ live ' : '✗ MISS '
  console.log(`  ${pad(r.mig, 6)}${pad(r.label, 42)}${status}  ${r.detail || ''}`)
}

const missing = [...results, ...dataResults].filter(r => !r.ok)
console.log('\n  ── SUMMARY ─────────────────────────────────────────')
if (missing.length === 0) {
  console.log('  All probed migrations appear LIVE.')
} else {
  console.log('  MISSING / not applied to prod:')
  for (const m of missing) console.log(`    • [${m.mig}] ${m.label} — ${m.detail}`)
}
console.log('')
