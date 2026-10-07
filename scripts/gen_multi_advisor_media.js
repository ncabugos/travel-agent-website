#!/usr/bin/env node
/**
 * gen_multi_advisor_media.js
 * Media for the Insights post "multi-advisor-travel-agency-website":
 *   - cover (1200x630, same style as gen_insights_covers.js)
 *   - cropped demo screenshots (Lido Collective directory + profile)
 *   - a three-brand comparison of one catalog record (Belmond Bellini Club)
 *   - two animated WebP diagrams: network update, and lead routing
 *
 * Input: raw 2x screenshots in <shots dir> (headless Chrome, 1440x900 @2x).
 * Output: <out dir>/*.webp|png. Uploading is a separate step.
 *
 * Run: node scripts/gen_multi_advisor_media.js <shots dir> <out dir>
 */
const fs = require('fs')
const path = require('path')
const { execFileSync } = require('child_process')
const sharp = require('sharp')
const { createCanvas, GlobalFonts } = require('@napi-rs/canvas')

const [SHOTS, OUT] = process.argv.slice(2)
if (!SHOTS || !OUT) { console.error('Usage: node scripts/gen_multi_advisor_media.js <shots dir> <out dir>'); process.exit(1) }
fs.mkdirSync(OUT, { recursive: true })

for (const [p, name] of [
  ['/System/Library/Fonts/Supplemental/Georgia.ttf', 'Georgia'],
  ['/System/Library/Fonts/Supplemental/Arial.ttf', 'Arial'],
  ['/System/Library/Fonts/Supplemental/Arial Bold.ttf', 'ArialBold'],
]) { try { if (fs.existsSync(p)) GlobalFonts.registerFromPath(p, name) } catch {} }
const SERIF = 'Georgia', SANS = 'Arial', SANS_B = 'ArialBold'

const CHARCOAL = '#1A1715', CREAM = '#FAFAF5', GOLD = '#B49A5A', PURPLE = '#7C3AED'
const DIVIDER = '#E8E4DC', MUTED = '#8A8279', MUTED_DARK = '#5F5850'

/* ── helpers ─────────────────────────────────────────────────────────────── */
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath()
}
function spaced(ctx, text, x, y, gap) {
  let cx = x
  for (const ch of text) { ctx.fillText(ch, cx, y); cx += ctx.measureText(ch).width + gap }
  return cx
}
function spacedWidth(ctx, text, gap) { let w = 0; for (const ch of text) w += ctx.measureText(ch).width + gap; return w - gap }
function centerSpaced(ctx, text, cx, y, gap) { spaced(ctx, text, cx - spacedWidth(ctx, text, gap) / 2, y, gap) }
const clamp = (v) => Math.max(0, Math.min(1, v))
const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)
// 0 before a, ramps to 1 by b
const ramp = (t, a, b) => ease(clamp((t - a) / (b - a)))

/* ── 1. cover ────────────────────────────────────────────────────────────── */
function cover() {
  const W = 1200, H = 630, M = 84
  const c = createCanvas(W, H), ctx = c.getContext('2d')
  const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, CHARCOAL); g.addColorStop(1, '#272019')
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H)

  // Network motif on the right: one source, three sites
  const src = { x: 960, y: 190 }
  const sites = [{ x: 860, y: 430 }, { x: 960, y: 470 }, { x: 1060, y: 430 }]
  ctx.strokeStyle = 'rgba(180,154,90,0.55)'; ctx.lineWidth = 1.5
  for (const s of sites) { ctx.beginPath(); ctx.moveTo(src.x, src.y + 22); ctx.lineTo(s.x, s.y - 22); ctx.stroke() }
  ctx.fillStyle = GOLD; ctx.beginPath(); ctx.arc(src.x, src.y, 22, 0, Math.PI * 2); ctx.fill()
  for (const s of sites) {
    ctx.strokeStyle = 'rgba(250,250,245,0.8)'; ctx.lineWidth = 1.5
    roundRect(ctx, s.x - 30, s.y - 22, 60, 44, 4); ctx.stroke()
    ctx.fillStyle = 'rgba(250,250,245,0.8)'; ctx.fillRect(s.x - 20, s.y - 12, 40, 3)
  }

  ctx.fillStyle = CREAM; ctx.font = `46px ${SERIF}`
  const lines = ['One Website for a', 'Multi-Advisor Travel', 'Agency']
  let y = 200
  for (const ln of lines) { ctx.fillText(ln, M, y); y += 60 }
  ctx.strokeStyle = GOLD; ctx.lineWidth = 3
  ctx.beginPath(); ctx.moveTo(M, y - 14); ctx.lineTo(M + 72, y - 14); ctx.stroke()
  ctx.fillStyle = 'rgba(250,250,245,0.7)'; ctx.font = `20px ${SANS}`
  ctx.fillText('One brand or many. One source of truth.', M, y + 26)

  ctx.font = `600 16px ${SANS}`; ctx.fillStyle = 'rgba(250,247,240,0.55)'
  spaced(ctx, 'THE LUXURY TRAVEL BUSINESS', M, H - 70, 2)
  ctx.fillStyle = GOLD
  spaced(ctx, 'ELITEADVISORHUB.COM', W - M - spacedWidth(ctx, 'ELITEADVISORHUB.COM', 2), H - 70, 2)
  return c.toBuffer('image/png')
}

/* ── 2. screenshots ──────────────────────────────────────────────────────── */
// Raw shots are 2880x1800. Top 80px is the demo banner; the dev badge sits
// near the bottom-left, below y=1640.
async function crop(name, top, bottom, outName, width = 1600) {
  await sharp(path.join(SHOTS, `${name}.png`))
    .extract({ left: 0, top, width: 2880, height: bottom - top })
    .resize({ width })
    .webp({ quality: 82 })
    .toFile(path.join(OUT, outName))
}

async function triptych() {
  // Stacked, one brand per row, so each stays legible at article column width.
  const panels = [
    ['cc-belmond', 'Coast & Compass Travel'],
    ['t3-belmond', 'Meridian Travel'],
    ['cs-belmond', 'Casa Solis'],
  ]
  const SRC_TOP = 80, SRC_H = 1140 // banner off; hero only (Meridian's hero is the shortest)
  const PW = 1520, PH = Math.round(PW * (SRC_H / 2880))
  const PAD = 40, LABEL = 52, GAP = 28
  const W = PAD * 2 + PW, H = PAD + panels.length * (LABEL + PH) + (panels.length - 1) * GAP + PAD
  const composites = []
  const lc = createCanvas(W, H), ctx = lc.getContext('2d')
  ctx.fillStyle = CHARCOAL; ctx.font = `600 22px ${SANS}`
  for (let i = 0; i < panels.length; i++) {
    const top = PAD + i * (LABEL + PH + GAP)
    spaced(ctx, panels[i][1].toUpperCase(), PAD, top + 32, 3)
    const buf = await sharp(path.join(SHOTS, `${panels[i][0]}.png`))
      .extract({ left: 0, top: SRC_TOP, width: 2880, height: SRC_H }).resize({ width: PW, height: PH }).png().toBuffer()
    composites.push({ input: buf, left: PAD, top: top + LABEL })
  }
  composites.push({ input: lc.toBuffer('image/png'), left: 0, top: 0 })
  await sharp({ create: { width: W, height: H, channels: 4, background: CREAM } })
    .composite(composites).webp({ quality: 80 }).toFile(path.join(OUT, 'one-record-three-brands.webp'))
}

/* ── 3. animation: one source, every advisor site ────────────────────────── */
const AW = 1440, AH = 810

const BRANDS = [
  { name: 'Coast & Compass Travel', head: '#1F3347', font: SERIF, accent: '#C9A86A' },
  { name: 'Meridian Travel', head: '#2B2B2B', font: SANS, accent: '#B07A4F' },
  { name: 'Casa Solis', head: '#8C4A32', font: SERIF, accent: '#E2C9A0' },
]

function siteCard(ctx, x, y, w, h, brand, state) {
  // card
  ctx.fillStyle = '#FFFFFF'; roundRect(ctx, x, y, w, h, 10); ctx.fill()
  ctx.strokeStyle = DIVIDER; ctx.lineWidth = 1.5; roundRect(ctx, x, y, w, h, 10); ctx.stroke()
  // browser bar with own-domain pill
  ctx.fillStyle = '#F1EFEA'; roundRect(ctx, x, y, w, 34, 10); ctx.fill(); ctx.fillRect(x, y + 20, w, 14)
  for (let i = 0; i < 3; i++) { ctx.fillStyle = '#D6D1C7'; ctx.beginPath(); ctx.arc(x + 18 + i * 14, y + 17, 4, 0, Math.PI * 2); ctx.fill() }
  ctx.fillStyle = '#FFFFFF'; roundRect(ctx, x + 70, y + 8, w - 90, 18, 9); ctx.fill()
  ctx.fillStyle = MUTED; ctx.font = `12px ${SANS}`; ctx.fillText('Own domain', x + 82, y + 21)
  // brand header
  ctx.fillStyle = brand.head; ctx.fillRect(x, y + 34, w, 64)
  ctx.fillStyle = '#FFFFFF'; ctx.font = `22px ${brand.font}`
  ctx.fillText(brand.name, x + 20, y + 74)
  // rows
  const rows = [
    { label: 'Belmond Bellini Club', sub: state.benefitUpdated ? 'Benefit updated' : 'Upgrade, breakfast, credit', flash: state.benefitFlash, done: state.benefitUpdated },
    { label: 'Journal', sub: state.articleNew ? 'New: Venice in winter' : 'Latest articles', flash: state.articleFlash, done: state.articleNew },
    { label: 'Advisor profile', sub: 'Own bio and specialties', flash: 0, done: false },
  ]
  rows.forEach((r, i) => {
    const ry = y + 116 + i * 70
    if (r.flash > 0) { ctx.fillStyle = `rgba(124,58,237,${0.12 * r.flash})`; roundRect(ctx, x + 12, ry - 8, w - 24, 60, 8); ctx.fill() }
    ctx.fillStyle = brand.accent; ctx.fillRect(x + 20, ry, 4, 44)
    ctx.fillStyle = CHARCOAL; ctx.font = `16px ${brand.font}`; ctx.fillText(r.label, x + 36, ry + 18)
    ctx.fillStyle = r.done ? PURPLE : MUTED_DARK; ctx.font = `14px ${SANS}`; ctx.fillText(r.sub, x + 36, ry + 40)
    if (r.done) {
      ctx.strokeStyle = PURPLE; ctx.lineWidth = 2.5
      ctx.beginPath(); ctx.moveTo(x + w - 44, ry + 22); ctx.lineTo(x + w - 37, ry + 29); ctx.lineTo(x + w - 24, ry + 14); ctx.stroke()
    }
  })
}

function sourceBox(ctx, x, y, w, h, title, sub, glow) {
  if (glow > 0) { ctx.fillStyle = `rgba(180,154,90,${0.25 * glow})`; roundRect(ctx, x - 8, y - 8, w + 16, h + 16, 14); ctx.fill() }
  ctx.fillStyle = CHARCOAL; roundRect(ctx, x, y, w, h, 10); ctx.fill()
  ctx.fillStyle = GOLD; ctx.fillRect(x + 24, y + 22, 36, 3)
  ctx.fillStyle = CREAM; ctx.font = `22px ${SERIF}`; ctx.fillText(title, x + 24, y + 56)
  ctx.fillStyle = 'rgba(250,250,245,0.7)'; ctx.font = `14px ${SANS}`; ctx.fillText(sub, x + 24, y + 80)
}

function networkFrame(t) { // t in seconds, loop length 10s
  const c = createCanvas(AW, AH), ctx = c.getContext('2d')
  ctx.fillStyle = CREAM; ctx.fillRect(0, 0, AW, AH)

  const cat = { x: 300, y: 60, w: 360, h: 104 }
  const edi = { x: 780, y: 60, w: 360, h: 104 }
  const cardW = 400, cardH = 340, cardY = 400, gap = 40
  const cardX = (i) => (AW - (cardW * 3 + gap * 2)) / 2 + i * (cardW + gap)

  // phases
  const catGlow = ramp(t, 0.8, 1.2) * (1 - ramp(t, 3.6, 4.2))
  const catTravel = ramp(t, 1.2, 2.8)
  const catDone = t >= 2.8
  const ediGlow = ramp(t, 4.6, 5.0) * (1 - ramp(t, 7.4, 8.0))
  const ediTravel = ramp(t, 5.0, 6.6)
  const ediDone = t >= 6.6
  const reset = t >= 9.4

  sourceBox(ctx, cat.x, cat.y, cat.w, cat.h, 'Shared catalog', catGlow > 0.5 ? 'Bellini Club benefit changed' : 'Hotels, programs, cruise lines', catGlow)
  sourceBox(ctx, edi.x, edi.y, edi.w, edi.h, 'Shared editorial', ediGlow > 0.5 ? 'New article published' : 'Articles by category', ediGlow)

  // connectors
  const lines = []
  for (let i = 0; i < 3; i++) {
    const end = { x: cardX(i) + cardW / 2, y: cardY }
    lines.push({ from: { x: cat.x + cat.w / 2, y: cat.y + cat.h }, to: end, p: catTravel, on: catTravel > 0 && catTravel < 1 })
    lines.push({ from: { x: edi.x + edi.w / 2, y: edi.y + edi.h }, to: end, p: ediTravel, on: ediTravel > 0 && ediTravel < 1 })
  }
  for (const l of lines) {
    ctx.strokeStyle = DIVIDER; ctx.lineWidth = 2
    ctx.beginPath(); ctx.moveTo(l.from.x, l.from.y)
    ctx.bezierCurveTo(l.from.x, l.from.y + 120, l.to.x, l.to.y - 120, l.to.x, l.to.y); ctx.stroke()
    if (l.on) {
      const p = l.p, q = 1 - p
      const bx = q ** 3 * l.from.x + 3 * q * q * p * l.from.x + 3 * q * p * p * l.to.x + p ** 3 * l.to.x
      const by = q ** 3 * l.from.y + 3 * q * q * p * (l.from.y + 120) + 3 * q * p * p * (l.to.y - 120) + p ** 3 * l.to.y
      ctx.fillStyle = PURPLE; ctx.beginPath(); ctx.arc(bx, by, 8, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = 'rgba(124,58,237,0.2)'; ctx.beginPath(); ctx.arc(bx, by, 16, 0, Math.PI * 2); ctx.fill()
    }
  }

  BRANDS.forEach((b, i) => siteCard(ctx, cardX(i), cardY, cardW, cardH, b, {
    benefitUpdated: catDone && !reset,
    benefitFlash: catDone ? 1 - ramp(t, 2.8, 3.8) : 0,
    articleNew: ediDone && !reset,
    articleFlash: ediDone ? 1 - ramp(t, 6.6, 7.6) : 0,
  }))

  // caption strip
  ctx.fillStyle = MUTED_DARK; ctx.font = `600 13px ${SANS}`
  const cap = t < 4.4 ? 'ONE CATALOG UPDATE REACHES EVERY ADVISOR SITE' : 'ONE ARTICLE REACHES EVERY SITE THAT CARRIES ITS CATEGORY'
  centerSpaced(ctx, cap, AW / 2, 784, 2)
  return c
}

/* ── 4. animation: inquiries reach the advisor the client chose ──────────── */
function routingFrame(t) { // loop 8s
  const c = createCanvas(AW, AH), ctx = c.getContext('2d')
  ctx.fillStyle = CREAM; ctx.fillRect(0, 0, AW, AH)

  const advisors = ['Europe specialist', 'Asia-Pacific specialist', 'Cruise specialist']
  const rowY = (i) => 150 + i * 200
  const pageX = 120, pageW = 380, inboxX = 940, inboxW = 380, boxH = 140
  const chosen = 1

  // agency overview box
  const ag = { x: 560, y: 650, w: 320, h: 100 }

  const click = ramp(t, 0.6, 1.0)
  const travel = ramp(t, 1.2, 3.2)
  const arrived = t >= 3.2
  const copy = ramp(t, 3.4, 4.6)
  const reset = t >= 7.4

  ctx.fillStyle = MUTED_DARK; ctx.font = `600 13px ${SANS}`
  centerSpaced(ctx, 'ADVISOR PROFILE PAGES', pageX + pageW / 2, 100, 2)
  centerSpaced(ctx, 'ADVISOR INBOXES', inboxX + inboxW / 2, 100, 2)

  advisors.forEach((a, i) => {
    const y = rowY(i)
    // profile page
    const active = i === chosen && click > 0 && !reset
    ctx.fillStyle = '#FFFFFF'; roundRect(ctx, pageX, y, pageW, boxH, 10); ctx.fill()
    ctx.strokeStyle = active ? PURPLE : DIVIDER; ctx.lineWidth = active ? 2.5 : 1.5; roundRect(ctx, pageX, y, pageW, boxH, 10); ctx.stroke()
    ctx.fillStyle = '#D9D3C8'; ctx.beginPath(); ctx.arc(pageX + 50, y + 54, 28, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = CHARCOAL; ctx.font = `20px ${SERIF}`; ctx.fillText(a, pageX + 96, y + 50)
    ctx.fillStyle = MUTED; ctx.font = `13px ${SANS}`; ctx.fillText('Bio, destinations, inquiry form', pageX + 96, y + 74)
    ctx.fillStyle = active ? PURPLE : CHARCOAL; roundRect(ctx, pageX + 96, y + 92, 150, 30, 4); ctx.fill()
    ctx.fillStyle = '#FFFFFF'; ctx.font = `600 12px ${SANS}`; spaced(ctx, 'SEND INQUIRY', pageX + 116, y + 112, 1.5)

    // inbox
    const got = i === chosen && arrived && !reset
    ctx.fillStyle = '#FFFFFF'; roundRect(ctx, inboxX, y, inboxW, boxH, 10); ctx.fill()
    ctx.strokeStyle = got ? PURPLE : DIVIDER; ctx.lineWidth = got ? 2.5 : 1.5; roundRect(ctx, inboxX, y, inboxW, boxH, 10); ctx.stroke()
    ctx.fillStyle = CHARCOAL; ctx.font = `20px ${SERIF}`; ctx.fillText(a, inboxX + 28, y + 50)
    ctx.fillStyle = got ? PURPLE : MUTED; ctx.font = `14px ${SANS}`
    ctx.fillText(got ? '1 new inquiry, sent from your page' : 'No new inquiries', inboxX + 28, y + 80)
  })

  // envelope travel
  if (travel > 0 && !arrived) {
    const y = rowY(chosen) + boxH / 2
    const x = pageX + pageW + (inboxX - pageX - pageW) * travel
    envelope(ctx, x - 22, y - 15)
  }

  // agency overview
  ctx.fillStyle = CHARCOAL; roundRect(ctx, ag.x, ag.y, ag.w, ag.h, 10); ctx.fill()
  ctx.fillStyle = GOLD; ctx.fillRect(ag.x + 24, ag.y + 22, 36, 3)
  ctx.fillStyle = CREAM; ctx.font = `20px ${SERIF}`; ctx.fillText('Agency overview', ag.x + 24, ag.y + 56)
  ctx.fillStyle = 'rgba(250,250,245,0.75)'; ctx.font = `14px ${SANS}`
  ctx.fillText(copy >= 1 && !reset ? 'Every inquiry, visible in one place' : 'All advisors, all inquiries', ag.x + 24, ag.y + 80)
  if (copy > 0 && copy < 1 && !reset) {
    const sx = inboxX + inboxW / 2, sy = rowY(chosen) + boxH, ex = ag.x + ag.w / 2, ey = ag.y
    ctx.strokeStyle = 'rgba(180,154,90,0.6)'; ctx.setLineDash([6, 6]); ctx.lineWidth = 2
    ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.stroke(); ctx.setLineDash([])
    ctx.fillStyle = GOLD; ctx.beginPath(); ctx.arc(sx + (ex - sx) * copy, sy + (ey - sy) * copy, 7, 0, Math.PI * 2); ctx.fill()
  }
  return c
}

function envelope(ctx, x, y) {
  ctx.fillStyle = PURPLE; roundRect(ctx, x, y, 44, 30, 4); ctx.fill()
  ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 2
  ctx.beginPath(); ctx.moveTo(x + 4, y + 5); ctx.lineTo(x + 22, y + 18); ctx.lineTo(x + 40, y + 5); ctx.stroke()
}

function animate(name, frameFn, seconds, fps = 15) {
  const dir = path.join(OUT, `_frames_${name}`)
  fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir)
  const n = Math.round(seconds * fps), files = []
  for (let i = 0; i < n; i++) {
    const f = path.join(dir, `${String(i).padStart(4, '0')}.png`)
    fs.writeFileSync(f, frameFn(i / fps).toBuffer('image/png')); files.push(f)
  }
  const out = path.join(OUT, `${name}.webp`)
  execFileSync('img2webp', ['-loop', '0', '-lossy', '-q', '80', '-d', String(Math.round(1000 / fps)), ...files, '-o', out], { stdio: 'pipe' })
  fs.writeFileSync(path.join(OUT, `${name}-poster.png`), frameFn(seconds * 0.8).toBuffer('image/png'))
  fs.rmSync(dir, { recursive: true, force: true })
}

async function main() {
  fs.writeFileSync(path.join(OUT, 'cover.png'), cover())
  await crop('lido-advisors', 80, 1640, 'agency-advisor-directory.webp')
  await crop('lido-profile', 80, 1640, 'agency-advisor-profile.webp')
  await triptych()
  animate('one-source-every-site', networkFrame, 10)
  animate('inquiry-routing', routingFrame, 8)
  for (const f of fs.readdirSync(OUT)) console.log(`${f}  ${(fs.statSync(path.join(OUT, f)).size / 1024).toFixed(0)} KB`)
}
main()
