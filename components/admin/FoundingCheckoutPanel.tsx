'use client'
import { useState } from 'react'
import { Card } from '@/components/dashboard/Card'

interface Props {
  /** Display-only — used to label the panel. The generated link is keyed by
   *  tier, not by agent, so the operator sends it to the right advisor. */
  agentName: string | null
}

/**
 * Founding Advisor checkout-link generator (super_admin only).
 *
 * Posts to /api/stripe/checkout with { tier, plan: 'founding' }. That route
 * gates the founding branch behind getCurrentSuperAdmin(); the admin's session
 * cookie travels with this same-origin fetch. The founding plan is never
 * exposed on a public page or the public /#pricing checkout.
 */
const FOUNDING_TIER_OPTIONS = [
  { value: 'starter', label: 'Starter — $59/mo (founding)' },
  { value: 'growth', label: 'Growth — $119/mo (founding)' },
  { value: 'custom', label: 'Custom — $249/mo (founding)' },
] as const

export function FoundingCheckoutPanel({ agentName }: Props) {
  const [tier, setTier] = useState<string>('growth')
  const [busy, setBusy] = useState(false)
  const [url, setUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function generate() {
    setBusy(true)
    setError(null)
    setUrl(null)
    setCopied(false)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier, plan: 'founding' }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.url) {
        setError(data.error ?? 'Failed to generate the checkout link.')
      } else {
        setUrl(data.url as string)
      }
    } catch {
      setError('Network error — could not reach the checkout endpoint.')
    } finally {
      setBusy(false)
    }
  }

  async function copy() {
    if (!url) return
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setError('Could not copy automatically — select the link and copy it manually.')
    }
  }

  return (
    <Card title="Founding Advisor Checkout Link">
      <div style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.7, marginBottom: 16 }}>
        Generate an invitation-only Founding Advisor checkout link
        {agentName ? (
          <> for <strong style={{ color: '#111' }}>{agentName}</strong></>
        ) : null}
        . The link waives the setup fee, runs a 90-day free trial, then locks the
        founding monthly rate. Paste it into the advisor&rsquo;s Welcome email —
        it is not available on any public page.
      </div>

      <div
        style={{
          display: 'flex',
          gap: 12,
          flexWrap: 'wrap',
          alignItems: 'center',
          marginBottom: url || error ? 14 : 0,
        }}
      >
        <select
          value={tier}
          onChange={(e) => setTier(e.target.value)}
          disabled={busy}
          style={selectStyle}
        >
          {FOUNDING_TIER_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <button onClick={generate} disabled={busy} style={primaryBtn(busy)}>
          {busy ? 'Generating…' : 'Generate Founding Advisor checkout link'}
        </button>
      </div>

      {url && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            readOnly
            value={url}
            onFocus={(e) => e.currentTarget.select()}
            style={urlInputStyle}
          />
          <button onClick={copy} style={copyBtnStyle}>
            {copied ? 'Copied ✓' : 'Copy'}
          </button>
        </div>
      )}

      {error && (
        <div
          style={{
            padding: '8px 12px',
            borderRadius: 6,
            fontSize: 13,
            background: '#fef2f2',
            color: '#991b1b',
            border: '1px solid #fecaca',
          }}
        >
          {error}
        </div>
      )}
    </Card>
  )
}

const selectStyle: React.CSSProperties = {
  padding: '8px 12px',
  border: '1px solid #d1d5db',
  borderRadius: 6,
  fontSize: 13,
  background: '#fff',
  color: '#111',
  cursor: 'pointer',
  outline: 'none',
}

function primaryBtn(disabled: boolean): React.CSSProperties {
  return {
    padding: '8px 16px',
    background: '#111',
    color: '#fff',
    border: '1px solid #111',
    borderRadius: 6,
    fontSize: 13,
    fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.55 : 1,
    transition: 'opacity 0.15s ease',
  }
}

const urlInputStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 240,
  padding: '8px 12px',
  border: '1px solid #d1d5db',
  borderRadius: 6,
  fontSize: 13,
  color: '#111',
  background: '#fafafa',
  outline: 'none',
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
}

const copyBtnStyle: React.CSSProperties = {
  padding: '8px 16px',
  background: '#fff',
  color: '#111',
  border: '1px solid #d1d5db',
  borderRadius: 6,
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
}
