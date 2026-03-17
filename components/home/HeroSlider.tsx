'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { EDEN } from '@/lib/media-library'
import { useSwipe } from '@/hooks/useSwipe'

export interface HeroSlide {
  src: string
  alt: string
  headline: string
  subheadline?: string
  ctaLabel?: string
  ctaHref?: string
}

interface HeroSliderProps {
  slides: HeroSlide[]
  autoPlayMs?: number
  /** Show the Condé Nast Traveler Top Specialists badge */
  showBadge?: boolean
}

export function HeroSlider({ slides, autoPlayMs = 6000, showBadge = false }: HeroSliderProps) {
  const [current, setCurrent] = useState(0)
  const [transitioning, setTransitioning] = useState(false)

  const goTo = useCallback((index: number) => {
    if (transitioning) return
    setTransitioning(true)
    setTimeout(() => {
      setCurrent(index)
      setTransitioning(false)
    }, 600)
  }, [transitioning])

  const next = useCallback(() => {
    goTo((current + 1) % slides.length)
  }, [current, slides.length, goTo])

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length)
  }, [current, slides.length, goTo])

  useEffect(() => {
    const id = setInterval(next, autoPlayMs)
    return () => clearInterval(id)
  }, [next, autoPlayMs])

  const swipeHandlers = useSwipe(next, prev)

  const slide = slides[current]

  return (
    <div
      {...swipeHandlers}
      style={{
        position: 'relative',
        width: '100%',
        height: '80svh',
        minHeight: '600px',
        overflow: 'hidden',
        background: 'var(--charcoal)',
        touchAction: 'pan-y',
      }}
    >
      {/* Background image with Ken Burns */}
      <div
        key={current}
        style={{
          position: 'absolute',
          inset: 0,
          opacity: transitioning ? 0 : 1,
          transition: 'opacity 0.8s ease',
          animation: `kenBurns ${autoPlayMs / 1000}s ease-in-out both`,
        }}
      >
        <Image
          src={slide.src}
          alt={slide.alt}
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        />
        {/* Dark gradient overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.7) 100%)',
          }}
        />
      </div>

      {/* Text content */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '0 24px',
          opacity: transitioning ? 0 : 1,
          transition: 'opacity 0.6s ease',
        }}
      >
        {/* Overline */}
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '10px',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
            marginBottom: '24px',
            animation: 'fadeUp 1s ease 0.2s both',
          }}
        >
          Luxury Travel
        </p>

        {/* Headline */}
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.8rem, 7vw, 6rem)',
            fontWeight: 300,
            lineHeight: 1.08,
            color: '#FFFFFF',
            maxWidth: '880px',
            marginBottom: '24px',
            animation: 'fadeUp 1s ease 0.35s both',
          }}
        >
          {slide.headline}
        </h1>

        {/* Subheadline */}
        {slide.subheadline && (
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '15px',
              letterSpacing: '0.04em',
              color: 'rgba(255,255,255,0.75)',
              maxWidth: '520px',
              marginBottom: '40px',
              animation: 'fadeUp 1s ease 0.5s both',
            }}
          >
            {slide.subheadline}
          </p>
        )}

        {/* CTA */}
        <Link
          href={slide.ctaHref ?? '#contact'}
          style={{
            display: 'inline-block',
            fontFamily: 'var(--font-sans)',
            fontSize: '10px',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#FFFFFF',
            border: '1px solid rgba(255,255,255,0.5)',
            padding: '14px 36px',
            textDecoration: 'none',
            transition: 'background 0.3s ease, border-color 0.3s ease',
            animation: 'fadeUp 1s ease 0.65s both',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'var(--gold)'
            e.currentTarget.style.borderColor = 'var(--gold)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'
          }}
        >
          {slide.ctaLabel ?? 'Begin Your Journey'}
        </Link>
      </div>

      {/* Prev / Next arrows */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        style={{
          position: 'absolute',
          left: '32px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'rgba(255,255,255,0.6)',
          transition: 'color 0.2s',
          padding: '8px',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = '#FFFFFF')}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        style={{
          position: 'absolute',
          right: '32px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'rgba(255,255,255,0.6)',
          transition: 'color 0.2s',
          padding: '8px',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = '#FFFFFF')}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      {/* Condé Nast Badge — bottom-left, above dots
           Design rationale: lower-left is the luxury editorial standard for
           awards/credentials (Condé Nast, Virtuoso, Forbes). It anchors the
           credential without competing with the centred headline or CTA. */}
      {showBadge && (
        <div
          className="cnt-badge"
          style={{
            position: 'absolute',
            bottom: '48px',
            left: '40px',
            zIndex: 10,
            animation: 'fadeUp 1.2s ease 0.8s both',
          }}
        >
          <Image
            src={EDEN.condeNast2026}
            alt="Condé Nast Traveler Top Travel Specialists 2025-2026"
            width={127}
            height={127}
            style={{
              objectFit: 'contain',
              filter: 'drop-shadow(0 2px 12px rgba(0,0,0,0.5))',
              borderRadius: '50%',
            }}
            priority
          />
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .cnt-badge {
            bottom: 52px !important;
            left: 16px !important;
          }
          .cnt-badge img {
            width: 88px !important;
            height: 88px !important;
          }
        }
      `}</style>

      {/* Dot indicators */}
      <div
        style={{
          position: 'absolute',
          bottom: '32px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '10px',
        }}
      >
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            style={{
              width: i === current ? '28px' : '6px',
              height: '2px',
              background: i === current ? 'var(--gold)' : 'rgba(255,255,255,0.4)',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              transition: 'width 0.4s ease, background 0.4s ease',
            }}
          />
        ))}
      </div>
    </div>
  )
}
