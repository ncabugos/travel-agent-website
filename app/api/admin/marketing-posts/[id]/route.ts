// app/api/admin/marketing-posts/[id]/route.ts
import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import type { MarketingPost } from '@/types/index'
import { revalidateInsights } from '../route'

const SELECT = '*, category:marketing_categories(*)'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createServiceClient()
  const { data, error } = await supabase.from('marketing_posts').select(SELECT).eq('id', id).single()
  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(data)
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = (await request.json()) as Partial<MarketingPost>
  const supabase = createServiceClient()

  // Capture the previous slug so a slug change revalidates the old path too.
  const { data: prev } = await supabase
    .from('marketing_posts')
    .select('slug')
    .eq('id', id)
    .maybeSingle()

  const { data, error } = await supabase
    .from('marketing_posts')
    .update({
      title:              body.title ?? '',
      ...(body.slug ? { slug: body.slug.trim() } : {}),
      status:             body.status ?? 'draft',
      excerpt:            body.excerpt ?? null,
      body_html:          body.body_html ?? '',
      cover_image_url:    body.cover_image_url ?? null,
      category_id:        body.category_id ?? null,
      author_name:        body.author_name?.trim() || 'Nick Cabugos',
      author_credentials: body.author_credentials?.trim() || 'Founder of Elite Advisor Hub',
      seo_title:          body.seo_title ?? null,
      seo_description:    body.seo_description ?? null,
      og_image_url:       body.og_image_url ?? null,
      faq:                Array.isArray(body.faq) ? body.faq : [],
      read_minutes:       body.read_minutes ?? null,
      featured:           body.featured ?? false,
      ...(body.published_at ? { published_at: body.published_at } : {}),
    } as never)
    .eq('id', id)
    .select(SELECT)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  revalidateInsights(data.slug)
  if (prev?.slug && prev.slug !== data.slug) revalidateInsights(prev.slug)
  return NextResponse.json(data)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createServiceClient()
  const { data: prev } = await supabase
    .from('marketing_posts')
    .select('slug')
    .eq('id', id)
    .maybeSingle()
  const { error } = await supabase.from('marketing_posts').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  revalidateInsights(prev?.slug)
  return NextResponse.json({ ok: true })
}
