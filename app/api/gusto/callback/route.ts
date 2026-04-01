export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"
import { createClient as createAdmin } from "@supabase/supabase-js"
import { exchangeGustoCode } from "@/lib/gusto"

const admin = createAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.bookkeeping.business"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const state = searchParams.get("state")
  const error = searchParams.get("error")

  if (error || !code || !state) {
    return NextResponse.redirect(`${SITE_URL}/admin?gusto=error`)
  }

  const decoded = Buffer.from(state, "base64url").toString("utf8")
  if (!decoded.startsWith("firm:")) {
    return NextResponse.redirect(`${SITE_URL}/admin?gusto=error`)
  }

  let tokens
  try {
    tokens = await exchangeGustoCode(code)
  } catch {
    return NextResponse.redirect(`${SITE_URL}/admin?gusto=error`)
  }

  const expiresAt = new Date(Date.now() + tokens.expires_in * 1000).toISOString()

  await admin.from("gusto_firm_connection").upsert({
    id: "00000000-0000-0000-0000-000000000001",
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    token_expires_at: expiresAt,
    updated_at: new Date().toISOString(),
  }, { onConflict: "id" })

  return NextResponse.redirect(`${SITE_URL}/admin?gusto=connected`)
}
