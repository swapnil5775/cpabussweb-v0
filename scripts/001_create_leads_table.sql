-- Create leads table for storing intake form submissions
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT DEFAULT 'new',
  
  -- Contact Information
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  preferred_contact_method TEXT,
  best_time_to_reach TEXT,
  
  -- Business Information
  business_legal_name TEXT,
  dba TEXT,
  website TEXT,
  entity_type TEXT,
  industry TEXT,
  states_of_operation TEXT[],
  number_of_locations TEXT,
  
  -- Financial Information
  annual_revenue_bucket TEXT,
  monthly_transaction_volume_bucket TEXT,
  bank_accounts_count INTEGER,
  credit_cards_count INTEGER,
  
  -- Current Setup
  current_bookkeeping_management TEXT,
  current_software TEXT,
  migration_preference TEXT,
  payment_processors TEXT[],
  payroll_type TEXT,
  
  -- Services Needed
  service_type TEXT,
  services_needed TEXT[],
  
  -- Catchup Information
  catchup_needed TEXT,
  last_reconciled TEXT,
  has_bank_statements TEXT,
  
  -- Tax Review
  wants_free_tax_review_last_2_years TEXT,
  will_share_tax_docs_later BOOLEAN DEFAULT false,
  
  -- Additional Notes
  notes_90_days TEXT,
  pain_points TEXT,
  anything_else TEXT,
  
  -- Tracking
  page_url TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT
);

-- Enable Row Level Security
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Create policy to allow server-side inserts only (using service role key)
-- Public users cannot directly insert/read leads
CREATE POLICY "Deny public access" ON public.leads
  FOR ALL
  TO public
  USING (false);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS leads_email_idx ON public.leads(email);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS leads_status_idx ON public.leads(status);
