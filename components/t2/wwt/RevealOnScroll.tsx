'use client'

import type React from 'react'
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

type Variant = 'fade-up' | 'fade' | 'mask-up' | 'mask-down' | 'letter-rise'

interface RevealOnScrollProps {
  children: ReactNode
  variant?: Variant
  delay?: number
  duration?: number
  threshold?: number
  as?: keyof React.JSX.IntrinsicElements
  className?: string
  style?: CSSProperties
}

export function RevealOnScroll({
  children,
  variant = 'fade-up',
  delay = 0,
  duration = 900,
  threshold = 0.15,
  as = 'div',
  className,
  style,
}: RevealOnScrollProps) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true)
      return
    }

    const inView = () => {
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight || 1
      const enterAt = vh * (1 - threshold)
      return rect.top < enterAt && rect.bottom > vh * threshold * -1
    }

    // Synchronous initial check — catches elements already in or past the
    // viewport on mount (after HMR or deep-link).
    if (inView()) {
      setVisible(true)
      return
    }

    let raf = 0
    const check = () => {
      if (inView()) {
        setVisible(true)
        cleanup()
      }
    }
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(check)
    }
    const cleanup = () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return cleanup
  }, [threshold])

  const transition = `transform ${duration}ms cubic-bezier(0.2, 0.7, 0.1, 1) ${delay}ms, opacity ${duration}ms cubic-bezier(0.2, 0.7, 0.1, 1) ${delay}ms, clip-path ${duration}ms cubic-bezier(0.2, 0.7, 0.1, 1) ${delay}ms`

  const base: CSSProperties = { transition, willChange: 'transform, opacity, clip-path' }

  const hidden: Record<Variant, CSSProperties> = {
    'fade-up':     { opacity: 0, transform: 'translateY(28px)' },
    'fade':        { opacity: 0 },
    'mask-up':     { opacity: 1, clipPath: 'inset(100% 0 0 0)' },
    'mask-down':   { opacity: 1, clipPath: 'inset(0 0 100% 0)' },
    'letter-rise': { opacity: 0, transform: 'translateY(44px)' },
  }

  const shown: Record<Variant, CSSProperties> = {
    'fade-up':     { opacity: 1, transform: 'translateY(0)' },
    'fade':        { opacity: 1 },
    'mask-up':     { opacity: 1, clipPath: 'inset(0 0 0 0)' },
    'mask-down':   { opacity: 1, clipPath: 'inset(0 0 0 0)' },
    'letter-rise': { opacity: 1, transform: 'translateY(0)' },
  }

  const Tag = as as any

  return (
    <Tag
      ref={ref as never}
      className={className}
      style={{ ...base, ...(visible ? shown[variant] : hidden[variant]), ...style }}
    >
      {children}
    </Tag>
  )
}

/**
 * Word-by-word rise reveal for Aethos-style headlines.
 * Splits the text at spaces and animates each word with a stagger.
 */
export function HeadlineReveal({
  text,
  className,
  style,
  stagger = 70,
  delay = 0,
}: {
  text: string
  className?: string
  style?: CSSProperties
  stagger?: number
  delay?: number
}) {
  const ref = useRef<HTMLHeadingElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true)
      return
    }
    const inView = () => {
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight || 1
      return rect.top < vh * 0.85
    }
    if (inView()) {
      setVisible(true)
      return
    }
    let raf = 0
    const check = () => {
      if (inView()) {
        setVisible(true)
        cleanup()
      }
    }
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(check)
    }
    const cleanup = () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return cleanup
  }, [])

  const words = text.split(' ')

  // Outer wrapper is `inline` so words wrap inside the parent's constraints
  // (e.g. a max-width on the heading). Each word is `inline-block` with
  // `overflow: hidden` so its inner span can translate vertically for the
  // rise-on-scroll reveal without disturbing line breaks.
  return (
    <span ref={ref} className={className} style={style}>
      {words.map((w, i) => (
        <span
          key={`${w}-${i}`}
          style={{
            display: 'inline-block',
            overflow: 'hidden',
            verticalAlign: 'bottom',
            whiteSpace: 'nowrap',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              transition: `transform 1100ms cubic-bezier(0.2, 0.7, 0.1, 1) ${delay + i * stagger}ms`,
              transform: visible ? 'translateY(0)' : 'translateY(110%)',
            }}
          >
            {w}
          </span>
          {i < words.length - 1 && '\u00A0'}
        </span>
      ))}
    </span>
  )
}
