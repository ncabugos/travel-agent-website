import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { checkBlogPostWarnings } from '@/lib/blog-warnings'
import type { BlogPost } from '@/types/index'

const ALL_COLUMNS =
  'id, agent_id, title, slug, published_at, excerpt, body_html, cover_image_url, categories, tags, status, is_broadcast, target_agent_ids, gallery_images'

/** Resolve the current authenticated agent. Null when not signed in. */
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

/**
 * Verify that the post belongs to the given agent.
 * Returns `{ ok: true }` if owned, or a NextResponse error otherwise.
 */
async function assertOwnership(
  postId: string,
  agentId: string
): Promise<{ ok: true } | { ok: false; response: NextResponse }> {
  const admin = createServiceClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (admin.from('blog_posts') as any)
    .select('id, agent_id, is_broadcast')
    .eq('id', postId)
    .maybeSingle()

  if (error || !data) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Not found' }, { status: 404 }),
    }
  }

  // Agents may not touch broadcast posts, even those created for them.
  if (data.is_broadcast) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'Broadcast posts can only be edited by an administrator.' },
        { status: 403 }
      ),
    }
  }

  if (data.agent_id !== agentId) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'You do not own this post.' },
        { status: 403 }
      ),
    }
  }

  return { ok: true }
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const agent = await getCurrentAgent()
  if (!agent) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createServiceClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (admin.from('blog_posts') as any)
    .select(ALL_COLUMNS)
    .eq('id', id)
    .eq('agent_id', agent.id)
    .maybeSingle()

  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(data)
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const agent = await getCurrentAgent()
  if (!agent) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const check = await assertOwnership(id, agent.id)
  if (!check.ok) return check.response

  const body = (await request.json()) as Partial<BlogPost>
  const admin = createServiceClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (admin.from('blog_posts') as any)
    .update({
      title:           body.title,
      slug:            body.slug,
      published_at:    body.published_at,
      excerpt:         body.excerpt,
      seo_title:       body.seo_title ?? null,
      seo_description: body.seo_description ?? null,
      body_html:       body.body_html,
      cover_image_url: body.cover_image_url,
      categories:      body.categories,
      tags:            body.tags,
      status:          body.status,
      // is_broadcast and target_agent_ids are intentionally not updatable here
      gallery_images:  body.gallery_images,
      updated_at:      new Date().toISOString(),
    })
    .eq('id', id)
    .eq('agent_id', agent.id) // belt-and-braces scoping
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  if (body.category_ids !== undefined) {
    await admin.from('blog_post_categories').delete().eq('post_id', id)
    if (body.category_ids.length > 0) {
      const records = body.category_ids.map((categoryId) => ({
        post_id: id,
        category_id: categoryId,
      }))
      await admin.from('blog_post_categories').insert(records)
    }
  }

  const warnings = await checkBlogPostWarnings({
    bodyHtml: data.body_html ?? '',
    agentId: data.agent_id,
    isBroadcast: false, // agents never broadcast
  })

  return NextResponse.json({ ...data, category_ids: body.category_ids ?? [], warnings })
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const agent = await getCurrentAgent()
  if (!agent) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const check = await assertOwnership(id, agent.id)
  if (!check.ok) return check.response

  const admin = createServiceClient()
  const { error } = await admin
    .from('blog_posts')
    .delete()
    .eq('id', id)
    .eq('agent_id', agent.id) // defence in depth

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}
