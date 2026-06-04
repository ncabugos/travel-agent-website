#!/usr/bin/env node
/**
 * gen_insights_covers.js
 * Generates branded 1200x630 featured/OG cover images for the Insights posts and
 * sets cover_image_url + og_image_url on each. On-brand typographic covers
 * (charcoal / cream / gold per the EAH style guide) — no stock photography.
 *
 * Run: node scripts/gen_insights_covers.js
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

// Register macOS system fonts (this environment is darwin).
const FONTS = [
  ['/System/Library/Fonts/Supplemental/Georgia.ttf', 'Georgia'],
  ['/System/Library/Fonts/Supplemental/Georgia Bold.ttf', 'GeorgiaBold'],
  ['/System/Library/Fonts/Supplemental/Arial.ttf', 'Arial'],
]
for (const [p, name] of FONTS) { try { if (fs.existsSync(p)) GlobalFonts.registerFromPath(p, name) } catch {} }
const SERIF = GlobalFonts.has?.('Georgia') ? 'Georgia' : 'serif'
const SANS = GlobalFonts.has?.('Arial') ? 'Arial' : 'sans-serif'

const W = 1200, H = 630
const CHARCOAL = '#1A1715', CHARCOAL2 = '#272019', CREAM = '#FAF7F0', GOLD = '#B49A5A'
const MUTED = 'rgba(250,247,240,0.55)'

const POSTS = [
  { slug: 'first-impression-you-never-get-to-make', title: 'The First Impression You Never Get to Make' },
  { slug: 'travel-agent-website-cost', title: 'How Much Does a Travel Agent Website Cost in 2026?' },
  { slug: 'what-a-travel-advisor-website-needs', title: 'What a Luxury Travel Advisor Website Actually Needs' },
]
const PILLAR = "The Advisor's Digital Presence"

function spaced(ctx, text, x, y, gap) {
  let cx = x
  for (const ch of text) { ctx.fillText(ch, cx, y); cx += ctx.measureText(ch).width + gap }
  return cx
}

function wrap(ctx, text, maxW) {
  const words = text.split(' ')
  const lines = []; let line = ''
  for (const w of words) {
    const t = line ? line + ' ' + w : w
    if (ctx.measureText(t).width > maxW && line) { lines.push(line); line = w } else line = t
  }
  if (line) lines.push(line)
  return lines
}

function render(post) {
  const c = createCanvas(W, H)
  const ctx = c.getContext('2d')

  // Background gradient
  const g = ctx.createLinearGradient(0, 0, W, H)
  g.addColorStop(0, CHARCOAL); g.addColorStop(1, CHARCOAL2)
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H)

  // Faint gold hairline frame
  ctx.strokeStyle = 'rgba(180,154,90,0.35)'; ctx.lineWidth = 1
  ctx.strokeRect(36.5, 36.5, W - 73, H - 73)

  const M = 80

  // Eyebrow
  ctx.fillStyle = GOLD; ctx.font = `600 20px ${SANS}`; ctx.textBaseline = 'alphabetic'
  const ex = spaced(ctx, 'ELITE ADVISOR HUB', M, 130, 4)
  ctx.fillStyle = MUTED
  spaced(ctx, '   /   INSIGHTS', ex, 130, 4)

  // Title (auto-fit)
  let size = 66
  let lines = []
  for (; size >= 40; size -= 2) {
    ctx.font = `${size}px ${SERIF}`
    lines = wrap(ctx, post.title, W - M * 2)
    if (lines.length <= 3) break
  }
  ctx.fillStyle = CREAM
  const lh = size * 1.16
  let y = 250
  for (const ln of lines) { ctx.fillText(ln, M, y); y += lh }

  // Gold rule
  ctx.strokeStyle = GOLD; ctx.lineWidth = 3
  ctx.beginPath(); ctx.moveTo(M, y + 14); ctx.lineTo(M + 72, y + 14); ctx.stroke()

  // Footer
  ctx.fillStyle = MUTED; ctx.font = `600 17px ${SANS}`
  spaced(ctx, PILLAR.toUpperCase(), M, H - 70, 2)
  ctx.font = `600 16px ${SANS}`
  const url = 'ELITEADVISORHUB.COM'
  // right-aligned
  let uw = 0; for (const ch of url) uw += ctx.measureText(ch).width + 2
  ctx.fillStyle = GOLD; spaced(ctx, url, W - M - uw, H - 70, 2)

  return c.toBuffer('image/png')
}

async function main() {
  const dir = path.join(process.cwd(), 'public/media/insights')
  fs.mkdirSync(dir, { recursive: true })

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

  for (const post of POSTS) {
    const buf = render(post)
    const rel = `/media/insights/${post.slug}.png`
    fs.writeFileSync(path.join(process.cwd(), 'public', rel), buf)
    const { error } = await supabase
      .from('marketing_posts')
      .update({ cover_image_url: rel, og_image_url: rel })
      .eq('slug', post.slug)
    console.log(`${error ? '❌ ' + error.message : '✓'}  ${rel}  (${(buf.length / 1024).toFixed(0)} KB)`)
  }
  console.log('\nDone. Covers generated and linked.')
}

main()
