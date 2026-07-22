'use client'
import { useEffect, useState } from 'react'
import { MODULES, SERVICES, usd } from '@/lib/pricing'

/**
 * Services & modules — the portal storefront (business model v2,
 * docs/business-model-v2.md).
 *
 * Modules: self-serve when the module has a Stripe price and the agent has a
 * subscription (POST/DELETE /api/agent-portal/modules adds/removes a prorated
 * subscription item). Otherwise falls back to the request flow.
 *
 * Studio services: always request-based (edit_requests) — the operator
 * confirms scope before anything is billed.
 */

const GOLD = '#B49A5A'

interface ModuleState {
  key: string
  active: boolean
  selfServe: boolean
}

export default function AgentServicesPage() {
  const [moduleStates, setModuleStates] = useState<Map<string, ModuleState>>(new Map())
  const [requestedKeys, setRequestedKeys] = useState<Set<string>>(new Set())
  const [busyKey, setBusyKey] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  const loadModules = () => {
    fetch('/api/agent-portal/modules')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data?.modules)) {
          setModuleStates(new Map(data.modules.map((m: ModuleState) => [m.key, m])))
        }
      })
      .catch(() => {})
  }

  useEffect(() => { loadModules() }, [])

  const submitRequest = async (kind: 'Module' | 'Service', name: string, price: string, key: string) => {
    const res = await fetch('/api/agent-portal/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject: `${kind} order: ${name}`,
        description: `Requested from the Services page — ${name} (${price}). Please activate or follow up with next steps.`,
      }),
    })
    if (res.ok) {
      setRequestedKeys((prev) => new Set(prev).add(key))
      return true
    }
    return false
  }

  /** Activate a module — self-serve billing first, request flow as fallback. */
  const addModule = async (key: string, name: string, price: string) => {
    setBusyKey(key)
    setErrorMsg('')
    const state = moduleStates.get(key)
    try {
      if (state?.selfServe) {
        const res = await fetch('/api/agent-portal/modules', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ module: key }),
        })
        if (res.ok) {
          loadModules()
          return
        }
        const body = await res.json().catch(() => ({}))
        if (body?.fallback !== 'request') {
          setErrorMsg(body?.error ?? 'The module could not be added. Please try again.')
          return
        }
        // fall through to request flow
      }
      const ok = await submitRequest('Module', name, price, key)
      if (!ok) setErrorMsg('The request could not be sent. Please try again.')
    } finally {
      setBusyKey(null)
    }
  }

  const removeModule = async (key: string) => {
    setBusyKey(key)
    setErrorMsg('')
    try {
      const res = await fetch('/api/agent-portal/modules', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ module: key }),
      })
      if (res.ok) {
        loadModules()
      } else {
        const body = await res.json().catch(() => ({}))
        setErrorMsg(body?.error ?? 'The module could not be removed. Please try again.')
      }
    } finally {
      setBusyKey(null)
    }
  }

  const orderService = async (key: string, name: string, price: string) => {
    setBusyKey(key)
    setErrorMsg('')
    const ok = await submitRequest('Service', name, price, key)
    if (!ok) setErrorMsg('The request could not be sent. Please try again.')
    setBusyKey(null)
  }

  return (
    <div style={{ padding: '32px 40px', maxWidth: '860px', margin: '0 auto' }}>
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#111' }}>
          Services &amp; Modules
        </h1>
        <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: '14px' }}>
          Add to the site you already have — nothing is rebuilt, nothing starts over. Modules
          join your existing subscription; services are confirmed with you before any billing.
        </p>
      </header>

      {errorMsg && (
        <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#991b1b' }}>{errorMsg}</p>
      )}

      {/* Monthly modules */}
      <section
        style={{
          background: '#fff',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          marginBottom: '24px',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6' }}>
          <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#1a1a1a' }}>
            Monthly modules
          </h2>
        </div>
        {MODULES.map((m) => {
          const state = moduleStates.get(m.key)
          const price = `${usd(m.monthly)}/mo`
          return (
            <Row
              key={m.key}
              name={m.name}
              description={m.description}
              price={price}
              busy={busyKey === m.key}
              status={
                state?.active ? 'active'
                : requestedKeys.has(m.key) ? 'requested'
                : 'available'
              }
              actionLabel={state?.selfServe ? 'Add to subscription' : 'Request'}
              onAction={() => addModule(m.key, m.name, price)}
              onRemove={state?.active && state?.selfServe ? () => removeModule(m.key) : undefined}
            />
          )
        })}
        <p style={{ margin: 0, padding: '14px 20px', fontSize: '12px', color: '#9ca3af', lineHeight: 1.5, borderTop: '1px solid #f3f4f6' }}>
          Added modules are billed on your existing subscription, prorated from today. During
          your complimentary 30 days, modules first bill on day 31 with the rest of your plan.
        </p>
      </section>

      {/* Studio services */}
      <section
        style={{
          background: '#fff',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6' }}>
          <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#1a1a1a' }}>
            Studio services
          </h2>
        </div>
        {SERVICES.map((s) => (
          <Row
            key={s.key}
            name={s.name}
            description={s.description}
            price={s.price}
            busy={busyKey === s.key}
            status={requestedKeys.has(s.key) ? 'requested' : 'available'}
            actionLabel="Request"
            onAction={() => orderService(s.key, s.name, s.price)}
          />
        ))}
        <p style={{ margin: 0, padding: '14px 20px', fontSize: '12px', color: '#9ca3af', lineHeight: 1.5, borderTop: '1px solid #f3f4f6' }}>
          Service orders arrive as requests — we confirm scope and timing with you before
          anything is billed. Track progress under Edit Requests.
        </p>
      </section>
    </div>
  )
}

function Row({
  name,
  description,
  price,
  status,
  busy,
  actionLabel,
  onAction,
  onRemove,
}: {
  name: string
  description: string
  price: string
  status: 'active' | 'requested' | 'available'
  busy: boolean
  actionLabel: string
  onAction: () => void
  onRemove?: () => void
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
        padding: '16px 20px',
        borderTop: '1px solid #f3f4f6',
      }}
    >
      <div style={{ minWidth: 0 }}>
        <p style={{ margin: '0 0 2px', fontSize: '14px', fontWeight: 600, color: '#111' }}>
          {name}
          <span style={{ marginLeft: '10px', fontSize: '13px', fontWeight: 600, color: GOLD }}>
            {price}
          </span>
        </p>
        <p style={{ margin: 0, fontSize: '13px', color: '#6b7280', lineHeight: 1.5 }}>
          {description}
        </p>
      </div>
      {status === 'active' ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', whiteSpace: 'nowrap' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#065f46' }}>✓ Active</span>
          {onRemove && (
            <button
              onClick={onRemove}
              disabled={busy}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                background: '#fff',
                color: '#6b7280',
                fontSize: '12px',
                fontWeight: 600,
                cursor: busy ? 'not-allowed' : 'pointer',
                opacity: busy ? 0.6 : 1,
              }}
            >
              {busy ? 'Removing…' : 'Remove'}
            </button>
          )}
        </div>
      ) : status === 'requested' ? (
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#065f46', whiteSpace: 'nowrap' }}>
          ✓ Requested
        </span>
      ) : (
        <button
          onClick={onAction}
          disabled={busy}
          style={{
            padding: '8px 18px',
            borderRadius: '8px',
            border: '1px solid #111',
            background: '#fff',
            color: '#111',
            fontSize: '13px',
            fontWeight: 600,
            cursor: busy ? 'not-allowed' : 'pointer',
            opacity: busy ? 0.6 : 1,
            whiteSpace: 'nowrap',
          }}
        >
          {busy ? 'Working…' : actionLabel}
        </button>
      )}
    </div>
  )
}
