'use client'

import { useState } from 'react'
import Image from 'next/image'

interface T2VideoFilmProps {
  videoUrl: string
  posterUrl?: string | null
  eyebrow?: string
  heading?: string
}

/**
 * Cinematic film section for the yacht/cruise detail page. Shows a full-bleed
 * poster with a play button; the Vimeo iframe is only mounted once the guest
 * clicks play (no autoplay, no third-party JS on first paint — perf-safe).
 */
export function T2VideoFilm({ videoUrl, posterUrl, eyebrow = 'The Film', heading }: T2VideoFilmProps) {
  const [playing, setPlaying] = useState(false)

  // Pull the numeric id out of any vimeo.com/<id> or player.vimeo.com/video/<id> URL.
  const match = videoUrl.match(/(?:vimeo\.com\/(?:video\/)?)(\d+)/)
  const vimeoId = match?.[1]
  if (!vimeoId) return null

  const embedSrc = `https://player.vimeo.com/video/${vimeoId}?autoplay=1&title=0&byline=0&portrait=0&dnt=1`

  return (
    <section style={{ background: 'var(--t2-dark-bg)', padding: 'clamp(64px, 9vw, 120px) 0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(32px, 5vw, 56px)' }}>
          <span style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', display: 'block', marginBottom: 16 }}>
            {eyebrow}
          </span>
          {heading && (
            <h2 style={{ fontFamily: 'var(--t2-font-serif)', fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 400, color: '#fff', margin: 0, letterSpacing: '0.01em' }}>
              {heading}
            </h2>
          )}
        </div>

        <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', borderRadius: 'var(--t2-radius-lg)', background: '#000' }}>
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
                <Image
                  src={posterUrl}
                  alt={heading || 'Film poster'}
                  fill
                  style={{ objectFit: 'cover', opacity: 0.78 }}
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  unoptimized
                />
              )}
              <span style={{
                position: 'relative', zIndex: 2,
                width: 'clamp(64px, 8vw, 92px)', height: 'clamp(64px, 8vw, 92px)',
                borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.85)',
                background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(2px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.25s ease',
              }}>
                <span style={{
                  width: 0, height: 0, marginLeft: 6,
                  borderTop: '12px solid transparent',
                  borderBottom: '12px solid transparent',
                  borderLeft: '20px solid #fff',
                }} />
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
