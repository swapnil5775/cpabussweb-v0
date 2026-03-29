export const PLANS = {
  essentials: {
    name: "Essentials",
    label: "For solopreneurs & small businesses",
    priceId: process.env.STRIPE_PRICE_ESSENTIALS!,
    displayPrice: "$149",
    period: "/month",
    features: [
      "Monthly reconciliation",
      "Transaction categorization",
      "P&L + Balance Sheet reports",
      "Dedicated bookkeeper",
      "Email support",
      "Quarterly business review",
      "Owner's personal tax prep & filing included",
    ],
  },
  growth: {
    name: "Growth",
    label: "For scaling businesses",
    priceId: process.env.STRIPE_PRICE_GROWTH!,
    displayPrice: "$249",
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
    ],
  },
  enterprise: {
    name: "Enterprise",
    label: "For established & complex businesses",
    priceId: process.env.STRIPE_PRICE_ENTERPRISE!,
    displayPrice: "$399",
    period: "/month",
    features: [
      "Everything in Growth",
      "Multi-entity bookkeeping",
      "Inventory management",
      "Custom reporting",
      "Dedicated account manager",
      "Phone + email support",
      "Owner's (or married couple) tax prep & filing included",
    ],
  },
} as const

export type PlanKey = keyof typeof PLANS

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
