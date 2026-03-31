"use client"

import { useEffect, useState, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Copy, Check, Gift, Users, Send, Sparkles } from "lucide-react"

const SITE_URL = "https://www.bookkeeping.business"

type Invite = { id: string; invited_email: string; status: string; created_at: string }
type Credit = { id: string; redeemed: boolean; created_at: string }

export default function ReferralPage() {
  const [code, setCode] = useState<string | null>(null)
  const [invites, setInvites] = useState<Invite[]>([])
  const [credits, setCredits] = useState<Credit[]>([])
  const [copied, setCopied] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteMsg, setInviteMsg] = useState("")
  const [pending, startTransition] = useTransition()

  useEffect(() => {
    fetch("/api/referral")
      .then((r) => r.json())
      .then((d) => {
        setCode(d.code)
        setInvites(d.invites ?? [])
        setCredits(d.credits ?? [])
      })
  }, [])

  const referralLink = code ? `${SITE_URL}/r/${code}` : "Loading…"
  const availableCredits = credits.filter((c) => !c.redeemed).length

  function copyLink() {
    if (!code) return
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function sendInvite() {
    if (!inviteEmail) return
    startTransition(async () => {
      const res = await fetch("/api/referral/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail }),
      })
      const data = await res.json()
      if (res.ok) {
        setInviteMsg("Invite sent!")
        setInviteEmail("")
        // Refresh invites
        fetch("/api/referral").then((r) => r.json()).then((d) => setInvites(d.invites ?? []))
      } else {
        setInviteMsg(data.error ?? "Failed to send")
      }
      setTimeout(() => setInviteMsg(""), 4000)
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Refer a Business</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Invite up to 3 businesses. When they join a paid plan, you earn a free add-on service.
        </p>
      </div>

      {/* How it works */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { icon: Users, step: "1", title: "Share your link", desc: "Send your unique referral link to a business owner (up to 3)" },
          { icon: Sparkles, step: "2", title: "They join a plan", desc: "When they sign up and choose any paid plan, you qualify" },
          { icon: Gift, step: "3", title: "You earn a credit", desc: "Redeem 1 free add-on service: tax filing, LLC formation, payroll setup, and more" },
        ].map(({ icon: Icon, step, title, desc }) => (
          <Card key={step} className="border-primary/20 bg-primary/5">
            <CardContent className="pt-5 space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">{step}</div>
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <p className="font-semibold text-sm">{title}</p>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Referral link */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Your Referral Link</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-muted rounded-lg px-3 py-2 text-sm font-mono truncate text-muted-foreground">
              {referralLink}
            </div>
            <Button size="sm" variant="outline" onClick={copyLink} className="shrink-0 gap-1.5 bg-transparent">
              {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">{invites.length}/3 invites used</p>
        </CardContent>
      </Card>

      {/* Invite by email */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Send an Email Invite</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="owner@theirbusiness.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              disabled={invites.length >= 3 || pending}
              onKeyDown={(e) => e.key === "Enter" && sendInvite()}
            />
            <Button
              size="sm"
              onClick={sendInvite}
              disabled={!inviteEmail || invites.length >= 3 || pending}
              className="shrink-0 gap-1.5"
            >
              <Send className="h-3.5 w-3.5" />
              {pending ? "Sending…" : "Send"}
            </Button>
          </div>
          {inviteMsg && (
            <p className={`text-xs font-medium ${inviteMsg === "Invite sent!" ? "text-green-600" : "text-destructive"}`}>
              {inviteMsg}
            </p>
          )}
          {invites.length >= 3 && (
            <p className="text-xs text-muted-foreground">You&apos;ve used all 3 referral slots.</p>
          )}
        </CardContent>
      </Card>

      {/* Invites list */}
      {invites.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Your Invites</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {invites.map((inv) => (
                <li key={inv.id} className="flex items-center justify-between gap-3 py-2 border-b border-border last:border-0">
                  <p className="text-sm truncate">{inv.invited_email}</p>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={inv.status === "converted" ? "default" : "secondary"} className="text-xs">
                      {inv.status === "converted" ? "Converted ✓" : inv.status === "signed_up" ? "Signed up" : "Pending"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(inv.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Credits */}
      <Card className={availableCredits > 0 ? "border-green-300 bg-green-50 dark:bg-green-950/20" : ""}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <Gift className={`h-4 w-4 ${availableCredits > 0 ? "text-green-600" : "text-muted-foreground"}`} />
            Credits Earned
          </CardTitle>
        </CardHeader>
        <CardContent>
          {credits.length === 0 ? (
            <p className="text-sm text-muted-foreground">No credits yet — your first converted referral will earn you a free add-on service.</p>
          ) : (
            <div className="space-y-3">
              <p className="text-sm">
                <span className="text-2xl font-bold text-green-600">{availableCredits}</span>
                {" "}<span className="text-muted-foreground">available · {credits.filter(c => c.redeemed).length} redeemed</span>
              </p>
              <p className="text-xs text-muted-foreground">Each credit = 1 free add-on service (LLC Formation, Tax Filing, Payroll Setup, or Individual Tax Return). Contact support to redeem.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
