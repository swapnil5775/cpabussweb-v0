"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Upload, Loader2, Receipt, CheckCircle2, Clock, AlertCircle,
  Mail, Smartphone, FileText, Download, Trash2, Eye, X,
  Copy, Check, ChevronDown, ChevronRight, ExternalLink,
  Store, CalendarDays, DollarSign, Tag, AtSign, MessageSquare
} from "lucide-react"

type ReceiptRow = {
  id: string
  file_name: string
  file_size_bytes: number | null
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
  pending:    { label: "Pending OCR",  color: "bg-amber-100 text-amber-700",  icon: Clock },
  processing: { label: "Processing…",  color: "bg-blue-100 text-blue-700",    icon: Loader2 },
  extracted:  { label: "Data Ready",   color: "bg-green-100 text-green-700",  icon: CheckCircle2 },
  reviewed:   { label: "Reviewed",     color: "bg-primary/10 text-primary",   icon: CheckCircle2 },
}

const CATEGORY_LABELS: Record<string, string> = {
  food_beverage: "Food & Beverage", office_supplies: "Office Supplies",
  utilities: "Utilities", travel: "Travel", entertainment: "Entertainment",
  professional_services: "Professional Services", equipment: "Equipment",
  rent: "Rent", fuel: "Fuel", advertising: "Advertising", other: "Other",
}

function formatAmount(n: number | null) {
  if (n == null) return null
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n)
}

function formatDate(s: string | null) {
  if (!s) return null
  try { return new Date(s + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) }
  catch { return s }
}

function formatBytes(b: number | null) {
  if (!b) return ""
  if (b < 1024) return `${b} B`
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`
  return `${(b / 1024 / 1024).toFixed(1)} MB`
}

function isPdf(name: string) {
  return name.toLowerCase().endsWith(".pdf")
}

export default function ReceiptsPage() {
  const [receipts, setReceipts] = useState<ReceiptRow[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [receiptEmail, setReceiptEmail] = useState<string>("")
  const [copied, setCopied] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [previewIsPdf, setPreviewIsPdf] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const fetchReceipts = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from("receipts").select("*").eq("user_id", user.id)
      .order("created_at", { ascending: false }).limit(100)
    setReceipts((data ?? []) as ReceiptRow[])
    setLoading(false)
  }, [supabase])

  useEffect(() => { fetchReceipts() }, [fetchReceipts])

  useEffect(() => {
    fetch("/api/receipts/email-address")
      .then(r => r.json())
      .then(d => { if (d.receipt_email) setReceiptEmail(d.receipt_email) })
      .catch(() => {})
  }, [])

  // Auto-refresh while any receipt is still processing
  useEffect(() => {
    const busy = receipts.some(r => r.status === "processing" || r.status === "pending")
    if (!busy) return
    const t = setTimeout(() => fetchReceipts(), 4000)
    return () => clearTimeout(t)
  }, [receipts, fetchReceipts])

  function copyEmail() {
    navigator.clipboard.writeText(receiptEmail).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000)
    })
  }

  async function uploadFile(file: File) {
    if (uploading) return
    setUploading(true); setError(null)
    const form = new FormData(); form.append("file", file)
    const res = await fetch("/api/receipts/upload", { method: "POST", body: form })
    const json = await res.json().catch(() => ({}))
    if (!res.ok) setError(json.error ?? "Upload failed.")
    else await fetchReceipts()
    setUploading(false)
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (file) uploadFile(file); e.target.value = ""
  }

  // Support multiple files on drop
  function handleDrop(e: React.DragEvent) {
    e.preventDefault(); setDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    files.forEach(f => uploadFile(f))
  }

  async function handleDelete(r: ReceiptRow) {
    await supabase.storage.from("documents").remove([r.storage_path])
    await supabase.from("receipts").delete().eq("id", r.id)
    setReceipts(prev => prev.filter(x => x.id !== r.id))
    if (expandedId === r.id) setExpandedId(null)
  }

  async function handleView(r: ReceiptRow) {
    const { data } = await supabase.storage.from("documents").createSignedUrl(r.storage_path, 120)
    if (!data?.signedUrl) return
    if (isPdf(r.file_name)) {
      window.open(data.signedUrl, "_blank") // PDFs open in new tab
    } else {
      setPreviewIsPdf(false)
      setPreviewUrl(data.signedUrl)
    }
  }

  async function handleDownload(r: ReceiptRow) {
    const { data } = await supabase.storage.from("documents").createSignedUrl(r.storage_path, 60)
    if (data?.signedUrl) {
      const a = document.createElement("a"); a.href = data.signedUrl
      a.download = r.file_name; a.click()
    }
  }

  const grouped = receipts.reduce<Record<string, ReceiptRow[]>>((acc, r) => {
    const key = r.month_year ?? r.created_at.slice(0, 7)
    if (!acc[key]) acc[key] = []; acc[key].push(r); return acc
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
            Upload receipts directly or forward them to your personal receipt address. We extract and match them to your books.
          </p>
        </div>
        <Button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
          {uploading
            ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Uploading…</>
            : <><Upload className="h-4 w-4 mr-2" />Upload Receipt</>}
        </Button>
      </div>

      {/* Ingestion method cards */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex items-start gap-3 pt-4 pb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
              <Upload className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold">Upload Here</p>
              <p className="text-xs text-muted-foreground">Drag & drop or click — JPG, PNG, PDF. Multiple files supported.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex items-start gap-3 pt-4 pb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
              <Mail className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">Your Receipt Email</p>
              {receiptEmail ? (
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-xs font-mono text-foreground truncate">{receiptEmail}</span>
                  <button onClick={copyEmail} className="shrink-0 text-muted-foreground hover:text-primary transition-colors" title="Copy">
                    {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              ) : (
                <div className="h-3 w-40 rounded bg-muted animate-pulse mt-1" />
              )}
              <p className="text-xs text-muted-foreground mt-0.5">Forward any receipt email here — arrives within ~1 min</p>
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
              <p className="text-xs text-muted-foreground">Coming soon — snap & send receipt photos via WhatsApp</p>
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
          dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/40 hover:bg-muted/30"
        }`}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm">Uploading and queuing OCR…</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Receipt className="h-8 w-8" />
            <p className="text-sm font-medium">Drop receipts here or click to browse</p>
            <p className="text-xs">JPG, PNG, HEIC, WEBP or PDF · Max 20 MB · Multiple files OK</p>
          </div>
        )}
      </div>

      <input ref={fileInputRef} type="file" className="sr-only"
        accept=".jpg,.jpeg,.png,.heic,.heif,.webp,.pdf" multiple onChange={handleFileInput} />

      {error && <p className="text-sm text-destructive bg-destructive/10 px-4 py-2 rounded-lg">{error}</p>}

      {/* Receipt list */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : receipts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border px-6 py-16 text-center">
          <Receipt className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm font-medium">No receipts yet</p>
          <p className="text-xs text-muted-foreground mt-1">Upload your first receipt above, or forward one to your receipt email address.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {months.map((month) => (
            <div key={month} className="space-y-1.5">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide px-1">
                {new Date(month + "-01").toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                <span className="ml-2 text-xs font-normal normal-case">
                  ({grouped[month].length} receipt{grouped[month].length !== 1 ? "s" : ""})
                </span>
              </h2>

              <div className="space-y-1.5">
                {grouped[month].map((r) => {
                  const cfg = STATUS_CONFIG[r.status] ?? STATUS_CONFIG.pending
                  const StatusIcon = cfg.icon
                  const isExpanded = expandedId === r.id
                  const hasExtracted = r.extracted_vendor || r.extracted_amount || r.extracted_date

                  return (
                    <div key={r.id} className={`rounded-xl border bg-background transition-colors ${
                      isExpanded ? "border-primary/40 shadow-sm" : "border-border hover:border-primary/20"
                    }`}>
                      {/* Main row */}
                      <div className="flex items-center gap-3 px-4 py-3">

                        {/* Expand toggle */}
                        <button
                          type="button"
                          onClick={() => setExpandedId(isExpanded ? null : r.id)}
                          className="shrink-0 text-muted-foreground hover:text-primary transition-colors"
                        >
                          {isExpanded
                            ? <ChevronDown className="h-4 w-4" />
                            : <ChevronRight className="h-4 w-4" />}
                        </button>

                        {/* Source icon */}
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                          r.source === "email" ? "bg-blue-50 text-blue-600" : "bg-muted text-muted-foreground"
                        }`}>
                          {r.source === "email" ? <Mail className="h-3.5 w-3.5" /> : <FileText className="h-3.5 w-3.5" />}
                        </div>

                        {/* Primary info */}
                        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : r.id)}>
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
                              <Badge variant="secondary" className="text-xs hidden sm:inline-flex">
                                {CATEGORY_LABELS[r.extracted_category] ?? r.extracted_category}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            {r.extracted_date && (
                              <span className="text-xs text-muted-foreground">{formatDate(r.extracted_date)}</span>
                            )}
                            {!r.extracted_vendor && !r.extracted_date && (
                              <span className="text-xs text-muted-foreground truncate">{r.file_name}</span>
                            )}
                            {r.file_size_bytes && (
                              <span className="text-xs text-muted-foreground">{formatBytes(r.file_size_bytes)}</span>
                            )}
                          </div>
                        </div>

                        {/* Status */}
                        <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${cfg.color}`}>
                          <StatusIcon className={`h-3 w-3 ${r.status === "processing" ? "animate-spin" : ""}`} />
                          <span className="hidden sm:inline">{cfg.label}</span>
                        </span>

                        {/* Action buttons — always visible */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button type="button" onClick={() => handleView(r)}
                            className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                            title={isPdf(r.file_name) ? "Open PDF" : "Preview image"}>
                            {isPdf(r.file_name) ? <ExternalLink className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                          </button>
                          <button type="button" onClick={() => handleDownload(r)}
                            className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                            title="Download">
                            <Download className="h-3.5 w-3.5" />
                          </button>
                          <button type="button" onClick={() => handleDelete(r)}
                            className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                            title="Delete">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Expanded detail panel */}
                      {isExpanded && (
                        <div className="border-t border-border bg-muted/20 px-4 py-4 rounded-b-xl">
                          {hasExtracted ? (
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                              {r.extracted_vendor && (
                                <div className="flex items-start gap-2">
                                  <Store className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                                  <div>
                                    <p className="text-xs text-muted-foreground">Vendor</p>
                                    <p className="text-sm font-medium">{r.extracted_vendor}</p>
                                  </div>
                                </div>
                              )}
                              {r.extracted_date && (
                                <div className="flex items-start gap-2">
                                  <CalendarDays className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                                  <div>
                                    <p className="text-xs text-muted-foreground">Date</p>
                                    <p className="text-sm font-medium">{formatDate(r.extracted_date)}</p>
                                  </div>
                                </div>
                              )}
                              {r.extracted_amount != null && (
                                <div className="flex items-start gap-2">
                                  <DollarSign className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                                  <div>
                                    <p className="text-xs text-muted-foreground">Total</p>
                                    <p className="text-sm font-medium tabular-nums">{formatAmount(r.extracted_amount)}</p>
                                  </div>
                                </div>
                              )}
                              {r.extracted_tax != null && (
                                <div className="flex items-start gap-2">
                                  <DollarSign className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                                  <div>
                                    <p className="text-xs text-muted-foreground">Tax</p>
                                    <p className="text-sm font-medium tabular-nums">{formatAmount(r.extracted_tax)}</p>
                                  </div>
                                </div>
                              )}
                              {r.extracted_category && (
                                <div className="flex items-start gap-2">
                                  <Tag className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                                  <div>
                                    <p className="text-xs text-muted-foreground">Category</p>
                                    <p className="text-sm font-medium">{CATEGORY_LABELS[r.extracted_category] ?? r.extracted_category}</p>
                                  </div>
                                </div>
                              )}
                              {r.source === "email" && r.email_from && (
                                <div className="flex items-start gap-2">
                                  <AtSign className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                                  <div>
                                    <p className="text-xs text-muted-foreground">Sent from</p>
                                    <p className="text-sm font-medium truncate">{r.email_from}</p>
                                  </div>
                                </div>
                              )}
                              {r.email_subject && (
                                <div className="flex items-start gap-2 sm:col-span-2">
                                  <MessageSquare className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                                  <div>
                                    <p className="text-xs text-muted-foreground">Email subject</p>
                                    <p className="text-sm font-medium">{r.email_subject}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <p className="text-xs text-muted-foreground italic">
                              {r.status === "pending" || r.status === "processing"
                                ? "OCR extraction in progress — details will appear here shortly."
                                : "No data could be extracted from this file. Your bookkeeper will review it manually."}
                            </p>
                          )}

                          {/* File info + action row */}
                          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/60">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <FileText className="h-3.5 w-3.5" />
                              <span className="truncate max-w-[200px]">{r.file_name}</span>
                              {r.file_size_bytes && <span>· {formatBytes(r.file_size_bytes)}</span>}
                            </div>
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline" className="h-7 text-xs bg-transparent gap-1.5"
                                onClick={() => handleView(r)}>
                                {isPdf(r.file_name)
                                  ? <><ExternalLink className="h-3 w-3" />Open PDF</>
                                  : <><Eye className="h-3 w-3" />View Image</>}
                              </Button>
                              <Button size="sm" variant="outline" className="h-7 text-xs bg-transparent gap-1.5"
                                onClick={() => handleDownload(r)}>
                                <Download className="h-3 w-3" />Download
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {receipts.length > 0 && (
        <div className="rounded-xl bg-muted/40 border border-border px-4 py-3 flex gap-3">
          <AlertCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">
            <strong className="text-foreground">OCR extraction</strong> runs automatically on every receipt.
            Click the arrow on any row to see extracted details. Your bookkeeper reviews and matches receipts to your books within 1–2 business days.
          </p>
        </div>
      )}

      {/* Image preview modal */}
      {previewUrl && !previewIsPdf && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setPreviewUrl(null)}>
          <div className="relative max-w-2xl w-full" onClick={e => e.stopPropagation()}>
            <button onClick={() => setPreviewUrl(null)}
              className="absolute -top-3 -right-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-background border border-border shadow">
              <X className="h-3.5 w-3.5" />
            </button>
            <img src={previewUrl} alt="Receipt preview"
              className="w-full rounded-xl shadow-2xl object-contain max-h-[85vh]"
              onError={() => { window.open(previewUrl, "_blank"); setPreviewUrl(null) }} />
          </div>
        </div>
      )}
    </div>
  )
}
