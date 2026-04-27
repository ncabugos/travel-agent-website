import Link from 'next/link'
import { ConsultationForm } from '@/components/marketing/ConsultationForm'

export const metadata = {
  title: 'Schedule a Consultation — EliteAdvisorHub',
  description:
    'Talk to our team about a custom-designed advisor site or multi-advisor agency build.',
}

const ALLOWED_TIERS = ['starter', 'growth', 'custom', 'agency'] as const
type TierValue = (typeof ALLOWED_TIERS)[number]

interface PageProps {
  searchParams: Promise<{ tier?: string }>
}

export default async function ScheduleConsultationPage({ searchParams }: PageProps) {
  const { tier } = await searchParams
  const initialTier: TierValue = (ALLOWED_TIERS as readonly string[]).includes(tier ?? '')
    ? (tier as TierValue)
    : 'custom'

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--cream, #FAFAF5)',
        color: 'var(--charcoal, #1A1715)',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Lightweight header — matches marketing homepage */}
      <nav
        style={{
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          padding: '0 40px',
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '64px',
          }}
        >
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none',
              color: '#111',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #111 0%, #374151 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span
                style={{
                  color: '#fff',
                  fontSize: '16px',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                }}
              >
                E
              </span>
            </div>
            <span style={{ fontSize: '16px', fontWeight: 700, letterSpacing: '-0.02em' }}>
              EliteAdvisorHub
            </span>
          </Link>
          <Link
            href="/#pricing"
            style={{ fontSize: '14px', color: '#6b7280', textDecoration: 'none', fontWeight: 500 }}
          >
            ← Back to pricing
          </Link>
        </div>
      </nav>

      <main style={{ maxWidth: '860px', margin: '0 auto', padding: '80px 24px 120px' }}>
        <header style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '10px',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'var(--gold, #B49A5A)',
              marginBottom: '20px',
            }}
          >
            Schedule a Consultation
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(36px, 5vw, 52px)',
              fontWeight: 300,
              letterSpacing: '-0.01em',
              lineHeight: 1.15,
              margin: '0 0 20px',
              color: 'var(--charcoal, #1A1715)',
            }}
          >
            Let&apos;s talk about your site.
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '16px',
              lineHeight: 1.7,
              color: 'var(--warm-gray, #8A8279)',
              maxWidth: '560px',
              margin: '0 auto',
            }}
          >
            Tell us a little about you and what you&apos;re building. A member of our
            team will reach out within one business day to schedule a call.
          </p>
        </header>

        <ConsultationForm initialTier={initialTier} />
      </main>
    </div>
  )
}
