import { createServiceClient } from './service'
import type { AgentRow } from '@/types/database'

export type AgentRole = 'super_admin' | 'admin' | 'agent'

/**
 * Check if a Supabase Auth user has a specific role.
 * Uses the service client to bypass RLS.
 */
export async function getUserRole(userId: string): Promise<AgentRole | null> {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('agents')
    .select('role')
    .eq('id', userId)
    .single()

  if (error || !data) return null
  return data.role as AgentRole
}

/**
 * Check if a user is a super_admin.
 */
export async function isSuperAdmin(userId: string): Promise<boolean> {
  const role = await getUserRole(userId)
  return role === 'super_admin'
}

/**
 * Get all agents (admin-only, uses service client to bypass RLS).
 */
export async function getAllAgents() {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

/**
 * Get a single agent by ID (admin-only).
 */
export async function getAgentById(agentId: string): Promise<AgentRow | null> {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .eq('id', agentId)
    .single()

  if (error || !data) return null
  return data as AgentRow
}

/**
 * Update an agent's profile (admin-only).
 */
export async function updateAgent(agentId: string, updates: Record<string, unknown>) {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('agents')
    .update(updates)
    .eq('id', agentId)
    .select()
    .single()

  if (error) throw error
  return data
}
