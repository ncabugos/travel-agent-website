import Link from 'next/link'

/**
 * MarketingFooter
 *
 * Global footer used across the platform marketing site (eliteadvisorhub.com):
 *   - Marketing home (/)
 *   - /privacy, /terms, /support, /schedule-consultation
 *
 * NOT used on advisor-template routes (/frontend/[agentId], /t2, /t3, /t4),
 * which have their own per-template footers showing the advisor's branding
 * and copyright.
 */

const PLATFORM_LINKS = [
  { label: 'Pricing',      href: '/#pricing' },
  { label: 'Features',     href: '/#features' },
  { label: 'Schedule a consultation', href: '/schedule-consultation' },
]

const DEMO_LINKS = [
  { label: 'Eden — Custom',                 href: '/frontend/demo-agent' },
  { label: 'Vista — Standard',              href: '/t2/t2-demo' },
  { label: 'Meridian — Standard',           href: '/t3/t3-demo' },
  { label: 'Your Travel Center — Agency',   href: '/t2/ytc-demo' },
  { label: 'Casa Solis — Custom',           href: '/t4/casa-solis' },
]

const COMPANY_LINKS = [
  { label: 'Support',        href: '/support' },
  { label: 'Contact us',     href: '/support' },
  { label: 'Admin',          href: '/admin/login' },
  { label: 'Advisor login',  href: '/agent-portal/login' },
]

const LEGAL_LINKS = [
  { label: 'Privacy Policy',   href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
]

export function MarketingFooter() {
  const year = new Date().getFullYear()

  return (
    <footer style={{
      borderTop: '1px solid #e5e7eb',
      background: '#fafafa',
      marginTop: 64,
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '64px 24px 32px',
      }}>

        {/* ── Top: brand + 4 link columns ─────────────────────────── */}
        <div className="footer-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1.5fr repeat(4, 1fr)',
          gap: 40,
          marginBottom: 48,
        }}>

          {/* Brand block */}
          <div>
            <Link href="/" style={{
              fontSize: 18,
              fontWeight: 700,
              color: '#111',
              textDecoration: 'none',
              letterSpacing: '-0.01em',
              display: 'inline-block',
              marginBottom: 12,
            }}>
              EliteAdvisorHub
            </Link>
            <p style={{
              fontSize: 13,
              color: '#6b7280',
              lineHeight: 1.55,
              maxWidth: 320,
              margin: 0,
            }}>
              The premium website platform for luxury travel advisors. Stunning templates,
              curated editorial, supplier integrations, and zero tech burden.
            </p>
          </div>

          <FooterColumn title="Platform" links={PLATFORM_LINKS} />
          <FooterColumn title="Demos"    links={DEMO_LINKS} />
          <FooterColumn title="Company"  links={COMPANY_LINKS} />
          <FooterColumn title="Legal"    links={LEGAL_LINKS} />
        </div>

        {/* ── Middle: legal-entity address line ───────────────────── */}
        <div style={{
          borderTop: '1px solid #e5e7eb',
          paddingTop: 24,
          marginBottom: 16,
          fontSize: 12,
          color: '#9ca3af',
          lineHeight: 1.7,
        }}>
          <strong style={{ color: '#6b7280', fontWeight: 500 }}>Elite Advisor Hub, LLC</strong>
          {' · '}
          1016 Cliff Drive, Santa Barbara, CA 93109
          {' · '}
          <a href="mailto:support@eliteadvisorhub.com" style={{ color: '#6b7280', textDecoration: 'none' }}>
            support@eliteadvisorhub.com
          </a>
        </div>

        {/* ── Bottom: copyright + privacy/terms ───────────────────── */}
        <div className="footer-bottom" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          fontSize: 12,
          color: '#9ca3af',
        }}>
          <div>© {year} Elite Advisor Hub, LLC. All rights reserved.</div>
          <div style={{ display: 'flex', gap: 20 }}>
            <Link href="/privacy" style={{ color: '#9ca3af', textDecoration: 'none' }}>Privacy</Link>
            <Link href="/terms" style={{ color: '#9ca3af', textDecoration: 'none' }}>Terms</Link>
            <a href="https://eliteadvisorhub.com" style={{ color: '#9ca3af', textDecoration: 'none' }}>
              eliteadvisorhub.com
            </a>
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 32px !important;
          }
        }
        @media (max-width: 560px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
          .footer-bottom {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
        }
      `}</style>
    </footer>
  )
}

function FooterColumn({ title, links }: {
  title: string
  links: { label: string; href: string }[]
}) {
  return (
    <div>
      <div style={{
        fontSize: 11,
        fontWeight: 600,
        color: '#374151',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        marginBottom: 14,
      }}>
        {title}
      </div>
      <ul style={{
        listStyle: 'none',
        padding: 0,
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 9,
      }}>
        {links.map(l => (
          <li key={l.href + l.label}>
            <Link
              href={l.href}
              style={{
                fontSize: 13,
                color: '#6b7280',
                textDecoration: 'none',
              }}
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
