'use client'

import Link from 'next/link'
import Image from 'next/image'

interface SiteFooterProps {
  agentId: string
  agencyName: string
  /** Tenant link base — empty on vanity domain, `/frontend/{agentId}` on platform. */
  base?: string
  phone?: string
  email?: string
  address?: string
  cstNumber?: string
  instagram?: string
  facebook?: string
  youtube?: string
}

const NAV_LINKS = [
  { label: 'Home',      path: '' },
  { label: 'About',     path: '/about' },
  { label: 'Press',     path: '/media' },
  { label: 'Journal',   path: '/blog' },
  { label: 'Resources', path: '/resources' },
  { label: 'Contact',   path: '/contact' },
]

export function SiteFooter({
  agentId,
  agencyName,
  base: baseProp,
  phone,
  email,
  address,
  cstNumber,
  instagram,
  facebook,
  youtube,
}: SiteFooterProps) {
  const base = baseProp ?? `/frontend/${agentId}`

  /* Shared micro-label style — used for every uppercase section label
     (Navigation, Contact, and the Mailing Address sub-label) so the footer
     reads as one consistent system rather than three different stamps. */
  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-sans)',
    fontSize: '10px',
    letterSpacing: '0.24em',
    textTransform: 'uppercase',
    color: '#7A7570',
    marginBottom: '24px',
    display: 'block',
  }

  const linkStyle: React.CSSProperties = {
    fontFamily: 'var(--font-sans)',
    fontSize: '13px',
    color: '#A8A39E',
    textDecoration: 'none',
    letterSpacing: '0.04em',
    transition: 'color 0.2s',
    display: 'block',
    lineHeight: '2.1',
  }

  /* Bottom-bar text style: copy line, "A Virtuoso Member Agency",
     and the Terms / Privacy links all share this so the row reads
     as one band of text. */
  const bottomMetaStyle: React.CSSProperties = {
    fontFamily: 'var(--font-sans)',
    fontSize: '10px',
    letterSpacing: '0.14em',
    color: '#5A5550',
  }

  return (
    <footer style={{ background: 'var(--dark-footer)', color: '#9A9590' }}>

      {/* ── Main columns ─────────────────────────────────────────────── */}
      <div className="footer-main max-w-7xl mx-auto">

        {/* Col 1: Brand */}
        <div className="footer-brand">
          <span
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '22px',
              letterSpacing: '0.12em',
              color: 'var(--gold)',
              display: 'block',
              marginBottom: '14px',
              fontWeight: 300,
              lineHeight: 1.2,
            }}
          >
            {agencyName}
          </span>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', lineHeight: '1.85', color: '#7A7570', maxWidth: '260px', margin: 0 }}>
            Curating the world&apos;s most extraordinary journeys — with precision, passion, and white-glove care.
          </p>
          {/* Social icons */}
          <div className="footer-social" style={{ display: 'flex', gap: '18px', marginTop: '22px' }}>
            <FooterSocialLink href={instagram ?? '#'} label="Instagram" type="instagram" />
            <FooterSocialLink href={facebook ?? '#'}  label="Facebook"  type="facebook"  />
            <FooterSocialLink href={youtube ?? '#'}   label="YouTube"   type="youtube"   />
          </div>
          {/* Virtuoso affiliation */}
          <div className="footer-virtuoso" style={{ marginTop: '32px' }}>
            <Image
              src="/assets/virtuoso-footer.png"
              alt="Virtuoso"
              width={120}
              height={40}
              className="virtuoso-logo"
              style={{ objectFit: 'contain', objectPosition: 'left', opacity: 0.85, display: 'block' }}
            />
            <p className="virtuoso-caption" style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', letterSpacing: '0.08em', color: '#5A5550', lineHeight: '1.7', marginTop: '22px', marginBottom: 0, maxWidth: '220px' }}>
              An Affiliate of Montecito Village Travel, A Virtuoso Agency.
            </p>
          </div>
        </div>

        {/* Col 2: Nav */}
        <div className="footer-nav">
          <span style={labelStyle}>Navigation</span>
          <div className="footer-nav-links">
            {NAV_LINKS.map(({ label, path }) => {
              // Home (path='') resolves to base, but on the vanity domain
              // base is '' too — fall back to '/' so the link isn't empty.
              const href = path ? `${base}${path}` : (base || '/')
              return (
                <Link
                  key={label}
                  href={href}
                  style={linkStyle}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#9A9590')}
                >
                  {label}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Col 3: Legal */}
        <div className="footer-legal-col">
          <span style={labelStyle}>Legal</span>
          <Link
            href={`${base}/terms-of-service`}
            style={linkStyle}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
            onMouseLeave={e => (e.currentTarget.style.color = '#A8A39E')}
          >
            Terms of Service
          </Link>
          <Link
            href={`${base}/privacy-policy`}
            style={linkStyle}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
            onMouseLeave={e => (e.currentTarget.style.color = '#A8A39E')}
          >
            Privacy Policy
          </Link>
        </div>

        {/* Col 4: Contact */}
        <div className="footer-contact">
          <span style={labelStyle}>Contact</span>
          {phone && (
            <a
              href={`tel:${phone.replace(/\D/g, '')}`}
              style={{ ...linkStyle, whiteSpace: 'nowrap' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
              onMouseLeave={e => (e.currentTarget.style.color = '#9A9590')}
            >
              {phone}
            </a>
          )}
          <a
            href={`mailto:${email || 'info@edenfyw.com'}`}
            style={linkStyle}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
            onMouseLeave={e => (e.currentTarget.style.color = '#9A9590')}
          >
            {email || 'info@edenfyw.com'}
          </a>
          <div style={{ marginTop: '6px' }}>
            <span style={{ ...labelStyle, fontSize: '9px', marginBottom: '8px', color: '#5A5550' }}>Mailing Address</span>
            <p style={{ ...linkStyle, lineHeight: '1.7', cursor: 'default', margin: 0 }}>
              {address ?? '5318 E. 2nd St. #520, Long Beach, CA 90803'}
            </p>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ─────────────────────────────────────────────────── */}
      <div
        className="footer-bottom max-w-7xl mx-auto"
        style={{ borderTop: '1px solid #1F1D1A' }}
      >
        <p className="footer-copy" style={{ ...bottomMetaStyle, margin: 0 }}>
          © {new Date().getFullYear()} {agencyName}. All Rights Reserved.
          {cstNumber ? ` | CST # ${cstNumber}` : ' | CST # 2097184-40'}
        </p>
        <span style={bottomMetaStyle}>A Virtuoso Member Agency</span>
      </div>

      {/* ── Scoped responsive styles ───────────────────────────────────── */}
      <style>{`
        /* Desktop: 4-col grid (Brand · Navigation · Legal · Contact) */
        .footer-main {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr 0.7fr 1fr;
          gap: 48px;
          align-items: start;
          padding: 72px 32px 64px;
        }
        .footer-nav-links {
          display: flex;
          flex-direction: column;
        }
        .footer-bottom {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 22px 32px;
        }

        /* Tablet: tighter columns at narrow desktop */
        @media (max-width: 960px) {
          .footer-main {
            gap: 40px;
            padding: 64px 28px 56px;
          }
        }

        /* Mobile: clean single-column stacked layout */
        @media (max-width: 768px) {
          .footer-main {
            grid-template-columns: 1fr !important;
            gap: 0 !important;
            padding: 48px 24px 16px !important;
          }

          /* Brand section — centered, full-width */
          .footer-brand {
            text-align: center;
            padding-bottom: 36px;
            border-bottom: 1px solid #1F1D1A;
          }
          /* Target only the tagline (direct child <p>), not the Virtuoso
             caption nested inside .footer-virtuoso. */
          .footer-brand > p { max-width: 100% !important; margin: 0 auto !important; }
          .footer-social { justify-content: center; }

          /* Nav — horizontal 2-col grid */
          .footer-nav {
            padding: 32px 0 28px;
            border-bottom: 1px solid #1F1D1A;
            text-align: center;
          }
          .footer-nav > span {
            text-align: center;
            display: block;
            margin-bottom: 18px !important;
          }
          .footer-nav-links {
            display: grid !important;
            grid-template-columns: 1fr 1fr;
            gap: 2px 0;
          }
          .footer-nav-links a {
            padding: 8px 0 !important;
            line-height: 1.4 !important;
            text-align: center;
          }

          /* Legal — same centered pattern as nav */
          .footer-legal-col {
            padding: 32px 0 28px;
            border-bottom: 1px solid #1F1D1A;
            text-align: center;
          }
          .footer-legal-col > span {
            text-align: center;
            display: block;
            margin-bottom: 18px !important;
          }
          .footer-legal-col a {
            padding: 8px 0 !important;
            line-height: 1.4 !important;
            text-align: center;
          }

          /* Contact — centered */
          .footer-contact {
            padding: 32px 0 8px;
            text-align: center;
          }
          .footer-contact > span:first-child { display: block; text-align: center; }
          .footer-contact a,
          .footer-contact p { text-align: center !important; }

          /* Virtuoso logo — center on mobile */
          .footer-virtuoso { display: flex; flex-direction: column; align-items: center; }
          .virtuoso-logo {
            margin: 0 auto;
            object-position: center !important;
          }
          .virtuoso-caption {
            text-align: center;
            max-width: 100% !important;
          }

          /* Bottom bar — stack vertically */
          .footer-bottom {
            flex-direction: column !important;
            text-align: center;
            gap: 14px !important;
            padding: 22px 24px !important;
          }
          .footer-copy { text-align: center; }
        }

        /* Small phones: tighter horizontal padding (iPhones still get 2-col nav) */
        @media (max-width: 420px) {
          .footer-main { padding: 40px 18px 12px !important; }
          .footer-bottom { padding: 20px 18px !important; }
        }
        /* Very small phones (≤360px): collapse nav to one column */
        @media (max-width: 360px) {
          .footer-nav-links { grid-template-columns: 1fr !important; }
          .footer-nav-links a { padding: 6px 0 !important; }
        }
      `}</style>
    </footer>
  )
}

function FooterSocialLink({ href, label, type }: { href: string; label: string; type: 'instagram' | 'facebook' | 'youtube' }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      style={{ color: '#4A4845', transition: 'color 0.2s' }}
      onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
      onMouseLeave={e => (e.currentTarget.style.color = '#4A4845')}
    >
      {type === 'instagram' && (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
        </svg>
      )}
      {type === 'facebook' && (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      )}
      {type === 'youtube' && (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
          <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none" />
        </svg>
      )}
    </a>
  )
}
