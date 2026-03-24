import { getAdminPosts } from '@/lib/blog'
import Link from 'next/link'
import type { BlogPost } from '@/types/index'

export const dynamic = 'force-dynamic'

export default async function AdminBlogListPage() {
  const posts = await getAdminPosts()

  const published = posts.filter(p => p.status === 'published' && !p.is_broadcast).length
  const drafts    = posts.filter(p => p.status === 'draft').length
  const broadcast = posts.filter(p => p.is_broadcast).length

  return (
    <div style={{ padding: '24px 32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: '#1a1a1a' }}>Journal Posts</h1>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6b7280' }}>
            {published} published · {drafts} draft{drafts !== 1 ? 's' : ''} · {broadcast} broadcast
          </p>
        </div>
        <Link href="/admin/blog/new" style={{ display: 'inline-block', padding: '9px 20px', background: '#1a1a1a', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>
          + New post
        </Link>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: '10px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #f3f4f6', background: '#f9fafb' }}>
              <th style={th}>Title</th>
              <th style={th}>Status</th>
              <th style={th}>Target</th>
              <th style={th}>Published</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '48px', color: '#9ca3af', fontSize: '14px' }}>
                  No posts yet. <Link href="/admin/blog/new" style={{ color: '#d97706' }}>Create your first post →</Link>
                </td>
              </tr>
            )}
            {posts.map((post: BlogPost) => (
              <PostRow key={post.id} post={post} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function PostRow({ post }: { post: BlogPost }) {
  const date = new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  return (
    <tr style={{ borderBottom: '1px solid #f3f4f6' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#f9fafb' }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#fff' }}
    >
      <td style={td}>
        <Link href={`/admin/blog/${post.id}`} style={{ textDecoration: 'none', color: '#1a1a1a', fontWeight: 500, fontSize: '14px' }}>
          {post.title || <em style={{ color: '#9ca3af' }}>Untitled</em>}
        </Link>
        {post.excerpt && <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#9ca3af', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', maxWidth: '380px' }}>{post.excerpt}</p>}
      </td>
      <td style={td}>
        <StatusBadge status={post.status} />
      </td>
      <td style={td}>
        {post.is_broadcast
          ? <span style={chip('#fef3c7', '#92400e')}>📡 {post.target_agent_ids.length ? `${post.target_agent_ids.length} agents` : 'All agents'}</span>
          : <span style={chip('#f3f4f6', '#374151')}>Single</span>
        }
      </td>
      <td style={{ ...td, color: '#6b7280', fontSize: '13px', whiteSpace: 'nowrap' }}>{date}</td>
      <td style={td}>
        <Link href={`/admin/blog/${post.id}`} style={{ fontSize: '13px', color: '#d97706', textDecoration: 'none', marginRight: '12px' }}>Edit</Link>
        <DeleteButton id={post.id} />
      </td>
    </tr>
  )
}

function StatusBadge({ status }: { status: string }) {
  const isPublished = status === 'published'
  return (
    <span style={chip(isPublished ? '#d1fae5' : '#f3f4f6', isPublished ? '#065f46' : '#374151')}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isPublished ? '#10b981' : '#9ca3af', display: 'inline-block', marginRight: '5px' }} />
      {isPublished ? 'Published' : 'Draft'}
    </span>
  )
}

function DeleteButton({ id }: { id: string }) {
  return (
    <button
      onClick={async () => {
        if (!confirm('Delete this post?')) return
        await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' })
        window.location.reload()
      }}
      style={{ fontSize: '13px', color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
    >
      Delete
    </button>
  )
}

const th: React.CSSProperties = { padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }
const td: React.CSSProperties = { padding: '12px 16px', verticalAlign: 'middle' }
const chip = (bg: string, color: string): React.CSSProperties => ({ display: 'inline-flex', alignItems: 'center', padding: '3px 8px', borderRadius: '100px', fontSize: '12px', fontWeight: 500, background: bg, color })
