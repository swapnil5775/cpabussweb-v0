export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { buildQBOAuthUrl } from "@/lib/qbo"

const ADMIN_EMAIL = process.env.NOTIFICATION_EMAIL!
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.bookkeeping.business"
const FIRM_REDIRECT_URI = `${SITE_URL}/api/qbo/firm-callback`

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  // Use a special state to identify this as a firm-level connection
  const state = Buffer.from("firm:" + user.id).toString("base64url")
  const authUrl = buildQBOAuthUrl(state, FIRM_REDIRECT_URI)
  return NextResponse.redirect(authUrl)
}
