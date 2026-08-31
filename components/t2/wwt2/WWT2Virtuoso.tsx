import { Reveal } from './Reveal'
import { WWT2CountUp } from './WWT2CountUp'

/**
 * Virtuoso — the ledger. Quantified proof of advisor value: three oversized
 * serif numerals count up on arrival, then the benefits read as ledger rows
 * separated by drawing hairlines.
 */
const STATS: { value: number; suffix: string; label: string }[] = [
  { value: 1400, suffix: '+', label: 'Partner hotels with Virtuoso benefits' },
  { value: 3, suffix: '', label: 'Benefits included on every stay' },
  { value: 1, suffix: '', label: 'Call to begin' },
]

const PERKS: { k: string; title: string; body: string }[] = [
  {
    k: '01',
    title: 'Upgraded on arrival',
    body: 'A complimentary room upgrade whenever available, confirmed before you land.',
  },
  {
    k: '02',
    title: 'A credit to spend',
    body: 'A hotel or resort credit on most stays — for the spa, dinner, or the wine list.',
  },
  {
    k: '03',
    title: 'VIP recognition',
    body: 'Daily breakfast for two, early check-in and late check-out when available, and a welcome by name.',
  },
]

export function WWT2Virtuoso() {
  return (
    <section id="ch-virtuoso" className="wwt-section wwt-band-alt wwt2-virt">
      <div className="wwt-shell">
        <Reveal className="wwt2-virt-head">
          <p className="wwt-eyebrow">Virtuoso Member</p>
          <h2 className="wwt-display wwt-h2 wwt2-virt-title">
            The same room. Better benefits.
          </h2>
          <p className="wwt-body wwt2-virt-lede">
            As a Virtuoso member agency, we book the same rooms you find online — with benefits you
            won&rsquo;t: upgrades, credits, breakfast, and VIP recognition at more than 1,400 of the
            world&rsquo;s finest hotels.
          </p>
        </Reveal>

        <div className="wwt2-virt-stats">
          {STATS.map((s, i) => (
            <Reveal key={s.label} className="wwt2-virt-stat" delay={i * 120}>
              <WWT2CountUp value={s.value} suffix={s.suffix} className="wwt2-virt-num" />
              <span className="wwt2-virt-stat-label">{s.label}</span>
            </Reveal>
          ))}
        </div>

        <div className="wwt2-virt-ledger">
          {PERKS.map((p, i) => (
            <Reveal key={p.k} className="wwt2-virt-row" delay={i * 110}>
              <span className="wwt2-virt-k">{p.k}</span>
              <h3 className="wwt-display wwt2-virt-row-title">{p.title}</h3>
              <p className="wwt2-virt-row-body">{p.body}</p>
            </Reveal>
          ))}
        </div>
      </div>

      <style>{`
        .wwt2-virt-head { max-width: 58ch; margin-bottom: clamp(3rem, 7vw, 5.5rem); }
        .wwt2-virt-title { margin: 1.5rem 0 1.6rem; }
        .wwt2-page .wwt2-virt-lede { max-width: 52ch; margin: 0; line-height: 1.75; }

        .wwt2-virt-stats {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: clamp(1.5rem, 4vw, 3rem);
          padding-bottom: clamp(3rem, 6vw, 5rem);
          margin-bottom: clamp(3rem, 6vw, 5rem);
          border-bottom: 1px solid var(--wwt-clay);
        }
        .wwt2-virt-stat { display: flex; flex-direction: column; gap: 0.7rem; }
        .wwt2-virt-num {
          font-family: var(--wwt-serif); font-weight: 300;
          font-size: clamp(3.2rem, 7vw, 6rem); line-height: 1;
          color: var(--wwt-ink); font-variant-numeric: tabular-nums;
        }
        .wwt2-virt-stat-label {
          font-family: var(--wwt-sans); font-size: 0.75rem; font-weight: 500;
          text-transform: uppercase; letter-spacing: 0.2em; color: var(--wwt-stone);
          max-width: 22ch;
        }

        .wwt2-virt-ledger { display: flex; flex-direction: column; }
        .wwt2-virt-row {
          display: grid; grid-template-columns: 4rem 1fr 1.4fr;
          gap: clamp(1rem, 3vw, 3rem); align-items: baseline;
          padding: clamp(1.4rem, 2.6vw, 2.2rem) 0;
          border-bottom: 1px solid var(--wwt-clay);
          position: relative;
        }
        /* Hairline draws in as the row reveals. */
        .wwt2-virt-row::after {
          content: ''; position: absolute; left: 0; right: 0; bottom: -1px; height: 1px;
          background: var(--wwt-ink);
          transform: scaleX(0); transform-origin: left;
          transition: transform 1100ms var(--wwt-ease) 200ms;
        }
        .wwt2-virt-row[data-inview='true']::after { transform: scaleX(1); }
        .wwt2-virt-k {
          font-family: var(--wwt-sans); font-size: 0.72rem; font-weight: 500;
          letter-spacing: 0.2em; color: var(--wwt-stone);
        }
        .wwt2-virt-row-title { font-size: clamp(1.25rem, 2vw, 1.7rem); margin: 0; }
        .wwt2-virt-row-body {
          font-family: var(--wwt-sans); font-weight: 300;
          color: var(--wwt-ink-soft); line-height: 1.7; margin: 0;
        }

        @media (max-width: 760px) {
          .wwt2-virt-stats { grid-template-columns: 1fr; gap: 2rem; }
          .wwt2-virt-row { grid-template-columns: 3rem 1fr; }
          .wwt2-virt-row-body { grid-column: 2; }
        }
        @media (prefers-reduced-motion: reduce) {
          .wwt2-virt-row::after { transition: none; transform: scaleX(1); }
        }
      `}</style>
    </section>
  )
}
