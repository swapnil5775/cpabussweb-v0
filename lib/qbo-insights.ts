type MetricLike = {
  key: string
  label: string
  value: number | null
  previousValue?: number | null
  changePercent?: number | null
}

type TrendPoint = {
  label: string
  revenue: number | null
  expenses: number | null
  netIncome: number | null
}

type SnapshotPoint = {
  snapshot_date: string
  period_label: string | null
  revenue: number | null
  expenses: number | null
  net_income: number | null
  operating_cash_flow: number | null
  assets?: number | null
  liabilities?: number | null
}

type ExpensePoint = {
  label: string
  value: number | null
  section?: string
}

export type InsightAlert = {
  id: string
  severity: "critical" | "high" | "medium" | "positive"
  title: string
  body: string
  metric?: string
  evidence?: string[]
  action: string
}

export type ExecutiveBrief = {
  headline: string
  summary: string
  bullets: string[]
}

export type OpportunityCard = {
  title: string
  body: string
  impact: string
}

export type AutomationScore = {
  score: number
  label: string
  summary: string
  drivers: string[]
}

export function buildAutomatedInsights(input: {
  overview: MetricLike[]
  monthlyTrend: TrendPoint[]
  snapshots: SnapshotPoint[]
  topExpenses: ExpensePoint[]
  highlights: {
    grossProfit?: number | null
    netIncome?: number | null
    equity?: number | null
  }
}) {
  const revenue = pickMetric(input.overview, "revenue")
  const expenses = pickMetric(input.overview, "expenses")
  const netIncome = pickMetric(input.overview, "net-income")
  const assets = pickMetric(input.overview, "assets")
  const liabilities = pickMetric(input.overview, "liabilities")
  const operatingCashFlow = pickMetric(input.overview, "operating-cash-flow")

  const alerts: InsightAlert[] = []
  const opportunities: OpportunityCard[] = []
  const executiveBullets: string[] = []
  const drivers: string[] = []
  let score = 82

  const latestThreeRevenue = input.monthlyTrend.slice(-3).map((point) => point.revenue)
  const consecutiveRevenueDecline = latestThreeRevenue.length === 3 &&
    latestThreeRevenue.every((value) => value !== null) &&
    (latestThreeRevenue[2] as number) < (latestThreeRevenue[1] as number) &&
    (latestThreeRevenue[1] as number) < (latestThreeRevenue[0] as number)

  const margin = revenue?.value && netIncome && netIncome.value !== null && revenue.value !== 0
    ? (netIncome.value ?? 0) / revenue.value
    : null

  const liabilityRatio = assets?.value && liabilities && liabilities.value !== null && assets.value !== 0
    ? (liabilities.value ?? 0) / assets.value
    : null

  const latestSnapshot = input.snapshots[0]
  const previousSnapshot = input.snapshots[1]
  const weeklyRevenueDelta = delta(latestSnapshot?.revenue ?? null, previousSnapshot?.revenue ?? null)
  const weeklyIncomeDelta = delta(latestSnapshot?.net_income ?? null, previousSnapshot?.net_income ?? null)

  if ((netIncome?.value ?? 0) < 0) {
    alerts.push({
      id: "loss-month",
      severity: "critical",
      title: "Business is running at a monthly loss",
      body: `Current monthly net income is ${formatCurrency(netIncome?.value ?? null)}. That means the current expense base is outrunning revenue.`,
      metric: netIncome?.label,
      evidence: [
        `Net income: ${formatCurrency(netIncome?.value ?? null)}`,
        `Revenue: ${formatCurrency(revenue?.value ?? null)}`,
        `Expenses: ${formatCurrency(expenses?.value ?? null)}`,
      ],
      action: "Review the top two expense categories and stabilize margin before adding new spend.",
    })
    score -= 16
    drivers.push("Negative monthly net income is the biggest risk signal right now.")
  } else if ((netIncome?.value ?? 0) > 0) {
    alerts.push({
      id: "profit-month",
      severity: "positive",
      title: "The business is operating profitably this month",
      body: `Monthly net income is ${formatCurrency(netIncome?.value ?? null)} with margin support from current revenue levels.`,
      metric: netIncome?.label,
      evidence: [
        `Net income: ${formatCurrency(netIncome?.value ?? null)}`,
        `Revenue: ${formatCurrency(revenue?.value ?? null)}`,
      ],
      action: "Protect this by reserving cash for taxes and keeping fixed expenses from drifting upward.",
    })
    score += 4
    drivers.push("Positive monthly profit supports a strong automation score.")
  }

  if ((operatingCashFlow?.value ?? 0) < 0) {
    alerts.push({
      id: "cash-flow-negative",
      severity: "high",
      title: "Operating cash flow is negative",
      body: `Operations are burning ${formatCurrency(Math.abs(operatingCashFlow?.value ?? 0))} instead of generating cash.`,
      metric: operatingCashFlow?.label,
      evidence: [
        `Operating cash flow: ${formatCurrency(operatingCashFlow?.value ?? null)}`,
        `Selected period net income: ${formatCurrency(input.highlights.netIncome ?? null)}`,
      ],
      action: "Prioritize collections, delay discretionary expenses, and review upcoming obligations before cash tightens further.",
    })
    score -= 12
    drivers.push("Negative operating cash flow weakens near-term runway.")
  } else if ((operatingCashFlow?.value ?? 0) > 0) {
    executiveBullets.push(`Operations generated ${formatCurrency(operatingCashFlow?.value ?? null)} of cash in the selected period.`)
    score += 3
  }

  if ((revenue?.changePercent ?? 0) <= -12) {
    alerts.push({
      id: "revenue-drop",
      severity: "high",
      title: "Revenue is materially down versus last month",
      body: `Revenue changed ${formatPercent(revenue?.changePercent ?? null)} month over month, which is large enough to pressure margin if spending stays flat.`,
      metric: revenue?.label,
      evidence: [
        `Current revenue: ${formatCurrency(revenue?.value ?? null)}`,
        `Previous revenue: ${formatCurrency(revenue?.previousValue ?? null)}`,
      ],
      action: "Freeze optional spend and review customer retention or sales pipeline immediately.",
    })
    score -= 10
    drivers.push("Revenue decline is creating pressure on the rest of the model.")
  } else if ((revenue?.changePercent ?? 0) >= 10) {
    alerts.push({
      id: "revenue-up",
      severity: "positive",
      title: "Revenue momentum is improving",
      body: `Revenue is up ${formatPercent(revenue?.changePercent ?? null)} versus last month.`,
      metric: revenue?.label,
      evidence: [
        `Current revenue: ${formatCurrency(revenue?.value ?? null)}`,
        `Previous revenue: ${formatCurrency(revenue?.previousValue ?? null)}`,
      ],
      action: "Use the growth to improve cash reserves before expanding recurring expenses.",
    })
    score += 4
  }

  if ((expenses?.changePercent ?? 0) >= 15) {
    alerts.push({
      id: "expense-spike",
      severity: "medium",
      title: "Expense growth is outpacing normal range",
      body: `Monthly expenses are up ${formatPercent(expenses?.changePercent ?? null)} versus last month.`,
      metric: expenses?.label,
      evidence: [
        `Current expenses: ${formatCurrency(expenses?.value ?? null)}`,
        `Previous expenses: ${formatCurrency(expenses?.previousValue ?? null)}`,
      ],
      action: "Audit the top expense drivers to confirm the increase is intentional and recurring.",
    })
    score -= 8
    drivers.push("Expense growth is elevated relative to the prior month.")
  }

  if (consecutiveRevenueDecline) {
    alerts.push({
      id: "revenue-trend-down",
      severity: "high",
      title: "Revenue has declined three months in a row",
      body: "The monthly trend line shows a sustained falloff rather than a one-month dip.",
      evidence: input.monthlyTrend.slice(-3).map((point) => `${point.label}: ${formatCurrency(point.revenue)}`),
      action: "Treat this as a business trend, not a bookkeeping issue, and tighten forecasting assumptions.",
    })
    score -= 10
    drivers.push("Three consecutive months of revenue decline lowers the stability score.")
  }

  if ((liabilityRatio ?? 0) >= 0.7) {
    alerts.push({
      id: "liability-pressure",
      severity: "medium",
      title: "Liabilities are heavy relative to assets",
      body: `Liabilities are running at ${formatPercent((liabilityRatio ?? 0) * 100)} of total assets.`,
      metric: liabilities?.label,
      evidence: [
        `Assets: ${formatCurrency(assets?.value ?? null)}`,
        `Liabilities: ${formatCurrency(liabilities?.value ?? null)}`,
      ],
      action: "Monitor debt service and upcoming vendor obligations before adding new commitments.",
    })
    score -= 8
  }

  const topExpense = input.topExpenses[0]
  if (topExpense?.value !== null && revenue?.value && topExpense.value && revenue.value > 0) {
    const topExpenseShare = topExpense.value / revenue.value
    if (topExpenseShare >= 0.2) {
      opportunities.push({
        title: `Review ${topExpense.label}`,
        body: `${topExpense.label} is currently consuming a large share of revenue.`,
        impact: `${formatPercent(topExpenseShare * 100)} of current monthly revenue`,
      })
    }
  }

  if ((margin ?? 0) > 0.15) {
    opportunities.push({
      title: "Set aside tax reserves automatically",
      body: "Current profit levels support a disciplined reserve instead of letting cash accumulate without a plan.",
      impact: `Estimated reserve base: ${formatCurrency((netIncome?.value ?? 0) * 0.25)}`,
    })
    score += 3
  } else if (margin !== null && margin < 0.08) {
    opportunities.push({
      title: "Margin is too thin for comfort",
      body: "Small revenue swings can erase profitability at the current margin profile.",
      impact: `Current margin: ${formatPercent(margin * 100)}`,
    })
  }

  if ((input.highlights.grossProfit ?? 0) > 0 && revenue?.value) {
    const grossMargin = (input.highlights.grossProfit ?? 0) / revenue.value
    executiveBullets.push(`Gross margin is running near ${formatPercent(grossMargin * 100)} for the selected period.`)
    if (grossMargin < 0.45) {
      opportunities.push({
        title: "Improve gross margin before overhead grows",
        body: "Core delivery costs are taking too much of each revenue dollar.",
        impact: `Gross margin currently around ${formatPercent(grossMargin * 100)}`,
      })
      score -= 4
    }
  }

  if (weeklyRevenueDelta !== null) {
    executiveBullets.push(`Latest weekly snapshot moved ${formatCurrency(weeklyRevenueDelta)} in revenue versus the prior saved week.`)
  }
  if (weeklyIncomeDelta !== null) {
    executiveBullets.push(`Weekly net income changed ${formatCurrency(weeklyIncomeDelta)} compared with the previous digest cycle.`)
  }

  const executiveBrief = buildExecutiveBrief({
    revenueChange: revenue?.changePercent ?? null,
    expenseChange: expenses?.changePercent ?? null,
    netIncome: netIncome?.value ?? null,
    operatingCashFlow: operatingCashFlow?.value ?? null,
    bullets: executiveBullets,
    hasCriticalAlert: alerts.some((alert) => alert.severity === "critical"),
  })

  const automationScore = buildAutomationScore(score, drivers, alerts)

  return {
    executiveBrief,
    alerts: prioritizeAlerts(alerts),
    opportunities: opportunities.slice(0, 4),
    automationScore,
  }
}

function buildExecutiveBrief(input: {
  revenueChange: number | null
  expenseChange: number | null
  netIncome: number | null
  operatingCashFlow: number | null
  bullets: string[]
  hasCriticalAlert: boolean
}): ExecutiveBrief {
  let headline = "Business performance is stable with room to automate further"
  let summary = "Revenue, expense, and cash signals are within a manageable range, so the platform can keep surfacing recommendations instead of exceptions."

  if (input.hasCriticalAlert) {
    headline = "Immediate margin attention is required"
    summary = "The current data shows profitability pressure severe enough to warrant immediate action on spending and cash protection."
  } else if ((input.revenueChange ?? 0) >= 10 && (input.netIncome ?? 0) > 0) {
    headline = "Growth is showing up in both revenue and profit"
    summary = "The business is expanding without losing control of profitability, which is the best-case automation signal."
  } else if ((input.operatingCashFlow ?? 0) < 0) {
    headline = "Cash discipline matters more than accounting profit right now"
    summary = "Even if the P&L is acceptable, negative operating cash flow means collections and timing need close monitoring."
  }

  const bullets = input.bullets.slice(0, 4)
  if (bullets.length < 3) {
    if (input.revenueChange !== null) bullets.push(`Revenue changed ${formatPercent(input.revenueChange)} versus last month.`)
    if (input.expenseChange !== null) bullets.push(`Expenses changed ${formatPercent(input.expenseChange)} versus last month.`)
    if (input.netIncome !== null) bullets.push(`Current monthly net income is ${formatCurrency(input.netIncome)}.`)
  }

  return {
    headline,
    summary,
    bullets: bullets.slice(0, 4),
  }
}

function buildAutomationScore(base: number, drivers: string[], alerts: InsightAlert[]): AutomationScore {
  const score = Math.max(28, Math.min(98, Math.round(base)))
  const criticalCount = alerts.filter((alert) => alert.severity === "critical" || alert.severity === "high").length

  let label = "Automation Ready"
  let summary = "The books are stable enough for the platform to focus on optimization, not firefighting."

  if (score < 55) {
    label = "Needs Intervention"
    summary = "The current pattern has enough volatility that alerts should be treated as operating issues, not just reporting notes."
  } else if (score < 72) {
    label = "Watch Closely"
    summary = "Automation is working, but the business is showing enough pressure that recurring review matters."
  }

  if (criticalCount >= 2) {
    summary = "Multiple high-risk signals are active, so the system is prioritizing protection over optimization."
  }

  return {
    score,
    label,
    summary,
    drivers: drivers.slice(0, 4),
  }
}

function prioritizeAlerts(alerts: InsightAlert[]) {
  const order: Record<InsightAlert["severity"], number> = {
    critical: 0,
    high: 1,
    medium: 2,
    positive: 3,
  }

  return alerts
    .sort((a, b) => order[a.severity] - order[b.severity])
    .slice(0, 6)
}

function pickMetric(metrics: MetricLike[], key: string) {
  return metrics.find((metric) => metric.key === key) ?? null
}

function delta(current: number | null, previous: number | null) {
  if (current === null || previous === null) return null
  return current - previous
}

function formatCurrency(value: number | null) {
  if (value === null || Number.isNaN(value)) return "—"
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value)
}

function formatPercent(value: number | null) {
  if (value === null || Number.isNaN(value)) return "—"
  const abs = Math.abs(value)
  return `${value < 0 ? "-" : ""}${abs.toFixed(1)}%`
}
