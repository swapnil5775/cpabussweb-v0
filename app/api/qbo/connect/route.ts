export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { buildQBOAuthUrl } from "@/lib/qbo"

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect("/login")

  // State = base64(userId) — used to identify the user on callback
  const state = Buffer.from(user.id).toString("base64url")
  const authUrl = buildQBOAuthUrl(state)

  return NextResponse.redirect(authUrl)
}
