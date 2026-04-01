-- Gusto embedded payroll: one row per client company
CREATE TABLE IF NOT EXISTS gusto_companies (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_uuid    text NOT NULL,
  company_name    text,
  access_token    text,               -- company-level token from Gusto
  token_expires_at timestamptz,
  setup_status    text DEFAULT 'pending', -- pending | active | suspended
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE gusto_companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own gusto company"
  ON gusto_companies FOR SELECT USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS gusto_companies_user_idx ON gusto_companies(user_id);
