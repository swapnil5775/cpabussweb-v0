export const dynamic = "force-dynamic"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import {
  ACTIVE_ORG_COOKIE,
  ensureDefaultOrganization,
  getAdminClient,
  listOrganizationsForUser,
  resolveActiveOrganizationId,
} from "@/lib/organizations"

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

  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const admin = getAdminClient()
  await ensureDefaultOrganization(admin, user.id, "Primary Organization")
  const organizations = await listOrganizationsForUser(admin, user.id)
  const activeOrganizationId = await resolveActiveOrganizationId({
    admin,
    userId: user.id,
    cookieStore,
  })

  const response = NextResponse.json({
    organizations: organizations.map((org) => ({
      id: org.id,
      name: org.name,
      country_code: org.country_code,
      accounting_platform: org.accounting_platform,
      is_default: org.is_default,
    })),
    activeOrganizationId,
  })

  response.cookies.set(ACTIVE_ORG_COOKIE, activeOrganizationId, {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  })

  return response
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
  const name = typeof body?.name === "string" ? body.name.trim() : ""
  const countryCode = typeof body?.country_code === "string" ? body.country_code.trim().toUpperCase() : null
  const platform = typeof body?.accounting_platform === "string" ? body.accounting_platform.trim().toLowerCase() : null
  if (!name) return NextResponse.json({ error: "Organization name is required" }, { status: 400 })

  const admin = getAdminClient()
  const { data: created, error: createError } = await admin
    .from("organizations")
    .insert({
      user_id: user.id,
      name,
      country_code: countryCode || "US",
      accounting_platform: platform,
      is_default: false,
    })
    .select("id, name, country_code, accounting_platform, is_default")
    .single()

  if (createError || !created) {
    return NextResponse.json({ error: createError?.message ?? "Failed to create organization" }, { status: 500 })
  }

  const response = NextResponse.json({ organization: created })
  response.cookies.set(ACTIVE_ORG_COOKIE, created.id, {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  })
  return response
}
