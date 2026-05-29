#!/usr/bin/env node
/**
 * Renders the DotGlobe (components/auth/DotGlobe.tsx, grid variant) to a
 * seamless transparent video loop. Mirrors the live Canvas2D math exactly;
 * interactivity is omitted (deterministic output).
 *
 * Usage:  node scripts/export-globe-video.mjs
 * Output: exports/globe-loop-1920x1080.mov  (ProRes 4444, straight alpha)
 */
import { createCanvas } from '@napi-rs/canvas'
import { spawn } from 'node:child_process'
import { mkdir, writeFile, rm } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = path.resolve(__dirname, '..')

// ---- Export config (matches the answers given) ----
const WIDTH = 1920
const HEIGHT = 1080
const FPS = 30
const DURATION_S = 15
const FRAME_COUNT = FPS * DURATION_S        // 450 frames = one exact loop
const ROTATION_SECONDS = DURATION_S         // one full 360° per loop

// ---- DotGlobe defaults (grid variant) ----
const LATITUDE_LINES = 13
const LONGITUDE_LINES = 24
const DOT_SPACING_DEG = 4
const COLOR = '#ffffff'
const MAX_DOT_RADIUS = 1.6
const SPHERE_SCALE = 0.6
const CENTER_X = 0.5
const CENTER_Y = 0.5
const TILT = 0.22

// Build the grid point cloud on the unit sphere (parallels + meridians).
function buildGridPoints() {
  const DEG = Math.PI / 180
  const spacing = DOT_SPACING_DEG * DEG
  const raw = []

  // Parallels (latitude circles, excluding poles)
  const latStep = 180 / (LATITUDE_LINES + 1)
  for (let li = 1; li <= LATITUDE_LINES; li++) {
    const lat = (-90 + li * latStep) * DEG
    const ringR = Math.cos(lat)
    const y = Math.sin(lat)
    const n = Math.max(6, Math.round((2 * Math.PI * ringR) / spacing))
    for (let k = 0; k < n; k++) {
      const lon = (k / n) * 2 * Math.PI
      raw.push(Math.cos(lon) * ringR, y, Math.sin(lon) * ringR)
    }
  }

  // Meridians (pole-to-pole arcs, skipping exact poles)
  const arcSteps = Math.round(Math.PI / spacing)
  for (let mi = 0; mi < LONGITUDE_LINES; mi++) {
    const lon = (mi / LONGITUDE_LINES) * 2 * Math.PI
    const cosLon = Math.cos(lon)
    const sinLon = Math.sin(lon)
    for (let k = 1; k < arcSteps; k++) {
      const lat = -Math.PI / 2 + (k / arcSteps) * Math.PI
      const ringR = Math.cos(lat)
      const y = Math.sin(lat)
      raw.push(cosLon * ringR, y, sinLon * ringR)
    }
  }

  return new Float32Array(raw)
}

function renderFrame(ctx, points, angle) {
  const dotCount = points.length / 3
  ctx.clearRect(0, 0, WIDTH, HEIGHT)

  const cx = WIDTH * CENTER_X
  const cy = HEIGHT * CENTER_Y
  const sphereRadius = Math.min(WIDTH, HEIGHT) * SPHERE_SCALE
  const sinA = Math.sin(angle)
  const cosA = Math.cos(angle)
  const tiltSin = Math.sin(TILT)
  const tiltCos = Math.cos(TILT)

  ctx.fillStyle = COLOR
  for (let i = 0; i < dotCount; i++) {
    const px = points[i * 3]
    const py = points[i * 3 + 1]
    const pz = points[i * 3 + 2]

    // Rotate around Y, then apply tilt (rotation around X)
    const xr = px * cosA + pz * sinA
    const zr = -px * sinA + pz * cosA
    const yr = py * tiltCos - zr * tiltSin
    const zFinal = py * tiltSin + zr * tiltCos

    const sx = cx + xr * sphereRadius
    const sy = cy + yr * sphereRadius

    // Depth 0 (back) → 1 (front). Grid variant: opacity carries most depth.
    const depth = (zFinal + 1) * 0.5
    const sizeFactor = Math.pow(depth, 0.4) * 0.4 + 0.6
    const opacity = depth * 0.44 + 0.256
    const radius = MAX_DOT_RADIUS * sizeFactor

    ctx.globalAlpha = opacity
    ctx.beginPath()
    ctx.arc(sx, sy, radius, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1
}

async function main() {
  const framesDir = path.join(REPO_ROOT, 'exports', '_globe-frames')
  const outDir = path.join(REPO_ROOT, 'exports')
  const outPath = path.join(outDir, `globe-loop-${WIDTH}x${HEIGHT}.mov`)

  await mkdir(framesDir, { recursive: true })
  await mkdir(outDir, { recursive: true })

  const canvas = createCanvas(WIDTH, HEIGHT)
  const ctx = canvas.getContext('2d')
  const points = buildGridPoints()

  process.stdout.write(`Rendering ${FRAME_COUNT} frames @ ${WIDTH}x${HEIGHT}…\n`)
  for (let f = 0; f < FRAME_COUNT; f++) {
    const angle = (f / FRAME_COUNT) * Math.PI * 2
    renderFrame(ctx, points, angle)
    const png = await canvas.encode('png')
    await writeFile(path.join(framesDir, `frame_${String(f).padStart(5, '0')}.png`), png)
    if ((f + 1) % 30 === 0 || f === FRAME_COUNT - 1) {
      process.stdout.write(`  ${f + 1}/${FRAME_COUNT}\n`)
    }
  }

  process.stdout.write(`Encoding ProRes 4444 with alpha → ${path.relative(REPO_ROOT, outPath)}\n`)
  await new Promise((resolve, reject) => {
    const ff = spawn(
      'ffmpeg',
      [
        '-y',
        '-framerate', String(FPS),
        '-i', path.join(framesDir, 'frame_%05d.png'),
        '-c:v', 'prores_ks',
        '-profile:v', '4',           // 4 = ProRes 4444
        '-pix_fmt', 'yuva444p10le',  // 10-bit with alpha
        '-vendor', 'apl0',
        '-alpha_bits', '16',
        outPath,
      ],
      { stdio: ['ignore', 'inherit', 'inherit'] },
    )
    ff.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exit ${code}`))))
  })

  // Clean up the PNG frames — keep only the final .mov.
  if (existsSync(framesDir)) await rm(framesDir, { recursive: true, force: true })

  process.stdout.write(`\n✓ ${path.relative(REPO_ROOT, outPath)}\n`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
