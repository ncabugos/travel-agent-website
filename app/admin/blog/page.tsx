'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import type { BlogPost } from '@/types/index'

interface AgentOption {
  id: string
  agency_name: string | null
  full_name: string | null
}

// useSearchParams() bails out of static generation unless wrapped in Suspense.
// Default export below provides the boundary; the inner component holds the
// actual hook + body so prerendering works without bailing the whole page.
export default function AdminBlogListPage() {
  return (
    <Suspense fallback={<div style={{ padding: '24px 32px', color: '#9ca3af', fontSize: 14 }}>Loading…</div>}>
      <AdminBlogList />
    </Suspense>
  )
}

function AdminBlogList() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedAgentId = searchParams.get('agent_id') ?? ''

  const [posts, setPosts] = useState<BlogPost[]>([])
  const [agents, setAgents] = useState<AgentOption[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch agents once (small set, platform-wide).
  useEffect(() => {
    fetch('/api/admin/agents?fields=minimal')
      .then((r) => r.json())
      .then((data: AgentOption[] | { agents?: AgentOption[] }) => {
        const list = Array.isArray(data) ? data : (data.agents ?? [])
        setAgents(list)
      })
      .catch(() => setAgents([]))
  }, [])

  // Refetch posts whenever the selected agent changes.
  useEffect(() => {
    setLoading(true)
    const qs = selectedAgentId ? `?agent_id=${encodeURIComponent(selectedAgentId)}` : ''
    fetch(`/api/admin/posts${qs}`)
      .then((r) => r.json())
      .then((data) => {
        setPosts(data.posts ?? data ?? [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [selectedAgentId])

  const agentLookup = useMemo(() => {
    const m = new Map<string, AgentOption>()
    agents.forEach((a) => m.set(a.id, a))
    return m
  }, [agents])

  const selectedAgent = selectedAgentId ? agentLookup.get(selectedAgentId) : null

  const changeAgent = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set('agent_id', value)
    else params.delete('agent_id')
    router.replace(`/admin/blog${params.toString() ? '?' + params.toString() : ''}`)
  }

  const newPostHref = selectedAgentId
    ? `/admin/blog/new?agent_id=${encodeURIComponent(selectedAgentId)}`
    : '/admin/blog/new'

  const published = posts.filter((p) => p.status === 'published' && !p.is_broadcast).length
  const drafts = posts.filter((p) => p.status === 'draft').length
  const broadcast = posts.filter((p) => p.is_broadcast).length

  return (
    <div style={{ padding: '24px 32px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: '20px',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: '#1a1a1a' }}>
            {selectedAgent
              ? `${selectedAgent.agency_name ?? 'Unknown'} — Journal`
              : 'Journal Posts'}
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6b7280' }}>
            {loading
              ? 'Loading…'
              : `${published} published · ${drafts} draft${drafts !== 1 ? 's' : ''} · ${broadcast} broadcast`}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13,
              color: '#374151',
            }}
          >
            <span style={{ fontWeight: 500 }}>Agency</span>
            <select
              value={selectedAgentId}
              onChange={(e) => changeAgent(e.target.value)}
              style={{
                padding: '8px 10px',
                border: '1px solid #e5e7eb',
                borderRadius: 8,
                fontSize: 13,
                background: '#fff',
                color: '#111',
                minWidth: 220,
                cursor: 'pointer',
              }}
            >
              <option value="">All agencies</option>
              {agents.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.agency_name ?? '—'}{a.full_name ? ` — ${a.full_name}` : ''}
                </option>
              ))}
            </select>
          </label>

          <Link
            href={newPostHref}
            style={{
              display: 'inline-block',
              padding: '9px 20px',
              background: '#1a1a1a',
              color: '#fff',
              borderRadius: 8,
              textDecoration: 'none',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            + New post
          </Link>
        </div>
      </div>

      {/* Empty-state hint when no filter selected and there are many mixed posts */}
      {!selectedAgentId && posts.length > 0 && (
        <p
          style={{
            margin: '0 0 16px',
            fontSize: 12,
            color: '#9a6a00',
            background: '#fefce8',
            border: '1px solid #fde68a',
            borderRadius: 6,
            padding: '8px 12px',
          }}
        >
          Viewing <strong>all agencies</strong>. Use the dropdown above to scope the list to a single
          client's journal — or open any agent's detail page and click "Manage Blog".
        </p>
      )}

      {/* Table */}
      <div
        style={{
          background: '#fff',
          borderRadius: 10,
          border: '1px solid #e5e7eb',
          overflow: 'hidden',
        }}
      >
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
            {loading && (
              <tr>
                <td
                  colSpan={selectedAgentId ? 5 : 6}
                  style={{ textAlign: 'center', padding: 48, color: '#9ca3af', fontSize: 14 }}
                >
                  Loading posts…
                </td>
              </tr>
            )}
            {!loading && posts.length === 0 && (
              <tr>
                <td
                  colSpan={selectedAgentId ? 5 : 6}
                  style={{ textAlign: 'center', padding: 48, color: '#9ca3af', fontSize: 14 }}
                >
                  {selectedAgent
                    ? `No posts yet for ${selectedAgent.agency_name ?? 'this agency'}. `
                    : 'No posts yet. '}
                  <Link href={newPostHref} style={{ color: '#d97706' }}>
                    Create the first post →
                  </Link>
                </td>
              </tr>
            )}
            {!loading &&
              posts.map((post: BlogPost) => (
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
    </div>
  )
}

function PostRow({
  post,
  agency,
  showAgencyCol,
  onDelete,
}: {
  post: BlogPost
  agency: string | null
  showAgencyCol: boolean
  onDelete: (id: string) => void
}) {
  const date = new Date(post.published_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
  return (
    <tr
      style={{ borderBottom: '1px solid #f3f4f6' }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLElement).style.background = '#f9fafb'
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLElement).style.background = '#fff'
      }}
    >
      <td style={td}>
        <Link
          href={`/admin/blog/${post.id}`}
          style={{ textDecoration: 'none', color: '#1a1a1a', fontWeight: 500, fontSize: 14 }}
        >
          {post.title || <em style={{ color: '#9ca3af' }}>Untitled</em>}
        </Link>
        {post.excerpt && (
          <p
            style={{
              margin: '2px 0 0',
              fontSize: 12,
              color: '#9ca3af',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              maxWidth: 380,
            }}
          >
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
        <StatusBadge status={post.status} />
      </td>
      <td style={td}>
        {post.is_broadcast ? (
          <span style={chip('#fef3c7', '#92400e')}>
            📡 {post.target_agent_ids.length ? `${post.target_agent_ids.length} agents` : 'All agents'}
          </span>
        ) : (
          <span style={chip('#f3f4f6', '#374151')}>Single</span>
        )}
      </td>
      <td style={{ ...td, color: '#6b7280', fontSize: 13, whiteSpace: 'nowrap' }}>{date}</td>
      <td style={td}>
        <Link
          href={`/admin/blog/${post.id}`}
          style={{ fontSize: 13, color: '#d97706', textDecoration: 'none', marginRight: 12 }}
        >
          Edit
        </Link>
        <DeleteButton id={post.id} onDelete={onDelete} />
      </td>
    </tr>
  )
}

function StatusBadge({ status }: { status: string }) {
  const isPublished = status === 'published'
  return (
    <span style={chip(isPublished ? '#d1fae5' : '#f3f4f6', isPublished ? '#065f46' : '#374151')}>
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: isPublished ? '#10b981' : '#9ca3af',
          display: 'inline-block',
          marginRight: 5,
        }}
      />
      {isPublished ? 'Published' : 'Draft'}
    </span>
  )
}

function DeleteButton({ id, onDelete }: { id: string; onDelete: (id: string) => void }) {
  return (
    <button
      onClick={async () => {
        if (!confirm('Delete this post?')) return
        await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' })
        onDelete(id)
      }}
      style={{
        fontSize: 13,
        color: '#dc2626',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
      }}
    >
      Delete
    </button>
  )
}

const th: React.CSSProperties = {
  padding: '10px 16px',
  textAlign: 'left',
  fontSize: 11,
  fontWeight: 600,
  color: '#6b7280',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
}
const td: React.CSSProperties = { padding: '12px 16px', verticalAlign: 'middle' }
const chip = (bg: string, color: string): React.CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '3px 8px',
  borderRadius: 100,
  fontSize: 12,
  fontWeight: 500,
  background: bg,
  color,
})
