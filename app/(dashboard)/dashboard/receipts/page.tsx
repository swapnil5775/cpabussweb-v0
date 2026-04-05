"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Upload, Loader2, Receipt, CheckCircle2, Clock, AlertCircle,
  Mail, Smartphone, FileText, Download, Trash2, Eye, X
} from "lucide-react"

type ReceiptRow = {
  id: string
  file_name: string
  source: "upload" | "email"
  status: "pending" | "processing" | "extracted" | "reviewed"
  extracted_vendor: string | null
  extracted_date: string | null
  extracted_amount: number | null
  extracted_tax: number | null
  extracted_category: string | null
  email_from: string | null
  email_subject: string | null
  storage_path: string
  month_year: string | null
  created_at: string
}

const STATUS_CONFIG = {
  pending:    { label: "Pending OCR",  color: "bg-amber-100 text-amber-700",    icon: Clock },
  processing: { label: "Processing…",  color: "bg-blue-100 text-blue-700",      icon: Loader2 },
  extracted:  { label: "Data Ready",   color: "bg-green-100 text-green-700",    icon: CheckCircle2 },
  reviewed:   { label: "Reviewed",     color: "bg-primary/10 text-primary",     icon: CheckCircle2 },
}

const CATEGORY_LABELS: Record<string, string> = {
  food_beverage: "Food & Beverage",
  office_supplies: "Office Supplies",
  utilities: "Utilities",
  travel: "Travel",
  entertainment: "Entertainment",
  professional_services: "Professional Services",
  equipment: "Equipment",
  rent: "Rent",
  fuel: "Fuel",
  advertising: "Advertising",
  other: "Other",
}

function formatAmount(n: number | null) {
  if (n == null) return null
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n)
}

function formatDate(s: string | null) {
  if (!s) return null
  try { return new Date(s).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) }
  catch { return s }
}

export default function ReceiptsPage() {
  const [receipts, setReceipts] = useState<ReceiptRow[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [organizationId, setOrganizationId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const fetchReceipts = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const orgRes = await fetch("/api/organizations")
    const orgData = await orgRes.json().catch(() => ({}))
    const orgId = orgData?.activeOrganizationId ?? null
    setOrganizationId(orgId)

    const { data } = await supabase
      .from("receipts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(100)

    setReceipts((data ?? []) as ReceiptRow[])
    setLoading(false)
  }, [supabase])

  useEffect(() => { fetchReceipts() }, [fetchReceipts])

  // Poll for status updates on processing receipts
  useEffect(() => {
    const hasProcessing = receipts.some((r) => r.status === "processing" || r.status === "pending")
    if (!hasProcessing) return
    const timer = setTimeout(() => fetchReceipts(), 4000)
    return () => clearTimeout(timer)
  }, [receipts, fetchReceipts])

  async function uploadFile(file: File) {
    if (uploading) return
    setUploading(true)
    setError(null)

    const form = new FormData()
    form.append("file", file)

    const res = await fetch("/api/receipts/upload", { method: "POST", body: form })
    const json = await res.json().catch(() => ({}))

    if (!res.ok) {
      setError(json.error ?? "Upload failed. Please try again.")
    } else {
      await fetchReceipts()
    }
    setUploading(false)
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) uploadFile(file)
    e.target.value = ""
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) uploadFile(file)
  }

  async function handleDelete(receipt: ReceiptRow) {
    await supabase.storage.from("documents").remove([receipt.storage_path])
    await supabase.from("receipts").delete().eq("id", receipt.id)
    setReceipts((prev) => prev.filter((r) => r.id !== receipt.id))
  }

  async function handleDownload(receipt: ReceiptRow) {
    const { data } = await supabase.storage.from("documents").createSignedUrl(receipt.storage_path, 60)
    if (data?.signedUrl) window.open(data.signedUrl, "_blank")
  }

  async function handlePreview(receipt: ReceiptRow) {
    const { data } = await supabase.storage.from("documents").createSignedUrl(receipt.storage_path, 120)
    if (data?.signedUrl) setPreviewUrl(data.signedUrl)
  }

  const grouped = receipts.reduce<Record<string, ReceiptRow[]>>((acc, r) => {
    const key = r.month_year ?? r.created_at.slice(0, 7)
    if (!acc[key]) acc[key] = []
    acc[key].push(r)
    return acc
  }, {})

  const months = Object.keys(grouped).sort((a, b) => b.localeCompare(a))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Receipt Capture</h1>
            <Badge variant="outline" className="text-xs font-medium border-primary/30 text-primary">Beta</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Upload receipts directly or forward them to{" "}
            <span className="font-medium text-foreground">fileme@bookkeeping.business</span>. We extract and match them to your books.
          </p>
        </div>
        <Button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
          {uploading
            ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Uploading…</>
            : <><Upload className="h-4 w-4 mr-2" />Upload Receipt</>
          }
        </Button>
      </div>

      {/* Ingestion methods */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex items-start gap-3 pt-4 pb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
              <Upload className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold">Upload Here</p>
              <p className="text-xs text-muted-foreground">Drag & drop or click to upload JPG, PNG, PDF</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex items-start gap-3 pt-4 pb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
              <Mail className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold">Email Forward</p>
              <p className="text-xs text-muted-foreground">Forward receipts to <span className="font-medium">fileme@bookkeeping.business</span></p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-dashed border-border">
          <CardContent className="flex items-start gap-3 pt-4 pb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground shrink-0">
              <Smartphone className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">WhatsApp</p>
              <p className="text-xs text-muted-foreground">Coming soon — send receipt photos via WhatsApp</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`rounded-xl border-2 border-dashed transition-colors cursor-pointer px-6 py-8 text-center ${
          dragOver
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/40 hover:bg-muted/30"
        }`}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm">Uploading and extracting data…</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Receipt className="h-8 w-8" />
            <p className="text-sm font-medium">Drop receipt here or click to browse</p>
            <p className="text-xs">JPG, PNG, HEIC, WEBP or PDF · Max 20 MB</p>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        className="sr-only"
        accept=".jpg,.jpeg,.png,.heic,.heif,.webp,.pdf"
        onChange={handleFileInput}
      />

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 px-4 py-2 rounded-lg">{error}</p>
      )}

      {/* Receipt list */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : receipts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border px-6 py-16 text-center">
          <Receipt className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm font-medium">No receipts yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            Upload your first receipt above, or forward one to fileme@bookkeeping.business
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {months.map((month) => (
            <div key={month} className="space-y-2">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                {new Date(month + "-01").toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                <span className="ml-2 text-xs font-normal normal-case">
                  ({grouped[month].length} receipt{grouped[month].length !== 1 ? "s" : ""})
                </span>
              </h2>
              <div className="space-y-2">
                {grouped[month].map((r) => {
                  const cfg = STATUS_CONFIG[r.status] ?? STATUS_CONFIG.pending
                  const StatusIcon = cfg.icon
                  return (
                    <div
                      key={r.id}
                      className="rounded-xl border border-border bg-background px-4 py-3 flex items-center gap-3 group hover:border-primary/30 transition-colors"
                    >
                      {/* Source icon */}
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        {r.source === "email" ? <Mail className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                      </div>

                      {/* Main info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-medium truncate">
                            {r.extracted_vendor ?? r.file_name}
                          </p>
                          {r.extracted_amount != null && (
                            <span className="text-sm font-semibold text-primary tabular-nums">
                              {formatAmount(r.extracted_amount)}
                            </span>
                          )}
                          {r.extracted_category && (
                            <span className="text-xs text-muted-foreground hidden sm:inline">
                              {CATEGORY_LABELS[r.extracted_category] ?? r.extracted_category}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          {r.extracted_date && (
                            <span className="text-xs text-muted-foreground">{formatDate(r.extracted_date)}</span>
                          )}
                          {r.source === "email" && r.email_from && (
                            <span className="text-xs text-muted-foreground truncate">from {r.email_from}</span>
                          )}
                          {!r.extracted_vendor && !r.extracted_date && (
                            <span className="text-xs text-muted-foreground truncate">{r.file_name}</span>
                          )}
                        </div>
                      </div>

                      {/* Status badge */}
                      <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${cfg.color}`}>
                        <StatusIcon className={`h-3 w-3 ${r.status === "processing" ? "animate-spin" : ""}`} />
                        {cfg.label}
                      </span>

                      {/* Actions */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <button
                          type="button"
                          onClick={() => handlePreview(r)}
                          className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                          title="Preview"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDownload(r)}
                          className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                          title="Download"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(r)}
                          className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info note */}
      {receipts.length > 0 && (
        <div className="rounded-xl bg-muted/40 border border-border px-4 py-3 flex gap-3">
          <AlertCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">
            <strong className="text-foreground">OCR extraction</strong> runs automatically on every upload.
            Your bookkeeper reviews extracted data and matches it to your monthly books within 1–2 business days.
          </p>
        </div>
      )}

      {/* Preview modal */}
      {previewUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={() => setPreviewUrl(null)}
        >
          <div className="relative max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPreviewUrl(null)}
              className="absolute -top-3 -right-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-background border border-border shadow"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            <img
              src={previewUrl}
              alt="Receipt preview"
              className="w-full rounded-xl shadow-2xl object-contain max-h-[80vh]"
              onError={() => window.open(previewUrl, "_blank")}
            />
          </div>
        </div>
      )}
    </div>
  )
}
