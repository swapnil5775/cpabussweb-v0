import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createClient as createServiceClient } from "@supabase/supabase-js"

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const path = request.nextUrl.searchParams.get("path")
  if (!path) return NextResponse.json({ error: "Missing path" }, { status: 400 })

  // Verify the receipt belongs to this user
  const admin = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data: receipt } = await admin
    .from("receipts")
    .select("id")
    .eq("storage_path", path)
    .eq("user_id", user.id)
    .single()

  if (!receipt) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const { data, error } = await admin.storage
    .from("documents")
    .createSignedUrl(path, 300) // 5-minute URL

  if (error || !data?.signedUrl) {
    return NextResponse.json({ error: error?.message ?? "Failed to generate URL" }, { status: 500 })
  }

  return NextResponse.json({ url: data.signedUrl })
}
