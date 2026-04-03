export const dynamic = "force-dynamic"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { getAdminClient, resolveActiveOrganizationId } from "@/lib/organizations"
import { buildOrderNumber } from "@/lib/service-intake"

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
  if (session.payment_status !== "paid") {
    return NextResponse.json({ error: "Payment not completed yet" }, { status: 409 })
  }

  // Verify session belongs to this user (metadata check is best-effort for older sessions)
  const metaUserId = session.metadata?.user_id
  if (metaUserId && metaUserId !== user.id) {
    return NextResponse.json({ error: "Session does not belong to current user" }, { status: 403 })
  }

  let organizationId: string = session.metadata?.organization_id ?? ""
  if (!organizationId) {
    organizationId = await resolveActiveOrganizationId({
      admin,
      userId: user.id,
      suggestedName: "Primary Organization",
    })
  }

  const orderNumber = buildOrderNumber(session.id, session.created ? new Date(session.created * 1000).toISOString() : new Date().toISOString())

  // Use insert (not upsert) — partial unique indexes can silently fail with PostgREST upsert
  const { data: created, error: createError } = await admin
    .from("service_orders")
    .insert({
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
    })
    .select("id")
    .maybeSingle()

  if (createError) {
    // 23505 = unique_violation — the order already exists (race condition or duplicate call)
    if (createError.code !== "23505") {
      return NextResponse.json({ error: createError.message }, { status: 500 })
    }
  }
  if (created?.id) return NextResponse.json({ ok: true, order_id: created.id })

  // Fetch the existing row (handles unique conflict + the success-but-no-return case)
  const { data: fetched, error: fetchError } = await admin
    .from("service_orders")
    .select("id")
    .eq("user_id", user.id)
    .eq("stripe_checkout_session_id", sessionId)
    .maybeSingle()

  if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 500 })
  if (fetched?.id) return NextResponse.json({ ok: true, order_id: fetched.id })
  return NextResponse.json({ ok: false, order_id: null }, { status: 202 })
}
