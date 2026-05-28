import Image from 'next/image'

interface JournalCard {
  category: string
  title: string
  excerpt: string
  image: string
  readTime: string
}

const JOURNAL_CARDS: JournalCard[] = [
  {
    category: 'Destination Guide',
    title: 'The Amalfi Coast in early October — the season you actually want to book',
    excerpt: 'When the day-trippers are gone, when the lemon harvest begins, and what to ask your advisor to arrange before the boutique hotels close for the year.',
    image: '/media/hotel-programs/belmond-bellini-club/belmond-hero-2000.jpg',
    readTime: '6 min read',
  },
  {
    category: 'Hotel Spotlight',
    title: 'Inside the Dorchester Diamond Club: what changes when you book through an advisor',
    excerpt: 'A walkthrough of the Mayfair flagship — and the four benefits that arrive automatically on every Diamond Club stay.',
    image: '/media/hotel-programs/dorchester/dorchester-hero-2000.jpg',
    readTime: '5 min read',
  },
  {
    category: 'Voyages',
    title: 'River cruising for first-timers: AMA, Avalon, or Uniworld?',
    excerpt: 'A side-by-side on cabin design, dining philosophy, and shore experiences — and why the right answer depends entirely on the type of traveler you are.',
    image: '/media/hotel-programs/four-seasons/fs-hero-2200.jpg',
    readTime: '8 min read',
  },
  {
    category: "Editor's Notes",
    title: "Why the best advisors don’t talk about pricing",
    excerpt: 'A reflection on the kind of conversation that earns long-term clients — and the questions to ask instead.',
    image: '/media/hotel-programs/aman/aman-hero-2000.jpg',
    readTime: '4 min read',
  },
  {
    category: 'Destination Guide',
    title: 'Tokyo in November: the week the city slows down',
    excerpt: 'Why the autumn shoulder is the city’s best-kept secret for couples — and the three neighborhoods to base yourself in.',
    image: '/media/hotel-programs/mandarin-oriental/mandarin-hero-2000.jpg',
    readTime: '7 min read',
  },
  {
    category: 'Itinerary',
    title: 'A week in the Mara, designed for travelers who’ve done safari before',
    excerpt: 'Two private conservancies, one mobile camp, and the family-run lodge that most Western travelers haven’t heard of yet.',
    image: '/media/hotel-programs/peninsula/peninsula-hero.jpg',
    readTime: '9 min read',
  },
]

export function MarketingCuratedEditorial() {
  return (
    <section
      style={{
        padding: '120px 0 100px',
        background: '#fafafa',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ maxWidth: '720px', marginBottom: '56px' }}>
          <span
            style={{
              display: 'inline-block',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: '#7c3aed',
              marginBottom: '20px',
            }}
          >
            Curated Editorial
          </span>
          <h2
            style={{
              fontSize: 'clamp(32px, 4vw, 44px)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              margin: '0 0 20px',
              color: '#0a0a0a',
            }}
          >
            A journal that publishes itself.
          </h2>
          <p
            style={{
              fontSize: '17px',
              lineHeight: 1.65,
              color: '#52525b',
              margin: 0,
              maxWidth: '640px',
            }}
          >
            Our in-house editorial team publishes destination guides, hotel spotlights, and travel
            tips on a weekly cadence. You pick the categories that fit your brand. Articles drop onto
            your site automatically — no writing, no scheduling, no maintenance. Real content for
            SEO and client emails.
          </p>
        </div>
      </div>

      {/* Horizontal scroll array of cards — Stripe-style */}
      <div
        className="eah-journal-scroll"
        style={{
          display: 'flex',
          gap: '20px',
          padding: '8px 24px 32px',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollPadding: '0 24px',
          maxWidth: '100vw',
        }}
      >
        {JOURNAL_CARDS.map((card, i) => (
          <article
            key={i}
            style={{
              flex: '0 0 360px',
              scrollSnapAlign: 'start',
              background: '#fff',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid #ececec',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column',
            }}
            className="eah-journal-card"
          >
            <div style={{ position: 'relative', aspectRatio: '4 / 3', background: '#f4f4f4' }}>
              <Image
                src={card.image}
                alt=""
                fill
                sizes="360px"
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div style={{ padding: '22px 22px 24px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: '#7c3aed',
                }}
              >
                {card.category}
              </span>
              <h3
                style={{
                  margin: 0,
                  fontSize: '18px',
                  fontWeight: 600,
                  letterSpacing: '-0.01em',
                  lineHeight: 1.3,
                  color: '#0a0a0a',
                }}
              >
                {card.title}
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: '14px',
                  lineHeight: 1.6,
                  color: '#71717a',
                  flex: 1,
                }}
              >
                {card.excerpt}
              </p>
              <span style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                {card.readTime}
              </span>
            </div>
          </article>
        ))}
      </div>

      <style>{`
        .eah-journal-scroll::-webkit-scrollbar { height: 8px; }
        .eah-journal-scroll::-webkit-scrollbar-track { background: transparent; }
        .eah-journal-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.12); border-radius: 4px; }
        .eah-journal-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .eah-journal-card:hover { transform: translateY(-3px); box-shadow: 0 12px 30px -12px rgba(0,0,0,0.15); }
      `}</style>
    </section>
  )
}
