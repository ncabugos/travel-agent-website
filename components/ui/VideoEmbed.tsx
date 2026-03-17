'use client'

import Image from 'next/image'
import { useState } from 'react'

interface VideoEmbedProps {
  youtubeId: string
  posterSrc: string
  posterAlt?: string
  /** CSS aspect-ratio value, e.g. '16/9' or '4/3'. Defaults to '16/9' */
  aspectRatio?: string
}

export function VideoEmbed({
  youtubeId,
  posterSrc,
  posterAlt = 'Video thumbnail',
  aspectRatio = '16/9',
}: VideoEmbedProps) {
  const [playing, setPlaying] = useState(false)

  return (
    <>
      <style>{`
        .video-embed-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: ${aspectRatio};
          overflow: hidden;
          border-radius: 4px;
          box-shadow: 0 12px 48px rgba(0,0,0,0.18);
          background: #000;
          cursor: pointer;
        }
        .video-embed-poster {
          position: absolute;
          inset: 0;
          transition: transform 0.4s ease;
        }
        .video-embed-wrap:hover .video-embed-poster {
          transform: scale(1.03);
        }
        .video-embed-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.28);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.3s ease;
        }
        .video-embed-wrap:hover .video-embed-overlay {
          background: rgba(0,0,0,0.18);
        }
        .video-play-btn {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: rgba(255,255,255,0.92);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          box-shadow: 0 4px 24px rgba(0,0,0,0.28);
        }
        .video-embed-wrap:hover .video-play-btn {
          transform: scale(1.1);
          box-shadow: 0 8px 32px rgba(0,0,0,0.36);
        }
        .video-play-btn svg {
          margin-left: 5px;
        }
        .video-embed-iframe {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border: 0;
        }
      `}</style>

      <div className="video-embed-wrap" onClick={() => !playing && setPlaying(true)}>
        {!playing ? (
          <>
            {/* Poster image */}
            <div className="video-embed-poster">
              <Image
                src={posterSrc}
                alt={posterAlt}
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
                style={{ objectFit: 'cover', objectPosition: 'center' }}
                priority
              />
            </div>
            {/* Dark overlay + play button */}
            <div className="video-embed-overlay">
              <div className="video-play-btn">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="#1a1a1a">
                  <polygon points="5,3 19,12 5,21" />
                </svg>
              </div>
            </div>
          </>
        ) : (
          <iframe
            className="video-embed-iframe"
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
            title="Eden For Your World — Luxury Travel"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>
    </>
  )
}
