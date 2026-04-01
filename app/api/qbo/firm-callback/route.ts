export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"
import { createClient as createAdmin } from "@supabase/supabase-js"
import { exchangeCodeForTokens } from "@/lib/qbo"

const admin = createAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.bookkeeping.business"
const FIRM_REDIRECT_URI = `${SITE_URL}/api/qbo/firm-callback`

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get("code")
  const state = url.searchParams.get("state")
  const error = url.searchParams.get("error")

  if (error || !code || !state) {
    return NextResponse.redirect(`${SITE_URL}/admin?firm_qbo=error`)
  }

  const decoded = Buffer.from(state, "base64url").toString("utf8")
  if (!decoded.startsWith("firm:")) {
    return NextResponse.redirect(`${SITE_URL}/admin?firm_qbo=error`)
  }

  let tokens
  try {
    tokens = await exchangeCodeForTokens(code, FIRM_REDIRECT_URI)
  } catch {
    return NextResponse.redirect(`${SITE_URL}/admin?firm_qbo=error`)
  }

  const expiresAt = new Date(Date.now() + tokens.expires_in * 1000).toISOString()

  // Upsert — only one firm connection row ever exists
  await admin.from("qbo_firm_connection").upsert({
    id: "00000000-0000-0000-0000-000000000001", // fixed ID, single row
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    token_expires_at: expiresAt,
    updated_at: new Date().toISOString(),
  }, { onConflict: "id" })

  return NextResponse.redirect(`${SITE_URL}/admin?firm_qbo=connected`)
}
