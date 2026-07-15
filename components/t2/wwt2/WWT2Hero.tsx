import Link from 'next/link'

interface WWT2HeroProps {
  eyebrow: string
  headline: string
  /** Optional second line set in italic serif. */
  headlineItalic?: string
  sub: string
  /** 1–3 images; they crossfade on a slow cycle (pure CSS, zero JS). */
  images: string[]
  primaryCta: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
}

const SLOT = 7 // seconds per image
const FADE = 1.6

/**
 * Split editorial hero (Four Seasons signature): full-bleed imagery on the
 * left crossfading through a slow cycle; a calm white panel on the right
 * carries stacked fashion-serif display type and a solid black CTA. The nav is
 * solid from load — no imagery ever sits behind the chrome.
 */
export function WWT2Hero({
  eyebrow,
  headline,
  headlineItalic,
  sub,
  images,
  primaryCta,
  secondaryCta,
}: WWT2HeroProps) {
  const slides = images.slice(0, 3)
  const cycle = slides.length * SLOT

  return (
    <section className="wwt2-hero-split">
      <div
        className="wwt2-hs-media"
        style={{ backgroundImage: `url("${slides[0]}")` }}
        aria-hidden="true"
      >
        <div className="wwt2-hs-drift">
          {slides.length > 1 &&
            slides.map((src, i) => (
              <div
                key={src}
                className="wwt2-hs-slide"
                style={{
                  backgroundImage: `url("${src}")`,
                  animationDelay: `${i * SLOT}s`,
                  animationDuration: `${cycle}s`,
                }}
              />
            ))}
        </div>

        {slides.length > 1 && (
          <div className="wwt2-hs-progress">
            {slides.map((src, i) => (
              <span key={src} className="wwt2-hs-bar">
                <span
                  className="wwt2-hs-bar-fill"
                  style={{ animationDelay: `${i * SLOT}s`, animationDuration: `${cycle}s` }}
                />
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="wwt2-hs-panel">
        <div className="wwt2-hs-content">
          <p className="wwt-eyebrow wwt2-hs-eyebrow">{eyebrow}</p>
          <h1 className="wwt2-hs-title">
            <span className="wwt2-hs-title-main">{headline}</span>
            {headlineItalic && <span className="wwt2-hs-title-italic">{headlineItalic}</span>}
          </h1>
          <span className="wwt2-hs-rule" aria-hidden="true" />
          <p className="wwt2-hs-sub">{sub}</p>
          <div className="wwt2-hs-actions">
            <Link href={primaryCta.href} className="wwt-btn solid">
              {primaryCta.label}
            </Link>
            {secondaryCta && (
              <Link href={secondaryCta.href} className="wwt-link">
                {secondaryCta.label}
              </Link>
            )}
          </div>
        </div>
        <div className="wwt2-hs-cue" aria-hidden="true">
          <span className="wwt2-hs-cue-line" />
        </div>
      </div>

      <style>{`
        .wwt2-hero-split {
          display: grid;
          grid-template-columns: minmax(0, 1.45fr) minmax(360px, 1fr);
          min-height: 100svh;
          background: var(--wwt-paper);
          /* Clear the fixed solid nav. */
          padding-top: calc(var(--eah-banner-h, 0px) + 64px);
        }
        .wwt2-hs-media {
          position: relative; overflow: hidden;
          background-size: cover; background-position: center;
        }
        .wwt2-hs-drift {
          position: absolute; inset: 0;
          animation: wwt2-hs-kenburns 30s ease-out forwards;
          transform: scale(1.05);
        }
        @keyframes wwt2-hs-kenburns {
          from { transform: scale(1.05); }
          to   { transform: scale(1.0); }
        }
        .wwt2-hs-slide {
          position: absolute; inset: 0;
          background-size: cover; background-position: center;
          opacity: 0;
          animation-name: wwt2-hs-fade;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
        }
        /* ${SLOT}s slot, ${FADE}s crossfade, 3-slide cycle. */
        @keyframes wwt2-hs-fade {
          0%     { opacity: 0; }
          ${((FADE / (SLOT * 3)) * 100).toFixed(2)}%  { opacity: 1; }
          ${((SLOT / (SLOT * 3)) * 100).toFixed(2)}%  { opacity: 1; }
          ${(((SLOT + FADE) / (SLOT * 3)) * 100).toFixed(2)}% { opacity: 0; }
          100%   { opacity: 0; }
        }
        .wwt2-hs-progress {
          position: absolute; left: clamp(1.4rem, 3vw, 2.6rem); bottom: clamp(1.4rem, 3vw, 2.4rem);
          z-index: 3; display: flex; gap: 0.6rem;
        }
        .wwt2-hs-bar {
          width: 44px; height: 1px; background: rgba(255,255,255,0.35);
          overflow: hidden; display: block; position: relative;
        }
        .wwt2-hs-bar-fill {
          position: absolute; inset: 0; background: #fff;
          transform: scaleX(0); transform-origin: left;
          animation-name: wwt2-hs-barfill;
          animation-iteration-count: infinite;
          animation-timing-function: linear;
        }
        @keyframes wwt2-hs-barfill {
          0%      { transform: scaleX(0); }
          33.33%  { transform: scaleX(1); }
          33.43%  { transform: scaleX(0); }
          100%    { transform: scaleX(0); }
        }

        .wwt2-hs-panel {
          position: relative;
          display: flex; align-items: center; justify-content: center;
          padding: clamp(3rem, 6vw, 5rem) clamp(2rem, 4.5vw, 4.5rem);
        }
        .wwt2-hs-content { max-width: 30rem; }
        .wwt2-hs-eyebrow { margin-bottom: clamp(1.6rem, 3vh, 2.6rem); }
        .wwt2-hs-title { margin: 0; }
        .wwt2-hs-title-main {
          display: block;
          font-family: var(--wwt-serif); font-weight: 300;
          text-transform: uppercase;
          font-size: clamp(2.4rem, 3.6vw, 3.9rem);
          line-height: 1.02; letter-spacing: 0.015em;
          color: var(--wwt-ink);
        }
        .wwt2-hs-title-italic {
          display: block;
          font-family: var(--wwt-serif); font-weight: 300; font-style: italic;
          font-size: clamp(1.5rem, 2vw, 2.2rem);
          margin-top: 1rem;
          color: var(--wwt-ink);
        }
        .wwt2-hs-rule {
          display: block; width: 56px; height: 1px;
          background: var(--wwt-ink);
          margin: clamp(1.6rem, 3vh, 2.4rem) 0;
        }
        .wwt2-hs-sub {
          font-family: var(--wwt-sans); font-weight: 300;
          font-size: 1rem; line-height: 1.75;
          color: var(--wwt-ink-soft);
          margin: 0 0 clamp(2rem, 4vh, 3rem);
        }
        .wwt2-hs-actions { display: flex; align-items: center; gap: 2rem; flex-wrap: wrap; }

        .wwt2-hs-cue {
          position: absolute; bottom: clamp(1.4rem, 3vh, 2.2rem); left: 50%;
          transform: translateX(-50%);
        }
        .wwt2-hs-cue-line {
          display: block; width: 1px; height: 44px;
          background: linear-gradient(to bottom, var(--wwt-clay), transparent);
          animation: wwt2-hs-cue 2.4s var(--wwt-ease) infinite;
          transform-origin: top;
        }
        @keyframes wwt2-hs-cue {
          0%, 100% { transform: scaleY(0.4); opacity: 0.4; }
          50%      { transform: scaleY(1);   opacity: 1; }
        }

        @media (max-width: 900px) {
          .wwt2-hero-split {
            grid-template-columns: 1fr;
            grid-template-rows: 58svh auto;
            min-height: 0;
          }
          .wwt2-hs-panel { padding-top: 3rem; padding-bottom: 4rem; }
          .wwt2-hs-cue { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .wwt2-hs-drift { animation: none; transform: none; }
          .wwt2-hs-slide { animation: none; opacity: 0; }
          .wwt2-hs-bar-fill { animation: none; }
          .wwt2-hs-progress { display: none; }
          .wwt2-hs-cue-line { animation: none; }
        }
      `}</style>
    </section>
  )
}
