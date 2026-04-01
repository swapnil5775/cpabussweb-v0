CREATE TABLE IF NOT EXISTS public.financial_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  snapshot_date date NOT NULL,
  period_start date NOT NULL,
  period_end date NOT NULL,
  period_label text,
  revenue numeric(14,2),
  expenses numeric(14,2),
  net_income numeric(14,2),
  assets numeric(14,2),
  liabilities numeric(14,2),
  equity numeric(14,2),
  operating_cash_flow numeric(14,2),
  top_expenses jsonb DEFAULT '[]'::jsonb NOT NULL,
  profit_loss jsonb,
  balance_sheet jsonb,
  cash_flow jsonb,
  email_sent_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE (user_id, period_start, period_end)
);

ALTER TABLE public.financial_snapshots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS own_financial_snapshots ON public.financial_snapshots;
CREATE POLICY own_financial_snapshots
ON public.financial_snapshots
FOR SELECT
USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS financial_snapshots_user_date_idx
ON public.financial_snapshots(user_id, snapshot_date DESC);
