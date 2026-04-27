import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { checkBlogPostWarnings } from '@/lib/blog-warnings'
import type { BlogPost } from '@/types/index'

const ALL_COLUMNS =
  'id, agent_id, title, slug, published_at, excerpt, body_html, cover_image_url, categories, tags, status, is_broadcast, target_agent_ids, target_demo_slugs, gallery_images, supplier_tags'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('blog_posts').select(ALL_COLUMNS).eq('id', id).single()
  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(data)
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json() as Partial<BlogPost>
  const supabase = createServiceClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from('blog_posts') as any)
    .update({
      title:            body.title,
      slug:             body.slug,
      published_at:     body.published_at,
      excerpt:          body.excerpt,
      seo_title:        body.seo_title ?? null,
      seo_description:  body.seo_description ?? null,
      body_html:        body.body_html,
      cover_image_url:  body.cover_image_url,
      categories:       body.categories,
      tags:             body.tags,
      status:           body.status,
      is_broadcast:     body.is_broadcast,
      target_agent_ids: body.target_agent_ids,
      target_demo_slugs: body.target_demo_slugs,
      gallery_images:   body.gallery_images,
      supplier_tags:    body.supplier_tags,
      updated_at:       new Date().toISOString(),
    })
    .eq('id', id)
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  if (body.category_ids !== undefined) {
    await supabase.from('blog_post_categories').delete().eq('post_id', id)
    if (body.category_ids.length > 0) {
      const records = body.category_ids.map(categoryId => ({ post_id: id, category_id: categoryId }))
      await supabase.from('blog_post_categories').insert(records)
    }
  }

  const warnings = await checkBlogPostWarnings({
    bodyHtml: data.body_html ?? '',
    agentId: data.agent_id,
    isBroadcast: !!data.is_broadcast,
  })

  return NextResponse.json({ ...data, category_ids: body.category_ids ?? [], warnings })
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createServiceClient()
  const { error } = await supabase.from('blog_posts').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}
