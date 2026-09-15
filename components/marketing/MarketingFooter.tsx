import Link from 'next/link'
import Image from 'next/image'
import { ObfuscatedContact } from '@/components/ui/ObfuscatedContact'
import { encodeContact } from '@/lib/obfuscate'
import { CHARCOAL } from './tokens'

/**
 * Global footer for the platform marketing site (eliteadvisorhub.com pages).
 * Not used on advisor-template routes, which carry their own footers.
 */
const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: 'Platform',
    links: [
      { label: 'The platform', href: '/#platform' },
      { label: 'The work', href: '/#work' },
      { label: 'Studio', href: '/studio' },
      { label: 'Insights', href: '/insights' },
      { label: 'Schedule a consultation', href: '/schedule-consultation' },
      { label: 'Support', href: '/support' },
    ],
  },
  {
    title: 'Sign in',
    links: [
      { label: 'Advisor login', href: '/agent-portal/login' },
      { label: 'Admin', href: '/admin/login' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy policy', href: '/privacy' },
      { label: 'Terms of service', href: '/terms' },
    ],
  },
]

const MUTED = 'rgba(255,255,255,0.6)'
const RULE = 'rgba(255,255,255,0.14)'

export function MarketingFooter() {
  const year = new Date().getFullYear()

  return (
    <footer style={{ background: CHARCOAL, color: '#fff', fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
      <div className="eah-container" style={{ padding: '72px 40px 32px' }}>
        <div className="eah-footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '48px', marginBottom: '64px' }}>
          <div>
            <Link href="/" style={{ display: 'inline-block', marginBottom: '16px' }}>
              <Image
                src="/assets/elite-advisor-hub-logos/elite-advisor-hub-logo-white.png"
                alt="Elite Advisor Hub"
                width={800}
                height={134}
                style={{ objectFit: 'contain', height: '24px', width: 'auto' }}
              />
            </Link>
            <p style={{ fontSize: '14px', color: MUTED, lineHeight: 1.6, maxWidth: '32ch', margin: 0 }}>
              Websites for luxury travel advisors.
            </p>
          </div>
          <nav aria-label="Footer" style={{ display: 'contents' }}>
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <div style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: MUTED, marginBottom: '16px' }}>{col.title}</div>
                <ul role="list" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {col.links.map((l) => (
                    <li key={l.href + l.label}>
                      <Link href={l.href} className="eah-footer-link" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)', textDecoration: 'none' }}>
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div style={{ borderTop: `1px solid ${RULE}`, paddingTop: '24px', fontSize: '13px', color: MUTED, lineHeight: 1.7 }}>
          <span style={{ color: 'rgba(255,255,255,0.8)' }}>Elite Advisor Hub, LLC</span>
          {' · '}1016 Cliff Drive, Santa Barbara, CA 93109{' · '}
          <ObfuscatedContact
            encoded={encodeContact('support@eliteadvisorhub.com')}
            kind="email"
            fallbackHref="/support"
            fallbackLabel="Contact support"
            style={{ color: MUTED, textDecoration: 'none' }}
          />
        </div>
        <div className="eah-footer-bottom" style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', marginTop: '12px', fontSize: '13px', color: MUTED }}>
          <div>© {year} Elite Advisor Hub, LLC. All rights reserved.</div>
          <a href="https://eliteadvisorhub.com" className="eah-footer-link" translate="no" style={{ color: MUTED, textDecoration: 'none' }}>eliteadvisorhub.com</a>
        </div>
      </div>

      <style>{`
        .eah-footer-link { transition: color 0.15s ease; }
        .eah-footer-link:hover { color: #fff !important; }
        @media (max-width: 900px) { .eah-footer-grid { grid-template-columns: 1fr 1fr !important; gap: 36px !important; } }
        @media (max-width: 560px) { .eah-footer-grid { grid-template-columns: 1fr !important; } .eah-container { padding-left: 20px !important; padding-right: 20px !important; } }
      `}</style>
    </footer>
  )
}
