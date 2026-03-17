'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { BlogPost } from '@/types/index'

interface CuratedExperiencesProps {
  posts: BlogPost[]
  agentId: string
}

const PLACEHOLDER: BlogPost[] = [
  {
    id: 'p1',
    agent_id: '',
    title: 'A Piece of Eden in Maui, Hawaii',
    slug: '#',
    published_at: new Date().toISOString(),
    excerpt: 'You have to love a place to return to it year after year. Maui is one of those places — warm, timeless, and endlessly beautiful.',
    cover_image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    body_html: '',
    categories: [],
    tags: [],
    status: 'published',
  },
  {
    id: 'p2',
    agent_id: '',
    title: "Amangiri — Utah's Sacred Silence",
    slug: '#',
    published_at: new Date().toISOString(),
    excerpt: 'Fused with the ancient rock formations of the Colorado Plateau, Amangiri truly embodies its namesake as a peaceful mountain.',
    cover_image_url: 'https://images.unsplash.com/photo-1469041797191-50ace28483c3?w=800&q=80',
    body_html: '',
    categories: [],
    tags: [],
    status: 'published',
  },
  {
    id: 'p3',
    agent_id: '',
    title: 'Bella Italia!',
    slug: '#',
    published_at: new Date().toISOString(),
    excerpt: "Bella Italia! It's easy to fall in love with this gorgeous country — every inch of it. Florence, Tuscany, Bologna, the Amalfi coast.",
    cover_image_url: 'https://images.unsplash.com/photo-1555992336-03a23c7b20ee?w=800&q=80',
    body_html: '',
    categories: [],
    tags: [],
    status: 'published',
  },
]

export function CuratedExperiences({ posts, agentId }: CuratedExperiencesProps) {
  const serif = 'var(--font-serif)'
  const sans = 'var(--font-sans)'
  const items = posts.length > 0 ? posts.slice(0, 3) : PLACEHOLDER

  return (
    <section style={{ background: '#FFFFFF', padding: '120px 24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: '72px' }}>
          <p
            style={{
              fontFamily: sans,
              fontSize: '9px',
              letterSpacing: '0.38em',
              textTransform: 'uppercase',
              color: '#B5945A',
              marginBottom: '20px',
            }}
          >
            From The Journal
          </p>
          <h2
            style={{
              fontFamily: serif,
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              fontWeight: 300,
              fontStyle: 'italic',
              color: 'var(--charcoal)',
              lineHeight: 1.2,
              marginBottom: '20px',
            }}
          >
            Unique experiences curated just for you
          </h2>
          <div style={{ width: '48px', height: '1px', background: '#B5945A', margin: '0 auto' }} />
        </div>

        {/* 3-col grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '40px',
          }}
          className="experiences-grid"
        >
          {items.map((post) => {
            const href = post.slug === '#'
              ? '#'
              : `/frontend/${agentId}/blog/${post.slug}`

            return (
              <Link
                key={post.id}
                href={href}
                className="img-zoom-parent"
                style={{ textDecoration: 'none', display: 'block' }}
              >
                <article>
                  {post.cover_image_url && (
                    <div
                      style={{
                        position: 'relative',
                        paddingBottom: '66%',
                        overflow: 'hidden',
                        marginBottom: '24px',
                        background: '#e8e4dd',
                      }}
                    >
                      <Image
                        src={post.cover_image_url}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="img-zoom"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  )}

                  <p
                    style={{
                      fontFamily: sans,
                      fontSize: '9px',
                      letterSpacing: '0.3em',
                      textTransform: 'uppercase',
                      color: '#B5945A',
                      marginBottom: '10px',
                    }}
                  >
                    {new Date(post.published_at).toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>

                  <h3
                    style={{
                      fontFamily: serif,
                      fontSize: '22px',
                      fontWeight: 300,
                      color: 'var(--charcoal)',
                      lineHeight: 1.3,
                      marginBottom: '12px',
                    }}
                  >
                    {post.title}
                  </h3>

                  {post.excerpt && (
                    <p
                      style={{
                        fontFamily: sans,
                        fontSize: '14px',
                        color: 'var(--warm-gray)',
                        lineHeight: '1.75',
                        marginBottom: '18px',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {post.excerpt}
                    </p>
                  )}

                  <span
                    style={{
                      display: 'inline-block',
                      fontFamily: sans,
                      fontSize: '9px',
                      letterSpacing: '0.22em',
                      textTransform: 'uppercase',
                      color: '#B5945A',
                      borderBottom: '1px solid #B5945A',
                      paddingBottom: '2px',
                    }}
                  >
                    Read More &#8594;
                  </span>
                </article>
              </Link>
            )
          })}
        </div>

        {/* Discover More CTA */}
        <div style={{ textAlign: 'center', marginTop: '72px' }}>
          <Link
            href={`/frontend/${agentId}/blog`}
            style={{
              display: 'inline-block',
              fontFamily: sans,
              fontSize: '10px',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#FFFFFF',
              background: '#B5945A',
              border: '1px solid #B5945A',
              padding: '16px 44px',
              textDecoration: 'none',
              transition: 'background 0.3s ease, color 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = '#B5945A'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#B5945A'
              e.currentTarget.style.color = '#FFFFFF'
            }}
          >
            Discover More
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .experiences-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}
