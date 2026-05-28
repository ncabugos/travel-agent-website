'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export interface T2HeroSlide {
  image: string
  /** Short uppercase label that rotates with the slide (e.g. "CÔTE D'AZUR"). */
  eyebrow: string
}

interface T2HeroSliderProps {
  agentId: string
  slides: T2HeroSlide[]
  h1: string
  h2: string
  cta1: { label: string; href: string }
  cta2?: { label: string; href: string }
  /** ms per slide. Default 6000. Set to 0 to disable auto-rotation. */
  intervalMs?: number
}

/**
 * Centered, auto-rotating hero with a cross-fade between background images.
 *
 * The H1, subtitle, and CTAs stay fixed; only the background image and the
 * destination eyebrow change. Optimised for "luxury travel co." style demos
 * where the slideshow telegraphs reach (Med → Asia → Caribbean → Middle East
 * → Tropics) without distracting from the headline.
 *
 * Pause-on-hover keeps the user in control if they want to read the eyebrow.
 * Respects prefers-reduced-motion (no auto-rotation, dots still clickable).
 */
export function T2HeroSlider({
  agentId,
  slides,
  h1,
  h2,
  cta1,
  cta2,
  intervalMs = 6000,
}: T2HeroSliderProps) {
  const base = `/t2/${agentId}`
  const [activeIndex, setActiveIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (slides.length <= 1 || intervalMs <= 0 || paused) return
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const id = window.setInterval(() => {
      setActiveIndex(i => (i + 1) % slides.length)
    }, intervalMs)
    return () => window.clearInterval(id)
  }, [slides.length, intervalMs, paused])

  return (
    <section
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        minHeight: 640,
        overflow: 'hidden',
      }}
    >
      {/* Cross-fading slides */}
      {slides.map((slide, i) => (
        <div
          key={slide.image}
          aria-hidden={i !== activeIndex}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: i === activeIndex ? 1 : 0,
            transition: 'opacity 1.6s ease',
          }}
        >
          <Image
            src={slide.image}
            alt=""
            fill
            priority={i === 0}
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
          />
        </div>
      ))}

      {/* Gradient overlay — symmetric top + bottom for centered content */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.20) 40%, rgba(0,0,0,0.20) 60%, rgba(0,0,0,0.55) 100%)',
        }}
      />

      {/* Centered content */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: 'clamp(40px, 6vw, 80px) 24px',
        }}
      >
        {/* Rotating eyebrow — same minHeight prevents layout shift */}
        <div
          style={{
            position: 'relative',
            minHeight: 18,
            marginBottom: 28,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {slides.map((slide, i) => (
            <span
              key={slide.eyebrow + i}
              aria-hidden={i !== activeIndex}
              style={{
                position: 'absolute',
                top: 0,
                fontFamily: 'var(--t2-font-sans)',
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: '0.32em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.85)',
                opacity: i === activeIndex ? 1 : 0,
                transition: 'opacity 0.8s ease',
                whiteSpace: 'nowrap',
              }}
            >
              {slide.eyebrow}
            </span>
          ))}
        </div>

        <h1
          className="t2-heading t2-heading-xl"
          style={{
            color: '#FFFFFF',
            marginBottom: 24,
            textShadow: '0 2px 24px rgba(0,0,0,0.25)',
            maxWidth: 960,
          }}
        >
          {h1}
        </h1>

        <p
          style={{
            fontFamily: 'var(--t2-font-sans)',
            fontSize: 'clamp(15px, 1.6vw, 18px)',
            fontWeight: 300,
            lineHeight: 1.7,
            color: 'rgba(255,255,255,0.85)',
            maxWidth: 620,
            margin: '0 0 44px',
          }}
        >
          {h2}
        </p>

        <div
          style={{
            display: 'flex',
            gap: 20,
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Link href={`${base}${cta1.href}`} className="t2-btn t2-btn-accent">
            {cta1.label}
          </Link>
          {cta2 && (
            <Link
              href={`${base}${cta2.href}`}
              style={{
                fontFamily: 'var(--t2-font-sans)',
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.85)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                transition: 'color 0.3s ease',
              }}
              className="t2-hero-link"
            >
              {cta2.label}
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <path d="M5 12h14M15 6l6 6-6 6" />
              </svg>
            </Link>
          )}
        </div>
      </div>

      {/* Slide indicators — dots, bottom center */}
      {slides.length > 1 && (
        <div
          style={{
            position: 'absolute',
            bottom: 36,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 3,
            display: 'flex',
            gap: 12,
          }}
        >
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === activeIndex}
              style={{
                width: i === activeIndex ? 28 : 8,
                height: 8,
                borderRadius: 4,
                border: 'none',
                background:
                  i === activeIndex
                    ? 'rgba(255,255,255,0.95)'
                    : 'rgba(255,255,255,0.45)',
                cursor: 'pointer',
                padding: 0,
                transition: 'width 0.4s ease, background 0.3s ease',
              }}
            />
          ))}
        </div>
      )}

      <style>{`
        .t2-hero-link:hover { color: #fff !important; }
      `}</style>
    </section>
  )
}
