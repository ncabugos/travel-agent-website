export interface T3InstagramPost {
  id: string
  image: string
  href: string
  caption?: string
}

interface T3InstagramFeedProps {
  handle: string
  profileUrl?: string
  eyebrow?: string
  heading?: string
  subheading?: string
  posts?: T3InstagramPost[]
  limit?: number
}

/**
 * Instagram feed section for Meridian (T3). Editorial 6-tile grid on warm
 * ivory. Presentational — no live API yet; callers pass in posts, or omit
 * to use the curated demo set.
 *
 * When Instagram Basic Display / Graph API is wired, swap DEMO_POSTS for a
 * server-side fetch keyed off `agent.instagram_url`.
 */
export function T3InstagramFeed({
  handle,
  profileUrl,
  eyebrow = 'On Instagram',
  heading,
  subheading,
  posts,
  limit = 6,
}: T3InstagramFeedProps) {
  const items = (posts && posts.length > 0 ? posts : DEMO_POSTS).slice(0, limit)
  const cleanHandle = handle.startsWith('@') ? handle : `@${handle}`
  const ig = profileUrl ?? `https://www.instagram.com/${handle.replace(/^@/, '')}`
  const displayHeading = heading ?? `Follow along at ${cleanHandle}`

  return (
    <section className="t3-section">
      {/* Header */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: 32,
          alignItems: 'end',
          marginBottom: 40,
        }}
        className="t3-instagram-header"
      >
        <div style={{ maxWidth: 680 }}>
          <span className="t3-eyebrow">{eyebrow}</span>
          <h2 className="t3-headline-xl" style={{ marginTop: 28 }}>
            {displayHeading}
          </h2>
          {subheading && (
            <p className="t3-body t3-body-lg" style={{ marginTop: 24 }}>
              {subheading}
            </p>
          )}
        </div>
        <a
          href={ig}
          target="_blank"
          rel="noopener noreferrer"
          className="t3-link-arrow"
        >
          Follow
          <span className="arrow">→</span>
        </a>
      </div>

      {/* Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: 8,
        }}
        className="t3-instagram-grid"
      >
        {items.map((p) => (
          <a
            key={p.id}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            className="t3-instagram-tile"
            style={{
              position: 'relative',
              aspectRatio: '1 / 1',
              overflow: 'hidden',
              display: 'block',
              background: 'var(--t3-bg-alt)',
            }}
            aria-label={p.caption ?? 'Instagram post'}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.image}
              alt={p.caption ?? ''}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.7s var(--t3-ease-out), filter 0.3s ease',
              }}
              className="t3-instagram-img"
            />
            <div
              className="t3-instagram-overlay"
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(20, 17, 15, 0.0)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.25s ease',
              }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ opacity: 0, transition: 'opacity 0.25s ease' }}
                className="t3-instagram-icon"
              >
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="#fff" />
              </svg>
            </div>
          </a>
        ))}
      </div>

      <style>{`
        .t3-instagram-tile:hover .t3-instagram-overlay { background: rgba(20, 17, 15, 0.35) !important; }
        .t3-instagram-tile:hover .t3-instagram-icon { opacity: 1 !important; }
        .t3-instagram-tile:hover .t3-instagram-img { transform: scale(1.06); }
        @media (max-width: 900px) {
          .t3-instagram-header { grid-template-columns: 1fr !important; gap: 24px !important; }
          .t3-instagram-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .t3-instagram-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  )
}

const DEMO_POSTS: T3InstagramPost[] = [
  { id: '1', image: '/media/hero images/four-seasons-CapFerrat-pool-hero.jpg', href: 'https://instagram.com/' },
  { id: '2', image: '/media/hotel-programs/belmond-bellini-club/belmond-cap-1500.jpg', href: 'https://instagram.com/' },
  { id: '3', image: '/media/cruises/regent-seven-seas/splendor_atrium-1500.jpg', href: 'https://instagram.com/' },
  { id: '4', image: '/media/hotel-programs/dorchester/dorchester-slider-2-1500.jpg', href: 'https://instagram.com/' },
  { id: '5', image: '/media/hero images/four-seasons-sayan-hero.jpg', href: 'https://instagram.com/' },
  { id: '6', image: '/media/hotel-programs/rocco-forte/roccoforte-slider-1-1500.jpg', href: 'https://instagram.com/' },
]
