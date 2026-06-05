-- =============================================================================
-- Migration: 044_security_rls_hardening.sql
-- Description: Closes three cross-tenant / privilege-escalation gaps found in
--              the 2026-06-04 security audit:
--
--   1. agents UPDATE — the "agents: update own row" RLS policy (migration 001)
--      allows a logged-in advisor to update ANY column on their own row via the
--      public anon key, including role / tier / subscription_status / stripe_*
--      / custom_domain / template. RLS WITH CHECK cannot compare to OLD values,
--      so we enforce the column denylist with a BEFORE UPDATE trigger. The
--      service-role key (admin routes, Stripe webhook, seeders) bypasses it.
--
--   2. admin_notifications — created in migration 020 with RLS deliberately
--      left OFF ("only accessed server-side"). But PostgREST exposes every
--      table to the anon key, so RLS-off = world-readable. Enable RLS; only
--      super_admins (and the service role, which bypasses RLS) may read.
--
--   3. inquiries — contact-form leads (name/email/phone/message). The table was
--      created outside version control; if RLS is off it is world-readable via
--      the anon key. Enabled defensively (guarded by existence checks) with a
--      public INSERT policy so the contact form keeps working, advisor-scoped
--      SELECT, and super_admin read-all.
-- =============================================================================

-- ─── 1. agents: block self-service privilege/billing column changes ──────────
CREATE OR REPLACE FUNCTION public.prevent_agent_privileged_update()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Service role (admin API routes, Stripe webhook, seeders) and direct
  -- privileged DB connections may change anything.
  IF auth.role() = 'service_role'
     OR current_user IN ('postgres', 'supabase_admin', 'service_role') THEN
    RETURN NEW;
  END IF;

  -- Self-service (authenticated advisor) updates may NOT touch these columns.
  IF NEW.role               IS DISTINCT FROM OLD.role
  OR NEW.tier               IS DISTINCT FROM OLD.tier
  OR NEW.subscription_status IS DISTINCT FROM OLD.subscription_status
  OR NEW.stripe_customer_id  IS DISTINCT FROM OLD.stripe_customer_id
  OR NEW.stripe_subscription_id IS DISTINCT FROM OLD.stripe_subscription_id
  OR NEW.custom_domain       IS DISTINCT FROM OLD.custom_domain
  OR NEW.template            IS DISTINCT FROM OLD.template
  OR NEW.auth_user_id        IS DISTINCT FROM OLD.auth_user_id
  THEN
    RAISE EXCEPTION 'Not authorized to modify privileged account fields (role, tier, subscription, stripe, domain, template)';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS agents_prevent_privileged_update ON public.agents;
CREATE TRIGGER agents_prevent_privileged_update
  BEFORE UPDATE ON public.agents
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_agent_privileged_update();

-- ─── 2. admin_notifications: enable RLS, super_admin read only ────────────────
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_notifications: super_admin read" ON public.admin_notifications;
CREATE POLICY "admin_notifications: super_admin read"
  ON public.admin_notifications
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.agents a
      WHERE a.id = auth.uid() AND a.role = 'super_admin'
    )
  );
-- No INSERT/UPDATE/DELETE policies: writes happen only via the service role,
-- which bypasses RLS.

-- ─── 3. inquiries: enable RLS defensively (table is not in version control) ──
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'inquiries'
  ) THEN
    EXECUTE 'ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY';

    -- Public contact form (anon + authenticated) may submit leads.
    EXECUTE 'DROP POLICY IF EXISTS "inquiries: public insert" ON public.inquiries';
    EXECUTE 'CREATE POLICY "inquiries: public insert" ON public.inquiries
               FOR INSERT TO anon, authenticated WITH CHECK (true)';

    -- Super admins read all leads.
    EXECUTE 'DROP POLICY IF EXISTS "inquiries: super_admin read" ON public.inquiries';
    EXECUTE 'CREATE POLICY "inquiries: super_admin read" ON public.inquiries
               FOR SELECT USING (EXISTS (
                 SELECT 1 FROM public.agents a
                 WHERE a.id = auth.uid() AND a.role = ''super_admin''))';

    -- Owning advisor reads their own leads (only if an agent_id column exists).
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'inquiries'
        AND column_name = 'agent_id'
    ) THEN
      EXECUTE 'DROP POLICY IF EXISTS "inquiries: agent read own" ON public.inquiries';
      EXECUTE 'CREATE POLICY "inquiries: agent read own" ON public.inquiries
                 FOR SELECT USING (auth.uid() = agent_id)';
    END IF;
  END IF;
END $$;
