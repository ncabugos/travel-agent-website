'use client'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

interface Props {
  tier: 'starter' | 'growth' | 'custom'
  popular?: boolean
  children?: React.ReactNode
}

export function CheckoutButton({ tier, popular, children }: Props) {
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        console.error('Checkout error:', data.error)
        setLoading(false)
      }
    } catch (err) {
      console.error('Checkout error:', err)
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        width: '100%',
        textAlign: 'center',
        padding: '12px',
        backgroundColor: popular ? '#111' : '#fff',
        color: popular ? '#fff' : '#111',
        border: popular ? 'none' : '1px solid #d1d5db',
        borderRadius: '10px',
        fontSize: '14px',
        fontWeight: 600,
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.7 : 1,
        transition: 'all 0.15s',
      }}
    >
      {loading ? (
        <>
          <Loader2 size={16} strokeWidth={1.5} style={{ animation: 'spin 1s linear infinite' }} />
          Redirecting…
        </>
      ) : (
        children ?? 'Get Started'
      )}
      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
    </button>
  )
}
