import Link from 'next/link'
import type { MarketingPost } from '@/types/index'

/** Shared article card for the Insights index, category archives, and homepage teaser. */
export function InsightsCard({ post }: { post: MarketingPost }) {
  const date = new Date(post.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  return (
    <Link
      href={`/insights/${post.slug}`}
      className="eah-insights-card"
      style={{
        display: 'flex', flexDirection: 'column',
        background: '#fff', borderRadius: 16, overflow: 'hidden',
        border: '1px solid #ececec', textDecoration: 'none', color: '#0a0a0a',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
      }}
    >
      <div style={{ position: 'relative', aspectRatio: '16 / 10', background: '#f4f4f4' }}>
        {post.cover_image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.cover_image_url} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        )}
      </div>
      <div style={{ padding: '20px 22px 24px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        {post.category?.label && (
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7c3aed' }}>
            {post.category.label}
          </span>
        )}
        <h3 style={{ margin: 0, fontSize: 19, fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.3, color: '#0a0a0a' }}>
          {post.title}
        </h3>
        {post.excerpt && (
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: '#71717a', flex: 1 }}>{post.excerpt}</p>
        )}
        <span style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>
          {date}{post.read_minutes ? ` · ${post.read_minutes} min read` : ''}
        </span>
      </div>
    </Link>
  )
}
