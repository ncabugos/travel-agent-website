'use client'
import { useState } from 'react'
import { Loader2, ExternalLink } from 'lucide-react'

export function ManageBillingButton() {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        console.error('Portal error:', data.error)
        setLoading(false)
      }
    } catch (err) {
      console.error('Portal error:', err)
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '10px 20px',
        backgroundColor: '#111',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: 600,
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.7 : 1,
        transition: 'all 0.15s',
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}
    >
      {loading ? (
        <>
          <Loader2 size={14} strokeWidth={1.5} style={{ animation: 'spin 1s linear infinite' }} />
          Opening…
        </>
      ) : (
        <>
          <ExternalLink size={14} strokeWidth={1.5} />
          Manage Billing
        </>
      )}
      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
    </button>
  )
}
