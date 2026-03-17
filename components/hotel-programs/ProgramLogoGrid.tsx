import Link from 'next/link'
import type { HotelProgram } from '@/lib/hotel-programs'

interface ProgramLogoGridProps {
  programs: HotelProgram[]
  agentId: string
}

const CATEGORY_LABELS: Record<string, string> = {
  invitation_only:  'Invitation Only',
  brand_programme:  'Brand Programme',
  luxury_collection: 'Luxury Collection',
  global_network:   'Global Network',
}

function ProgramLogoFallback({ name }: { name: string }) {
  const words = name.replace(/[^a-zA-Z\s]/g, '').trim().split(/\s+/)
  const initials = words.length >= 2
    ? (words[0][0] + words[1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase()
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{
        fontFamily: 'var(--font-serif)',
        fontSize: '28px',
        fontWeight: 300,
        letterSpacing: '0.12em',
        color: 'var(--charcoal)',
        userSelect: 'none',
      }}>
        {initials}
      </span>
    </div>
  )
}

export function ProgramLogoGrid({ programs, agentId }: ProgramLogoGridProps) {
  if (!programs.length) return null

  return (
    <>
      <style>{`
        /* ── Program Logo Grid ─────────────────────────────────── */
        .plg-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 0;
          border: 1px solid #e8e4dd;
        }
        @media (max-width: 1200px) {
          .plg-grid { grid-template-columns: repeat(4, 1fr); }
        }
        @media (max-width: 860px) {
          .plg-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 480px) {
          .plg-grid { grid-template-columns: repeat(3, 1fr); }
        }

        /* ── Cell ─────────────────────────────────────────── */
        .plg-cell {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          padding: 36px 20px 28px;
          background: #ffffff;
          border-right: 1px solid #e8e4dd;
          border-bottom: 1px solid #e8e4dd;
          text-decoration: none;
          position: relative;
          min-height: 200px;
          transition: background 0.3s ease, box-shadow 0.3s ease;
        }
        .plg-cell:hover {
          background: #ffffff;
          box-shadow: inset 0 0 0 1.5px rgba(181,148,90,0.3);
          z-index: 1;
        }
        .plg-cell:hover .plg-logo-img {
          filter: grayscale(0) !important;
          transform: scale(1.05);
        }
        .plg-cell:hover .plg-arrow {
          opacity: 1 !important;
          transform: translateX(3px) !important;
        }

        /* ── Logo image ───────────────────────────────────── */
        .plg-logo-wrap {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 8px 0;
        }
        .plg-logo-img {
          max-width: 88%;
          max-height: 160px;
          object-fit: contain;
          filter: grayscale(1);
          transition: filter 0.35s ease, transform 0.35s ease;
        }
        @media (max-width: 860px) {
          .plg-logo-img  { max-height: 120px; }
          .plg-cell      { min-height: 190px; padding: 28px 14px 22px; }
        }
        @media (max-width: 480px) {
          .plg-logo-img  { max-height: 90px; }
          .plg-cell      { min-height: 160px; padding: 22px 10px 18px; }
        }

        /* ── Footer area ──────────────────────────────────── */
        .plg-footer {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          width: 100%;
          margin-top: 12px;
        }

        .plg-category {
          font-family: var(--font-sans);
          font-size: 7px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #B5945A;
          opacity: 0.75;
          text-align: center;
          white-space: nowrap;
        }
        @media (max-width: 480px) {
          .plg-category { display: none; }
        }

        .plg-name {
          font-family: var(--font-sans);
          font-size: 8px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--charcoal);
          text-align: center;
          line-height: 1.5;
          opacity: 0.65;
        }
        @media (max-width: 480px) {
          .plg-name { font-size: 7px; letter-spacing: 0.12em; }
        }


      `}</style>

      <div className="plg-grid">
        {programs.map((program) => (
          <Link
            key={program.id}
            href={`/frontend/${agentId}/resources/${program.slug}`}
            className="plg-cell"
            title={program.name}
          >
            {/* Logo */}
            <div className="plg-logo-wrap">
              {program.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={program.logo_url}
                  alt={program.name}
                  className="plg-logo-img"
                />
              ) : (
                <ProgramLogoFallback name={program.name} />
              )}
            </div>

            {/* Footer — category + name */}
            <div className="plg-footer">
              {program.category && (
                <span className="plg-category">
                  {CATEGORY_LABELS[program.category] ?? program.category}
                </span>
              )}
              <p className="plg-name">{program.name}</p>
            </div>


          </Link>
        ))}
      </div>
    </>
  )
}
