'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import type { LuxuryHotel } from '@/lib/hotels'
import { HotelCardImage } from '@/components/t2/HotelCardImage'

const PAGE_SIZE = 12

interface HotelDirectoryEdenProps {
  /** Base URL prefix for hotel detail links (e.g. "/eden" on vanity domain
   * or "/frontend/<agentId>" on platform host). The middleware rewrites
   * the platform path, so pages call tenantBase(agent) for the right value. */
  base:      string
  countries: string[]
  vibes:     string[]
  brands:    string[]
}

/**
 * Searchable individual-hotel directory for the Eden (frontend) template.
 * Uses Eden's cream / charcoal / gold palette. Same backing /api/hotels
 * endpoint as the T2/T3/T4 directories.
 *
 * Each card links to {base}/hotels/{slug}.
 */
export function HotelDirectoryEden({ base, countries, vibes, brands }: HotelDirectoryEdenProps) {
  const [hotels,      setHotels]      = useState<LuxuryHotel[]>([])
  const [total,       setTotal]       = useState(0)
  const [loading,     setLoading]     = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  const [search,  setSearch]  = useState('')
  const [country, setCountry] = useState('')
  const [vibe,    setVibe]    = useState('')
  const [brand,   setBrand]   = useState('')
  const [page,    setPage]    = useState(1)

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
      <div className="eden-hd-search-wrap">
        <span aria-hidden className="eden-hd-search-icon">⌕</span>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search hotels by name, city, or country…"
          aria-label="Search hotels"
          className="eden-hd-search-input"
        />
        {search && (
          <button type="button" onClick={() => setSearch('')} className="eden-hd-search-clear" aria-label="Clear search">×</button>
        )}
      </div>

      <div className="eden-hd-filters">
        <select value={country} onChange={e => setCountry(e.target.value)} className="eden-hd-select" aria-label="Filter by country">
          <option value="">All Destinations</option>
          {countries.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={vibe} onChange={e => setVibe(e.target.value)} className="eden-hd-select" aria-label="Filter by vibe">
          <option value="">Any Vibe</option>
          {vibes.map(v => <option key={v} value={v}>{v}</option>)}
        </select>
        <select value={brand} onChange={e => setBrand(e.target.value)} className="eden-hd-select" aria-label="Filter by brand">
          <option value="">All Brands</option>
          {brands.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        {hasFilters && (
          <button type="button" onClick={resetFilters} className="eden-hd-clear">Clear all</button>
        )}
      </div>

      <p className="eden-hd-count">
        {loading
          ? 'Searching…'
          : `${hotels.length.toLocaleString()} of ${total.toLocaleString()} ${total === 1 ? 'Hotel' : 'Hotels'}`}
      </p>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
          <span style={{
            fontFamily: 'var(--font-sans)', fontSize: 10,
            letterSpacing: '0.28em', textTransform: 'uppercase',
            color: 'var(--warm-gray)',
          }}>Loading…</span>
        </div>
      ) : hotels.length === 0 ? (
        <div className="eden-hd-empty">
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 14 }}>
            No matches
          </p>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.4rem, 2vw, 1.8rem)', fontWeight: 300, color: 'var(--charcoal)', marginBottom: 16 }}>
            We don&apos;t have that property indexed yet.
          </h3>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, lineHeight: 1.85, color: 'var(--warm-gray)', maxWidth: 480, marginLeft: 'auto', marginRight: 'auto', marginBottom: 24 }}>
            Our advisor relationships often reach beyond the listed directory. Tell us what you have in mind.
          </p>
          <Link
            href={`${base}/contact`}
            style={{
              display: 'inline-block', padding: '14px 32px',
              fontFamily: 'var(--font-sans)', fontSize: 10,
              letterSpacing: '0.28em', textTransform: 'uppercase',
              background: 'var(--gold)', color: 'var(--charcoal)',
              textDecoration: 'none',
            }}
          >
            Contact us
          </Link>
        </div>
      ) : (
        <div className="eden-hd-grid">
          {hotels.map(hotel => (
            <Link key={hotel.id} href={`${base}/hotels/${hotel.slug}`} className="eden-hd-card">
              <div className="eden-hd-card-img-wrap">
                <HotelCardImage
                  src={hotel.cover_image_url}
                  alt={hotel.name}
                  fallbackLabel={hotel.name}
                />
                {hotel.vibe && (
                  <span className="eden-hd-vibe-badge">{hotel.vibe}</span>
                )}
              </div>
              <div className="eden-hd-card-body">
                {hotel.hotel_company && (
                  <span className="eden-hd-card-brand">{hotel.hotel_company}</span>
                )}
                <h3 className="eden-hd-card-name">{hotel.name}</h3>
                <p className="eden-hd-card-location">
                  {[hotel.city, hotel.country].filter(Boolean).join(' · ')}
                </p>
                {hotel.description && (
                  <p className="eden-hd-card-desc">
                    {hotel.description.length > 110
                      ? hotel.description.slice(0, 107).trimEnd() + '…'
                      : hotel.description}
                  </p>
                )}
                <span className="eden-hd-card-link">
                  View hotel <span aria-hidden>→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {hasMore && !loading && (
        <div className="eden-hd-loadmore">
          <button onClick={loadMore} disabled={loadingMore} className="eden-hd-loadmore-btn">
            {loadingMore ? 'Loading…' : `Load more (${(total - hotels.length).toLocaleString()} remaining)`}
          </button>
        </div>
      )}

      <style>{`
        .eden-hd-search-wrap {
          position: relative;
          max-width: 720px;
          margin: 0 auto 28px;
        }
        .eden-hd-search-icon {
          position: absolute; left: 24px; top: 50%;
          transform: translateY(-50%);
          font-size: 22px; color: var(--warm-gray);
          pointer-events: none;
        }
        .eden-hd-search-input {
          width: 100%;
          font-family: var(--font-sans);
          font-size: clamp(15px, 1.4vw, 17px);
          padding: 22px 56px 22px 60px;
          border: 0;
          border-bottom: 1px solid var(--divider);
          background: transparent;
          color: var(--charcoal);
          outline: none;
          transition: border-color 0.2s ease;
        }
        .eden-hd-search-input:focus { border-bottom-color: var(--gold); }
        .eden-hd-search-input::placeholder {
          color: var(--warm-gray);
          letter-spacing: 0.02em;
        }
        .eden-hd-search-clear {
          position: absolute; right: 18px; top: 50%;
          transform: translateY(-50%);
          background: transparent; border: 0;
          font-size: 24px; line-height: 1;
          color: var(--warm-gray);
          cursor: pointer; padding: 8px 12px;
        }
        .eden-hd-filters {
          display: flex; flex-wrap: wrap; gap: 12px;
          justify-content: center; margin-bottom: 24px;
        }
        .eden-hd-select {
          font-family: var(--font-sans);
          font-size: 12px; letter-spacing: 0.06em;
          padding: 10px 18px;
          border: 1px solid var(--divider);
          background: transparent; color: var(--charcoal);
          cursor: pointer; min-width: 180px;
          appearance: none;
          background-image:
            linear-gradient(45deg, transparent 50%, var(--warm-gray) 50%),
            linear-gradient(135deg, var(--warm-gray) 50%, transparent 50%);
          background-position: calc(100% - 18px) center, calc(100% - 12px) center;
          background-size: 6px 6px, 6px 6px;
          background-repeat: no-repeat;
          padding-right: 36px;
          transition: border-color 0.2s ease;
        }
        .eden-hd-select:hover, .eden-hd-select:focus {
          border-color: var(--gold); outline: none;
        }
        .eden-hd-clear {
          font-family: var(--font-sans);
          font-size: 10px; letter-spacing: 0.22em;
          text-transform: uppercase;
          padding: 10px 18px;
          background: transparent;
          border: 1px solid var(--divider);
          color: var(--warm-gray);
          cursor: pointer;
          transition: color 0.2s ease;
        }
        .eden-hd-clear:hover { color: var(--gold); }
        .eden-hd-count {
          text-align: center;
          font-family: var(--font-sans);
          font-size: 10px; letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--warm-gray);
          margin: 0 0 40px;
        }
        .eden-hd-empty {
          text-align: center; padding: 80px 24px;
          border-top: 1px solid var(--divider);
        }
        .eden-hd-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 40px 28px;
        }
        .eden-hd-card {
          display: flex; flex-direction: column;
          background: var(--cream); color: inherit;
          text-decoration: none;
          transition: transform 0.4s ease;
        }
        .eden-hd-card:hover { transform: translateY(-4px); }
        .eden-hd-card-img-wrap {
          position: relative; aspect-ratio: 4 / 3;
          overflow: hidden; background: rgba(20,18,16,0.08);
          margin-bottom: 18px;
        }
        .eden-hd-card-img-wrap img {
          transition: transform 0.9s ease;
        }
        .eden-hd-card:hover .eden-hd-card-img-wrap img { transform: scale(1.04); }
        .eden-hd-vibe-badge {
          position: absolute; top: 14px; left: 14px;
          font-family: var(--font-sans);
          font-size: 9.5px; font-weight: 500;
          letter-spacing: 0.22em; text-transform: uppercase;
          background: rgba(20, 17, 15, 0.66);
          color: #fff; padding: 5px 11px;
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
        }
        .eden-hd-card-body { display: flex; flex-direction: column; }
        .eden-hd-card-brand {
          font-family: var(--font-sans);
          font-size: 10px; font-weight: 500;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 10px;
        }
        .eden-hd-card-name {
          font-family: var(--font-serif);
          font-size: clamp(17px, 1.5vw, 20px);
          font-weight: 400; line-height: 1.2;
          color: var(--charcoal);
          margin: 0 0 6px;
        }
        .eden-hd-card-location {
          font-family: var(--font-serif);
          font-style: italic;
          font-size: clamp(13px, 1.05vw, 14.5px);
          color: var(--warm-gray);
          margin: 0 0 14px;
        }
        .eden-hd-card-desc {
          font-family: var(--font-sans);
          font-size: clamp(13px, 1vw, 14px);
          line-height: 1.7;
          color: var(--warm-gray);
          margin: 0 0 16px;
        }
        .eden-hd-card-link {
          font-family: var(--font-sans);
          font-size: 10px; font-weight: 500;
          letter-spacing: 0.28em; text-transform: uppercase;
          color: var(--charcoal);
          padding-top: 14px;
          border-top: 1px solid var(--divider);
          margin-top: auto;
          transition: color 0.25s ease;
        }
        .eden-hd-card-link span {
          margin-left: 6px;
          display: inline-block;
          transition: transform 0.3s ease;
        }
        .eden-hd-card:hover .eden-hd-card-link { color: var(--gold); }
        .eden-hd-card:hover .eden-hd-card-link span { transform: translateX(4px); }
        .eden-hd-loadmore {
          display: flex; justify-content: center; margin-top: 56px;
        }
        .eden-hd-loadmore-btn {
          font-family: var(--font-sans);
          font-size: 10px; letter-spacing: 0.28em;
          text-transform: uppercase;
          padding: 16px 42px;
          background: transparent;
          border: 1px solid var(--charcoal);
          color: var(--charcoal);
          cursor: pointer;
          transition: background 0.2s ease, color 0.2s ease;
        }
        .eden-hd-loadmore-btn:hover {
          background: var(--charcoal); color: var(--cream);
        }
        .eden-hd-loadmore-btn:disabled { opacity: 0.5; cursor: default; }

        @media (max-width: 1024px) {
          .eden-hd-grid { grid-template-columns: repeat(2, 1fr); gap: 32px 24px; }
        }
        @media (max-width: 768px) {
          .eden-hd-grid { grid-template-columns: 1fr; gap: 28px; }
          .eden-hd-select { min-width: 0; flex: 1 1 calc(50% - 6px); }
          .eden-hd-search-input { font-size: 16px; padding-left: 52px; }
          .eden-hd-search-icon { left: 18px; font-size: 20px; }
        }
      `}</style>
    </>
  )
}
