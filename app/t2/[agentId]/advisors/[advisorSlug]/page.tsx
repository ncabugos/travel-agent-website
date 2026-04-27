import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  getAgencyAdvisor,
  getAllAgencyAdvisorSlugs,
  getAgencyAdvisors,
  type AgencyAdvisor,
} from '@/lib/agency-advisors'

interface PageProps {
  params: Promise<{ agentId: string; advisorSlug: string }>
}

export async function generateStaticParams({ params }: { params: { agentId: string } }) {
  const slugs = await getAllAgencyAdvisorSlugs(params.agentId)
  return slugs.map((advisorSlug) => ({ advisorSlug }))
}

export async function generateMetadata({ params }: PageProps) {
  const { agentId, advisorSlug } = await params
  const advisor = await getAgencyAdvisor(agentId, advisorSlug)
  if (!advisor) return { title: 'Advisor not found' }
  return {
    title: `${advisor.name} · ${advisor.title} | YTC`,
    description: advisor.bio.slice(0, 160),
  }
}

export default async function T2AdvisorDetailPage({ params }: PageProps) {
  const { agentId, advisorSlug } = await params
  const advisor = await getAgencyAdvisor(agentId, advisorSlug)
  if (!advisor) notFound()

  const base = `/t2/${agentId}`
  const roster = await getAgencyAdvisors(agentId)
  const others = roster.filter((a) => a.slug !== advisor.slug).slice(0, 3)

  return (
    <>
      {/* ── Profile hero ───────────────────────────────────────────────── */}
      <section style={{ padding: 'var(--t2-section-pad) 0', background: 'var(--t2-bg)' }}>
        <div
          style={{
            maxWidth: 'var(--t2-content-max, 1280px)',
            margin: '0 auto',
            padding: '0 48px',
          }}
        >
          {/* Breadcrumb */}
          <div
            style={{
              fontFamily: 'var(--t2-font-sans)',
              fontSize: 11,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--t2-text-muted)',
              marginBottom: 32,
            }}
          >
            <Link
              href={`${base}/advisors`}
              style={{ color: 'inherit', textDecoration: 'none' }}
            >
              ← All Advisors
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1.4fr',
              gap: 72,
              alignItems: 'start',
            }}
            className="t2-advisor-detail-grid"
          >
            {/* Portrait */}
            <div
              style={{
                position: 'relative',
                aspectRatio: '3 / 4',
                overflow: 'hidden',
                background: 'var(--t2-bg-alt)',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={advisor.photo}
                alt={advisor.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center top',
                }}
              />
            </div>

            {/* Copy */}
            <div>
              <p className="t2-label" style={{ marginBottom: 14 }}>{advisor.title}</p>
              <h1 className="t2-heading t2-heading-xl" style={{ marginBottom: 16 }}>
                {advisor.name}
              </h1>
              {advisor.tagline && (
                <p
                  style={{
                    fontFamily: 'var(--t2-font-serif)',
                    fontStyle: 'italic',
                    fontSize: 20,
                    color: 'var(--t2-accent)',
                    lineHeight: 1.5,
                    margin: '0 0 32px',
                  }}
                >
                  {advisor.tagline}
                </p>
              )}

              <p className="t2-body" style={{ marginBottom: 40, maxWidth: 640 }}>
                {advisor.bio}
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 24,
                  borderTop: '1px solid var(--t2-divider)',
                  paddingTop: 24,
                  marginBottom: 40,
                }}
                className="t2-advisor-stats"
              >
                {advisor.years_advising !== undefined && (
                  <StatBlock value={String(advisor.years_advising)} label="Years Advising" />
                )}
                <StatBlock value={String(advisor.destinations.length)} label="Regions Covered" />
                {advisor.languages && advisor.languages.length > 0 && (
                  <StatBlock value={String(advisor.languages.length)} label="Languages" />
                )}
              </div>

              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <Link
                  href={`${base}/contact?advisor=${advisor.slug}`}
                  className="t2-btn t2-btn-accent"
                >
                  Work with {advisor.name.split(' ')[0]}
                </Link>
                {advisor.email && (
                  <a
                    href={`mailto:${advisor.email}`}
                    className="t2-btn t2-btn-outline"
                  >
                    Email Directly
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Specialties ────────────────────────────────────────────────── */}
      <section style={{ padding: 'var(--t2-section-pad) 48px', background: 'var(--t2-bg-alt)' }}>
        <div
          style={{
            maxWidth: 'var(--t2-content-max, 1280px)',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 56,
          }}
          className="t2-advisor-specs"
        >
          <SpecList title="Travel Specialties" items={advisor.specialties} />
          <SpecList title="Regions I Know Personally" items={advisor.destinations} />
          {advisor.languages && advisor.languages.length > 0 && (
            <SpecList title="Languages" items={advisor.languages} />
          )}
        </div>
      </section>

      {/* ── Meet other advisors ────────────────────────────────────────── */}
      {others.length > 0 && (
        <section style={{ padding: 'var(--t2-section-pad) 48px', background: 'var(--t2-bg)' }}>
          <div style={{ maxWidth: 'var(--t2-content-max, 1280px)', margin: '0 auto' }}>
            <div style={{ marginBottom: 40 }}>
              <p className="t2-label" style={{ marginBottom: 16 }}>Also on the team</p>
              <h2 className="t2-heading t2-heading-lg">Meet the rest of YTC.</h2>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 24,
              }}
              className="t2-advisor-related-grid"
            >
              {others.map((a) => (
                <RelatedAdvisorCard key={a.slug} advisor={a} base={base} />
              ))}
            </div>
          </div>
        </section>
      )}

      <style>{`
        @media (max-width: 1000px) {
          .t2-advisor-detail-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .t2-advisor-specs { grid-template-columns: 1fr !important; gap: 32px !important; }
          .t2-advisor-related-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 600px) {
          .t2-advisor-related-grid { grid-template-columns: 1fr !important; }
          .t2-advisor-stats { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </>
  )
}

function StatBlock({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div
        style={{
          fontFamily: 'var(--t2-font-serif)',
          fontSize: 'clamp(26px, 2.6vw, 38px)',
          fontWeight: 400,
          color: 'var(--t2-accent)',
          lineHeight: 1,
          marginBottom: 6,
          letterSpacing: '-0.02em',
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontFamily: 'var(--t2-font-sans)',
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--t2-text-muted)',
        }}
      >
        {label}
      </div>
    </div>
  )
}

function SpecList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div
        style={{
          fontFamily: 'var(--t2-font-sans)',
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'var(--t2-accent)',
          marginBottom: 16,
        }}
      >
        {title}
      </div>
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        {items.map((i) => (
          <li
            key={i}
            style={{
              fontFamily: 'var(--t2-font-serif)',
              fontSize: 15,
              color: 'var(--t2-text)',
              fontWeight: 400,
              paddingBottom: 10,
              borderBottom: '1px solid var(--t2-divider)',
            }}
          >
            {i}
          </li>
        ))}
      </ul>
    </div>
  )
}

function RelatedAdvisorCard({
  advisor,
  base,
}: {
  advisor: AgencyAdvisor
  base: string
}) {
  return (
    <Link
      href={`${base}/advisors/${advisor.slug}`}
      className="t2-related-advisor"
      style={{
        display: 'flex',
        gap: 20,
        color: 'inherit',
        textDecoration: 'none',
        padding: 16,
        background: '#fff',
        border: '1px solid var(--t2-divider)',
        transition: 'border-color 0.3s ease',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: 96,
          aspectRatio: '3 / 4',
          overflow: 'hidden',
          background: 'var(--t2-bg-alt)',
          flexShrink: 0,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={advisor.photo}
          alt={advisor.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
          }}
        />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div
          style={{
            fontFamily: 'var(--t2-font-sans)',
            fontSize: 9,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--t2-accent)',
            fontWeight: 500,
            marginBottom: 6,
          }}
        >
          {advisor.title}
        </div>
        <div
          style={{
            fontFamily: 'var(--t2-font-serif)',
            fontSize: 18,
            fontWeight: 400,
            color: 'var(--t2-text)',
            lineHeight: 1.25,
            marginBottom: 8,
          }}
        >
          {advisor.name}
        </div>
        <div
          style={{
            fontFamily: 'var(--t2-font-sans)',
            fontSize: 10,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--t2-accent)',
            fontWeight: 500,
            marginTop: 'auto',
          }}
        >
          View Profile →
        </div>
      </div>
    </Link>
  )
}
