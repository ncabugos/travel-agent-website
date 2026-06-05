// app/api/admin/marketing-categories/[id]/route.ts
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createServiceClient } from '@/lib/supabase/service'
import { getCurrentSuperAdmin } from '@/lib/admin-auth'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const adminUser = await getCurrentSuperAdmin()
  if (!adminUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const supabase = createServiceClient()
  const { data, error } = await supabase.from('marketing_categories').select('*').eq('id', id).single()
  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(data)
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const adminUser = await getCurrentSuperAdmin()
  if (!adminUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json()
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('marketing_categories')
    .update({
      label:       body.label,
      slug:        body.slug,
      description: body.description ?? null,
      pillar_key:  body.pillar_key ?? null,
      sort_order:  body.sort_order ?? 0,
      is_active:   body.is_active ?? true,
    })
    .eq('id', id)
    .select('*')
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  revalidatePath('/insights')
  revalidatePath('/insights/category/[slug]', 'page')
  return NextResponse.json(data)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const adminUser = await getCurrentSuperAdmin()
  if (!adminUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const supabase = createServiceClient()
  const { error } = await supabase.from('marketing_categories').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  revalidatePath('/insights')
  return NextResponse.json({ ok: true })
}
