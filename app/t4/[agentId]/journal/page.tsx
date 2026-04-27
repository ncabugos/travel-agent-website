import Link from 'next/link'
import { getBlogPosts } from '@/lib/blog'
import { T4PageHero } from '@/components/t4/T4PageHero'

interface PageProps {
  params: Promise<{ agentId: string }>
}

export const metadata = {
  title: 'Journal | Casa Solis',
  description: 'Dispatches, notebooks, and quiet discoveries from the Casa Solis team.',
}

const DEMO_POSTS = [
  {
    slug: 'the-umbrian-house',
    title: 'The house in Umbria, and why we keep going back',
    excerpt:
      'A farmhouse at the edge of Solferino, thirteen rooms, a family that has been there for three generations — and why, every spring, we place clients there first.',
    cover_image_url: '/media/hotel-programs/belmond-bellini-club/belmond-slider-1-1500.jpg',
    published_at: new Date().toISOString(),
    category: 'Notebook',
  },
  {
    slug: 'kyoto-in-march',
    title: 'Kyoto in March — before the tourists, after the frost',
    excerpt:
      'A short case for the three weeks of the year when the temples are empty, the plum trees have opened, and the inns have rooms to give.',
    cover_image_url: '/media/hero images/four-seasons-taormina-suite-hero.jpg',
    published_at: new Date().toISOString(),
    category: 'Dispatch',
  },
  {
    slug: 'the-case-against-cruise-convenience',
    title: 'The case against "cruise convenience"',
    excerpt:
      'Why the busier the itinerary, the less you remember — and the three lines we recommend precisely because they do less, and do it well.',
    cover_image_url: '/media/cruises/regent-seven-seas/splendor_suite-1500.jpg',
    published_at: new Date().toISOString(),
    category: 'Advisor Notes',
  },
  {
    slug: 'an-afternoon-with-belmond',
    title: 'An afternoon with the Bellini Club',
    excerpt: 'Notes from a reconnaissance visit to the Cipriani — what has changed, what has stayed, and what we now book for every client.',
    cover_image_url: '/media/hotel-programs/belmond-bellini-club/belmond-cap-1500.jpg',
    published_at: new Date().toISOString(),
    category: 'Reconnaissance',
  },
  {
    slug: 'the-rooms-with-no-telephone',
    title: 'The rooms with no telephone',
    excerpt: 'An increasingly rare amenity, and our short list of hotels that still honour it — with a note on why it matters.',
    cover_image_url: '/media/hotel-programs/dorchester/dorchester-slider-2-1500.jpg',
    published_at: new Date().toISOString(),
    category: 'Dispatch',
  },
  {
    slug: 'a-letter-to-future-clients',
    title: 'A letter to future clients',
    excerpt: "What we wish every new client knew in the first call — from pacing and planning horizons to how we handle the small, perfect details.",
    cover_image_url: '/media/hotel-programs/rocco-forte/roccoforte-slider-1-1500.jpg',
    published_at: new Date().toISOString(),
    category: 'Notebook',
  },
]

export default async function T4JournalIndexPage({ params }: PageProps) {
  const { agentId } = await params
  const posts = await getBlogPosts(agentId)
  const items = posts.length > 0 ? posts : DEMO_POSTS
  const base = `/t4/${agentId}`

  const [lead, ...rest] = items

  return (
    <>
      <T4PageHero
        image="/media/hotel-programs/aman/aman-hero-2000.jpg"
        imageAlt="The Casa Solis Journal"
        eyebrow="Journal"
        title="The Casa Solis notebook."
        body="Dispatches from the field, our reading, recent reconnaissance, and the occasional long-form letter from the studio."
        imageCaption="The Studio · Solferino"
        size="short"
      />

      <section className="t4-section-wide">
        {/* Lead post */}
        <Link
          href={`${base}/journal/${lead.slug}`}
          style={{ color: 'inherit', textDecoration: 'none', display: 'block' }}
          className="t4-journal-lead"
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.4fr 1fr',
              gap: 64,
              alignItems: 'center',
              marginBottom: 96,
            }}
            className="t4-journal-lead-grid"
          >
            <div
              style={{
                position: 'relative',
                aspectRatio: '16 / 10',
                overflow: 'hidden',
                background: 'var(--t4-bg-alt)',
              }}
            >
              {lead.cover_image_url && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={lead.cover_image_url}
                  alt={lead.title}
                  className="t4-journal-lead-img"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 1.1s var(--t4-ease-out)',
                  }}
                />
              )}
            </div>
            <div>
              <div
                style={{
                  fontFamily: 'var(--t4-font-body)',
                  fontSize: 10,
                  fontWeight: 500,
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  color: 'var(--t4-accent)',
                  marginBottom: 16,
                }}
              >
                {(lead as { category?: string | null }).category ?? 'Journal'}
                {lead.published_at && (
                  <span> · {new Date(lead.published_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
                )}
              </div>
              <h2 className="t4-headline-xl" style={{ marginBottom: 20 }}>
                {lead.title}
              </h2>
              {lead.excerpt && (
                <p className="t4-body t4-body-lg">{lead.excerpt}</p>
              )}
            </div>
          </div>
        </Link>

        {/* Rest */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 32,
            rowGap: 56,
          }}
          className="t4-journal-index-grid"
        >
          {rest.map((p) => (
            <Link
              key={p.slug}
              href={`${base}/journal/${p.slug}`}
              className="t4-journal-card"
              style={{ color: 'inherit', textDecoration: 'none', display: 'block' }}
            >
              <div
                style={{
                  position: 'relative',
                  aspectRatio: '4 / 3',
                  overflow: 'hidden',
                  background: 'var(--t4-bg-alt)',
                  marginBottom: 20,
                }}
              >
                {p.cover_image_url && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={p.cover_image_url}
                    alt={p.title}
                    className="t4-journal-card-img"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 1.1s var(--t4-ease-out)',
                    }}
                  />
                )}
              </div>
              <div
                style={{
                  fontFamily: 'var(--t4-font-body)',
                  fontSize: 10,
                  fontWeight: 500,
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  color: 'var(--t4-accent)',
                  marginBottom: 10,
                }}
              >
                {(p as { category?: string | null }).category ?? 'Journal'}
                {p.published_at && (
                  <span> · {new Date(p.published_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
                )}
              </div>
              <h3 className="t4-headline-md" style={{ marginBottom: 8 }}>
                {p.title}
              </h3>
              {p.excerpt && (
                <p className="t4-body" style={{ margin: 0, fontSize: 14 }}>
                  {p.excerpt.length > 140 ? p.excerpt.slice(0, 137).trimEnd() + '…' : p.excerpt}
                </p>
              )}
            </Link>
          ))}
        </div>
      </section>

      <style>{`
        .t4-journal-lead:hover .t4-journal-lead-img { transform: scale(1.03); }
        .t4-journal-card:hover .t4-journal-card-img { transform: scale(1.04); }
        @media (max-width: 900px) {
          .t4-journal-lead-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .t4-journal-index-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 600px) {
          .t4-journal-index-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
