import { ONE_TIME_SERVICES, type ServiceKey } from "@/lib/stripe-plans"

export type IntakeQuestionType = "text" | "textarea" | "select" | "date" | "number" | "yes_no"

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
    intro: "We will prepare your 1040 package based on your responses and uploaded documents.",
    questions: [
      { id: "tax_year", label: "Tax year to file", type: "number", required: true, placeholder: "2025" },
      { id: "filing_status", label: "Filing status", type: "select", required: true, options: ["Single", "Married Filing Jointly", "Married Filing Separately", "Head of Household"] },
      { id: "state_returns", label: "State return(s) needed", type: "text", required: true, placeholder: "CA, NY" },
      { id: "w2_count", label: "How many W-2 forms?", type: "number", required: true, placeholder: "1" },
      { id: "has_1099_income", label: "Any 1099/self-employment income?", type: "yes_no", required: true },
      { id: "estimated_payments", label: "Estimated tax payments made?", type: "yes_no", required: true },
      { id: "special_notes", label: "Anything else we should know?", type: "textarea" },
    ],
  },
  tax_business: {
    timeline: "7-12 business days after complete intake and books review",
    intro: "These responses help us route your return to the correct filing workflow.",
    questions: [
      { id: "tax_year", label: "Tax year to file", type: "number", required: true, placeholder: "2025" },
      { id: "entity_type", label: "Entity type", type: "select", required: true, options: ["S-Corp (1120-S)", "C-Corp (1120)", "Partnership (1065)", "Single-Member LLC"] },
      { id: "state_returns", label: "State filing requirement(s)", type: "text", required: true },
      { id: "books_ready", label: "Are books finalized for the year?", type: "yes_no", required: true },
      { id: "owner_count", label: "Number of owners/shareholders", type: "number", required: true, placeholder: "1" },
      { id: "payroll_processed", label: "Was payroll processed for this tax year?", type: "yes_no", required: true },
      { id: "special_notes", label: "Special filing notes", type: "textarea" },
    ],
  },
  payroll_setup: {
    timeline: "2-4 business days for complete setup",
    intro: "We will configure payroll and provide first-run readiness once details are complete.",
    questions: [
      { id: "pay_schedule", label: "Preferred pay schedule", type: "select", required: true, options: ["Weekly", "Bi-weekly", "Semi-monthly", "Monthly"] },
      { id: "first_pay_date", label: "Target first pay date", type: "date", required: true },
      { id: "employee_count", label: "Current employee count", type: "number", required: true, placeholder: "5" },
      { id: "states_with_employees", label: "States where employees work", type: "text", required: true, placeholder: "TX, CA" },
      { id: "contractors_count", label: "1099 contractor count (if any)", type: "number", placeholder: "0" },
      { id: "benefits_needed", label: "Any benefits setup needed?", type: "yes_no", required: true },
      { id: "notes", label: "Payroll setup notes", type: "textarea" },
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
        label: "W-2 Employee Roster — one employee per line",
        type: "textarea",
        placeholder: `Full Name | SSN (XXX-XX-XXXX) | Street Address, City, State ZIP | Total Wages | Federal Tax Withheld | State Tax Withheld
Example:
Jane Smith | 123-45-6789 | 100 Main St, Austin TX 78701 | 62000 | 7800 | 2100
John Doe   | 987-65-4321 | 200 Oak Ave, Miami FL 33101  | 45000 | 5200 | 0`,
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
        label: "1099-NEC Contractor Roster — one contractor per line",
        type: "textarea",
        placeholder: `Full Name or Business Name | SSN or EIN | Street Address, City, State ZIP | Total Paid | W-9 on file? (Y/N)
Example:
Acme Design LLC    | 12-3456789 | 500 Pine Rd, Denver CO 80201 | 8500 | Y
Sara Johnson       | 555-44-3333 | 90 Elm St, Portland OR 97201 | 3200 | N`,
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
