export interface T4InstagramPost {
  id: string
  image: string
  href: string
  caption?: string
}

interface T4InstagramFeedProps {
  handle: string
  profileUrl?: string
  eyebrow?: string
  heading?: string
  posts?: T4InstagramPost[]
  limit?: number
}

/**
 * T4 instagram feed — quiet 6-tile square grid with minimal header.
 */
export function T4InstagramFeed({
  handle,
  profileUrl,
  eyebrow = 'On Instagram',
  heading,
  posts,
  limit = 6,
}: T4InstagramFeedProps) {
  const items = (posts && posts.length > 0 ? posts : DEMO_POSTS).slice(0, limit)
  const clean = handle.startsWith('@') ? handle : `@${handle}`
  const url = profileUrl ?? `https://www.instagram.com/${handle.replace(/^@/, '')}`
  const displayHeading = heading ?? `Follow at ${clean}`

  return (
    <section style={{ padding: 'var(--t4-section-pad) 48px', background: 'var(--t4-bg-alt)' }}>
      <div style={{ maxWidth: 'var(--t4-content-wide)', margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: 32,
            alignItems: 'end',
            marginBottom: 40,
          }}
          className="t4-instagram-header"
        >
          <div>
            <span className="t4-eyebrow">{eyebrow}</span>
            <h2 className="t4-headline-xl" style={{ marginTop: 24 }}>
              {displayHeading}
            </h2>
          </div>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="t4-link"
          >
            Follow
            <span className="t4-arrow">→</span>
          </a>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: 4,
          }}
          className="t4-instagram-grid"
        >
          {items.map((p) => (
            <a
              key={p.id}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="t4-instagram-tile"
              style={{
                position: 'relative',
                aspectRatio: '1 / 1',
                overflow: 'hidden',
                display: 'block',
                background: 'var(--t4-bg)',
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
                  transition: 'transform 0.8s var(--t4-ease-out)',
                }}
                className="t4-instagram-img"
              />
              <div
                className="t4-instagram-overlay"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(43, 38, 32, 0)',
                  transition: 'background 0.3s var(--t4-ease)',
                }}
              />
            </a>
          ))}
        </div>
      </div>

      <style>{`
        .t4-instagram-tile:hover .t4-instagram-img { transform: scale(1.06); }
        .t4-instagram-tile:hover .t4-instagram-overlay { background: rgba(43, 38, 32, 0.16); }
        @media (max-width: 900px) {
          .t4-instagram-header { grid-template-columns: 1fr !important; gap: 20px !important; }
          .t4-instagram-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .t4-instagram-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  )
}

const DEMO_POSTS: T4InstagramPost[] = [
  { id: '1', image: '/media/hero images/four-seasons-CapFerrat-pool-hero.jpg', href: 'https://instagram.com/' },
  { id: '2', image: '/media/hotel-programs/belmond-bellini-club/belmond-cap-1500.jpg', href: 'https://instagram.com/' },
  { id: '3', image: '/media/cruises/regent-seven-seas/splendor_atrium-1500.jpg', href: 'https://instagram.com/' },
  { id: '4', image: '/media/hotel-programs/dorchester/dorchester-slider-2-1500.jpg', href: 'https://instagram.com/' },
  { id: '5', image: '/media/hero images/four-seasons-sayan-hero.jpg', href: 'https://instagram.com/' },
  { id: '6', image: '/media/hotel-programs/rocco-forte/roccoforte-slider-1-1500.jpg', href: 'https://instagram.com/' },
]
