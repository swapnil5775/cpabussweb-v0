import { ONE_TIME_SERVICES, type ServiceKey } from "@/lib/stripe-plans"

export type IntakeQuestionType = "text" | "textarea" | "select" | "date" | "number" | "yes_no" | "info"

export type IntakeQuestion = {
  id: string
  label: string
  type: IntakeQuestionType
  required?: boolean
  placeholder?: string
  helpText?: string
  options?: string[]
  /** Only show this field when answers[showIfId] === showIfValue */
  showIfId?: string
  showIfValue?: string
}

export type ServiceIntakeConfig = {
  timeline: string
  intro: string
  questions: IntakeQuestion[]
}

export const SERVICE_INTAKE_CONFIG: Record<ServiceKey, ServiceIntakeConfig> = {
  llc_formation: {
    timeline: "2-5 business days after full intake submission",
    intro: "We will use these details to prepare and file your LLC formation package.",
    questions: [
      { id: "state_of_formation", label: "State of formation", type: "text", required: true, placeholder: "Texas" },
      { id: "preferred_business_name", label: "Preferred business name", type: "text", required: true },
      { id: "alternate_business_name", label: "Alternate business name (optional)", type: "text" },
      { id: "business_purpose", label: "Business purpose / activity", type: "textarea", required: true },
      { id: "owner_full_legal_name", label: "Owner full legal name", type: "text", required: true },
      { id: "owner_address", label: "Owner address", type: "textarea", required: true },
      { id: "effective_start_date", label: "Preferred effective start date", type: "date" },
      { id: "ein_needed", label: "Do you want us to handle EIN filing?", type: "yes_no", required: true },
    ],
  },
  tax_individual: {
    timeline: "5-10 business days after complete document set",
    intro: "Fill out the details below, then upload your documents. We will not ask for SSN, DOB, or bank info here — those come through the secure document upload.",
    questions: [
      // ── Filing basics ────────────────────────────────────────────
      { id: "tax_year", label: "Tax year to file", type: "select", required: true, options: ["2025", "2024", "2023", "2022"] },
      { id: "filing_status", label: "Filing status", type: "select", required: true, options: ["Single", "Married Filing Jointly", "Married Filing Separately", "Head of Household", "Qualifying Surviving Spouse"] },
      { id: "state_returns", label: "State return(s) needed", type: "text", required: true, placeholder: "CA, NY (or 'Federal only')" },
      { id: "prior_preparer", label: "Who prepared your return last year?", type: "select", required: true, options: ["This firm", "Another CPA / preparer", "Self-prepared (TurboTax, etc.)", "First year filing"] },

      // ── Income sources ───────────────────────────────────────────
      { id: "w2_count", label: "Number of W-2 forms (jobs / employers)", type: "number", required: true, placeholder: "1" },
      { id: "has_1099_income", label: "Any 1099-NEC or self-employment income?", type: "yes_no", required: true },
      { id: "self_employment_detail", label: "Business name, activity, and approximate net income", type: "textarea", placeholder: "e.g., Freelance web design – approx $28,000 net", showIfId: "has_1099_income", showIfValue: "Yes" },
      { id: "investment_income", label: "Any investment income? (stocks, crypto, mutual funds)", type: "yes_no", required: true },
      { id: "investment_detail", label: "Describe (sold stocks, crypto trades, dividends, etc.)", type: "textarea", placeholder: "e.g., Sold AAPL shares for ~$12,000 gain; held crypto on Coinbase", showIfId: "investment_income", showIfValue: "Yes" },
      { id: "rental_income", label: "Any rental property income?", type: "yes_no", required: true },
      { id: "rental_detail", label: "Address of rental property, gross rent collected, main expenses", type: "textarea", placeholder: "e.g., 123 Oak St Austin TX – $18,000 rent, $6,000 expenses (mortgage, repairs)", showIfId: "rental_income", showIfValue: "Yes" },
      { id: "other_income", label: "Any other income? (alimony received, gambling, foreign, retirement distributions)", type: "textarea", placeholder: "Describe type and approximate amount" },

      // ── Deductions ───────────────────────────────────────────────
      { id: "homeowner", label: "Do you own your home? (mortgage interest + property tax)", type: "yes_no", required: true },
      { id: "student_loan_interest", label: "Did you pay student loan interest this year?", type: "yes_no", required: true },
      { id: "charitable_contributions", label: "Charitable contributions made (cash or non-cash)?", type: "yes_no", required: true },
      { id: "charitable_amount", label: "Approximate total charitable contributions", type: "text", placeholder: "e.g., $1,200 cash + 2 bags of clothing to Goodwill", showIfId: "charitable_contributions", showIfValue: "Yes" },
      { id: "health_insurance_type", label: "Health insurance coverage type", type: "select", required: true, options: ["Employer-sponsored (W-2 Box 12)", "Marketplace / ACA (1095-A)", "Self-employed (deducting premiums)", "Medicare / Medicaid", "None / uninsured"] },

      // ── Dependents ───────────────────────────────────────────────
      { id: "has_dependents", label: "Any dependents to claim?", type: "yes_no", required: true },
      { id: "dependents_detail", label: "Dependent names, relationship, and year of birth (no SSNs here)", type: "textarea", placeholder: "e.g., Emma Smith – daughter – born 2015\nLiam Smith – son – born 2018", showIfId: "has_dependents", showIfValue: "Yes" },
      { id: "childcare_expenses", label: "Any childcare / dependent care expenses paid?", type: "yes_no", showIfId: "has_dependents", showIfValue: "Yes" },

      // ── Payments & prior year ────────────────────────────────────
      { id: "estimated_payments", label: "Did you make estimated tax payments (1040-ES)?", type: "yes_no", required: true },
      { id: "estimated_payment_amount", label: "Total estimated payments made (all quarters)", type: "text", placeholder: "e.g., $4,000 ($1,000 each quarter)", showIfId: "estimated_payments", showIfValue: "Yes" },
      { id: "irs_notices", label: "Any IRS or state notices / letters received this year?", type: "yes_no", required: true },
      { id: "irs_notice_detail", label: "Describe the notice (or upload it in Documents)", type: "textarea", showIfId: "irs_notices", showIfValue: "Yes" },
      { id: "refund_preference", label: "Refund preference", type: "select", required: true, options: ["Direct deposit (provide routing/account in secure upload)", "Paper check", "Apply to next year estimated tax"] },

      // ── Secure document checklist ────────────────────────────────
      {
        id: "_docs_notice",
        label: "Documents to upload securely after submitting this form",
        type: "info",
        placeholder: `Upload these in the Documents section — do NOT include SSN, DOB, or bank numbers in form fields above.

Required for all filers:
• All W-2 forms
• All 1099 forms (NEC, INT, DIV, R, SSA, etc.)
• Prior year federal + state tax return (for new clients)
• Government-issued ID (driver's license or passport)

If applicable:
• Schedule K-1 (partnerships, S-corps, trusts)
• 1095-A (marketplace health insurance)
• 1098 (mortgage interest statement)
• Brokerage statements (1099-B) or crypto transaction CSV
• Rental income/expense summary
• Childcare provider name, address, and EIN/SSN (Form 2441)
• Estimated tax payment confirmation (IRS letter or bank statement)
• Bank account info for direct deposit (routing + account on a voided check scan)`,
      },
      { id: "special_notes", label: "Anything else we should know before we start?", type: "textarea" },
    ],
  },
  tax_business: {
    timeline: "7-12 business days after complete intake and books review",
    intro: "Fill out the business details below. We will not ask for owner SSNs here — those come through secure document upload with the prior year return.",
    questions: [
      // ── Entity & filing basics ────────────────────────────────────
      { id: "tax_year", label: "Tax year to file", type: "select", required: true, options: ["2025", "2024", "2023", "2022"] },
      { id: "entity_type", label: "Entity type", type: "select", required: true, options: ["S-Corp (1120-S)", "C-Corp (1120)", "Partnership (1065)", "Single-Member LLC (Schedule C)", "Multi-Member LLC (1065)"] },
      { id: "company_legal_name", label: "Company legal name (as filed)", type: "text", required: true },
      { id: "ein", label: "Business EIN (XX-XXXXXXX)", type: "text", required: true, placeholder: "12-3456789" },
      { id: "business_address", label: "Business mailing address", type: "textarea", required: true, placeholder: "123 Main St, Suite 100\nAustin, TX 78701" },
      { id: "state_returns", label: "State filing requirement(s)", type: "text", required: true, placeholder: "TX, CA (or 'Federal only')" },
      { id: "formation_date", label: "Date of incorporation / formation", type: "date", required: true },
      { id: "accounting_method", label: "Accounting method", type: "select", required: true, options: ["Cash basis", "Accrual basis", "Not sure"] },

      // ── Books & prior return ──────────────────────────────────────
      { id: "books_ready", label: "Are books finalized / reconciled for this tax year?", type: "yes_no", required: true },
      { id: "books_platform", label: "Accounting platform used", type: "select", required: true, options: ["QuickBooks Online", "QuickBooks Desktop", "Xero", "Wave", "Spreadsheet only", "Other / none"] },
      { id: "prior_return_filed", label: "Was a return filed for the prior year?", type: "yes_no", required: true },
      { id: "extension_filed", label: "Was an extension filed for this tax year?", type: "yes_no", required: true },
      { id: "prior_preparer", label: "Who prepared the return last year?", type: "select", options: ["This firm", "Another CPA / preparer", "Self-prepared", "First year filing"], showIfId: "prior_return_filed", showIfValue: "Yes" },

      // ── Income & compensation ─────────────────────────────────────
      { id: "owner_count", label: "Number of owners / shareholders", type: "number", required: true, placeholder: "1" },
      { id: "officer_compensation", label: "Total officer / owner W-2 wages paid this year", type: "text", required: true, placeholder: "e.g., $85,000 (or $0 if none)" },
      { id: "distributions", label: "Total owner distributions taken this year", type: "text", placeholder: "e.g., $30,000 (or $0)" },
      { id: "payroll_processed", label: "Was payroll processed for employees (beyond owner)?", type: "yes_no", required: true },
      { id: "payroll_platform", label: "Payroll platform used", type: "text", placeholder: "e.g., Gusto, ADP, QuickBooks Payroll", showIfId: "payroll_processed", showIfValue: "Yes" },

      // ── Balance sheet & assets ────────────────────────────────────
      { id: "fixed_assets", label: "Any fixed asset purchases or disposals this year?", type: "yes_no", required: true },
      { id: "fixed_assets_detail", label: "Describe assets purchased or sold (item, cost, date)", type: "textarea", placeholder: "e.g., MacBook Pro – $2,400 – March 2025; sold old server – $800", showIfId: "fixed_assets", showIfValue: "Yes" },
      { id: "shareholder_loans", label: "Any loans to or from shareholders / members?", type: "yes_no", required: true },
      { id: "shareholder_loans_detail", label: "Describe loan direction, amount, and whether interest was charged", type: "textarea", showIfId: "shareholder_loans", showIfValue: "Yes" },
      { id: "nol_carryforward", label: "Any net operating loss (NOL) carried forward from a prior year?", type: "yes_no", required: true },

      // ── Secure document checklist ─────────────────────────────────
      {
        id: "_docs_notice",
        label: "Documents to upload securely after submitting this form",
        type: "info",
        placeholder: `Upload these in the Documents section — owner SSNs and personal IDs should only come through secure document upload.

Required:
• Prior year business tax return (1120-S, 1120, or 1065)
• QuickBooks / accounting export or trial balance for the tax year
• Payroll summary report (if payroll was run)
• Year-end bank statements for all business accounts

If applicable:
• Fixed asset purchase receipts or depreciation schedule
• Loan agreements (shareholder loans or business loans)
• K-1s received from other partnerships or S-corps
• 1099s received for business income
• State nexus information (if operating in multiple states)`,
      },
      { id: "special_notes", label: "Special filing notes or questions for the team", type: "textarea" },
    ],
  },
  payroll_setup: {
    timeline: "2-4 business days for complete setup",
    intro: "Fill out all sections so we can configure payroll without a back-and-forth call. Employee SSNs and bank info come through secure document upload — do not include them in the fields below.",
    questions: [
      // ── Company info ─────────────────────────────────────────────
      { id: "company_legal_name", label: "Company legal name (as registered with IRS)", type: "text", required: true },
      { id: "ein", label: "Federal EIN (XX-XXXXXXX)", type: "text", required: true, placeholder: "12-3456789" },
      { id: "business_address", label: "Business address (used for payroll tax registrations)", type: "textarea", required: true, placeholder: "123 Main St\nAustin, TX 78701" },

      // ── Payroll platform ─────────────────────────────────────────
      { id: "platform_preference", label: "Preferred payroll platform", type: "select", required: true, options: ["Gusto (recommended)", "QuickBooks Payroll", "ADP Run", "Paychex Flex", "Already have a platform — need configuration help", "No preference — you choose"] },
      { id: "existing_platform_name", label: "Which platform are you currently using?", type: "text", placeholder: "e.g., Gusto, ADP", showIfId: "platform_preference", showIfValue: "Already have a platform — need configuration help" },

      // ── Pay schedule ─────────────────────────────────────────────
      { id: "pay_schedule", label: "Pay frequency", type: "select", required: true, options: ["Weekly", "Bi-weekly (every 2 weeks)", "Semi-monthly (1st and 15th)", "Monthly"] },
      { id: "first_pay_date", label: "Target date for first payroll run", type: "date", required: true },

      // ── Workforce ────────────────────────────────────────────────
      { id: "employee_count", label: "Number of W-2 employees", type: "number", required: true, placeholder: "3" },
      { id: "states_with_employees", label: "State(s) where employees physically work", type: "text", required: true, placeholder: "TX, CA, NY" },
      { id: "contractors_count", label: "Number of 1099 contractors (if also tracking in payroll platform)", type: "number", placeholder: "0" },
      { id: "owner_on_payroll", label: "Is the owner / officer receiving a W-2 salary? (important for S-corps)", type: "yes_no", required: true },
      { id: "owner_salary", label: "Intended owner / officer annual W-2 salary", type: "text", placeholder: "e.g., $72,000/year", showIfId: "owner_on_payroll", showIfValue: "Yes" },

      // ── Employee roster (no SSNs) ─────────────────────────────────
      { id: "employee_roster", label: "Employee Roster — one per line (no SSNs here)", type: "textarea", placeholder: `Full Name | Job Title | Start Date | Pay Type | Pay Rate
Example:
Jane Smith    | Operations Manager | 2024-03-01 | Salary    | $58,000/yr
John Doe      | Technician         | 2025-01-15 | Hourly    | $22/hr
Sara Lee      | Part-time Admin    | 2025-02-01 | Hourly    | $18/hr` },

      // ── State tax accounts ────────────────────────────────────────
      { id: "state_ui_account", label: "State unemployment (UI) account number(s)", type: "text", placeholder: "e.g., TX: 1234567-8  |  CA: 999-1234-5 (leave blank if not yet registered)" },
      { id: "state_withholding_account", label: "State income tax withholding account number(s)", type: "text", placeholder: "e.g., CA: 999-1234-5 (leave blank if not yet registered)" },
      { id: "new_hire_reporting", label: "Have new hires been reported to the state?", type: "yes_no", required: true },

      // ── Benefits ─────────────────────────────────────────────────
      { id: "benefits_needed", label: "Any benefits to set up in payroll? (health, 401k, HSA, etc.)", type: "yes_no", required: true },
      { id: "benefits_detail", label: "Describe each benefit type and employer / employee contribution amounts", type: "textarea", placeholder: "e.g., Health insurance: employer pays $400/mo, employee pays $150/mo via pre-tax deduction\n401k: 3% employer match, Roth option available", showIfId: "benefits_needed", showIfValue: "Yes" },

      // ── Secure document checklist ─────────────────────────────────
      {
        id: "_docs_notice",
        label: "Documents to upload securely after submitting this form",
        type: "info",
        placeholder: `Upload these in the Documents section — employee SSNs and bank account info must come through secure upload only.

Required:
• Completed W-4 for each employee (or we can provide blank forms)
• Completed I-9 for each employee (employment eligibility)
• Voided check or bank letter for company payroll bank account (for ACH direct deposit)
• IRS EIN confirmation letter (CP-575 or 147C)

If applicable:
• Prior payroll records / year-to-date payroll summary (if mid-year setup)
• State registration confirmations (UI and withholding account letters)
• 401k / benefits plan documents`,
      },
      { id: "notes", label: "Anything else we should know before we start?", type: "textarea" },
    ],
  },
  w2_1099_filing: {
    timeline: "3-6 business days for preparation and filing",
    intro: "Complete all sections below so we can prepare forms without a follow-up call. Include one row per employee or contractor in the roster fields — the more detail you provide here, the faster we can issue.",
    questions: [
      {
        id: "tax_year",
        label: "Tax year for forms",
        type: "select",
        required: true,
        options: ["2026", "2025", "2024", "2023"],
      },
      {
        id: "filing_states",
        label: "State(s) requiring W-2 / 1099 filing",
        type: "text",
        required: true,
        placeholder: "TX, FL, CA",
      },
      {
        id: "delivery_preference",
        label: "How should recipients receive their copies?",
        type: "select",
        required: true,
        options: ["Email + secure portal link", "Mail + secure portal link", "Portal only (we notify them)"],
      },

      // ── W-2 section ──────────────────────────────────────────────
      {
        id: "w2_count",
        label: "Number of W-2 employees",
        type: "number",
        required: true,
        placeholder: "0",
      },
      {
        id: "w2_roster",
        label: "W-2 Employee Roster — one employee per line (no SSNs here — upload W-9s / payroll report in Documents)",
        type: "textarea",
        placeholder: `Full Name | Street Address, City, State ZIP | Total Wages | Federal Tax Withheld | State Tax Withheld
Example:
Jane Smith | 100 Main St, Austin TX 78701 | 62000 | 7800 | 2100
John Doe   | 200 Oak Ave, Miami FL 33101  | 45000 | 5200 | 0`,
      },
      {
        id: "w2_benefits",
        label: "Were any pre-tax benefits reported on W-2s? (health insurance, 401k, HSA, etc.)",
        type: "yes_no",
        required: true,
      },
      {
        id: "w2_benefits_detail",
        label: "Describe the benefit types and amounts (Box 12 codes if known)",
        type: "textarea",
        placeholder: "e.g., Code D – 401k: $4,500 per employee; Code DD – health: $2,400",
        showIfId: "w2_benefits",
        showIfValue: "Yes",
      },

      // ── 1099 section ─────────────────────────────────────────────
      {
        id: "1099_count",
        label: "Number of 1099-NEC contractors (paid $600 or more)",
        type: "number",
        required: true,
        placeholder: "0",
      },
      {
        id: "1099_roster",
        label: "1099-NEC Contractor Roster — one contractor per line (SSN/EIN comes from W-9 upload in Documents)",
        type: "textarea",
        placeholder: `Full Name or Business Name | Street Address, City, State ZIP | Total Paid | W-9 on file? (Y/N)
Example:
Acme Design LLC | 500 Pine Rd, Denver CO 80201   | 8500 | Y
Sara Johnson    | 90 Elm St, Portland OR 97201    | 3200 | N`,
      },
      {
        id: "missing_w9",
        label: "Do you have a W-9 on file for all contractors listed above?",
        type: "yes_no",
        required: true,
      },
      {
        id: "1099_other_types",
        label: "Any 1099-MISC, 1099-INT, or 1099-DIV forms also needed?",
        type: "yes_no",
        required: true,
      },
      {
        id: "1099_other_detail",
        label: "Describe the other form types, recipients, and amounts",
        type: "textarea",
        placeholder: "e.g., 1099-MISC: rent paid to Bob LLC – $18,000",
        showIfId: "1099_other_types",
        showIfValue: "Yes",
      },

      // ── Secure document checklist ─────────────────────────────────
      {
        id: "_docs_notice",
        label: "Documents to upload securely after submitting this form",
        type: "info",
        placeholder: `Upload these in the Documents section — SSNs and EINs must only come through secure document upload, not typed into form fields above.

Required:
• W-9 for every contractor listed above (contains their SSN or EIN)
• Payroll summary report for the tax year (contains employee wage totals and withholding)
• Prior year W-2 and 1099 copies (if corrections are needed)

If applicable:
• State withholding account confirmation letters
• Any IRS or state notices related to prior year filings`,
      },

      // ── Corrections & notes ───────────────────────────────────────
      {
        id: "prior_year_corrections",
        label: "Any prior year W-2 or 1099 corrections (amended forms) needed?",
        type: "yes_no",
        required: true,
      },
      {
        id: "prior_year_detail",
        label: "Describe which year and what changed",
        type: "textarea",
        placeholder: "e.g., 2023 W-2 for Jane Smith — SSN was wrong",
        showIfId: "prior_year_corrections",
        showIfValue: "Yes",
      },
      {
        id: "notes",
        label: "Anything else we should know before we start?",
        type: "textarea",
        placeholder: "Payroll platform used, accountant contact, special deadlines, etc.",
      },
    ],
  },
  state_filings_support: {
    timeline: "3-7 business days based on filing complexity",
    intro: "We will build your state compliance package from these details.",
    questions: [
      { id: "state", label: "Primary state", type: "text", required: true, placeholder: "Delaware" },
      { id: "filing_type", label: "Filing type", type: "select", required: true, options: ["Annual report", "Amendment", "Foreign registration", "Other"] },
      { id: "entity_name", label: "Legal entity name", type: "text", required: true },
      { id: "entity_id", label: "State entity/file number", type: "text" },
      { id: "deadline_date", label: "Known filing deadline (if any)", type: "date" },
      { id: "multi_state", label: "Need support in multiple states?", type: "yes_no", required: true },
      { id: "notes", label: "Special instructions", type: "textarea" },
    ],
  },
  registered_agent_services: {
    timeline: "2-5 business days for transition and setup",
    intro: "We will coordinate registered agent servicing and compliance routing.",
    questions: [
      { id: "state", label: "State(s) requiring registered agent", type: "text", required: true },
      { id: "entity_name", label: "Legal entity name", type: "text", required: true },
      { id: "current_agent", label: "Current registered agent (if any)", type: "text" },
      { id: "change_needed", label: "Is this a change from current agent?", type: "yes_no", required: true },
      { id: "notice_email", label: "Compliance notice email", type: "text", required: true, placeholder: "owner@company.com" },
      { id: "renewal_month", label: "Annual renewal month", type: "text", placeholder: "March" },
      { id: "notes", label: "Additional notes", type: "textarea" },
    ],
  },
  business_consultation_review: {
    timeline: "2-4 business days for report prep before recommendations",
    intro: "We will prepare a CFO-style review packet from your responses and data.",
    questions: [
      { id: "focus_area", label: "Primary focus area", type: "select", required: true, options: ["Profitability", "Cash flow", "Growth planning", "Cost control", "General review"] },
      { id: "review_period", label: "Review period needed", type: "select", required: true, options: ["Current month", "Last quarter", "Year to date", "Last 12 months"] },
      { id: "target_goal", label: "Main business goal this quarter", type: "textarea", required: true },
      { id: "key_concern", label: "Biggest concern right now", type: "textarea", required: true },
      { id: "need_call", label: "Do you also want a strategy call?", type: "yes_no", required: true },
      { id: "decision_deadline", label: "Decision deadline (if any)", type: "date" },
      { id: "notes", label: "Additional context", type: "textarea" },
    ],
  },
  acquisition_file_review: {
    timeline: "5-8 business days after complete upload and intake",
    intro: "We will perform due diligence review and prepare risk findings.",
    questions: [
      { id: "target_company_name", label: "Target company name", type: "text", required: true },
      { id: "transaction_type", label: "Transaction type", type: "select", required: true, options: ["Asset purchase", "Equity purchase", "Merger", "Other"] },
      { id: "expected_close_date", label: "Expected close date", type: "date" },
      { id: "financial_years", label: "How many years of financials available?", type: "number", required: true, placeholder: "3" },
      { id: "top_risk_focus", label: "Top risk area to focus on", type: "select", required: true, options: ["Cash flow quality", "Revenue quality", "Expense structure", "Liabilities", "Tax exposure"] },
      { id: "deal_size", label: "Approx deal size (USD)", type: "text", placeholder: "$500,000" },
      { id: "notes", label: "Additional diligence notes", type: "textarea" },
    ],
  },
}

export function getServiceIntakeConfig(serviceType: string | null | undefined) {
  if (!serviceType) return null
  if (!(serviceType in ONE_TIME_SERVICES)) return null
  return SERVICE_INTAKE_CONFIG[serviceType as ServiceKey] ?? null
}

export function getServiceName(serviceType: string | null | undefined) {
  if (!serviceType || !(serviceType in ONE_TIME_SERVICES)) return "Service"
  return ONE_TIME_SERVICES[serviceType as ServiceKey].name
}

export function buildOrderNumber(orderId: string, createdAt?: string | null) {
  const dt = createdAt ? new Date(createdAt) : new Date()
  const year = Number.isNaN(dt.getTime()) ? new Date().getFullYear() : dt.getFullYear()
  const suffix = orderId.replace(/-/g, "").slice(0, 8).toUpperCase()
  return `BK-${year}-${suffix}`
}

export function getTrackerSteps(order: {
  status: string | null
  intake_status: string | null
}) {
  const intakeSubmitted = order.intake_status === "submitted"
  const status = order.status ?? "paid"
  return [
    { label: "Payment Received", done: true },
    { label: "Intake Submitted", done: intakeSubmitted || ["in_progress", "completed"].includes(status) },
    { label: "Team Review", done: ["in_progress", "completed"].includes(status) },
    { label: "Work In Progress", done: ["in_progress", "completed"].includes(status) },
    { label: "Delivered", done: status === "completed" },
  ]
}
