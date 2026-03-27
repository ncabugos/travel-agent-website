'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import type { Villa } from '@/lib/villas'

const PAGE_SIZE = 9

interface FindVillaClientProps {
  agentId: string
  villas:  Villa[]
  countries: string[]
}

const BED_FILTERS = [
  { label: 'Any Bedrooms', value: 0 },
  { label: '1–2 Bedrooms', value: 1 },
  { label: '3–4 Bedrooms', value: 3 },
  { label: '5+ Bedrooms',  value: 5 },
]

type FormState = 'idle' | 'submitting' | 'success' | 'error'

export function FindVillaClient({ agentId, villas, countries }: FindVillaClientProps) {
  const [country,      setCountry]      = useState('')
  const [minBeds,      setMinBeds]      = useState(0)
  const [maxBeds,      setMaxBeds]      = useState(99)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [activeVilla,  setActiveVilla]  = useState<Villa | null>(null)

  const filtered = useMemo(() => {
    return villas
      .filter(v => {
        if (country && v.country !== country) return false
        if (v.bedrooms !== null) {
          if (v.bedrooms < minBeds) return false
          if (v.bedrooms > maxBeds) return false
        }
        return true
      })
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [villas, country, minBeds, maxBeds])

  const paginated = filtered.slice(0, visibleCount)
  const hasMore   = visibleCount < filtered.length

  function handleBedFilter(value: number) {
    setVisibleCount(PAGE_SIZE)
    if (value === 0) { setMinBeds(0); setMaxBeds(99); return }
    if (value === 1) { setMinBeds(1); setMaxBeds(2); return }
    if (value === 3) { setMinBeds(3); setMaxBeds(4); return }
    if (value === 5) { setMinBeds(5); setMaxBeds(99); return }
  }

  function activeBedLabel() {
    if (minBeds === 0 && maxBeds === 99) return 0
    if (minBeds === 1 && maxBeds === 2) return 1
    if (minBeds === 3 && maxBeds === 4) return 3
    return 5
  }

  return (
    <>
      {/* ── Filters ── */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 48 }}>
        <select
          value={country}
          onChange={e => { setCountry(e.target.value); setVisibleCount(PAGE_SIZE) }}
          style={{
            fontFamily: 'var(--t2-font-sans)', fontSize: 12, letterSpacing: '0.1em',
            textTransform: 'uppercase', padding: '10px 20px',
            border: '1px solid var(--t2-border)', background: 'transparent',
            color: 'var(--t2-text)', cursor: 'pointer', minWidth: 200,
          }}
        >
          <option value="">All Countries</option>
          {countries.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <div className="t2-tabs" style={{ margin: 0 }}>
          {BED_FILTERS.map(f => (
            <button
              key={f.value}
              className={`t2-tab ${activeBedLabel() === f.value ? 't2-tab-active' : ''}`}
              onClick={() => handleBedFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Results count ── */}
      <p style={{
        textAlign: 'center', fontFamily: 'var(--t2-font-sans)',
        fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
        color: 'var(--t2-text-muted)', marginBottom: 32,
      }}>
        {filtered.length} {filtered.length === 1 ? 'Villa' : 'Villas'} available
      </p>

      {/* ── Villa Cards ── */}
      <div className="t2-grid-3">
        {paginated.map(villa => (
          <div
            key={villa.id}
            className="t2-card"
            style={{ overflow: 'hidden', height: '100%', backgroundColor: '#FFFFFF', borderRadius: 0, display: 'flex', flexDirection: 'column' }}
          >
            {/* Hero image */}
            <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', background: '#EDE8E1' }}>
              {villa.cover_image_url ? (
                <Image
                  src={villa.cover_image_url}
                  alt={villa.name}
                  fill
                  className="t2-card-image"
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  unoptimized
                />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: 'var(--t2-font-serif)', color: 'var(--t2-text-muted)', fontSize: 14 }}>
                    {villa.name}
                  </span>
                </div>
              )}
              {/* Country badge */}
              <span style={{
                position: 'absolute', top: 12, left: 12,
                fontFamily: 'var(--t2-font-sans)', fontSize: 9, letterSpacing: '0.15em',
                textTransform: 'uppercase', background: 'rgba(0,0,0,0.6)',
                color: '#FFF', padding: '4px 10px', borderRadius: 2,
              }}>
                {villa.country}
              </span>
            </div>

            {/* Card body */}
            <div style={{ padding: '20px 24px 0', flex: 1 }}>
              <h3 style={{ fontFamily: 'var(--t2-font-serif)', fontSize: 16, fontWeight: 500, marginBottom: 8 }}>
                {villa.name}
              </h3>
              {villa.city_region && (
                <p style={{ fontFamily: 'var(--t2-font-sans)', fontSize: 11, color: 'var(--t2-text-muted)', marginBottom: 12, letterSpacing: '0.05em' }}>
                  {villa.neighborhood ? `${villa.neighborhood}, ` : ''}{villa.city_region}
                </p>
              )}
              {/* Stats chips */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {villa.bedrooms && (
                  <span style={chipStyle}>{villa.bedrooms} Bed{villa.bedrooms !== 1 ? 's' : ''}</span>
                )}
                {villa.bathrooms && (
                  <span style={chipStyle}>{villa.bathrooms} Bath{villa.bathrooms !== 1 ? 's' : ''}</span>
                )}
                {villa.max_guests && (
                  <span style={chipStyle}>Up to {villa.max_guests} guests</span>
                )}
              </div>
              {/* Price */}
              {villa.price_per_night && (
                <p style={{ fontFamily: 'var(--t2-font-sans)', fontSize: 12, marginTop: 14, color: 'var(--t2-text)' }}>
                  From <strong style={{ fontFamily: 'var(--t2-font-serif)' }}>${villa.price_per_night.toLocaleString()}</strong> / night
                </p>
              )}
            </div>

            {/* Footer: Enquire button */}
            <div style={{ padding: '20px 24px 24px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              <button
                onClick={() => setActiveVilla(villa)}
                style={{
                  fontFamily: 'var(--t2-font-sans)',
                  fontSize: 11,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--t2-text)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: 0,
                }}
              >
                Enquire <span style={{ fontSize: 14 }}>→</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p style={{ textAlign: 'center', color: 'var(--t2-text-muted)', marginTop: 32 }}>
          No villas found for the selected filters.
        </p>
      )}

      {/* ── Show More ── */}
      {hasMore && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 56 }}>
          <button
            onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
            style={{
              fontFamily: 'var(--t2-font-sans)', fontSize: 11, letterSpacing: '0.15em',
              textTransform: 'uppercase', padding: '14px 40px',
              border: '1px solid var(--t2-text)', background: 'transparent',
              color: 'var(--t2-text)', cursor: 'pointer',
            }}
          >
            Show More ({filtered.length - visibleCount} remaining)
          </button>
        </div>
      )}

      {/* ── Enquire Modal ── */}
      {activeVilla && (
        <VillaEnquireModal
          villa={activeVilla}
          onClose={() => setActiveVilla(null)}
        />
      )}
    </>
  )
}

// ── Enquire Modal ─────────────────────────────────────────────────────────────

function VillaEnquireModal({ villa, onClose }: { villa: Villa; onClose: () => void }) {
  const [state, setState] = useState<FormState>('idle')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setState('submitting')
    await new Promise(r => setTimeout(r, 1500))
    setState('success')
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.55)', zIndex: 999,
          backdropFilter: 'blur(4px)', animation: 'fadeIn 0.25s ease',
        }}
      />

      {/* Modal panel */}
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1000, width: '92vw', maxWidth: 520, maxHeight: '90vh',
        overflowY: 'auto', background: 'var(--t2-bg)',
        padding: '48px 40px 40px', borderRadius: 4,
        boxShadow: '0 32px 80px rgba(0,0,0,0.20)',
        animation: 'slideUp 0.3s ease',
      }}>
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute', top: 20, right: 24,
            background: 'none', border: 'none', fontSize: 22,
            color: 'var(--t2-text-muted)', cursor: 'pointer', lineHeight: 1,
          }}
        >
          ×
        </button>

        {state === 'success' ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <p className="t2-label" style={{ color: 'var(--t2-accent)', marginBottom: 12 }}>Request Received</p>
            <h3 className="t2-heading t2-heading-sm" style={{ marginBottom: 12 }}>Thank you!</h3>
            <p style={{ fontFamily: 'var(--t2-font-sans)', fontSize: 14, color: 'var(--t2-text-muted)' }}>
              We'll be in touch about <strong>{villa.name}</strong> within 24 hours.
            </p>
          </div>
        ) : (
          <>
            <p className="t2-label" style={{ marginBottom: 8, color: 'var(--t2-accent)' }}>Enquire</p>
            <h3 className="t2-heading t2-heading-sm" style={{ marginBottom: 4 }}>{villa.name}</h3>
            <p style={{ fontFamily: 'var(--t2-font-sans)', fontSize: 13, color: 'var(--t2-text-muted)', marginBottom: 28 }}>
              {[villa.neighborhood, villa.city_region, villa.country].filter(Boolean).join(', ')}
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <input type="text"  placeholder="First Name *" required className="t2-input" />
                <input type="text"  placeholder="Last Name *"  required className="t2-input" />
              </div>
              <input type="email" placeholder="Email Address *" required className="t2-input" />
              <input type="tel"   placeholder="Phone Number"            className="t2-input" />
              <input type="text"  placeholder="Preferred Travel Dates"  className="t2-input" />
              <textarea
                rows={4}
                placeholder={`Tell us about your ideal stay at ${villa.name} — group size, occasions, special requests…`}
                className="t2-input t2-textarea"
              />
              <button
                type="submit"
                disabled={state === 'submitting'}
                className="t2-btn t2-btn-primary"
                style={{ width: '100%', textAlign: 'center', opacity: state === 'submitting' ? 0.65 : 1 }}
              >
                {state === 'submitting' ? 'Sending…' : 'Send Enquiry'}
              </button>
            </form>
          </>
        )}
      </div>

      <style>{`
        @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translate(-50%, calc(-50% + 20px)) } to { opacity: 1; transform: translate(-50%, -50%) } }
      `}</style>
    </>
  )
}

const chipStyle: React.CSSProperties = {
  fontFamily: 'var(--t2-font-sans)', fontSize: 10, letterSpacing: '0.08em',
  textTransform: 'uppercase', padding: '4px 10px',
  border: '1px solid var(--t2-border)', color: 'var(--t2-text-muted)', whiteSpace: 'nowrap',
}
