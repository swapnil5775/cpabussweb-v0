export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { createClient as createAdmin } from "@supabase/supabase-js"
import { Resend } from "resend"
import { getServiceName } from "@/lib/service-intake"

const admin = createAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.bookkeeping.business"
const CRON_SECRET = process.env.CRON_SECRET ?? ""

function isAuthorized(request: Request) {
  if (!CRON_SECRET) return false
  return request.headers.get("authorization") === `Bearer ${CRON_SECRET}`
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!resend) {
    return NextResponse.json({ ok: true, sent: 0, skipped: 0, note: "RESEND not configured" })
  }

  const cutoff = new Date(Date.now() - 1000 * 60 * 30).toISOString()
  const { data: orders, error } = await admin
    .from("service_orders")
    .select("id, user_id, order_number, service_type, intake_status, created_at, intake_reminder_sent_at")
    .eq("status", "paid")
    .in("intake_status", ["pending", "in_progress"])
    .is("intake_reminder_sent_at", null)
    .lt("created_at", cutoff)
    .limit(200)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!orders?.length) return NextResponse.json({ ok: true, sent: 0, skipped: 0 })

  let sent = 0
  let skipped = 0

  for (const order of orders) {
    const { data } = await admin.auth.admin.getUserById(order.user_id)
    const email = data.user?.email
    if (!email) {
      skipped += 1
      continue
    }

    const intakeUrl = `${SITE_URL}/dashboard/services/orders/${order.id}/intake`
    await resend.emails.send({
      from: `BookKeeping.business <noreply@${process.env.RESEND_VERIFIED_DOMAIN}>`,
      to: email,
      subject: `Complete your intake form — ${order.order_number ?? "Service Order"}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <h2 style="margin:0 0 8px">Action required to start work</h2>
          <p style="margin:0 0 12px;color:#475569">
            We received your payment for <strong>${getServiceName(order.service_type)}</strong>.
          </p>
          <p style="margin:0 0 18px;color:#475569">
            Please submit your intake form so we can start. You can resume anytime from the link below.
          </p>
          <a href="${intakeUrl}" style="display:inline-block;background:#0f172a;color:#fff;text-decoration:none;padding:12px 16px;border-radius:8px;font-weight:600">
            Resume Intake
          </a>
        </div>
      `,
    })

    await admin
      .from("service_orders")
      .update({ intake_reminder_sent_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq("id", order.id)

    sent += 1
  }

  return NextResponse.json({ ok: true, sent, skipped })
}
