'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export type LidoService = {
  num: string
  name: string
  desc: string
  image: string
  href: string
}

interface LidoServicesProps {
  base: string
  services: LidoService[]
}

/**
 * "What We Do" — an interactive, editorial services index.
 *
 * Desktop: a sticky image stage on the left crossfades to whichever service the
 * visitor is hovering/focusing in the list on the right. The list rows carry
 * oversized index numerals, a draw-in underline, and a travelling arrow — the
 * kind of playful, tactile interaction a SmartFlyer-grade site leans on.
 *
 * Mobile: the stage collapses and each row shows its own image inline, so the
 * same content reads as a clean stacked list.
 */
export function LidoServices({ base, services }: LidoServicesProps) {
  const [active, setActive] = useState(0)

  return (
    <div className="lido-svc">
      {/* Sticky image stage (desktop only) */}
      <div className="lido-svc-stage" aria-hidden data-reveal>
        {services.map((s, i) => (
          <div key={s.name} className={`lido-svc-stage-img lido-leaf ${i === active ? 'is-active' : ''}`}>
            <Image src={s.image} alt="" fill sizes="(max-width: 900px) 0px, 42vw" />
          </div>
        ))}
        <span className="lido-svc-stage-tag lido-eyebrow">{services[active]?.name}</span>
      </div>

      {/* Interactive list */}
      <ul className="lido-svc-list">
        {services.map((s, i) => (
          <li key={s.name} data-reveal style={{ ['--reveal-delay' as string]: `${i * 90}ms` }}>
            <Link
              href={`${base}${s.href}`}
              className={`lido-svc-row ${i === active ? 'is-active' : ''}`}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
            >
              <span className="lido-svc-num lido-display">{s.num}</span>
              <span className="lido-svc-body">
                <span className="lido-svc-name lido-display">{s.name}</span>
                <span className="lido-svc-desc">{s.desc}</span>
                {/* Inline image — mobile only */}
                <span className="lido-svc-thumb lido-leaf">
                  <Image src={s.image} alt={s.name} fill sizes="(max-width: 900px) 100vw, 0px" />
                </span>
              </span>
              <span className="lido-svc-arrow" aria-hidden>→</span>
            </Link>
          </li>
        ))}
      </ul>

      <style>{`
        .lido-svc {
          display: grid;
          grid-template-columns: 0.92fr 1.08fr;
          gap: clamp(40px, 6vw, 88px);
          align-items: start;
        }

        /* ── Sticky image stage ── */
        .lido-svc-stage {
          position: sticky; top: 120px;
          aspect-ratio: 4 / 5;
          border-radius: 0 0 0 46%;
          overflow: hidden;
          background: var(--lido-bg-grey);
        }
        .lido-svc-stage-img {
          position: absolute; inset: 0;
          opacity: 0; transform: scale(1.06);
          transition: opacity 0.8s var(--t2-ease-out), transform 1.2s var(--t2-ease-out);
        }
        .lido-svc-stage-img.is-active { opacity: 1; transform: scale(1); }
        .lido-svc-stage-img > img { object-fit: cover; }
        .lido-svc-stage-tag {
          position: absolute; left: 28px; bottom: 26px; z-index: 2;
          color: var(--lido-on-dark) !important; letter-spacing: 0.34em;
          text-shadow: 0 1px 16px rgba(6,16,30,0.6);
        }

        /* ── List ── */
        .lido-svc-list { list-style: none; margin: 0; padding: 0; }
        .lido-svc-list > li { border-top: 1px solid var(--lido-line); }
        .lido-svc-list > li:last-child { border-bottom: 1px solid var(--lido-line); }

        .lido-svc-row {
          position: relative;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: clamp(20px, 3vw, 40px);
          padding: clamp(26px, 3.4vw, 40px) 4px;
          text-decoration: none;
          color: var(--lido-text);
        }
        /* Draw-in highlight wash */
        .lido-svc-row::before {
          content: ''; position: absolute; inset: 0; z-index: 0;
          background: var(--lido-bg-grey);
          transform: scaleX(0); transform-origin: left center;
          transition: transform 0.55s var(--t2-ease-out);
        }
        .lido-svc-row.is-active::before { transform: scaleX(1); }
        .lido-svc-row > * { position: relative; z-index: 1; }

        .lido-svc-num {
          font-size: clamp(26px, 3vw, 38px);
          color: var(--lido-text-faint);
          transition: color 0.4s var(--t2-ease), transform 0.5s var(--t2-ease-out);
        }
        .lido-svc-row.is-active .lido-svc-num { color: var(--lido-text); transform: translateX(6px); }

        .lido-svc-body { display: block; min-width: 0; }
        .lido-svc-name {
          display: block;
          font-size: clamp(30px, 4.4vw, 54px);
          line-height: 1.02;
          transition: transform 0.5s var(--t2-ease-out);
        }
        .lido-svc-row.is-active .lido-svc-name { transform: translateX(8px); }
        .lido-svc-desc {
          display: block;
          font-family: var(--lido-font-body);
          font-size: 14px; line-height: 1.7;
          color: var(--lido-text-muted);
          max-width: 46ch;
          margin-top: 10px;
          max-height: 0; opacity: 0; overflow: hidden;
          transition: max-height 0.55s var(--t2-ease-out), opacity 0.5s var(--t2-ease), margin-top 0.4s var(--t2-ease);
        }
        .lido-svc-row.is-active .lido-svc-desc { max-height: 120px; opacity: 1; }

        .lido-svc-thumb { display: none; }

        .lido-svc-arrow {
          font-family: var(--lido-font-body);
          font-size: clamp(22px, 2.6vw, 30px);
          color: var(--lido-text);
          opacity: 0; transform: translateX(-12px);
          transition: opacity 0.4s var(--t2-ease), transform 0.5s var(--t2-ease-out);
        }
        .lido-svc-row.is-active .lido-svc-arrow { opacity: 1; transform: translateX(0); }

        /* ── Mobile: drop the stage, show inline thumbs, always-open desc ── */
        @media (max-width: 900px) {
          .lido-svc { grid-template-columns: 1fr; gap: 0; }
          .lido-svc-stage { display: none; }
          .lido-svc-row {
            grid-template-columns: auto 1fr;
            align-items: start;
            padding: 32px 2px;
          }
          .lido-svc-row::before { display: none; }
          .lido-svc-arrow { display: none; }
          .lido-svc-desc { max-height: none; opacity: 1; margin-top: 8px; }
          .lido-svc-thumb {
            display: block; position: relative;
            width: 100%; aspect-ratio: 16 / 10;
            margin-top: 20px; overflow: hidden;
          }
          .lido-svc-thumb > img { object-fit: cover; }
          .lido-svc-num { font-size: 22px; }
        }
      `}</style>
    </div>
  )
}
