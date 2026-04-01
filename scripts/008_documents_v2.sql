-- Add tax_year and review_status to documents table
ALTER TABLE documents ADD COLUMN IF NOT EXISTS tax_year integer DEFAULT extract(year from now())::integer;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS review_status text DEFAULT 'pending';

-- Update existing rows to have a tax_year based on their created_at
UPDATE documents SET tax_year = extract(year from created_at)::integer WHERE tax_year IS NULL;

-- Index for fast queries by user + year + type
CREATE INDEX IF NOT EXISTS documents_user_year_type_idx ON documents(user_id, tax_year, document_type);
