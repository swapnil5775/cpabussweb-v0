CREATE TABLE IF NOT EXISTS public.qbo_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  realm_id text NOT NULL,
  access_token text NOT NULL,
  refresh_token text NOT NULL,
  token_expires_at timestamptz NOT NULL,
  company_name text,
  connected_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);
ALTER TABLE public.qbo_connections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS own_qbo_connection ON public.qbo_connections;
CREATE POLICY own_qbo_connection ON public.qbo_connections FOR SELECT USING (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS qbo_connections_user_idx ON public.qbo_connections(user_id);
