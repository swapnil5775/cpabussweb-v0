-- ============================================================
-- 012: Service order intake workflow and tracking fields
-- ============================================================

ALTER TABLE public.service_orders
  ADD COLUMN IF NOT EXISTS order_number text,
  ADD COLUMN IF NOT EXISTS intake_status text DEFAULT 'pending' NOT NULL,
  ADD COLUMN IF NOT EXISTS intake_answers jsonb DEFAULT '{}'::jsonb NOT NULL,
  ADD COLUMN IF NOT EXISTS intake_started_at timestamptz,
  ADD COLUMN IF NOT EXISTS intake_completed_at timestamptz,
  ADD COLUMN IF NOT EXISTS intake_reminder_sent_at timestamptz;

UPDATE public.service_orders
SET order_number = 'BK-' || to_char(created_at, 'YYYY') || '-' || upper(substring(replace(id::text, '-', '') from 1 for 8))
WHERE order_number IS NULL;

UPDATE public.service_orders
SET intake_status = CASE
  WHEN status IN ('intake_submitted', 'in_progress', 'completed') THEN 'submitted'
  WHEN status IN ('paid', 'pending') THEN 'pending'
  ELSE COALESCE(intake_status, 'pending')
END
WHERE intake_status IS NULL OR intake_status = '';

CREATE UNIQUE INDEX IF NOT EXISTS service_orders_order_number_unique_idx
  ON public.service_orders(order_number)
  WHERE order_number IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS service_orders_checkout_session_unique_idx
  ON public.service_orders(stripe_checkout_session_id)
  WHERE stripe_checkout_session_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS service_orders_org_status_idx
  ON public.service_orders(organization_id, status, intake_status, created_at DESC);
