'use client'

import { useEffect, useRef, useState } from 'react'

interface WWT2CountUpProps {
  value: number
  /** Rendered after the number, e.g. '+'. */
  suffix?: string
  duration?: number
  className?: string
}

/**
 * Serif numeral that counts up from 0 on first intersection (ease-out cubic).
 * Reduced-motion users see the final value immediately.
 */
export function WWT2CountUp({ value, suffix = '', duration = 1800, className = '' }: WWT2CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setDisplay(value)
      return
    }
    let raf = 0
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !started.current) {
            started.current = true
            obs.disconnect()
            const t0 = performance.now()
            const tick = (t: number) => {
              const p = Math.min(1, (t - t0) / duration)
              const eased = 1 - Math.pow(1 - p, 3)
              setDisplay(Math.round(value * eased))
              if (p < 1) raf = requestAnimationFrame(tick)
            }
            raf = requestAnimationFrame(tick)
          }
        }
      },
      { threshold: 0.4 },
    )
    obs.observe(el)
    return () => {
      obs.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [value, duration])

  return (
    <span ref={ref} className={`wwt-countup ${className}`}>
      {display.toLocaleString('en-US')}
      {suffix}
    </span>
  )
}
