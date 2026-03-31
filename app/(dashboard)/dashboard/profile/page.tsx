"use client"

import { useState, useEffect, useTransition } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle2, Mail, User, Building2, MapPin, Loader2, AlertCircle, Briefcase, Share2, Copy, Check, RefreshCw, Trash2 } from "lucide-react"

type Profile = {
  full_name: string
  phone: string
  business_address_line1: string
  business_address_line2: string
  business_city: string
  business_state: string
  business_zip: string
  personal_address_line1: string
  personal_address_line2: string
  personal_city: string
  personal_state: string
  personal_zip: string
  secondary_email: string
  secondary_email_verified: boolean
  // CPA / Accountant
  cpa_firm_name: string
  cpa_full_name: string
  cpa_email: string
  cpa_phone: string
  cpa_address_line1: string
  cpa_address_line2: string
  cpa_city: string
  cpa_state: string
  cpa_zip: string
}

const emptyProfile: Profile = {
  full_name: "",
  phone: "",
  business_address_line1: "",
  business_address_line2: "",
  business_city: "",
  business_state: "",
  business_zip: "",
  personal_address_line1: "",
  personal_address_line2: "",
  personal_city: "",
  personal_state: "",
  personal_zip: "",
  secondary_email: "",
  secondary_email_verified: false,
  cpa_firm_name: "",
  cpa_full_name: "",
  cpa_email: "",
  cpa_phone: "",
  cpa_address_line1: "",
  cpa_address_line2: "",
  cpa_city: "",
  cpa_state: "",
  cpa_zip: "",
}

type CpaTokenRow = { id: string; client_user_id: string; token: string; label: string | null; invited_email: string | null; created_at: string }

const CPA_SITE_URL = "https://www.bookkeeping.business"

export default function ProfilePage() {
  const supabase = createClient()
  const [form, setForm] = useState<Profile>(emptyProfile)
  const [primaryEmail, setPrimaryEmail] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, startSave] = useTransition()
  const [saveMsg, setSaveMsg] = useState<{ ok: boolean; text: string } | null>(null)

  // OTP state
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState("")
  const [otpLoading, setOtpLoading] = useState(false)
  const [otpMsg, setOtpMsg] = useState<{ ok: boolean; text: string } | null>(null)

  // CPA access token state
  const [cpaToken, setCpaToken] = useState<CpaTokenRow | null>(null)
  const [cpaEmailInput, setCpaEmailInput] = useState("")
  const [cpaLabelInput, setCpaLabelInput] = useState("")
  const [cpaLoading, setCpaLoading] = useState(false)
  const [cpaCopied, setCpaCopied] = useState(false)
  const [cpaError, setCpaError] = useState("")

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setPrimaryEmail(user.email ?? "")

      const res = await fetch("/api/profile")
      if (res.ok) {
        const data = await res.json()
        if (data.profile) {
          setForm({
            full_name: data.profile.full_name ?? "",
            phone: data.profile.phone ?? "",
            business_address_line1: data.profile.business_address_line1 ?? "",
            business_address_line2: data.profile.business_address_line2 ?? "",
            business_city: data.profile.business_city ?? "",
            business_state: data.profile.business_state ?? "",
            business_zip: data.profile.business_zip ?? "",
            personal_address_line1: data.profile.personal_address_line1 ?? "",
            personal_address_line2: data.profile.personal_address_line2 ?? "",
            personal_city: data.profile.personal_city ?? "",
            personal_state: data.profile.personal_state ?? "",
            personal_zip: data.profile.personal_zip ?? "",
            secondary_email: data.profile.secondary_email ?? "",
            secondary_email_verified: data.profile.secondary_email_verified ?? false,
            cpa_firm_name: data.profile.cpa_firm_name ?? "",
            cpa_full_name: data.profile.cpa_full_name ?? "",
            cpa_email: data.profile.cpa_email ?? "",
            cpa_phone: data.profile.cpa_phone ?? "",
            cpa_address_line1: data.profile.cpa_address_line1 ?? "",
            cpa_address_line2: data.profile.cpa_address_line2 ?? "",
            cpa_city: data.profile.cpa_city ?? "",
            cpa_state: data.profile.cpa_state ?? "",
            cpa_zip: data.profile.cpa_zip ?? "",
          })
        }
      }

      // Load CPA access token
      const cpaRes = await fetch("/api/cpa-access")
      if (cpaRes.ok) {
        const cpaData = await cpaRes.json()
        setCpaToken(cpaData.token ?? null)
      }

      setLoading(false)
    }
    load()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function generateCpaToken() {
    setCpaError("")
    if (!cpaEmailInput.trim()) {
      setCpaError("CPA email is required to send the invite.")
      return
    }
    setCpaLoading(true)
    const res = await fetch("/api/cpa-access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        invited_email: cpaEmailInput.trim(),
        label: cpaLabelInput.trim() || null,
      }),
    })
    if (res.ok) {
      const data = await res.json()
      setCpaToken(data.token)
      setCpaLabelInput("")
      setCpaEmailInput("")
    } else {
      const d = await res.json()
      setCpaError(d.error ?? "Failed to generate link.")
    }
    setCpaLoading(false)
  }

  async function revokeCpaToken() {
    setCpaLoading(true)
    await fetch("/api/cpa-access", { method: "DELETE" })
    setCpaToken(null)
    setCpaLoading(false)
  }

  async function regenerateCpaToken() {
    setCpaLoading(true)
    await fetch("/api/cpa-access", { method: "DELETE" })
    const res = await fetch("/api/cpa-access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        invited_email: cpaToken?.invited_email ?? null,
        label: cpaToken?.label ?? null,
      }),
    })
    if (res.ok) {
      const data = await res.json()
      setCpaToken(data.token)
    }
    setCpaLoading(false)
  }

  function copyCpaLink() {
    if (!cpaToken) return
    navigator.clipboard.writeText(`${CPA_SITE_URL}/cpa/${cpaToken.token}`)
    setCpaCopied(true)
    setTimeout(() => setCpaCopied(false), 2000)
  }

  function set(field: keyof Profile, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    // If user edits secondary_email, reset verified state
    if (field === "secondary_email") {
      setForm((prev) => ({ ...prev, secondary_email: value, secondary_email_verified: false }))
      setOtpSent(false)
      setOtp("")
      setOtpMsg(null)
    }
  }

  function handleSave() {
    setSaveMsg(null)
    startSave(async () => {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setSaveMsg({ ok: true, text: "Profile saved successfully." })
      } else {
        setSaveMsg({ ok: false, text: "Failed to save. Please try again." })
      }
    })
  }

  async function sendOtp() {
    if (!form.secondary_email) return
    setOtpLoading(true)
    setOtpMsg(null)
    const res = await fetch("/api/verify-email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.secondary_email }),
    })
    setOtpLoading(false)
    if (res.ok) {
      setOtpSent(true)
      setOtpMsg({ ok: true, text: `Verification code sent to ${form.secondary_email}` })
    } else {
      const d = await res.json()
      setOtpMsg({ ok: false, text: d.error ?? "Failed to send code." })
    }
  }

  async function confirmOtp() {
    if (!otp) return
    setOtpLoading(true)
    setOtpMsg(null)
    const res = await fetch("/api/verify-email/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.secondary_email, code: otp }),
    })
    setOtpLoading(false)
    if (res.ok) {
      setForm((prev) => ({ ...prev, secondary_email_verified: true }))
      setOtpMsg({ ok: true, text: "Email verified!" })
      setOtpSent(false)
      setOtp("")
    } else {
      const d = await res.json()
      setOtpMsg({ ok: false, text: d.error ?? "Invalid code." })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Your Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">Keep your contact and address details up to date.</p>
      </div>

      {/* Personal info */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={form.full_name}
                onChange={(e) => set("full_name", e.target.value)}
                placeholder="Jane Smith"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Primary Email</Label>
            <Input value={primaryEmail} disabled className="text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Managed via your login — change in account settings.</p>
          </div>
        </CardContent>
      </Card>

      {/* Business address */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <Building2 className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            Business Address
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="b_line1">Address Line 1</Label>
            <Input
              id="b_line1"
              value={form.business_address_line1}
              onChange={(e) => set("business_address_line1", e.target.value)}
              placeholder="123 Main St"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="b_line2">Address Line 2 <span className="text-muted-foreground font-normal">(optional)</span></Label>
            <Input
              id="b_line2"
              value={form.business_address_line2}
              onChange={(e) => set("business_address_line2", e.target.value)}
              placeholder="Suite 400"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5 sm:col-span-1">
              <Label htmlFor="b_city">City</Label>
              <Input
                id="b_city"
                value={form.business_city}
                onChange={(e) => set("business_city", e.target.value)}
                placeholder="Austin"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="b_state">State</Label>
              <Input
                id="b_state"
                value={form.business_state}
                onChange={(e) => set("business_state", e.target.value)}
                placeholder="TX"
                maxLength={2}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="b_zip">ZIP</Label>
              <Input
                id="b_zip"
                value={form.business_zip}
                onChange={(e) => set("business_zip", e.target.value)}
                placeholder="78701"
                maxLength={10}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal mailing address */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <MapPin className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            Personal Mailing Address
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="p_line1">Address Line 1</Label>
            <Input
              id="p_line1"
              value={form.personal_address_line1}
              onChange={(e) => set("personal_address_line1", e.target.value)}
              placeholder="456 Oak Ave"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="p_line2">Address Line 2 <span className="text-muted-foreground font-normal">(optional)</span></Label>
            <Input
              id="p_line2"
              value={form.personal_address_line2}
              onChange={(e) => set("personal_address_line2", e.target.value)}
              placeholder="Apt 2B"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5 sm:col-span-1">
              <Label htmlFor="p_city">City</Label>
              <Input
                id="p_city"
                value={form.personal_city}
                onChange={(e) => set("personal_city", e.target.value)}
                placeholder="Austin"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p_state">State</Label>
              <Input
                id="p_state"
                value={form.personal_state}
                onChange={(e) => set("personal_state", e.target.value)}
                placeholder="TX"
                maxLength={2}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p_zip">ZIP</Label>
              <Input
                id="p_zip"
                value={form.personal_zip}
                onChange={(e) => set("personal_zip", e.target.value)}
                placeholder="78701"
                maxLength={10}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Secondary email */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <Mail className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            Secondary Email
            {form.secondary_email_verified && (
              <Badge variant="default" className="text-xs ml-auto">
                <CheckCircle2 className="h-3 w-3 mr-1" aria-hidden="true" />
                Verified
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="sec_email">Email address</Label>
            <div className="flex gap-2">
              <Input
                id="sec_email"
                type="email"
                value={form.secondary_email}
                onChange={(e) => set("secondary_email", e.target.value)}
                placeholder="backup@example.com"
                className="flex-1"
              />
              {!form.secondary_email_verified && form.secondary_email && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={sendOtp}
                  disabled={otpLoading}
                  className="shrink-0"
                >
                  {otpLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : otpSent ? "Resend" : "Verify"}
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Used for important notifications and account recovery.</p>
          </div>

          {otpSent && (
            <div className="space-y-1.5">
              <Label htmlFor="otp_code">Verification Code</Label>
              <div className="flex gap-2">
                <Input
                  id="otp_code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="6-digit code"
                  className="flex-1 tracking-widest font-mono"
                  maxLength={6}
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={confirmOtp}
                  disabled={otpLoading || otp.length < 6}
                  className="shrink-0"
                >
                  {otpLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm"}
                </Button>
              </div>
            </div>
          )}

          {otpMsg && (
            <div className={`flex items-center gap-2 text-sm rounded-lg px-3 py-2 ${otpMsg.ok ? "bg-green-50 text-green-700" : "bg-destructive/10 text-destructive"}`}>
              {otpMsg.ok ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
              {otpMsg.text}
            </div>
          )}
        </CardContent>
      </Card>

      {/* CPA / Accountant */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <Briefcase className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            Current CPA / Accountant / Bookkeeper
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Optional — helps us reach your existing advisor to retrieve records or coordinate onboarding.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="cpa_firm_name">Firm / Company Name</Label>
              <Input
                id="cpa_firm_name"
                value={form.cpa_firm_name}
                onChange={(e) => set("cpa_firm_name", e.target.value)}
                placeholder="Smith & Associates CPA"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cpa_full_name">Contact Full Name</Label>
              <Input
                id="cpa_full_name"
                value={form.cpa_full_name}
                onChange={(e) => set("cpa_full_name", e.target.value)}
                placeholder="John Smith"
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="cpa_email">Email</Label>
              <Input
                id="cpa_email"
                type="email"
                value={form.cpa_email}
                onChange={(e) => set("cpa_email", e.target.value)}
                placeholder="john@smithcpa.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cpa_phone">Phone</Label>
              <Input
                id="cpa_phone"
                type="tel"
                value={form.cpa_phone}
                onChange={(e) => set("cpa_phone", e.target.value)}
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cpa_addr1">Address Line 1</Label>
            <Input
              id="cpa_addr1"
              value={form.cpa_address_line1}
              onChange={(e) => set("cpa_address_line1", e.target.value)}
              placeholder="789 Finance Blvd"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cpa_addr2">Address Line 2 <span className="text-muted-foreground font-normal">(optional)</span></Label>
            <Input
              id="cpa_addr2"
              value={form.cpa_address_line2}
              onChange={(e) => set("cpa_address_line2", e.target.value)}
              placeholder="Suite 100"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5 sm:col-span-1">
              <Label htmlFor="cpa_city">City</Label>
              <Input
                id="cpa_city"
                value={form.cpa_city}
                onChange={(e) => set("cpa_city", e.target.value)}
                placeholder="Austin"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cpa_state">State</Label>
              <Input
                id="cpa_state"
                value={form.cpa_state}
                onChange={(e) => set("cpa_state", e.target.value)}
                placeholder="TX"
                maxLength={2}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cpa_zip">ZIP</Label>
              <Input
                id="cpa_zip"
                value={form.cpa_zip}
                onChange={(e) => set("cpa_zip", e.target.value)}
                placeholder="78701"
                maxLength={10}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Share with CPA */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <Share2 className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            Share Access with Your CPA
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Invite your CPA or accountant by email. They must sign in with that email to view your workspace — access is private and invite-only.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {!cpaToken ? (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="cpa_invite_email">CPA / Accountant Email <span className="text-destructive">*</span></Label>
                <Input
                  id="cpa_invite_email"
                  type="email"
                  value={cpaEmailInput}
                  onChange={(e) => { setCpaEmailInput(e.target.value); setCpaError("") }}
                  placeholder="john@smithcpa.com"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cpa_label">Label <span className="text-muted-foreground font-normal">(optional)</span></Label>
                <Input
                  id="cpa_label"
                  value={cpaLabelInput}
                  onChange={(e) => setCpaLabelInput(e.target.value)}
                  placeholder="e.g. John Smith CPA"
                />
              </div>
              {cpaError && (
                <p className="text-xs text-destructive">{cpaError}</p>
              )}
              <Button
                type="button"
                size="sm"
                onClick={generateCpaToken}
                disabled={cpaLoading}
                className="gap-1.5"
              >
                {cpaLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Share2 className="h-4 w-4" />}
                Send Invite & Generate Link
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                {cpaToken.invited_email && (
                  <span className="text-xs bg-primary/10 text-primary rounded-full px-2.5 py-0.5 font-medium">
                    {cpaToken.invited_email}
                  </span>
                )}
                {cpaToken.label && (
                  <span className="text-xs text-muted-foreground">{cpaToken.label}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-muted rounded-lg px-3 py-2 text-sm font-mono truncate text-muted-foreground">
                  {`${CPA_SITE_URL}/cpa/${cpaToken.token}`}
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={copyCpaLink}
                  className="shrink-0 gap-1.5 bg-transparent"
                >
                  {cpaCopied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                  {cpaCopied ? "Copied!" : "Copy"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Only {cpaToken.invited_email ?? "the invited email"} can access this link. They must be signed in to view your workspace.
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={regenerateCpaToken}
                  disabled={cpaLoading}
                  className="gap-1.5 bg-transparent"
                >
                  {cpaLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
                  Revoke &amp; Regenerate
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={revokeCpaToken}
                  disabled={cpaLoading}
                  className="gap-1.5 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Revoke
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save */}
      <div className="flex items-center gap-4">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving…</> : "Save Profile"}
        </Button>
        {saveMsg && (
          <p className={`text-sm ${saveMsg.ok ? "text-green-600" : "text-destructive"}`}>{saveMsg.text}</p>
        )}
      </div>
    </div>
  )
}
