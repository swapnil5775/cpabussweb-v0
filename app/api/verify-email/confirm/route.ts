export const dynamic = "force-dynamic"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { createClient as createServiceClient } from "@supabase/supabase-js"
import { resolveActiveOrganizationId } from "@/lib/organizations"

export async function POST(request: Request) {
  const { email, code } = await request.json()
  if (!email || !code) {
    return NextResponse.json({ error: "Email and code are required" }, { status: 400 })
  }

  // Auth check
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
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

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

  const { data: profile, error: fetchError } = await admin
    .from("client_profiles")
    .select("secondary_email, secondary_email_code, secondary_email_code_expires_at")
    .eq("user_id", user.id)
    .eq("organization_id", orgId)
    .maybeSingle()

  if (fetchError || !profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 })
  }

  if (profile.secondary_email !== email) {
    return NextResponse.json({ error: "Email mismatch" }, { status: 400 })
  }

  if (profile.secondary_email_code !== code) {
    return NextResponse.json({ error: "Invalid code" }, { status: 400 })
  }

  const expired = !profile.secondary_email_code_expires_at ||
    new Date(profile.secondary_email_code_expires_at) < new Date()

  if (expired) {
    return NextResponse.json({ error: "Code expired. Please request a new one." }, { status: 400 })
  }

  // Mark verified, clear code
  const { error: updateError } = await admin
    .from("client_profiles")
    .update({
      secondary_email_verified: true,
      secondary_email_code: null,
      secondary_email_code_expires_at: null,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", user.id)
    .eq("organization_id", orgId)

  if (updateError) {
    return NextResponse.json({ error: "Failed to verify email" }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
