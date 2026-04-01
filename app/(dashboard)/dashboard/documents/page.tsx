"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Building2, CreditCard, TrendingUp, FileText, Receipt,
  Users, Shield, Zap, Droplets, Home, FolderOpen,
  Upload, Trash2, Download, Loader2, ChevronDown, ChevronRight,
  CheckCircle2, Clock
} from "lucide-react"

type Doc = {
  id: string
  file_name: string
  document_type: string
  file_size_bytes: number | null
  created_at: string
  storage_path: string
  tax_year: number
  review_status: string
}

const CATEGORIES = [
  { id: "bank_statement",    label: "Bank Statements",        icon: Building2,   description: "Monthly bank account statements" },
  { id: "credit_card",       label: "Credit Card Statements", icon: CreditCard,  description: "Monthly credit card statements" },
  { id: "income_statement",  label: "Income Statement",       icon: TrendingUp,  description: "P&L, sales reports, revenue records" },
  { id: "invoices",          label: "Invoices",               icon: FileText,    description: "Invoices issued to customers" },
  { id: "expense_sheet",     label: "Expense Sheet",          icon: Receipt,     description: "Business expense records and receipts" },
  { id: "payroll",           label: "Payroll Reports",        icon: Users,       description: "Payroll summaries and tax forms (W-2, 1099)" },
  { id: "insurance",         label: "Insurance",              icon: Shield,      description: "Business insurance policies and renewals" },
  { id: "utility_bills",     label: "Utility Bills",          icon: Zap,         description: "Electric, gas, internet, phone bills" },
  { id: "water_bill",        label: "Water Bills",            icon: Droplets,    description: "Water and sewer utility bills" },
  { id: "rent_mortgage",     label: "Rent / Mortgage",        icon: Home,        description: "Lease agreement or mortgage statement" },
  { id: "other",             label: "Other Documents",        icon: FolderOpen,  description: "Any other business-related documents" },
]

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = [CURRENT_YEAR, CURRENT_YEAR - 1, CURRENT_YEAR - 2, CURRENT_YEAR - 3]

function formatBytes(bytes: number | null) {
  if (!bytes) return ""
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export default function DocumentsPage() {
  const [docs, setDocs] = useState<Doc[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR)
  const [openCategory, setOpenCategory] = useState<string | null>(null)
  const [uploading, setUploading] = useState<string | null>(null) // category id being uploaded
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadingCategory = useRef<string | null>(null)
  const supabase = createClient()

  const fetchDocs = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from("documents")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
    setDocs(data ?? [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { fetchDocs() }, [fetchDocs])

  // Docs for selected year
  const yearDocs = docs.filter((d) => (d.tax_year ?? new Date(d.created_at).getFullYear()) === selectedYear)

  // Count per category for selected year
  function countFor(catId: string) {
    return yearDocs.filter((d) => d.document_type === catId).length
  }

  function docsForCategory(catId: string) {
    return yearDocs.filter((d) => d.document_type === catId)
  }

  function triggerUpload(catId: string) {
    uploadingCategory.current = catId
    fileInputRef.current?.click()
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    const catId = uploadingCategory.current
    if (!file || !catId) return

    setUploading(catId)
    setError(null)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError("Not authenticated"); setUploading(null); return }

    const path = `${user.id}/${selectedYear}/${catId}/${Date.now()}_${file.name}`
    const { error: uploadError } = await supabase.storage.from("documents").upload(path, file)
    if (uploadError) {
      setError("Upload failed: " + uploadError.message)
      setUploading(null)
      e.target.value = ""
      return
    }

    await supabase.from("documents").insert({
      user_id: user.id,
      file_name: file.name,
      storage_path: path,
      file_size_bytes: file.size,
      document_type: catId,
      tax_year: selectedYear,
      review_status: "pending",
    })

    // Notify admin via email (fire and forget)
    fetch("/api/documents/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        file_name: file.name,
        document_type: catId,
        tax_year: selectedYear,
        file_size_bytes: file.size,
      }),
    }).catch(() => {})

    await fetchDocs()
    setUploading(null)
    e.target.value = ""
  }

  async function handleDelete(doc: Doc) {
    await supabase.storage.from("documents").remove([doc.storage_path])
    await supabase.from("documents").delete().eq("id", doc.id)
    setDocs((prev) => prev.filter((d) => d.id !== doc.id))
  }

  async function handleDownload(doc: Doc) {
    const { data } = await supabase.storage.from("documents").createSignedUrl(doc.storage_path, 60)
    if (data?.signedUrl) window.open(data.signedUrl, "_blank")
  }

  const totalUploaded = yearDocs.length
  const totalReviewed = yearDocs.filter((d) => d.review_status === "reviewed").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Document Vault</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Upload your financial documents by category. Our team reviews and posts them to your books.
          </p>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <FileText className="h-3.5 w-3.5" />
            {totalUploaded} files
          </span>
          {totalReviewed > 0 && (
            <span className="flex items-center gap-1 text-green-600">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {totalReviewed} reviewed
            </span>
          )}
        </div>
      </div>

      {/* Year selector */}
      <div className="flex gap-2 flex-wrap">
        {YEARS.map((yr) => {
          const count = docs.filter((d) => (d.tax_year ?? new Date(d.created_at).getFullYear()) === yr).length
          return (
            <button
              key={yr}
              onClick={() => { setSelectedYear(yr); setOpenCategory(null) }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                selectedYear === yr
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-primary"
              }`}
            >
              {yr}
              {count > 0 && (
                <span className={`ml-1.5 text-xs ${selectedYear === yr ? "opacity-80" : "text-primary"}`}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        className="sr-only"
        accept=".pdf,.csv,.xlsx,.xls,.jpg,.jpeg,.png,.heic"
        onChange={handleUpload}
      />

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 px-4 py-2 rounded-lg">{error}</p>
      )}

      {/* Category grid */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-2">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon
            const count = countFor(cat.id)
            const isOpen = openCategory === cat.id
            const catDocs = docsForCategory(cat.id)
            const isUploading = uploading === cat.id

            return (
              <div key={cat.id} className="rounded-xl border border-border overflow-hidden">
                {/* Category row */}
                <button
                  type="button"
                  onClick={() => setOpenCategory(isOpen ? null : cat.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors ${
                    isOpen ? "bg-primary/5 border-b border-border" : "bg-background hover:bg-muted/30"
                  }`}
                >
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                    count > 0 ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                  }`}>
                    <Icon className="h-4.5 w-4.5 h-[18px] w-[18px]" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{cat.label}</span>
                      {count > 0 && (
                        <Badge variant="secondary" className="text-xs px-1.5 py-0">{count}</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{cat.description}</p>
                  </div>
                  {isOpen
                    ? <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                    : <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  }
                </button>

                {/* Expanded: file list + upload */}
                {isOpen && (
                  <div className="bg-muted/20 divide-y divide-border">
                    {catDocs.length === 0 ? (
                      <div className="px-4 py-6 text-center">
                        <p className="text-sm text-muted-foreground">No files uploaded for {selectedYear} yet.</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Upload your {cat.label.toLowerCase()} below.</p>
                      </div>
                    ) : (
                      catDocs.map((doc) => (
                        <div key={doc.id} className="flex items-center gap-3 px-4 py-3 group">
                          <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{doc.file_name}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatBytes(doc.file_size_bytes)}
                              {" · "}
                              {new Date(doc.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </p>
                          </div>
                          {doc.review_status === "reviewed" ? (
                            <span className="flex items-center gap-1 text-xs text-green-600 shrink-0">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Reviewed
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-xs text-amber-600 shrink-0">
                              <Clock className="h-3.5 w-3.5" />
                              Pending
                            </span>
                          )}
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => handleDownload(doc)}
                              className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                              aria-label="Download"
                            >
                              <Download className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(doc)}
                              className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                              aria-label="Delete"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}

                    {/* Upload row */}
                    <div className="px-4 py-3">
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5 bg-background"
                        onClick={() => triggerUpload(cat.id)}
                        disabled={!!uploading}
                      >
                        {isUploading
                          ? <><Loader2 className="h-3.5 w-3.5 animate-spin" />Uploading...</>
                          : <><Upload className="h-3.5 w-3.5" />Upload {cat.label}</>
                        }
                      </Button>
                      <span className="text-xs text-muted-foreground ml-3">
                        PDF, Excel, CSV, or Image · Max 20 MB
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Info banner */}
      <div className="rounded-xl bg-muted/40 border border-border px-4 py-3 flex gap-3">
        <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium">Our team reviews every upload</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Once you upload, your dedicated bookkeeper will categorize and post transactions to your books, typically within 1–2 business days.
          </p>
        </div>
      </div>
    </div>
  )
}
