'use client'

import Image from 'next/image'
import { Coffee, Sparkles, Leaf, Gift } from 'lucide-react'
import type { DisplaySupplier } from '@/lib/mock-data'
import type { VirtuosoPerks } from '@/types/database'

interface SupplierCardProps {
  supplier: DisplaySupplier
}

const PERK_CONFIG: {
  key: keyof VirtuosoPerks
  label: string
  icon: React.ElementType
}[] = [
  { key: 'breakfast',      label: 'Daily Breakfast',  icon: Coffee    },
  { key: 'room_upgrade',   label: 'Room Upgrade',     icon: Sparkles  },
  { key: 'spa_credit',     label: 'Spa Credit',       icon: Leaf      },
  { key: 'welcome_amenity',label: 'Welcome Amenity',  icon: Gift      },
]

function getDisplayPerks(perks: VirtuosoPerks | null) {
  if (!perks) return []
  return PERK_CONFIG.filter(({ key }) => {
    const val = perks[key]
    return val && val !== false
  }).map(({ key, label, icon }) => {
    const val = perks[key]
    return {
      label: typeof val === 'string' ? val : label,
      icon,
    }
  }).slice(0, 3)
}

export function SupplierCard({ supplier }: SupplierCardProps) {
  const hasPerks = supplier.virtuoso_perks &&
    Object.values(supplier.virtuoso_perks).some(Boolean)
  const perks = getDisplayPerks(supplier.virtuoso_perks)

  return (
    <article className="group cursor-pointer">
      {/* ── Image ───────────────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '4 / 5' }}>
        <Image
          src={supplier.cover_image}
          alt={supplier.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        {/* Virtuoso badge */}
        {hasPerks && (
          <div
            className="absolute top-4 right-4 px-2.5 py-1"
            style={{
              background: 'rgba(255,255,255,0.92)',
              letterSpacing: '0.18em',
            }}
          >
            <span
              className="text-[9px] font-medium uppercase"
              style={{ color: '#8B6F47' }}
            >
              Virtuoso
            </span>
          </div>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
      </div>

      {/* ── Text ────────────────────────────────────────── */}
      <div className="mt-4 space-y-1.5">
        <p
          className="text-[10px] uppercase tracking-[0.28em]"
          style={{ color: '#9CA3A0' }}
        >
          {supplier.location}
        </p>
        <h3
          className="text-xl font-light leading-snug"
          style={{ fontFamily: "var(--font-cormorant, 'Cormorant Garamond', Georgia, serif)", color: '#1C1C1E' }}
        >
          {supplier.name}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>
          {supplier.description}
        </p>

        {/* Perks */}
        {perks.length > 0 && (
          <ul className="mt-3 space-y-1">
            {perks.map(({ label, icon: Icon }) => (
              <li key={label} className="flex items-center gap-2">
                <Icon
                  className="shrink-0"
                  style={{ width: 11, height: 11, color: '#B8A47A' }}
                  strokeWidth={1.5}
                />
                <span
                  className="text-[11px] tracking-wide"
                  style={{ color: '#9CA3A0' }}
                >
                  {label}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  )
}
