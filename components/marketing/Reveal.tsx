'use client'
import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'

/**
 * One fade-up on entry. Adds `is-visible` when the block enters the viewport;
 * the transition lives in globals.css (.eah-reveal) and is disabled under
 * prefers-reduced-motion. Falls back to visible if the observer never fires.
 */
export function Reveal({ children, className = '', style, delay = 0 }: {
  children: ReactNode
  className?: string
  style?: CSSProperties
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) { el.classList.add('is-visible'); return }
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { el.classList.add('is-visible'); obs.disconnect() }
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })
    obs.observe(el)
    const fallback = window.setTimeout(() => el.classList.add('is-visible'), 2500)
    return () => { obs.disconnect(); window.clearTimeout(fallback) }
  }, [])

  return (
    <div ref={ref} className={`eah-reveal ${className}`} style={{ ...style, transitionDelay: delay ? `${delay}ms` : undefined }}>
      {children}
    </div>
  )
}
