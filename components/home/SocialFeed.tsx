'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

/* ──────────────────────────── Types ─────────────────────────── */

interface BeholdPost {
  id: string
  mediaUrl: string
  thumbnailUrl?: string
  permalink: string
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  sizes?: {
    small?: { mediaUrl: string }
    medium?: { mediaUrl: string }
    large?: { mediaUrl: string }
  }
}

interface SocialFeedProps {
  /** Behold feed ID — defaults to NEXT_PUBLIC_BEHOLD_FEED_ID env var */
  feedId?: string
  instagramHandle?: string
  /** Full Facebook URL (https://facebook.com/...). If unset, the icon is hidden. */
  facebookUrl?: string | null
  /** Full YouTube channel/user URL. If unset, the icon is hidden. */
  youtubeUrl?: string | null
  agentId: string
}

/* ──────────────────────────── Component ────────────────────────── */

export function SocialFeed({
  feedId,
  instagramHandle = 'edenforyourworld',
  facebookUrl,
  youtubeUrl,
  agentId,
}: SocialFeedProps) {
  const [posts, setPosts] = useState<BeholdPost[]>([])
  const EDEN_FEED_ID = 'GqPHxF9OJRx0nsJlqM0T'
  const resolvedFeedId = feedId ?? EDEN_FEED_ID

  useEffect(() => {
    if (!resolvedFeedId) return
    fetch(`https://feeds.behold.so/${resolvedFeedId}`)
      .then((r) => r.json())
      .then((data) => {
        // Behold returns an array of posts directly, or under a "posts" key
        const items: BeholdPost[] = Array.isArray(data) ? data : data.posts ?? []
        setPosts(items.slice(0, 9))
      })
      .catch(() => {
        /* silent fail — placeholders will show */
      })
  }, [resolvedFeedId])

  const serif = 'var(--font-serif)'
  const sans = 'var(--font-sans)'
  const igUrl = `https://instagram.com/${instagramHandle}`

  // Pick best image URL for a post
  const getImageUrl = (post: BeholdPost) =>
    post.sizes?.medium?.mediaUrl ?? post.thumbnailUrl ?? post.mediaUrl

  return (
    <section
      style={{
        display: 'grid',
        gridTemplateColumns: '3fr 2fr',
      }}
      className="social-feed-grid"
    >
      {/* Left — 3×3 image grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridAutoRows: '1fr',
        }}
        className="ig-cells"
      >
        {posts.length > 0
          ? posts.map((post) => (
              <a
                key={post.id}
                href={post.permalink ?? igUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ig-tile"
                style={{
                  display: 'block',
                  position: 'relative',
                  overflow: 'hidden',
                  background: '#1a1a1a',
                  aspectRatio: '1 / 1',
                }}
              >
                <Image
                  src={getImageUrl(post)}
                  alt="Instagram post"
                  fill
                  sizes="(max-width: 768px) 50vw, 17vw"
                  style={{ objectFit: 'cover', transition: 'transform 0.5s ease, opacity 0.3s ease' }}
                />
                {/* Hover overlay */}
                <div className="ig-hover-overlay" />
                {/* Instagram icon on hover */}
                <div className="ig-icon-wrap">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="0.5" fill="white" stroke="none" />
                  </svg>
                </div>
              </a>
            ))
          : /* Placeholder tiles */
            Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                style={{
                  background: i % 2 === 0 ? '#1a1a1a' : '#2a2620',
                  aspectRatio: '1 / 1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" style={{ opacity: 0.15 }}>
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1.5" fill="white" stroke="none" />
                </svg>
              </div>
            ))}
      </div>

      {/* Right — dark panel */}
      <div
        style={{
          background: '#1C1916',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px 64px',
        }}
        className="social-copy-panel"
      >
        <p
          style={{
            fontFamily: sans,
            fontSize: '9px',
            letterSpacing: '0.38em',
            textTransform: 'uppercase',
            color: '#B5945A',
            marginBottom: '24px',
          }}
        >
          Follow The Journey
        </p>

        <h2
          style={{
            fontFamily: serif,
            fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
            fontWeight: 300,
            color: '#FFFFFF',
            lineHeight: 1.2,
            marginBottom: '24px',
          }}
        >
          Share your<br />travels with us
        </h2>

        <div style={{ width: '36px', height: '1px', background: '#B5945A', marginBottom: '28px' }} />

        <p
          style={{
            fontFamily: sans,
            fontSize: '14px',
            lineHeight: '1.8',
            color: 'rgba(255,255,255,0.55)',
            marginBottom: '36px',
            maxWidth: '340px',
          }}
        >
          Tag your next adventure and join our community of discerning travellers.
        </p>

        {/* Social icons */}
        <div style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>
          <SocialIcon href={igUrl} label="Instagram">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </SocialIcon>
          {facebookUrl && (
            <SocialIcon href={facebookUrl} label="Facebook">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </SocialIcon>
          )}
          {youtubeUrl && (
            <SocialIcon href={youtubeUrl} label="YouTube">
              <svg width="22" height="16" viewBox="0 0 24 17" fill="currentColor">
                <path d="M23.495 2.926A3.003 3.003 0 0 0 21.38.795C19.505.25 12 .25 12 .25S4.495.25 2.62.795A3.003 3.003 0 0 0 .505 2.926C0 4.814 0 8.75 0 8.75s0 3.936.505 5.824a3.003 3.003 0 0 0 2.115 2.131C4.495 17.25 12 17.25 12 17.25s7.505 0 9.38-.545a3.003 3.003 0 0 0 2.115-2.131C24 12.686 24 8.75 24 8.75s0-3.936-.505-5.824zM9.75 12.25v-7l6.5 3.5-6.5 3.5z" />
              </svg>
            </SocialIcon>
          )}
        </div>

        <p
          style={{
            fontFamily: sans,
            fontSize: '13px',
            letterSpacing: '0.12em',
            color: 'rgba(255,255,255,0.35)',
            fontStyle: 'italic',
          }}
        >
          #EdenFYW
        </p>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .social-feed-grid {
            grid-template-columns: 1fr !important;
          }
          .ig-cells {
            grid-template-rows: auto !important;
          }
          .social-copy-panel {
            padding: 64px 32px !important;
          }
        }
        .ig-tile img {
          transition: transform 0.5s ease, opacity 0.3s ease;
        }
        .ig-tile:hover img {
          transform: scale(1.06);
          opacity: 0.85;
        }
        .ig-hover-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0);
          transition: background 0.35s ease;
        }
        .ig-tile:hover .ig-hover-overlay {
          background: rgba(0,0,0,0.25);
        }
        .ig-icon-wrap {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.35s ease;
        }
        .ig-tile:hover .ig-icon-wrap {
          opacity: 1;
        }
      `}</style>
    </section>
  )
}

/* ────────── Social icon link with hover color ────────── */

function SocialIcon({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="social-icon-link"
      style={{ color: 'rgba(255,255,255,0.5)', transition: 'color 0.3s ease' }}
      onMouseEnter={(e) => { e.currentTarget.style.color = '#B5945A' }}
      onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}
    >
      {children}
    </a>
  )
}
