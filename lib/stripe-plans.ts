export const PLANS = {
  essentials: {
    name: "Essentials",
    label: "For solopreneurs & small businesses",
    priceId: process.env.STRIPE_PRICE_ESSENTIALS!,
    displayPrice: "$199",
    basePrice: 199,
    period: "/month",
    features: [
      "Monthly reconciliation & categorization",
      "P&L + Balance Sheet reports",
      "Dedicated bookkeeper",
      "Email support",
      "Quarterly business review",
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
      "Advanced financial reports",
      "Cash flow forecasting",
      "Expense tracking & insights",
      "Priority email support",
      "Monthly business review",
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
      "Inventory management",
      "Custom reporting",
      "Dedicated account manager",
      "Phone + email support",
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
} as const

export type ServiceKey = keyof typeof ONE_TIME_SERVICES
