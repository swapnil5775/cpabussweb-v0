-- 005: Referral system + CPA access tokens

CREATE TABLE IF NOT EXISTS public.referral_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  code text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.referral_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  invited_email text NOT NULL,
  status text DEFAULT 'pending',
  referred_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(referrer_id, invited_email)
);

CREATE TABLE IF NOT EXISTS public.referral_credits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  invite_id uuid REFERENCES public.referral_invites(id),
  redeemed boolean DEFAULT false,
  redeemed_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.cpa_access_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  token text NOT NULL UNIQUE,
  label text,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cpa_access_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own referral_code" ON public.referral_codes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own referral_invites" ON public.referral_invites FOR ALL USING (auth.uid() = referrer_id);
CREATE POLICY "own referral_credits" ON public.referral_credits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own cpa_tokens" ON public.cpa_access_tokens FOR ALL USING (auth.uid() = client_user_id);

CREATE INDEX IF NOT EXISTS referral_codes_code_idx ON public.referral_codes(code);
CREATE INDEX IF NOT EXISTS referral_invites_referrer_idx ON public.referral_invites(referrer_id);
CREATE INDEX IF NOT EXISTS referral_invites_email_idx ON public.referral_invites(invited_email);
CREATE INDEX IF NOT EXISTS cpa_tokens_token_idx ON public.cpa_access_tokens(token);
