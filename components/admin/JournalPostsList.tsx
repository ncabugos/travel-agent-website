'use client'
import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { BlogPost } from '@/types/index'
import { buttonStyles, inputStyles } from '@/components/dashboard/FormField'

export interface AgentOption {
  id: string
  agency_name: string | null
  full_name: string | null
}

interface Props {
  initialPosts: BlogPost[]
  agents: AgentOption[]
  selectedAgentId: string
}

export function JournalPostsList({ initialPosts, agents, selectedAgentId }: Props) {
  const router = useRouter()
  const [posts, setPosts] = useState(initialPosts)

  const agentLookup = useMemo(() => {
    const m = new Map<string, AgentOption>()
    agents.forEach((a) => m.set(a.id, a))
    return m
  }, [agents])

  const selectedAgent = selectedAgentId ? agentLookup.get(selectedAgentId) : null

  const changeAgent = (value: string) => {
    router.replace(value ? `/admin/blog?agent_id=${encodeURIComponent(value)}` : '/admin/blog')
  }

  const newPostHref = selectedAgentId
    ? `/admin/blog/new?agent_id=${encodeURIComponent(selectedAgentId)}`
    : '/admin/blog/new'

  return (
    <>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'flex-end', marginBottom: 16, flexWrap: 'wrap' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#374151' }}>
          <span style={{ fontWeight: 500 }}>Agency</span>
          <select
            value={selectedAgentId}
            onChange={(e) => changeAgent(e.target.value)}
            style={{ ...inputStyles, width: 'auto', minWidth: 220, cursor: 'pointer' }}
          >
            <option value="">All agencies</option>
            {agents.map((a) => (
              <option key={a.id} value={a.id}>
                {a.agency_name ?? '—'}{a.full_name ? ` · ${a.full_name}` : ''}
              </option>
            ))}
          </select>
        </label>
        <Link href={newPostHref} style={{ ...buttonStyles.primary, textDecoration: 'none' }}>
          + New post
        </Link>
      </div>

      <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #f3f4f6', background: '#f9fafb' }}>
              <th style={th}>Title</th>
              {!selectedAgentId && <th style={th}>Agency</th>}
              <th style={th}>Status</th>
              <th style={th}>Target</th>
              <th style={th}>Published</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 && (
              <tr>
                <td colSpan={selectedAgentId ? 5 : 6} style={{ textAlign: 'center', padding: 48, color: '#9ca3af', fontSize: 14 }}>
                  {selectedAgent ? `No posts yet for ${selectedAgent.agency_name ?? 'this agency'}. ` : 'No posts yet. '}
                  <Link href={newPostHref} style={{ color: '#7c3aed' }}>Create the first post →</Link>
                </td>
              </tr>
            )}
            {posts.map((post) => (
              <PostRow
                key={post.id}
                post={post}
                agency={agentLookup.get(post.agent_id ?? '')?.agency_name ?? null}
                showAgencyCol={!selectedAgentId}
                onDelete={(id) => setPosts((prev) => prev.filter((p) => p.id !== id))}
              />
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

function PostRow({ post, agency, showAgencyCol, onDelete }: {
  post: BlogPost
  agency: string | null
  showAgencyCol: boolean
  onDelete: (id: string) => void
}) {
  const date = new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  return (
    <tr
      style={{ borderBottom: '1px solid #f3f4f6' }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#f9fafb' }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#fff' }}
    >
      <td style={td}>
        <Link href={`/admin/blog/${post.id}`} style={{ textDecoration: 'none', color: '#111', fontWeight: 500, fontSize: 14 }}>
          {post.title || <em style={{ color: '#9ca3af' }}>Untitled</em>}
        </Link>
        {post.excerpt && (
          <p style={{ margin: '2px 0 0', fontSize: 12, color: '#9ca3af', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', maxWidth: 380 }}>
            {post.excerpt}
          </p>
        )}
      </td>
      {showAgencyCol && (
        <td style={{ ...td, fontSize: 13, color: '#374151' }}>
          {agency ?? <span style={{ color: '#9ca3af' }}>—</span>}
        </td>
      )}
      <td style={td}>
        <span style={chip(post.status === 'published' ? '#d1fae5' : '#f3f4f6', post.status === 'published' ? '#065f46' : '#374151')}>
          {post.status === 'published' ? 'Published' : 'Draft'}
        </span>
      </td>
      <td style={td}>
        {post.is_broadcast ? (
          <span style={chip('#fef3c7', '#92400e')}>
            Broadcast · {post.target_agent_ids?.length ? `${post.target_agent_ids.length} agents` : 'All agents'}
          </span>
        ) : (
          <span style={chip('#f3f4f6', '#374151')}>Single</span>
        )}
      </td>
      <td style={{ ...td, color: '#6b7280', fontSize: 13, whiteSpace: 'nowrap' }}>{date}</td>
      <td style={td}>
        <Link href={`/admin/blog/${post.id}`} style={{ fontSize: 13, color: '#7c3aed', textDecoration: 'none', marginRight: 12 }}>
          Edit
        </Link>
        <button
          onClick={async () => {
            if (!confirm('Delete this post?')) return
            await fetch(`/api/admin/posts/${post.id}`, { method: 'DELETE' })
            onDelete(post.id)
          }}
          style={{ fontSize: 13, color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          Delete
        </button>
      </td>
    </tr>
  )
}

const th: React.CSSProperties = { padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }
const td: React.CSSProperties = { padding: '12px 16px', verticalAlign: 'middle' }
const chip = (bg: string, color: string): React.CSSProperties => ({
  display: 'inline-flex', alignItems: 'center', padding: '3px 8px', borderRadius: 100, fontSize: 12, fontWeight: 500, background: bg, color,
})
