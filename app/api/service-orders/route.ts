export const dynamic = "force-dynamic"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { getAdminClient, resolveActiveOrganizationId } from "@/lib/organizations"
import { getServiceIntakeConfig, getServiceName, getTrackerSteps } from "@/lib/service-intake"

export async function GET(request: Request) {
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

  const admin = getAdminClient()
  const organizationId = await resolveActiveOrganizationId({
    admin,
    userId: user.id,
    cookieStore,
    suggestedName: "Primary Organization",
  })

  const url = new URL(request.url)
  const sessionId = url.searchParams.get("session_id")

  let query = admin
    .from("service_orders")
    .select("id, order_number, service_type, amount_cents, status, intake_status, created_at, updated_at, stripe_checkout_session_id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  query = sessionId
    ? query.eq("stripe_checkout_session_id", sessionId).limit(1)
    : query.eq("organization_id", organizationId)

  const { data, error: ordersError } = await query
  if (ordersError) {
    return NextResponse.json({ error: ordersError.message }, { status: 500 })
  }

  const orders = (data ?? []).map((order) => ({
    ...order,
    service_name: getServiceName(order.service_type),
    has_intake: !!getServiceIntakeConfig(order.service_type),
    tracker: getTrackerSteps({ status: order.status, intake_status: order.intake_status }),
  }))

  return NextResponse.json({ orders })
}
