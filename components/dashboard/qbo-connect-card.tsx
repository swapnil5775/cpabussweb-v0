"use client"

import { useEffect, useState, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Link2, Link2Off, RefreshCw, TrendingUp, Building2 } from "lucide-react"

type PLRow = { label: string; value: string }
type QBOData = {
  connected: boolean
  company_name?: string
  connected_at?: string
  profitLoss?: PLRow[] | null
  balanceSheet?: PLRow[] | null
}

export function QBOConnectCard() {
  const [data, setData] = useState<QBOData | null>(null)
  const [loading, setLoading] = useState(true)
  const [disconnecting, startDisconnect] = useTransition()

  function load() {
    fetch("/api/qbo/data")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  function disconnect() {
    startDisconnect(async () => {
      await fetch("/api/qbo/disconnect", { method: "POST" })
      setData({ connected: false })
    })
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-5">
          <div className="h-16 bg-muted/40 rounded-lg animate-pulse" />
        </CardContent>
      </Card>
    )
  }

  if (!data?.connected) {
    return (
      <Card className="border-dashed">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-[#2CA01C]/10 shrink-0">
              <span className="text-[10px] font-black text-[#2CA01C]">QB</span>
            </div>
            QuickBooks Online
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Connect your QuickBooks account to sync your P&amp;L, Balance Sheet, and let your bookkeeper work directly in your books.
          </p>
          <a href="/api/qbo/connect">
            <Button size="sm" className="gap-1.5 bg-[#2CA01C] hover:bg-[#238a17] text-white">
              <Link2 className="h-3.5 w-3.5" />
              Connect QuickBooks
            </Button>
          </a>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-[#2CA01C]/30 bg-[#2CA01C]/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-[#2CA01C] shrink-0">
              <span className="text-[10px] font-black text-white">QB</span>
            </div>
            QuickBooks Online
            <Badge className="bg-[#2CA01C]/10 text-[#2CA01C] border-[#2CA01C]/20 text-xs gap-1 font-medium">
              <CheckCircle2 className="h-3 w-3" />
              Connected
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-1.5">
            <a href="/api/qbo/connect">
              <Button size="sm" variant="ghost" className="h-7 text-xs gap-1 text-muted-foreground">
                <RefreshCw className="h-3 w-3" />
                Reconnect
              </Button>
            </a>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 text-xs gap-1 text-destructive hover:text-destructive"
              onClick={disconnect}
              disabled={disconnecting}
            >
              <Link2Off className="h-3 w-3" />
              {disconnecting ? "Disconnecting…" : "Disconnect"}
            </Button>
          </div>
        </div>
        {data.company_name && (
          <div className="flex items-center gap-1.5 mt-1">
            <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">{data.company_name}</p>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* P&L Summary */}
        {data.profitLoss && data.profitLoss.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1 mb-2">
              <TrendingUp className="h-3.5 w-3.5" />
              Profit &amp; Loss — Last 12 Months
            </p>
            <div className="space-y-1.5">
              {data.profitLoss.slice(0, 4).map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-3">
                  <span className="text-sm text-muted-foreground truncate">{row.label}</span>
                  <span className="text-sm font-semibold shrink-0 tabular-nums">
                    {formatCurrency(row.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Balance Sheet Summary */}
        {data.balanceSheet && data.balanceSheet.length > 0 && (
          <div className="pt-3 border-t border-border">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Balance Sheet
            </p>
            <div className="space-y-1.5">
              {data.balanceSheet.slice(0, 3).map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-3">
                  <span className="text-sm text-muted-foreground truncate">{row.label}</span>
                  <span className="text-sm font-semibold shrink-0 tabular-nums">
                    {formatCurrency(row.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {!data.profitLoss && !data.balanceSheet && (
          <p className="text-sm text-muted-foreground">
            QuickBooks connected. Financial data will appear here once your bookkeeper starts working in your account.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

function formatCurrency(val: string): string {
  const num = parseFloat(val.replace(/,/g, ""))
  if (isNaN(num)) return val
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(num)
}
