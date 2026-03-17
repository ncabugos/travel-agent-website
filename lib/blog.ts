/**
 * lib/blog.ts
 * Blog data layer — queries Supabase blog_posts table.
 */
import type { BlogPost } from '@/types/index'
import { createClient } from '@/lib/supabase/server'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const hasSupabase = () =>
  !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

// ─── Data functions ───────────────────────────────────────────────────────────

export async function getBlogPosts(agentId?: string): Promise<BlogPost[]> {
  if (!hasSupabase()) return []
  const supabase = await createClient()

  let query = supabase
    .from('blog_posts')
    .select('id, agent_id, title, slug, published_at, excerpt, body_html, cover_image_url, categories, tags, status')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (agentId) {
    query = query.eq('agent_id', agentId)
  }

  const { data, error } = await query

  if (error) {
    console.error('[getBlogPosts]', error.message)
    return []
  }

  return (data ?? []) as BlogPost[]
}

export async function getBlogPost(
  slug: string,
  agentId?: string
): Promise<BlogPost | null> {
  if (!hasSupabase()) return null
  const supabase = await createClient()

  let query = supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')

  if (agentId) {
    query = query.eq('agent_id', agentId)
  }

  const { data, error } = await query.limit(1).single()

  if (error || !data) {
    return null
  }

  return data as BlogPost
}
