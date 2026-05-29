/**
 * One-off: derive a white-on-transparent version of the Lido Collective logo.
 *
 * The supplied logo is dark artwork on a solid white background, so a CSS
 * `invert()` produces a black box on the navy nav. This bakes a proper
 * transparent asset by mapping each pixel's inverted luminance to alpha and
 * forcing the color to white — giving a crisp white logo that drops cleanly
 * onto any background. Run: `node scripts/make-lido-white-logo.cjs`
 */
const sharp = require('sharp')
const path = require('path')

const DIR = path.join(__dirname, '..', 'public', 'demos', 'the-lido-collective')
const SRC = path.join(DIR, 'lido-collective-logo.png')
const OUT = path.join(DIR, 'lido-collective-logo-white.png')

;(async () => {
  const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width, height, channels } = info
  const out = Buffer.alloc(width * height * 4)
  for (let i = 0; i < width * height; i++) {
    const r = data[i * channels]
    const g = data[i * channels + 1]
    const b = data[i * channels + 2]
    const a = data[i * channels + 3]
    const lum = 0.299 * r + 0.587 * g + 0.114 * b
    out[i * 4] = 255
    out[i * 4 + 1] = 255
    out[i * 4 + 2] = 255
    out[i * 4 + 3] = Math.round((255 - lum) * (a / 255))
  }
  await sharp(out, { raw: { width, height, channels: 4 } }).png().toFile(OUT)
  console.log('wrote', OUT, `${width}x${height}`)
})().catch((e) => { console.error(e); process.exit(1) })
