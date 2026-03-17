'use client'

import Link from 'next/link'
import Image from 'next/image'

interface SiteFooterProps {
  agentId: string
  agencyName: string
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
  { label: 'Media',     path: '/media' },
  { label: 'Journal',   path: '/blog' },
  { label: 'Resources', path: '/resources' },
  { label: 'Contact',   path: '/contact' },
]

export function SiteFooter({
  agentId,
  agencyName,
  phone,
  email,
  address,
  cstNumber,
  instagram,
  facebook,
  youtube,
}: SiteFooterProps) {
  const base = `/frontend/${agentId}`

  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-sans)',
    fontSize: '9px',
    letterSpacing: '0.28em',
    textTransform: 'uppercase',
    color: 'var(--warm-gray)',
    marginBottom: '20px',
    display: 'block',
  }

  const linkStyle: React.CSSProperties = {
    fontFamily: 'var(--font-sans)',
    fontSize: '13px',
    color: '#9A9590',
    textDecoration: 'none',
    letterSpacing: '0.05em',
    transition: 'color 0.2s',
    display: 'block',
    lineHeight: '2',
  }

  return (
    <footer style={{ background: 'var(--dark-footer)', color: '#9A9590' }}>

      {/* ── Main columns ─────────────────────────────────────────────── */}
      <div className="footer-main max-w-7xl mx-auto px-8 py-20">

        {/* Col 1: Brand */}
        <div className="footer-brand">
          <span
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '22px',
              letterSpacing: '0.12em',
              color: 'var(--gold)',
              display: 'block',
              marginBottom: '12px',
              fontWeight: 300,
            }}
          >
            {agencyName}
          </span>
          <p style={{ fontSize: '13px', lineHeight: '1.8', color: '#6A6560', maxWidth: '240px' }}>
            Curating the world&apos;s most extraordinary journeys — with precision, passion, and white-glove care.
          </p>
          {/* Social icons */}
          <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
            <FooterSocialLink href={instagram ?? '#'} label="Instagram" type="instagram" />
            <FooterSocialLink href={facebook ?? '#'}  label="Facebook"  type="facebook"  />
            <FooterSocialLink href={youtube ?? '#'}   label="YouTube"   type="youtube"   />
          </div>
          {/* Virtuoso affiliation */}
          <div style={{ marginTop: '28px' }}>
            <Image
              src="/assets/virtuoso-footer.png"
              alt="Virtuoso"
              width={120}
              height={40}
              style={{ objectFit: 'contain', objectPosition: 'left', opacity: 0.85 }}
            />
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', letterSpacing: '0.08em', color: '#4A4845', lineHeight: '1.6', marginTop: '8px', maxWidth: '220px' }}>
              An Affiliate of Montecito Village Travel, A Virtuoso Agency.
            </p>
          </div>
        </div>

        {/* Col 2: Nav */}
        <div className="footer-nav">
          <span style={labelStyle}>Navigation</span>
          <div className="footer-nav-links">
            {NAV_LINKS.map(({ label, path }) => (
              <Link
                key={label}
                href={`${base}${path}`}
                style={linkStyle}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                onMouseLeave={e => (e.currentTarget.style.color = '#9A9590')}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Col 3: Contact */}
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
          {email && (
            <a
              href={`mailto:${email}`}
              style={linkStyle}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
              onMouseLeave={e => (e.currentTarget.style.color = '#9A9590')}
            >
              {email}
            </a>
          )}
          <p style={{ ...linkStyle, cursor: 'default' }}>
            {address ?? 'Long Beach, CA 90803'}
          </p>
        </div>
      </div>

      {/* ── Bottom bar ─────────────────────────────────────────────────── */}
      <div
        className="footer-bottom max-w-7xl mx-auto px-8 py-5"
        style={{ borderTop: '1px solid #1F1D1A' }}
      >
        <p className="footer-copy" style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', letterSpacing: '0.15em', color: '#4A4845' }}>
          © {new Date().getFullYear()} {agencyName}. All Rights Reserved.
          {cstNumber ? ` | CST # ${cstNumber}` : ' | CST # 2097184-40'}
        </p>
        <div className="footer-legal">
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', letterSpacing: '0.12em', color: '#4A4845' }}>
            A Virtuoso Member Agency
          </span>
          <Link
            href={`${base}/terms`}
            style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', letterSpacing: '0.12em', color: '#6A6560', textDecoration: 'none', borderBottom: '1px solid #2E2C29', paddingBottom: '1px' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
            onMouseLeave={e => (e.currentTarget.style.color = '#6A6560')}
          >
            Terms of Service
          </Link>
          <Link
            href={`${base}/privacy`}
            style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', letterSpacing: '0.12em', color: '#6A6560', textDecoration: 'none', borderBottom: '1px solid #2E2C29', paddingBottom: '1px' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
            onMouseLeave={e => (e.currentTarget.style.color = '#6A6560')}
          >
            Privacy Policy
          </Link>
        </div>
      </div>

      {/* ── Scoped responsive styles ───────────────────────────────────── */}
      <style>{`
        /* Desktop: 3-col grid */
        .footer-main {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 60px;
          align-items: start;
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
          gap: 12px;
        }
        .footer-legal {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        /* Mobile: clean single-column stacked layout */
        @media (max-width: 768px) {
          .footer-main {
            grid-template-columns: 1fr !important;
            gap: 0 !important;
            padding: 48px 24px !important;
          }

          /* Brand section — centered, full-width */
          .footer-brand {
            text-align: center;
            padding-bottom: 40px;
            border-bottom: 1px solid #1F1D1A;
          }
          .footer-brand p { max-width: 100% !important; }
          .footer-brand > div:first-of-type { justify-content: center; }

          /* Nav — horizontal 2-col pill grid */
          .footer-nav {
            padding: 36px 0 32px;
            border-bottom: 1px solid #1F1D1A;
          }
          .footer-nav > span {
            text-align: center;
            display: block;
            margin-bottom: 20px !important;
          }
          .footer-nav-links {
            display: grid !important;
            grid-template-columns: 1fr 1fr;
            gap: 4px 0;
            text-align: center;
          }
          .footer-nav-links a {
            padding: 8px 0 !important;
            line-height: 1.4 !important;
          }

          /* Contact — centered */
          .footer-contact {
            padding: 36px 0 0;
            text-align: center;
          }
          .footer-contact > span { display: block; text-align: center; }
          .footer-contact a,
          .footer-contact p { text-align: center !important; }

          /* Bottom bar — stack vertically */
          .footer-bottom {
            flex-direction: column !important;
            text-align: center;
            gap: 16px !important;
            padding: 24px !important;
          }
          .footer-legal {
            flex-wrap: wrap;
            justify-content: center;
            gap: 16px !important;
          }
          .footer-copy { text-align: center; }
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
