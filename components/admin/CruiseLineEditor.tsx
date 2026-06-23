'use client'

/**
 * CruiseLineEditor — one editable card per cruise line. Upload/replace the
 * logo variants (color, white, black) + hero image and edit the client-facing
 * tagline + description. Saves to PUT /api/admin/cruise-lines/[id], which
 * writes the cruise_lines row — the single source of truth across all sites.
 */
import { useState } from 'react'
import { ImageUpload } from '@/components/admin/ImageUpload'
import type { CruiseLine } from '@/lib/cruise-lines'

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 12, fontWeight: 600, letterSpacing: '0.04em',
  textTransform: 'uppercase', color: '#6b7280', marginBottom: 6,
}
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e5e7eb',
  fontSize: 14, fontFamily: 'inherit', color: '#111', background: '#fff',
}

export function CruiseLineEditor({ line }: { line: CruiseLine }) {
  const [color, setColor] = useState(line.logo_url ?? '')
  const [white, setWhite] = useState(line.logo_url_white ?? '')
  const [black, setBlack] = useState(line.logo_url_black ?? '')
  const [hero, setHero] = useState(line.hero_image_url ?? '')
  const [tagline, setTagline] = useState(line.tagline ?? '')
  const [description, setDescription] = useState(line.description ?? '')
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<'idle' | 'saved' | 'error'>('idle')
  const [error, setError] = useState('')

  async function save() {
    setSaving(true)
    setStatus('idle')
    setError('')
    try {
      const res = await fetch(`/api/admin/cruise-lines/${line.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          logo_url: color,
          logo_url_white: white,
          logo_url_black: black,
          hero_image_url: hero,
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
        <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#111' }}>{line.name}</h3>
        <code style={{ fontSize: 12, color: '#9ca3af' }}>{line.slug}</code>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 18 }}>
        <ImageUpload label="Logo — black (light bg)" value={black} onChange={setBlack} previewHeight={84} />
        <ImageUpload label="Logo — white (dark bg)" value={white} onChange={setWhite} previewHeight={84} />
        <ImageUpload label="Logo — color (legacy)" value={color} onChange={setColor} previewHeight={84} />
        <ImageUpload label="Hero image" value={hero} onChange={setHero} previewHeight={84} />
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Tagline</label>
        <input style={inputStyle} value={tagline} onChange={(e) => setTagline(e.target.value)} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Description</label>
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
