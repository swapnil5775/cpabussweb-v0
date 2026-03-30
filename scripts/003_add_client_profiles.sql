-- ============================================================
-- 003: Client profiles (personal info, addresses, secondary email)
-- Run after 002_create_client_tables.sql
-- ============================================================

CREATE TABLE IF NOT EXISTS public.client_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,

  -- Personal
  full_name text,
  phone text,

  -- Business address
  business_address_line1 text,
  business_address_line2 text,
  business_city text,
  business_state text,
  business_zip text,

  -- Personal mailing address (may differ from business)
  personal_address_line1 text,
  personal_address_line2 text,
  personal_city text,
  personal_state text,
  personal_zip text,

  -- Secondary / notification email
  secondary_email text,
  secondary_email_verified boolean DEFAULT false,
  secondary_email_code text,               -- 6-digit OTP
  secondary_email_code_expires_at timestamptz,

  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.client_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own client_profile select" ON public.client_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own client_profile insert" ON public.client_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own client_profile update" ON public.client_profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS client_profiles_user_id_idx ON public.client_profiles(user_id);
