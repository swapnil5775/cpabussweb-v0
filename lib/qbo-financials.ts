type QBOCol = { value?: string | null }
type QBORow = {
  type?: string
  ColData?: QBOCol[]
  Header?: { ColData?: QBOCol[] }
  Summary?: { ColData?: QBOCol[] }
  Rows?: { Row?: QBORow[] }
}

export type FinancialReportId = "profit-loss" | "balance-sheet" | "cash-flow"

export type FinancialReportRow = {
  label: string
  values: string[]
  depth: number
  rowType: "section" | "data" | "summary"
  section?: string | null
}

export type ParsedFinancialReport = {
  title: string
  columns: string[]
  rows: FinancialReportRow[]
}

export type FinancialOverviewItem = {
  key: string
  label: string
  value: number | null
  previousValue?: number | null
  changePercent?: number | null
  tone?: "good" | "neutral" | "warn"
  format?: "currency" | "percent"
}

export type FinancialTrendPoint = {
  label: string
  revenue: number | null
  expenses: number | null
  netIncome: number | null
}

function getColValue(col?: QBOCol): string {
  return (col?.value ?? "").trim()
}

function firstFilled(cols?: QBOCol[]): string {
  return (cols ?? []).map(getColValue).find(Boolean) ?? ""
}

function remainingValues(cols?: QBOCol[]): string[] {
  return (cols ?? []).slice(1).map((col) => getColValue(col))
}

function pushSummaryRow(rows: FinancialReportRow[], summaryCols: QBOCol[] | undefined, depth: number, section?: string | null) {
  const label = firstFilled(summaryCols)
  const values = remainingValues(summaryCols)
  if (!label || values.every((value) => value === "")) return

  rows.push({
    label,
    values,
    depth,
    rowType: "summary",
    section,
  })
}

function flattenRows(input: QBORow[] | undefined, depth = 0, section?: string | null): FinancialReportRow[] {
  const rows: FinancialReportRow[] = []

  for (const row of input ?? []) {
    const sectionLabel = firstFilled(row.Header?.ColData)

    if (row.type === "Section") {
      if (sectionLabel) {
        rows.push({
          label: sectionLabel,
          values: remainingValues(row.Header?.ColData),
          depth,
          rowType: "section",
          section,
        })
      }

      rows.push(...flattenRows(row.Rows?.Row, depth + 1, sectionLabel || section))
      pushSummaryRow(rows, row.Summary?.ColData, depth + 1, sectionLabel || section)
      continue
    }

    const label = firstFilled(row.ColData)
    const values = remainingValues(row.ColData)
    if (label || values.some(Boolean)) {
      rows.push({
        label: label || "Untitled",
        values,
        depth,
        rowType: "data",
        section,
      })
    }

    pushSummaryRow(rows, row.Summary?.ColData, depth, section)
  }

  return rows
}

export function parseFinancialReport(data: Record<string, unknown>): ParsedFinancialReport {
  const title =
    (data.Header as { ReportName?: string; ReportBasis?: string } | undefined)?.ReportName ??
    "Report"

  const columns = (
    (data.Columns as { Column?: Array<{ ColTitle?: string; MetaData?: Array<{ Value?: string }> }> } | undefined)?.Column ??
    []
  ).map((column, index) => {
    const label = (column.ColTitle ?? "").trim()
    if (label) return label
    const meta = column.MetaData?.map((entry) => entry.Value?.trim() ?? "").find(Boolean)
    return meta || (index === 0 ? "Category" : `Column ${index + 1}`)
  })

  return {
    title,
    columns: columns.length > 0 ? columns : ["Category", "Amount"],
    rows: flattenRows((data.Rows as { Row?: QBORow[] } | undefined)?.Row),
  }
}

export function parseMoney(value?: string | null): number | null {
  if (!value) return null
  const trimmed = value.trim()
  if (!trimmed) return null

  const negative = trimmed.startsWith("(") && trimmed.endsWith(")")
  const normalized = trimmed.replace(/[$,%(),]/g, "")
  const parsed = Number.parseFloat(normalized)
  if (Number.isNaN(parsed)) return null
  return negative ? -parsed : parsed
}

export function findReportValue(rows: FinancialReportRow[], patterns: RegExp[], exclusions: RegExp[] = []): number | null {
  for (const row of rows) {
    if (row.rowType !== "summary") continue
    const label = row.label.toLowerCase()
    if (!patterns.some((pattern) => pattern.test(label))) continue
    if (exclusions.some((pattern) => pattern.test(label))) continue
    const value = parseMoney(row.values.at(-1) ?? row.values[0] ?? "")
    if (value !== null) return value
  }

  return null
}

export function pickRevenue(rows: FinancialReportRow[]): number | null {
  return findReportValue(
    rows,
    [/total income/i, /^income$/i, /total revenue/i, /^revenue$/i, /sales/i],
    [/gross/i, /net/i, /other income/i]
  )
}

export function pickExpenses(rows: FinancialReportRow[]): number | null {
  return findReportValue(rows, [/total expenses/i, /^expenses$/i], [/income/i])
}

export function pickNetIncome(rows: FinancialReportRow[]): number | null {
  return findReportValue(rows, [/net income/i, /net operating income/i])
}

export function pickBalanceSummary(rows: FinancialReportRow[]) {
  return {
    assets: findReportValue(rows, [/total assets/i, /^assets$/i]),
    liabilities: findReportValue(rows, [/total liabilities/i, /^liabilities$/i]),
    equity: findReportValue(rows, [/total equity/i, /^equity$/i, /total equity and liabilities/i], [/liabilities/i]),
  }
}

export function pickOperatingCashFlow(rows: FinancialReportRow[]): number | null {
  return findReportValue(rows, [/net cash provided by operating activities/i, /net cash from operating activities/i])
}

export function pickTopExpenses(rows: FinancialReportRow[], limit = 6) {
  return rows
    .filter((row) => row.rowType === "data")
    .map((row) => ({
      label: row.label,
      value: parseMoney(row.values.at(-1) ?? row.values[0] ?? ""),
      section: row.section ?? "",
    }))
    .filter((row) => row.value !== null)
    .filter((row) => /expense|expenses|operating expenses|cost of goods sold/i.test(row.section))
    .filter((row) => !/^total /i.test(row.label))
    .sort((a, b) => Math.abs(b.value ?? 0) - Math.abs(a.value ?? 0))
    .slice(0, limit)
}

export function toPercentChange(current: number | null, previous: number | null): number | null {
  if (current === null || previous === null || previous === 0) return null
  return ((current - previous) / Math.abs(previous)) * 100
}

export function reportToCsv(report: ParsedFinancialReport): string {
  const header = report.columns
  const lines = [header.map(csvEscape).join(",")]

  for (const row of report.rows) {
    const values = [
      `${"  ".repeat(row.depth)}${row.label}`,
      ...row.values,
    ]
    lines.push(values.map(csvEscape).join(","))
  }

  return lines.join("\n")
}

function csvEscape(value: string): string {
  const safe = value.replace(/"/g, "\"\"")
  return /[",\n]/.test(safe) ? `"${safe}"` : safe
}
