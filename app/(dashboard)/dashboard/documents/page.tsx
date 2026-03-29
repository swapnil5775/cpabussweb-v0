"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileUp, Loader2, Trash2, FileText } from "lucide-react"

type Document = {
  id: string
  file_name: string
  document_type: string
  file_size_bytes: number | null
  created_at: string
  storage_path: string
}

const DOC_TYPES = [
  { value: "bank_statement", label: "Bank Statement" },
  { value: "tax_doc", label: "Tax Document" },
  { value: "receipt", label: "Receipt" },
  { value: "payroll", label: "Payroll" },
  { value: "other", label: "Other" },
]

export default function DocumentsPage() {
  const [docs, setDocs] = useState<Document[]>([])
  const [uploading, setUploading] = useState(false)
  const [docType, setDocType] = useState("other")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
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

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError("")

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError("Not authenticated"); setUploading(false); return }

    const path = `${user.id}/${Date.now()}_${file.name}`
    const { error: uploadError } = await supabase.storage.from("documents").upload(path, file)

    if (uploadError) {
      setError("Upload failed: " + uploadError.message)
      setUploading(false)
      return
    }

    const { error: dbError } = await supabase.from("documents").insert({
      user_id: user.id,
      file_name: file.name,
      storage_path: path,
      file_size_bytes: file.size,
      document_type: docType,
    })

    if (dbError) {
      setError("Failed to save document record")
    } else {
      await fetchDocs()
    }

    setUploading(false)
    e.target.value = ""
  }

  async function handleDelete(doc: Document) {
    await supabase.storage.from("documents").remove([doc.storage_path])
    await supabase.from("documents").delete().eq("id", doc.id)
    setDocs((prev) => prev.filter((d) => d.id !== doc.id))
  }

  function formatBytes(bytes: number | null) {
    if (!bytes) return ""
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Documents</h1>
        <p className="text-muted-foreground text-sm mt-1">Upload bank statements, receipts, and tax documents for your bookkeeper.</p>
      </div>

      {/* Upload area */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Select value={docType} onValueChange={setDocType}>
                <SelectTrigger>
                  <SelectValue placeholder="Document type" />
                </SelectTrigger>
                <SelectContent>
                  {DOC_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <label className="cursor-pointer">
              <Button asChild disabled={uploading}>
                <span>
                  {uploading
                    ? <><Loader2 className="h-4 w-4 animate-spin mr-2" aria-hidden="true" />Uploading...</>
                    : <><FileUp className="h-4 w-4 mr-2" aria-hidden="true" />Choose File</>
                  }
                </span>
              </Button>
              <input
                type="file"
                className="sr-only"
                accept=".pdf,.csv,.xlsx,.xls,.jpg,.jpeg,.png"
                onChange={handleUpload}
                disabled={uploading}
              />
            </label>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
          <p className="text-xs text-muted-foreground">Accepted: PDF, CSV, Excel, Images. Max 20 MB per file.</p>
        </CardContent>
      </Card>

      {/* Documents list */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-hidden="true" />
        </div>
      ) : docs.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-border px-6 py-12 text-center">
          <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-3" aria-hidden="true" />
          <p className="text-sm font-medium">No documents uploaded yet</p>
          <p className="text-xs text-muted-foreground mt-1">Start by uploading your most recent bank statement</p>
        </div>
      ) : (
        <div className="space-y-2">
          {docs.map((doc) => (
            <div key={doc.id} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-background group">
              <FileText className="h-5 w-5 text-muted-foreground shrink-0" aria-hidden="true" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{doc.file_name}</p>
                <p className="text-xs text-muted-foreground">
                  {DOC_TYPES.find((t) => t.value === doc.document_type)?.label ?? "Other"}
                  {doc.file_size_bytes ? ` · ${formatBytes(doc.file_size_bytes)}` : ""}
                  {" · "}{new Date(doc.created_at).toLocaleDateString()}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(doc)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                aria-label={`Delete ${doc.file_name}`}
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
