"use client"

import { useEffect, useState, useTransition } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle2, AlertCircle, Link2, RefreshCw, Building2,
  Users, Zap, Clock, BookOpen, UserPlus, Briefcase, Webhook
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
  gusto_connected: boolean
}

type GustoState = {
  connected: boolean
  company_uuid?: string
  company_name?: string
  setup_status?: string
  employees?: { uuid: string; first_name: string; last_name: string; email: string }[]
}

export default function AdminPage() {
  const [authorized, setAuthorized] = useState<boolean | null>(null)
  const [data, setData] = useState<AdminData | null>(null)
  const [realmInputs, setRealmInputs] = useState<Record<string, string>>({})
  const [nameInputs, setNameInputs] = useState<Record<string, string>>({})
  const [linking, startLink] = useTransition()
  const [linkMsg, setLinkMsg] = useState<Record<string, string>>({})

  // Gusto state per client
  const [gustoData, setGustoData] = useState<Record<string, GustoState>>({})
  const [gustoExpanded, setGustoExpanded] = useState<Record<string, boolean>>({})
  const [gustoCreating, setGustoCreating] = useState<Record<string, boolean>>({})
  const [gustoMsg, setGustoMsg] = useState<Record<string, string>>({})
  const [empInputs, setEmpInputs] = useState<Record<string, { first_name: string; last_name: string; email: string; start_date: string }>>({})
  const [addingEmp, setAddingEmp] = useState<Record<string, boolean>>({})
  const [linkExistingOpen, setLinkExistingOpen] = useState<Record<string, boolean>>({})
  const [linkExistingInputs, setLinkExistingInputs] = useState<Record<string, { company_uuid: string; company_name: string; access_token: string; refresh_token: string }>>({})
  const [linkingExisting, setLinkingExisting] = useState<Record<string, boolean>>({})

  // Webhook verification state
  const [webhookStatus, setWebhookStatus] = useState<{ token_received: boolean; verified: boolean; verified_at: string | null; subscription_uuid: string | null } | null>(null)
  const [webhookSubUuid, setWebhookSubUuid] = useState("a38c1e51-b743-41b6-942a-d513c4fda8e3")
  const [verifyingWebhook, setVerifyingWebhook] = useState(false)
  const [webhookMsg, setWebhookMsg] = useState("")

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
      fetch("/api/admin/gusto/verify-webhook")
        .then((r) => r.ok ? r.json() : null)
        .then((d) => { if (d) setWebhookStatus(d) })
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

  async function loadGusto(userId: string) {
    const r = await fetch(`/api/admin/gusto?user_id=${userId}`)
    const d = await r.json()
    setGustoData((prev) => ({ ...prev, [userId]: d }))
  }

  async function createGustoCompany(userId: string, companyName: string) {
    setGustoCreating((p) => ({ ...p, [userId]: true }))
    const res = await fetch("/api/admin/gusto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create_company", user_id: userId, company_name: companyName }),
    })
    const d = await res.json()
    setGustoMsg((p) => ({ ...p, [userId]: res.ok ? "✓ Gusto company created!" : d.error }))
    if (res.ok) await loadGusto(userId)
    setGustoCreating((p) => ({ ...p, [userId]: false }))
  }

  async function addEmployee(userId: string) {
    const emp = empInputs[userId]
    if (!emp?.first_name || !emp?.last_name || !emp?.email || !emp?.start_date) return
    setAddingEmp((p) => ({ ...p, [userId]: true }))
    const res = await fetch("/api/admin/gusto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "add_employee", user_id: userId, ...emp }),
    })
    const d = await res.json()
    setGustoMsg((p) => ({ ...p, [userId]: res.ok ? `✓ Employee ${emp.first_name} added!` : d.error }))
    if (res.ok) {
      await loadGusto(userId)
      setEmpInputs((p) => ({ ...p, [userId]: { first_name: "", last_name: "", email: "", start_date: "" } }))
    }
    setAddingEmp((p) => ({ ...p, [userId]: false }))
  }

  async function verifyWebhook() {
    setVerifyingWebhook(true)
    setWebhookMsg("")
    const res = await fetch("/api/admin/gusto/verify-webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subscription_uuid: webhookSubUuid.trim() }),
    })
    const d = await res.json()
    if (res.ok) {
      setWebhookMsg("✓ Webhook verified! Gusto events will now be delivered.")
      setWebhookStatus((prev) => prev ? { ...prev, verified: true, verified_at: d.verified_at } : prev)
    } else {
      setWebhookMsg(d.error ?? "Verification failed")
    }
    setVerifyingWebhook(false)
  }

  async function linkExistingGusto(userId: string) {
    const inp = linkExistingInputs[userId]
    if (!inp?.company_uuid?.trim() || !inp?.access_token?.trim()) return
    setLinkingExisting((p) => ({ ...p, [userId]: true }))
    const res = await fetch("/api/admin/gusto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "link_existing",
        user_id: userId,
        company_uuid: inp.company_uuid.trim(),
        company_name: inp.company_name.trim() || undefined,
        access_token: inp.access_token.trim(),
        refresh_token: inp.refresh_token.trim() || undefined,
      }),
    })
    const d = await res.json()
    setGustoMsg((p) => ({ ...p, [userId]: res.ok ? "✓ Gusto company linked!" : d.error }))
    if (res.ok) {
      await loadGusto(userId)
      setLinkExistingOpen((p) => ({ ...p, [userId]: false }))
    }
    setLinkingExisting((p) => ({ ...p, [userId]: false }))
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

      {/* Gusto Firm Connection */}
      <Card className={data?.gusto_connected ? "border-[#F45D48]/30 bg-[#F45D48]/5" : "border-dashed border-amber-300"}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-[#F45D48] shrink-0">
              <span className="text-[10px] font-black text-white">G</span>
            </div>
            Gusto Firm Connection
            {data?.gusto_connected
              ? <Badge className="bg-[#F45D48]/10 text-[#F45D48] text-xs">Connected</Badge>
              : <Badge variant="outline" className="text-amber-700 border-amber-400 text-xs">Not connected</Badge>
            }
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data?.gusto_connected ? (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Your Gusto accountant account is connected. Use the Gusto Payroll Setup section below to create payroll companies for clients.
              </p>
              <a href="/api/gusto/connect">
                <Button size="sm" variant="outline" className="gap-1.5 bg-transparent mt-1">
                  <RefreshCw className="h-3.5 w-3.5" />
                  Reconnect Gusto
                </Button>
              </a>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Connect your Gusto accountant account to create and manage payroll companies for clients without them ever logging into Gusto.
              </p>
              <a href="/api/gusto/connect">
                <Button size="sm" className="gap-1.5 bg-[#F45D48] hover:bg-[#d94a36] text-white">
                  <Link2 className="h-3.5 w-3.5" />
                  Connect Gusto Firm Account
                </Button>
              </a>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gusto Webhook Verification */}
      <Card className={webhookStatus?.verified ? "border-green-300 bg-green-50 dark:bg-green-950/20" : "border-dashed border-amber-300"}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-[#F45D48] shrink-0">
              <Webhook className="h-3.5 w-3.5 text-white" />
            </div>
            Gusto Webhook
            {webhookStatus?.verified
              ? <Badge className="bg-green-100 text-green-700 text-xs">Verified</Badge>
              : webhookStatus?.token_received
                ? <Badge className="bg-amber-100 text-amber-700 text-xs">Token received — click Verify</Badge>
                : <Badge variant="outline" className="text-amber-700 border-amber-400 text-xs">Awaiting token</Badge>
            }
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {webhookStatus?.verified ? (
            <p className="text-sm text-muted-foreground">
              Webhook is active. Gusto will send payroll, employee, and document events to your server.
              {webhookStatus.verified_at && (
                <span className="block text-xs mt-0.5 text-muted-foreground/70">
                  Verified {new Date(webhookStatus.verified_at).toLocaleString()}
                </span>
              )}
            </p>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                {webhookStatus?.token_received
                  ? "Gusto sent a verification token to your server. Click Verify to complete setup."
                  : "In the Gusto portal, click Resend on the webhook verification page. Then click Verify below."}
              </p>
              <div className="flex gap-2 flex-wrap items-center">
                <Input
                  placeholder="Webhook subscription UUID"
                  value={webhookSubUuid}
                  onChange={(e) => setWebhookSubUuid(e.target.value)}
                  className="h-8 text-xs font-mono flex-1 min-w-60"
                />
                <Button
                  size="sm"
                  className="h-8 gap-1.5 bg-[#F45D48] hover:bg-[#d94a36] text-white shrink-0"
                  disabled={verifyingWebhook || !webhookSubUuid.trim()}
                  onClick={verifyWebhook}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {verifyingWebhook ? "Verifying…" : "Verify Webhook"}
                </Button>
              </div>
              {webhookMsg && (
                <p className={`text-xs font-medium ${webhookMsg.startsWith("✓") ? "text-green-600" : "text-destructive"}`}>
                  {webhookMsg}
                </p>
              )}
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

      {/* Gusto Payroll Section */}
      {(data?.clients.length ?? 0) > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold text-base flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-[#F45D48]" />
            Gusto Payroll Setup
          </h2>
          <div className="space-y-2">
            {data!.clients.map((client) => {
              const g = gustoData[client.user_id]
              const expanded = gustoExpanded[client.user_id]
              const emp = empInputs[client.user_id] ?? { first_name: "", last_name: "", email: "", start_date: "" }

              return (
                <div key={client.user_id} className="rounded-xl border border-border bg-background overflow-hidden">
                  <div className="flex items-center gap-3 px-4 py-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded bg-[#F45D48]/10 shrink-0">
                      <span className="text-[10px] font-black text-[#F45D48]">G</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{client.business_name ?? "Unnamed Business"}</p>
                      <p className="text-xs text-muted-foreground">{client.full_name}</p>
                    </div>
                    {g?.connected ? (
                      <Badge className="text-xs bg-green-100 text-green-700 shrink-0">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Connected · {g.employees?.length ?? 0} employees
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs text-muted-foreground shrink-0">Not set up</Badge>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs bg-transparent shrink-0"
                      onClick={() => {
                        if (!g) loadGusto(client.user_id)
                        setGustoExpanded((p) => ({ ...p, [client.user_id]: !expanded }))
                      }}
                    >
                      {expanded ? "Collapse" : "Manage"}
                    </Button>
                  </div>

                  {expanded && (
                    <div className="border-t border-border bg-muted/20 px-4 py-4 space-y-4">
                      {!g ? (
                        <p className="text-sm text-muted-foreground">Loading…</p>
                      ) : !g.connected ? (
                        <div className="space-y-3">
                          <div className="flex gap-2 flex-wrap">
                            <Button
                              size="sm"
                              className="gap-1.5 bg-[#F45D48] hover:bg-[#d94a36] text-white"
                              disabled={gustoCreating[client.user_id]}
                              onClick={() => createGustoCompany(client.user_id, client.business_name ?? "New Company")}
                            >
                              <UserPlus className="h-3.5 w-3.5" />
                              {gustoCreating[client.user_id] ? "Creating…" : "Create New Gusto Company"}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1.5 bg-transparent"
                              onClick={() => setLinkExistingOpen((p) => ({ ...p, [client.user_id]: !linkExistingOpen[client.user_id] }))}
                            >
                              <Link2 className="h-3.5 w-3.5" />
                              Link Existing (from Portal)
                            </Button>
                          </div>

                          {linkExistingOpen[client.user_id] && (() => {
                            const li = linkExistingInputs[client.user_id] ?? { company_uuid: "", company_name: "", access_token: "", refresh_token: "" }
                            const setLi = (patch: Partial<typeof li>) =>
                              setLinkExistingInputs((p) => ({ ...p, [client.user_id]: { ...li, ...patch } }))
                            return (
                              <div className="rounded-lg border border-border bg-background p-3 space-y-2">
                                <p className="text-xs font-medium text-muted-foreground">
                                  Paste values from Gusto Developer Portal → Demo Partner Managed Companies
                                </p>
                                <div className="grid gap-2">
                                  <Input
                                    placeholder="Company UUID (e.g. 83e88654-eb97-…)"
                                    className="h-8 text-xs font-mono"
                                    value={li.company_uuid}
                                    onChange={(e) => setLi({ company_uuid: e.target.value })}
                                  />
                                  <Input
                                    placeholder="Company Name (optional, e.g. Harbor Reef Corp)"
                                    className="h-8 text-xs"
                                    value={li.company_name}
                                    onChange={(e) => setLi({ company_name: e.target.value })}
                                  />
                                  <Input
                                    placeholder="Access Token"
                                    className="h-8 text-xs font-mono"
                                    value={li.access_token}
                                    onChange={(e) => setLi({ access_token: e.target.value })}
                                  />
                                  <Input
                                    placeholder="Refresh Token (optional)"
                                    className="h-8 text-xs font-mono"
                                    value={li.refresh_token}
                                    onChange={(e) => setLi({ refresh_token: e.target.value })}
                                  />
                                </div>
                                <Button
                                  size="sm"
                                  className="h-8 gap-1.5 bg-[#F45D48] hover:bg-[#d94a36] text-white"
                                  disabled={!li.company_uuid.trim() || !li.access_token.trim() || linkingExisting[client.user_id]}
                                  onClick={() => linkExistingGusto(client.user_id)}
                                >
                                  <Link2 className="h-3.5 w-3.5" />
                                  {linkingExisting[client.user_id] ? "Linking…" : "Link Company"}
                                </Button>
                              </div>
                            )
                          })()}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="text-xs text-muted-foreground space-y-0.5">
                            <p><span className="font-medium">Company UUID:</span> {g.company_uuid}</p>
                            <p><span className="font-medium">Status:</span> {g.setup_status}</p>
                          </div>

                          {/* Employee list */}
                          {(g.employees?.length ?? 0) > 0 && (
                            <div className="space-y-1">
                              <p className="text-xs font-medium">Employees</p>
                              {g.employees!.map((e) => (
                                <div key={e.uuid} className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Users className="h-3 w-3 shrink-0" />
                                  {e.first_name} {e.last_name} — {e.email}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Add employee */}
                          <div className="space-y-2">
                            <p className="text-xs font-medium">Add Employee</p>
                            <div className="grid grid-cols-2 gap-2">
                              <Input placeholder="First name" className="h-8 text-xs" value={emp.first_name}
                                onChange={(e) => setEmpInputs((p) => ({ ...p, [client.user_id]: { ...emp, first_name: e.target.value } }))} />
                              <Input placeholder="Last name" className="h-8 text-xs" value={emp.last_name}
                                onChange={(e) => setEmpInputs((p) => ({ ...p, [client.user_id]: { ...emp, last_name: e.target.value } }))} />
                              <Input placeholder="Email" type="email" className="h-8 text-xs" value={emp.email}
                                onChange={(e) => setEmpInputs((p) => ({ ...p, [client.user_id]: { ...emp, email: e.target.value } }))} />
                              <Input placeholder="Start date (YYYY-MM-DD)" className="h-8 text-xs" value={emp.start_date}
                                onChange={(e) => setEmpInputs((p) => ({ ...p, [client.user_id]: { ...emp, start_date: e.target.value } }))} />
                            </div>
                            <Button size="sm" className="h-8 gap-1.5" onClick={() => addEmployee(client.user_id)}
                              disabled={addingEmp[client.user_id]}>
                              <UserPlus className="h-3.5 w-3.5" />
                              {addingEmp[client.user_id] ? "Adding…" : "Add Employee"}
                            </Button>
                          </div>
                        </div>
                      )}

                      {gustoMsg[client.user_id] && (
                        <p className={`text-xs font-medium ${gustoMsg[client.user_id].startsWith("✓") ? "text-green-600" : "text-destructive"}`}>
                          {gustoMsg[client.user_id]}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
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
