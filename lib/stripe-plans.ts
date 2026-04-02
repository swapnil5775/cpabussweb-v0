export const PLANS = {
  essentials: {
    name: "Essentials",
    label: "For solopreneurs & small businesses",
    priceId: process.env.STRIPE_PRICE_ESSENTIALS!,
    displayPrice: "$199",
    basePrice: 199,
    period: "/month",
    features: [
      "Bi-weekly or monthly bookkeeping cycle",
      "Transaction categorization + reconciliation",
      "P&L + Balance Sheet creation",
      "Expense tracking and insights",
      "Dedicated bookkeeper",
      "Quarterly sales tax filing support",
      "Payroll support via Gusto",
      "Owner's personal tax prep & filing included",
      "First 5 employees included — $10/employee after",
    ],
  },
  growth: {
    name: "Growth",
    label: "For scaling businesses",
    priceId: process.env.STRIPE_PRICE_GROWTH!,
    displayPrice: "$329",
    basePrice: 329,
    period: "/month",
    popular: true,
    features: [
      "Everything in Essentials",
      "Projection cash flow modeling",
      "Monthly business insights review",
      "Invoice and payment workflows in QBO/Xero",
      "US/Canada support on QuickBooks or Xero",
      "Owner's (or married couple) tax prep & filing included",
      "First 5 employees included — $10/employee after",
    ],
  },
  enterprise: {
    name: "Enterprise",
    label: "For established & complex businesses",
    priceId: process.env.STRIPE_PRICE_ENTERPRISE!,
    displayPrice: "$499",
    basePrice: 499,
    period: "/month",
    features: [
      "Everything in Growth",
      "Multi-entity bookkeeping",
      "International Xero onboarding support",
      "Custom reporting and KPI packs",
      "Dedicated account manager",
      "No client-billed software subscriptions",
      "Owner's (or married couple) tax prep & filing included",
      "First 5 employees included — $10/employee after",
    ],
  },
} as const

export type PlanKey = keyof typeof PLANS

// Per-employee payroll add-on pricing
// First 5 employees: free (included)
// 6–50 employees: $10/employee/mo
// 51+ employees: $8/employee/mo
export function calcEmployeeCost(count: number): number {
  if (count <= 5) return 0
  if (count <= 50) return (count - 5) * 10
  return 45 * 10 + (count - 50) * 8
}

export function formatEmployeeCost(count: number): string {
  const cost = calcEmployeeCost(count)
  if (cost === 0) return "Included in plan"
  if (count <= 50) return `+$${cost}/mo (${count - 5} emp × $10)`
  return `+$${cost}/mo (45 × $10 + ${count - 50} × $8)`
}

export const ONE_TIME_SERVICES = {
  llc_formation: {
    name: "LLC Formation Assistance",
    description: "We handle the paperwork to form your LLC and obtain your EIN.",
    priceId: process.env.STRIPE_PRICE_LLC_FORMATION!,
    displayPrice: "$299",
    trigger: "No legal entity selected during signup",
  },
  tax_individual: {
    name: "Individual Tax Filing",
    description: "Personal return (1040) — federal + state e-filing included.",
    priceId: process.env.STRIPE_PRICE_TAX_INDIVIDUAL!,
    displayPrice: "$299",
    trigger: "Tax season (Jan–Apr)",
  },
  tax_business: {
    name: "Business Tax Filing",
    description: "Business return (1120-S, 1120, or 1065) — federal + state e-filing.",
    priceId: process.env.STRIPE_PRICE_TAX_BUSINESS!,
    displayPrice: "$499",
    trigger: "Tax season (Jan–Apr)",
  },
  payroll_setup: {
    name: "Payroll Setup",
    description: "Full payroll system configuration for your business.",
    priceId: process.env.STRIPE_PRICE_PAYROLL_SETUP!,
    displayPrice: "$199",
    trigger: "Business has employees",
  },
  w2_1099_filing: {
    name: "W-2 & 1099 Issuance",
    description: "Year-end W-2 and 1099 preparation, e-filing, and recipient distribution.",
    priceId: process.env.STRIPE_PRICE_W2_1099_FILING!,
    displayPrice: "$149",
    trigger: "Business has employees or contractors",
  },
  state_filings_support: {
    name: "State Filings Support",
    description: "Annual reports, amendments, and state compliance filing support.",
    priceId: process.env.STRIPE_PRICE_STATE_FILINGS_SUPPORT!,
    displayPrice: "$199",
    trigger: "Entity already formed and needs ongoing compliance",
  },
  registered_agent_services: {
    name: "Registered Agent Services",
    description: "Registered agent coordination, state notices, and annual compliance support.",
    priceId: process.env.STRIPE_PRICE_REGISTERED_AGENT_SERVICES!,
    displayPrice: "$149",
    trigger: "Business needs registered agent updates or annual compliance handling",
  },
  business_consultation_review: {
    name: "Business Consultation & Financial Review",
    description: "A one-time strategy session with financial review, KPI analysis, and next-step recommendations.",
    priceId: process.env.STRIPE_PRICE_BUSINESS_CONSULTATION_REVIEW!,
    displayPrice: "$249",
    trigger: "Owner wants strategic guidance or a one-time financial review",
  },
  acquisition_file_review: {
    name: "Acquisition File Review",
    description: "Financial due diligence review for a business acquisition or purchase decision.",
    priceId: process.env.STRIPE_PRICE_ACQUISITION_FILE_REVIEW!,
    displayPrice: "$799",
    trigger: "Business owner evaluating an acquisition or purchase",
  },
} as const

export type ServiceKey = keyof typeof ONE_TIME_SERVICES
