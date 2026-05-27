import Image from 'next/image'
import Link from 'next/link'
import { ConsultationForm } from '@/components/marketing/ConsultationForm'
import { MarketingFooter } from '@/components/marketing/MarketingFooter'

export const metadata = {
  title: 'Schedule a Consultation — Elite Advisor Hub',
  description:
    'Talk to our team about a custom-designed advisor site or multi-advisor agency build.',
}

const ALLOWED_TIERS = ['starter', 'growth', 'custom', 'agency'] as const
type TierValue = (typeof ALLOWED_TIERS)[number]
type BillingCycle = 'monthly' | 'annual'

interface PageProps {
  searchParams: Promise<{ tier?: string; billing?: string }>
}

export default async function ScheduleConsultationPage({ searchParams }: PageProps) {
  const { tier, billing } = await searchParams
  const initialTier: TierValue = (ALLOWED_TIERS as readonly string[]).includes(tier ?? '')
    ? (tier as TierValue)
    : 'custom'
  const initialBilling: BillingCycle = billing === 'annual' ? 'annual' : 'monthly'

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#fafafa',
        color: '#111',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
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
              textDecoration: 'none',
              color: '#111',
            }}
          >
            <Image
              src="/assets/elite-advisor-hub-logos/elite-advisor-hub-logo-black.png"
              alt="Elite Advisor Hub"
              width={800}
              height={134}
              priority
              style={{ height: '26px', width: 'auto', display: 'block' }}
            />
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <Link
              href="/?cycle=annual#pricing"
              style={{ fontSize: '14px', color: '#6b7280', textDecoration: 'none', fontWeight: 500 }}
            >
              View annual plans →
            </Link>
            <Link
              href="/#pricing"
              style={{ fontSize: '14px', color: '#6b7280', textDecoration: 'none', fontWeight: 500 }}
            >
              ← Back to pricing
            </Link>
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: '860px', margin: '0 auto', padding: '80px 24px 120px' }}>
        <header style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              fontSize: '10px',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#7c3aed',
              marginBottom: '20px',
            }}
          >
            Schedule a Consultation
          </div>
          <h1
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              fontSize: 'clamp(36px, 5vw, 52px)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
              margin: '0 0 20px',
              color: '#111',
            }}
          >
            Let&apos;s talk about your site.
          </h1>
          <p
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              fontSize: '16px',
              lineHeight: 1.7,
              color: '#6b7280',
              maxWidth: '560px',
              margin: '0 auto',
            }}
          >
            Tell us a little about you and what you&apos;re building. A member of our
            team will reach out within one business day to schedule a call.
          </p>
        </header>

        <ConsultationForm initialTier={initialTier} initialBilling={initialBilling} />
      </main>

      <MarketingFooter />
    </div>
  )
}
