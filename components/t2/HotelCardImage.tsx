'use client'

import { useState } from 'react'
import Image from 'next/image'

interface HotelCardImageProps {
  src: string | null
  alt: string
  /** Used as the fallback label if the image is missing or fails to load. */
  fallbackLabel: string
  sizes?: string
}

/**
 * Hotel directory card image with graceful fallback.
 *
 * The Virtuoso hotel catalogue has some stale/broken `cover_image_url`
 * values. next/image does not have a built-in fallback, so this component
 * tracks load errors and swaps to a styled placeholder (hotel name on a
 * warm neutral) when the real image fails.
 */
export function HotelCardImage({
  src,
  alt,
  fallbackLabel,
  sizes = '(max-width: 768px) 100vw, 33vw',
}: HotelCardImageProps) {
  const [errored, setErrored] = useState(false)

  if (!src || errored) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px 24px',
          background:
            'linear-gradient(135deg, #EDE8E1 0%, #DDD6CA 100%)',
          textAlign: 'center',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--t2-font-serif)',
            color: 'var(--t2-text)',
            fontSize: 16,
            fontWeight: 400,
            letterSpacing: '-0.01em',
            lineHeight: 1.3,
          }}
        >
          {fallbackLabel}
        </span>
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="t2-card-image"
      style={{ objectFit: 'cover' }}
      sizes={sizes}
      unoptimized
      onError={() => setErrored(true)}
    />
  )
}
