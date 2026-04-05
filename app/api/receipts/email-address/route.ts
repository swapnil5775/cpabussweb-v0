import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createClient as createServiceClient } from "@supabase/supabase-js"
import { resolveActiveOrganizationId } from "@/lib/organizations"
import { cookies } from "next/headers"
import crypto from "crypto"

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const admin = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const cookieStore = await cookies()
  const organizationId = await resolveActiveOrganizationId({ admin, userId: user.id, cookieStore }).catch(() => null)
  if (!organizationId) return NextResponse.json({ error: "No organization" }, { status: 404 })

  // Get or create token
  let { data: org } = await admin
    .from("organizations")
    .select("receipt_email_token")
    .eq("id", organizationId)
    .single()

  if (!org?.receipt_email_token) {
    const token = "bk" + crypto.randomBytes(5).toString("hex")
    const { data: updated } = await admin
      .from("organizations")
      .update({ receipt_email_token: token })
      .eq("id", organizationId)
      .select("receipt_email_token")
      .single()
    org = updated
  }

  const token = org?.receipt_email_token
  const receiptEmail = `fileme+${token}@bookkeeping.business`

  return NextResponse.json({ receipt_email: receiptEmail, token })
}
