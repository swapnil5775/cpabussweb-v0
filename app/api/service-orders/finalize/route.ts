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

  let session: Awaited<ReturnType<typeof stripe.checkout.sessions.retrieve>>
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId)
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown Stripe error"
    return NextResponse.json({ error: `Failed to retrieve payment session: ${msg}` }, { status: 502 })
  }
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

  // Strip the cs_test_/cs_live_ prefix so buildOrderNumber gets the unique part of the session id
  const sessionSuffix = session.id.replace(/^cs_(test|live)_/, "")
  const orderNumber = buildOrderNumber(sessionSuffix, session.created ? new Date(session.created * 1000).toISOString() : new Date().toISOString())

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
      console.error("[finalize] insert error", createError.code, createError.message)
      return NextResponse.json({ error: createError.message }, { status: 500 })
    }
  }
  if (created?.id) return NextResponse.json({ ok: true, order_id: created.id })

  // Fetch the existing row — search by session_id only (no user_id filter) so we
  // also catch rows created by the webhook under session.metadata.user_id
  const { data: fetched, error: fetchError } = await admin
    .from("service_orders")
    .select("id, user_id")
    .eq("stripe_checkout_session_id", sessionId)
    .maybeSingle()

  if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 500 })
  if (fetched?.id) {
    // Security: only return the order_id if it belongs to the authenticated user
    if (fetched.user_id !== user.id) {
      console.error("[finalize] user_id mismatch: db row has", fetched.user_id, "auth user is", user.id)
      return NextResponse.json({ error: "Order belongs to a different account. Please contact support." }, { status: 403 })
    }
    return NextResponse.json({ ok: true, order_id: fetched.id })
  }

  // Nothing found — insert returned no row and no duplicate exists
  // This can happen if createError was non-null with code 23505 but the row was deleted,
  // or if the insert silently failed for a DB constraint we haven't caught yet.
  console.error("[finalize] 202: createError=", createError?.code, createError?.message, "sessionId=", sessionId, "userId=", user.id)
  return NextResponse.json({
    ok: false,
    order_id: null,
    debug: `insert_code=${createError?.code ?? "none"} msg=${createError?.message ?? "no_row_returned"}`,
  }, { status: 202 })
}
