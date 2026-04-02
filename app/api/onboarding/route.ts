export const dynamic = "force-dynamic"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { createClient as createServiceClient } from "@supabase/supabase-js"
import { resolveActiveOrganizationId } from "@/lib/organizations"

export async function GET() {
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
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const admin = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const orgId = await resolveActiveOrganizationId({
    admin,
    userId: user.id,
    cookieStore,
    suggestedName: "Primary Organization",
  })

  const [{ data: bp }, { data: cp }] = await Promise.all([
    admin.from("business_profiles").select("*").eq("user_id", user.id).eq("organization_id", orgId).maybeSingle(),
    admin.from("client_profiles").select("*").eq("user_id", user.id).eq("organization_id", orgId).maybeSingle(),
  ])

  return NextResponse.json({ businessProfile: bp, clientProfile: cp })
}

export async function POST(request: Request) {
  const body = await request.json()
  const {
    // Business
    businessName, businessType, entityType, revenueRange,
    booksStatus, bookkeepingPlatform,
    workerTypes, headcount, employeeCount,
    needsPayroll, payrollPlatform,
    bankAccountsCount, creditCardsCount, hasAchVendors,
    selectedPlan,
    // New owner/contact fields
    ownerFirstName, ownerLastName, ownerEmail, ownerPhone,
    ein, businessAddress, businessCity, businessState, businessZip,
  } = body

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

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const admin = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const orgId = await resolveActiveOrganizationId({
    admin,
    userId: user.id,
    cookieStore,
    suggestedName: businessName ?? "Primary Organization",
  })

  // Save business profile
  const { error: bpError } = await admin.from("business_profiles").upsert({
    user_id: user.id,
    organization_id: orgId,
    business_name: businessName ?? null,
    business_type: businessType ?? null,
    entity_type: entityType ?? null,
    revenue_range: revenueRange ?? null,
    books_status: booksStatus ?? null,
    bookkeeping_platform: bookkeepingPlatform ?? null,
    worker_types: workerTypes ?? null,
    headcount: headcount ?? null,
    employee_count: employeeCount ?? null,
    needs_payroll: needsPayroll ?? null,
    payroll_platform: payrollPlatform ?? null,
    bank_accounts_count: bankAccountsCount ?? null,
    credit_cards_count: creditCardsCount ?? null,
    has_ach_vendors: hasAchVendors ?? null,
    selected_plan: selectedPlan ?? null,
    ein: ein ?? null,
    business_state: businessState ?? null,
    business_zip: businessZip ?? null,
    onboarding_completed_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }, { onConflict: "organization_id" })

  if (bpError) {
    console.error("Business profile save error:", bpError)
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 })
  }

  // Save owner/contact info to client_profiles
  if (ownerFirstName || ownerLastName || ownerEmail || ownerPhone || businessAddress) {
    const fullName = [ownerFirstName, ownerLastName].filter(Boolean).join(" ")
    await admin.from("client_profiles").upsert({
      user_id: user.id,
      organization_id: orgId,
      ...(fullName && { full_name: fullName }),
      ...(ownerFirstName && { owner_first_name: ownerFirstName }),
      ...(ownerLastName && { owner_last_name: ownerLastName }),
      ...(ownerEmail && { owner_email: ownerEmail }),
      ...(ownerPhone && { phone: ownerPhone }),
      ...(businessAddress && { business_address_line1: businessAddress }),
      ...(businessCity && { business_city: businessCity }),
      ...(businessAddress && { business_address: businessAddress }),
      updated_at: new Date().toISOString(),
    }, { onConflict: "organization_id" })
  }

  return NextResponse.json({ success: true })
}
