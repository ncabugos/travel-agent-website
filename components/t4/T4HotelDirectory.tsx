'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import type { LuxuryHotel } from '@/lib/hotels'
import { HotelCardImage } from '@/components/t2/HotelCardImage'

const PAGE_SIZE = 12

interface T4HotelDirectoryProps {
  agentId:   string
  countries: string[]
  vibes:     string[]
  brands:    string[]
}

/**
 * Searchable individual-hotel directory for the Casa Solis (T4) template.
 * Same logic + /api/hotels endpoint as the T3 version; restyled with T4
 * CSS variables (--t4-*) so it inherits the Casa Solis editorial palette.
 *
 * Each card links to /t4/{agentId}/hotels/{slug}.
 */
export function T4HotelDirectory({ agentId, countries, vibes, brands }: T4HotelDirectoryProps) {
  const [hotels,      setHotels]      = useState<LuxuryHotel[]>([])
  const [total,       setTotal]       = useState(0)
  const [loading,     setLoading]     = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  const [search,  setSearch]  = useState('')
  const [country, setCountry] = useState('')
  const [vibe,    setVibe]    = useState('')
  const [brand,   setBrand]   = useState('')
  const [page,    setPage]    = useState(1)

  const base = `/t4/${agentId}`

  const fetchHotels = useCallback(async (p: number, append: boolean) => {
    if (append) setLoadingMore(true)
    else setLoading(true)

    const params = new URLSearchParams()
    if (search)  params.set('search',  search)
    if (country) params.set('country', country)
    if (vibe)    params.set('vibe',    vibe)
    if (brand)   params.set('brand',   brand)
    params.set('page',     String(p))
    params.set('pageSize', String(PAGE_SIZE))

    const res = await fetch(`/api/hotels?${params}`)
    if (res.ok) {
      const data = await res.json()
      setHotels(prev => append ? [...prev, ...data.hotels] : data.hotels)
      setTotal(data.total)
    }
    if (append) setLoadingMore(false)
    else setLoading(false)
  }, [search, country, vibe, brand])

  useEffect(() => {
    setPage(1)
    setHotels([])
    const t = setTimeout(() => fetchHotels(1, false), search ? 350 : 0)
    return () => clearTimeout(t)
  }, [search, country, vibe, brand, fetchHotels])

  function loadMore() {
    const next = page + 1
    setPage(next)
    fetchHotels(next, true)
  }

  function resetFilters() {
    setSearch(''); setCountry(''); setVibe(''); setBrand('')
  }

  const hasMore = hotels.length < total
  const hasFilters = !!(search || country || vibe || brand)

  return (
    <>
      <div className="t4-hd-search-wrap">
        <span aria-hidden className="t4-hd-search-icon">⌕</span>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by hotel name, city, or country…"
          aria-label="Search hotels"
          className="t4-hd-search-input"
        />
        {search && (
          <button type="button" onClick={() => setSearch('')} className="t4-hd-search-clear" aria-label="Clear search">×</button>
        )}
      </div>

      <div className="t4-hd-filters">
        <select value={country} onChange={e => setCountry(e.target.value)} className="t4-hd-select" aria-label="Filter by country">
          <option value="">All Destinations</option>
          {countries.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={vibe} onChange={e => setVibe(e.target.value)} className="t4-hd-select" aria-label="Filter by vibe">
          <option value="">Any Vibe</option>
          {vibes.map(v => <option key={v} value={v}>{v}</option>)}
        </select>
        <select value={brand} onChange={e => setBrand(e.target.value)} className="t4-hd-select" aria-label="Filter by brand">
          <option value="">All Brands</option>
          {brands.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        {hasFilters && (
          <button type="button" onClick={resetFilters} className="t4-hd-clear">Clear all</button>
        )}
      </div>

      <p className="t4-hd-count">
        {loading
          ? 'Searching…'
          : `${hotels.length.toLocaleString()} of ${total.toLocaleString()} ${total === 1 ? 'hotel' : 'hotels'}`}
      </p>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
          <span style={{
            fontFamily: 'var(--t4-font-body)', fontSize: 11,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            color: 'var(--t4-text-muted)',
          }}>Loading…</span>
        </div>
      ) : hotels.length === 0 ? (
        <div className="t4-hd-empty">
          <span className="t4-eyebrow">No matches</span>
          <h3 className="t4-headline-md" style={{ marginTop: 16, marginBottom: 16 }}>
            We don&apos;t have that property indexed yet.
          </h3>
          <p className="t4-body" style={{ marginBottom: 24, maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>
            Our advisor relationships often reach beyond the listed directory.
            Tell us what you have in mind.
          </p>
          <Link href={`${base}/contact`} className="t4-btn t4-btn-solid">Contact us</Link>
        </div>
      ) : (
        <div className="t4-hd-grid">
          {hotels.map(hotel => (
            <Link key={hotel.id} href={`${base}/hotels/${hotel.slug}`} className="t4-hd-card">
              <div className="t4-hd-card-img-wrap">
                <HotelCardImage
                  src={hotel.cover_image_url}
                  alt={hotel.name}
                  fallbackLabel={hotel.name}
                />
                {hotel.vibe && (
                  <span className="t4-hd-vibe-badge">{hotel.vibe}</span>
                )}
              </div>
              <div className="t4-hd-card-body">
                {hotel.hotel_company && (
                  <span className="t4-hd-card-brand">{hotel.hotel_company}</span>
                )}
                <h3 className="t4-hd-card-name">{hotel.name}</h3>
                <p className="t4-hd-card-location">
                  {[hotel.city, hotel.country].filter(Boolean).join(' · ')}
                </p>
                {hotel.description && (
                  <p className="t4-hd-card-desc">
                    {hotel.description.length > 110
                      ? hotel.description.slice(0, 107).trimEnd() + '…'
                      : hotel.description}
                  </p>
                )}
                <span className="t4-hd-card-link">
                  View hotel <span aria-hidden>→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {hasMore && !loading && (
        <div className="t4-hd-loadmore">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="t4-btn t4-btn-outline"
          >
            {loadingMore ? 'Loading…' : `Load more (${(total - hotels.length).toLocaleString()} remaining)`}
          </button>
        </div>
      )}

      <style>{`
        .t4-hd-search-wrap {
          position: relative;
          max-width: 720px;
          margin: 0 auto 28px;
        }
        .t4-hd-search-icon {
          position: absolute; left: 24px; top: 50%;
          transform: translateY(-50%);
          font-size: 22px; color: var(--t4-text-muted);
          pointer-events: none;
        }
        .t4-hd-search-input {
          width: 100%;
          font-family: var(--t4-font-body);
          font-size: clamp(15px, 1.4vw, 17px);
          padding: 22px 56px 22px 60px;
          border: 0;
          border-bottom: 1px solid var(--t4-divider);
          background: transparent;
          color: var(--t4-text);
          outline: none;
          transition: border-color 0.2s var(--t4-ease);
        }
        .t4-hd-search-input:focus { border-bottom-color: var(--t4-accent); }
        .t4-hd-search-input::placeholder {
          color: var(--t4-text-muted);
          letter-spacing: 0.02em;
        }
        .t4-hd-search-clear {
          position: absolute; right: 18px; top: 50%;
          transform: translateY(-50%);
          background: transparent; border: 0;
          font-size: 24px; line-height: 1;
          color: var(--t4-text-muted);
          cursor: pointer; padding: 8px 12px;
        }
        .t4-hd-filters {
          display: flex; flex-wrap: wrap; gap: 12px;
          justify-content: center; margin-bottom: 24px;
        }
        .t4-hd-select {
          font-family: var(--t4-font-body);
          font-size: 12px; letter-spacing: 0.06em;
          padding: 10px 18px;
          border: 1px solid var(--t4-divider);
          background: transparent; color: var(--t4-text);
          cursor: pointer; min-width: 180px;
          appearance: none;
          background-image:
            linear-gradient(45deg, transparent 50%, var(--t4-text-muted) 50%),
            linear-gradient(135deg, var(--t4-text-muted) 50%, transparent 50%);
          background-position: calc(100% - 18px) center, calc(100% - 12px) center;
          background-size: 6px 6px, 6px 6px;
          background-repeat: no-repeat;
          padding-right: 36px;
          transition: border-color 0.2s var(--t4-ease);
        }
        .t4-hd-select:hover, .t4-hd-select:focus {
          border-color: var(--t4-accent); outline: none;
        }
        .t4-hd-clear {
          font-family: var(--t4-font-body);
          font-size: 11px; letter-spacing: 0.18em;
          text-transform: uppercase;
          padding: 10px 18px;
          background: transparent;
          border: 1px solid var(--t4-divider);
          color: var(--t4-text-muted);
          cursor: pointer;
          transition: color 0.2s var(--t4-ease);
        }
        .t4-hd-clear:hover { color: var(--t4-accent); }
        .t4-hd-count {
          text-align: center;
          font-family: var(--t4-font-body);
          font-size: 11px; letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--t4-text-muted);
          margin: 0 0 40px;
        }
        .t4-hd-empty {
          text-align: center; padding: 80px 24px;
          border-top: 1px solid var(--t4-divider);
        }
        .t4-hd-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 40px 28px;
        }
        .t4-hd-card {
          display: flex; flex-direction: column;
          background: var(--t4-bg); color: inherit;
          text-decoration: none;
          transition: transform 0.4s var(--t4-ease);
        }
        .t4-hd-card:hover { transform: translateY(-4px); }
        .t4-hd-card-img-wrap {
          position: relative; aspect-ratio: 4 / 3;
          overflow: hidden; background: var(--t4-bg-alt);
          margin-bottom: 18px;
        }
        .t4-hd-card-img-wrap img {
          transition: transform 0.9s var(--t4-ease-out);
        }
        .t4-hd-card:hover .t4-hd-card-img-wrap img { transform: scale(1.04); }
        .t4-hd-vibe-badge {
          position: absolute; top: 14px; left: 14px;
          font-family: var(--t4-font-body);
          font-size: 10px; font-weight: 600;
          letter-spacing: 0.2em; text-transform: uppercase;
          background: #fff;
          color: var(--t4-text);
          padding: 7px 14px;
          box-shadow: 0 2px 12px rgba(20,17,15,0.18);
          transition: transform 0.3s ease;
        }
        .t4-hd-card:hover .t4-hd-vibe-badge { transform: translateY(-2px); }
        .t4-hd-card-body { display: flex; flex-direction: column; }
        .t4-hd-card-brand {
          font-family: var(--t4-font-body);
          font-size: 10px; font-weight: 500;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--t4-accent);
          margin-bottom: 10px;
        }
        .t4-hd-card-name {
          font-family: var(--t4-font-display);
          font-size: clamp(17px, 1.5vw, 20px);
          font-weight: 400; line-height: 1.2;
          letter-spacing: -0.01em;
          color: var(--t4-text);
          margin: 0 0 6px;
        }
        .t4-hd-card-location {
          font-family: var(--t4-font-display);
          font-style: italic;
          font-size: clamp(13px, 1.05vw, 14.5px);
          color: var(--t4-text-muted);
          margin: 0 0 14px;
        }
        .t4-hd-card-desc {
          font-family: var(--t4-font-body);
          font-size: clamp(13px, 1vw, 14px);
          line-height: 1.6;
          color: var(--t4-text-muted);
          margin: 0 0 16px;
        }
        .t4-hd-card-link {
          font-family: var(--t4-font-body);
          font-size: 10.5px; font-weight: 500;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--t4-text);
          padding-top: 14px;
          border-top: 1px solid var(--t4-divider);
          margin-top: auto;
          transition: color 0.25s var(--t4-ease);
        }
        .t4-hd-card-link span {
          margin-left: 6px;
          display: inline-block;
          transition: transform 0.3s var(--t4-ease);
        }
        .t4-hd-card:hover .t4-hd-card-link { color: var(--t4-accent); }
        .t4-hd-card:hover .t4-hd-card-link span { transform: translateX(4px); }
        .t4-hd-loadmore {
          display: flex; justify-content: center; margin-top: 56px;
        }

        @media (max-width: 1024px) {
          .t4-hd-grid { grid-template-columns: repeat(2, 1fr); gap: 32px 24px; }
        }
        @media (max-width: 768px) {
          .t4-hd-grid { grid-template-columns: 1fr; gap: 28px; }
          .t4-hd-select { min-width: 0; flex: 1 1 calc(50% - 6px); }
          .t4-hd-search-input { font-size: 16px; padding-left: 52px; }
          .t4-hd-search-icon { left: 18px; font-size: 20px; }
        }
      `}</style>
    </>
  )
}
