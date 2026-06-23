'use client'

import { useState } from 'react'
import { getVideoEmbed } from '@/lib/video-embed'

interface T3VideoFilmProps {
  videoUrl: string
  posterUrl?: string | null
  eyebrow?: string
  heading?: string
}

/**
 * Meridian (T3) cinematic film section. Full-bleed poster with a play button;
 * the Vimeo iframe mounts only on click (no autoplay, no third-party JS on first
 * paint). Mirrors components/t2/T3VideoFilm but in the T3 design system.
 */
export function T3VideoFilm({ videoUrl, posterUrl, eyebrow = 'The Film', heading }: T3VideoFilmProps) {
  const [playing, setPlaying] = useState(false)

  const embed = getVideoEmbed(videoUrl)
  if (!embed) return null
  const embedSrc = embed.src

  return (
    <section style={{ background: 'var(--t3-dark-bg)', padding: 'var(--t3-section-pad) 48px' }} className="t3-cruise-film">
      <div style={{ maxWidth: 'var(--t3-content-default, 1200px)', margin: '0 auto' }}>
        <div style={{ maxWidth: 'var(--t3-content-narrow)', marginBottom: 'var(--t3-gap)' }}>
          <span className="t3-eyebrow t3-eyebrow-plain" style={{ color: 'rgba(255,255,255,0.72)' }}>{eyebrow}</span>
          {heading && (
            <h2 className="t3-headline-xl" style={{ color: '#fff', marginTop: 24 }}>{heading}</h2>
          )}
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
                <img src={posterUrl} alt={heading || 'Film poster'} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.74 }} />
              )}
              <span style={{
                position: 'relative', zIndex: 2,
                width: 'clamp(60px, 7vw, 84px)', height: 'clamp(60px, 7vw, 84px)',
                borderRadius: '50%', border: '1px solid rgba(255,255,255,0.85)',
                background: 'rgba(0,0,0,0.22)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{
                  width: 0, height: 0, marginLeft: 5,
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
