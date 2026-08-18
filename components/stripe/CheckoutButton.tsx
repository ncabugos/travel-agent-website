'use client'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

interface Props {
  tier: 'starter' | 'growth' | 'custom'
  popular?: boolean
  /** Billing cycle for the recurring price. Defaults to 'monthly' for backward compatibility. */
  billingCycle?: 'monthly' | 'annual'
  children?: React.ReactNode
  /** Extra class names appended after the built-in luxe class. */
  className?: string
  /** Inline overrides merged on top of the default button styling. */
  style?: React.CSSProperties
}

export function CheckoutButton({
  tier,
  popular,
  billingCycle = 'monthly',
  children,
  className,
  style,
}: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCheckout = async () => {
    if (loading) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier, billingCycle }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        console.error('Checkout error:', data.error)
        setError('We couldn\u2019t open checkout. Try again, or email support@eliteadvisorhub.com.')
        setLoading(false)
      }
    } catch (err) {
      console.error('Checkout error:', err)
      setError('We couldn\u2019t reach checkout. Check your connection and try again.')
      setLoading(false)
    }
  }

  // Wrapper keeps button + status region as one flex/grid child for callers.
  return (
    <div style={{ width: style?.width ?? '100%' }}>
      <button
        type="button"
        onClick={handleCheckout}
        aria-disabled={loading}
        aria-busy={loading}
        className={[popular ? 'eah-btn-lux' : 'eah-focus-ring-dark', className ?? ''].join(' ').trim() || undefined}
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
          // The luxe class supplies the white hairline on the dark variant; the
          // light variant keeps its own gray border (a white ring is invisible
          // on white).
          border: popular ? undefined : '1px solid #d1d5db',
          borderRadius: '10px',
          fontSize: '14px',
          fontWeight: 600,
          cursor: loading ? 'progress' : 'pointer',
          opacity: loading ? 0.7 : 1,
          transition: popular ? undefined : 'background-color 0.15s, border-color 0.15s, opacity 0.15s',
          ...style,
        }}
      >
        {loading ? (
          <>
            <Loader2 aria-hidden="true" size={16} strokeWidth={1.5} className="eah-spin" />
            Redirecting…
          </>
        ) : (
          children ?? 'Get Started'
        )}
      </button>
      {/* Status region: announces the redirect + any failure with a next step. */}
      <p
        role="status"
        aria-live="polite"
        style={{
          margin: error ? '10px 0 0' : 0,
          fontSize: '13px',
          lineHeight: 1.5,
          color: '#b42318',
          textAlign: 'center',
        }}
      >
        {error}
      </p>
      <style>{`
        @keyframes eah-spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        .eah-spin { animation: eah-spin 1s linear infinite; }
        @media (prefers-reduced-motion: reduce) { .eah-spin { animation: none; } }
      `}</style>
    </div>
  )
}
