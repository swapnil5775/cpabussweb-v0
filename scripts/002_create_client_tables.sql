-- ============================================================
-- 002: Client self-serve tables (run in Supabase SQL editor)
-- ============================================================

-- Business profiles (collected during onboarding wizard)
CREATE TABLE IF NOT EXISTS public.business_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,

  -- Step 1
  business_name text,
  business_type text,        -- restaurant | hotel | childcare | realtor | home_based | tutoring | retail | other

  -- Step 2
  entity_type text,          -- none | sole_prop | llc_single | llc_multi | s_corp | c_corp | partnership

  -- Step 3
  revenue_range text,        -- under_50k | 50k_100k | 100k_250k | 250k_500k | over_500k

  -- Step 4
  books_status text,         -- current | behind_1_3 | behind_3_plus | never_done
  bookkeeping_platform text, -- quickbooks | xero | freshbooks | wave | spreadsheet | none | other

  -- Step 5 — Team & labor
  worker_types text[],       -- ft_w2 | pt_w2 | contractors_1099 | per_diem | international | just_me
  headcount text,            -- just_me | 2_5 | 6_10 | 11_25 | 26_50 | 50_plus

  -- Step 6 — Payroll & banking
  needs_payroll text,        -- yes_current | yes_new | no | skip
  payroll_platform text,     -- quickbooks_payroll | gusto | adp | paychex | rippling | other | none
  bank_accounts_count text,  -- 1 | 2_3 | 4_plus
  credit_cards_count text,   -- 0 | 1 | 2_3 | 4_plus
  has_ach_vendors text,      -- yes | no | sometimes

  -- Step 7 — Plan
  selected_plan text,        -- essentials | growth | enterprise | free

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
  plan text,
  status text DEFAULT 'pending',  -- pending | active | past_due | canceled | trialing | free
  current_period_end timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- One-time service add-ons
CREATE TABLE IF NOT EXISTS public.service_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  service_type text NOT NULL,
  amount_cents integer,
  stripe_checkout_session_id text,
  status text DEFAULT 'pending',
  notes text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Client-uploaded documents
CREATE TABLE IF NOT EXISTS public.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  file_name text NOT NULL,
  storage_path text NOT NULL,
  file_size_bytes integer,
  document_type text DEFAULT 'other',
  created_at timestamptz DEFAULT now() NOT NULL
);

-- ── Row Level Security ──────────────────────────────────────
ALTER TABLE public.business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own profile select" ON public.business_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own profile insert" ON public.business_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own profile update" ON public.business_profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "own subscription select" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "own orders select" ON public.service_orders FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "own documents select" ON public.documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own documents insert" ON public.documents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own documents delete" ON public.documents FOR DELETE USING (auth.uid() = user_id);

-- ── Indexes ──────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS business_profiles_user_id_idx ON public.business_profiles(user_id);
CREATE INDEX IF NOT EXISTS subscriptions_user_id_idx ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS subscriptions_stripe_customer_idx ON public.subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS service_orders_user_id_idx ON public.service_orders(user_id);
CREATE INDEX IF NOT EXISTS documents_user_id_idx ON public.documents(user_id);

-- ── Storage bucket setup (run these separately in Storage UI or here) ───
-- INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false) ON CONFLICT DO NOTHING;
-- CREATE POLICY "Users upload own documents" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);
-- CREATE POLICY "Users read own documents"   ON storage.objects FOR SELECT USING  (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);
-- CREATE POLICY "Users delete own documents" ON storage.objects FOR DELETE USING  (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);
