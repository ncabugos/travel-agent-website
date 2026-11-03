'use client'

/**
 * CruiseItineraryManager — edits the shared itinerary catalog and its
 * collections. Itineraries are deactivated, never deleted, so a season's
 * collection can come back next year and site opt-outs survive.
 */
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ImageUpload } from '@/components/admin/ImageUpload'
import type { CruiseCollection, CruiseItinerary } from '@/lib/cruise-itineraries'

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 12, fontWeight: 600, letterSpacing: '0.04em',
  textTransform: 'uppercase', color: '#6b7280', marginBottom: 6,
}
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e5e7eb',
  fontSize: 14, fontFamily: 'inherit', color: '#111', background: '#fff',
}
const cardStyle: React.CSSProperties = {
  border: '1px solid #e5e7eb', borderRadius: 14, padding: 24, background: '#fff',
}
const headingStyle: React.CSSProperties = { margin: '0 0 12px', fontSize: 15, fontWeight: 600, color: '#111' }

function useSave(url: string, method: 'POST' | 'PUT', onDone?: () => void) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<'idle' | 'saved' | 'error'>('idle')
  const [error, setError] = useState('')

  async function save(body: Record<string, unknown>) {
    setSaving(true)
    setStatus('idle')
    setError('')
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error ?? 'Save failed')
      setStatus('saved')
      onDone?.()
      router.refresh()
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return { save, saving, status, error }
}

function SaveRow({ label, onClick, saving, status, error }: {
  label: string
  onClick: () => void
  saving: boolean
  status: 'idle' | 'saved' | 'error'
  error: string
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <button
        type="button"
        onClick={onClick}
        disabled={saving}
        style={{
          padding: '10px 22px', borderRadius: 8, border: 'none', cursor: saving ? 'default' : 'pointer',
          background: 'linear-gradient(135deg, #7c3aed, #a78bfa)', color: '#fff', fontWeight: 600, fontSize: 14,
          opacity: saving ? 0.6 : 1,
        }}
      >
        {saving ? 'Saving…' : label}
      </button>
      {status === 'saved' && <span style={{ color: '#16a34a', fontSize: 13, fontWeight: 600 }}>Saved ✓</span>}
      {status === 'error' && <span style={{ color: '#dc2626', fontSize: 13 }}>{error}</span>}
    </div>
  )
}

function ItineraryForm({ lineId, itinerary, collections }: {
  lineId: string
  itinerary?: CruiseItinerary
  collections: CruiseCollection[]
}) {
  const [name, setName] = useState(itinerary?.name ?? '')
  const [nights, setNights] = useState(itinerary?.nights ?? '')
  const [route, setRoute] = useState(itinerary?.route ?? '')
  const [blurb, setBlurb] = useState(itinerary?.blurb ?? '')
  const [image, setImage] = useState(itinerary?.image_url ?? '')
  const [collectionId, setCollectionId] = useState(itinerary?.collection_id ?? '')
  const [sourceUrl, setSourceUrl] = useState(itinerary?.source_url ?? '')
  const [order, setOrder] = useState(String(itinerary?.sort_order ?? 0))
  const [active, setActive] = useState(itinerary?.is_active ?? true)

  const { save, saving, status, error } = useSave(
    itinerary ? `/api/admin/cruise-itineraries/${itinerary.id}` : '/api/admin/cruise-itineraries',
    itinerary ? 'PUT' : 'POST',
    () => {
      if (itinerary) return
      setName('')
      setNights('')
      setRoute('')
      setBlurb('')
      setImage('')
      setCollectionId('')
      setSourceUrl('')
      setOrder('0')
    },
  )

  return (
    <div style={{ display: 'grid', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 90px', gap: 14 }}>
        <div>
          <label style={labelStyle}>Name</label>
          <input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>Nights</label>
          <input style={inputStyle} value={nights} onChange={(e) => setNights(e.target.value)} placeholder="7 nights" />
        </div>
        <div>
          <label style={labelStyle}>Order</label>
          <input style={inputStyle} type="number" value={order} onChange={(e) => setOrder(e.target.value)} />
        </div>
      </div>
      <div>
        <label style={labelStyle}>Route</label>
        <input style={inputStyle} value={route} onChange={(e) => setRoute(e.target.value)} placeholder="Budapest · Vienna · Passau" />
      </div>
      <div>
        <label style={labelStyle}>Description</label>
        <textarea style={{ ...inputStyle, minHeight: 60, resize: 'vertical' }} value={blurb} onChange={(e) => setBlurb(e.target.value)} />
      </div>
      <div style={{ maxWidth: 360 }}>
        <ImageUpload label="Featured image" value={image} onChange={setImage} previewHeight={120} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 14 }}>
        <div>
          <label style={labelStyle}>Collection</label>
          <select style={inputStyle} value={collectionId} onChange={(e) => setCollectionId(e.target.value)}>
            <option value="">None</option>
            {collections.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Source link (internal)</label>
          <input style={inputStyle} value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} />
        </div>
      </div>
      {itinerary && (
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#111' }}>
          <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
          Active (uncheck to remove from every site)
        </label>
      )}
      <SaveRow
        label={itinerary ? 'Save' : 'Add itinerary'}
        saving={saving}
        status={status}
        error={error}
        onClick={() => save({
          cruise_line_id: lineId,
          name,
          nights,
          route,
          blurb,
          image_url: image,
          collection_id: collectionId,
          source_url: sourceUrl,
          sort_order: Number(order) || 0,
          ...(itinerary ? { is_active: active } : {}),
        })}
      />
    </div>
  )
}

function CollectionForm({ collection }: { collection?: CruiseCollection }) {
  const [name, setName] = useState(collection?.name ?? '')
  const [intro, setIntro] = useState(collection?.intro ?? '')
  const [hero, setHero] = useState(collection?.hero_image_url ?? '')
  const [active, setActive] = useState(collection?.is_active ?? true)

  const { save, saving, status, error } = useSave(
    collection ? `/api/admin/cruise-collections/${collection.id}` : '/api/admin/cruise-collections',
    collection ? 'PUT' : 'POST',
    () => {
      if (collection) return
      setName('')
      setIntro('')
      setHero('')
    },
  )

  return (
    <div style={{ ...cardStyle, display: 'grid', gap: 14 }}>
      <div>
        <label style={labelStyle}>Name</label>
        <input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} placeholder={collection ? undefined : 'New collection name'} />
      </div>
      <div>
        <label style={labelStyle}>Intro</label>
        <textarea style={{ ...inputStyle, minHeight: 60, resize: 'vertical' }} value={intro} onChange={(e) => setIntro(e.target.value)} />
      </div>
      <ImageUpload label="Hero image" value={hero} onChange={setHero} previewHeight={120} />
      {collection && (
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#111' }}>
          <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
          Active (uncheck to remove this page from every site)
        </label>
      )}
      <SaveRow
        label={collection ? 'Save' : 'Add collection'}
        saving={saving}
        status={status}
        error={error}
        onClick={() => save({ name, intro, hero_image_url: hero, ...(collection ? { is_active: active } : {}) })}
      />
    </div>
  )
}

export function CruiseItineraryManager({ lines, collections, itineraries }: {
  lines: { id: string; name: string; slug: string }[]
  collections: CruiseCollection[]
  itineraries: CruiseItinerary[]
}) {
  return (
    <div style={{ display: 'grid', gap: 32 }}>
      <section>
        <h2 style={headingStyle}>Collections</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 20 }}>
          {collections.map((c) => <CollectionForm key={c.id} collection={c} />)}
          <CollectionForm />
        </div>
      </section>

      <section>
        <h2 style={headingStyle}>Itineraries by cruise line</h2>
        <div style={{ display: 'grid', gap: 12 }}>
          {lines.map((line) => {
            const rows = itineraries.filter((i) => i.cruise_line_id === line.id)
            return (
              <details key={line.id} style={cardStyle}>
                <summary style={{ cursor: 'pointer', fontSize: 15, fontWeight: 600, color: '#111' }}>
                  {line.name} <span style={{ color: '#6b7280', fontWeight: 400 }}>({rows.length})</span>
                </summary>
                <div style={{ display: 'grid', gap: 24, marginTop: 20 }}>
                  {rows.map((row) => (
                    <div key={row.id} style={{ paddingBottom: 24, borderBottom: '1px solid #f3f4f6' }}>
                      <ItineraryForm lineId={line.id} itinerary={row} collections={collections} />
                    </div>
                  ))}
                  <div>
                    <h3 style={headingStyle}>Add an itinerary</h3>
                    <ItineraryForm lineId={line.id} collections={collections} />
                  </div>
                </div>
              </details>
            )
          })}
        </div>
      </section>
    </div>
  )
}
