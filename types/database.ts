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

export type AgentRole = 'super_admin' | 'admin' | 'agent'
export type SubscriptionTier = 'starter' | 'growth' | 'custom'
export type SubscriptionStatus = 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid'
export type AgentTemplate = 'frontend' | 't2'

export interface AgentRow {
  id:                    string
  full_name:             string
  first_name:            string
  agency_name:           string
  custom_domain:         string | null
  avatar_url:            string | null
  email:                 string | null
  auth_user_id:          string | null
  role:                  AgentRole | null
  tier:                  SubscriptionTier | null
  stripe_customer_id:    string | null
  stripe_subscription_id: string | null
  subscription_status:   SubscriptionStatus | null
  phone:                 string | null
  tagline:               string | null
  bio:                   string | null
  instagram_url:         string | null
  facebook_url:          string | null
  youtube_url:           string | null
  tiktok_url:            string | null
  website_url:           string | null
  template:              AgentTemplate | null
  created_at:            string
  updated_at:            string
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
  /** Per-post SEO override (Shopify-style). Optional in TS to tolerate pre-migration rows. */
  seo_title?:      string | null
  /** Per-post SEO override. Optional in TS to tolerate pre-migration rows. */
  seo_description?: string | null
  created_at:      string
  updated_at:      string
}

export interface BlogCategoryRow {
  id:              string
  slug:            string
  label:           string
  description:     string | null
  sort_order:      number
  is_active:       boolean
  created_at:      string
}

export interface AgentBlogPreferenceRow {
  agent_id:        string
  category_id:     string
  is_enabled:      boolean
  created_at:      string
}

export interface BlogPostCategoryRow {
  post_id:         string
  category_id:     string
}

export type EditRequestStatus = 'pending' | 'in_progress' | 'completed' | 'rejected'

export interface EditRequestRow {
  id:              string
  agent_id:        string
  subject:         string
  description:     string | null
  attachment_urls: string[]
  status:          EditRequestStatus
  admin_notes:     string | null
  created_at:      string
  updated_at:      string
}

// ─── Insert types (what you pass to .insert()) ────────────────────────────────

export type AgentInsert = Omit<AgentRow, 'created_at' | 'updated_at' | 'role' | 'tier' | 'stripe_customer_id' | 'stripe_subscription_id' | 'subscription_status' | 'phone' | 'tagline' | 'bio' | 'instagram_url' | 'facebook_url' | 'youtube_url' | 'tiktok_url' | 'website_url' | 'template' | 'first_name'> & Partial<Pick<AgentRow, 'role' | 'tier' | 'stripe_customer_id' | 'stripe_subscription_id' | 'subscription_status' | 'phone' | 'tagline' | 'bio' | 'instagram_url' | 'facebook_url' | 'youtube_url' | 'tiktok_url' | 'website_url' | 'template' | 'first_name'>>

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

export type BlogCategoryInsert = Omit<BlogCategoryRow, 'id' | 'created_at'>
export type BlogCategoryUpdate = Partial<Omit<BlogCategoryRow, 'id' | 'created_at'>>

export type AgentBlogPreferenceInsert = Omit<AgentBlogPreferenceRow, 'created_at'>
export type AgentBlogPreferenceUpdate = Partial<Omit<AgentBlogPreferenceRow, 'agent_id' | 'category_id' | 'created_at'>>

export type BlogPostCategoryInsert = BlogPostCategoryRow

export type EditRequestInsert = Omit<EditRequestRow, 'id' | 'created_at' | 'updated_at' | 'admin_notes' | 'status'>
export type EditRequestUpdate = Partial<Omit<EditRequestRow, 'id' | 'created_at' | 'updated_at' | 'agent_id'>>

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
      blog_categories: {
        Row:    BlogCategoryRow
        Insert: BlogCategoryInsert
        Update: BlogCategoryUpdate
      }
      agent_blog_preferences: {
        Row:    AgentBlogPreferenceRow
        Insert: AgentBlogPreferenceInsert
        Update: AgentBlogPreferenceUpdate
      }
      blog_post_categories: {
        Row:    BlogPostCategoryRow
        Insert: BlogPostCategoryInsert
        Update: never
      }
      edit_requests: {
        Row:    EditRequestRow
        Insert: EditRequestInsert
        Update: EditRequestUpdate
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
