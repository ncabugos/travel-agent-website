'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import type { LuxuryHotel } from '@/lib/hotels'

const PAGE_SIZE = 9

type FormState = 'idle' | 'submitting' | 'success' | 'error'

interface FindHotelClientProps {
  agentId:   string
  countries: string[]
  vibes:     string[]
  brands:    string[]
}

export function FindHotelClient({ agentId, countries, vibes, brands }: FindHotelClientProps) {
  const [hotels,      setHotels]      = useState<LuxuryHotel[]>([])
  const [total,       setTotal]       = useState(0)
  const [loading,     setLoading]     = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [activeHotel, setActiveHotel] = useState<LuxuryHotel | null>(null)

  // Filters
  const [search,   setSearch]   = useState('')
  const [country,  setCountry]  = useState('')
  const [vibe,     setVibe]     = useState('')
  const [brand,    setBrand]    = useState('')
  const [pageSize, setPageSize] = useState(12)
  const [page,     setPage]     = useState(1)

  const base = `/t2/${agentId}`

  const fetchHotels = useCallback(async (p: number, append: boolean) => {
    if (append) setLoadingMore(true)
    else setLoading(true)

    const params = new URLSearchParams()
    if (search)  params.set('search',  search)
    if (country) params.set('country', country)
    if (vibe)    params.set('vibe',    vibe)
    if (brand)   params.set('brand',   brand)
    params.set('page',     String(p))
    params.set('pageSize', String(pageSize))

    const res = await fetch(`/api/hotels?${params}`)
    if (res.ok) {
      const data = await res.json()
      setHotels(prev => append ? [...prev, ...data.hotels] : data.hotels)
      setTotal(data.total)
    }
    if (append) setLoadingMore(false)
    else setLoading(false)
  }, [search, country, vibe, brand, pageSize])

  // Reset + fetch when filters or pageSize change
  useEffect(() => {
    setPage(1)
    setHotels([])
    const t = setTimeout(() => fetchHotels(1, false), search ? 350 : 0)
    return () => clearTimeout(t)
  }, [search, country, vibe, brand, pageSize])

  // Load More: fetch next page and append
  function loadMore() {
    const next = page + 1
    setPage(next)
    fetchHotels(next, true)
  }

  const hasMore = hotels.length < total

  function resetFilters() {
    setSearch(''); setCountry(''); setVibe(''); setBrand('')
  }

  return (
    <>
      {/* ── Search & Filters ── */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 40 }}>
        {/* Search input */}
        <input
          type="text"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          placeholder="Search hotels, cities, countries…"
          style={{
            fontFamily: 'var(--t2-font-sans)', fontSize: 12,
            letterSpacing: '0.06em', padding: '10px 20px',
            border: '1px solid var(--t2-border)', background: 'transparent',
            color: 'var(--t2-text)', minWidth: 280, outline: 'none',
          }}
        />

        {/* Country */}
        <select value={country} onChange={e => { setCountry(e.target.value); setPage(1) }} style={selectStyle}>
          <option value="">All Countries</option>
          {countries.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        {/* Vibe */}
        <select value={vibe} onChange={e => { setVibe(e.target.value) }} style={selectStyle}>
          <option value="">Any Vibe</option>
          {vibes.map(v => <option key={v} value={v}>{v}</option>)}
        </select>

        {/* Brand / Hotel Program */}
        <select value={brand} onChange={e => { setBrand(e.target.value) }} style={selectStyle}>
          <option value="">All Hotels</option>
          {brands.map(b => <option key={b} value={b}>{b}</option>)}
        </select>

        {!!(search || country || vibe || brand) && (
          <button onClick={resetFilters} style={{
            fontFamily: 'var(--t2-font-sans)', fontSize: 11, letterSpacing: '0.1em',
            textTransform: 'uppercase', padding: '10px 20px', border: '1px solid var(--t2-border)',
            background: 'transparent', color: 'var(--t2-text-muted)', cursor: 'pointer',
          }}>
            Clear
          </button>
        )}
      </div>

      {/* Results count */}
      <p style={{
        textAlign: 'center', fontFamily: 'var(--t2-font-sans)',
        fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
        color: 'var(--t2-text-muted)', marginBottom: 32,
      }}>
        {loading
          ? 'Searching…'
          : `Showing ${hotels.length.toLocaleString()} of ${total.toLocaleString()} ${total === 1 ? 'Hotel' : 'Hotels'}`
        }
      </p>

      {/* ── Hotel Grid ── */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
          <span style={{ fontFamily: 'var(--t2-font-sans)', fontSize: 12, color: 'var(--t2-text-muted)', letterSpacing: '0.1em' }}>
            Loading…
          </span>
        </div>
      ) : (
        <div className="t2-grid-3">
          {hotels.map(hotel => (
            <div
              key={hotel.id}
              className="t2-card"
              style={{ overflow: 'hidden', height: '100%', backgroundColor: '#FFFFFF', borderRadius: 0, display: 'flex', flexDirection: 'column' }}
            >
              {/* Hero image */}
              <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', background: '#EDE8E1' }}>
                {hotel.cover_image_url ? (
                  <Image
                    src={hotel.cover_image_url}
                    alt={hotel.name}
                    fill
                    className="t2-card-image"
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    unoptimized
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontFamily: 'var(--t2-font-serif)', color: 'var(--t2-text-muted)', fontSize: 14 }}>
                      {hotel.name}
                    </span>
                  </div>
                )}
                {/* Vibe badge */}
                {hotel.vibe && (
                  <span style={{
                    position: 'absolute', top: 12, right: 12,
                    fontFamily: 'var(--t2-font-sans)', fontSize: 9, letterSpacing: '0.15em',
                    textTransform: 'uppercase', background: 'rgba(0,0,0,0.6)',
                    color: '#FFF', padding: '4px 10px', borderRadius: 2,
                  }}>
                    {hotel.vibe}
                  </span>
                )}
              </div>

              {/* Card body */}
              <div style={{ padding: '20px 24px 0', flex: 1 }}>
                <h3 style={{ fontFamily: 'var(--t2-font-serif)', fontSize: 16, fontWeight: 500, marginBottom: 6 }}>
                  {hotel.name}
                </h3>
                <p style={{ fontFamily: 'var(--t2-font-sans)', fontSize: 11, letterSpacing: '0.06em', color: 'var(--t2-accent)', marginBottom: 10 }}>
                  {[hotel.city, hotel.country].filter(Boolean).join(', ')}
                </p>
                {hotel.description && (
                  <p style={{ fontFamily: 'var(--t2-font-sans)', fontSize: 12, lineHeight: 1.6, color: 'var(--t2-text-muted)', margin: 0 }}>
                    {hotel.description.substring(0, 100)}…
                  </p>
                )}
                {hotel.hotel_company && (
                  <p style={{ fontFamily: 'var(--t2-font-sans)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--t2-text-muted)', marginTop: 12 }}>
                    {hotel.hotel_company}
                  </p>
                )}
              </div>

              {/* Footer: Enquire button */}
              <div style={{ padding: '20px 24px 24px', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setActiveHotel(hotel)}
                  style={{
                    fontFamily: 'var(--t2-font-sans)', fontSize: 11,
                    letterSpacing: '0.15em', textTransform: 'uppercase',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--t2-text)', display: 'flex', alignItems: 'center', gap: 6, padding: 0,
                  }}
                >
                  Enquire <span style={{ fontSize: 14 }}>→</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && hotels.length === 0 && (
        <p style={{ textAlign: 'center', color: 'var(--t2-text-muted)', marginTop: 32 }}>
          No hotels found. Try clearing the filters.
        </p>
      )}

      {/* ── Load More + Show selector ── */}
      {hasMore && !loading && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 56, flexWrap: 'wrap' }}>
          <button
            onClick={loadMore}
            disabled={loadingMore}
            style={{
              fontFamily: 'var(--t2-font-sans)', fontSize: 11, letterSpacing: '0.15em',
              textTransform: 'uppercase', padding: '14px 48px',
              border: '1px solid var(--t2-text)', background: 'transparent',
              color: 'var(--t2-text)', cursor: loadingMore ? 'default' : 'pointer',
              opacity: loadingMore ? 0.5 : 1,
            }}
          >
            {loadingMore ? 'Loading…' : `Load More (${(total - hotels.length).toLocaleString()} remaining)`}
          </button>

          <select
            value={pageSize}
            onChange={e => setPageSize(Number(e.target.value))}
            style={{ ...selectStyle, minWidth: 120 }}
          >
            <option value={12}>Show 12</option>
            <option value={24}>Show 24</option>
            <option value={36}>Show 36</option>
          </select>
        </div>
      )}

      {/* ── Enquire Modal ── */}
      {activeHotel && (
        <HotelEnquireModal hotel={activeHotel} onClose={() => setActiveHotel(null)} />
      )}
    </>
  )
}

const selectStyle: React.CSSProperties = {
  fontFamily: 'var(--t2-font-sans)', fontSize: 12, letterSpacing: '0.08em',
  padding: '10px 20px', border: '1px solid var(--t2-border)', background: 'transparent',
  color: 'var(--t2-text)', cursor: 'pointer', minWidth: 180,
}

const pageBtn = (active: boolean): React.CSSProperties => ({
  fontFamily: 'var(--t2-font-sans)', fontSize: 12, letterSpacing: '0.1em',
  width: 40, height: 40,
  border: active ? '1px solid var(--t2-text)' : '1px solid var(--t2-border)',
  background: active ? 'var(--t2-text)' : 'transparent',
  color: active ? '#FFF' : 'var(--t2-text)',
  cursor: 'pointer',
})

// ── Hotel Enquire Modal ───────────────────────────────────────────────────────

function HotelEnquireModal({ hotel, onClose }: { hotel: LuxuryHotel; onClose: () => void }) {
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
              We'll be in touch about <strong>{hotel.name}</strong> within 24 hours.
            </p>
          </div>
        ) : (
          <>
            <p className="t2-label" style={{ marginBottom: 8, color: 'var(--t2-accent)' }}>Enquire Now</p>
            <h3 className="t2-heading t2-heading-sm" style={{ marginBottom: 4 }}>{hotel.name}</h3>
            <p style={{ fontFamily: 'var(--t2-font-sans)', fontSize: 13, color: 'var(--t2-text-muted)', marginBottom: 28 }}>
              {[hotel.city, hotel.country].filter(Boolean).join(', ')}
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <input type="text"  placeholder="First Name *" required className="t2-input" />
                <input type="text"  placeholder="Last Name *"  required className="t2-input" />
              </div>
              <input type="email" placeholder="Email Address *" required className="t2-input" />
              <input type="tel"   placeholder="Phone Number"            className="t2-input" />
              <input type="text"  placeholder="Check-in / Check-out Dates" className="t2-input" />
              <textarea
                rows={4}
                placeholder={`Tell us about your stay at ${hotel.name} — room preferences, occasions, special requests…`}
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

