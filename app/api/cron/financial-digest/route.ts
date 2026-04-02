export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { createClient as createAdmin } from "@supabase/supabase-js"
import { Resend } from "resend"
import { buildWeeklySnapshot } from "@/lib/qbo-financial-server"

const admin = createAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.bookkeeping.business"
const CRON_SECRET = process.env.CRON_SECRET ?? ""

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: subscriptions } = await admin
    .from("subscriptions")
    .select("user_id, organization_id, plan, status")
    .in("status", ["active", "trialing"])

  if (!subscriptions?.length) {
    return NextResponse.json({ ok: true, processed: 0, sent: 0, skipped: 0, errors: [] })
  }

  const userIds = subscriptions.map((sub) => sub.user_id)
  const organizationIds = subscriptions.map((sub) => sub.organization_id).filter(Boolean)
  const [{ data: qboConnections }, { data: profiles }, { data: clientProfiles }] = await Promise.all([
    admin.from("qbo_connections").select("user_id, organization_id, company_name").in("user_id", userIds),
    admin.from("business_profiles").select("user_id, organization_id, business_name").in("user_id", userIds),
    admin.from("client_profiles").select("user_id, organization_id, full_name, secondary_email, secondary_email_verified").in("user_id", userIds),
  ])

  const qboOrgKeys = new Set((qboConnections ?? []).map((row) => `${row.user_id}:${row.organization_id}`))
  const profileMap = Object.fromEntries((profiles ?? []).map((row) => [`${row.user_id}:${row.organization_id}`, row]))
  const clientProfileMap = Object.fromEntries((clientProfiles ?? []).map((row) => [`${row.user_id}:${row.organization_id}`, row]))

  let processed = 0
  let sent = 0
  let skipped = 0
  const errors: Array<{ user_id: string; organization_id: string | null; error: string }> = []

  for (const sub of subscriptions) {
    const key = `${sub.user_id}:${sub.organization_id}`
    if (!qboOrgKeys.has(key)) {
      skipped += 1
      continue
    }

    try {
      const weekly = await buildWeeklySnapshot(sub.user_id, sub.organization_id)
      const recipient = await resolveRecipient(sub.user_id, clientProfileMap[key])
      if (!recipient) {
        skipped += 1
        continue
      }

      const upsertPayload = {
        user_id: sub.user_id,
        organization_id: sub.organization_id,
        snapshot_date: weekly.currentWeek.range.end,
        period_start: weekly.currentWeek.range.start,
        period_end: weekly.currentWeek.range.end,
        period_label: weekly.currentWeek.range.label,
        revenue: weekly.currentWeek.metrics.revenue,
        expenses: weekly.currentWeek.metrics.expenses,
        net_income: weekly.currentWeek.metrics.netIncome,
        assets: weekly.currentWeek.metrics.assets,
        liabilities: weekly.currentWeek.metrics.liabilities,
        equity: weekly.currentWeek.metrics.equity,
        operating_cash_flow: weekly.currentWeek.metrics.operatingCashFlow,
        top_expenses: weekly.currentWeek.topExpenses,
        profit_loss: weekly.currentWeek.profitLoss,
        balance_sheet: weekly.currentWeek.balanceSheet,
        cash_flow: weekly.currentWeek.cashFlow,
        updated_at: new Date().toISOString(),
      }

      const { data: existing } = await admin
        .from("financial_snapshots")
        .select("id, email_sent_at")
        .eq("user_id", sub.user_id)
        .eq("organization_id", sub.organization_id)
        .eq("period_start", weekly.currentWeek.range.start)
        .eq("period_end", weekly.currentWeek.range.end)
        .maybeSingle()

      const { data: snapshotRow, error: snapshotError } = await admin
        .from("financial_snapshots")
        .upsert(upsertPayload, { onConflict: "organization_id,period_start,period_end" })
        .select("id, email_sent_at")
        .single()

      if (snapshotError || !snapshotRow) {
        throw new Error(snapshotError?.message ?? "Snapshot save failed")
      }

      processed += 1

      if (!existing?.email_sent_at && !snapshotRow.email_sent_at && resend) {
        await resend.emails.send({
          from: `BookKeeping.business <noreply@${process.env.RESEND_VERIFIED_DOMAIN}>`,
          to: recipient.email,
          subject: `${profileMap[key]?.business_name ?? "Your business"} weekly financial digest`,
          html: buildDigestHtml({
            recipientName: recipient.firstName,
            businessName: profileMap[key]?.business_name ?? qboConnections?.find((row) => row.user_id === sub.user_id && row.organization_id === sub.organization_id)?.company_name ?? "Your business",
            current: weekly.currentWeek,
            previous: weekly.previousWeek,
          }),
        })

        await admin
          .from("financial_snapshots")
          .update({ email_sent_at: new Date().toISOString(), updated_at: new Date().toISOString() })
          .eq("id", snapshotRow.id)

        sent += 1
      } else {
        skipped += 1
      }
    } catch (error) {
      errors.push({
        user_id: sub.user_id,
        organization_id: sub.organization_id,
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }

  return NextResponse.json({
    ok: true,
    processed,
    sent,
    skipped,
    errors,
  })
}

function isAuthorized(request: Request) {
  if (!CRON_SECRET) return false
  const authHeader = request.headers.get("authorization")
  return authHeader === `Bearer ${CRON_SECRET}`
}

async function resolveRecipient(
  userId: string,
  profile: { full_name?: string | null; secondary_email?: string | null; secondary_email_verified?: boolean | null } | undefined
) {
  const secondaryEmail = profile?.secondary_email_verified ? profile.secondary_email?.trim() : null
  if (secondaryEmail) {
    return {
      email: secondaryEmail,
      firstName: profile?.full_name?.split(" ")[0] ?? "",
    }
  }

  const { data } = await admin.auth.admin.getUserById(userId)
  const email = data.user?.email?.trim()
  if (!email) return null

  return {
    email,
    firstName: profile?.full_name?.split(" ")[0] ?? "",
  }
}

function buildDigestHtml(params: {
  recipientName: string
  businessName: string
  current: Awaited<ReturnType<typeof buildWeeklySnapshot>>["currentWeek"]
  previous: Awaited<ReturnType<typeof buildWeeklySnapshot>>["previousWeek"]
}) {
  const summaryRows = [
    {
      label: "Revenue",
      current: params.current.metrics.revenue,
      previous: params.previous.metrics.revenue,
    },
    {
      label: "Expenses",
      current: params.current.metrics.expenses,
      previous: params.previous.metrics.expenses,
    },
    {
      label: "Net income",
      current: params.current.metrics.netIncome,
      previous: params.previous.metrics.netIncome,
    },
    {
      label: "Operating cash flow",
      current: params.current.metrics.operatingCashFlow,
      previous: params.previous.metrics.operatingCashFlow,
    },
  ]

  return `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;padding:32px 24px;color:#0f172a">
      <p style="font-size:14px;color:#64748b;margin:0 0 12px">${params.current.range.label}</p>
      <h1 style="font-size:28px;line-height:1.1;margin:0 0 12px">${params.businessName} weekly financial digest${params.recipientName ? ` for ${params.recipientName}` : ""}</h1>
      <p style="font-size:15px;line-height:1.6;color:#475569;margin:0 0 24px">
        Your latest weekly snapshot is ready. We saved it in your Financials dashboard and compared it to the prior week so you can spot movement quickly.
      </p>

      <table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden;margin-bottom:24px">
        <thead>
          <tr style="background:#0f172a;color:#fff">
            <th style="text-align:left;padding:12px 14px;font-size:12px">Metric</th>
            <th style="text-align:right;padding:12px 14px;font-size:12px">This Week</th>
            <th style="text-align:right;padding:12px 14px;font-size:12px">Prior Week</th>
            <th style="text-align:right;padding:12px 14px;font-size:12px">Change</th>
          </tr>
        </thead>
        <tbody>
          ${summaryRows.map((row) => `
            <tr>
              <td style="padding:12px 14px;border-top:1px solid #e2e8f0;font-size:14px">${row.label}</td>
              <td style="padding:12px 14px;border-top:1px solid #e2e8f0;font-size:14px;text-align:right">${formatCurrency(row.current)}</td>
              <td style="padding:12px 14px;border-top:1px solid #e2e8f0;font-size:14px;text-align:right">${formatCurrency(row.previous)}</td>
              <td style="padding:12px 14px;border-top:1px solid #e2e8f0;font-size:14px;text-align:right">${formatDelta(row.current, row.previous)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>

      <div style="padding:18px;border:1px solid #dbeafe;background:#eff6ff;border-radius:14px;margin-bottom:24px">
        <p style="margin:0 0 8px;font-weight:700">Top expense drivers</p>
        ${params.current.topExpenses.length > 0
          ? params.current.topExpenses.slice(0, 4).map((expense) => `
              <div style="display:flex;justify-content:space-between;gap:12px;font-size:14px;padding:6px 0;border-top:1px solid #dbeafe">
                <span>${expense.label}</span>
                <span style="font-weight:600">${formatCurrency(expense.value)}</span>
              </div>
            `).join("")
          : `<p style="margin:0;font-size:14px;color:#475569">No categorized expense leaders were available for this week yet.</p>`}
      </div>

      <a href="${SITE_URL}/dashboard/financials" style="display:inline-block;background:#0f172a;color:#fff;text-decoration:none;padding:12px 18px;border-radius:10px;font-weight:600">
        Open Financials
      </a>

      <p style="margin:24px 0 0;font-size:12px;color:#94a3b8">
        This digest was generated from your connected QuickBooks data and saved to Supabase as a weekly financial snapshot.
      </p>
    </div>
  `
}

function formatCurrency(value: number | null) {
  if (value === null || Number.isNaN(value)) return "—"
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDelta(current: number | null, previous: number | null) {
  if (current === null || previous === null) return "—"
  const delta = current - previous
  const sign = delta >= 0 ? "+" : ""
  return `${sign}${formatCurrency(delta)}`
}
