'use client'

import { useEffect, useState, type ComponentPropsWithoutRef } from 'react'
import { decodeContact } from '@/lib/obfuscate'

type ObfuscatedContactProps = Omit<ComponentPropsWithoutRef<'a'>, 'href' | 'children'> & {
  /**
   * Output of encodeContact(). Must be encoded by a server component — handing
   * this a raw address puts it back in the RSC payload, defeating the point.
   */
  encoded: string
  kind: 'email' | 'tel'
  /** Where visitors without JavaScript go instead — normally the contact page. */
  fallbackHref: string
  /** Shown until the browser reassembles the value. */
  fallbackLabel?: string
}

/**
 * Renders a mailto:/tel: link whose address is assembled in the browser rather
 * than shipped in the HTML. See lib/obfuscate.ts for what this does and doesn't
 * protect against.
 *
 * Styling passes straight through: every remaining prop is spread onto the
 * anchor, so callers keep their own className / style / hover handlers.
 */
export function ObfuscatedContact({
  encoded,
  kind,
  fallbackHref,
  fallbackLabel,
  ...anchorProps
}: ObfuscatedContactProps) {
  const [value, setValue] = useState('')

  // Deliberately after mount, not during render: decoding while rendering would
  // put the plain value into the server-rendered HTML — the exact thing we're
  // avoiding. Server and first client render both show the fallback, so there
  // is no hydration mismatch.
  useEffect(() => {
    setValue(decodeContact(encoded))
  }, [encoded])

  if (!value) {
    return (
      <a {...anchorProps} href={fallbackHref}>
        {fallbackLabel ?? (kind === 'email' ? 'Email us' : 'Call us')}
      </a>
    )
  }

  const href = kind === 'email' ? `mailto:${value}` : `tel:${value.replace(/[^+\d]/g, '')}`

  return (
    <a {...anchorProps} href={href}>
      {value}
    </a>
  )
}
