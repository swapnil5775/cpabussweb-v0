import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createClient as createServiceClient } from "@supabase/supabase-js"
import { resolveActiveOrganizationId } from "@/lib/organizations"
import { checkReceiptLimit } from "@/lib/receipt-limits"
import { cookies } from "next/headers"

export const runtime = "nodejs"

const EXT_TO_MIME: Record<string, string> = {
  jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png",
  heic: "image/heic", heif: "image/heic", webp: "image/webp",
  gif: "image/gif", pdf: "application/pdf",
}

const ALLOWED_MIME = new Set(Object.values(EXT_TO_MIME))
const MAX_BYTES = 20 * 1024 * 1024 // 20 MB

function resolveMime(fileName: string, declared: string): string {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? ""
  if (declared && ALLOWED_MIME.has(declared)) return declared
  return EXT_TO_MIME[ext] ?? declared ?? ""
}

export async function POST(request: NextRequest) {
  // Read body first — can only do this once
  const formData = await request.formData()
  const file = formData.get("file") as File | null

  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 })

  const mimeType = resolveMime(file.name, file.type)
  if (!ALLOWED_MIME.has(mimeType)) {
    return NextResponse.json({ error: `File type not supported (${file.type || "unknown"}). Upload JPG, PNG, HEIC, WEBP or PDF.` }, { status: 400 })
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File exceeds 20 MB limit." }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const admin = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Resolve active org directly (no internal fetch needed)
  const cookieStore = await cookies()
  let organizationId: string | null = null
  try {
    organizationId = await resolveActiveOrganizationId({ admin, userId: user.id, cookieStore })
  } catch {
    organizationId = null
  }

  // Check receipt credit limit before uploading
  if (organizationId) {
    const limitError = await checkReceiptLimit(admin, organizationId)
    if (limitError) {
      return NextResponse.json({ error: limitError }, { status: 429 })
    }
  }

  const monthYear = new Date().toISOString().slice(0, 7)
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_")
  const storagePath = `receipts/${organizationId ?? user.id}/${monthYear}/${Date.now()}_${safeName}`

  const bytes = await file.arrayBuffer()
  const { error: storageError } = await admin.storage
    .from("documents")
    .upload(storagePath, new Uint8Array(bytes), { contentType: mimeType, upsert: false })

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
