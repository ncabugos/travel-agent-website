'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import type { LuxuryHotel } from '@/lib/hotels'
import { HotelCardImage } from '@/components/t2/HotelCardImage'

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
            <Link
              key={hotel.id}
              href={`${base}/hotels/${hotel.slug}`}
              className="t2-card"
              style={{
                overflow: 'hidden', height: '100%', backgroundColor: '#FFFFFF',
                borderRadius: 0, display: 'flex', flexDirection: 'column',
                textDecoration: 'none', color: 'inherit',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
            >
              {/* Hero image (with graceful fallback for stale Virtuoso URLs) */}
              <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', background: '#EDE8E1' }}>
                <HotelCardImage
                  src={hotel.cover_image_url}
                  alt={hotel.name}
                  fallbackLabel={hotel.name}
                />

                {/* Vibe badge */}
                {hotel.vibe && (
                  <span style={{
                    position: 'absolute', top: 14, left: 14,
                    fontFamily: 'var(--t2-font-sans)', fontSize: 10, fontWeight: 600,
                    letterSpacing: '0.2em', textTransform: 'uppercase',
                    background: '#fff', color: 'var(--t2-text)',
                    padding: '7px 14px', borderRadius: 2,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
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

              {/* Footer: View details affordance */}
              <div style={{ padding: '20px 24px 24px', display: 'flex', justifyContent: 'flex-end' }}>
                <span style={{
                  fontFamily: 'var(--t2-font-sans)', fontSize: 11,
                  letterSpacing: '0.15em', textTransform: 'uppercase',
                  color: 'var(--t2-text)', display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  View Hotel <span style={{ fontSize: 14 }}>→</span>
                </span>
              </div>
            </Link>
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

    </>
  )
}

const selectStyle: React.CSSProperties = {
  fontFamily: 'var(--t2-font-sans)', fontSize: 12, letterSpacing: '0.08em',
  padding: '10px 20px', border: '1px solid var(--t2-border)', background: 'transparent',
  color: 'var(--t2-text)', cursor: 'pointer', minWidth: 180,
}

// Hotel cards now link to /hotels/{slug} for the full detail page;
// the previous in-place enquire modal lives on the detail page's
// sticky sidebar (linking to /contact?hotel=<name>).

