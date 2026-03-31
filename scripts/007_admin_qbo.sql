-- Firm-level QBO connection (one row — the bookkeeping firm's QBOA token)
CREATE TABLE IF NOT EXISTS public.qbo_firm_connection (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  access_token text NOT NULL,
  refresh_token text NOT NULL,
  token_expires_at timestamptz NOT NULL,
  connected_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Add firm_managed flag and setup_status to qbo_connections
ALTER TABLE public.qbo_connections ADD COLUMN IF NOT EXISTS firm_managed boolean DEFAULT false;
ALTER TABLE public.qbo_connections ADD COLUMN IF NOT EXISTS setup_status text DEFAULT 'pending';
-- setup_status: pending | linked | active | error
