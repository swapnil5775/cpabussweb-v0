export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { buildQBOAuthUrl } from "@/lib/qbo"

const ADMIN_EMAIL = process.env.NOTIFICATION_EMAIL!

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  // Use a special state to identify this as a firm-level connection
  const state = Buffer.from("firm:" + user.id).toString("base64url")
  const authUrl = buildQBOAuthUrl(state)
  return NextResponse.redirect(authUrl)
}
