#!/usr/bin/env node
/**
 * import_blog_drafts.js
 * Imports the 3 markdown drafts in marketing/content-strategy/blog-drafts/ into
 * marketing_posts as DRAFTS. Converts markdown -> HTML, extracts the FAQ section
 * into the faq[] column (FAQPage schema) and out of the body, strips Wine &
 * Wellness Travel / Montecito references (EAH-only rule), and removes the
 * trailing author bio (the on-page byline covers it).
 *
 * Also deletes the two earlier seed posts these supersede.
 *
 * Prereq: migration 043 applied. Run: node scripts/import_blog_drafts.js
 */
const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

function loadEnvLocal() {
  const p = path.join(process.cwd(), '.env.local')
  if (!fs.existsSync(p)) return
  for (const line of fs.readFileSync(p, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
}
loadEnvLocal()

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!SUPABASE_URL || !SERVICE_KEY) { console.error('❌  Missing Supabase env'); process.exit(1) }
const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

const DRAFTS_DIR = path.join(process.cwd(), 'marketing/content-strategy/blog-drafts')
const SUPERSEDED_SLUGS = [
  'the-first-impression-you-never-get-to-make',
  'how-much-does-a-travel-advisor-website-cost-2026',
]
const FEATURED_SLUG = 'first-impression-you-never-get-to-make'

// ── Minimal frontmatter parser (only the scalar fields we need) ──────────────
function parseFrontmatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!m) return { fm: {}, body: raw }
  const fm = {}
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([a-z_]+):\s*(.+)$/)
    if (kv) fm[kv[1]] = kv[2].replace(/^["']|["']$/g, '').trim()
  }
  return { fm, body: m[2] }
}

// ── EAH-only: strip W&W / Montecito; keep the working-advisor credibility ────
function stripAgencyRefs(md) {
  return md
    .replace(
      /I run a travel practice, Wine and Wellness Travel, affiliated with Montecito Village Travel and the Virtuoso network\./g,
      'I run a working travel practice within the Virtuoso network.',
    )
    .replace(/,?\s*Wine and Wellness Travel,?/g, '')
    .replace(/\s*affiliated with Montecito Village Travel and the Virtuoso network/g, ' working within the Virtuoso network')
    .replace(/\s*at\s*\.(?=\s|$)/g, '.') // tidy "advisor at ." leftovers
}

// ── Pull FAQ section out into [{q,a}]; return body without it (and bio) ───────
function extractFaqAndTrim(md) {
  const idx = md.search(/\n##\s+Frequently Asked Questions/i)
  let body = md
  let faqBlock = ''
  if (idx !== -1) {
    body = md.slice(0, idx)
    faqBlock = md.slice(idx)
  }
  // Drop trailing "---" + italic bio from the body if FAQ wasn't found there.
  body = body.replace(/\n---\s*\n[\s\S]*$/, '\n')
  // FAQ block: stop at the trailing "---" (bio separator).
  faqBlock = faqBlock.replace(/\n---\s*\n[\s\S]*$/, '')

  const faq = []
  let q = null, a = []
  for (const line of faqBlock.split('\n')) {
    const qm = line.match(/^\*\*(.+?)\*\*\s*$/)
    if (qm) { if (q) faq.push({ q, a: a.join(' ').trim() }); q = qm[1].trim(); a = [] }
    else if (q && line.trim()) a.push(line.trim())
  }
  if (q) faq.push({ q, a: a.join(' ').trim() })
  return { body, faq }
}

function stripLeadingH1(md) {
  return md.replace(/^\s*#\s+.+\n/, '')
}

function wordCount(s) {
  const t = s.replace(/<[^>]+>/g, ' ').replace(/[#*|>_-]/g, ' ').replace(/\s+/g, ' ').trim()
  return t ? t.split(' ').length : 0
}

async function main() {
  const { marked } = await import('marked')
  marked.setOptions({ gfm: true, breaks: false })

  const { data: cat } = await supabase
    .from('marketing_categories').select('id').eq('slug', 'digital-presence').maybeSingle()
  const categoryId = cat?.id ?? null
  if (!categoryId) { console.error('❌  Pillar "digital-presence" missing. Is migration 043 applied?'); process.exit(1) }

  const files = fs.readdirSync(DRAFTS_DIR).filter(f => f.endsWith('.md')).sort()
  for (const file of files) {
    const raw = fs.readFileSync(path.join(DRAFTS_DIR, file), 'utf8')
    const { fm, body: rawBody } = parseFrontmatter(raw)
    const cleaned = stripAgencyRefs(rawBody)
    const { body: bodyNoFaq, faq } = extractFaqAndTrim(cleaned)
    const md = stripLeadingH1(bodyNoFaq).trim()
    const html = marked.parse(md)

    if (/wine and wellness|montecito/i.test(html + faq.map(f => f.q + f.a).join(' '))) {
      console.warn(`⚠️   ${fm.slug}: residual agency reference found — review manually.`)
    }

    const row = {
      slug: fm.slug,
      title: fm.title,
      status: 'draft',
      excerpt: fm.meta_description ?? null,
      body_html: html,
      seo_title: fm.meta_title ?? null,
      seo_description: fm.meta_description ?? null,
      category_id: categoryId,
      author_name: 'Nick Cabugos',
      author_credentials: 'Founder of Elite Advisor Hub',
      faq,
      read_minutes: Math.max(1, Math.round(wordCount(md) / 225)),
      featured: fm.slug === FEATURED_SLUG,
      published_at: fm.publish_date ? new Date(fm.publish_date + 'T09:00:00Z').toISOString() : new Date().toISOString(),
    }
    const { error } = await supabase.from('marketing_posts').upsert(row, { onConflict: 'slug' })
    if (error) { console.error(`❌  ${fm.slug}:`, error.message); process.exitCode = 1 }
    else console.log(`✓  ${row.featured ? '★ ' : '  '}${fm.title}  (${faq.length} FAQs, ${row.read_minutes} min)`)
  }

  // Remove the two earlier seed posts these drafts supersede.
  const { error: delErr } = await supabase.from('marketing_posts').delete().in('slug', SUPERSEDED_SLUGS)
  if (delErr) console.warn('⚠️   Could not remove superseded seeds:', delErr.message)
  else console.log(`\n🧹  Removed superseded seed posts: ${SUPERSEDED_SLUGS.join(', ')}`)

  console.log('\nDone. All 3 imported as drafts. Review at /admin/insights.')
}

main()
