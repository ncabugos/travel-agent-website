import Link from 'next/link'
import { Reveal } from './Reveal'
import { WWT2HeadlineReveal } from './WWT2HeadlineReveal'

interface WWT2FooterProps {
  base: string
  agencyName: string
  instagram?: string
  facebook?: string
  heroImage: string
}

/**
 * Closing CTA + quiet footer. A full-bleed serene image carries a final
 * invitation; the footer beneath stays restrained — a short index, the enquiry
 * link, and the Virtuoso affiliation line.
 *
 * Deliberately no email or phone: every enquiry routes through the contact form
 * so the advisor's personal address and number stay off the public site.
 */
export function WWT2Footer({
  base,
  agencyName,
  instagram,
  facebook,
  heroImage,
}: WWT2FooterProps) {
  const year = 2026

  const links = [
    { label: 'The Collection', href: `${base}/book-hotel` },
    { label: 'Wine River Cruises', href: `${base}/find-cruise` },
    { label: 'Wellness', href: `${base}/experiences` },
    { label: 'Villas', href: `${base}/book-villa` },
    { label: 'Journal', href: `${base}/journal` },
    { label: 'Enquire', href: `${base}/contact` },
  ]

  return (
    <footer className="wwt2-footer">
      {/* Closing invitation — uncovered curtain-style beneath the page (CSS in wwt2.css) */}
      <section className="wwt2-cta" style={{ backgroundImage: `url("${heroImage}")` }}>
        <div className="wwt2-cta-bg" style={{ backgroundImage: `url("${heroImage}")` }} aria-hidden="true" />
        <div className="wwt2-cta-scrim" />
        <div className="wwt-shell wwt2-cta-inner">
          <Reveal>
            <p className="wwt-eyebrow wwt2-cta-eyebrow">Begin</p>
            <WWT2HeadlineReveal
              as="h2"
              className="wwt-display wwt2-cta-title"
              text="Tell us where"
              italicText="you want to go."
              stagger={110}
            />
            <p className="wwt2-cta-sub">
              One conversation is all it takes. No fees to start, no obligation — a first step
              toward a trip planned entirely around you.
            </p>
            <Link href={`${base}/contact`} className="wwt-btn on-night">
              Start Planning
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Quiet footer */}
      <div className="wwt2-foot">
        <div className="wwt-shell wwt2-foot-grid">
          <div className="wwt2-foot-brand">
            <p className="wwt2-foot-name">{agencyName}</p>
            <p className="wwt2-foot-aff">
              A proud member of Virtuoso — the world’s leading network of luxury travel advisors.
            </p>
          </div>

          <nav className="wwt2-foot-nav" aria-label="Footer">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="wwt2-foot-link">
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="wwt2-foot-contact">
            <Link href={`${base}/contact`} className="wwt2-foot-contact-link">
              Start a conversation
            </Link>
            <div className="wwt2-foot-social">
              {instagram && (
                <a href={instagram} target="_blank" rel="noopener noreferrer" className="wwt2-foot-social-link">
                  Instagram
                </a>
              )}
              {facebook && (
                <a href={facebook} target="_blank" rel="noopener noreferrer" className="wwt2-foot-social-link">
                  Facebook
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="wwt-shell wwt2-foot-base">
          <span>© {year} {agencyName}</span>
          <span className="wwt2-foot-base-meta">Custom-built on Elite Advisor Hub</span>
        </div>
      </div>

      <style>{`
        .wwt2-cta {
          position: relative; overflow: hidden;
          background-size: cover; background-position: center;
          padding-block: clamp(7rem, 16vw, 14rem);
          text-align: center;
        }
        .wwt2-cta-bg {
          position: absolute; inset: 0;
          background-size: cover; background-position: center;
          animation: wwt2-cta-drift 22s ease-in-out infinite alternate;
        }
        @keyframes wwt2-cta-drift {
          from { transform: scale(1); }
          to   { transform: scale(1.07); }
        }
        @media (prefers-reduced-motion: reduce) {
          .wwt2-cta-bg { animation: none; }
        }
        .wwt2-cta-scrim {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0.62), rgba(0,0,0,0.72));
        }
        .wwt2-cta-inner { position: relative; z-index: 2; }
        .wwt2-cta .wwt2-cta-eyebrow { color: rgba(255,255,255,0.78); }
        .wwt2-cta .wwt2-cta-title {
          color: var(--wwt-on-night);
          font-size: var(--wwt-t-hero);
          max-width: 18ch; margin: 1.4rem auto 1.6rem;
          text-shadow: 0 1px 40px rgba(0,0,0,0.35);
        }
        .wwt2-cta-sub {
          font-family: var(--wwt-sans); font-weight: 300;
          color: rgba(255,255,255,0.82); max-width: 48ch; margin: 0 auto 2.6rem; line-height: 1.7;
        }

        .wwt2-foot { background: var(--wwt-night-2); color: var(--wwt-on-night); padding-block: clamp(3.5rem, 7vw, 5.5rem) 2rem; }
        .wwt2-foot-grid {
          display: grid; grid-template-columns: 1.4fr 1fr 1fr; gap: clamp(2rem, 5vw, 4rem);
          padding-bottom: clamp(3rem, 6vw, 4.5rem);
          border-bottom: 1px solid rgba(255,255,255,0.14);
        }
        .wwt2-foot-name { font-family: var(--wwt-serif); font-size: 1.7rem; margin: 0 0 1rem; color: var(--wwt-on-night); }
        .wwt2-foot-aff { font-family: var(--wwt-sans); font-weight: 300; font-size: 0.9rem; color: rgba(255,255,255,0.6); max-width: 34ch; margin: 0; }
        .wwt2-foot-nav { display: flex; flex-direction: column; gap: 0.85rem; }
        .wwt2-foot-link, .wwt2-foot-contact-link, .wwt2-foot-social-link {
          font-family: var(--wwt-sans); font-size: 0.8rem; font-weight: 400;
          letter-spacing: 0.04em; color: rgba(255,255,255,0.78); text-decoration: none;
          transition: color 300ms var(--wwt-ease); width: fit-content;
        }
        .wwt2-foot-link:hover, .wwt2-foot-contact-link:hover, .wwt2-foot-social-link:hover { color: var(--wwt-on-night); }
        .wwt2-foot-contact { display: flex; flex-direction: column; gap: 0.85rem; }
        .wwt2-foot-contact-link { font-size: 0.95rem; }
        .wwt2-foot-social { display: flex; gap: 1.4rem; margin-top: 0.6rem; }
        .wwt2-foot-social-link { text-transform: uppercase; letter-spacing: 0.18em; font-size: 0.7rem; font-weight: 500; }

        .wwt2-foot-base {
          display: flex; justify-content: space-between; flex-wrap: wrap; gap: 0.8rem;
          padding-top: 2rem;
          font-family: var(--wwt-sans); font-size: 0.72rem; letter-spacing: 0.04em;
          color: rgba(255,255,255,0.45);
        }

        @media (max-width: 760px) {
          .wwt2-foot-grid { grid-template-columns: 1fr; gap: 2.4rem; }
        }
      `}</style>
    </footer>
  )
}
