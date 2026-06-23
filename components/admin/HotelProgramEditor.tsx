'use client'

/**
 * HotelProgramEditor — one editable card per hotel program. Upload/replace the
 * three logo variants (color, white, black) and edit the client-facing tagline
 * + description. Saves to PUT /api/admin/hotel-programs/[id], which writes the
 * hotel_programs row — the single source of truth across every tenant site.
 */
import { useState } from 'react'
import { ImageUpload } from '@/components/admin/ImageUpload'
import type { HotelProgram } from '@/lib/hotel-programs'

const DESC_MAX = 220 // t4 grid truncates beyond this

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 12, fontWeight: 600, letterSpacing: '0.04em',
  textTransform: 'uppercase', color: '#6b7280', marginBottom: 6,
}
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e5e7eb',
  fontSize: 14, fontFamily: 'inherit', color: '#111', background: '#fff',
}

export function HotelProgramEditor({ program }: { program: HotelProgram }) {
  const [color, setColor] = useState(program.logo_url ?? '')
  const [white, setWhite] = useState(program.logo_url_white ?? '')
  const [black, setBlack] = useState(program.logo_url_black ?? '')
  const [tagline, setTagline] = useState(program.tagline ?? '')
  const [description, setDescription] = useState(program.description ?? '')
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<'idle' | 'saved' | 'error'>('idle')
  const [error, setError] = useState('')

  async function save() {
    setSaving(true)
    setStatus('idle')
    setError('')
    try {
      const res = await fetch(`/api/admin/hotel-programs/${program.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          logo_url: color,
          logo_url_white: white,
          logo_url_black: black,
          tagline,
          description,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error ?? 'Save failed')
      setStatus('saved')
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 14, padding: 24, background: '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 18, gap: 12 }}>
        <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#111' }}>{program.name}</h3>
        <code style={{ fontSize: 12, color: '#9ca3af' }}>{program.slug}</code>
      </div>

      {/* Logos — color / white / black */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 18 }}>
        <ImageUpload label="Logo — black (light bg)" value={black} onChange={setBlack} previewHeight={90} />
        <ImageUpload label="Logo — white (dark bg)" value={white} onChange={setWhite} previewHeight={90} />
        <ImageUpload label="Logo — color (legacy fallback)" value={color} onChange={setColor} previewHeight={90} />
      </div>

      {/* Copy */}
      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Tagline</label>
        <input style={inputStyle} value={tagline} onChange={(e) => setTagline(e.target.value)} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>
          Description{' '}
          <span style={{ color: description.length > DESC_MAX ? '#dc2626' : '#9ca3af', fontWeight: 400 }}>
            ({description.length}/{DESC_MAX})
          </span>
        </label>
        <textarea
          style={{ ...inputStyle, minHeight: 72, resize: 'vertical' }}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={save}
          disabled={saving}
          style={{
            padding: '10px 22px', borderRadius: 8, border: 'none', cursor: saving ? 'default' : 'pointer',
            background: 'linear-gradient(135deg, #7c3aed, #a78bfa)', color: '#fff', fontWeight: 600, fontSize: 14,
            opacity: saving ? 0.6 : 1,
          }}
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
        {status === 'saved' && <span style={{ color: '#16a34a', fontSize: 13, fontWeight: 600 }}>Saved ✓</span>}
        {status === 'error' && <span style={{ color: '#dc2626', fontSize: 13 }}>{error}</span>}
      </div>
    </div>
  )
}
