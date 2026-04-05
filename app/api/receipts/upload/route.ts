import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createClient as createServiceClient } from "@supabase/supabase-js"

export const runtime = "nodejs"

const ALLOWED_TYPES = [
  "image/jpeg", "image/jpg", "image/png", "image/heic", "image/heif",
  "image/webp", "application/pdf",
]
const MAX_BYTES = 20 * 1024 * 1024 // 20 MB

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const admin = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Resolve active org
  const orgRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/organizations`, {
    headers: { cookie: request.headers.get("cookie") ?? "" },
  })
  const orgData = await orgRes.json().catch(() => ({}))
  const organizationId: string | null = orgData?.activeOrganizationId ?? null

  const formData = await request.formData()
  const file = formData.get("file") as File | null
  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 })
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "File type not supported. Upload JPG, PNG, HEIC, WEBP or PDF." }, { status: 400 })
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File exceeds 20 MB limit." }, { status: 400 })
  }

  const monthYear = new Date().toISOString().slice(0, 7) // YYYY-MM
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_")
  const storagePath = `receipts/${organizationId ?? user.id}/${monthYear}/${Date.now()}_${safeName}`

  const bytes = await file.arrayBuffer()
  const { error: storageError } = await admin.storage
    .from("documents")
    .upload(storagePath, new Uint8Array(bytes), {
      contentType: file.type,
      upsert: false,
    })

  if (storageError) {
    return NextResponse.json({ error: "Storage upload failed: " + storageError.message }, { status: 500 })
  }

  const { data: receipt, error: dbError } = await admin
    .from("receipts")
    .insert({
      user_id: user.id,
      organization_id: organizationId,
      storage_path: storagePath,
      file_name: file.name,
      file_size_bytes: file.size,
      source: "upload",
      status: "pending",
      month_year: monthYear,
    })
    .select("id")
    .single()

  if (dbError || !receipt) {
    return NextResponse.json({ error: "DB insert failed: " + dbError?.message }, { status: 500 })
  }

  // Trigger OCR async (fire and forget)
  fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/receipts/process`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ receipt_id: receipt.id, internal_secret: process.env.CRON_SECRET }),
  }).catch(() => {})

  return NextResponse.json({ receipt_id: receipt.id, status: "processing" })
}
