export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"
import { createClient as createAdmin } from "@supabase/supabase-js"
import { exchangeCodeForTokens, qboFetch } from "@/lib/qbo"

const admin = createAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.bookkeeping.business"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get("code")
  const state = url.searchParams.get("state")
  const realmId = url.searchParams.get("realmId")
  const error = url.searchParams.get("error")

  if (error || !code || !state || !realmId) {
    return NextResponse.redirect(`${SITE_URL}/dashboard?qbo=error`)
  }

  // Decode user ID and organization ID from state
  let userId: string
  let organizationId: string | null = null
  try {
    const decoded = Buffer.from(state, "base64url").toString("utf8")
    if (decoded.startsWith("{")) {
      const payload = JSON.parse(decoded) as { user_id?: string; organization_id?: string }
      userId = payload.user_id ?? ""
      organizationId = payload.organization_id ?? null
    } else {
      userId = decoded
    }
  } catch {
    return NextResponse.redirect(`${SITE_URL}/dashboard?qbo=error`)
  }
  if (!userId) return NextResponse.redirect(`${SITE_URL}/dashboard?qbo=error`)

  // Exchange code for tokens
  let tokens
  try {
    tokens = await exchangeCodeForTokens(code)
  } catch {
    return NextResponse.redirect(`${SITE_URL}/dashboard?qbo=error`)
  }

  const expiresAt = new Date(Date.now() + tokens.expires_in * 1000).toISOString()

  if (!organizationId) {
    const { data: defaultOrg } = await admin
      .from("organizations")
      .select("id")
      .eq("user_id", userId)
      .eq("is_default", true)
      .maybeSingle()
    organizationId = defaultOrg?.id ?? null
  }

  if (!organizationId) {
    return NextResponse.redirect(`${SITE_URL}/dashboard?qbo=error`)
  }

  // Store connection — temporarily with placeholder company name
  await admin.from("qbo_connections").upsert({
    user_id: userId,
    organization_id: organizationId,
    realm_id: realmId,
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    token_expires_at: expiresAt,
    company_name: null,
    connected_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }, { onConflict: "organization_id" })

  // Fetch company name from QBO (non-blocking)
  try {
    const infoRes = await qboFetch(userId, organizationId, "/companyinfo/" + realmId)
    if (infoRes?.ok) {
      const infoData = await infoRes.json()
      const companyName = infoData?.CompanyInfo?.CompanyName
      if (companyName) {
        await admin.from("qbo_connections").update({
          company_name: companyName,
          updated_at: new Date().toISOString(),
        }).eq("user_id", userId).eq("organization_id", organizationId)
      }
    }
  } catch {/* non-blocking */}

  return NextResponse.redirect(`${SITE_URL}/dashboard?qbo=connected`)
}
