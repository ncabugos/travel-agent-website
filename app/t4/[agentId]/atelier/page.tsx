import Link from 'next/link'
import Image from 'next/image'
import { T4PageHero } from '@/components/t4/T4PageHero'

interface PageProps {
  params: Promise<{ agentId: string }>
}

export const metadata = {
  title: 'The Atelier | Casa Solis',
  description:
    'The philosophy behind Casa Solis — how we plan, why we plan so little, and what we mean by quiet luxury.',
}

const PRINCIPLES = [
  {
    number: '01',
    title: 'We plan few trips.',
    body:
      'Each advisor at Casa Solis takes on fewer than forty clients a year. The math is simple: fewer clients, more attention, no handovers. It is also why we turn most prospective clients away.',
  },
  {
    number: '02',
    title: 'The advisor stays.',
    body:
      'The advisor you first speak to plans your trip, answers your calls, and is still on your file five years later. No account managers, no junior handlers, no middle-of-the-night escalations to strangers.',
  },
  {
    number: '03',
    title: 'Knowledge is recent.',
    body:
      'We do not sell from old trip reports. Our advisors travel six to eight weeks of the year — most recently, most of us, in the places you are about to visit. The recommendations you hear are from this year, not last.',
  },
  {
    number: '04',
    title: 'Access, not discounts.',
    body:
      'Our value is not in rebates. It is in the suite that was never listed, the table no one else can book, the guide who usually only works for a single family. These are the things our clients return for.',
  },
  {
    number: '05',
    title: 'We write letters.',
    body:
      'Before every departure, by hand, on paper. It is an old habit and we mean to keep it. Some clients frame them. One keeps every letter from twelve years, and that, frankly, is the honour of this work.',
  },
  {
    number: '06',
    title: 'Quiet by design.',
    body:
      'We do not publicise the trips we plan, the clients we plan them for, or the properties that book through us. Our work arrives through word of mouth, and it will keep arriving that way.',
  },
]

export default async function T4AtelierPage({ params }: PageProps) {
  const { agentId } = await params
  const base = `/t4/${agentId}`

  return (
    <>
      <T4PageHero
        image="/media/hotel-programs/rocco-forte/Rocco-Forte-hotels-Hero-2000.jpg"
        imageAlt="The Atelier at Casa Solis"
        eyebrow="The Atelier"
        title="The philosophy behind the house."
        body="Six principles we refuse to compromise on — written down so that clients, and advisors, can hold us to them."
        imageCaption="The Studio · Solferino"
      />

      {/* ── Principles ─────────────────────────────────────────────────── */}
      <section className="t4-section">
        <div style={{ maxWidth: 880, margin: '0 auto 96px', textAlign: 'center' }}>
          <span className="t4-eyebrow t4-eyebrow-center" style={{ justifyContent: 'center' }}>
            Six Principles
          </span>
          <h2 className="t4-headline-xl" style={{ marginTop: 28, marginBottom: 24 }}>
            A small agency, on purpose.
          </h2>
          <p className="t4-body t4-body-lg">
            Casa Solis has always been small. We believe the very best travel
            advice comes from the very smallest teams — and we have arranged the
            house around that conviction.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            columnGap: 80,
            rowGap: 72,
          }}
          className="t4-principles-grid"
        >
          {PRINCIPLES.map((p) => (
            <div key={p.number}>
              <div
                style={{
                  fontFamily: 'var(--t4-font-display)',
                  fontSize: 64,
                  fontWeight: 300,
                  lineHeight: 1,
                  color: 'var(--t4-accent)',
                  marginBottom: 20,
                  letterSpacing: '-0.02em',
                }}
              >
                {p.number}
              </div>
              <h3 className="t4-headline-md" style={{ marginBottom: 16, fontSize: 'clamp(22px, 2vw, 28px)' }}>
                {p.title}
              </h3>
              <p className="t4-body">{p.body}</p>
            </div>
          ))}
        </div>

        <style>{`
          @media (max-width: 700px) {
            .t4-principles-grid { grid-template-columns: 1fr !important; row-gap: 56px !important; }
          }
        `}</style>
      </section>

      {/* ── Long-form feature — The Studio ─────────────────────────────── */}
      <section
        style={{
          background: 'var(--t4-bg-alt)',
          padding: 'var(--t4-section-pad) 48px',
        }}
      >
        <div
          style={{
            maxWidth: 'var(--t4-content-wide)',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1fr 1.1fr',
            gap: 96,
            alignItems: 'center',
          }}
          className="t4-studio-grid"
        >
          <div
            style={{
              position: 'relative',
              aspectRatio: '3 / 4',
              overflow: 'hidden',
              background: 'var(--t4-bg)',
            }}
          >
            <Image
              src="/media/hotel-programs/belmond-bellini-club/belmond-slider-2-1500.jpg"
              alt="The Casa Solis studio"
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
              style={{ objectFit: 'cover' }}
              unoptimized
            />
          </div>

          <div>
            <span className="t4-eyebrow">The Studio</span>
            <h2 className="t4-headline-xl" style={{ marginTop: 28, marginBottom: 32 }}>
              Solferino, 2011.
            </h2>
            <p className="t4-body t4-body-lg" style={{ marginBottom: 24 }}>
              Casa Solis began in a single room above a stationer&apos;s shop in
              Solferino. A desk, a telephone, a quiet understanding with the
              postmistress next door, and a short list of families who had
              previously travelled with Alessandra as a private concierge.
            </p>
            <p className="t4-body t4-body-lg" style={{ marginBottom: 24 }}>
              Fourteen years later, the house still occupies that building —
              now with four more rooms, a courtyard we eat lunch in, and six
              advisors, none of whom came from the travel industry. They
              arrived from museums, embassies, hospitality, and private service.
              That was not an accident. We hire for judgment first, and
              operational skills second. The operational skills can be taught.
              The judgment, in our experience, cannot.
            </p>
            <p className="t4-body t4-body-lg">
              We still take calls on the ground floor. We still answer the door
              by hand. And we still write to every client the week before they
              leave.
            </p>
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            .t4-studio-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
          }
        `}</style>
      </section>

      {/* ── Pull-quote ─────────────────────────────────────────────────── */}
      <section
        style={{
          background: 'var(--t4-bg)',
          padding: 'var(--t4-section-pad) 48px',
        }}
      >
        <div style={{ maxWidth: 820, margin: '0 auto', textAlign: 'center' }}>
          <span className="t4-ornament" />
          <blockquote
            style={{
              margin: '40px 0 28px',
              fontFamily: 'var(--t4-font-display)',
              fontStyle: 'italic',
              fontSize: 'clamp(24px, 3vw, 38px)',
              lineHeight: 1.35,
              fontWeight: 300,
              color: 'var(--t4-text)',
            }}
          >
            &ldquo;We do not sell travel. We write trips — slowly, by hand, one
            at a time — for people we come to know very well.&rdquo;
          </blockquote>
          <p
            style={{
              fontFamily: 'var(--t4-font-body)',
              fontSize: 10,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'var(--t4-text-muted)',
              fontWeight: 500,
            }}
          >
            — Alessandra Ricci, Founder
          </p>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────── */}
      <section
        className="t4-section-dark"
        style={{ padding: 'var(--t4-section-pad) 48px', textAlign: 'center' }}
      >
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <span
            className="t4-eyebrow t4-eyebrow-center"
            style={{ color: 'var(--t4-accent-soft)', justifyContent: 'center' }}
          >
            Begin
          </span>
          <h2
            className="t4-headline-xl"
            style={{ color: 'var(--t4-dark-text)', marginTop: 28, marginBottom: 28 }}
          >
            The conversation is the first step.
          </h2>
          <p
            style={{
              color: 'rgba(251, 248, 241, 0.72)',
              fontFamily: 'var(--t4-font-body)',
              fontSize: 17,
              lineHeight: 1.78,
              maxWidth: 560,
              margin: '0 auto 40px',
              fontWeight: 300,
            }}
          >
            We take on a small number of new clients each year. If you would
            like to speak with us, begin with a short note.
          </p>
          <Link href={`${base}/contact`} className="t4-btn t4-btn-solid-light">
            Begin a Conversation
          </Link>
        </div>
      </section>
    </>
  )
}
