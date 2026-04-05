import { NextRequest, NextResponse } from "next/server"
import { createClient as createServiceClient } from "@supabase/supabase-js"
import Anthropic from "@anthropic-ai/sdk"

export const runtime = "nodejs"
export const maxDuration = 60

const EXTRACT_PROMPT = `You are extracting data from a receipt or invoice image/document.
Return ONLY a valid JSON object with exactly these fields (use null if not found):
{
  "vendor": "business name shown on receipt",
  "date": "YYYY-MM-DD format",
  "total": numeric total amount (no currency symbol),
  "tax": numeric tax amount (no currency symbol),
  "category": one of: food_beverage, office_supplies, utilities, travel, entertainment, professional_services, equipment, rent, fuel, advertising, other
}
No explanation, no markdown, just the JSON object.`

type ExtractedReceipt = {
  vendor: string | null
  date: string | null
  total: number | null
  tax: number | null
  category: string | null
}

async function extractWithClaude(
  fileBytes: Uint8Array,
  mimeType: string
): Promise<ExtractedReceipt | null> {
  if (!process.env.ANTHROPIC_API_KEY) return null

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  const base64 = Buffer.from(fileBytes).toString("base64")

  // Claude supports images + PDFs via document block
  const isImage = mimeType.startsWith("image/")
  const isPdf = mimeType === "application/pdf"
  if (!isImage && !isPdf) return null

  const contentBlock = isImage
    ? ({
        type: "image" as const,
        source: { type: "base64" as const, media_type: mimeType as "image/jpeg" | "image/png" | "image/gif" | "image/webp", data: base64 },
      })
    : ({
        type: "document" as const,
        source: { type: "base64" as const, media_type: "application/pdf" as const, data: base64 },
      })

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 512,
    messages: [
      {
        role: "user",
        content: [contentBlock, { type: "text", text: EXTRACT_PROMPT }],
      },
    ],
  })

  const text = response.content[0]?.type === "text" ? response.content[0].text.trim() : ""
  // Strip markdown fences if present
  const jsonStr = text.replace(/^```json?\n?/, "").replace(/\n?```$/, "").trim()

  try {
    const parsed = JSON.parse(jsonStr) as ExtractedReceipt
    return parsed
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({})) as { receipt_id?: string; internal_secret?: string }

  if (body.internal_secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { receipt_id } = body
  if (!receipt_id) return NextResponse.json({ error: "receipt_id required" }, { status: 400 })

  const admin = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Mark as processing
  await admin.from("receipts").update({ status: "processing", updated_at: new Date().toISOString() }).eq("id", receipt_id)

  // Fetch receipt record
  const { data: receipt } = await admin.from("receipts").select("storage_path, file_name").eq("id", receipt_id).single()
  if (!receipt) return NextResponse.json({ error: "Receipt not found" }, { status: 404 })

  // Download file from Supabase storage
  const { data: fileData, error: downloadError } = await admin.storage
    .from("documents")
    .download(receipt.storage_path)

  if (downloadError || !fileData) {
    await admin.from("receipts").update({ status: "pending", updated_at: new Date().toISOString() }).eq("id", receipt_id)
    return NextResponse.json({ error: "File download failed" }, { status: 500 })
  }

  // Detect MIME from file extension as fallback
  const ext = receipt.file_name.split(".").pop()?.toLowerCase() ?? ""
  const mimeMap: Record<string, string> = {
    jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png",
    heic: "image/heic", heif: "image/heic", webp: "image/webp",
    pdf: "application/pdf",
  }
  const mimeType = mimeMap[ext] ?? fileData.type ?? "image/jpeg"

  const bytes = new Uint8Array(await fileData.arrayBuffer())
  const extracted = await extractWithClaude(bytes, mimeType)

  if (!extracted) {
    // No API key or unsupported type — leave as pending for manual review
    await admin.from("receipts").update({
      status: "pending",
      updated_at: new Date().toISOString(),
    }).eq("id", receipt_id)
    return NextResponse.json({ status: "pending_manual" })
  }

  await admin.from("receipts").update({
    status: "extracted",
    extracted_vendor: extracted.vendor,
    extracted_date: extracted.date,
    extracted_amount: extracted.total,
    extracted_tax: extracted.tax,
    extracted_category: extracted.category,
    extracted_raw_json: extracted,
    updated_at: new Date().toISOString(),
  }).eq("id", receipt_id)

  return NextResponse.json({ status: "extracted", data: extracted })
}
