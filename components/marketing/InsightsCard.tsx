import Link from 'next/link'
import type { MarketingPost } from '@/types/index'

/** Shared article card for the Insights index, category archives, and homepage teaser. */
export function InsightsCard({ post }: { post: MarketingPost }) {
  const date = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(post.published_at))
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
          <img src={post.cover_image_url} alt="" width={1600} height={1000} loading="lazy" decoding="async" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        )}
      </div>
      <div style={{ padding: '20px 22px 24px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        {post.category?.label && (
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7c3aed' }}>
            {post.category.label}
          </span>
        )}
        <h3 style={{ margin: 0, fontSize: 19, fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.3, color: '#0a0a0a', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {post.title}
        </h3>
        {post.excerpt && (
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: '#71717a', flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{post.excerpt}</p>
        )}
        <span style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
          <time dateTime={post.published_at}>{date}</time>{post.read_minutes ? ` · ${post.read_minutes} min read` : ''}
        </span>
      </div>
    </Link>
  )
}
