'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Anti-spam fields for public forms. Render inside the <form>, just above the
 * submit button. Checked server-side by checkForBot() in lib/spam.ts.
 *
 * - Honeypot `website_url`: hidden from people, filled by naive bots.
 * - `_fill_ms`: time from mount to submit, measured in the browser so clock
 *   differences between browser and server cannot cause false positives.
 * - Cloudflare Turnstile, when NEXT_PUBLIC_TURNSTILE_SITE_KEY is set. Invisible
 *   unless Cloudflare wants the visitor to click a checkbox.
 *
 * Pass the form's action state as `resetKey`: Turnstile tokens are single-use,
 * so the widget needs a fresh one after every submission.
 */

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

type Turnstile = {
  render: (el: HTMLElement, options: Record<string, unknown>) => string
  reset: (widgetId: string) => void
  remove: (widgetId: string) => void
}

declare global {
  interface Window {
    turnstile?: Turnstile
  }
}

let scriptPromise: Promise<void> | null = null

function loadTurnstile(): Promise<void> {
  if (window.turnstile) return Promise.resolve()
  scriptPromise ??= new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = SCRIPT_SRC
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => {
      scriptPromise = null
      reject(new Error('Turnstile script failed to load'))
    }
    document.head.appendChild(script)
  })
  return scriptPromise
}

export function SpamFields({ resetKey }: { resetKey?: unknown }) {
  const fillRef = useRef<HTMLInputElement>(null)
  const widgetRef = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string | null>(null)
  // The widget takes no space until Cloudflare shows a checkbox; only then
  // does it need breathing room from the submit button.
  const [challengeShown, setChallengeShown] = useState(false)

  // Native listener on the form runs before React's delegated submit handler
  // builds the FormData, so the value is in place when the action reads it.
  useEffect(() => {
    const input = fillRef.current
    const form = input?.form
    if (!input || !form) return
    const mountedAt = performance.now()
    const onSubmit = () => {
      input.value = String(Math.round(performance.now() - mountedAt))
    }
    form.addEventListener('submit', onSubmit)
    return () => form.removeEventListener('submit', onSubmit)
  }, [])

  useEffect(() => {
    const el = widgetRef.current
    if (!SITE_KEY || !el) return
    let cancelled = false
    loadTurnstile()
      .then(() => {
        if (cancelled || !window.turnstile) return
        widgetId.current = window.turnstile.render(el, {
          sitekey: SITE_KEY,
          appearance: 'interaction-only',
          // 'flexible' needs 300px; narrow mobile forms get the compact box.
          size: el.clientWidth < 300 ? 'compact' : 'flexible',
          'before-interactive-callback': () => setChallengeShown(true),
        })
      })
      .catch(err => console.warn('[spam]', err))
    return () => {
      cancelled = true
      if (widgetId.current) window.turnstile?.remove(widgetId.current)
      widgetId.current = null
    }
  }, [])

  useEffect(() => {
    if (widgetId.current) window.turnstile?.reset(widgetId.current)
  }, [resetKey])

  return (
    <>
      <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', top: 'auto', width: 1, height: 1, overflow: 'hidden' }}>
        <input type="text" name="website_url" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>
      <input ref={fillRef} type="hidden" name="_fill_ms" defaultValue="" />
      {SITE_KEY && <div ref={widgetRef} style={challengeShown ? { marginBottom: 16 } : undefined} />}
    </>
  )
}
