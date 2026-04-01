export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { buildGustoAuthUrl } from "@/lib/gusto"

const ADMIN_EMAIL = process.env.NOTIFICATION_EMAIL!

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const state = Buffer.from("firm:" + user.id).toString("base64url")
  return NextResponse.redirect(buildGustoAuthUrl(state))
}
