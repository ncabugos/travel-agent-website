import Link from 'next/link'
import type { MarketingPost } from '@/types/index'
import { CHARCOAL, DIVIDER, WARM_GRAY } from './tokens'

/** Shared article tile for the Insights index, category archives, and homepage teaser. */
export function InsightsCard({ post }: { post: MarketingPost }) {
  const date = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(post.published_at))
  return (
    <Link
      href={`/insights/${post.slug}`}
      className="eah-insights-card"
      style={{ display: 'flex', flexDirection: 'column', textDecoration: 'none', color: CHARCOAL }}
    >
      <div style={{ position: 'relative', aspectRatio: '16 / 10', background: DIVIDER, overflow: 'hidden' }}>
        {post.cover_image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.cover_image_url} alt="" width={1600} height={1000} loading="lazy" decoding="async" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        )}
      </div>
      <div style={{ padding: '18px 0 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {post.category?.label && (
          <span style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: WARM_GRAY }}>{post.category.label}</span>
        )}
        <h3 style={{ margin: 0, fontSize: '19px', fontWeight: 400, letterSpacing: '-0.015em', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {post.title}
        </h3>
        <span style={{ fontSize: '13px', color: WARM_GRAY }}>
          <time dateTime={post.published_at}>{date}</time>{post.read_minutes ? ` · ${post.read_minutes} min read` : ''}
        </span>
      </div>
    </Link>
  )
}
