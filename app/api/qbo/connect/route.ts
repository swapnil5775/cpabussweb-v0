export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { buildQBOAuthUrl } from "@/lib/qbo"
import { cookies } from "next/headers"
import { getAdminClient, resolveActiveOrganizationId } from "@/lib/organizations"

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect("/login")
  const cookieStore = await cookies()
  const admin = getAdminClient()
  const organizationId = await resolveActiveOrganizationId({
    admin,
    userId: user.id,
    cookieStore,
    suggestedName: "Primary Organization",
  })

  const statePayload = { user_id: user.id, organization_id: organizationId }
  const state = Buffer.from(JSON.stringify(statePayload)).toString("base64url")
  const authUrl = buildQBOAuthUrl(state)

  return NextResponse.redirect(authUrl)
}
