import { createServerClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import Link from 'next/link'
import { getBlogPosts } from '@/lib/blog'

export const dynamic = 'force-dynamic'

export default async function AgentBlogPage() {
  const supabaseAuth = await createServerClient()
  const { data: { session } } = await supabaseAuth.auth.getSession()

  const supabaseService = createServiceClient()
  const { data: agentRaw } = await supabaseService
    .from('agents')
    .select('*')
    .eq('email', session?.user.email ?? '')
    .single()
  const agent = agentRaw as { id: string } | null

  // Fetch all posts visible to this agent
  const allPosts = await getBlogPosts(agent?.id)
  
  // Filter to just the ones they authored themselves
  const ownPosts = allPosts.filter(p => p.agent_id === agent?.id && !p.is_broadcast)

  return (
    <div style={{ padding: '32px 40px', maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#111' }}>My Journal</h1>
          <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: '14px' }}>
            Author original content exclusively for your website.
          </p>
        </div>
        <Link href="/agent-portal/blog/new" style={{ padding: '10px 20px', background: '#111', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
          + Write New Post
        </Link>
      </header>

      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #f3f4f6', background: '#f9fafb' }}>
              <th style={th}>Post Title</th>
              <th style={th}>Status</th>
              <th style={th}>Published</th>
            </tr>
          </thead>
          <tbody>
            {!ownPosts.length && (
              <tr><td colSpan={3} style={{ textAlign: 'center', padding: '48px', color: '#6b7280' }}>You haven't authored any original posts yet.</td></tr>
            )}
            {ownPosts.map(post => (
              <tr key={post.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={td}>
                  <Link href={`/agent-portal/blog/${post.id}`} style={{ fontWeight: 600, color: '#111', textDecoration: 'none' }}>
                    {post.title}
                  </Link>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>/{post.slug}</div>
                </td>
                <td style={td}>
                  {post.status === 'published' 
                    ? <span style={chip('#dcfce7', '#166534')}>Published</span>
                    : <span style={chip('#f3f4f6', '#4b5563')}>Draft</span>}
                </td>
                <td style={{ ...td, color: '#6b7280', fontSize: '13px' }}>
                  {new Date(post.published_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const th: React.CSSProperties = { padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }
const td: React.CSSProperties = { padding: '16px', verticalAlign: 'middle' }
const chip = (bg: string, color: string): React.CSSProperties => ({ display: 'inline-flex', padding: '4px 10px', borderRadius: '100px', fontSize: '12px', fontWeight: 500, background: bg, color })
