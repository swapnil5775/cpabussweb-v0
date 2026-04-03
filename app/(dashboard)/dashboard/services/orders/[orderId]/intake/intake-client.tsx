"use client"

import { useEffect, useMemo, useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle2, Loader2, Save } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type IntakeQuestion = {
  id: string
  label: string
  type: "text" | "textarea" | "select" | "date" | "number" | "yes_no"
  required?: boolean
  placeholder?: string
  options?: string[]
}

type IntakeOrder = {
  id: string
  order_number: string | null
  service_type: string
  service_name: string
  amount_cents: number | null
  status: string
  intake_status: string
  intake_answers: Record<string, string>
  intake_questions: IntakeQuestion[]
  intake_intro: string
  timeline: string
}

export function IntakeClient({ orderId }: { orderId: string }) {
  const router = useRouter()
  const [order, setOrder] = useState<IntakeOrder | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [pending, startTransition] = useTransition()

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/service-orders/${orderId}/intake`)
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? "Failed to load intake form.")
        setLoading(false)
        return
      }
      setOrder(data.order)
      setAnswers(data.order?.intake_answers ?? {})
      setLoading(false)
    }
    load()
  }, [orderId])

  const requiredIds = useMemo(
    () => (order?.intake_questions ?? []).filter((q) => q.required).map((q) => q.id),
    [order]
  )
  const missingRequired = requiredIds.filter((id) => !answers[id]?.trim())

  async function save(submit: boolean) {
    setError("")
    setMessage("")
    startTransition(async () => {
      const res = await fetch(`/api/service-orders/${orderId}/intake`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, submit }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? "Failed to save intake.")
        return
      }
      setMessage(submit ? "Intake submitted. Your team can start work now." : "Draft saved.")
      if (submit) {
        router.push("/dashboard/services")
      }
    })
  }

  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-destructive">{error || "Order not found."}</p>
        <Link href="/dashboard/services">
          <Button variant="outline">Back to Services</Button>
        </Link>
      </div>
    )
  }

  const isPaid = !["requested", "pending"].includes(order.status) || order.status === "intake_submitted"
  const steps = [
    { label: isPaid ? "Payment Received" : "Request Submitted", done: true },
    { label: "Intake Submitted", done: order.intake_status === "submitted" },
    { label: "Team Review", done: ["in_progress", "completed"].includes(order.status) },
    { label: "Work In Progress", done: ["in_progress", "completed"].includes(order.status) },
    { label: "Delivered", done: order.status === "completed" },
  ]

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Badge variant="outline">{order.order_number ?? "Pending order number"}</Badge>
            <Badge variant="secondary">{order.service_name}</Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Service Intake Form</h1>
          <p className="text-sm text-muted-foreground mt-1">{order.intake_intro}</p>
        </div>
        <Link href="/dashboard/services">
          <Button variant="outline" size="sm" className="gap-1.5 bg-transparent">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Services
          </Button>
        </Link>
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Timeline Tracker</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-2 sm:grid-cols-5">
            {steps.map((step) => (
              <div
                key={step.label}
                className={`rounded-lg border px-3 py-2 text-xs ${step.done ? "bg-background border-green-300/50 text-foreground" : "bg-background/70 text-muted-foreground"}`}
              >
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className={`h-3.5 w-3.5 ${step.done ? "text-green-600" : "text-muted-foreground"}`} />
                  <span className="font-medium">{step.label}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">Estimated turnaround: {order.timeline}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Required Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {order.intake_questions.map((question) => (
            <div key={question.id} className="space-y-1.5">
              <Label htmlFor={question.id}>
                {question.label}
                {question.required ? <span className="text-destructive"> *</span> : null}
              </Label>

              {question.type === "textarea" ? (
                <Textarea
                  id={question.id}
                  value={answers[question.id] ?? ""}
                  onChange={(event) => setAnswers((prev) => ({ ...prev, [question.id]: event.target.value }))}
                  placeholder={question.placeholder}
                />
              ) : question.type === "select" ? (
                <select
                  id={question.id}
                  value={answers[question.id] ?? ""}
                  onChange={(event) => setAnswers((prev) => ({ ...prev, [question.id]: event.target.value }))}
                  className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                >
                  <option value="">Select</option>
                  {(question.options ?? []).map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              ) : question.type === "yes_no" ? (
                <select
                  id={question.id}
                  value={answers[question.id] ?? ""}
                  onChange={(event) => setAnswers((prev) => ({ ...prev, [question.id]: event.target.value }))}
                  className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              ) : (
                <Input
                  id={question.id}
                  type={question.type === "number" ? "number" : question.type === "date" ? "date" : "text"}
                  value={answers[question.id] ?? ""}
                  onChange={(event) => setAnswers((prev) => ({ ...prev, [question.id]: event.target.value }))}
                  placeholder={question.placeholder}
                />
              )}
            </div>
          ))}

          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          {message ? <p className="text-sm text-green-700">{message}</p> : null}
          {missingRequired.length > 0 ? (
            <p className="text-xs text-muted-foreground">Required fields remaining: {missingRequired.length}</p>
          ) : null}

          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="gap-1.5 bg-transparent" disabled={pending} onClick={() => save(false)}>
              <Save className="h-4 w-4" />
              Save Draft
            </Button>
            <Button disabled={pending || missingRequired.length > 0} onClick={() => save(true)}>
              {pending ? "Submitting..." : "Submit Intake"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
