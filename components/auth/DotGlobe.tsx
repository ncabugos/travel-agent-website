'use client'
/**
 * DotGlobe — slow-rotating wireframe globe rendered to a Canvas2D.
 *
 * Dots are placed along meridians (longitude lines) and parallels (latitude
 * circles), so the sphere reads instantly as a real 3D globe. Each dot's
 * radius and opacity are modulated by z-depth: the front hemisphere is bright
 * and crisp while the back lines show through faintly, giving the see-through
 * wireframe look.
 *
 * Pointer near the canvas? Dots get an impulse along the radial vector and
 * drift back over ~1s (see trailDecay), leaving a subtle trail along the
 * cursor's path. The effect is intentionally restrained.
 *
 * Respects prefers-reduced-motion (rotation pauses, interaction stays).
 */
import { useEffect, useRef } from 'react'
import { LAND_MASK_B64, LAND_MASK_COLS, LAND_MASK_ROWS } from './land-mask'

export interface DotGlobeProps {
  /** 'grid' = lat/long wireframe. 'sphere' = even dotted ball. 'continents' =
   *  dots arranged into Earth's landmasses. Default 'grid'. */
  variant?: 'grid' | 'sphere' | 'continents'
  /** Number of latitude circles (parallels), excluding the poles. Default 13. */
  latitudeLines?: number
  /** Number of longitude lines (meridians) around the globe. Default 24. */
  longitudeLines?: number
  /** Spacing between dots along each line, in degrees. Default 4. */
  dotSpacingDeg?: number
  /** Dot count for the 'sphere' variant (ignored by 'grid'). Default 2400. */
  sphereDots?: number
  /** Candidate samples for 'continents'; ~⅓ land up as dots. Default 16000. */
  continentSamples?: number
  /** Dot color. Default white. */
  color?: string
  /** Seconds for one full rotation. Default 110 (very slow). */
  rotationSeconds?: number
  /** Max dot radius in px. Dots scale down toward silhouette. Default 1.4. */
  maxDotRadius?: number
  /** Sphere radius as a fraction of min(width, height). Default 0.6. */
  sphereScale?: number
  /** Horizontal center as fraction of canvas width. Default 0.5. */
  centerX?: number
  /** Vertical center as fraction of canvas height. Default 0.5. */
  centerY?: number
  /** Whether front-facing dots subtly repel from the pointer. Default true. */
  interactive?: boolean
  /** Pointer repulsion radius in px. Default 110. */
  repulsionRadius?: number
  /** Per-frame impulse strength; combines with trailDecay to set the
   *  steady-state displacement. Default 0.4. */
  repulsionStrength?: number
  /** Per-frame decay multiplier for trailing displacement. 0 = instant snap,
   *  0.99 = very long trail. Default 0.97 (~1s settle). */
  trailDecay?: number
}

export function DotGlobe({
  variant = 'grid',
  latitudeLines = 13,
  longitudeLines = 24,
  dotSpacingDeg = 4,
  sphereDots = 2400,
  continentSamples = 16000,
  color = '#ffffff',
  rotationSeconds = 110,
  maxDotRadius = 1.6,
  sphereScale = 0.6,
  centerX = 0.5,
  centerY = 0.5,
  interactive = true,
  repulsionRadius = 110,
  repulsionStrength = 0.4,
  trailDecay = 0.97,
}: DotGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

    // Build the point cloud on the unit sphere.
    //   x = cos(lat) * cos(lon),  y = sin(lat),  z = cos(lat) * sin(lon)
    const raw: number[] = []
    const DEG = Math.PI / 180

    if (variant === 'continents') {
      // Decode the bit-packed land mask, then keep only Fibonacci samples
      // whose (lat, lon) falls on land — the dots trace Earth's continents.
      const bin = atob(LAND_MASK_B64)
      const mask = new Uint8Array(bin.length)
      for (let i = 0; i < bin.length; i++) mask[i] = bin.charCodeAt(i)
      const RAD = 180 / Math.PI
      const isLand = (x: number, y: number, z: number) => {
        const latDeg = Math.asin(y < -1 ? -1 : y > 1 ? 1 : y) * RAD
        const lonDeg = Math.atan2(z, x) * RAD
        let row = Math.floor(((90 - latDeg) / 180) * LAND_MASK_ROWS)
        let col = Math.floor(((lonDeg + 180) / 360) * LAND_MASK_COLS)
        if (row < 0) row = 0
        else if (row >= LAND_MASK_ROWS) row = LAND_MASK_ROWS - 1
        if (col < 0) col = 0
        else if (col >= LAND_MASK_COLS) col = LAND_MASK_COLS - 1
        const idx = row * LAND_MASK_COLS + col
        return (mask[idx >> 3] >> (idx & 7)) & 1
      }
      const golden = Math.PI * (3 - Math.sqrt(5))
      for (let i = 0; i < continentSamples; i++) {
        const yNorm = 1 - (i / Math.max(continentSamples - 1, 1)) * 2
        const ringR = Math.sqrt(1 - yNorm * yNorm)
        const theta = golden * i
        const x = Math.cos(theta) * ringR
        const z = Math.sin(theta) * ringR
        if (isLand(x, yNorm, z)) raw.push(x, yNorm, z)
      }
    } else if (variant === 'sphere') {
      // Fibonacci lattice — even surface distribution (a solid dotted ball).
      const golden = Math.PI * (3 - Math.sqrt(5))
      for (let i = 0; i < sphereDots; i++) {
        const yNorm = 1 - (i / Math.max(sphereDots - 1, 1)) * 2
        const ringR = Math.sqrt(1 - yNorm * yNorm)
        const theta = golden * i
        raw.push(Math.cos(theta) * ringR, yNorm, Math.sin(theta) * ringR)
      }
    } else {
      // Wireframe globe: dots along parallels (latitude circles) + meridians.
      const spacing = dotSpacingDeg * DEG

      // Parallels — even arc spacing means fewer dots near the poles.
      const latStep = 180 / (latitudeLines + 1)
      for (let li = 1; li <= latitudeLines; li++) {
        const lat = (-90 + li * latStep) * DEG
        const ringR = Math.cos(lat)
        const y = Math.sin(lat)
        const n = Math.max(6, Math.round((2 * Math.PI * ringR) / spacing))
        for (let k = 0; k < n; k++) {
          const lon = (k / n) * 2 * Math.PI
          raw.push(Math.cos(lon) * ringR, y, Math.sin(lon) * ringR)
        }
      }

      // Meridians — dots from pole to pole. Skip the exact poles so they don't
      // pile up (every meridian would otherwise stack dots at the same point).
      const arcSteps = Math.round(Math.PI / spacing)
      for (let mi = 0; mi < longitudeLines; mi++) {
        const lon = (mi / longitudeLines) * 2 * Math.PI
        const cosLon = Math.cos(lon)
        const sinLon = Math.sin(lon)
        for (let k = 1; k < arcSteps; k++) {
          const lat = -Math.PI / 2 + (k / arcSteps) * Math.PI
          const ringR = Math.cos(lat)
          const y = Math.sin(lat)
          raw.push(cosLon * ringR, y, sinLon * ringR)
        }
      }
    }

    const points = new Float32Array(raw)
    const dotCount = raw.length / 3

    // Per-dot displacement that decays each frame — creates the trailing
    // effect: dots stay pushed for a moment after the cursor passes, then
    // gradually drift back to their grid position.
    const dispX = new Float32Array(dotCount)
    const dispY = new Float32Array(dotCount)

    // DPI-aware sizing
    let width = 0
    let height = 0
    let dpr = 1

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = Math.max(rect.width, 1)
      height = Math.max(rect.height, 1)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    // Pointer tracking — attached to the parent so the canvas can stay
    // pointer-events: none and not steal clicks from underlying UI.
    const parent = canvas.parentElement
    let pointerX = 0
    let pointerY = 0
    let pointerActive = false

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointerX = e.clientX - rect.left
      pointerY = e.clientY - rect.top
      pointerActive = true
    }
    const onPointerLeave = () => {
      pointerActive = false
    }
    if (interactive && parent) {
      parent.addEventListener('pointermove', onPointerMove)
      parent.addEventListener('pointerleave', onPointerLeave)
    }

    // Subtle axial tilt — Earth-like, gives a sense of axis
    const tilt = 0.22
    const tiltSin = Math.sin(tilt)
    const tiltCos = Math.cos(tilt)

    let smoothedWeight = 0
    let smoothedX = 0
    let smoothedY = 0

    const start = performance.now()
    let raf = 0

    const tick = (now: number) => {
      const elapsed = (now - start) / 1000
      const angle = reducedMotion ? 0 : (elapsed / rotationSeconds) * Math.PI * 2

      // Lerp pointer state for smooth enter/exit
      const targetWeight = pointerActive ? 1 : 0
      smoothedWeight += (targetWeight - smoothedWeight) * 0.07
      if (pointerActive) {
        smoothedX = pointerX
        smoothedY = pointerY
      }

      ctx.clearRect(0, 0, width, height)

      const cx = width * centerX
      const cy = height * centerY
      const sphereRadius = Math.min(width, height) * sphereScale
      const sinA = Math.sin(angle)
      const cosA = Math.cos(angle)

      for (let i = 0; i < dotCount; i++) {
        const px = points[i * 3]
        const py = points[i * 3 + 1]
        const pz = points[i * 3 + 2]

        // Rotate around Y
        const xr = px * cosA + pz * sinA
        const zr = -px * sinA + pz * cosA
        // Apply tilt (rotation around X)
        const yr = py * tiltCos - zr * tiltSin
        const zFinal = py * tiltSin + zr * tiltCos

        const baseX = cx + xr * sphereRadius
        const baseY = cy + yr * sphereRadius

        // Decay any existing displacement on this dot.
        dispX[i] *= trailDecay
        dispY[i] *= trailDecay

        // Add a fresh impulse if the cursor is currently near the dot's
        // base position. Checking against base (not displaced) position
        // keeps already-pushed dots from "running away" — instead the
        // cursor leaves a trail along its actual path.
        if (interactive && smoothedWeight > 0.01 && zFinal > -0.1) {
          const ddx = baseX - smoothedX
          const ddy = baseY - smoothedY
          const dist = Math.sqrt(ddx * ddx + ddy * ddy)
          if (dist < repulsionRadius && dist > 0.0001) {
            const f = 1 - dist / repulsionRadius
            const smoothstep = f * f * (3 - 2 * f)
            const impulse = smoothstep * repulsionStrength * smoothedWeight
            dispX[i] += (ddx / dist) * impulse
            dispY[i] += (ddy / dist) * impulse
          }
        }

        const sx = baseX + dispX[i]
        const sy = baseY + dispY[i]

        // Depth 0 (back) .. 1 (front)
        const depth = (zFinal + 1) * 0.5
        let sizeFactor: number
        let opacity: number
        if (variant === 'sphere' || variant === 'continents') {
          // Tapered silhouette so it reads as a solid lit ball; back-facing
          // land fades out so the near continents stay legible.
          sizeFactor = Math.pow(depth, 1.3) * 0.85 + 0.15
          opacity = depth * 0.48 + 0.2 // ~20% below the solid-ball baseline
        } else {
          // Near-uniform size so grid lines stay continuous; depth works
          // mostly through opacity (front crisp, back shows through).
          sizeFactor = Math.pow(depth, 0.4) * 0.4 + 0.6
          opacity = depth * 0.44 + 0.256 // 20% below baseline
        }
        const radius = maxDotRadius * sizeFactor

        ctx.globalAlpha = opacity
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(sx, sy, radius, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.globalAlpha = 1
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      if (interactive && parent) {
        parent.removeEventListener('pointermove', onPointerMove)
        parent.removeEventListener('pointerleave', onPointerLeave)
      }
    }
  }, [
    variant,
    latitudeLines,
    longitudeLines,
    dotSpacingDeg,
    sphereDots,
    continentSamples,
    color,
    rotationSeconds,
    maxDotRadius,
    sphereScale,
    centerX,
    centerY,
    interactive,
    repulsionRadius,
    repulsionStrength,
    trailDecay,
  ])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  )
}
