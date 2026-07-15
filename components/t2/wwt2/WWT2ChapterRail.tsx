'use client'

import { useEffect, useRef, useState } from 'react'

export interface Chapter {
  id: string
  label: string
}

interface WWT2ChapterRailProps {
  chapters: Chapter[]
}

/**
 * Fixed right-edge chapter rail (desktop only): a hairline progress track plus
 * a dash tick per chapter section. The active tick follows scroll
 * (IntersectionObserver); clicking a tick scrolls to its chapter.
 */
export function WWT2ChapterRail({ chapters }: WWT2ChapterRailProps) {
  const [active, setActive] = useState('')
  const fillRef = useRef<HTMLSpanElement>(null)

  // Overall page progress → hairline fill (direct DOM write, no re-render).
  useEffect(() => {
    let ticking = false
    let raf = 0
    const update = () => {
      ticking = false
      const fill = fillRef.current
      if (!fill) return
      const span = document.documentElement.scrollHeight - window.innerHeight
      const p = span > 0 ? Math.min(1, window.scrollY / span) : 0
      fill.style.transform = `scaleY(${p.toFixed(4)})`
    }
    const onScroll = () => {
      if (!ticking) {
        raf = requestAnimationFrame(update)
        ticking = true
      }
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  // Active chapter tracking.
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const els = chapters
      .map((c) => document.getElementById(c.id))
      .filter((el): el is HTMLElement => !!el)
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
        }
      },
      // A slim horizontal band around the viewport center decides the chapter.
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [chapters])

  const jump = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' })
  }

  return (
    <nav className="wwt2-rail" aria-label="Chapters">
      <span className="wwt2-rail-track" aria-hidden="true">
        <span ref={fillRef} className="wwt2-rail-fill" />
      </span>
      <div className="wwt2-rail-ticks">
        {chapters.map((c) => (
          <button
            key={c.id}
            type="button"
            className="wwt2-rail-tick"
            data-active={active === c.id ? 'true' : 'false'}
            aria-current={active === c.id ? 'true' : undefined}
            aria-label={c.label}
            onClick={() => jump(c.id)}
          >
            <span className="wwt2-rail-label">{c.label}</span>
            <span className="wwt2-rail-dash" aria-hidden="true" />
          </button>
        ))}
      </div>
    </nav>
  )
}
