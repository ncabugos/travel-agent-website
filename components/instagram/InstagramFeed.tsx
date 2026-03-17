'use client'

import Image from 'next/image'
import type { IgPost } from '@/lib/mock-data'

interface InstagramFeedProps {
  posts: IgPost[]
}

/**
 * InstagramFeed
 * Displays up to 9 posts in a CSS-columns masonry layout.
 * All native Instagram UI is stripped — pure images only.
 * Hover reveals a subtle IG icon linking to the original post.
 */
export function InstagramFeed({ posts }: InstagramFeedProps) {
  if (posts.length === 0) return null

  return (
    <div
      style={{
        columns: '3',
        columnGap: '8px',
      }}
      className="
        [columns:2] sm:[columns:3]
        [column-gap:6px] sm:[column-gap:8px]
      "
    >
      {posts.map((post, i) => (
        <IgTile key={post.id} post={post} priority={i < 3} />
      ))}
    </div>
  )
}

// ─── Individual tile ──────────────────────────────────────────────────────────

function IgTile({ post, priority }: { post: IgPost; priority: boolean }) {
  const src =
    post.media_type === 'VIDEO' ? (post.thumbnail_url ?? '') : post.media_url

  return (
    <a
      href={post.permalink === '#' ? undefined : post.permalink}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block mb-1.5 sm:mb-2 break-inside-avoid overflow-hidden"
      style={{ breakInside: 'avoid' }}
      aria-label={post.caption ?? 'Instagram post'}
    >
      {/* Image — natural height to create masonry effect */}
      <Image
        src={src}
        alt={post.caption ?? ''}
        width={600}
        height={750}
        style={{ width: '100%', height: 'auto', display: 'block' }}
        className="transition-opacity duration-300 group-hover:opacity-80"
        priority={priority}
      />

      {/* Hover overlay with Instagram icon */}
      <div
        className="
          absolute inset-0 flex items-center justify-center
          bg-black/0 group-hover:bg-black/15
          transition-colors duration-300
        "
      >
        <InstagramIcon
          className="
            opacity-0 group-hover:opacity-100
            transition-opacity duration-300
            drop-shadow-lg
          "
        />
      </div>
    </a>
  )
}

// ─── Minimal inline Instagram glyph (no external dep) ────────────────────────

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ width: 28, height: 28 }}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="white" stroke="none" />
    </svg>
  )
}
