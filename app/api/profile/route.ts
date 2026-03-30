export const dynamic = "force-dynamic"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { createClient as createServiceClient } from "@supabase/supabase-js"

async function getUser() {
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
  return supabase.auth.getUser()
}

const admin = () => createServiceClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  const { data: { user }, error } = await getUser()
  if (error || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data: profile } = await admin()
    .from("client_profiles")
    .select("full_name, phone, business_address_line1, business_address_line2, business_city, business_state, business_zip, personal_address_line1, personal_address_line2, personal_city, personal_state, personal_zip, secondary_email, secondary_email_verified, cpa_firm_name, cpa_full_name, cpa_email, cpa_phone, cpa_address_line1, cpa_address_line2, cpa_city, cpa_state, cpa_zip")
    .eq("user_id", user.id)
    .single()

  return NextResponse.json({ profile: profile ?? null })
}

export async function POST(request: Request) {
  const { data: { user }, error } = await getUser()
  if (error || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await request.json()
  const {
    full_name, phone,
    business_address_line1, business_address_line2, business_city, business_state, business_zip,
    personal_address_line1, personal_address_line2, personal_city, personal_state, personal_zip,
    secondary_email,
    cpa_firm_name, cpa_full_name, cpa_email, cpa_phone,
    cpa_address_line1, cpa_address_line2, cpa_city, cpa_state, cpa_zip,
  } = body

  // Fetch existing to preserve verified status if email unchanged
  const { data: existing } = await admin()
    .from("client_profiles")
    .select("secondary_email, secondary_email_verified")
    .eq("user_id", user.id)
    .single()

  const emailChanged = existing?.secondary_email !== secondary_email
  const secondary_email_verified = emailChanged ? false : (existing?.secondary_email_verified ?? false)

  const { error: upsertError } = await admin()
    .from("client_profiles")
    .upsert({
      user_id: user.id,
      full_name: full_name ?? null,
      phone: phone ?? null,
      business_address_line1: business_address_line1 ?? null,
      business_address_line2: business_address_line2 ?? null,
      business_city: business_city ?? null,
      business_state: business_state ?? null,
      business_zip: business_zip ?? null,
      personal_address_line1: personal_address_line1 ?? null,
      personal_address_line2: personal_address_line2 ?? null,
      personal_city: personal_city ?? null,
      personal_state: personal_state ?? null,
      personal_zip: personal_zip ?? null,
      secondary_email: secondary_email || null,
      secondary_email_verified,
      cpa_firm_name: cpa_firm_name || null,
      cpa_full_name: cpa_full_name || null,
      cpa_email: cpa_email || null,
      cpa_phone: cpa_phone || null,
      cpa_address_line1: cpa_address_line1 || null,
      cpa_address_line2: cpa_address_line2 || null,
      cpa_city: cpa_city || null,
      cpa_state: cpa_state || null,
      cpa_zip: cpa_zip || null,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" })

  if (upsertError) {
    console.error("Profile save error:", upsertError)
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
