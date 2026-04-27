-- =============================================================================
-- Migration: 019_platform_roles.sql
-- Description: Adds role-based access, subscription fields, social media,
--              and profile fields to the agents table for the Lux Travel platform.
-- =============================================================================

-- ─── Role & Access ─────────────────────────────────────────────────────────────
ALTER TABLE public.agents ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'agent'
  CHECK (role IN ('super_admin', 'admin', 'agent'));

-- ─── Subscription / Billing ────────────────────────────────────────────────────
ALTER TABLE public.agents ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'starter'
  CHECK (tier IN ('starter', 'growth', 'custom'));

ALTER TABLE public.agents ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;
ALTER TABLE public.agents ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;

ALTER TABLE public.agents ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'trialing'
  CHECK (subscription_status IN ('trialing', 'active', 'past_due', 'canceled', 'unpaid'));

-- ─── Profile & Contact ────────────────────────────────────────────────────────
ALTER TABLE public.agents ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.agents ADD COLUMN IF NOT EXISTS tagline TEXT;
ALTER TABLE public.agents ADD COLUMN IF NOT EXISTS bio TEXT;

-- ─── Social Media ──────────────────────────────────────────────────────────────
ALTER TABLE public.agents ADD COLUMN IF NOT EXISTS instagram_url TEXT;
ALTER TABLE public.agents ADD COLUMN IF NOT EXISTS facebook_url TEXT;
ALTER TABLE public.agents ADD COLUMN IF NOT EXISTS youtube_url TEXT;
ALTER TABLE public.agents ADD COLUMN IF NOT EXISTS tiktok_url TEXT;
ALTER TABLE public.agents ADD COLUMN IF NOT EXISTS website_url TEXT;

-- ─── Template Selection ────────────────────────────────────────────────────────
ALTER TABLE public.agents ADD COLUMN IF NOT EXISTS template TEXT DEFAULT 'frontend'
  CHECK (template IN ('frontend', 't2'));

-- ─── RLS: Allow super_admin to read all agents ─────────────────────────────────
CREATE POLICY "agents: admin read all"
  ON public.agents
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.agents a
      WHERE a.id = auth.uid() AND a.role = 'super_admin'
    )
  );

-- Allow super_admin to update any agent
CREATE POLICY "agents: admin update all"
  ON public.agents
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.agents a
      WHERE a.id = auth.uid() AND a.role = 'super_admin'
    )
  );

-- ─── Update handle_new_user to include new defaults ────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public AS $$
BEGIN
  INSERT INTO public.agents (id, full_name, agency_name, email, role)
  VALUES (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name',   'New Agent'),
    coalesce(new.raw_user_meta_data->>'agency_name', 'My Agency'),
    new.email,
    coalesce(new.raw_user_meta_data->>'role',        'agent')
  );
  RETURN new;
END;
$$;
