import Link from 'next/link'
import { T3PageHero } from '@/components/t3/T3PageHero'

interface PageProps {
  params: Promise<{ agentId: string }>
}

const TEAM = [
  {
    name: 'Eleanor Price',
    title: 'Founder & Principal Advisor',
    photo: '/media/team/agent-sarah-chen.png',
    bio: 'A former hotelier turned advisor, Eleanor founded Meridian & Company after two decades in luxury hospitality — most recently as guest experience director at one of Europe\'s most celebrated private-island resorts. Her relationships span three generations of the industry, from general managers to head butlers.',
    specialties: ['Private islands & residences', 'European grand hotels', 'Multi-generational travel'],
  },
  {
    name: 'Marcus Hale',
    title: 'Voyages & Expedition Lead',
    photo: '/media/team/agent-james-whitmore.png',
    bio: 'Marcus designed private yacht and expedition charters for a decade before joining Meridian. He holds preferred advisor status with Regent Seven Seas, Silversea, Seabourn, and Ponant — and has personally sailed the Northwest Passage twice.',
    specialties: ['Ultra-luxury ocean', 'Polar & expedition', 'Private yacht charters'],
  },
  {
    name: 'Yuki Tanaka',
    title: 'Asia-Pacific Specialist',
    photo: '/media/team/agent-isabelle-moreau.png',
    bio: 'Based between Kyoto and Singapore, Yuki opens doors across Asia that are quite simply invisible from the outside. A former curator at a private museum in Tokyo, she blends art, cuisine, and access in a way that is impossible to replicate.',
    specialties: ['Japan & Korea', 'Private access & art', 'Cultural immersion'],
  },
]

const VALUES = [
  {
    num: '01',
    label: 'Considered, not catalogued',
    body: 'We do not keep a database of destinations. Each recommendation comes from someone on our team who has been, recently, and can speak to the experience of this month — not last year.',
  },
  {
    num: '02',
    label: 'One advisor, start to finish',
    body: 'The person you speak to on the first call is the person who handles your booking, your on-the-ground issues, and your return. No account handovers, no junior assistants.',
  },
  {
    num: '03',
    label: 'Access, not discounts',
    body: 'We are not a rebate business. Our value is introductions: the suite that was never listed, the table no one else can book, the guide who usually works privately for a family.',
  },
  {
    num: '04',
    label: 'Quiet by design',
    body: 'We do not publicise the journeys we create. Our clients arrive through word of mouth, and they stay for the same reason.',
  },
]

export default async function T3AboutPage({ params }: PageProps) {
  const { agentId } = await params
  const base = `/t3/${agentId}`

  return (
    <>
      <T3PageHero
        image="/media/hotel-programs/four-seasons/fs-maui-ocean_suite-3840x2160.jpg"
        imageAlt="About Meridian & Company"
        eyebrow="About"
        title="A studio for the considered traveler."
        body="Founded in Boston in 2004, Meridian & Company is a travel studio — not an agency — quietly advising a small group of clients on how to see the world at its most extraordinary."
        imageCaption="Four Seasons Maui · Wailea"
      />

      {/* ── 01 · Studio Story ──────────────────────────────────────────── */}
      <section className="t3-section">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.3fr',
            gap: 96,
            alignItems: 'center',
          }}
          className="t3-about-story"
        >
          <div
            style={{
              position: 'relative',
              aspectRatio: '3 / 4',
              overflow: 'hidden',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/hotel-programs/belmond-bellini-club/belmond-hero-2000.jpg"
              alt="Our story"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div>
            <span className="t3-eyebrow">01 — The Studio</span>
            <h2 className="t3-headline-xl" style={{ marginTop: 28, marginBottom: 32 }}>
              Twenty-two years, one principle.
            </h2>
            <p className="t3-body t3-body-lg" style={{ marginBottom: 24 }}>
              Meridian began with a simple observation: the travelers we most admired never booked through agencies. They relied on a handful of trusted friends-in-the-business — people who remembered their preferences, knew the right people, and picked up the phone on a Sunday.
            </p>
            <p className="t3-body t3-body-lg" style={{ marginBottom: 40 }}>
              We set out to be those people, for a small group of clients. Today, we remain deliberately small: four advisors, a shared address book that has taken two decades to build, and an unwavering conviction that the best journeys are born in conversation.
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 32,
                borderTop: '1px solid var(--t3-divider)',
                paddingTop: 40,
              }}
              className="t3-about-stats"
            >
              {[
                { num: '22', label: 'Years Advising' },
                { num: '64', label: 'Countries' },
                { num: '2,400+', label: 'Journeys Shaped' },
              ].map((s) => (
                <div key={s.label}>
                  <div
                    className="t3-headline-lg"
                    style={{
                      color: 'var(--t3-accent)',
                      fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
                      marginBottom: 8,
                    }}
                  >
                    {s.num}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      color: 'var(--t3-text-muted)',
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 02 · Values ──────────────────────────────────────────────────── */}
      <section className="t3-section t3-section-alt">
        <div style={{ maxWidth: 820, marginBottom: 80 }}>
          <span className="t3-eyebrow">02 — How We Work</span>
          <h2 className="t3-headline-xl" style={{ marginTop: 28 }}>
            Four principles we refuse to compromise on.
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 64,
            rowGap: 80,
          }}
          className="t3-values-grid"
        >
          {VALUES.map((v) => (
            <div key={v.num}>
              <div
                style={{
                  fontFamily: 'var(--t3-font-display)',
                  fontSize: 48,
                  fontWeight: 400,
                  color: 'var(--t3-accent)',
                  marginBottom: 16,
                  letterSpacing: '-0.02em',
                }}
              >
                {v.num}
              </div>
              <h3 className="t3-headline-md" style={{ marginBottom: 16 }}>
                {v.label}
              </h3>
              <p className="t3-body">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 03 · Team ────────────────────────────────────────────────────── */}
      <section className="t3-section">
        <div style={{ textAlign: 'center', marginBottom: 80, maxWidth: 680, margin: '0 auto 80px' }}>
          <span className="t3-eyebrow" style={{ justifyContent: 'center' }}>
            03 — The People
          </span>
          <h2 className="t3-headline-xl" style={{ marginTop: 28 }}>
            A small team, intentionally.
          </h2>
          <p className="t3-body t3-body-lg" style={{ marginTop: 24, marginLeft: 'auto', marginRight: 'auto' }}>
            We have turned away far more clients than we have taken on. That choice is what lets us answer the phone when it matters.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 48,
          }}
          className="t3-team-grid"
        >
          {TEAM.map((member) => (
            <div key={member.name}>
              <div
                style={{
                  position: 'relative',
                  aspectRatio: '3 / 4',
                  overflow: 'hidden',
                  marginBottom: 28,
                  background: 'var(--t3-bg-alt)',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={member.photo}
                  alt={member.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center top',
                  }}
                />
              </div>

              <h3 className="t3-headline-md" style={{ marginBottom: 6 }}>
                {member.name}
              </h3>
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 500,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--t3-accent)',
                  marginBottom: 20,
                }}
              >
                {member.title}
              </p>

              <div
                style={{
                  width: 32,
                  height: 1,
                  background: 'var(--t3-divider)',
                  marginBottom: 20,
                }}
              />

              <p className="t3-body" style={{ fontSize: 14, marginBottom: 20 }}>
                {member.bio}
              </p>

              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                {member.specialties.map((s) => (
                  <li
                    key={s}
                    style={{
                      fontSize: 12,
                      color: 'var(--t3-text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-block',
                        width: 6,
                        height: 6,
                        background: 'var(--t3-accent)',
                      }}
                    />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── 04 · Quote ────────────────────────────────────────────────────── */}
      <section
        style={{
          position: 'relative',
          minHeight: 520,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '120px 48px',
          overflow: 'hidden',
          background: 'var(--t3-dark-bg)',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/media/hotel-programs/aman/aman-hero-2000.jpg"
          alt=""
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.42,
          }}
        />
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            maxWidth: 820,
            textAlign: 'center',
            color: '#fff',
          }}
        >
          <span
            className="t3-eyebrow"
            style={{ color: 'rgba(255,255,255,0.72)', justifyContent: 'center', marginBottom: 40 }}
          >
            04 — In Eleanor&apos;s Words
          </span>
          <p
            className="t3-headline-lg"
            style={{
              fontStyle: 'italic',
              color: '#fff',
              lineHeight: 1.25,
              marginTop: 32,
            }}
          >
            &ldquo;Our clients do not come to us for a holiday. They come because they have already been everywhere, and they want someone to find them the places that still feel like a secret.&rdquo;
          </p>
          <p
            style={{
              marginTop: 40,
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.72)',
            }}
          >
            Eleanor Price — Founder
          </p>
        </div>
      </section>

      {/* ── 05 · CTA ─────────────────────────────────────────────────────── */}
      <section className="t3-section t3-section-alt" style={{ textAlign: 'center' }}>
        <span className="t3-eyebrow" style={{ justifyContent: 'center' }}>
          05 — Begin
        </span>
        <h2 className="t3-headline-xl" style={{ marginTop: 28, maxWidth: 720, marginLeft: 'auto', marginRight: 'auto' }}>
          Tell us what you&apos;re dreaming of.
        </h2>
        <p
          className="t3-body t3-body-lg"
          style={{ marginTop: 24, marginLeft: 'auto', marginRight: 'auto', marginBottom: 48 }}
        >
          We begin every engagement with a conversation. No forms, no templates — just a phone call at a time that works for you.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap' }}>
          <Link href={`${base}/plan-a-trip`} className="t3-btn t3-btn-solid">
            Plan a Trip
          </Link>
          <Link href={`${base}/contact`} className="t3-btn t3-btn-ghost-dark">
            Contact Us
          </Link>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .t3-about-story { grid-template-columns: 1fr !important; gap: 48px !important; }
          .t3-values-grid { grid-template-columns: 1fr !important; gap: 56px !important; }
          .t3-team-grid { grid-template-columns: 1fr !important; gap: 64px !important; }
          .t3-about-stats { grid-template-columns: repeat(3, 1fr) !important; }
        }
      `}</style>
    </>
  )
}
