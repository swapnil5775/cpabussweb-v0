-- ============================================================
-- 011: Multi-organization support (single login, many companies)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  country_code text DEFAULT 'US',
  accounting_platform text,
  is_default boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "own organizations select" ON public.organizations;
DROP POLICY IF EXISTS "own organizations insert" ON public.organizations;
DROP POLICY IF EXISTS "own organizations update" ON public.organizations;
CREATE POLICY "own organizations select" ON public.organizations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own organizations insert" ON public.organizations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own organizations update" ON public.organizations FOR UPDATE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS organizations_user_idx ON public.organizations(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS organizations_default_per_user_idx ON public.organizations(user_id) WHERE is_default = true;

-- Create one default organization for every existing user with business data
WITH seeded_users AS (
  SELECT user_id FROM public.business_profiles
  UNION
  SELECT user_id FROM public.subscriptions
  UNION
  SELECT user_id FROM public.client_profiles
  UNION
  SELECT user_id FROM public.documents
  UNION
  SELECT user_id FROM public.support_tickets
  UNION
  SELECT user_id FROM public.qbo_connections
  UNION
  SELECT user_id FROM public.gusto_companies
)
INSERT INTO public.organizations (user_id, name, is_default)
SELECT su.user_id, COALESCE(NULLIF(bp.business_name, ''), 'Primary Organization'), true
FROM seeded_users su
LEFT JOIN public.business_profiles bp ON bp.user_id = su.user_id
ON CONFLICT DO NOTHING;

-- Add organization_id columns
ALTER TABLE public.business_profiles ADD COLUMN IF NOT EXISTS organization_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE;
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS organization_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE;
ALTER TABLE public.client_profiles ADD COLUMN IF NOT EXISTS organization_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE;
ALTER TABLE public.service_orders ADD COLUMN IF NOT EXISTS organization_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE;
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS organization_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE;
ALTER TABLE public.support_tickets ADD COLUMN IF NOT EXISTS organization_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE;
ALTER TABLE public.support_messages ADD COLUMN IF NOT EXISTS organization_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE;
ALTER TABLE public.qbo_connections ADD COLUMN IF NOT EXISTS organization_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE;
ALTER TABLE public.financial_snapshots ADD COLUMN IF NOT EXISTS organization_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE;
ALTER TABLE public.gusto_companies ADD COLUMN IF NOT EXISTS organization_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE;
ALTER TABLE public.cpa_access_tokens ADD COLUMN IF NOT EXISTS organization_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE;

-- Backfill organization_id from user's default organization
UPDATE public.business_profiles bp
SET organization_id = org.id
FROM public.organizations org
WHERE bp.organization_id IS NULL
  AND org.user_id = bp.user_id
  AND org.is_default = true;

UPDATE public.subscriptions s
SET organization_id = org.id
FROM public.organizations org
WHERE s.organization_id IS NULL
  AND org.user_id = s.user_id
  AND org.is_default = true;

UPDATE public.client_profiles cp
SET organization_id = org.id
FROM public.organizations org
WHERE cp.organization_id IS NULL
  AND org.user_id = cp.user_id
  AND org.is_default = true;

UPDATE public.service_orders so
SET organization_id = org.id
FROM public.organizations org
WHERE so.organization_id IS NULL
  AND org.user_id = so.user_id
  AND org.is_default = true;

UPDATE public.documents d
SET organization_id = org.id
FROM public.organizations org
WHERE d.organization_id IS NULL
  AND org.user_id = d.user_id
  AND org.is_default = true;

UPDATE public.support_tickets st
SET organization_id = org.id
FROM public.organizations org
WHERE st.organization_id IS NULL
  AND org.user_id = st.user_id
  AND org.is_default = true;

UPDATE public.support_messages sm
SET organization_id = st.organization_id
FROM public.support_tickets st
WHERE sm.organization_id IS NULL
  AND sm.ticket_id = st.id;

UPDATE public.qbo_connections q
SET organization_id = org.id
FROM public.organizations org
WHERE q.organization_id IS NULL
  AND org.user_id = q.user_id
  AND org.is_default = true;

UPDATE public.financial_snapshots fs
SET organization_id = org.id
FROM public.organizations org
WHERE fs.organization_id IS NULL
  AND org.user_id = fs.user_id
  AND org.is_default = true;

UPDATE public.gusto_companies gc
SET organization_id = org.id
FROM public.organizations org
WHERE gc.organization_id IS NULL
  AND org.user_id = gc.user_id
  AND org.is_default = true;

UPDATE public.cpa_access_tokens cat
SET organization_id = org.id
FROM public.organizations org
WHERE cat.organization_id IS NULL
  AND org.user_id = cat.client_user_id
  AND org.is_default = true;

-- Remove user_id uniqueness so one user can own many organizations
ALTER TABLE public.business_profiles DROP CONSTRAINT IF EXISTS business_profiles_user_id_key;
ALTER TABLE public.subscriptions DROP CONSTRAINT IF EXISTS subscriptions_user_id_key;
ALTER TABLE public.client_profiles DROP CONSTRAINT IF EXISTS client_profiles_user_id_key;
ALTER TABLE public.qbo_connections DROP CONSTRAINT IF EXISTS qbo_connections_user_id_key;
ALTER TABLE public.gusto_companies DROP CONSTRAINT IF EXISTS gusto_companies_user_id_key;
ALTER TABLE public.cpa_access_tokens DROP CONSTRAINT IF EXISTS cpa_access_tokens_client_user_id_key;
ALTER TABLE public.financial_snapshots DROP CONSTRAINT IF EXISTS financial_snapshots_user_id_period_start_period_end_key;

-- New organization-scoped uniqueness
CREATE UNIQUE INDEX IF NOT EXISTS business_profiles_org_unique_idx ON public.business_profiles(organization_id);
CREATE UNIQUE INDEX IF NOT EXISTS subscriptions_org_unique_idx ON public.subscriptions(organization_id);
CREATE UNIQUE INDEX IF NOT EXISTS client_profiles_org_unique_idx ON public.client_profiles(organization_id);
CREATE UNIQUE INDEX IF NOT EXISTS qbo_connections_org_unique_idx ON public.qbo_connections(organization_id);
CREATE UNIQUE INDEX IF NOT EXISTS gusto_companies_org_unique_idx ON public.gusto_companies(organization_id);
CREATE UNIQUE INDEX IF NOT EXISTS cpa_access_tokens_org_unique_idx ON public.cpa_access_tokens(organization_id);
CREATE UNIQUE INDEX IF NOT EXISTS financial_snapshots_org_period_unique_idx ON public.financial_snapshots(organization_id, period_start, period_end);

-- Org-level indexes for faster switching
CREATE INDEX IF NOT EXISTS service_orders_org_idx ON public.service_orders(organization_id);
CREATE INDEX IF NOT EXISTS documents_org_idx ON public.documents(organization_id, tax_year);
CREATE INDEX IF NOT EXISTS support_tickets_org_idx ON public.support_tickets(organization_id);
CREATE INDEX IF NOT EXISTS support_messages_org_idx ON public.support_messages(organization_id);
CREATE INDEX IF NOT EXISTS financial_snapshots_org_idx ON public.financial_snapshots(organization_id, snapshot_date DESC);
