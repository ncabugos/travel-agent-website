import Link from 'next/link'
import { getAdminPosts } from '@/lib/marketing-blog'
import { InsightsDeleteButton } from '@/components/admin/InsightsDeleteButton'

export const dynamic = 'force-dynamic'

export default async function AdminInsightsPage() {
  const posts = await getAdminPosts()
  const published = posts.filter(p => p.status === 'published').length
  const drafts = posts.filter(p => p.status === 'draft').length

  return (
    <div style={{ padding: '24px 32px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '20px', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: '#1a1a1a' }}>Insights — Company Blog</h1>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6b7280' }}>
            Articles for eliteadvisorhub.com/insights. Separate from advisor journals. {published} published · {drafts} draft{drafts !== 1 ? 's' : ''}.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link href="/admin/insights/categories" style={{ fontSize: 13, color: '#374151', textDecoration: 'none', padding: '9px 16px', border: '1px solid #d1d5db', borderRadius: 8 }}>
            Manage pillars
          </Link>
          <Link href="/admin/insights/new" style={{ display: 'inline-block', padding: '9px 20px', background: '#1a1a1a', color: '#fff', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
            + New post
          </Link>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #f3f4f6', background: '#f9fafb' }}>
              <th style={th}>Title</th>
              <th style={th}>Pillar</th>
              <th style={th}>Status</th>
              <th style={th}>Published</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: 48, color: '#9ca3af', fontSize: 14 }}>
                No Insights posts yet. <Link href="/admin/insights/new" style={{ color: '#B49A5A' }}>Write the first one →</Link>
              </td></tr>
            )}
            {posts.map(post => (
              <tr key={post.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={td}>
                  <Link href={`/admin/insights/${post.id}`} style={{ textDecoration: 'none', color: '#1a1a1a', fontWeight: 500, fontSize: 14 }}>
                    {post.title || <em style={{ color: '#9ca3af' }}>Untitled</em>}
                  </Link>
                  {post.featured && <span style={{ ...chip('#fef3c7', '#92400e'), marginLeft: 8 }}>★ Featured</span>}
                </td>
                <td style={{ ...td, fontSize: 13, color: '#374151' }}>{post.category?.label ?? <span style={{ color: '#9ca3af' }}>—</span>}</td>
                <td style={td}>
                  <span style={chip(post.status === 'published' ? '#d1fae5' : '#f3f4f6', post.status === 'published' ? '#065f46' : '#374151')}>
                    {post.status === 'published' ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td style={{ ...td, color: '#6b7280', fontSize: 13, whiteSpace: 'nowrap' }}>
                  {new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td style={td}>
                  <Link href={`/admin/insights/${post.id}`} style={{ fontSize: 13, color: '#B49A5A', textDecoration: 'none', marginRight: 12 }}>Edit</Link>
                  <InsightsDeleteButton id={post.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const th: React.CSSProperties = { padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }
const td: React.CSSProperties = { padding: '12px 16px', verticalAlign: 'middle' }
const chip = (bg: string, color: string): React.CSSProperties => ({ display: 'inline-flex', alignItems: 'center', padding: '3px 8px', borderRadius: 100, fontSize: 12, fontWeight: 500, background: bg, color })
