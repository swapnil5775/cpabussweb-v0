export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createClient as createAdmin } from "@supabase/supabase-js"
import { createPartnerCompany, getEmployees, createEmployee, getPayrolls } from "@/lib/gusto"

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

// GET /api/admin/gusto?user_id=xxx — get Gusto status + employees + payrolls for a client
export async function GET(request: Request) {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("user_id")
  if (!userId) return NextResponse.json({ error: "user_id required" }, { status: 400 })

  const { data: gc } = await admin
    .from("gusto_companies")
    .select("*")
    .eq("user_id", userId)
    .single()

  if (!gc) return NextResponse.json({ connected: false })

  let employees: unknown[] = []
  let payrolls: unknown[] = []
  try {
    employees = await getEmployees(gc.access_token, gc.company_uuid)
    payrolls = await getPayrolls(gc.access_token, gc.company_uuid)
  } catch { /* non-blocking */ }

  return NextResponse.json({
    connected: true,
    company_uuid: gc.company_uuid,
    company_name: gc.company_name,
    setup_status: gc.setup_status,
    employees,
    payrolls,
  })
}

// POST /api/admin/gusto — create Gusto company for a client
// body: { action: "create_company", user_id, company_name }
//       { action: "add_employee", user_id, first_name, last_name, email, start_date }
export async function POST(request: Request) {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await request.json()
  const { action, user_id } = body
  if (!user_id) return NextResponse.json({ error: "user_id required" }, { status: 400 })

  // --- Create company ---
  if (action === "create_company") {
    const { company_name } = body
    if (!company_name) return NextResponse.json({ error: "company_name required" }, { status: 400 })

    // Get client's email and name
    const { data: { user: clientUser } } = await admin.auth.admin.getUserById(user_id)
    if (!clientUser?.email) return NextResponse.json({ error: "Client user not found" }, { status: 404 })

    const { data: cp } = await admin
      .from("client_profiles")
      .select("full_name")
      .eq("user_id", user_id)
      .single()

    const nameParts = (cp?.full_name ?? "Business Owner").split(" ")
    const first_name = nameParts[0]
    const last_name = nameParts.slice(1).join(" ") || "Owner"

    let result
    try {
      result = await createPartnerCompany({
        company_name,
        first_name,
        last_name,
        email: clientUser.email,
      })
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unknown error"
      return NextResponse.json({ error: msg }, { status: 500 })
    }

    await admin.from("gusto_companies").upsert({
      user_id,
      company_uuid: result.company_uuid,
      company_name,
      access_token: result.access_token,
      setup_status: "active",
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" })

    return NextResponse.json({ ok: true, company_uuid: result.company_uuid })
  }

  // --- Link existing Gusto company (created in Gusto portal) ---
  if (action === "link_existing") {
    const { company_uuid, company_name, access_token, refresh_token } = body
    if (!company_uuid || !access_token) {
      return NextResponse.json({ error: "company_uuid and access_token are required" }, { status: 400 })
    }

    const { error: upsertErr } = await admin.from("gusto_companies").upsert({
      user_id,
      company_uuid,
      company_name: company_name ?? company_uuid,
      access_token,
      refresh_token: refresh_token ?? null,
      setup_status: "active",
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" })

    if (upsertErr) {
      console.error("Gusto link_existing upsert error:", upsertErr)
      return NextResponse.json({ error: upsertErr.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true, company_uuid })
  }

  // --- Add employee ---
  if (action === "add_employee") {
    const { first_name, last_name, email, start_date } = body
    if (!first_name || !last_name || !email || !start_date) {
      return NextResponse.json({ error: "first_name, last_name, email, start_date required" }, { status: 400 })
    }

    const { data: gc } = await admin
      .from("gusto_companies")
      .select("company_uuid, access_token")
      .eq("user_id", user_id)
      .single()

    if (!gc) return NextResponse.json({ error: "Gusto company not set up for this client" }, { status: 400 })

    try {
      const employee = await createEmployee(gc.access_token, gc.company_uuid, {
        first_name, last_name, email, start_date,
      })
      return NextResponse.json({ ok: true, employee })
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unknown error"
      return NextResponse.json({ error: msg }, { status: 500 })
    }
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 })
}
