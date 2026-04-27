export interface T2InstagramPost {
  id: string
  image: string
  href: string         // link to the post on instagram
  caption?: string
}

interface T2InstagramFeedProps {
  handle: string
  profileUrl?: string
  eyebrow?: string
  heading?: string
  subheading?: string
  posts?: T2InstagramPost[]
  /** Number of posts to render. Defaults to 6. */
  limit?: number
}

/**
 * Instagram feed section for Vista (T2). Lightweight presentational component
 * that renders a tiled row of Instagram posts. No live IG API integration
 * yet — callers pass posts in, or omit them to fall back to a curated demo set.
 *
 * When the platform wires up Instagram Basic Display / Graph API in a future
 * iteration, replace `DEMO_POSTS` with a server-side fetch keyed off the
 * agent's `instagram_url`.
 */
export function T2InstagramFeed({
  handle,
  profileUrl,
  eyebrow = 'On Instagram',
  heading,
  subheading,
  posts,
  limit = 6,
}: T2InstagramFeedProps) {
  const items = (posts && posts.length > 0 ? posts : DEMO_POSTS).slice(0, limit)
  const ig = profileUrl ?? `https://www.instagram.com/${handle.replace(/^@/, '')}`
  const displayHandle = handle.startsWith('@') ? handle : `@${handle}`
  const displayHeading = heading ?? `Follow along at ${displayHandle}`

  return (
    <section style={{ padding: 'var(--t2-section-pad) 0', background: 'var(--t2-bg-alt, #f3efe7)' }}>
      <div
        style={{
          maxWidth: 'var(--t2-content-max, 1280px)',
          margin: '0 auto',
          padding: '0 48px',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'end',
            justifyContent: 'space-between',
            gap: 32,
            marginBottom: 40,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ maxWidth: 680 }}>
            <p className="t2-label" style={{ marginBottom: 16 }}>{eyebrow}</p>
            <h2 className="t2-heading t2-heading-lg" style={{ marginBottom: subheading ? 16 : 0 }}>
              {displayHeading}
            </h2>
            {subheading && (
              <p className="t2-body" style={{ margin: 0 }}>
                {subheading}
              </p>
            )}
          </div>
          <a
            href={ig}
            target="_blank"
            rel="noopener noreferrer"
            className="t2-btn t2-btn-ghost-dark"
            style={{ alignSelf: 'flex-end' }}
          >
            Follow on Instagram
          </a>
        </div>

        {/* Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: 8,
          }}
          className="t2-instagram-grid"
        >
          {items.map((p) => (
            <a
              key={p.id}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="t2-instagram-tile"
              style={{
                position: 'relative',
                aspectRatio: '1 / 1',
                overflow: 'hidden',
                display: 'block',
                background: 'var(--t2-bg-alt, #f3efe7)',
              }}
              aria-label={p.caption ?? `Instagram post`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.image}
                alt={p.caption ?? ''}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.7s ease, filter 0.3s ease',
                }}
                className="t2-instagram-img"
              />
              <div
                className="t2-instagram-overlay"
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
                  className="t2-instagram-icon"
                >
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="#fff" />
                </svg>
              </div>
            </a>
          ))}
        </div>
      </div>

      <style>{`
        .t2-instagram-tile:hover .t2-instagram-overlay {
          background: rgba(20, 17, 15, 0.35) !important;
        }
        .t2-instagram-tile:hover .t2-instagram-icon { opacity: 1 !important; }
        .t2-instagram-tile:hover .t2-instagram-img { transform: scale(1.06); }
        @media (max-width: 900px) {
          .t2-instagram-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .t2-instagram-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  )
}

// Curated demo set, used when no real posts are provided.
const DEMO_POSTS: T2InstagramPost[] = [
  { id: '1', image: '/media/hero images/four-seasons-CapFerrat-pool-hero.jpg', href: 'https://instagram.com/' },
  { id: '2', image: '/media/hotel-programs/belmond-bellini-club/belmond-cap-1500.jpg', href: 'https://instagram.com/' },
  { id: '3', image: '/media/cruises/regent-seven-seas/splendor_atrium-1500.jpg', href: 'https://instagram.com/' },
  { id: '4', image: '/media/hotel-programs/dorchester/dorchester-slider-2-1500.jpg', href: 'https://instagram.com/' },
  { id: '5', image: '/media/hero images/four-seasons-sayan-hero.jpg', href: 'https://instagram.com/' },
  { id: '6', image: '/media/hotel-programs/rocco-forte/roccoforte-slider-1-1500.jpg', href: 'https://instagram.com/' },
]
