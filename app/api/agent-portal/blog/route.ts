import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { checkBlogPostWarnings } from '@/lib/blog-warnings'
import type { BlogPost } from '@/types/index'

const ALL_COLUMNS =
  'id, agent_id, title, slug, published_at, excerpt, body_html, cover_image_url, categories, tags, status, is_broadcast, target_agent_ids, gallery_images'

/**
 * Resolve the current authenticated agent from the Supabase session cookie.
 * Returns null when there is no session, no email, or no matching agents row.
 */
async function getCurrentAgent() {
  const auth = await createServerClient()
  const { data: { session } } = await auth.auth.getSession()
  if (!session?.user.email) return null

  const admin = createServiceClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (admin.from('agents') as any)
    .select('id, role')
    .eq('email', session.user.email)
    .maybeSingle()

  if (!data) return null
  return data as { id: string; role: string | null }
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 80)
}

/**
 * GET /api/agent-portal/blog
 * List the authenticated agent's own (non-broadcast) posts.
 */
export async function GET() {
  const agent = await getCurrentAgent()
  if (!agent) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = createServiceClient()
  const { data, error } = await admin
    .from('blog_posts')
    .select(ALL_COLUMNS)
    .eq('agent_id', agent.id)
    .eq('is_broadcast', false)
    .order('published_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

/**
 * POST /api/agent-portal/blog
 * Create a new post owned by the authenticated agent.
 *
 * Agents cannot broadcast, cannot spoof agent_id, and cannot target other agents.
 * Those fields are forced to safe values server-side regardless of what the
 * client sends.
 */
export async function POST(request: Request) {
  const agent = await getCurrentAgent()
  if (!agent) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = (await request.json()) as Partial<BlogPost>
  const admin = createServiceClient()

  const title = body.title ?? ''
  const slug = body.slug?.trim() || (title ? slugify(title) : '')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (admin.from('blog_posts') as any)
    .insert({
      agent_id:         agent.id,            // forced — no spoofing
      title,
      slug,
      published_at:     body.published_at ?? new Date().toISOString(),
      excerpt:          body.excerpt ?? null,
      seo_title:        body.seo_title ?? null,
      seo_description:  body.seo_description ?? null,
      body_html:        body.body_html ?? '',
      cover_image_url:  body.cover_image_url ?? null,
      categories:       body.categories ?? [],
      tags:             body.tags ?? [],
      status:           body.status ?? 'draft',
      is_broadcast:     false,               // agents never broadcast
      target_agent_ids: [],                  // forced empty
      gallery_images:   body.gallery_images ?? [],
    })
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  if (body.category_ids?.length) {
    const records = body.category_ids.map((categoryId) => ({
      post_id: data.id,
      category_id: categoryId,
    }))
    await admin.from('blog_post_categories').insert(records)
  }

  const warnings = await checkBlogPostWarnings({
    bodyHtml: data.body_html ?? '',
    agentId: data.agent_id,
    isBroadcast: false, // agents never broadcast
  })

  return NextResponse.json(
    { ...data, category_ids: body.category_ids ?? [], warnings },
    { status: 201 }
  )
}
