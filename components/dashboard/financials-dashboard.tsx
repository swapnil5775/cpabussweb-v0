"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import {
  ArrowDownRight,
  ArrowUpRight,
  Building2,
  Download,
  FileBarChart,
  LineChart,
  LoaderCircle,
  RefreshCw,
  TrendingDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type ReportId = "profit-loss" | "balance-sheet" | "cash-flow"
type PeriodId = "month" | "quarter" | "ytd" | "last6"

type FinancialsResponse = {
  connected: boolean
  company_name?: string
  connected_at?: string
  generated_at?: string
  range?: { start: string; end: string; label: string }
  overview?: Array<{
    key: string
    label: string
    value: number | null
    previousValue?: number | null
    changePercent?: number | null
    tone?: "good" | "neutral" | "warn"
    format?: "currency" | "percent"
  }>
  monthlyTrend?: Array<{
    label: string
    revenue: number | null
    expenses: number | null
    netIncome: number | null
  }>
  topExpenses?: Array<{ label: string; value: number | null; section?: string }>
  snapshots?: Array<{
    snapshot_date: string
    period_label: string | null
    revenue: number | null
    expenses: number | null
    net_income: number | null
    operating_cash_flow: number | null
  }>
  reportData?: {
    title: string
    columns: string[]
    rows: Array<{
      label: string
      values: string[]
      depth: number
      rowType: "section" | "data" | "summary"
      section?: string | null
    }>
  } | null
  highlights?: {
    grossProfit?: number | null
    netIncome?: number | null
    equity?: number | null
  }
}

const REPORT_OPTIONS: Array<{ value: ReportId; label: string }> = [
  { value: "profit-loss", label: "Profit & Loss" },
  { value: "balance-sheet", label: "Balance Sheet" },
  { value: "cash-flow", label: "Cash Flow" },
]

const PERIOD_OPTIONS: Array<{ value: PeriodId; label: string }> = [
  { value: "month", label: "This Month" },
  { value: "quarter", label: "Last 3 Months" },
  { value: "ytd", label: "Year to Date" },
  { value: "last6", label: "Last 6 Months" },
]

export function FinancialsDashboard() {
  const [report, setReport] = useState<ReportId>("profit-loss")
  const [period, setPeriod] = useState<PeriodId>("last6")
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<FinancialsResponse | null>(null)
  const [refreshNonce, setRefreshNonce] = useState(0)

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    fetch(`/api/qbo/financials?report=${report}&period=${period}`)
      .then((response) => response.json())
      .then((payload: FinancialsResponse) => {
        if (!cancelled) setData(payload)
      })
      .catch(() => {
        if (!cancelled) setData({ connected: false })
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [period, refreshNonce, report])

  const exportHref = `/api/qbo/financials?report=${report}&period=${period}&format=csv`
  const pdfHref = `/api/qbo/financials?report=${report}&period=${period}&format=pdf`

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <div className="h-7 w-48 rounded bg-muted animate-pulse" />
            <div className="mt-2 h-4 w-72 rounded bg-muted/70 animate-pulse" />
          </div>
          <div className="flex gap-2">
            <div className="h-9 w-36 rounded bg-muted animate-pulse" />
            <div className="h-9 w-36 rounded bg-muted animate-pulse" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-32 rounded-2xl border bg-card animate-pulse" />
          ))}
        </div>
        <div className="h-96 rounded-2xl border bg-card animate-pulse" />
      </div>
    )
  }

  if (!data?.connected) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>Connect QuickBooks to unlock Financials</CardTitle>
          <CardDescription>
            Premium reporting needs a live QBO connection so the dashboard can pull your books, reports, and exports.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-3 flex-wrap">
          <Button asChild>
            <a href="/api/qbo/connect">Connect QuickBooks</a>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard">Back to Overview</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  const reportLabel = REPORT_OPTIONS.find((option) => option.value === report)?.label ?? "Report"
  const generatedAt = data.generated_at
    ? new Date(data.generated_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })
    : null

  return (
    <div className="space-y-6">
      <section className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight">Financials</h1>
            <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-500/20">Premium</Badge>
          </div>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Track the numbers your clients actually pay for: live QBO reports, richer summaries, trend lines, and export-ready financials.
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
            {data.company_name && (
              <span className="inline-flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5" />
                {data.company_name}
              </span>
            )}
            {data.range && <span>{data.range.label}</span>}
            {generatedAt && <span>Updated {generatedAt}</span>}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Select value={report} onValueChange={(value) => setReport(value as ReportId)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Choose report" />
            </SelectTrigger>
            <SelectContent>
              {REPORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={period} onValueChange={(value) => setPeriod(value as PeriodId)}>
            <SelectTrigger className="w-[170px]">
              <SelectValue placeholder="Choose period" />
            </SelectTrigger>
            <SelectContent>
              {PERIOD_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" asChild>
            <a href={exportHref}>
              <Download className="h-4 w-4" />
              Export CSV
            </a>
          </Button>

          <Button variant="outline" asChild>
            <a href={pdfHref}>
              <FileBarChart className="h-4 w-4" />
              Export PDF
            </a>
          </Button>

          <Button variant="ghost" onClick={() => setRefreshNonce((value) => value + 1)}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </section>

      {(data.snapshots ?? []).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Weekly Snapshot History</CardTitle>
            <CardDescription>
              Saved weekly rollups from Supabase. These are the records used for digest emails and week-over-week comparison.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {data.snapshots?.map((snapshot) => (
              <div key={snapshot.snapshot_date} className="rounded-2xl border p-4 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">
                    {snapshot.period_label ?? new Date(snapshot.snapshot_date).toLocaleDateString("en-US")}
                  </p>
                  <Badge variant="outline">
                    {new Date(snapshot.snapshot_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </Badge>
                </div>
                <div className="grid gap-1 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground">Revenue</span>
                    <span className="font-medium">{formatCurrency(snapshot.revenue)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground">Expenses</span>
                    <span className="font-medium">{formatCurrency(snapshot.expenses)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground">Net income</span>
                    <span className="font-medium">{formatCurrency(snapshot.net_income)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground">Op. cash flow</span>
                    <span className="font-medium">{formatCurrency(snapshot.operating_cash_flow)}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {(data.overview ?? []).map((item) => (
          <Card key={item.key} className="relative overflow-hidden">
            <CardHeader className="pb-3">
              <CardDescription>{item.label}</CardDescription>
              <CardTitle className="text-2xl">{formatMetric(item.value, item.format)}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between gap-3 text-xs">
              <div className="inline-flex items-center gap-1.5 text-muted-foreground">
                {renderChangeIcon(item.changePercent)}
                {formatChange(item.changePercent)}
              </div>
              {item.previousValue !== undefined && (
                <span className="text-muted-foreground">
                  Prev {formatMetric(item.previousValue ?? null, item.format)}
                </span>
              )}
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.5fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-4 w-4 text-primary" />
              Monthly Performance
            </CardTitle>
            <CardDescription>Six-month trend pulled directly from QBO profit and loss data.</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={buildTrendChartData(data.monthlyTrend ?? [])}>
                  <defs>
                    <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0f766e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0f766e" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="expenses" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="netIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} />
                  <YAxis tickFormatter={(value) => compactCurrency(value)} tickLine={false} axisLine={false} width={70} />
                  <Tooltip formatter={(value) => formatCurrency(typeof value === "number" ? value : Number(value))} />
                  <Area type="monotone" dataKey="revenue" stroke="#0f766e" fill="url(#revenue)" strokeWidth={2} />
                  <Area type="monotone" dataKey="expenses" stroke="#f97316" fill="url(#expenses)" strokeWidth={2} />
                  <Area type="monotone" dataKey="netIncome" stroke="#2563eb" fill="url(#netIncome)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-primary" />
                Top Expense Drivers
              </CardTitle>
              <CardDescription>Largest expense lines from the selected reporting period.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {(data.topExpenses ?? []).length > 0 ? (
                data.topExpenses?.map((expense) => (
                  <div key={expense.label} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{expense.label}</p>
                      {expense.section && (
                        <p className="text-xs text-muted-foreground truncate">{expense.section}</p>
                      )}
                    </div>
                    <span className="text-sm font-semibold tabular-nums">{formatCurrency(expense.value)}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  Switch to Profit &amp; Loss or wait for more categorized expense data to appear.
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-slate-950 text-slate-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileBarChart className="h-4 w-4 text-emerald-300" />
                Premium Highlights
              </CardTitle>
              <CardDescription className="text-slate-300">
                A cleaner client-facing view than exposing raw QuickBooks screens.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-300">Gross profit</span>
                <span className="font-semibold">{formatCurrency(data.highlights?.grossProfit ?? null)}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-300">Net income</span>
                <span className="font-semibold">{formatCurrency(data.highlights?.netIncome ?? null)}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-300">Equity</span>
                <span className="font-semibold">{formatCurrency(data.highlights?.equity ?? null)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>{reportLabel}</CardTitle>
            <CardDescription>
              Full report detail with section-level drill-down. Export stays aligned with the table below.
            </CardDescription>
          </div>
          {data.reportData?.title && (
            <Badge variant="outline" className="text-xs">
              {data.reportData.title}
            </Badge>
          )}
        </CardHeader>
        <CardContent>
          {data.reportData?.rows?.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[45%]">{data.reportData.columns[0] ?? "Category"}</TableHead>
                  {data.reportData.columns.slice(1).map((column) => (
                    <TableHead key={column} className="text-right">
                      {column}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.reportData.rows.map((row, index) => (
                  <TableRow key={`${row.label}-${index}`} className={row.rowType === "section" ? "bg-muted/35" : ""}>
                    <TableCell className={row.rowType === "summary" ? "font-semibold" : row.rowType === "section" ? "font-medium" : ""}>
                      <div style={{ paddingLeft: `${row.depth * 14}px` }} className="flex items-center gap-2">
                        {row.rowType === "summary" && <span className="h-2 w-2 rounded-full bg-primary" />}
                        <span>{row.label}</span>
                      </div>
                    </TableCell>
                    {row.values.map((value, valueIndex) => (
                      <TableCell
                        key={`${row.label}-${valueIndex}`}
                        className={`text-right tabular-nums ${row.rowType === "summary" ? "font-semibold" : "text-muted-foreground"}`}
                      >
                        {value || "—"}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="rounded-2xl border border-dashed px-6 py-10 text-center">
              <LoaderCircle className="h-6 w-6 mx-auto mb-3 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                The report is connected but QuickBooks has not returned line-item financial data for this period yet.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function buildTrendChartData(points: FinancialsResponse["monthlyTrend"]) {
  return (points ?? []).map((point) => ({
    label: point.label,
    revenue: point.revenue ?? 0,
    expenses: point.expenses ?? 0,
    netIncome: point.netIncome ?? 0,
  }))
}

function formatMetric(value: number | null, format: "currency" | "percent" | undefined) {
  if (format === "percent") {
    return value === null ? "—" : `${value.toFixed(1)}%`
  }
  return formatCurrency(value)
}

function formatCurrency(value: number | null) {
  if (value === null || Number.isNaN(value)) return "—"
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value)
}

function compactCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value)
}

function renderChangeIcon(changePercent: number | null | undefined) {
  if (changePercent === null || changePercent === undefined) return <RefreshCw className="h-3.5 w-3.5" />
  if (changePercent >= 0) return <ArrowUpRight className="h-3.5 w-3.5 text-emerald-600" />
  return <ArrowDownRight className="h-3.5 w-3.5 text-rose-600" />
}

function formatChange(changePercent: number | null | undefined) {
  if (changePercent === null || changePercent === undefined) return "No prior comparison"
  const abs = Math.abs(changePercent).toFixed(1)
  return `${abs}% vs last month`
}
