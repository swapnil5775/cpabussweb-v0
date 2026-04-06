export const dynamic = "force-dynamic"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { ACTIVE_ORG_COOKIE, getAdminClient } from "@/lib/organizations"

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

  const { organization_id } = await request.json().catch(() => ({}))
  if (!organization_id || typeof organization_id !== "string") {
    return NextResponse.json({ error: "organization_id is required" }, { status: 400 })
  }

  const admin = getAdminClient()
  const { data: org } = await admin
    .from("organizations")
    .select("id")
    .eq("id", organization_id)
    .eq("user_id", user.id)
    .maybeSingle()

  if (!org) {
    return NextResponse.json({ error: "Organization not found" }, { status: 404 })
  }

  const response = NextResponse.json({ success: true, organization_id })
  response.cookies.set(ACTIVE_ORG_COOKIE, organization_id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  })
  return response
}
