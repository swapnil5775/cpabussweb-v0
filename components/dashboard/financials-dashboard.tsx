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
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BadgeAlert,
  Bot,
  BrainCircuit,
  Building2,
  CheckCircle2,
  Download,
  FileBarChart,
  Gauge,
  LineChart,
  LoaderCircle,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
import { Separator } from "@/components/ui/separator"

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
    period_start?: string
    period_end?: string
    period_label: string | null
    revenue: number | null
    expenses: number | null
    net_income: number | null
    operating_cash_flow: number | null
    assets: number | null
    liabilities: number | null
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
  trust?: {
    source: string
    sourceSystem: string
    generatedAt: string
    reportPeriod: string
    qboConnectedAt?: string
    snapshotCount: number
    lastSnapshotDate?: string | null
    dataQualityScore: number
    dataQualityFlags: string[]
  }
  insights?: {
    executiveBrief: {
      headline: string
      summary: string
      bullets: string[]
    }
    alerts: Array<{
      id: string
      severity: "critical" | "high" | "medium" | "positive"
      title: string
      body: string
      metric?: string
      evidence?: string[]
      action: string
    }>
    opportunities: Array<{
      title: string
      body: string
      impact: string
    }>
    automationScore: {
      score: number
      label: string
      summary: string
      drivers: string[]
    }
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
      <div className="space-y-5">
        <div className="h-56 rounded-[32px] border bg-muted/40 animate-pulse" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-32 rounded-2xl border bg-card animate-pulse" />
          ))}
        </div>
        <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="h-96 rounded-2xl border bg-card animate-pulse" />
          <div className="h-96 rounded-2xl border bg-card animate-pulse" />
        </div>
      </div>
    )
  }

  if (!data?.connected) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>Connect QuickBooks to unlock Financials</CardTitle>
          <CardDescription>
            Premium reporting needs a live QBO connection so the dashboard can pull your books, reports, exports, and automated insights.
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
  const score = data.insights?.automationScore.score ?? 0

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(37,99,235,0.22),_transparent_28%),linear-gradient(135deg,_#0f172a,_#111827_55%,_#1f2937)] text-slate-50 shadow-xl">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.04),transparent)]" />
        <div className="relative grid gap-6 p-6 lg:grid-cols-[1.25fr_0.9fr] lg:p-8">
          <div className="space-y-5">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="border-emerald-400/25 bg-emerald-400/10 text-emerald-200">
                <Sparkles className="h-3 w-3" />
                Premium CFO Automation
              </Badge>
              <Badge className="border-slate-300/10 bg-slate-200/10 text-slate-200">
                <Bot className="h-3 w-3" />
                Fully Automated
              </Badge>
            </div>

            <div className="space-y-3">
              <h1 className="max-w-3xl text-3xl font-semibold tracking-tight md:text-4xl">
                {data.insights?.executiveBrief.headline ?? "Financial automation is active"}
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-300 md:text-base">
                {data.insights?.executiveBrief.summary ??
                  "Live QBO reports, alerts, and executive insight cards are generated automatically from your books."}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {(data.insights?.executiveBrief.bullets ?? []).slice(0, 4).map((bullet, index) => (
                <div key={index} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                    <p className="text-sm text-slate-100">{bullet}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-300 flex-wrap">
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

          <div className="grid gap-4">
            <Card className="border-white/10 bg-white/6 text-slate-50 shadow-none backdrop-blur">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Gauge className="h-4 w-4 text-emerald-300" />
                  Automation Score
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Deterministic score based on cash, margin, liabilities, and trend stability.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-4xl font-semibold">{score}</p>
                    <p className="text-sm text-slate-300">{data.insights?.automationScore.label}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/15 px-3 py-2 text-right">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Mode</p>
                    <p className="text-sm font-medium">Insight + Alerting</p>
                  </div>
                </div>
                <Progress value={score} className="h-2.5 bg-white/10 [&_[data-slot=progress-indicator]]:bg-emerald-400" />
                <p className="text-sm text-slate-300">{data.insights?.automationScore.summary}</p>
                <div className="space-y-2">
                  {(data.insights?.automationScore.drivers ?? []).map((driver, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm text-slate-200">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-300" />
                      <span>{driver}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-wrap gap-2">
              <Select value={report} onValueChange={(value) => setReport(value as ReportId)}>
                <SelectTrigger className="w-[180px] border-white/10 bg-white/6 text-slate-50">
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
                <SelectTrigger className="w-[170px] border-white/10 bg-white/6 text-slate-50">
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

              <Button variant="outline" className="border-white/10 bg-white/6 text-slate-50 hover:bg-white/10 hover:text-slate-50" asChild>
                <a href={exportHref}>
                  <Download className="h-4 w-4" />
                  CSV
                </a>
              </Button>
              <Button variant="outline" className="border-white/10 bg-white/6 text-slate-50 hover:bg-white/10 hover:text-slate-50" asChild>
                <a href={pdfHref}>
                  <FileBarChart className="h-4 w-4" />
                  PDF
                </a>
              </Button>
              <Button variant="ghost" className="text-slate-50 hover:bg-white/10 hover:text-slate-50" onClick={() => setRefreshNonce((value) => value + 1)}>
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {(data.overview ?? []).slice(0, 4).map((item) => (
          <Card key={item.key} className="overflow-hidden border-slate-200/80">
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

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="overflow-hidden">
          <CardHeader className="border-b bg-[linear-gradient(135deg,#f8fafc,#ecfeff)]">
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-sky-700" />
              Source of Truth
            </CardTitle>
            <CardDescription>
              This premium layer is derived from your connected accounting records, not dummy data or synthetic metrics.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 p-5 md:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-4">
              <div className="rounded-2xl border bg-background px-4 py-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Primary Source</p>
                    <p className="mt-1 font-semibold">{data.trust?.source ?? "QuickBooks Online"}</p>
                  </div>
                  <Badge className="bg-sky-500/10 text-sky-700 border-sky-500/20">
                    {data.trust?.sourceSystem ?? "QBO"}
                  </Badge>
                </div>
              </div>
              <div className="rounded-2xl border bg-background px-4 py-4">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Data Quality</p>
                    <p className="mt-1 text-3xl font-semibold">{data.trust?.dataQualityScore ?? 0}</p>
                  </div>
                  <Badge variant="outline">{qualityLabel(data.trust?.dataQualityScore ?? 0)}</Badge>
                </div>
                <Progress value={data.trust?.dataQualityScore ?? 0} className="mt-4 h-2.5" />
              </div>
            </div>

            <div className="grid gap-3">
              <TrustRow label="Report period" value={data.trust?.reportPeriod ?? data.range?.label ?? "—"} />
              <TrustRow label="Generated" value={formatDateTime(data.trust?.generatedAt ?? null)} />
              <TrustRow label="QBO connected" value={formatDateTime(data.trust?.qboConnectedAt ?? null)} />
              <TrustRow label="Weekly snapshots" value={String(data.trust?.snapshotCount ?? 0)} />
              <TrustRow label="Last snapshot" value={formatDateTime(data.trust?.lastSnapshotDate ?? null)} />
              <div className="rounded-2xl border bg-background px-4 py-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Data Quality Notes</p>
                <div className="mt-3 space-y-2">
                  {(data.trust?.dataQualityFlags ?? []).map((flag, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-sky-600" />
                      <span>{flag}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="border-b bg-[linear-gradient(135deg,#fff7ed,#fef2f2)]">
            <CardTitle className="flex items-center gap-2">
              <BrainCircuit className="h-4 w-4 text-amber-700" />
              Interpretation Layer
            </CardTitle>
            <CardDescription>
              Alerts and summary cards are rule-based interpretations of the QBO-backed metrics shown above.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-5">
            <div className="rounded-2xl border bg-background px-4 py-4">
              <p className="font-medium">What is factual</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Revenue, expenses, net income, balance sheet values, cash flow, snapshots, and report rows come directly from QuickBooks Online reports and stored weekly snapshots.
              </p>
            </div>
            <div className="rounded-2xl border bg-background px-4 py-4">
              <p className="font-medium">What is interpreted</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Automation score, alert severity, executive brief wording, and recommended actions are deterministic rules applied to those numbers. They are not fabricated values.
              </p>
            </div>
            <div className="rounded-2xl border bg-background px-4 py-4">
              <p className="font-medium">When to be cautious</p>
              <p className="mt-2 text-sm text-muted-foreground">
                If books are newly connected, unreconciled, or partially categorized, the insight layer may still be directionally useful but not yet final.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="overflow-hidden">
          <CardHeader className="border-b bg-slate-50/80">
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-rose-600" />
              Alert Center
            </CardTitle>
            <CardDescription>
              Automated exceptions and business health signals generated from your live metrics and saved snapshots.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-5">
            {(data.insights?.alerts ?? []).length > 0 ? (
              data.insights?.alerts.map((alert) => (
                <div key={alert.id} className={`rounded-2xl border p-4 ${alertTone(alert.severity)}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={alertBadgeClass(alert.severity)}>{alertLabel(alert.severity)}</Badge>
                        {alert.metric && <span className="text-xs text-muted-foreground">{alert.metric}</span>}
                      </div>
                      <p className="font-semibold">{alert.title}</p>
                      <p className="text-sm text-muted-foreground">{alert.body}</p>
                      {(alert.evidence ?? []).length > 0 && (
                        <div className="rounded-xl border bg-white/70 px-3 py-3">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Evidence</p>
                          <div className="mt-2 space-y-1.5">
                            {alert.evidence?.map((item, index) => (
                              <div key={index} className="flex items-start gap-2 text-xs text-muted-foreground">
                                <span className="mt-1.5 h-1 w-1 rounded-full bg-slate-500" />
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    {alert.severity === "positive"
                      ? <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                      : alert.severity === "critical"
                        ? <ShieldAlert className="h-5 w-5 shrink-0 text-rose-600" />
                        : <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />}
                  </div>
                  <Separator className="my-3" />
                  <p className="text-sm font-medium">{alert.action}</p>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed px-6 py-10 text-center">
                <CheckCircle2 className="mx-auto mb-3 h-6 w-6 text-emerald-600" />
                <p className="font-medium">No active alerts</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Current trend signals look stable enough that the system is not escalating any exceptions right now.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card className="overflow-hidden">
            <CardHeader className="border-b bg-[linear-gradient(135deg,#f8fafc,#eef2ff)]">
              <CardTitle className="flex items-center gap-2">
                <BrainCircuit className="h-4 w-4 text-indigo-600" />
                Executive Brief
              </CardTitle>
              <CardDescription>Plain-English summary generated automatically from the books.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-5">
              <div>
                <p className="text-lg font-semibold">{data.insights?.executiveBrief.headline}</p>
                <p className="mt-2 text-sm text-muted-foreground">{data.insights?.executiveBrief.summary}</p>
              </div>
              <div className="space-y-3">
                {(data.insights?.executiveBrief.bullets ?? []).map((bullet, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-indigo-500" />
                    <p className="text-sm">{bullet}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader className="border-b bg-[linear-gradient(135deg,#f0fdf4,#ecfeff)]">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-600" />
                Recommended Actions
              </CardTitle>
              <CardDescription>
                Automated opportunities surfaced from margin, cash, and expense behavior.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 p-5">
              {(data.insights?.opportunities ?? []).length > 0 ? (
                data.insights?.opportunities.map((item, index) => (
                  <div key={index} className="rounded-2xl border bg-background px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold">{item.title}</p>
                      <Badge variant="outline">{item.impact}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  The system does not see a strong optimization opportunity beyond the current active alerts.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.45fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-4 w-4 text-primary" />
              Monthly Performance
            </CardTitle>
            <CardDescription>Six-month trend across revenue, expenses, and net income.</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[340px]">
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
                      {expense.section && <p className="text-xs text-muted-foreground truncate">{expense.section}</p>}
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
                Core owner-facing signals the platform keeps current without requiring a human analyst.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
              <HighlightRow label="Gross profit" value={data.highlights?.grossProfit ?? null} />
              <HighlightRow label="Net income" value={data.highlights?.netIncome ?? null} />
              <HighlightRow label="Equity" value={data.highlights?.equity ?? null} />
              <HighlightRow label="Active alerts" value={data.insights?.alerts?.length ?? 0} numeric />
            </CardContent>
          </Card>
        </div>
      </section>

      {(data.snapshots ?? []).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BadgeAlert className="h-4 w-4 text-primary" />
              Weekly Snapshot History
            </CardTitle>
            <CardDescription>
              Saved weekly rollups in Supabase used by digest emails and recurring automated comparisons.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {data.snapshots?.map((snapshot) => (
              <div key={snapshot.snapshot_date} className="rounded-2xl border p-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">
                    {snapshot.period_label ?? new Date(snapshot.snapshot_date).toLocaleDateString("en-US")}
                  </p>
                  <Badge variant="outline">
                    {new Date(snapshot.snapshot_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </Badge>
                </div>
                <div className="grid gap-1 text-sm">
                  <SnapshotRow label="Revenue" value={snapshot.revenue} />
                  <SnapshotRow label="Expenses" value={snapshot.expenses} />
                  <SnapshotRow label="Net income" value={snapshot.net_income} />
                  <SnapshotRow label="Cash flow" value={snapshot.operating_cash_flow} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>{reportLabel}</CardTitle>
            <CardDescription>
              Full report detail with section-level drill-down. Export files stay aligned with the table below.
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

function alertTone(severity: "critical" | "high" | "medium" | "positive") {
  switch (severity) {
    case "critical":
      return "border-rose-200 bg-rose-50"
    case "high":
      return "border-amber-200 bg-amber-50"
    case "positive":
      return "border-emerald-200 bg-emerald-50"
    default:
      return "border-slate-200 bg-slate-50"
  }
}

function alertBadgeClass(severity: "critical" | "high" | "medium" | "positive") {
  switch (severity) {
    case "critical":
      return "bg-rose-500/10 text-rose-700 border-rose-500/20"
    case "high":
      return "bg-amber-500/10 text-amber-700 border-amber-500/20"
    case "positive":
      return "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
    default:
      return "bg-slate-500/10 text-slate-700 border-slate-500/20"
  }
}

function alertLabel(severity: "critical" | "high" | "medium" | "positive") {
  switch (severity) {
    case "critical":
      return "Critical"
    case "high":
      return "High"
    case "positive":
      return "Positive"
    default:
      return "Watch"
  }
}

function HighlightRow({ label, value, numeric = false }: { label: string; value: number | null; numeric?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-slate-300">{label}</span>
      <span className="font-semibold">{numeric ? String(value ?? 0) : formatCurrency(value)}</span>
    </div>
  )
}

function SnapshotRow({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{formatCurrency(value)}</span>
    </div>
  )
}

function TrustRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border bg-background px-4 py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-right">{value}</span>
    </div>
  )
}

function formatDateTime(value: string | null) {
  if (!value) return "—"
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

function qualityLabel(score: number) {
  if (score >= 85) return "High confidence"
  if (score >= 70) return "Good coverage"
  return "Use with care"
}
