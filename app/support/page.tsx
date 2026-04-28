import type { Metadata } from 'next'
import Link from 'next/link'
import { SupportForm } from '@/components/marketing/SupportForm'
import { MarketingFooter } from '@/components/marketing/MarketingFooter'

export const metadata: Metadata = {
  title: 'Customer Support',
  description:
    'Get help with your EliteAdvisorHub account, billing, or technical issues. We respond within one business day.',
}

export default function SupportPage() {
  return (
    <main style={{ background: '#fafafa', minHeight: '100vh' }}>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '64px 24px 96px' }}>
        <Link
          href="/"
          style={{
            display: 'inline-block',
            marginBottom: 32,
            fontSize: 12,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#6b7280',
            textDecoration: 'none',
          }}
        >
          ← EliteAdvisorHub
        </Link>

        <h1 style={{
          fontSize: 'clamp(2rem, 4vw, 2.6rem)',
          fontWeight: 600,
          color: '#111',
          margin: '0 0 12px',
          lineHeight: 1.2,
        }}>
          How can we help?
        </h1>

        <p style={{
          fontSize: 16,
          color: '#4b5563',
          lineHeight: 1.55,
          margin: '0 0 14px',
        }}>
          Our team responds to every message within one business day. Tell us what's going on
          and we'll take it from there.
        </p>

        {/* Quick contact cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
          margin: '0 0 32px',
        }} className="support-quick">
          <ContactCard
            label="Email"
            value="support@eliteadvisorhub.com"
            href="mailto:support@eliteadvisorhub.com"
          />
          <ContactCard
            label="Mailing address"
            value="1016 Cliff Drive, Santa Barbara, CA 93109"
          />
        </div>

        {/* Form card */}
        <div style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: 14,
          padding: '28px 26px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
        }}>
          <SupportForm />
        </div>

        <p style={{
          marginTop: 24,
          fontSize: 13,
          color: '#9ca3af',
          textAlign: 'center',
        }}>
          For billing questions you can also reach out at{' '}
          <a href="mailto:billing@eliteadvisorhub.com" style={{ color: '#6b7280' }}>billing@eliteadvisorhub.com</a>
          {' · '}
          For privacy or legal inquiries, see our{' '}
          <Link href="/privacy" style={{ color: '#6b7280' }}>Privacy Policy</Link>.
        </p>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .support-quick {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <MarketingFooter />
    </main>
  )
}

function ContactCard({ label, value, href }: { label: string; value: string; href?: string }) {
  const inner = (
    <>
      <div style={{
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        color: '#9ca3af',
        marginBottom: 4,
      }}>
        {label}
      </div>
      <div style={{
        fontSize: 13,
        color: '#1f2937',
        fontWeight: 500,
        wordBreak: 'break-word',
      }}>
        {value}
      </div>
    </>
  )
  const baseStyle: React.CSSProperties = {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: 10,
    padding: '14px 16px',
    textDecoration: 'none',
    display: 'block',
  }
  return href
    ? <a href={href} style={baseStyle}>{inner}</a>
    : <div style={baseStyle}>{inner}</div>
}
