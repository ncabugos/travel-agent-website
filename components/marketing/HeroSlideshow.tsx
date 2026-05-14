'use client'

import { useEffect, useState } from 'react'

const SLIDES = [
  '/media/hotel-programs/aman/aman-hero-2000.jpg',
  '/media/cruises/regent-seven-seas/Regent-hero-Tahiti-2500.jpg',
  '/media/hotel-programs/four-seasons/fs-hero-2200.jpg',
  '/media/cruises/ponant/ponant-hero-2200.jpg',
  '/media/hotel-programs/belmond-bellini-club/belmond-hero-2000.jpg',
]

// 3 s visible + 1 s cross-fade = 4 s per slide
const INTERVAL = 4000
const FADE_MS = 1000

export function HeroSlideshow() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setCurrent(i => (i + 1) % SLIDES.length), INTERVAL)
    return () => clearInterval(t)
  }, [])

  return (
    <>
      {SLIDES.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt=""
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
            opacity: i === current ? 1 : 0,
            transition: `opacity ${FADE_MS}ms ease-in-out`,
          }}
        />
      ))}
    </>
  )
}
