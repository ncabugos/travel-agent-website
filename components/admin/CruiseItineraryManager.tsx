'use client'

/**
 * CruiseItineraryManager — edits the shared itinerary catalog and its
 * collections. Itineraries are deactivated, never deleted, so a season's
 * collection can come back next year and site opt-outs survive.
 */
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ImageUpload } from '@/components/admin/ImageUpload'
import type { AdminDeparture, CruiseCollection, CruiseDay, CruiseItinerary } from '@/lib/cruise-itineraries'
import type { CruiseIncludedGroup } from '@/lib/cruise-lines'

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

const lines = (text: string) => text.split('\n').map((s) => s.trim()).filter(Boolean)

/** The full page's content: facts, highlights and days. Saving days publishes the page. */
function ItineraryPageForm({ itinerary }: { itinerary: CruiseItinerary }) {
  const [overview, setOverview] = useState(itinerary.overview ?? '')
  const [highlights, setHighlights] = useState(itinerary.highlights.join('\n'))
  const [region, setRegion] = useState(itinerary.region ?? '')
  const [countries, setCountries] = useState(itinerary.countries ?? '')
  const [direction, setDirection] = useState(itinerary.days_direction ?? '')
  const [days, setDays] = useState(itinerary.days)
  const { save, saving, status, error } = useSave(`/api/admin/cruise-itineraries/${itinerary.id}`, 'PUT')

  const setDay = (index: number, patch: Partial<CruiseDay>) =>
    setDays((all) => all.map((day, i) => (i === index ? { ...day, ...patch } : day)))
  const moveDay = (index: number, by: number) =>
    setDays((all) => {
      const next = [...all]
      const target = index + by
      if (target < 0 || target >= next.length) return all
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })

  return (
    <div style={{ display: 'grid', gap: 14 }}>
      <div>
        <label style={labelStyle}>Overview (2 sentences)</label>
        <textarea style={{ ...inputStyle, minHeight: 60, resize: 'vertical' }} value={overview} onChange={(e) => setOverview(e.target.value)} />
      </div>
      <div>
        <label style={labelStyle}>Highlights (one per line, up to 3)</label>
        <textarea style={{ ...inputStyle, minHeight: 60, resize: 'vertical' }} value={highlights} onChange={(e) => setHighlights(e.target.value)} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: 14 }}>
        <div>
          <label style={labelStyle}>Region</label>
          <input style={inputStyle} value={region} onChange={(e) => setRegion(e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>Countries</label>
          <input style={inputStyle} value={countries} onChange={(e) => setCountries(e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>Days written from</label>
          <input style={inputStyle} value={direction} onChange={(e) => setDirection(e.target.value)} placeholder="Budapest to Passau" />
        </div>
      </div>
      <div style={{ display: 'grid', gap: 10 }}>
        <label style={{ ...labelStyle, marginBottom: 0 }}>Day by day</label>
        {days.map((day, index) => (
          <div key={index} style={{ display: 'grid', gap: 8, padding: 12, border: '1px solid #f3f4f6', borderRadius: 8 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 1fr auto', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#111' }}>Day {index + 1}</span>
              <input style={inputStyle} value={day.place} onChange={(e) => setDay(index, { place: e.target.value })} placeholder="Place" />
              <input style={inputStyle} value={day.title ?? ''} onChange={(e) => setDay(index, { title: e.target.value })} placeholder="Title" />
              <div style={{ display: 'flex', gap: 4 }}>
                <button type="button" onClick={() => moveDay(index, -1)} aria-label={`Move day ${index + 1} up`}>↑</button>
                <button type="button" onClick={() => moveDay(index, 1)} aria-label={`Move day ${index + 1} down`}>↓</button>
                <button type="button" onClick={() => setDays((all) => all.filter((_, i) => i !== index))} aria-label={`Remove day ${index + 1}`}>×</button>
              </div>
            </div>
            <textarea style={{ ...inputStyle, minHeight: 50, resize: 'vertical' }} value={day.summary ?? ''} onChange={(e) => setDay(index, { summary: e.target.value })} placeholder="1 to 2 sentences" />
            <input
              style={inputStyle}
              value={(day.excursions ?? []).join(', ')}
              onChange={(e) => setDay(index, { excursions: e.target.value.split(',').map((s) => s.trimStart()) })}
              placeholder="Tours, separated by commas"
            />
          </div>
        ))}
        <div>
          <button type="button" onClick={() => setDays((all) => [...all, { place: '', title: '', summary: '', excursions: [] }])} style={{ fontSize: 13 }}>
            Add a day
          </button>
        </div>
      </div>
      <SaveRow
        label="Save page content"
        saving={saving}
        status={status}
        error={error}
        onClick={() => save({ overview, highlights: lines(highlights), region, countries, days_direction: direction, days })}
      />
    </div>
  )
}

const departureLine = (d: AdminDeparture) => [d.departs_on, d.embark, d.disembark, d.ship ?? ''].join(' | ').replace(/ \| $/, '')

/** Sailing dates, one row per line, so a season can be pasted in. */
function DeparturesForm({ itinerary, departures }: { itinerary: CruiseItinerary; departures: AdminDeparture[] }) {
  const [text, setText] = useState(departures.map(departureLine).join('\n'))
  const [note, setNote] = useState(itinerary.departures_note ?? '')
  const dates = useSave(`/api/admin/cruise-itineraries/${itinerary.id}/departures`, 'PUT')
  const noteSave = useSave(`/api/admin/cruise-itineraries/${itinerary.id}`, 'PUT')

  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <label style={{ ...labelStyle, marginBottom: 0 }}>Dates (one per line: YYYY-MM-DD | from | to | ship)</label>
      <textarea style={{ ...inputStyle, minHeight: 120, resize: 'vertical', fontFamily: 'monospace', fontSize: 13 }} value={text} onChange={(e) => setText(e.target.value)} />
      <SaveRow
        label="Save dates"
        saving={dates.saving}
        status={dates.status}
        error={dates.error}
        onClick={() => dates.save({
          departures: lines(text).map((line) => {
            const [departs_on, embark, disembark, ship] = line.split('|').map((part) => part.trim())
            return { departs_on, embark, disembark, ship }
          }),
        })}
      />
      <label style={{ ...labelStyle, marginBottom: 0 }}>Dates note</label>
      <input style={inputStyle} value={note} onChange={(e) => setNote(e.target.value)} placeholder="For example: More sailings may be available." />
      <SaveRow label="Save note" saving={noteSave.saving} status={noteSave.status} error={noteSave.error} onClick={() => noteSave.save({ departures_note: note })} />
    </div>
  )
}

const GROUPS = ['Stay', 'Dining', 'Excursions', 'Also included']

/** What the line's fare includes, shown on all its itinerary pages. */
function IncludedForm({ line }: { line: { id: string; included: CruiseIncludedGroup[] } }) {
  const [groups, setGroups] = useState(() =>
    GROUPS.map((title) => ({ title, text: (line.included ?? []).find((g) => g.title === title)?.items.join('\n') ?? '' })),
  )
  const { save, saving, status, error } = useSave(`/api/admin/cruise-lines/${line.id}/included`, 'PUT')

  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <h3 style={headingStyle}>What&apos;s included</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
        {groups.map((group, index) => (
          <div key={group.title}>
            <label style={labelStyle}>{group.title} (one per line)</label>
            <textarea
              style={{ ...inputStyle, minHeight: 110, resize: 'vertical' }}
              value={group.text}
              onChange={(e) => setGroups((all) => all.map((g, i) => (i === index ? { ...g, text: e.target.value } : g)))}
            />
          </div>
        ))}
      </div>
      <SaveRow
        label="Save what's included"
        saving={saving}
        status={status}
        error={error}
        onClick={() => save({ included: groups.map((g) => ({ title: g.title, items: lines(g.text) })) })}
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

export function CruiseItineraryManager({ lines: cruiseLines, collections, itineraries, departures }: {
  lines: { id: string; name: string; slug: string; included: CruiseIncludedGroup[] }[]
  collections: CruiseCollection[]
  itineraries: CruiseItinerary[]
  departures: AdminDeparture[]
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
          {cruiseLines.map((line) => {
            const rows = itineraries.filter((i) => i.cruise_line_id === line.id)
            return (
              <details key={line.id} style={cardStyle}>
                <summary style={{ cursor: 'pointer', fontSize: 15, fontWeight: 600, color: '#111' }}>
                  {line.name} <span style={{ color: '#6b7280', fontWeight: 400 }}>({rows.length})</span>
                </summary>
                <div style={{ display: 'grid', gap: 24, marginTop: 20 }}>
                  <IncludedForm line={line} />
                  {rows.map((row) => (
                    <div key={row.id} style={{ paddingBottom: 24, borderBottom: '1px solid #f3f4f6' }}>
                      <ItineraryForm lineId={line.id} itinerary={row} collections={collections} />
                      <details style={{ marginTop: 16 }}>
                        <summary style={{ cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#111' }}>
                          Full page {row.days.length > 0 ? `(${row.days.length} days)` : '(not published)'}
                        </summary>
                        <div style={{ display: 'grid', gap: 20, marginTop: 14 }}>
                          <ItineraryPageForm itinerary={row} />
                          <DeparturesForm itinerary={row} departures={departures.filter((d) => d.itinerary_id === row.id)} />
                        </div>
                      </details>
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
