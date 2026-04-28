'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { Card } from '@/components/dashboard/Card'

type AgentRow = {
  id: string
  full_name: string | null
  agency_name: string | null
  email: string | null
  phone: string | null
  tagline: string | null
  bio: string | null
  avatar_url: string | null
  instagram_url: string | null
  facebook_url: string | null
  youtube_url: string | null
  tiktok_url: string | null
  website_url: string | null
  tier: 'starter' | 'growth' | 'custom' | 'agency' | null
  subscription_status: string | null
  template: string | null
  role: 'super_admin' | 'admin' | 'agent' | null
  travel_specialties: string[] | null
  destination_specialties: string[] | null
  preferred_suppliers: string[] | null
  travel_types: string[] | null
}

const STRING_KEYS: readonly (keyof AgentRow)[] = [
  'full_name', 'agency_name', 'email', 'phone', 'tagline', 'bio',
  'avatar_url', 'instagram_url', 'facebook_url', 'youtube_url',
  'tiktok_url', 'website_url', 'subscription_status', 'template',
]
const ARRAY_KEYS: readonly (keyof AgentRow)[] = [
  'travel_specialties', 'destination_specialties',
  'preferred_suppliers', 'travel_types',
]

// Normalize null↔'' and null↔[] before serializing so that "untouched" forms
// don't read as dirty just because empty fields canonicalize differently.
function snapshot(a: AgentRow): string {
  const norm: Record<string, unknown> = { ...a }
  for (const k of STRING_KEYS) norm[k] = (a[k] as string | null) ?? ''
  for (const k of ARRAY_KEYS) norm[k] = (a[k] as string[] | null) ?? []
  return JSON.stringify(norm)
}

/**
 * Admin-scoped agent profile editor. All fields PATCH to
 * /api/admin/agents/[agentId] which uses a service-role client, bypassing
 * RLS. Gated by middleware.ts to super_admin only.
 */
export function AgentProfileEditor({ agent }: { agent: AgentRow }) {
  const [form, setForm] = useState(agent)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null)
  const initialFormRef = useRef(agent)
  const [initial, setInitial] = useState(() => snapshot(agent))
  const isDirty = useMemo(() => snapshot(form) !== initial, [form, initial])

  // Warn before tab close / navigation while there are unsaved changes.
  useEffect(() => {
    if (!isDirty) return
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [isDirty])

  // Auto-dismiss the success toast after a few seconds.
  useEffect(() => {
    if (msg?.kind !== 'ok') return
    const t = setTimeout(() => setMsg(null), 2500)
    return () => clearTimeout(t)
  }, [msg])

  const set = <K extends keyof AgentRow>(k: K, v: AgentRow[K]) => {
    setForm((prev) => ({ ...prev, [k]: v }))
    if (msg?.kind === 'err') setMsg(null)
  }

  const setList = (k: keyof AgentRow, raw: string) => {
    const items = raw.split(',').map((s) => s.trim()).filter(Boolean)
    setForm((prev) => ({ ...prev, [k]: items }))
    if (msg?.kind === 'err') setMsg(null)
  }

  const discard = () => {
    setForm(initialFormRef.current)
    setMsg(null)
  }

  const save = async () => {
    setSaving(true)
    setMsg(null)
    const res = await fetch(`/api/admin/agents/${agent.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name: form.full_name,
        agency_name: form.agency_name,
        email: form.email,
        phone: form.phone,
        tagline: form.tagline,
        bio: form.bio,
        avatar_url: form.avatar_url,
        instagram_url: form.instagram_url,
        facebook_url: form.facebook_url,
        youtube_url: form.youtube_url,
        tiktok_url: form.tiktok_url,
        website_url: form.website_url,
        tier: form.tier,
        subscription_status: form.subscription_status,
        template: form.template,
        role: form.role,
        travel_specialties: form.travel_specialties ?? [],
        destination_specialties: form.destination_specialties ?? [],
        preferred_suppliers: form.preferred_suppliers ?? [],
        travel_types: form.travel_types ?? [],
      }),
    })
    if (res.ok) {
      initialFormRef.current = form
      setInitial(snapshot(form))
      setMsg({ kind: 'ok', text: 'Saved.' })
    } else {
      const { error } = await res.json().catch(() => ({ error: 'Save failed' }))
      setMsg({ kind: 'err', text: error ?? 'Save failed' })
    }
    setSaving(false)
  }

  const showBar = isDirty || !!msg

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <Card title="Account Information">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Field label="Full Name" value={form.full_name ?? ''} onChange={(v) => set('full_name', v)} />
            <Field label="Agency Name" value={form.agency_name ?? ''} onChange={(v) => set('agency_name', v)} />
            <Field label="Email" type="email" value={form.email ?? ''} onChange={(v) => set('email', v)} />
            <Field label="Phone" value={form.phone ?? ''} onChange={(v) => set('phone', v)} />
            <Select
              label="Tier"
              value={form.tier ?? 'starter'}
              onChange={(v) => set('tier', v as AgentRow['tier'])}
              options={['starter', 'growth', 'custom', 'agency']}
            />
            <Select
              label="Subscription Status"
              value={form.subscription_status ?? 'trialing'}
              onChange={(v) => set('subscription_status', v)}
              options={['trialing', 'active', 'past_due', 'canceled', 'unpaid']}
            />
            <Select
              label="Template"
              value={form.template ?? 'frontend'}
              onChange={(v) => set('template', v)}
              options={['frontend', 't2', 't3', 't4']}
            />
            <Select
              label="Role"
              value={form.role ?? 'agent'}
              onChange={(v) => set('role', v as AgentRow['role'])}
              options={['agent', 'admin', 'super_admin']}
            />
          </div>
        </Card>

        <Card title="Profile & Social">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Field label="Tagline" value={form.tagline ?? ''} onChange={(v) => set('tagline', v)} />
            <Textarea label="Bio" value={form.bio ?? ''} onChange={(v) => set('bio', v)} rows={5} />
            <Field label="Avatar URL" value={form.avatar_url ?? ''} onChange={(v) => set('avatar_url', v)} />
            <Field label="Website" value={form.website_url ?? ''} onChange={(v) => set('website_url', v)} placeholder="https://" />
            <Field label="Instagram URL" value={form.instagram_url ?? ''} onChange={(v) => set('instagram_url', v)} placeholder="https://instagram.com/…" />
            <Field label="Facebook URL" value={form.facebook_url ?? ''} onChange={(v) => set('facebook_url', v)} />
            <Field label="YouTube URL" value={form.youtube_url ?? ''} onChange={(v) => set('youtube_url', v)} />
            <Field label="TikTok URL" value={form.tiktok_url ?? ''} onChange={(v) => set('tiktok_url', v)} />
          </div>
        </Card>
      </div>

      <Card title="Specialties & Expertise">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <Textarea
            label="Travel Specialties"
            hint="Comma-separated. E.g. Luxury, Honeymoons, Wellness"
            value={(form.travel_specialties ?? []).join(', ')}
            onChange={(v) => setList('travel_specialties', v)}
            rows={2}
          />
          <Textarea
            label="Destination Specialties"
            hint="Comma-separated. E.g. Europe, Mediterranean, Asia-Pacific"
            value={(form.destination_specialties ?? []).join(', ')}
            onChange={(v) => setList('destination_specialties', v)}
            rows={2}
          />
          <Textarea
            label="Preferred Suppliers"
            hint="Comma-separated. E.g. Virtuoso, Aman, Four Seasons"
            value={(form.preferred_suppliers ?? []).join(', ')}
            onChange={(v) => setList('preferred_suppliers', v)}
            rows={2}
          />
          <Textarea
            label="Travel Types"
            hint="Comma-separated. E.g. Bespoke Itineraries, Cruises, Villas"
            value={(form.travel_types ?? []).join(', ')}
            onChange={(v) => setList('travel_types', v)}
            rows={2}
          />
        </div>
      </Card>

      {/* Padding so the fixed bar never covers the last field. */}
      {showBar && <div style={{ height: 80 }} aria-hidden />}

      {showBar && (
        <div
          role="region"
          aria-label="Unsaved changes"
          style={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(255,255,255,0.96)',
            backdropFilter: 'blur(6px)',
            borderTop: '1px solid #e5e7eb',
            padding: '14px 28px',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            zIndex: 50,
            boxShadow: '0 -4px 12px rgba(0,0,0,0.04)',
            animation: 'agentEditorBarSlideUp 180ms ease-out',
          }}
        >
          <style>{`@keyframes agentEditorBarSlideUp{from{opacity:0}to{opacity:1}}`}</style>

          {/* Status text — left side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
            {isDirty && (
              <>
                <span
                  aria-hidden
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 999,
                    background: '#f59e0b',
                    boxShadow: '0 0 0 3px rgba(245,158,11,0.18)',
                  }}
                />
                <span style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>
                  You have unsaved changes
                </span>
              </>
            )}
            {!isDirty && msg && (
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: msg.kind === 'ok' ? '#16a34a' : '#dc2626',
                }}
              >
                {msg.kind === 'ok' ? '✓ ' : ''}{msg.text}
              </span>
            )}
            {isDirty && msg?.kind === 'err' && (
              <span style={{ fontSize: 13, fontWeight: 500, color: '#dc2626' }}>
                {msg.text}
              </span>
            )}
          </div>

          {/* Action buttons — right side */}
          <button
            onClick={discard}
            disabled={!isDirty || saving}
            style={{
              padding: '10px 18px',
              background: '#fff',
              color: isDirty ? '#374151' : '#9ca3af',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              cursor: !isDirty || saving ? 'not-allowed' : 'pointer',
            }}
          >
            Discard
          </button>
          <button
            onClick={save}
            disabled={!isDirty || saving}
            title={!isDirty ? 'No changes to save' : undefined}
            style={{
              padding: '10px 22px',
              background: !isDirty ? '#e5e7eb' : '#111',
              color: !isDirty ? '#9ca3af' : '#fff',
              border: 'none',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              cursor: saving ? 'wait' : !isDirty ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.7 : 1,
              transition: 'background 150ms ease, color 150ms ease',
            }}
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      )}
    </div>
  )
}

// ── Field primitives ──────────────────────────────────────────────────────────

function labelStyle(): React.CSSProperties {
  return { fontSize: 12, color: '#6b7280', fontWeight: 500 }
}
function inputStyle(): React.CSSProperties {
  return {
    width: '100%',
    padding: '9px 12px',
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    fontSize: 14,
    background: '#fff',
    color: '#111',
    fontFamily: 'inherit',
    outline: 'none',
  }
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
}) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={labelStyle()}>{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={inputStyle()}
      />
    </label>
  )
}

function Textarea({
  label,
  value,
  onChange,
  rows = 3,
  hint,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  rows?: number
  hint?: string
}) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={labelStyle()}>{label}</span>
      <textarea
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        style={{ ...inputStyle(), resize: 'vertical', minHeight: 64 }}
      />
      {hint && <span style={{ fontSize: 11, color: '#9ca3af' }}>{hint}</span>}
    </label>
  )
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: string[]
}) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={labelStyle()}>{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={inputStyle()}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  )
}
