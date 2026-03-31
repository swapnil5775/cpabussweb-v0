"use client"

import { useEffect, useState, useTransition } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle2, AlertCircle, Link2, RefreshCw, Building2,
  Users, Zap, Clock, BookOpen
} from "lucide-react"

type QBOConn = {
  realm_id: string
  company_name: string | null
  setup_status: string
  firm_managed: boolean
  connected_at: string
}

type Client = {
  user_id: string
  plan: string
  status: string
  subscribed_at: string
  business_name: string | null
  business_type: string | null
  entity_type: string | null
  full_name: string | null
  qbo: QBOConn | null
  needs_qbo_setup: boolean
}

type AdminData = {
  clients: Client[]
  firm_connected: boolean
  firm_token_expires: string | null
}

export default function AdminPage() {
  const [authorized, setAuthorized] = useState<boolean | null>(null)
  const [data, setData] = useState<AdminData | null>(null)
  const [realmInputs, setRealmInputs] = useState<Record<string, string>>({})
  const [nameInputs, setNameInputs] = useState<Record<string, string>>({})
  const [linking, startLink] = useTransition()
  const [linkMsg, setLinkMsg] = useState<Record<string, string>>({})

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { setAuthorized(false); return }
      fetch("/api/admin/link-qbo")
        .then((r) => {
          if (r.status === 403) { setAuthorized(false); return null }
          setAuthorized(true)
          return r.json()
        })
        .then((d) => { if (d) setData(d) })
    })
  }, [])

  function reload() {
    fetch("/api/admin/link-qbo").then((r) => r.json()).then(setData)
  }

  function linkQBO(userId: string) {
    const realmId = realmInputs[userId]?.trim()
    if (!realmId) return
    startLink(async () => {
      const res = await fetch("/api/admin/link-qbo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          realm_id: realmId,
          company_name: nameInputs[userId]?.trim() || null,
        }),
      })
      const d = await res.json()
      setLinkMsg((prev) => ({ ...prev, [userId]: res.ok ? "✓ Linked! Client notified." : d.error }))
      if (res.ok) { reload(); setRealmInputs((p) => ({ ...p, [userId]: "" })) }
    })
  }

  if (authorized === null) {
    return <div className="flex items-center justify-center min-h-screen"><p className="text-muted-foreground">Loading…</p></div>
  }

  if (authorized === false) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-2">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto" />
          <p className="font-semibold">Access Denied</p>
          <p className="text-sm text-muted-foreground">This page is only accessible to platform administrators.</p>
        </div>
      </div>
    )
  }

  const needsSetup = data?.clients.filter((c) => c.needs_qbo_setup) ?? []
  const connected = data?.clients.filter((c) => !c.needs_qbo_setup) ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Panel</h1>
          <p className="text-sm text-muted-foreground">Manage client QuickBooks connections and book setup</p>
        </div>
        <Button size="sm" variant="outline" onClick={reload} className="gap-1.5 bg-transparent">
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-5 flex items-center gap-3">
            <Users className="h-5 w-5 text-primary shrink-0" />
            <div>
              <p className="text-2xl font-bold">{data?.clients.length ?? 0}</p>
              <p className="text-xs text-muted-foreground">Paid clients</p>
            </div>
          </CardContent>
        </Card>
        <Card className={needsSetup.length > 0 ? "border-amber-300 bg-amber-50 dark:bg-amber-950/20" : ""}>
          <CardContent className="pt-5 flex items-center gap-3">
            <Clock className={`h-5 w-5 shrink-0 ${needsSetup.length > 0 ? "text-amber-600" : "text-muted-foreground"}`} />
            <div>
              <p className={`text-2xl font-bold ${needsSetup.length > 0 ? "text-amber-700 dark:text-amber-400" : ""}`}>{needsSetup.length}</p>
              <p className="text-xs text-muted-foreground">Awaiting QBO setup</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
            <div>
              <p className="text-2xl font-bold">{connected.length}</p>
              <p className="text-xs text-muted-foreground">QBO connected</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Firm QBO connection */}
      <Card className={data?.firm_connected ? "border-[#2CA01C]/30 bg-[#2CA01C]/5" : "border-dashed border-amber-300"}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-[#2CA01C] shrink-0">
              <span className="text-[10px] font-black text-white">QB</span>
            </div>
            Firm QBOA Connection
            {data?.firm_connected
              ? <Badge className="bg-[#2CA01C]/10 text-[#2CA01C] text-xs">Connected</Badge>
              : <Badge variant="outline" className="text-amber-700 border-amber-400 text-xs">Not connected</Badge>
            }
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data?.firm_connected ? (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Your QuickBooks Online Accountant firm account is connected. Use this to link client companies below.
              </p>
              {data.firm_token_expires && (
                <p className="text-xs text-muted-foreground">
                  Token expires: {new Date(data.firm_token_expires).toLocaleString()}
                </p>
              )}
              <a href="/api/qbo/firm-connect">
                <Button size="sm" variant="outline" className="gap-1.5 bg-transparent mt-1">
                  <RefreshCw className="h-3.5 w-3.5" />
                  Reconnect QBOA
                </Button>
              </a>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Connect your QuickBooks Online Accountant firm account first. This allows linking client QBO companies without requiring clients to authenticate themselves.
              </p>
              <a href="/api/qbo/firm-connect">
                <Button size="sm" className="gap-1.5 bg-[#2CA01C] hover:bg-[#238a17] text-white">
                  <Link2 className="h-3.5 w-3.5" />
                  Connect QBOA Firm Account
                </Button>
              </a>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Needs QBO Setup */}
      {needsSetup.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold text-base flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-600" />
            Needs QBO Setup
            <Badge className="bg-amber-100 text-amber-800 text-xs">{needsSetup.length}</Badge>
          </h2>
          <div className="space-y-3">
            {needsSetup.map((client) => (
              <Card key={client.user_id} className="border-amber-200">
                <CardContent className="pt-4 space-y-3">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-sm">{client.business_name ?? "No business name"}</p>
                        <Badge variant="outline" className="text-xs capitalize">{client.plan}</Badge>
                        <span className="text-xs text-muted-foreground capitalize">{client.business_type?.replace(/_/g, " ")}</span>
                      </div>
                      {client.full_name && <p className="text-xs text-muted-foreground">{client.full_name}</p>}
                      <p className="text-xs text-muted-foreground">
                        Subscribed {new Date(client.subscribed_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                  </div>

                  <div className="bg-muted/40 rounded-xl p-3 space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">
                      1. Create client company in QBOA → 2. Copy the Company ID from the URL → 3. Paste below
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <Input
                        placeholder="QBO Company ID (Realm ID)"
                        value={realmInputs[client.user_id] ?? ""}
                        onChange={(e) => setRealmInputs((p) => ({ ...p, [client.user_id]: e.target.value }))}
                        className="flex-1 min-w-40 text-sm h-8"
                      />
                      <Input
                        placeholder="Company name (optional)"
                        value={nameInputs[client.user_id] ?? ""}
                        onChange={(e) => setNameInputs((p) => ({ ...p, [client.user_id]: e.target.value }))}
                        className="flex-1 min-w-40 text-sm h-8"
                      />
                      <Button
                        size="sm"
                        className="h-8 gap-1.5"
                        onClick={() => linkQBO(client.user_id)}
                        disabled={!realmInputs[client.user_id]?.trim() || linking}
                      >
                        <Link2 className="h-3.5 w-3.5" />
                        Link & Notify Client
                      </Button>
                    </div>
                    {linkMsg[client.user_id] && (
                      <p className={`text-xs font-medium ${linkMsg[client.user_id].startsWith("✓") ? "text-green-600" : "text-destructive"}`}>
                        {linkMsg[client.user_id]}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Connected clients */}
      {connected.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold text-base flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-green-600" />
            QBO Connected
          </h2>
          <div className="space-y-2">
            {connected.map((client) => (
              <div key={client.user_id} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-background">
                <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{client.business_name ?? "—"}</p>
                  <p className="text-xs text-muted-foreground">{client.qbo?.company_name ?? client.qbo?.realm_id}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="outline" className="text-xs capitalize">{client.plan}</Badge>
                  {client.qbo?.firm_managed && (
                    <Badge className="text-xs bg-primary/10 text-primary">
                      <Zap className="h-2.5 w-2.5 mr-1" />
                      Firm managed
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {data?.clients.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Users className="h-8 w-8 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No paid clients yet.</p>
        </div>
      )}
    </div>
  )
}
