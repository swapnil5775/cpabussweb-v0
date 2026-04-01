import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Upload, FileText, Building2, Receipt, ArrowRight } from "lucide-react"

export function DocumentVaultCallout() {
  return (
    <div className="rounded-2xl border-2 border-primary/20 bg-primary/5 p-5 space-y-4">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Upload className="h-4 w-4" />
        </div>
        <div>
          <p className="font-semibold text-sm">Action needed — upload your documents to start your books</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Your bookkeeper needs these to categorize transactions and keep your books accurate every month.
          </p>
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        <div className="flex items-center gap-2 rounded-lg bg-background border border-border px-3 py-2">
          <Building2 className="h-3.5 w-3.5 text-primary shrink-0" />
          <div>
            <p className="text-xs font-medium">Bank Statements</p>
            <p className="text-[11px] text-muted-foreground">Last 3 months</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-background border border-border px-3 py-2">
          <Receipt className="h-3.5 w-3.5 text-primary shrink-0" />
          <div>
            <p className="text-xs font-medium">Expense Receipts</p>
            <p className="text-[11px] text-muted-foreground">Business expenses</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-background border border-border px-3 py-2">
          <FileText className="h-3.5 w-3.5 text-primary shrink-0" />
          <div>
            <p className="text-xs font-medium">Invoices / Income</p>
            <p className="text-[11px] text-muted-foreground">Customer invoices</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link href="/dashboard/documents">
          <Button size="sm" className="gap-1.5">
            <Upload className="h-3.5 w-3.5" />
            Upload Documents Now
          </Button>
        </Link>
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          Takes 2 min
          <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </div>
  )
}
