import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { stripe, MODULE_PRICES } from '@/lib/stripe'
import type { ModuleKey } from '@/lib/tier-features'

/**
 * Self-serve module billing (business model v2, docs/business-model-v2.md).
 *
 * A module purchase adds a recurring subscription ITEM to the agent's existing
 * base subscription — one invoice, prorated. agent_modules (migration 053) is
 * the entitlement record; agents.active_modules is the derived cache the
 * template pages read. The Stripe webhook reconciles both if Stripe state
 * changes outside this route.
 *
 * If a module has no Stripe price yet, or the agent has no Stripe subscription
 * (manually provisioned accounts), the portal falls back to the request flow —
 * this route returns 409 with { fallback: 'request' } so the UI can do that.
 *
 * Trialing subscriptions: added items join the trial and first bill on day 31,
 * which is exactly the intended "try modules during your 30 days" behavior.
 */

const MODULE_KEYS = Object.keys(MODULE_PRICES) as ModuleKey[]

interface AgentRow {
  id: string
  tier: string | null
  active_modules: string[] | null
  stripe_subscription_id: string | null
}

async function getAgentForSession(): Promise<AgentRow | null> {
  const supabaseAuth = await createServerClient()
  const { data: { session } } = await supabaseAuth.auth.getSession()
  if (!session) return null

  const supabaseService = createServiceClient()
  const { data } = await supabaseService
    .from('agents')
    .select('id, tier, active_modules, stripe_subscription_id')
    .eq('email', session.user.email ?? '')
    .single()
  return (data as AgentRow | null) ?? null
}

/** Recompute the agents.active_modules cache from agent_modules. */
async function refreshModuleCache(agentId: string): Promise<string[]> {
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('agent_modules')
    .select('module_key')
    .eq('agent_id', agentId)
    .eq('status', 'active')
  const keys = ((data as { module_key: string }[] | null) ?? []).map((r) => r.module_key)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase.from('agents') as any)
    .update({ active_modules: keys })
    .eq('id', agentId)
  return keys
}

/** GET — current module state for the signed-in agent. */
export async function GET() {
  const agent = await getAgentForSession()
  if (!agent) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createServiceClient()
  const { data: rows } = await supabase
    .from('agent_modules')
    .select('module_key, status')
    .eq('agent_id', agent.id)

  const active = new Set(
    ((rows as { module_key: string; status: string }[] | null) ?? [])
      .filter((r) => r.status === 'active')
      .map((r) => r.module_key),
  )

  return NextResponse.json({
    hasSubscription: Boolean(agent.stripe_subscription_id),
    tier: agent.tier,
    modules: MODULE_KEYS.map((key) => ({
      key,
      active: active.has(key),
      // Self-serve only when the Stripe price exists AND the agent has a
      // subscription to attach it to; otherwise the UI uses the request flow.
      selfServe: Boolean(MODULE_PRICES[key] && agent.stripe_subscription_id),
    })),
  })
}

/** POST { module } — activate a module on the agent's subscription. */
export async function POST(request: Request) {
  const agent = await getAgentForSession()
  if (!agent) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { module: moduleKey } = (await request.json()) as { module?: string }
  if (!moduleKey || !MODULE_KEYS.includes(moduleKey as ModuleKey)) {
    return NextResponse.json({ error: 'Invalid module' }, { status: 400 })
  }
  const key = moduleKey as ModuleKey

  const priceId = MODULE_PRICES[key]
  if (!priceId || !agent.stripe_subscription_id) {
    return NextResponse.json(
      { error: 'This module is not self-serve yet.', fallback: 'request' },
      { status: 409 },
    )
  }

  if (agent.active_modules?.includes(key)) {
    return NextResponse.json({ error: 'Module is already active' }, { status: 409 })
  }

  try {
    const item = await stripe.subscriptionItems.create({
      subscription: agent.stripe_subscription_id,
      price: priceId,
      quantity: 1,
      proration_behavior: 'create_prorations',
    })

    const supabase = createServiceClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('agent_modules') as any).upsert(
      {
        agent_id: agent.id,
        module_key: key,
        status: 'active',
        stripe_subscription_item_id: item.id,
        stripe_price_id: priceId,
        activated_at: new Date().toISOString(),
        canceled_at: null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'agent_id,module_key' },
    )
    const activeModules = await refreshModuleCache(agent.id)

    return NextResponse.json({ ok: true, module: key, activeModules })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown Stripe error'
    console.error('module activation failed', err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

/** DELETE { module } — remove a module from the agent's subscription. */
export async function DELETE(request: Request) {
  const agent = await getAgentForSession()
  if (!agent) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { module: moduleKey } = (await request.json()) as { module?: string }
  if (!moduleKey || !MODULE_KEYS.includes(moduleKey as ModuleKey)) {
    return NextResponse.json({ error: 'Invalid module' }, { status: 400 })
  }
  const key = moduleKey as ModuleKey

  const supabase = createServiceClient()
  const { data: rowRaw } = await supabase
    .from('agent_modules')
    .select('id, status, stripe_subscription_item_id')
    .eq('agent_id', agent.id)
    .eq('module_key', key)
    .maybeSingle()
  const row = rowRaw as
    | { id: string; status: string; stripe_subscription_item_id: string | null }
    | null

  if (!row || row.status !== 'active') {
    return NextResponse.json({ error: 'Module is not active' }, { status: 409 })
  }

  try {
    if (row.stripe_subscription_item_id) {
      await stripe.subscriptionItems.del(row.stripe_subscription_item_id, {
        proration_behavior: 'create_prorations',
      })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('agent_modules') as any)
      .update({
        status: 'canceled',
        canceled_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', row.id)
    const activeModules = await refreshModuleCache(agent.id)

    return NextResponse.json({ ok: true, module: key, activeModules })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown Stripe error'
    console.error('module removal failed', err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
