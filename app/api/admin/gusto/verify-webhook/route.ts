export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createClient as createAdmin } from "@supabase/supabase-js"
import { getFirmToken, GUSTO_BASE_URL } from "@/lib/gusto"

const admin = createAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
const ADMIN_EMAIL = process.env.NOTIFICATION_EMAIL!

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== ADMIN_EMAIL) return null
  return user
}

// GET — return current webhook status (token received, verified)
export async function GET() {
  if (!await requireAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const { data: fc } = await admin
    .from("gusto_firm_connection")
    .select("webhook_verification_token, webhook_subscription_uuid, webhook_verified_at")
    .eq("id", "00000000-0000-0000-0000-000000000001")
    .single()

  return NextResponse.json({
    token_received: !!fc?.webhook_verification_token,
    verified: !!fc?.webhook_verified_at,
    verified_at: fc?.webhook_verified_at ?? null,
    subscription_uuid: fc?.webhook_subscription_uuid ?? process.env.GUSTO_WEBHOOK_SUBSCRIPTION_UUID ?? null,
  })
}

// POST — call Gusto verify API with the stored token
export async function POST(request: Request) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const body = await request.json().catch(() => ({}))
  const subscriptionUuid =
    body.subscription_uuid ??
    process.env.GUSTO_WEBHOOK_SUBSCRIPTION_UUID

  if (!subscriptionUuid) {
    return NextResponse.json({ error: "No webhook subscription UUID. Save GUSTO_WEBHOOK_SUBSCRIPTION_UUID env var or pass it in the request body." }, { status: 400 })
  }

  const { data: fc } = await admin
    .from("gusto_firm_connection")
    .select("webhook_verification_token")
    .eq("id", "00000000-0000-0000-0000-000000000001")
    .single()

  if (!fc?.webhook_verification_token) {
    return NextResponse.json({ error: "No verification token received yet. Click 'Resend' in the Gusto portal first, then try again." }, { status: 400 })
  }

  let firmToken: string
  try {
    firmToken = await getFirmToken()
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Firm not connected" }, { status: 400 })
  }

  const res = await fetch(`${GUSTO_BASE_URL}/v1/webhook_subscriptions/${subscriptionUuid}/verify`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${firmToken}`,
      "Content-Type": "application/json",
      "X-Gusto-API-Version": "2025-06-15",
    },
    body: JSON.stringify({ verification_token: fc.webhook_verification_token }),
  })

  if (!res.ok) {
    const err = await res.text()
    return NextResponse.json({ error: `Gusto verify failed: ${err}` }, { status: 500 })
  }

  // Mark verified in DB
  await admin
    .from("gusto_firm_connection")
    .update({
      webhook_subscription_uuid: subscriptionUuid,
      webhook_verified_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", "00000000-0000-0000-0000-000000000001")

  return NextResponse.json({ ok: true, verified_at: new Date().toISOString() })
}
