'use client'

import Image from 'next/image'
import Link from 'next/link'
import { EDEN } from '@/lib/media-library'

interface Pillar {
  icon: React.ReactNode
  title: string
  body: string
}

interface WhyTravelWithUsProps {
  learnMoreHref?: string
  agentId: string
}

function EdenWingIcon() {
  return (
    <Image
      src={EDEN.logoWing}
      alt="Eden wing icon"
      width={48}
      height={48}
      style={{ objectFit: 'contain', opacity: 0.85 }}
    />
  )
}

const PILLARS: Pillar[] = [
  {
    icon: <EdenWingIcon />,
    title: 'Expert Advisors',
    body: "We've visited over 90 countries to ensure the best experiences for our clients. Our advisors have been there — and done that.",
  },
  {
    icon: <EdenWingIcon />,
    title: 'Customized Service',
    body: "We'll hold your hand through the planning process with personalised travel bookings designed to fit your unique curiosities and needs.",
  },
  {
    icon: <EdenWingIcon />,
    title: 'Global Connections',
    body: "We've got friends in high places — ensuring the best perks, exclusive access, and preferential treatment throughout your journey.",
  },
]

export function WhyTravelWithUs({ agentId, learnMoreHref }: WhyTravelWithUsProps) {
  const serif = 'var(--font-serif)'
  const sans = 'var(--font-sans)'
  const href = learnMoreHref ?? `/frontend/${agentId}/about`

  return (
    <section
      style={{
        background: '#F5F3F0',
        padding: '120px 24px',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: '72px' }}>
          {/* Decorative lines either side of label */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '20px',
              marginBottom: '24px',
            }}
          >
            <div style={{ width: '48px', height: '1px', background: 'rgba(181,148,90,0.4)' }} />
            <p
              style={{
                fontFamily: sans,
                fontSize: '9px',
                letterSpacing: '0.38em',
                textTransform: 'uppercase',
                color: '#B5945A',
                margin: 0,
              }}
            >
              Why Travel With Us
            </p>
            <div style={{ width: '48px', height: '1px', background: 'rgba(181,148,90,0.4)' }} />
          </div>
        </div>

        {/* 3-col pillars */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '64px 40px',
          }}
          className="why-pillars-grid"
        >
          {PILLARS.map(({ icon, title, body }, i) => (
            <div
              key={title}
              style={{
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {/* Divider line above each pillar except on mobile */}
              {i > 0 && (
                <div
                  className="pillar-divider"
                  style={{
                    display: 'none',
                    width: '1px',
                    height: '40px',
                    background: 'rgba(181,148,90,0.3)',
                    marginBottom: '32px',
                  }}
                />
              )}

              {/* Icon */}
              <div style={{ marginBottom: '24px' }}>{icon}</div>

              {/* Title */}
              <h3
                style={{
                  fontFamily: sans,
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'var(--charcoal)',
                  marginBottom: '16px',
                }}
              >
                {title}
              </h3>

              {/* Thin gold rule under each title */}
              <div
                style={{
                  width: '24px',
                  height: '1px',
                  background: '#B5945A',
                  marginBottom: '18px',
                }}
              />

              {/* Body */}
              <p
                style={{
                  fontFamily: sans,
                  fontSize: '14px',
                  lineHeight: '1.85',
                  color: 'var(--warm-gray)',
                  maxWidth: '260px',
                }}
              >
                {body}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: '64px' }}>
          <Link
            href={href}
            style={{
              display: 'inline-block',
              fontFamily: sans,
              fontSize: '10px',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#FFFFFF',
              background: '#B5945A',
              border: '1px solid #B5945A',
              padding: '16px 44px',
              textDecoration: 'none',
              transition: 'background 0.3s ease, color 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = '#B5945A'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#B5945A'
              e.currentTarget.style.color = '#FFFFFF'
            }}
          >
            Learn More
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .why-pillars-grid {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
        }
      `}</style>
    </section>
  )
}
