export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createClient as createAdmin } from "@supabase/supabase-js"
import { Resend } from "resend"

const admin = createAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
const resend = new Resend(process.env.RESEND_API_KEY)
const ADMIN_EMAIL = process.env.NOTIFICATION_EMAIL!
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.bookkeeping.business"

// GET /api/admin/link-qbo — list all clients with subscription status + QBO status
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  // Get all paid subscriptions
  const { data: subs } = await admin
    .from("subscriptions")
    .select("user_id, plan, status, created_at")
    .in("status", ["active", "trialing"])
    .order("created_at", { ascending: false })

  if (!subs || subs.length === 0) return NextResponse.json({ clients: [] })

  const userIds = subs.map((s) => s.user_id)

  // Get profiles + QBO connections in parallel
  const [{ data: profiles }, { data: qboConns }, { data: clientProfiles }, firmConn, gustoFirmConn] = await Promise.all([
    admin.from("business_profiles").select("user_id, business_name, business_type, entity_type, selected_plan").in("user_id", userIds),
    admin.from("qbo_connections").select("user_id, realm_id, company_name, setup_status, connected_at, firm_managed").in("user_id", userIds),
    admin.from("client_profiles").select("user_id, full_name").in("user_id", userIds),
    admin.from("qbo_firm_connection").select("token_expires_at, connected_at").eq("id", "00000000-0000-0000-0000-000000000001").single(),
    admin.from("gusto_firm_connection").select("token_expires_at").eq("id", "00000000-0000-0000-0000-000000000001").single(),
  ])

  const profileMap = Object.fromEntries((profiles ?? []).map((p) => [p.user_id, p]))
  const qboMap = Object.fromEntries((qboConns ?? []).map((q) => [q.user_id, q]))
  const cpMap = Object.fromEntries((clientProfiles ?? []).map((c) => [c.user_id, c]))

  const clients = subs.map((sub) => ({
    user_id: sub.user_id,
    plan: sub.plan,
    status: sub.status,
    subscribed_at: sub.created_at,
    business_name: profileMap[sub.user_id]?.business_name ?? null,
    business_type: profileMap[sub.user_id]?.business_type ?? null,
    entity_type: profileMap[sub.user_id]?.entity_type ?? null,
    full_name: cpMap[sub.user_id]?.full_name ?? null,
    qbo: qboMap[sub.user_id] ?? null,
    needs_qbo_setup: !qboMap[sub.user_id],
  }))

  return NextResponse.json({
    clients,
    firm_connected: !!firmConn.data,
    firm_token_expires: firmConn.data?.token_expires_at ?? null,
    gusto_connected: !!gustoFirmConn.data,
  })
}

// POST /api/admin/link-qbo — link a QBO realm to a client
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { user_id, realm_id, company_name } = await request.json()
  if (!user_id || !realm_id) {
    return NextResponse.json({ error: "user_id and realm_id required" }, { status: 400 })
  }

  // Get firm token to use for this connection
  const { data: firmConn } = await admin
    .from("qbo_firm_connection")
    .select("access_token, refresh_token, token_expires_at")
    .eq("id", "00000000-0000-0000-0000-000000000001")
    .single()

  if (!firmConn) {
    return NextResponse.json({ error: "Firm QBO account not connected. Connect QBOA first." }, { status: 400 })
  }

  // Link the QBO company to this client using firm tokens
  await admin.from("qbo_connections").upsert({
    user_id,
    realm_id,
    company_name: company_name ?? null,
    access_token: firmConn.access_token,
    refresh_token: firmConn.refresh_token,
    token_expires_at: firmConn.token_expires_at,
    firm_managed: true,
    setup_status: "active",
    connected_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }, { onConflict: "user_id" })

  // Auto-setup chart of accounts based on business type
  const { data: profile } = await admin
    .from("business_profiles")
    .select("business_type, entity_type")
    .eq("user_id", user_id)
    .single()

  if (profile) {
    // Fire and forget — non-blocking chart of accounts setup
    setupChartOfAccounts(realm_id, firmConn.access_token, profile.business_type).catch(() => {})
  }

  // Get client email and notify them
  try {
    const { data: { user: clientUser } } = await admin.auth.admin.getUserById(user_id)
    if (clientUser?.email) {
      const { data: cp } = await admin.from("client_profiles").select("full_name").eq("user_id", user_id).single()
      const firstName = cp?.full_name?.split(" ")[0] ?? ""
      await resend.emails.send({
        from: `BookKeeping.business <noreply@${process.env.RESEND_VERIFIED_DOMAIN}>`,
        to: clientUser.email,
        subject: "Your books are set up and ready",
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px">
            <h2 style="margin:0 0 8px">Your bookkeeping is live${firstName ? `, ${firstName}` : ""}!</h2>
            <p style="color:#555;margin:0 0 16px">
              Great news — your dedicated bookkeeper has set up your QuickBooks account and is getting started on your books.
            </p>
            <p style="color:#555;margin:0 0 24px">
              You can now view your P&amp;L, Balance Sheet, and financial summary directly from your dashboard — no QuickBooks login needed.
            </p>
            <a href="${SITE_URL}/dashboard" style="display:inline-block;background:#0f172a;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">
              View Your Dashboard →
            </a>
            <p style="color:#999;font-size:12px;margin-top:32px">
              Questions? Reply to this email or open a support ticket from your dashboard.
            </p>
          </div>
        `,
      })
    }
  } catch {/* non-blocking */}

  return NextResponse.json({ ok: true })
}

// Basic chart of accounts setup by business type
async function setupChartOfAccounts(realmId: string, accessToken: string, businessType: string | null) {
  const baseUrl = process.env.QBO_ENVIRONMENT === "sandbox"
    ? `https://sandbox-quickbooks.api.intuit.com/v3/company/${realmId}`
    : `https://quickbooks.api.intuit.com/v3/company/${realmId}`

  const commonAccounts = [
    { Name: "Business Checking", AccountType: "Bank", AccountSubType: "Checking" },
    { Name: "Business Savings", AccountType: "Bank", AccountSubType: "Savings" },
    { Name: "Accounts Receivable", AccountType: "Accounts Receivable", AccountSubType: "AccountsReceivable" },
    { Name: "Accounts Payable", AccountType: "Accounts Payable", AccountSubType: "AccountsPayable" },
    { Name: "Owner Draws", AccountType: "Equity", AccountSubType: "OwnersEquity" },
  ]

  const typeSpecific: Record<string, { Name: string; AccountType: string; AccountSubType: string }[]> = {
    restaurant: [
      { Name: "Food & Beverage Sales", AccountType: "Income", AccountSubType: "SalesOfProductIncome" },
      { Name: "Food & Beverage COGS", AccountType: "Cost of Goods Sold", AccountSubType: "SuppliesMaterialsCogs" },
    ],
    retail: [
      { Name: "Retail Sales", AccountType: "Income", AccountSubType: "SalesOfProductIncome" },
      { Name: "Inventory Asset", AccountType: "Other Current Asset", AccountSubType: "Inventory" },
    ],
    hotel: [
      { Name: "Room Revenue", AccountType: "Income", AccountSubType: "ServiceFeeIncome" },
      { Name: "Occupancy Tax Payable", AccountType: "Other Current Liability", AccountSubType: "OtherCurrentLiabilities" },
    ],
  }

  const accounts = [
    ...commonAccounts,
    ...(businessType && typeSpecific[businessType] ? typeSpecific[businessType] : []),
  ]

  for (const account of accounts) {
    await fetch(`${baseUrl}/account?minorversion=65`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(account),
    }).catch(() => {/* skip if account already exists */})
  }
}
