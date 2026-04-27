import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { checkBlogPostWarnings } from '@/lib/blog-warnings'
import type { BlogPost } from '@/types/index'

const ALL_COLUMNS =
  'id, agent_id, title, slug, published_at, excerpt, body_html, cover_image_url, categories, tags, status, is_broadcast, target_agent_ids, target_demo_slugs, gallery_images, supplier_tags'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const agentId = searchParams.get('agent_id')

  const supabase = createServiceClient()
  let query = supabase
    .from('blog_posts')
    .select(ALL_COLUMNS)
    .order('published_at', { ascending: false })

  if (agentId) {
    query = query.eq('agent_id', agentId)
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const body = await request.json() as Partial<BlogPost>
  const supabase = createServiceClient()

  // Auto-generate slug from title if not provided
  if (!body.slug && body.title) {
    body.slug = body.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 80)
  }

  const { data, error } = await supabase
    .from('blog_posts')
    .insert({
      agent_id:         body.agent_id,
      title:            body.title ?? '',
      slug:             body.slug ?? '',
      published_at:     body.published_at ?? new Date().toISOString(),
      excerpt:          body.excerpt ?? null,
      seo_title:        body.seo_title ?? null,
      seo_description:  body.seo_description ?? null,
      body_html:        body.body_html ?? '',
      cover_image_url:  body.cover_image_url ?? null,
      categories:       body.categories ?? [],
      tags:             body.tags ?? [],
      status:           body.status ?? 'draft',
      is_broadcast:     body.is_broadcast ?? false,
      target_agent_ids: body.target_agent_ids ?? [],
      target_demo_slugs: body.target_demo_slugs ?? [],
      gallery_images:   body.gallery_images ?? [],
      supplier_tags:    body.supplier_tags ?? [],
    } as any)
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  if (body.category_ids?.length) {
    const records = body.category_ids.map(categoryId => ({ post_id: data.id, category_id: categoryId }))
    await supabase.from('blog_post_categories').insert(records)
  }

  const warnings = await checkBlogPostWarnings({
    bodyHtml: data.body_html ?? '',
    agentId: data.agent_id,
    isBroadcast: !!data.is_broadcast,
  })

  return NextResponse.json(
    { ...data, category_ids: body.category_ids ?? [], warnings },
    { status: 201 },
  )
}
