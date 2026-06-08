#!/usr/bin/env node
/**
 * publish_new_drafts.js
 * Imports the 3 NEW blog-drafts (Squarespace, the pillar Guide, do-you-need-a-website),
 * generates branded covers, and publishes them. Targets ONLY these 3 slugs, so the
 * already-published launch posts are never touched. Idempotent (upsert on slug).
 *
 * Run: node scripts/publish_new_drafts.js
 */
const fs = require('fs')
const path = require('path')
const { createCanvas, GlobalFonts } = require('@napi-rs/canvas')
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

// ── Files to publish (only these) ────────────────────────────────────────────
const DRAFTS_DIR = path.join(process.cwd(), 'marketing/content-strategy/blog-drafts')
const FILES = [
  '2026-06-18-squarespace-for-travel-agents.md',
  '2026-06-22-travel-advisor-website-guide.md',
  '2026-06-25-do-travel-agents-need-a-website.md',
]
const PILLAR_SLUG = { P1: 'digital-presence', P2: 'inside-the-platform', P3: 'proof-and-portfolio', P4: 'founders-desk', P5: 'luxury-travel-business' }
const PILLAR_LABEL = { P1: "The Advisor's Digital Presence", P2: 'Inside the Platform', P3: 'Proof & Portfolio', P4: "Founder's Desk", P5: 'The Luxury Travel Business' }
// Short, punchy titles for the cover art (DB keeps the full title).
const COVER_TITLE = {
  'squarespace-for-travel-agents': 'Squarespace for Travel Agents',
  'travel-advisor-website-guide': 'The Complete Guide to Travel Advisor Websites',
  'do-travel-agents-need-a-website': 'Do Travel Agents Still Need a Website?',
}

// ── Markdown → post transforms (mirrors import_blog_drafts.js) ────────────────
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
function stripAgencyRefs(md) {
  return md
    .replace(/I run a travel practice,\s*Wine\s*(?:and|&)\s*Wellness\s*Travel,\s*affiliated with Montecito Village Travel and the Virtuoso network\./gi,
             'I run a working travel practice within the Virtuoso network.')
    .replace(/,?\s*affiliated with Montecito Village Travel(?: and the Virtuoso network)?/gi, ' working within the Virtuoso network')
    .replace(/\s*at\s*Wine\s*(?:and|&)\s*Wellness\s*Travel/gi, '')
    .replace(/,?\s*Wine\s*(?:and|&)\s*Wellness\s*Travel,?/gi, '')
    .replace(/,?\s*Montecito Village Travel/gi, '')
    .replace(/\(\s*\)/g, '')
    .replace(/ +,/g, ',')
    .replace(/ {2,}/g, ' ')
}
function extractFaqAndTrim(md) {
  const idx = md.search(/\n##\s+Frequently Asked Questions/i)
  let body = md, faqBlock = ''
  if (idx !== -1) { body = md.slice(0, idx); faqBlock = md.slice(idx) }
  body = body.replace(/\n---\s*\n[\s\S]*$/, '\n')
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
const stripLeadingH1 = md => md.replace(/^\s*#\s+.+\n/, '')
const wordCount = s => { const t = s.replace(/<[^>]+>/g, ' ').replace(/[#*|>_-]/g, ' ').replace(/\s+/g, ' ').trim(); return t ? t.split(' ').length : 0 }

// ── Cover rendering (mirrors gen_insights_covers.js) ─────────────────────────
for (const [p, name] of [
  ['/System/Library/Fonts/Supplemental/Georgia.ttf', 'Georgia'],
  ['/System/Library/Fonts/Supplemental/Arial.ttf', 'Arial'],
]) { try { if (fs.existsSync(p)) GlobalFonts.registerFromPath(p, name) } catch {} }
const SERIF = GlobalFonts.has?.('Georgia') ? 'Georgia' : 'serif'
const SANS = GlobalFonts.has?.('Arial') ? 'Arial' : 'sans-serif'
const W = 1200, H = 630, CHARCOAL = '#1A1715', CHARCOAL2 = '#272019', CREAM = '#FAF7F0', GOLD = '#B49A5A', MUTED = 'rgba(250,247,240,0.55)'
function spaced(ctx, text, x, y, gap) { let cx = x; for (const ch of text) { ctx.fillText(ch, cx, y); cx += ctx.measureText(ch).width + gap } return cx }
function wrap(ctx, text, maxW) { const words = text.split(' '); const lines = []; let line = ''; for (const w of words) { const t = line ? line + ' ' + w : w; if (ctx.measureText(t).width > maxW && line) { lines.push(line); line = w } else line = t } if (line) lines.push(line); return lines }
function renderCover(title, pillarLabel) {
  const c = createCanvas(W, H), ctx = c.getContext('2d')
  const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, CHARCOAL); g.addColorStop(1, CHARCOAL2)
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H)
  ctx.strokeStyle = 'rgba(180,154,90,0.35)'; ctx.lineWidth = 1; ctx.strokeRect(36.5, 36.5, W - 73, H - 73)
  const M = 80
  ctx.fillStyle = GOLD; ctx.font = `600 20px ${SANS}`; ctx.textBaseline = 'alphabetic'
  const ex = spaced(ctx, 'ELITE ADVISOR HUB', M, 130, 4); ctx.fillStyle = MUTED; spaced(ctx, '   /   INSIGHTS', ex, 130, 4)
  let size = 66, lines = []
  for (; size >= 40; size -= 2) { ctx.font = `${size}px ${SERIF}`; lines = wrap(ctx, title, W - M * 2); if (lines.length <= 3) break }
  ctx.fillStyle = CREAM; const lh = size * 1.16; let y = 250
  for (const ln of lines) { ctx.fillText(ln, M, y); y += lh }
  ctx.strokeStyle = GOLD; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(M, y + 14); ctx.lineTo(M + 72, y + 14); ctx.stroke()
  ctx.fillStyle = MUTED; ctx.font = `600 17px ${SANS}`; spaced(ctx, pillarLabel.toUpperCase(), M, H - 70, 2)
  ctx.font = `600 16px ${SANS}`; const url = 'ELITEADVISORHUB.COM'; let uw = 0; for (const ch of url) uw += ctx.measureText(ch).width + 2
  ctx.fillStyle = GOLD; spaced(ctx, url, W - M - uw, H - 70, 2)
  return c.toBuffer('image/png')
}

async function main() {
  const { marked } = await import('marked')
  marked.setOptions({ gfm: true, breaks: false })

  const { data: cats } = await supabase.from('marketing_categories').select('id,slug')
  const catId = Object.fromEntries((cats ?? []).map(c => [c.slug, c.id]))
  const coverDir = path.join(process.cwd(), 'public/media/insights')
  fs.mkdirSync(coverDir, { recursive: true })

  for (const file of FILES) {
    const raw = fs.readFileSync(path.join(DRAFTS_DIR, file), 'utf8')
    const { fm } = parseFrontmatter(raw)
    const { fm: _fm, body: rawBody } = parseFrontmatter(raw)
    const cleaned = stripAgencyRefs(rawBody)
    const { body: bodyNoFaq, faq } = extractFaqAndTrim(cleaned)
    const md = stripLeadingH1(bodyNoFaq).trim()
    const html = marked.parse(md)

    if (/wine\s*(and|&)\s*wellness|montecito/i.test(html + JSON.stringify(faq))) {
      console.warn(`⚠️   ${fm.slug}: residual agency reference — review manually.`)
    }

    const pillar = fm.pillar || 'P1'
    const categoryId = catId[PILLAR_SLUG[pillar]] ?? null

    // Cover
    const buf = renderCover(COVER_TITLE[fm.slug] || fm.title, PILLAR_LABEL[pillar])
    const rel = `/media/insights/${fm.slug}.png`
    fs.writeFileSync(path.join(coverDir, `${fm.slug}.png`), buf)

    const row = {
      slug: fm.slug,
      title: fm.title,
      status: 'published',
      excerpt: fm.meta_description ?? null,
      body_html: html,
      seo_title: fm.meta_title ?? null,
      seo_description: fm.meta_description ?? null,
      category_id: categoryId,
      author_name: 'Nick Cabugos',
      author_credentials: 'Founder of Elite Advisor Hub',
      faq,
      read_minutes: Math.max(1, Math.round(wordCount(md) / 225)),
      featured: false,
      cover_image_url: rel,
      og_image_url: rel,
      published_at: fm.publish_date ? new Date(fm.publish_date + 'T09:00:00Z').toISOString() : new Date().toISOString(),
    }
    const { error } = await supabase.from('marketing_posts').upsert(row, { onConflict: 'slug' })
    console.log(`${error ? '❌ ' + error.message : '✓ published'}  ${fm.title}  [${pillar} → ${PILLAR_SLUG[pillar]}, ${faq.length} FAQs, ${row.read_minutes}min]  cover=${(buf.length / 1024).toFixed(0)}KB`)
  }
  console.log('\nDone. 3 new articles published with covers.')
}
main()
