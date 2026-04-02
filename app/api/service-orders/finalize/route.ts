export const dynamic = "force-dynamic"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { getAdminClient } from "@/lib/organizations"
import { buildOrderNumber } from "@/lib/service-intake"

async function resolveDefaultOrganizationId(admin: ReturnType<typeof getAdminClient>, userId: string) {
  const { data: defaultOrg } = await admin
    .from("organizations")
    .select("id")
    .eq("user_id", userId)
    .eq("is_default", true)
    .maybeSingle()
  return defaultOrg?.id ?? null
}

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        },
      },
    }
  )

  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await request.json().catch(() => ({}))
  const sessionId = typeof body?.session_id === "string" ? body.session_id : ""
  if (!sessionId) return NextResponse.json({ error: "session_id is required" }, { status: 400 })

  const admin = getAdminClient()

  const { data: existing } = await admin
    .from("service_orders")
    .select("id")
    .eq("user_id", user.id)
    .eq("stripe_checkout_session_id", sessionId)
    .maybeSingle()
  if (existing?.id) {
    return NextResponse.json({ ok: true, order_id: existing.id })
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId)
  if (session.mode !== "payment") {
    return NextResponse.json({ error: "Session is not a one-time service payment" }, { status: 400 })
  }

  const userId = session.metadata?.user_id
  if (!userId || userId !== user.id) {
    return NextResponse.json({ error: "Session does not belong to current user" }, { status: 403 })
  }

  let organizationId = session.metadata?.organization_id ?? null
  if (!organizationId) {
    organizationId = await resolveDefaultOrganizationId(admin, user.id)
  }
  if (!organizationId) return NextResponse.json({ error: "No organization found" }, { status: 400 })

  const orderNumber = buildOrderNumber(session.id, session.created ? new Date(session.created * 1000).toISOString() : new Date().toISOString())
  const { data: created, error: createError } = await admin
    .from("service_orders")
    .upsert({
      user_id: user.id,
      organization_id: organizationId,
      order_number: orderNumber,
      service_type: session.metadata?.service_type,
      amount_cents: session.amount_total,
      stripe_checkout_session_id: session.id,
      status: "paid",
      intake_status: "pending",
      intake_answers: {},
      updated_at: new Date().toISOString(),
    }, { onConflict: "stripe_checkout_session_id" })
    .select("id")
    .maybeSingle()

  if (createError) return NextResponse.json({ error: createError.message }, { status: 500 })
  return NextResponse.json({ ok: true, order_id: created?.id ?? null })
}
