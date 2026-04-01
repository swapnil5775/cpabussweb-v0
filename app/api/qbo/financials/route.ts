export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createClient as createAdmin } from "@supabase/supabase-js"
import { reportToCsv } from "@/lib/qbo-financials"
import { buildFinancialReportPdf } from "@/lib/qbo-financial-pdf"
import { buildAutomatedInsights } from "@/lib/qbo-insights"
import {
  buildFinancialSummary,
  getDateRange,
  normalizeReport,
} from "@/lib/qbo-financial-server"

const admin = createAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data: conn } = await admin
    .from("qbo_connections")
    .select("realm_id, company_name, connected_at")
    .eq("user_id", user.id)
    .single()

  if (!conn) return NextResponse.json({ connected: false })

  const url = new URL(request.url)
  const reportId = normalizeReport(url.searchParams.get("report"))
  const period = url.searchParams.get("period") ?? "last6"
  const format = url.searchParams.get("format")
  const summary = await buildFinancialSummary(user.id, reportId, period)
  const selectedRange = getDateRange(period)

  if (format === "csv") {
    if (!summary.reportData) {
      return NextResponse.json({ error: "Unable to export report" }, { status: 502 })
    }

    return new NextResponse(reportToCsv(summary.reportData), {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${reportId}-${selectedRange.start}-${selectedRange.end}.csv"`,
      },
    })
  }

  if (format === "pdf") {
    if (!summary.reportData) {
      return NextResponse.json({ error: "Unable to export report" }, { status: 502 })
    }

    const pdfBytes = await buildFinancialReportPdf({
      companyName: conn.company_name,
      title: reportLabel(reportId),
      rangeLabel: selectedRange.label,
      report: summary.reportData,
      metrics: summary.overview.map((item) => ({ label: item.label, value: item.value })),
    })

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${reportId}-${selectedRange.start}-${selectedRange.end}.pdf"`,
      },
    })
  }

  let snapshots: Array<{
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
  }> = []

  const { data: snapshotRows } = await admin
    .from("financial_snapshots")
    .select("snapshot_date, period_start, period_end, period_label, revenue, expenses, net_income, operating_cash_flow, assets, liabilities")
    .eq("user_id", user.id)
    .order("snapshot_date", { ascending: false })
    .limit(6)

  if (snapshotRows) {
    snapshots = snapshotRows
  }

  const dataQualityFlags = [
    conn.connected_at
      ? `QuickBooks connected ${new Date(conn.connected_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
      : null,
    summary.reportData?.rows?.length
      ? `${summary.reportData.rows.length} report rows returned from QBO`
      : "QuickBooks did not return line-item rows for this report yet",
    snapshots.length > 0
      ? `${snapshots.length} saved weekly snapshot${snapshots.length === 1 ? "" : "s"} available`
      : "No weekly snapshots saved yet; week-over-week comparisons are limited",
    summary.monthlyTrend.some((point) => point.revenue === null || point.expenses === null || point.netIncome === null)
      ? "Some trend periods are incomplete because QBO returned partial report data"
      : null,
  ].filter(Boolean)

  const dataQualityScore = Math.max(
    52,
    100
      - (summary.reportData?.rows?.length ? 0 : 20)
      - (snapshots.length > 0 ? 0 : 15)
      - (summary.monthlyTrend.some((point) => point.revenue === null || point.expenses === null || point.netIncome === null) ? 10 : 0)
  )

  const insights = buildAutomatedInsights({
    overview: summary.overview,
    monthlyTrend: summary.monthlyTrend,
    snapshots,
    topExpenses: summary.topExpenses,
    highlights: summary.highlights,
  })

  return NextResponse.json({
    connected: true,
    company_name: conn.company_name,
    connected_at: conn.connected_at,
    generated_at: new Date().toISOString(),
    report: reportId,
    range: selectedRange,
    overview: summary.overview,
    monthlyTrend: summary.monthlyTrend,
    topExpenses: summary.topExpenses,
    reportData: summary.reportData,
    highlights: summary.highlights,
    snapshots,
    trust: {
      source: "QuickBooks Online",
      sourceSystem: "QBO",
      generatedAt: new Date().toISOString(),
      reportPeriod: selectedRange.label,
      qboConnectedAt: conn.connected_at,
      snapshotCount: snapshots.length,
      lastSnapshotDate: snapshots[0]?.snapshot_date ?? null,
      dataQualityScore,
      dataQualityFlags,
    },
    insights,
  })
}

function reportLabel(report: string) {
  switch (report) {
    case "balance-sheet":
      return "Balance Sheet"
    case "cash-flow":
      return "Cash Flow"
    default:
      return "Profit & Loss"
  }
}
