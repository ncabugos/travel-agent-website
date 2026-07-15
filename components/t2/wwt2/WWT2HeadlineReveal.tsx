'use client'

import { useEffect, useRef, useState, type ElementType } from 'react'

interface WWT2HeadlineRevealProps {
  text: string
  /** Optional trailing run set in italic serif. */
  italicText?: string
  as?: ElementType
  className?: string
  /** ms before the first word rises. */
  delay?: number
  /** ms between words. */
  stagger?: number
}

/**
 * Word-by-word mask-rise for display headlines: each word sits in an
 * overflow-hidden slot and rises 110% → 0 when the element first enters the
 * viewport. Under reduced-motion the words render static (CSS in wwt2.css).
 */
export function WWT2HeadlineReveal({
  text,
  italicText,
  as: Tag = 'h2',
  className = '',
  delay = 0,
  stagger = 60,
}: WWT2HeadlineRevealProps) {
  const ref = useRef<HTMLElement>(null)
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
      { threshold: 0.2, rootMargin: '0px 0px -6% 0px' },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const words = text.split(' ').filter(Boolean)
  const italicWords = italicText ? italicText.split(' ').filter(Boolean) : []

  // Word spacing comes from .wwt-hr-slot margin (a trailing text space would
  // be clipped by the slot's overflow:hidden).
  const renderWord = (word: string, i: number, italic: boolean) => (
    <span key={`${italic ? 'i' : 'r'}-${i}`} className="wwt-hr-slot" aria-hidden="true">
      <span
        className={`wwt-hr-word${italic ? ' italic' : ''}`}
        style={{ transitionDelay: `${delay + (i + (italic ? words.length : 0)) * stagger}ms` }}
      >
        {word}
      </span>
    </span>
  )

  return (
    <Tag
      // Word spans are aria-hidden; the full sentence reads once for AT.
      aria-label={italicText ? `${text} ${italicText}` : text}
      ref={ref}
      className={`wwt-hr ${className}`}
      data-inview={inView ? 'true' : 'false'}
    >
      {words.map((w, i) => renderWord(w, i, false))}
      {italicWords.map((w, i) => renderWord(w, i, true))}
    </Tag>
  )
}
