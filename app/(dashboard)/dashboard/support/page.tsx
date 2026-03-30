"use client"

import { useState, useEffect, useRef, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  MessageSquare, Send, Plus, ArrowLeft, Lock, ArrowRight, Loader2, CheckCircle2
} from "lucide-react"
import Link from "next/link"

type Message = {
  id: string
  body: string
  is_staff: boolean
  created_at: string
}

type Ticket = {
  id: string
  subject: string
  status: string
  created_at: string
  updated_at: string
  support_messages: Message[]
}

export default function SupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [isLocked, setIsLocked] = useState(false)
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null)
  const [showNew, setShowNew] = useState(false)

  // New ticket form
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [sending, startSend] = useTransition()
  const [sendMsg, setSendMsg] = useState<{ ok: boolean; text: string } | null>(null)

  // Reply form
  const [reply, setReply] = useState("")
  const [replying, startReply] = useTransition()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    load()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [activeTicket?.support_messages.length])

  async function load() {
    setLoading(true)
    const res = await fetch("/api/support")
    if (res.status === 403) { setIsLocked(true); setLoading(false); return }
    if (res.ok) {
      const data = await res.json()
      setTickets(data.tickets ?? [])
    }
    setLoading(false)
  }

  function handleSubmitNew() {
    if (!subject.trim() || !message.trim()) return
    setSendMsg(null)
    startSend(async () => {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message }),
      })
      if (res.ok) {
        setSendMsg({ ok: true, text: "Request submitted. Our team will respond within 1 business day." })
        setSubject("")
        setMessage("")
        setShowNew(false)
        await load()
      } else {
        const d = await res.json()
        setSendMsg({ ok: false, text: d.error ?? "Failed to send. Please try again." })
      }
    })
  }

  function handleReply(ticketId: string) {
    if (!reply.trim()) return
    startReply(async () => {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticket_id: ticketId, message: reply }),
      })
      if (res.ok) {
        setReply("")
        await load()
        // Refresh active ticket
        const res2 = await fetch("/api/support")
        if (res2.ok) {
          const data = await res2.json()
          const updated = (data.tickets ?? []).find((t: Ticket) => t.id === ticketId)
          if (updated) setActiveTicket(updated)
        }
      }
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // Locked (free plan)
  if (isLocked) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center space-y-5">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mx-auto">
          <Lock className="h-7 w-7 text-muted-foreground" aria-hidden="true" />
        </div>
        <h1 className="text-xl font-bold">Support Messaging</h1>
        <p className="text-sm text-muted-foreground">
          Direct messaging with your bookkeeper is available on paid plans. Upgrade to submit questions, raise requests, and get responses within 1 business day.
        </p>
        <Link href="/onboarding">
          <Button className="gap-2">
            View Plans & Upgrade
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </Link>
      </div>
    )
  }

  // Thread view
  if (activeTicket) {
    const messages = [...activeTicket.support_messages].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )
    return (
      <div className="max-w-2xl space-y-4">
        <button
          onClick={() => setActiveTicket(null)}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to all requests
        </button>

        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold truncate">{activeTicket.subject}</h1>
          <Badge variant={activeTicket.status === "open" ? "default" : "outline"} className="text-xs shrink-0 ml-3">
            {activeTicket.status}
          </Badge>
        </div>

        {/* Messages */}
        <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.is_staff ? "justify-start" : "justify-end"}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                m.is_staff
                  ? "bg-muted text-foreground rounded-tl-sm"
                  : "bg-primary text-primary-foreground rounded-tr-sm"
              }`}>
                {m.is_staff && <p className="text-xs font-semibold mb-1 opacity-60">BookKeeping.business Team</p>}
                <p className="whitespace-pre-wrap">{m.body}</p>
                <p className={`text-[10px] mt-1 ${m.is_staff ? "text-muted-foreground" : "text-primary-foreground/60"}`}>
                  {new Date(m.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Reply */}
        <div className="flex gap-2 pt-2">
          <Textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Type your reply…"
            rows={3}
            className="resize-none flex-1"
          />
          <Button
            onClick={() => handleReply(activeTicket.id)}
            disabled={replying || !reply.trim()}
            size="icon"
            className="self-end h-10 w-10 shrink-0"
          >
            {replying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" aria-hidden="true" />}
          </Button>
        </div>
      </div>
    )
  }

  // List view
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Support & Requests</h1>
          <p className="text-sm text-muted-foreground mt-1">Ask questions or submit requests to your bookkeeping team.</p>
        </div>
        <Button onClick={() => { setShowNew(true); setSendMsg(null) }} className="gap-2 shrink-0">
          <Plus className="h-4 w-4" aria-hidden="true" />
          New Request
        </Button>
      </div>

      {/* New ticket form */}
      {showNew && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">New Support Request</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Question about my March report"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your question or request in detail…"
                rows={4}
                className="resize-none"
              />
            </div>
            {sendMsg && (
              <div className={`flex items-center gap-2 text-sm rounded-lg px-3 py-2 ${sendMsg.ok ? "bg-green-50 text-green-700" : "bg-destructive/10 text-destructive"}`}>
                {sendMsg.ok ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : null}
                {sendMsg.text}
              </div>
            )}
            <div className="flex gap-3">
              <Button onClick={handleSubmitNew} disabled={sending || !subject.trim() || !message.trim()} className="gap-2">
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" aria-hidden="true" />}
                Send Request
              </Button>
              <Button variant="ghost" onClick={() => setShowNew(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ticket list */}
      {tickets.length === 0 && !showNew ? (
        <div className="rounded-2xl border-2 border-dashed border-border px-6 py-14 text-center">
          <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground mb-3" aria-hidden="true" />
          <p className="text-sm font-medium">No requests yet</p>
          <p className="text-xs text-muted-foreground mt-1">Submit a question or request and your team will respond within 1 business day.</p>
          <Button className="mt-4 gap-2" size="sm" onClick={() => setShowNew(true)}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            New Request
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {tickets.map((ticket) => {
            const lastMsg = [...ticket.support_messages].sort(
              (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            )[0]
            const hasStaffReply = ticket.support_messages.some((m) => m.is_staff)
            return (
              <button
                key={ticket.id}
                onClick={() => setActiveTicket(ticket)}
                className="w-full text-left rounded-xl border border-border bg-background hover:border-primary/40 hover:shadow-sm transition-all px-4 py-3 flex items-start justify-between gap-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold truncate">{ticket.subject}</p>
                    {hasStaffReply && (
                      <Badge variant="default" className="text-[10px] shrink-0">Reply</Badge>
                    )}
                  </div>
                  {lastMsg && (
                    <p className="text-xs text-muted-foreground truncate">{lastMsg.body}</p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <Badge variant={ticket.status === "open" ? "outline" : "secondary"} className="text-[10px] mb-1">
                    {ticket.status}
                  </Badge>
                  <p className="text-[10px] text-muted-foreground">
                    {new Date(ticket.updated_at).toLocaleDateString()}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
