'use client'
/**
 * T2RelatedArticles.tsx
 * Displays blog posts tagged with a specific supplier on cruise/hotel landing pages.
 * Renders in the T2 editorial aesthetic with serif headings and muted labels.
 */
import Image from 'next/image'
import Link from 'next/link'
import type { BlogPost } from '@/types/index'

interface Props {
  /** Blog posts to display */
  posts: BlogPost[]
  /** Heading label above the grid (e.g. "From the Journal") */
  label?: string
  /** Main heading (e.g. "Related Articles") */
  heading?: string
  /** Base path for article links, e.g. /t2/agentId */
  basePath: string
}

export function T2RelatedArticles({
  posts,
  label = 'From the Journal',
  heading = 'Related Articles',
  basePath,
}: Props) {
  if (!posts.length) return null

  const displayed = posts.slice(0, 3)

  return (
    <section className="t2-section" style={{ maxWidth: '100%', width: '100%' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 48px' }}>
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span
            style={{
              fontSize: 11,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--t2-primary)',
              opacity: 0.5,
              display: 'block',
              marginBottom: 16,
              fontFamily: 'var(--t2-font-sans)',
            }}
          >
            {label}
          </span>
          <h2
            className="t2-heading"
            style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', margin: 0 }}
          >
            {heading}
          </h2>
        </div>

        {/* Article grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: 32,
          }}
        >
          {displayed.map((post) => {
            const date = new Date(post.published_at)
            const month = date.toLocaleString('en-US', { month: 'long', year: 'numeric' }).toUpperCase()

            return (
              <Link
                key={post.id}
                href={`${basePath}/blog/${post.slug}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <article style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {/* Cover image */}
                  {post.cover_image_url && (
                    <div
                      style={{
                        position: 'relative',
                        aspectRatio: '16 / 10',
                        borderRadius: 'var(--t2-radius-lg, 8px)',
                        overflow: 'hidden',
                      }}
                    >
                      <Image
                        src={post.cover_image_url}
                        alt={post.title}
                        fill
                        style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }}
                        sizes="(max-width: 768px) 100vw, 33vw"
                        unoptimized
                        onMouseEnter={(e) => {
                          ;(e.currentTarget as HTMLElement).style.transform = 'scale(1.03)'
                        }}
                        onMouseLeave={(e) => {
                          ;(e.currentTarget as HTMLElement).style.transform = 'scale(1)'
                        }}
                      />
                    </div>
                  )}

                  {/* Date label */}
                  <span
                    style={{
                      fontSize: 11,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'var(--t2-text-muted, #888)',
                      fontFamily: 'var(--t2-font-sans)',
                    }}
                  >
                    {month}
                  </span>

                  {/* Title */}
                  <h3
                    style={{
                      fontFamily: 'var(--t2-font-serif)',
                      fontSize: 'clamp(18px, 2vw, 24px)',
                      fontWeight: 400,
                      lineHeight: 1.3,
                      margin: 0,
                      color: 'var(--t2-primary, #1a1a1a)',
                    }}
                  >
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  {post.excerpt && (
                    <p
                      style={{
                        fontFamily: 'var(--t2-font-sans)',
                        fontSize: 14,
                        lineHeight: 1.7,
                        color: 'var(--t2-text-muted, #666)',
                        margin: 0,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {post.excerpt}
                    </p>
                  )}
                </article>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
