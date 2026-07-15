'use client'

import { useEffect, useRef, useState, type ReactNode, type ElementType } from 'react'

interface RevealProps {
  children: ReactNode
  /** Stagger delay in ms before the element animates in. */
  delay?: number
  /** Render as a different element (default div). */
  as?: ElementType
  className?: string
  style?: React.CSSProperties
}

/**
 * Aman-style fade-rise reveal. Adds `data-inview="true"` once the element
 * enters the viewport; the actual animation is CSS (.wwt-reveal in wwt2.css)
 * and is fully disabled under prefers-reduced-motion.
 */
export function Reveal({ children, delay = 0, as, className = '', style }: RevealProps) {
  const Tag = (as ?? 'div') as ElementType
  const ref = useRef<HTMLElement | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true)
            obs.disconnect()
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      className={`wwt-reveal ${className}`}
      data-inview={inView ? 'true' : 'false'}
      style={{ ...style, transitionDelay: delay ? `${delay}ms` : undefined }}
    >
      {children}
    </Tag>
  )
}
