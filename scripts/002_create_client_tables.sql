-- ============================================================
-- 002: Client self-serve tables
-- Run in Supabase SQL editor after 001_create_leads_table.sql
-- ============================================================

-- Business profiles (collected during onboarding wizard)
CREATE TABLE IF NOT EXISTS public.business_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  business_name text,
  business_type text NOT NULL,     -- restaurant | hotel | childcare | realtor | home_based | tutoring | other
  entity_type text NOT NULL,       -- none | sole_prop | llc_single | llc_multi | s_corp | c_corp | partnership
  revenue_range text NOT NULL,     -- under_50k | 50k_100k | 100k_250k | 250k_500k | over_500k
  books_status text NOT NULL,      -- current | behind_1_3 | behind_3_plus | never_done
  selected_plan text,              -- essentials | growth | enterprise
  onboarding_completed_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Subscriptions (managed by Stripe webhook)
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  stripe_customer_id text UNIQUE,
  stripe_subscription_id text UNIQUE,
  plan text,                       -- essentials | growth | enterprise
  status text DEFAULT 'pending',   -- pending | active | past_due | canceled | trialing
  current_period_end timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- One-time service add-ons
CREATE TABLE IF NOT EXISTS public.service_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  service_type text NOT NULL,      -- llc_formation | tax_individual | tax_business | catchup | payroll_setup
  amount_cents integer,
  stripe_checkout_session_id text,
  status text DEFAULT 'pending',   -- pending | paid | in_progress | completed | canceled
  notes text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Client-uploaded documents
CREATE TABLE IF NOT EXISTS public.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  file_name text NOT NULL,
  storage_path text NOT NULL,      -- Supabase Storage path: documents/{user_id}/{filename}
  file_size_bytes integer,
  document_type text DEFAULT 'other', -- bank_statement | tax_doc | receipt | payroll | other
  created_at timestamptz DEFAULT now() NOT NULL
);

-- ── Row Level Security ──────────────────────────────────────
ALTER TABLE public.business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- business_profiles
CREATE POLICY "own profile select" ON public.business_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own profile insert" ON public.business_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own profile update" ON public.business_profiles FOR UPDATE USING (auth.uid() = user_id);

-- subscriptions (read-only for users; writes go through service role via webhook)
CREATE POLICY "own subscription select" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);

-- service_orders
CREATE POLICY "own orders select" ON public.service_orders FOR SELECT USING (auth.uid() = user_id);

-- documents
CREATE POLICY "own documents select" ON public.documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own documents insert" ON public.documents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own documents delete" ON public.documents FOR DELETE USING (auth.uid() = user_id);

-- ── Indexes ──────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS business_profiles_user_id_idx ON public.business_profiles(user_id);
CREATE INDEX IF NOT EXISTS subscriptions_user_id_idx ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS subscriptions_stripe_customer_idx ON public.subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS service_orders_user_id_idx ON public.service_orders(user_id);
CREATE INDEX IF NOT EXISTS documents_user_id_idx ON public.documents(user_id);

-- ── Supabase Storage bucket ───────────────────────────────────
-- Run this separately in the Supabase Storage dashboard OR via:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);
-- CREATE POLICY "Users upload own documents" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);
-- CREATE POLICY "Users read own documents"  ON storage.objects FOR SELECT USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);
-- CREATE POLICY "Users delete own documents" ON storage.objects FOR DELETE USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);
