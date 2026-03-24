import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import type { BlogPost } from '@/types/index'

const ALL_COLUMNS =
  'id, agent_id, title, slug, published_at, excerpt, body_html, cover_image_url, categories, tags, status, is_broadcast, target_agent_ids, gallery_images'

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
      body_html:        body.body_html,
      cover_image_url:  body.cover_image_url,
      categories:       body.categories,
      tags:             body.tags,
      status:           body.status,
      is_broadcast:     body.is_broadcast,
      target_agent_ids: body.target_agent_ids,
      gallery_images:   body.gallery_images,
      updated_at:       new Date().toISOString(),
    })
    .eq('id', id)
    .select(ALL_COLUMNS)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createServiceClient()
  const { error } = await supabase.from('blog_posts').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}
