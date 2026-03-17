/**
 * database.ts
 * TypeScript type definitions that mirror the Supabase PostgreSQL schema.
 * These are used for type-safe queries via the Supabase JS client.
 *
 * Usage:
 *   import type { Database } from '@/types/database'
 *   const supabase = createClient<Database>(url, key)
 */

// ─── Shared primitives ────────────────────────────────────────────────────────

export type SupplierType = 'hotel' | 'cruise' | 'tour' | 'airline' | 'other'

export type VirtuosoPerks = {
  breakfast?:    boolean
  room_upgrade?: boolean
  spa_credit?:   string   // e.g. "$100"
  early_checkin?: boolean
  late_checkout?: boolean
  welcome_amenity?: string
  [key: string]: unknown  // allow additional custom perks
}

// ─── Row types (what Supabase returns) ────────────────────────────────────────

export interface AgentRow {
  id:            string
  full_name:     string
  agency_name:   string
  custom_domain: string | null
  avatar_url:    string | null
  created_at:    string
  updated_at:    string
}

export interface GlobalSupplierRow {
  id:             string
  name:           string
  logo_url:       string | null
  description:    string | null
  supplier_type:  SupplierType | null
  virtuoso_perks: VirtuosoPerks | null
  is_active:      boolean
  created_at:     string
}

export interface AgentSupplierSelectionRow {
  id:          string
  agent_id:    string
  supplier_id: string
  notes:       string | null
  pinned_at:   string
}

export type BlogStatus = 'draft' | 'published'

export interface BlogPostRow {
  id:              string
  agent_id:        string
  title:           string
  slug:            string
  published_at:    string
  excerpt:         string | null
  body_html:       string
  cover_image_url: string | null
  categories:      string[]
  tags:            string[]
  status:          BlogStatus
  created_at:      string
  updated_at:      string
}

// ─── Insert types (what you pass to .insert()) ────────────────────────────────

export type AgentInsert = Omit<AgentRow, 'created_at' | 'updated_at'>

export type GlobalSupplierInsert = Omit<GlobalSupplierRow, 'id' | 'created_at'>

export type AgentSupplierSelectionInsert = Omit<
  AgentSupplierSelectionRow,
  'id' | 'pinned_at'
>

// ─── Update types (partial, for .update()) ────────────────────────────────────

export type AgentUpdate = Partial<
  Omit<AgentRow, 'id' | 'created_at' | 'updated_at'>
>

export type GlobalSupplierUpdate = Partial<
  Omit<GlobalSupplierRow, 'id' | 'created_at'>
>

export type AgentSupplierSelectionUpdate = Partial<
  Pick<AgentSupplierSelectionRow, 'notes'>
>

export type BlogPostInsert = Omit<BlogPostRow, 'id' | 'created_at' | 'updated_at'>

export type BlogPostUpdate = Partial<
  Omit<BlogPostRow, 'id' | 'agent_id' | 'created_at' | 'updated_at'>
>

// ─── Supabase Database type (for createClient<Database>()) ───────────────────

export interface Database {
  public: {
    Tables: {
      agents: {
        Row:    AgentRow
        Insert: AgentInsert
        Update: AgentUpdate
      }
      global_suppliers: {
        Row:    GlobalSupplierRow
        Insert: GlobalSupplierInsert
        Update: GlobalSupplierUpdate
      }
      agent_supplier_selections: {
        Row:    AgentSupplierSelectionRow
        Insert: AgentSupplierSelectionInsert
        Update: AgentSupplierSelectionUpdate
      }
      blog_posts: {
        Row:    BlogPostRow
        Insert: BlogPostInsert
        Update: BlogPostUpdate
      }
    }
    Views:     Record<string, never>
    Functions: Record<string, never>
    Enums:     Record<string, never>
  }
}

// ─── Convenience join types ───────────────────────────────────────────────────

/** A supplier selection with the full supplier record joined */
export interface SelectionWithSupplier extends AgentSupplierSelectionRow {
  global_suppliers: GlobalSupplierRow
}
