export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createClient as createAdmin } from "@supabase/supabase-js"
import { getServiceName } from "@/lib/service-intake"

const admin = createAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
const ADMIN_EMAIL = process.env.NOTIFICATION_EMAIL!

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  // All auth users
  const { data: { users: authUsers } } = await admin.auth.admin.listUsers({ perPage: 1000 })
  const userIds = authUsers.map((u) => u.id)

  // All supporting data in parallel
  const [
    { data: orgs },
    { data: subs },
    { data: orders },
    { data: clientProfiles },
  ] = await Promise.all([
    admin.from("organizations").select("id, user_id, name, is_default").in("user_id", userIds),
    admin.from("subscriptions").select("user_id, organization_id, plan, status, created_at").in("user_id", userIds),
    admin.from("service_orders")
      .select("user_id, organization_id, service_type, status, intake_status, order_number, created_at")
      .in("user_id", userIds)
      .order("created_at", { ascending: false }),
    admin.from("client_profiles").select("user_id, full_name").in("user_id", userIds),
  ])

  // Build lookup maps
  const orgsByUser: Record<string, Array<{ id: string; name: string; is_default: boolean }>> = {}
  for (const org of orgs ?? []) {
    if (!orgsByUser[org.user_id]) orgsByUser[org.user_id] = []
    orgsByUser[org.user_id].push(org)
  }

  const orgNameMap: Record<string, string> = {}
  for (const org of orgs ?? []) orgNameMap[org.id] = org.name

  const subsByUser: Record<string, Array<{ plan: string; status: string; org_name: string; created_at: string }>> = {}
  for (const sub of subs ?? []) {
    if (!subsByUser[sub.user_id]) subsByUser[sub.user_id] = []
    subsByUser[sub.user_id].push({
      plan: sub.plan ?? "unknown",
      status: sub.status,
      org_name: orgNameMap[sub.organization_id] ?? sub.organization_id,
      created_at: sub.created_at,
    })
  }

  const ordersByUser: Record<string, Array<{
    order_number: string | null
    service_type: string | null
    service_name: string
    status: string
    intake_status: string
    created_at: string
  }>> = {}
  for (const order of orders ?? []) {
    if (!ordersByUser[order.user_id]) ordersByUser[order.user_id] = []
    ordersByUser[order.user_id].push({
      order_number: order.order_number,
      service_type: order.service_type,
      service_name: getServiceName(order.service_type),
      status: order.status,
      intake_status: order.intake_status,
      created_at: order.created_at,
    })
  }

  const profileByUser: Record<string, string | null> = {}
  for (const p of clientProfiles ?? []) profileByUser[p.user_id] = p.full_name

  const rows = authUsers.map((u) => ({
    user_id: u.id,
    email: u.email ?? "",
    full_name: profileByUser[u.id] ?? null,
    created_at: u.created_at,
    last_sign_in: u.last_sign_in_at ?? null,
    orgs: orgsByUser[u.id] ?? [],
    subscriptions: subsByUser[u.id] ?? [],
    service_orders: ordersByUser[u.id] ?? [],
  }))

  // Sort: paid first, then by signup date desc
  rows.sort((a, b) => {
    const aPaid = a.subscriptions.some((s) => s.status === "active" || s.status === "trialing") ? 1 : 0
    const bPaid = b.subscriptions.some((s) => s.status === "active" || s.status === "trialing") ? 1 : 0
    if (bPaid !== aPaid) return bPaid - aPaid
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  return NextResponse.json({ users: rows })
}
