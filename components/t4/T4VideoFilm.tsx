'use client'

import { useState } from 'react'

interface T4VideoFilmProps {
  videoUrl: string
  posterUrl?: string | null
  eyebrow?: string
  heading?: string
}

/**
 * Casa Solis (T4) cinematic film section. Poster with a play button; the Vimeo
 * iframe mounts only on click (no autoplay, no third-party JS on first paint).
 * Template isolation: T4 design system only.
 */
export function T4VideoFilm({ videoUrl, posterUrl, eyebrow = 'The Film', heading }: T4VideoFilmProps) {
  const [playing, setPlaying] = useState(false)

  const match = videoUrl.match(/(?:vimeo\.com\/(?:video\/)?)(\d+)/)
  const vimeoId = match?.[1]
  if (!vimeoId) return null

  const embedSrc = `https://player.vimeo.com/video/${vimeoId}?autoplay=1&title=0&byline=0&portrait=0&dnt=1`

  return (
    <section style={{ background: 'var(--t4-dark-bg)', padding: 'var(--t4-section-pad) 48px' }}>
      <div style={{ maxWidth: 'var(--t4-content-wide)', margin: '0 auto' }}>
        <div style={{ maxWidth: 720, marginBottom: 56 }}>
          <span className="t4-eyebrow" style={{ color: 'rgba(255,255,255,0.82)' }}>{eyebrow}</span>
          {heading && <h2 className="t4-headline-xl" style={{ color: '#fff', marginTop: 28 }}>{heading}</h2>}
        </div>

        <div style={{ position: 'relative', aspectRatio: '16 / 9', overflow: 'hidden', background: '#000' }}>
          {playing ? (
            <iframe
              src={embedSrc}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title={heading || 'Film'}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
            />
          ) : (
            <button
              onClick={() => setPlaying(true)}
              aria-label="Play film"
              style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%',
                border: 0, padding: 0, cursor: 'pointer', background: '#000',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {posterUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={posterUrl} alt={heading || 'Film poster'} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.72 }} />
              )}
              <span style={{
                position: 'relative', zIndex: 2,
                width: 'clamp(60px, 7vw, 88px)', height: 'clamp(60px, 7vw, 88px)',
                borderRadius: '50%', border: '1px solid rgba(255,255,255,0.82)',
                background: 'rgba(0,0,0,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{
                  width: 0, height: 0, marginLeft: 6,
                  borderTop: '11px solid transparent',
                  borderBottom: '11px solid transparent',
                  borderLeft: '18px solid #fff',
                }} />
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
