export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createClient as createAdmin } from "@supabase/supabase-js"
import { qboFetch } from "@/lib/qbo"
import { cookies } from "next/headers"
import { resolveActiveOrganizationId } from "@/lib/organizations"

const admin = createAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const cookieStore = await cookies()
  const orgId = await resolveActiveOrganizationId({
    admin,
    userId: user.id,
    cookieStore,
    suggestedName: "Primary Organization",
  })

  const { data: conn } = await admin
    .from("qbo_connections")
    .select("realm_id, company_name, connected_at")
    .eq("user_id", user.id)
    .eq("organization_id", orgId)
    .maybeSingle()

  if (!conn) return NextResponse.json({ connected: false })

  // Fetch P&L report (last 12 months)
  const now = new Date()
  const startDate = `${now.getFullYear() - 1}-${String(now.getMonth() + 1).padStart(2, "0")}-01`
  const endDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()).padStart(2, "0")}`

  const [plRes, bsRes] = await Promise.all([
    qboFetch(user.id, orgId, `/reports/ProfitAndLoss?start_date=${startDate}&end_date=${endDate}&minorversion=65`),
    qboFetch(user.id, orgId, `/reports/BalanceSheet?date=${endDate}&minorversion=65`),
  ])

  let profitLoss = null
  let balanceSheet = null

  if (plRes?.ok) {
    const plData = await plRes.json()
    // Extract key summary rows from P&L
    profitLoss = extractPLSummary(plData)
  }

  if (bsRes?.ok) {
    const bsData = await bsRes.json()
    balanceSheet = extractBSSummary(bsData)
  }

  return NextResponse.json({
    connected: true,
    company_name: conn.company_name,
    connected_at: conn.connected_at,
    profitLoss,
    balanceSheet,
  })
}

function extractPLSummary(data: Record<string, unknown>) {
  try {
    const rows = (data as { Rows?: { Row?: unknown[] } }).Rows?.Row ?? []
    const summary: { label: string; value: string }[] = []
    for (const row of rows as Array<{ type?: string; Summary?: { ColData?: Array<{ value: string }> }; Header?: { ColData?: Array<{ value: string }> }; Rows?: { Row?: Array<{ type?: string; Summary?: { ColData?: Array<{ value: string }> } }> } }>) {
      if (row?.Summary?.ColData) {
        const label = row.Summary.ColData[0]?.value
        const value = row.Summary.ColData[1]?.value
        if (label && value) summary.push({ label, value })
      }
    }
    return summary.length > 0 ? summary : null
  } catch { return null }
}

function extractBSSummary(data: Record<string, unknown>) {
  try {
    const rows = (data as { Rows?: { Row?: unknown[] } }).Rows?.Row ?? []
    const summary: { label: string; value: string }[] = []
    for (const row of rows as Array<{ Summary?: { ColData?: Array<{ value: string }> } }>) {
      if (row?.Summary?.ColData) {
        const label = row.Summary.ColData[0]?.value
        const value = row.Summary.ColData[1]?.value
        if (label && value) summary.push({ label, value })
      }
    }
    return summary.length > 0 ? summary : null
  } catch { return null }
}
