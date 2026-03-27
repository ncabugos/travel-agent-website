'use client'

import { useCallback, useEffect, useState } from 'react'
import { useDragScroll } from '@/hooks/useDragScroll'

interface GallerySliderProps {
  images: { src: string; alt?: string }[]
}

export function GallerySlider({ images }: GallerySliderProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isMobile, setIsMobile]       = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const cols = isMobile ? 2 : 3

  // ── Active-dot tracker ────────────────────────────────────────────────────
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const onScroll = () => {
      const itemW = track.scrollWidth / images.length
      setActiveIndex(Math.round(track.scrollLeft / itemW))
    }
    track.addEventListener('scroll', onScroll, { passive: true })
    return () => track.removeEventListener('scroll', onScroll)
  }, [images.length])

  // ── Programmatic scroll (arrows + dots) ──────────────────────────────────
  const scrollTo = useCallback((index: number) => {
    const track = trackRef.current
    if (!track) return
    // Temporarily disable scroll-snap so smooth scrollTo works reliably
    track.style.scrollSnapType = 'none'
    const itemW = track.scrollWidth / images.length
    track.scrollTo({ left: itemW * index, behavior: 'smooth' })
    // Re-enable snap after animation (~500 ms is enough for smooth scroll)
    setTimeout(() => {
      if (trackRef.current) trackRef.current.style.scrollSnapType = ''
    }, 520)
    setActiveIndex(index)
  }, [images.length])

  const prev = useCallback(
    () => scrollTo(Math.max(0, activeIndex - 1)),
    [activeIndex, scrollTo]
  )
  const next = useCallback(
    () => scrollTo(Math.min(images.length - cols, activeIndex + 1)),
    [activeIndex, images.length, cols, scrollTo]
  )

  const { ref: trackRef, handlers: dragHandlers } = useDragScroll()


  // ── Dots ─────────────────────────────────────────────────────────────────
  const pageCount = Math.max(0, images.length - cols + 1)

  if (!images.length) return null

  return (
    <>
      <style>{`
        .gs-wrap {
          position: relative;
          user-select: none;
          -webkit-user-select: none;
          cursor: grab;
        }
        .gs-wrap:active { cursor: grabbing; }

        .gs-track {
          display: grid;
          grid-auto-flow: column;
          grid-auto-columns: calc(100% / 3);
          overflow-x: scroll;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          will-change: scroll-position;
        }
        .gs-track::-webkit-scrollbar { display: none; }

        @media (max-width: 768px) {
          .gs-track { grid-auto-columns: calc(100% / 2); }
        }

        .gs-cell {
          scroll-snap-align: start;
          aspect-ratio: 1 / 1;
          overflow: hidden;
          position: relative;
          flex-shrink: 0;
        }
        .gs-cell img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.6s ease;
          pointer-events: none;
          -webkit-user-drag: none;
        }
        .gs-cell:hover img { transform: scale(1.04); }

        .gs-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          width: 52px;
          height: 52px;
          background: rgba(250,249,246,0.92);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(181,148,90,0.25);
          border-radius: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.25s, border-color 0.25s, opacity 0.2s;
        }
        .gs-arrow:hover:not(:disabled) {
          background: #fff;
          border-color: rgba(181,148,90,0.55);
        }
        .gs-arrow:disabled { opacity: 0.25; cursor: default; pointer-events: none; }
        .gs-arrow-l { left: 20px; }
        .gs-arrow-r { right: 20px; }
        .gs-arrow svg { width:16px; height:16px; stroke:#B5945A; fill:none; stroke-width:1.5; }

        .gs-dots {
          display: flex;
          gap: 8px;
          justify-content: center;
          margin-top: 24px;
        }
        .gs-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(181,148,90,0.25);
          border: none;
          cursor: pointer;
          padding: 0;
          transition: background 0.25s, width 0.25s;
        }
        .gs-dot.active {
          background: #B5945A;
          width: 20px;
          border-radius: 3px;
        }
      `}</style>

      <div
        className="gs-wrap"
        {...dragHandlers}
      >
        {/* Prev */}
        <button
          className="gs-arrow gs-arrow-l"
          onClick={(e) => { e.stopPropagation(); prev() }}
          disabled={activeIndex === 0}
          aria-label="Previous images"
        >
          <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
        </button>

        {/* Scrollable track */}
        <div
          ref={trackRef}
          className="gs-track"
        >
          {images.map((img, i) => (
            <div key={i} className="gs-cell">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.src} alt={img.alt ?? ''} loading="lazy" draggable={false} />
            </div>
          ))}
        </div>

        {/* Next */}
        <button
          className="gs-arrow gs-arrow-r"
          onClick={(e) => { e.stopPropagation(); next() }}
          disabled={activeIndex >= images.length - cols}
          aria-label="Next images"
        >
          <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>
        </button>
      </div>

      {/* Dot indicators */}
      {pageCount > 1 && (
        <div className="gs-dots">
          {Array.from({ length: pageCount }).map((_, i) => (
            <button
              key={i}
              className={`gs-dot${activeIndex === i ? ' active' : ''}`}
              onClick={() => scrollTo(i)}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      )}
    </>
  )
}
