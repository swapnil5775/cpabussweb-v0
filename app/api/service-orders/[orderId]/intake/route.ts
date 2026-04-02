export const dynamic = "force-dynamic"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { getAdminClient, resolveActiveOrganizationId } from "@/lib/organizations"
import { getServiceIntakeConfig, getServiceName } from "@/lib/service-intake"

type Params = { params: Promise<{ orderId: string }> }

async function authenticate() {
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
  if (error || !user) return { error: "Unauthorized", status: 401 as const }

  const admin = getAdminClient()
  const organizationId = await resolveActiveOrganizationId({
    admin,
    userId: user.id,
    cookieStore,
    suggestedName: "Primary Organization",
  })

  return { user, admin, organizationId }
}

export async function GET(_: Request, { params }: Params) {
  const auth = await authenticate()
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const { orderId } = await params
  const { admin, user, organizationId } = auth

  const { data: order, error } = await admin
    .from("service_orders")
    .select("id, order_number, service_type, amount_cents, status, intake_status, intake_answers, intake_started_at, intake_completed_at, created_at, updated_at")
    .eq("id", orderId)
    .eq("user_id", user.id)
    .eq("organization_id", organizationId)
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 })

  const intakeConfig = getServiceIntakeConfig(order.service_type)
  return NextResponse.json({
    order: {
      ...order,
      service_name: getServiceName(order.service_type),
      intake_questions: intakeConfig?.questions ?? [],
      intake_intro: intakeConfig?.intro ?? "",
      timeline: intakeConfig?.timeline ?? "1-3 business days after intake submission",
    },
  })
}

export async function POST(request: Request, { params }: Params) {
  const auth = await authenticate()
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const { orderId } = await params
  const { admin, user, organizationId } = auth

  const { data: order, error } = await admin
    .from("service_orders")
    .select("id, service_type, status, intake_status, intake_answers")
    .eq("id", orderId)
    .eq("user_id", user.id)
    .eq("organization_id", organizationId)
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 })

  const body = await request.json().catch(() => ({}))
  const answers = typeof body?.answers === "object" && body.answers ? body.answers as Record<string, string> : {}
  const submit = !!body?.submit
  const intakeConfig = getServiceIntakeConfig(order.service_type)
  if (!intakeConfig) return NextResponse.json({ error: "No intake form for this service" }, { status: 400 })

  const isAlreadySubmitted = order.intake_status === "submitted"
    || order.status === "intake_submitted"
    || order.status === "in_progress"
    || order.status === "completed"
  if (submit) {
    const missing = intakeConfig.questions
      .filter((q) => q.required)
      .filter((q) => {
        const value = answers[q.id]
        return !value || !String(value).trim()
      })
      .map((q) => q.label)

    if (missing.length > 0) {
      return NextResponse.json({ error: "Please complete required fields", missing }, { status: 400 })
    }
  }

  const now = new Date().toISOString()
  const nextIntakeStatus = submit || isAlreadySubmitted ? "submitted" : "in_progress"
  const nextStatus = submit || isAlreadySubmitted ? "intake_submitted" : "paid"
  const { error: updateError } = await admin
    .from("service_orders")
    .update({
      intake_answers: answers,
      intake_status: nextIntakeStatus,
      intake_started_at: now,
      intake_completed_at: submit || isAlreadySubmitted ? now : null,
      status: nextStatus,
      updated_at: now,
    })
    .eq("id", order.id)
    .eq("user_id", user.id)
    .eq("organization_id", organizationId)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, intake_status: nextIntakeStatus })
}
