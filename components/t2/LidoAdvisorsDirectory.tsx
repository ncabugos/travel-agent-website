import Image from 'next/image'
import Link from 'next/link'
import type { AgencyAdvisor } from '@/lib/agency-advisors'

interface LidoAdvisorsDirectoryProps {
  agentId: string
  advisors: AgencyAdvisor[]
  eyebrow?: string
  heading?: string
  subheading?: string
}

/**
 * The Lido Collective advisor directory — a simple, dense grid of circular
 * headshots built to scale to a 50+ advisor roster. Each tile: round photo,
 * name in tracked caps, role in italic serif. Clicking opens the full profile.
 * Deliberately plain so the page stays fast and legible at scale.
 */
export function LidoAdvisorsDirectory({
  agentId,
  advisors,
  eyebrow = 'The Team',
  heading = 'Meet the advisors.',
  subheading,
}: LidoAdvisorsDirectoryProps) {
  if (!advisors.length) return null
  const base = `/t2/${agentId}`

  return (
    <section className="lido-section">
      <div style={{ maxWidth: 680, marginBottom: 'clamp(48px, 6vw, 72px)' }}>
        <p className="lido-eyebrow" style={{ marginBottom: 18 }}>{eyebrow}</p>
        <h1 className="lido-display" style={{ fontSize: 'clamp(40px, 6vw, 76px)', lineHeight: 1.0, margin: '0 0 20px' }}>{heading}</h1>
        {subheading && <p className="lido-body" style={{ fontSize: 16, maxWidth: 560 }}>{subheading}</p>}
      </div>

      <div className="lido-roster">
        {advisors.map((a) => (
          <Link key={a.slug} href={`${base}/advisors/${a.slug}`} className="lido-roster-card">
            <div className="lido-roster-photo">
              <Image src={a.photo} alt={a.name} fill sizes="200px" style={{ objectFit: 'cover' }} />
            </div>
            <h3 className="lido-roster-name">{a.name}</h3>
            <p className="lido-roster-title">{a.title}</p>
          </Link>
        ))}
      </div>

      <style>{`
        .lido-roster { display: grid; grid-template-columns: repeat(4, 1fr); gap: 56px 32px; }
        .lido-roster-card { text-decoration: none; color: var(--lido-text); display: flex; flex-direction: column; align-items: center; text-align: center; }
        .lido-roster-photo { position: relative; width: 100%; max-width: 200px; aspect-ratio: 1 / 1; border-radius: 999px; overflow: hidden; margin-bottom: 22px; background: var(--lido-bg-grey); }
        .lido-roster-photo img { transition: transform 0.5s var(--t2-ease-out); }
        .lido-roster-card:hover .lido-roster-photo img { transform: scale(1.05); }
        .lido-roster-name { font-family: var(--lido-font-body); font-size: 13px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--lido-text); margin: 0 0 6px; }
        .lido-roster-title { font-family: var(--lido-font-display); font-style: italic; font-size: 17px; color: #5A6B7E; margin: 0; }
        @media (max-width: 1024px) { .lido-roster { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 640px)  { .lido-roster { grid-template-columns: repeat(2, 1fr); gap: 40px 20px; } }
      `}</style>
    </section>
  )
}
