import Image from 'next/image'
import Link from 'next/link'
import { EDEN } from '@/lib/media-library'

interface TeamIntroBandProps {
  agentId: string
  /** Optional circular team portrait URL */
  photoUrl?: string | null
  agencyName?: string | null
  tagline?: string | null
  learnMoreHref?: string
}

export function TeamIntroBand({
  agentId,
  photoUrl = EDEN.teamCircle,
  agencyName,
  tagline,
  learnMoreHref,
}: TeamIntroBandProps) {
  const serif = 'var(--font-serif)'
  const sans = 'var(--font-sans)'
  const href = learnMoreHref ?? `/frontend/${agentId}/about`

  return (
    <section
      style={{
        background: '#B5945A',
        padding: '0',
        overflow: 'hidden',
      }}
    >
      {/* Thin gold rule at top */}
      <div style={{ height: '1px', background: 'rgba(255,255,255,0.2)' }} />

      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          alignItems: 'center',
          gap: '0',
          padding: '64px 48px',
        }}
        className="team-intro-grid"
      >
        {/* Left — circular portrait */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: '220px',
              height: '220px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '3px solid rgba(255,255,255,0.35)',
              boxShadow: '0 8px 40px rgba(0,0,0,0.25)',
              flexShrink: 0,
              position: 'relative',
            }}
          >
            {photoUrl ? (
              <Image
                src={photoUrl}
                alt={agencyName ?? 'Our team'}
                fill
                sizes="220px"
                style={{ objectFit: 'cover', filter: 'grayscale(100%)' }}
              />
            ) : (
              /* Elegant fallback monogram */
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  background: 'rgba(255,255,255,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span
                  style={{
                    fontFamily: serif,
                    fontSize: '64px',
                    fontWeight: 300,
                    color: 'rgba(255,255,255,0.6)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {(agencyName ?? 'E').charAt(0)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right — copy */}
        <div style={{ paddingLeft: '32px' }}>
          {/* Micro-label */}
          <p
            style={{
              fontFamily: sans,
              fontSize: '9px',
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.65)',
              marginBottom: '20px',
            }}
          >
            Our Story
          </p>

          <h2
            style={{
              fontFamily: serif,
              fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
              fontWeight: 300,
              lineHeight: 1.2,
              color: '#FFFFFF',
              marginBottom: '20px',
              letterSpacing: '-0.01em',
            }}
          >
            Have you found<br />your Eden?
          </h2>

          <p
            style={{
              fontFamily: sans,
              fontSize: '14px',
              lineHeight: '1.85',
              color: 'rgba(255,255,255,0.78)',
              marginBottom: '32px',
              maxWidth: '420px',
            }}
          >
            {tagline ??
              'Our team will help you find it. For years we have been helping our clients travel and live better — crafting journeys that are as unique as the people taking them.'}
          </p>

          <Link
            href={href}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              fontFamily: sans,
              fontSize: '10px',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#FFFFFF',
              textDecoration: 'none',
              borderBottom: '1px solid rgba(255,255,255,0.4)',
              paddingBottom: '4px',
              transition: 'border-color 0.3s ease, opacity 0.3s ease',
            }}
          >
            Learn How
            <svg width="16" height="10" viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M0 5h14M10 1l4 4-4 4" />
            </svg>
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .team-intro-grid {
            grid-template-columns: 1fr !important;
            text-align: center;
            gap: 40px !important;
          }
          .team-intro-grid > div:last-child {
            padding-left: 0 !important;
          }
        }
      `}</style>
    </section>
  )
}
