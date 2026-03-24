'use client'

/**
 * VideoGrid.tsx
 * Click-to-play YouTube facade component.
 * - Shows thumbnails (fast, no iframes on load)
 * - Clicking swaps thumbnail for iframe with autoplay
 * - Uses the luxury design system tokens
 */

import { useState } from 'react'
import type { YouTubeVideo } from '@/lib/youtube'

interface VideoGridProps {
  videos: YouTubeVideo[]
}

export function VideoGrid({ videos }: VideoGridProps) {
  const serif = 'var(--font-serif)'
  const sans  = 'var(--font-sans)'

  if (videos.length === 0) return null

  return (
    <section style={{ padding: '100px 24px 80px', borderBottom: '1px solid var(--divider)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Section header */}
        <div style={{ marginBottom: '56px' }}>
          <p style={{
            fontFamily: sans,
            fontSize: '10px',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
            marginBottom: '14px',
          }}>
            Watch
          </p>
          <h2 style={{
            fontFamily: serif,
            fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
            fontWeight: 300,
            color: 'var(--charcoal)',
            marginBottom: '20px',
          }}>
            From Our Channel
          </h2>
          <div style={{ width: '40px', height: '1px', background: 'var(--gold)' }} />
        </div>

        {/* Video grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '32px',
        }}>
          {videos.map(video => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>

        {/* CTA to full channel */}
        <div style={{ textAlign: 'center', marginTop: '56px' }}>
          <a
            href="https://www.youtube.com/@edenforyourworld"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              fontFamily: sans,
              fontSize: '10px',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'var(--charcoal)',
              border: '1px solid var(--divider)',
              padding: '14px 36px',
              textDecoration: 'none',
              transition: 'border-color 0.3s ease, color 0.3s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--gold)'
              e.currentTarget.style.color = 'var(--gold)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--divider)'
              e.currentTarget.style.color = 'var(--charcoal)'
            }}
          >
            View All Videos
          </a>
        </div>
      </div>
    </section>
  )
}

/* ── Individual video card ─────────────────────────────────────── */

function VideoCard({ video }: { video: YouTubeVideo }) {
  const [playing, setPlaying] = useState(false)
  const sans = 'var(--font-sans)'
  const serif = 'var(--font-serif)'

  const formattedDate = new Date(video.publishedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <article>
      {/* Thumbnail / Player */}
      <div
        style={{
          position: 'relative',
          paddingBottom: '56.25%', // 16:9
          background: '#1a1a1a',
          overflow: 'hidden',
          cursor: playing ? 'default' : 'pointer',
          marginBottom: '16px',
        }}
        onClick={() => !playing && setPlaying(true)}
        onKeyDown={e => { if ((e.key === 'Enter' || e.key === ' ') && !playing) setPlaying(true) }}
        role={playing ? undefined : 'button'}
        tabIndex={playing ? -1 : 0}
        aria-label={playing ? undefined : `Play: ${video.title}`}
      >
        {playing ? (
          /* ── Iframe player ── */
          <iframe
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          /* ── Thumbnail facade ── */
          <>
            {/* Thumbnail image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={video.thumbnail}
              alt={video.title}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.6s ease',
              }}
              className="video-thumb"
            />
            {/* Dark overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(20,18,16,0.35)',
              transition: 'background 0.3s ease',
            }}
              className="video-overlay"
            />
            {/* Play button */}
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.2s ease, background 0.2s ease',
              }}
                className="play-btn"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="white"
                  style={{ marginLeft: '3px' }}
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Video metadata */}
      <p style={{
        fontFamily: sans,
        fontSize: '9px',
        letterSpacing: '0.25em',
        textTransform: 'uppercase',
        color: 'var(--gold)',
        marginBottom: '8px',
      }}>
        {formattedDate}
      </p>
      <h3 style={{
        fontFamily: serif,
        fontSize: '17px',
        fontWeight: 400,
        color: 'var(--charcoal)',
        lineHeight: 1.4,
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }}>
        {video.title}
      </h3>

      {/* Hover micro-animations */}
      <style>{`
        article:hover .video-thumb { transform: scale(1.04); }
        article:hover .video-overlay { background: rgba(20,18,16,0.2) !important; }
        article:hover .play-btn {
          transform: scale(1.12);
          background: rgba(181,148,90,0.5) !important;
        }
      `}</style>
    </article>
  )
}
