import Link from 'next/link'
import type { BlogPost } from '@/types/index'
import { Reveal } from './Reveal'

interface WWT2JournalProps {
  /** Published posts visible to this advisor (DB blog_posts). */
  posts: BlogPost[]
  base: string
}

function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  } catch {
    return ''
  }
}

/**
 * The Journal — DB-driven (blog_posts). Real posts render as a three-up
 * editorial grid; when the feed is still empty, a quiet invitation stands in
 * rather than fabricated entries.
 */
export function WWT2Journal({ posts, base }: WWT2JournalProps) {
  const featured = posts.slice(0, 3)

  return (
    <section id="ch-journal" className="wwt-section wwt2-journal">
      <div className="wwt-shell">
        <Reveal className="wwt2-journal-head">
          <div className="wwt2-journal-headings">
            <p className="wwt-eyebrow">Inspiration</p>
            <h2 className="wwt-display wwt-h2 wwt2-journal-title">From the journal.</h2>
            <p className="wwt-body wwt2-journal-lede">
              Wine regions, wellness resorts, and the properties worth the detour — written
              after we have been there.
            </p>
          </div>
          <Link href={`${base}/journal`} className="wwt-link wwt2-journal-all">
            All entries
          </Link>
        </Reveal>

        {featured.length > 0 ? (
          <div className="wwt2-journal-grid">
            {featured.map((post, i) => (
              <Reveal key={post.id} as="article" className="wwt2-journal-card" delay={i * 90}>
                <Link href={`${base}/journal/${post.slug}`} className="wwt2-journal-link">
                  <div
                    className="wwt2-journal-img"
                    style={
                      post.cover_image_url
                        ? { backgroundImage: `url("${post.cover_image_url}")` }
                        : undefined
                    }
                  />
                  <div className="wwt2-journal-body">
                    <span className="wwt2-journal-meta">
                      {post.categories?.[0] ? `${post.categories[0]} · ` : ''}
                      {fmtDate(post.published_at)}
                    </span>
                    <h3 className="wwt-display wwt2-journal-card-title">{post.title}</h3>
                    {post.excerpt && <p className="wwt2-journal-excerpt">{post.excerpt}</p>}
                    <span className="wwt-link wwt2-journal-read">Read</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal className="wwt2-journal-empty">
            <p className="wwt2-journal-empty-text">
              New stories are published throughout the season — from the cellars, spas, and tables
              we visit.
            </p>
            <Link href={`${base}/journal`} className="wwt-btn">
              Visit the Journal
            </Link>
          </Reveal>
        )}
      </div>

      <style>{`
        .wwt2-journal { overflow: hidden; }
        /* The scrolling marquee that used to crown this section was removed: its
           track measured 6,505px inside a 1,280px viewport, and a reader only
           ever saw partial words clipped at both edges. A standard section
           header carries the same job without the overflow. */
        .wwt2-journal-headings { max-width: 46ch; }
        .wwt2-journal-title { margin: 1.1rem 0 0.9rem; }
        .wwt2-journal-lede { max-width: 44ch; margin: 0; }

        .wwt2-journal-head {
          display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 1.5rem;
          margin-bottom: clamp(2.5rem, 5vw, 4rem);
        }

        .wwt2-journal-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(1.5rem, 3vw, 2.5rem); }
        .wwt2-journal-link { display: block; text-decoration: none; color: inherit; }
        .wwt2-journal-img {
          aspect-ratio: 4 / 3; background-size: cover; background-position: center;
          background-color: var(--wwt-sand); transition: filter 600ms var(--wwt-ease);
        }
        .wwt2-journal-link:hover .wwt2-journal-img { filter: brightness(1.04); }
        .wwt2-journal-body { padding-top: 1.3rem; }
        .wwt2-journal-meta {
          font-family: var(--wwt-sans); font-size: 0.68rem; font-weight: 500;
          text-transform: uppercase; letter-spacing: 0.18em; color: var(--wwt-stone);
        }
        .wwt2-journal-card-title { font-size: clamp(1.3rem, 1.7vw, 1.6rem); margin: 0.7rem 0; }
        .wwt2-journal-excerpt {
          font-family: var(--wwt-sans); font-weight: 300; font-size: 0.95rem;
          color: var(--wwt-ink-soft); margin-bottom: 1.1rem; max-width: 40ch;
        }
        .wwt2-journal-empty {
          border-top: 1px solid var(--wwt-clay); padding-top: 2.4rem;
          display: flex; flex-direction: column; align-items: flex-start; gap: 1.8rem;
        }
        .wwt2-journal-empty-text {
          font-family: var(--wwt-serif); font-weight: 300; font-size: clamp(1.4rem, 2.4vw, 2rem);
          line-height: 1.4; color: var(--wwt-ink-soft); max-width: 30ch;
        }
        @media (max-width: 820px) { .wwt2-journal-grid { grid-template-columns: 1fr; gap: 2.4rem; } }
      `}</style>
    </section>
  )
}
