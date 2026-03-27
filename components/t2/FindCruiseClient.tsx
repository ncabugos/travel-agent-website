'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { CruiseLine } from '@/lib/cruise-lines'

interface FindCruiseClientProps {
  agentId: string
  allCruises: CruiseLine[]
}

const TABS = [
  { label: 'All',        value: '' },
  { label: 'Ocean',      value: 'ocean' },
  { label: 'River',      value: 'river' },
  { label: 'Yacht',      value: 'yacht' },
  { label: 'Expedition', value: 'expedition' },
]

export function FindCruiseClient({ agentId, allCruises }: FindCruiseClientProps) {
  const [activeTab, setActiveTab] = useState('')
  const [filtered, setFiltered] = useState(allCruises)

  useEffect(() => {
    setFiltered(
      activeTab
        ? allCruises.filter(c => c.cruise_types.includes(activeTab))
        : allCruises
    )
  }, [activeTab, allCruises])

  const base = `/t2/${agentId}`

  return (
    <>
      {/* Tabs */}
      <div className="t2-tabs" style={{ justifyContent: 'center', marginBottom: 48 }}>
        {TABS.map(tab => (
          <button
            key={tab.value}
            className={`t2-tab ${activeTab === tab.value ? 't2-tab-active' : ''}`}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Cruise Cards */}
      <div className="t2-grid-3">
        {filtered.map(cruise => (
          <Link
            key={cruise.id}
            href={`${base}/find-cruise/${cruise.slug}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div className="t2-card" style={{ overflow: 'hidden', height: '100%', backgroundColor: '#FFFFFF', borderRadius: 0 }}>
              {/* Hero image */}
              <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
                {cruise.hero_image_url ? (
                  <Image
                    src={cruise.hero_image_url}
                    alt={cruise.name}
                    fill
                    className="t2-card-image"
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    unoptimized
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: 'var(--t2-dark-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: '#FFF', fontFamily: 'var(--t2-font-serif)' }}>{cruise.name}</span>
                  </div>
                )}
                {/* Type badges */}
                <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 4 }}>
                  {cruise.cruise_types.map(type => (
                    <span
                      key={type}
                      style={{
                        fontFamily: 'var(--t2-font-sans)',
                        fontSize: 9,
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        background: 'rgba(0,0,0,0.6)',
                        color: '#FFFFFF',
                        padding: '4px 10px',
                        borderRadius: 2,
                      }}
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card body: logo + name + description */}
              <div className="t2-card-body" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '24px' }}>
                {cruise.logo_url && (
                  <div style={{ flexShrink: 0, width: 120, height: 56, position: 'relative' }}>
                    <Image
                      src={cruise.logo_url}
                      alt={`${cruise.name} logo`}
                      fill
                      style={{ objectFit: 'contain', objectPosition: 'left center' }}
                      unoptimized
                    />
                  </div>
                )}
                <div>
                  <h3 style={{ fontFamily: 'var(--t2-font-serif)', fontSize: 16, fontWeight: 500, marginBottom: 4 }}>
                    {cruise.name}
                  </h3>
                  {cruise.description && (
                    <p style={{ fontFamily: 'var(--t2-font-sans)', fontSize: 12, lineHeight: 1.5, color: 'var(--t2-text-muted)', margin: 0 }}>
                      {cruise.description.substring(0, 90)}…
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p style={{ textAlign: 'center', color: 'var(--t2-text-muted)', marginTop: 32 }}>
          No cruise lines found in this category.
        </p>
      )}
    </>
  )
}
