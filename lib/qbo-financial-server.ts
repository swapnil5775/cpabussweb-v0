import { qboFetch } from "@/lib/qbo"
import {
  findReportValue,
  parseFinancialReport,
  pickBalanceSummary,
  pickExpenses,
  pickNetIncome,
  pickOperatingCashFlow,
  pickRevenue,
  pickTopExpenses,
  type FinancialReportId,
  type FinancialTrendPoint,
  type ParsedFinancialReport,
} from "@/lib/qbo-financials"

export type DateRange = {
  start: string
  end: string
  label: string
}

type FinancialOverview = Array<{
  key: string
  label: string
  value: number | null
  previousValue?: number | null
  changePercent?: number | null
  tone?: "good" | "neutral" | "warn"
  format?: "currency" | "percent"
}>

export type FinancialSummaryPayload = {
  overview: FinancialOverview
  monthlyTrend: FinancialTrendPoint[]
  topExpenses: Array<{ label: string; value: number | null; section?: string }>
  highlights: {
    grossProfit: number | null
    netIncome: number | null
    equity: number | null
  }
  reportData: ParsedFinancialReport | null
}

const REPORT_PATHS: Record<FinancialReportId, string> = {
  "profit-loss": "ProfitAndLoss",
  "balance-sheet": "BalanceSheet",
  "cash-flow": "CashFlow",
}

export async function buildFinancialSummary(userId: string, organizationId: string | null, reportId: FinancialReportId, period: string): Promise<FinancialSummaryPayload> {
  const selectedRange = getDateRange(period)
  const currentMonthRange = getDateRange("month")
  const previousMonthRange = getPreviousMonthRange()
  const trendRanges = getTrailingMonthRanges(6)

  const [
    selectedReportResponse,
    selectedProfitLossResponse,
    currentMonthPLResponse,
    previousMonthPLResponse,
    currentBalanceSheetResponse,
    previousBalanceSheetResponse,
    selectedCashFlowResponse,
    trendResponses,
  ] = await Promise.all([
    fetchQBOFinancialReport(userId, organizationId, reportId, selectedRange),
    reportId === "profit-loss" ? Promise.resolve(null) : fetchQBOFinancialReport(userId, organizationId, "profit-loss", selectedRange),
    fetchQBOFinancialReport(userId, organizationId, "profit-loss", currentMonthRange),
    fetchQBOFinancialReport(userId, organizationId, "profit-loss", previousMonthRange),
    fetchQBOFinancialReport(userId, organizationId, "balance-sheet", { start: currentMonthRange.start, end: currentMonthRange.end, label: currentMonthRange.label }),
    fetchQBOFinancialReport(userId, organizationId, "balance-sheet", { start: previousMonthRange.start, end: previousMonthRange.end, label: previousMonthRange.label }),
    fetchQBOFinancialReport(userId, organizationId, "cash-flow", selectedRange),
    Promise.all(trendRanges.map((range) => fetchQBOFinancialReport(userId, organizationId, "profit-loss", range))),
  ])

  const selectedReport = selectedReportResponse ? parseFinancialReport(selectedReportResponse) : null
  const selectedProfitLoss = selectedProfitLossResponse ? parseFinancialReport(selectedProfitLossResponse) : selectedReport
  const currentMonthPL = currentMonthPLResponse ? parseFinancialReport(currentMonthPLResponse) : null
  const previousMonthPL = previousMonthPLResponse ? parseFinancialReport(previousMonthPLResponse) : null
  const currentBalanceSheet = currentBalanceSheetResponse ? parseFinancialReport(currentBalanceSheetResponse) : null
  const previousBalanceSheet = previousBalanceSheetResponse ? parseFinancialReport(previousBalanceSheetResponse) : null
  const selectedCashFlow = selectedCashFlowResponse ? parseFinancialReport(selectedCashFlowResponse) : null

  const currentRevenue = currentMonthPL ? pickRevenue(currentMonthPL.rows) : null
  const previousRevenue = previousMonthPL ? pickRevenue(previousMonthPL.rows) : null
  const currentExpenses = currentMonthPL ? pickExpenses(currentMonthPL.rows) : null
  const previousExpenses = previousMonthPL ? pickExpenses(previousMonthPL.rows) : null
  const currentNetIncome = currentMonthPL ? pickNetIncome(currentMonthPL.rows) : null
  const previousNetIncome = previousMonthPL ? pickNetIncome(previousMonthPL.rows) : null
  const currentBalance = currentBalanceSheet ? pickBalanceSummary(currentBalanceSheet.rows) : null
  const previousBalance = previousBalanceSheet ? pickBalanceSummary(previousBalanceSheet.rows) : null
  const operatingCashFlow = selectedCashFlow ? pickOperatingCashFlow(selectedCashFlow.rows) : null

  return {
    overview: [
      {
        key: "revenue",
        label: "Revenue This Month",
        value: currentRevenue,
        previousValue: previousRevenue,
        changePercent: toPercentChange(currentRevenue, previousRevenue),
        tone: "good",
        format: "currency",
      },
      {
        key: "expenses",
        label: "Expenses This Month",
        value: currentExpenses,
        previousValue: previousExpenses,
        changePercent: toPercentChange(currentExpenses, previousExpenses),
        tone: "neutral",
        format: "currency",
      },
      {
        key: "net-income",
        label: "Net Income This Month",
        value: currentNetIncome,
        previousValue: previousNetIncome,
        changePercent: toPercentChange(currentNetIncome, previousNetIncome),
        tone: currentNetIncome !== null && currentNetIncome >= 0 ? "good" : "warn",
        format: "currency",
      },
      {
        key: "assets",
        label: "Total Assets",
        value: currentBalance?.assets ?? null,
        previousValue: previousBalance?.assets ?? null,
        changePercent: toPercentChange(currentBalance?.assets ?? null, previousBalance?.assets ?? null),
        tone: "neutral",
        format: "currency",
      },
      {
        key: "liabilities",
        label: "Total Liabilities",
        value: currentBalance?.liabilities ?? null,
        previousValue: previousBalance?.liabilities ?? null,
        changePercent: toPercentChange(currentBalance?.liabilities ?? null, previousBalance?.liabilities ?? null),
        tone: "neutral",
        format: "currency",
      },
      {
        key: "operating-cash-flow",
        label: "Operating Cash Flow",
        value: operatingCashFlow,
        changePercent: null,
        tone: operatingCashFlow !== null && operatingCashFlow >= 0 ? "good" : "warn",
        format: "currency",
      },
    ],
    monthlyTrend: trendResponses.map((reportData, index) => {
      const parsed = reportData ? parseFinancialReport(reportData) : null
      const range = trendRanges[index]
      return {
        label: range.label,
        revenue: parsed ? pickRevenue(parsed.rows) : null,
        expenses: parsed ? pickExpenses(parsed.rows) : null,
        netIncome: parsed ? pickNetIncome(parsed.rows) : null,
      }
    }),
    topExpenses: selectedProfitLoss ? pickTopExpenses(selectedProfitLoss.rows) : [],
    highlights: {
      grossProfit: selectedProfitLoss ? findReportValue(selectedProfitLoss.rows, [/gross profit/i]) : null,
      netIncome: selectedProfitLoss ? pickNetIncome(selectedProfitLoss.rows) : null,
      equity: currentBalance?.equity ?? null,
    },
    reportData: selectedReport,
  }
}

export type WeeklySnapshotPayload = {
  currentWeek: {
    range: DateRange
    profitLoss: ParsedFinancialReport | null
    balanceSheet: ParsedFinancialReport | null
    cashFlow: ParsedFinancialReport | null
    metrics: {
      revenue: number | null
      expenses: number | null
      netIncome: number | null
      assets: number | null
      liabilities: number | null
      equity: number | null
      operatingCashFlow: number | null
    }
    topExpenses: Array<{ label: string; value: number | null; section?: string }>
  }
  previousWeek: {
    range: DateRange
    metrics: {
      revenue: number | null
      expenses: number | null
      netIncome: number | null
      assets: number | null
      liabilities: number | null
      equity: number | null
      operatingCashFlow: number | null
    }
  }
}

export async function buildWeeklySnapshot(userId: string, organizationId: string | null): Promise<WeeklySnapshotPayload> {
  const currentWeek = getLastCompletedWeekRange()
  const previousWeek = getPriorWeekRange(currentWeek)

  const [
    currentPLResponse,
    previousPLResponse,
    currentBSResponse,
    previousBSResponse,
    currentCashFlowResponse,
    previousCashFlowResponse,
  ] = await Promise.all([
    fetchQBOFinancialReport(userId, organizationId, "profit-loss", currentWeek),
    fetchQBOFinancialReport(userId, organizationId, "profit-loss", previousWeek),
    fetchQBOFinancialReport(userId, organizationId, "balance-sheet", currentWeek),
    fetchQBOFinancialReport(userId, organizationId, "balance-sheet", previousWeek),
    fetchQBOFinancialReport(userId, organizationId, "cash-flow", currentWeek),
    fetchQBOFinancialReport(userId, organizationId, "cash-flow", previousWeek),
  ])

  const currentPL = currentPLResponse ? parseFinancialReport(currentPLResponse) : null
  const previousPL = previousPLResponse ? parseFinancialReport(previousPLResponse) : null
  const currentBS = currentBSResponse ? parseFinancialReport(currentBSResponse) : null
  const previousBS = previousBSResponse ? parseFinancialReport(previousBSResponse) : null
  const currentCashFlow = currentCashFlowResponse ? parseFinancialReport(currentCashFlowResponse) : null
  const previousCashFlow = previousCashFlowResponse ? parseFinancialReport(previousCashFlowResponse) : null

  const currentBalance = currentBS ? pickBalanceSummary(currentBS.rows) : null
  const previousBalance = previousBS ? pickBalanceSummary(previousBS.rows) : null

  return {
    currentWeek: {
      range: currentWeek,
      profitLoss: currentPL,
      balanceSheet: currentBS,
      cashFlow: currentCashFlow,
      metrics: {
        revenue: currentPL ? pickRevenue(currentPL.rows) : null,
        expenses: currentPL ? pickExpenses(currentPL.rows) : null,
        netIncome: currentPL ? pickNetIncome(currentPL.rows) : null,
        assets: currentBalance?.assets ?? null,
        liabilities: currentBalance?.liabilities ?? null,
        equity: currentBalance?.equity ?? null,
        operatingCashFlow: currentCashFlow ? pickOperatingCashFlow(currentCashFlow.rows) : null,
      },
      topExpenses: currentPL ? pickTopExpenses(currentPL.rows) : [],
    },
    previousWeek: {
      range: previousWeek,
      metrics: {
        revenue: previousPL ? pickRevenue(previousPL.rows) : null,
        expenses: previousPL ? pickExpenses(previousPL.rows) : null,
        netIncome: previousPL ? pickNetIncome(previousPL.rows) : null,
        assets: previousBalance?.assets ?? null,
        liabilities: previousBalance?.liabilities ?? null,
        equity: previousBalance?.equity ?? null,
        operatingCashFlow: previousCashFlow ? pickOperatingCashFlow(previousCashFlow.rows) : null,
      },
    },
  }
}

export async function fetchQBOFinancialReport(userId: string, organizationId: string | null, reportId: FinancialReportId, range: DateRange) {
  const params = new URLSearchParams({ minorversion: "65" })
  if (reportId === "balance-sheet") {
    params.set("date", range.end)
  } else {
    params.set("start_date", range.start)
    params.set("end_date", range.end)
  }

  const response = await qboFetch(userId, organizationId, `/reports/${REPORT_PATHS[reportId]}?${params.toString()}`)
  if (!response?.ok) return null
  return response.json()
}

export function normalizeReport(value: string | null): FinancialReportId {
  if (value === "balance-sheet" || value === "cash-flow") return value
  return "profit-loss"
}

export function getDateRange(period: string): DateRange {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth()

  switch (period) {
    case "month":
      return {
        start: formatDate(new Date(currentYear, currentMonth, 1)),
        end: formatDate(new Date(currentYear, currentMonth + 1, 0)),
        label: "This Month",
      }
    case "quarter":
      return {
        start: formatDate(new Date(currentYear, currentMonth - 2, 1)),
        end: formatDate(new Date(currentYear, currentMonth + 1, 0)),
        label: "Last 3 Months",
      }
    case "ytd":
      return {
        start: formatDate(new Date(currentYear, 0, 1)),
        end: formatDate(new Date(currentYear, currentMonth + 1, 0)),
        label: "Year to Date",
      }
    default:
      return {
        start: formatDate(new Date(currentYear, currentMonth - 5, 1)),
        end: formatDate(new Date(currentYear, currentMonth + 1, 0)),
        label: "Last 6 Months",
      }
  }
}

export function getTrailingMonthRanges(count: number): DateRange[] {
  const now = new Date()
  return Array.from({ length: count }).map((_, offset) => {
    const monthOffset = count - offset - 1
    const date = new Date(now.getFullYear(), now.getMonth() - monthOffset, 1)
    return {
      start: formatDate(new Date(date.getFullYear(), date.getMonth(), 1)),
      end: formatDate(new Date(date.getFullYear(), date.getMonth() + 1, 0)),
      label: date.toLocaleDateString("en-US", { month: "short" }),
    }
  })
}

function getPreviousMonthRange(): DateRange {
  const now = new Date()
  return {
    start: formatDate(new Date(now.getFullYear(), now.getMonth() - 1, 1)),
    end: formatDate(new Date(now.getFullYear(), now.getMonth(), 0)),
    label: "Last Month",
  }
}

function getLastCompletedWeekRange(): DateRange {
  const today = new Date()
  const currentWeekday = today.getDay()
  const end = new Date(today)
  const daysSinceSunday = currentWeekday === 0 ? 7 : currentWeekday
  end.setDate(today.getDate() - daysSinceSunday)

  const start = new Date(end)
  start.setDate(end.getDate() - 6)

  return {
    start: formatDate(start),
    end: formatDate(end),
    label: `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${end.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
  }
}

function getPriorWeekRange(reference: DateRange): DateRange {
  const end = new Date(reference.start)
  end.setDate(end.getDate() - 1)
  const start = new Date(end)
  start.setDate(end.getDate() - 6)

  return {
    start: formatDate(start),
    end: formatDate(end),
    label: `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${end.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
  }
}

function formatDate(value: Date) {
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`
}

function toPercentChange(current: number | null, previous: number | null): number | null {
  if (current === null || previous === null || previous === 0) return null
  return ((current - previous) / Math.abs(previous)) * 100
}
