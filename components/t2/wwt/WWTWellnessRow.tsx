'use client'

import { useRef } from 'react'
import { RevealOnScroll, HeadlineReveal } from './RevealOnScroll'

export interface WellnessItem {
  title: string
  description: string
  image: string
}

interface WWTWellnessRowProps {
  eyebrow: string
  headline: string
  body?: string
  items: WellnessItem[]
}

/**
 * Aethos "Wellness for all Senses" analog — a horizontally-scrolling row of
 * tall image cards with captions below. Snap-scroll on touch devices,
 * arrow-drag feel on desktop. Minimal chrome — trust the imagery.
 */
export function WWTWellnessRow({ eyebrow, headline, body, items }: WWTWellnessRowProps) {
  const scrollerRef = useRef<HTMLDivElement>(null)

  const scrollBy = (delta: number) => {
    scrollerRef.current?.scrollBy({ left: delta, behavior: 'smooth' })
  }

  return (
    <section
      style={{
        padding: 'var(--t2-section-pad) 0',
        background: 'var(--t2-bg)',
      }}
    >
      {/* Header */}
      <div
        style={{
          maxWidth: 1480,
          margin: '0 auto',
          padding: '0 clamp(24px, 6vw, 72px)',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'clamp(32px, 5vw, 80px)',
          alignItems: 'end',
          marginBottom: 'clamp(56px, 8vw, 96px)',
        }}
        className="wwt-wellness-header"
      >
        <div>
          <RevealOnScroll variant="fade-up" duration={900}>
            <p className="t2-label" style={{ marginBottom: 32 }}>{eyebrow}</p>
          </RevealOnScroll>
          <h2
            className="t2-heading"
            style={{
              fontFamily: 'var(--t2-font-serif)',
              fontSize: 'clamp(2rem, 3.8vw, 3.6rem)',
              fontWeight: 300,
              lineHeight: 1.08,
              letterSpacing: '-0.02em',
              color: 'var(--t2-text)',
              maxWidth: '16ch',
            }}
          >
            <HeadlineReveal text={headline} stagger={55} />
          </h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'flex-end' }}>
          {body && (
            <RevealOnScroll variant="fade-up" delay={220} duration={900}>
              <p
                style={{
                  fontFamily: 'var(--t2-font-sans)',
                  fontSize: 15,
                  lineHeight: 1.85,
                  color: 'var(--t2-text-muted)',
                  fontWeight: 300,
                  maxWidth: '46ch',
                }}
              >
                {body}
              </p>
            </RevealOnScroll>
          )}
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              aria-label="Scroll left"
              onClick={() => scrollBy(-420)}
              className="wwt-arrow"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </button>
            <button
              aria-label="Scroll right"
              onClick={() => scrollBy(420)}
              className="wwt-arrow"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Scroller */}
      <div
        ref={scrollerRef}
        className="wwt-wellness-scroller"
        style={{
          display: 'flex',
          gap: 'clamp(16px, 2vw, 28px)',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          padding: '0 clamp(24px, 6vw, 72px)',
          scrollbarWidth: 'none',
        }}
      >
        {items.map((it, i) => (
          <RevealOnScroll
            key={it.title}
            variant="fade-up"
            delay={i * 80}
            duration={1000}
            style={{ flex: '0 0 auto', scrollSnapAlign: 'start' }}
          >
            <div className="wwt-wellness-card">
              <div
                className="wwt-wellness-img"
                style={{ backgroundImage: `url("${encodeURI(it.image)}")` }}
              />
              <div style={{ paddingTop: 20, maxWidth: 340 }}>
                <h3
                  style={{
                    fontFamily: 'var(--t2-font-serif)',
                    fontSize: 'clamp(1.2rem, 1.6vw, 1.5rem)',
                    fontWeight: 400,
                    color: 'var(--t2-text)',
                    letterSpacing: '-0.01em',
                    marginBottom: 12,
                  }}
                >
                  {it.title}
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--t2-font-sans)',
                    fontSize: 14,
                    lineHeight: 1.75,
                    color: 'var(--t2-text-muted)',
                    fontWeight: 300,
                  }}
                >
                  {it.description}
                </p>
              </div>
            </div>
          </RevealOnScroll>
        ))}
        <div style={{ flex: '0 0 clamp(24px, 6vw, 72px)' }} aria-hidden />
      </div>

      <style>{`
        .wwt-wellness-scroller::-webkit-scrollbar { display: none; }
        .wwt-wellness-card { width: clamp(300px, 32vw, 420px); }
        .wwt-wellness-img {
          width: 100%;
          aspect-ratio: 3 / 4;
          background-size: cover;
          background-position: center;
          transform: scale(1.02);
          transition: transform 1200ms cubic-bezier(0.2, 0.7, 0.1, 1);
        }
        .wwt-wellness-card:hover .wwt-wellness-img { transform: scale(1.06); }
        .wwt-arrow {
          width: 48px;
          height: 48px;
          border-radius: 999px;
          border: 1px solid var(--t2-divider);
          background: transparent;
          color: var(--t2-text);
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: background 240ms var(--t2-ease), color 240ms var(--t2-ease), border-color 240ms var(--t2-ease);
        }
        .wwt-arrow:hover {
          background: var(--t2-text);
          color: var(--t2-bg);
          border-color: var(--t2-text);
        }
        @media (max-width: 900px) {
          .wwt-wellness-header { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>
    </section>
  )
}
