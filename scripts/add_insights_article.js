#!/usr/bin/env node
/**
 * add_insights_article.js
 * Adds a single markdown article to marketing_posts. Generic frontmatter parser,
 * markdown -> HTML, optional FAQ extraction. Does NOT generate a cover (the
 * operator supplies the featured image). Writes to the DB only — no git/deploy.
 *
 * Usage:
 *   node scripts/add_insights_article.js <file.md> --category=<slug> [--status=draft|published]
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
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

const args = process.argv.slice(2)
const file = args.find(a => !a.startsWith('--'))
const get = (k, d) => { const a = args.find(x => x.startsWith(`--${k}=`)); return a ? a.split('=')[1] : d }
const CATEGORY = get('category', 'inside-the-platform')
const STATUS = get('status', 'draft')
if (!file) { console.error('Usage: node scripts/add_insights_article.js <file.md> --category=<slug> [--status=]'); process.exit(1) }

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
const stripLeadingH1 = md => md.replace(/^\s*#\s+.+\n/, '')
const stripAgency = md => md
  .replace(/\s*at\s*Wine\s*(?:and|&)\s*Wellness\s*Travel/gi, '')
  .replace(/,?\s*Wine\s*(?:and|&)\s*Wellness\s*Travel,?/gi, '')
  .replace(/,?\s*Montecito Village Travel/gi, '')
function extractFaq(md) {
  const idx = md.search(/\n##\s+Frequently Asked Questions/i)
  if (idx === -1) return { body: md, faq: [] }
  const body = md.slice(0, idx)
  let block = md.slice(idx).replace(/\n---\s*\n[\s\S]*$/, '')
  const faq = []; let q = null, a = []
  for (const line of block.split('\n')) {
    const qm = line.match(/^\*\*(.+?)\*\*\s*$/)
    if (qm) { if (q) faq.push({ q, a: a.join(' ').trim() }); q = qm[1].trim(); a = [] }
    else if (q && line.trim()) a.push(line.trim())
  }
  if (q) faq.push({ q, a: a.join(' ').trim() })
  return { body, faq }
}
const wordCount = s => { const t = s.replace(/<[^>]+>/g, ' ').replace(/[#*|>_-]/g, ' ').replace(/\s+/g, ' ').trim(); return t ? t.split(' ').length : 0 }

async function main() {
  const { marked } = await import('marked')
  marked.setOptions({ gfm: true, breaks: false })

  const raw = fs.readFileSync(path.resolve(file), 'utf8')
  const { fm, body: rawBody } = parseFrontmatter(raw)
  const { body: noFaq, faq } = extractFaq(stripAgency(rawBody))
  const md = stripLeadingH1(noFaq).trim()
  const html = marked.parse(md)

  const { data: cat } = await supabase.from('marketing_categories').select('id,label').eq('slug', CATEGORY).maybeSingle()
  if (!cat) { console.error(`❌ category "${CATEGORY}" not found`); process.exit(1) }

  const row = {
    slug: fm.slug,
    title: fm.title,
    status: STATUS,
    excerpt: fm.meta_description ?? null,
    body_html: html,
    seo_title: fm.meta_title ?? null,
    seo_description: fm.meta_description ?? null,
    category_id: cat.id,
    author_name: 'Nick Cabugos',
    author_credentials: 'Founder of Elite Advisor Hub',
    faq,
    read_minutes: Math.max(1, Math.round(wordCount(md) / 225)),
    featured: false,
    cover_image_url: null,   // operator supplies the featured image
    og_image_url: null,
    published_at: fm.date ? new Date(fm.date + 'T09:00:00Z').toISOString() : new Date().toISOString(),
  }
  if (/wine\s*(and|&)\s*wellness|montecito/i.test(html)) console.warn('⚠️  residual agency reference — review')
  const { error } = await supabase.from('marketing_posts').upsert(row, { onConflict: 'slug' })
  if (error) { console.error('❌', error.message); process.exit(1) }
  console.log(`✓ ${STATUS}  "${fm.title}"  [${cat.label}, ${faq.length} FAQs, ${row.read_minutes}min, cover=none (you add it)]`)
}
main()
