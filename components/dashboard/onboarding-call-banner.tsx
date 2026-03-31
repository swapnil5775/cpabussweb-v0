"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { CalendarClock, CheckCircle2, ExternalLink, X, Phone } from "lucide-react"

const CALENDLY_URL = "https://calendly.com/book1on1s/intake-call-business-book"

type Props = {
  isFree: boolean
  isPaid: boolean
  // For paid users: days since subscription started
  daysSinceSubscribed: number | null
  // Whether they've already marked the call as scheduled
  callScheduled: boolean
}

export function OnboardingCallBanner({ isFree, isPaid, daysSinceSubscribed, callScheduled }: Props) {
  const [dismissed, setDismissed] = useState(false)
  const [marked, setMarked] = useState(callScheduled)
  const [pending, startTransition] = useTransition()

  function markScheduled() {
    startTransition(async () => {
      await fetch("/api/onboarding-call", { method: "POST" })
      setMarked(true)
    })
  }

  // Paid users who've scheduled — show a small confirmation, then nothing
  if (isPaid && marked) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900 px-5 py-3.5">
        <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" aria-hidden="true" />
        <p className="text-sm font-medium text-green-800 dark:text-green-300">
          Onboarding call scheduled — your bookkeeper will be in touch to confirm.
        </p>
      </div>
    )
  }

  // Free user — soft optional prompt (dismissable)
  if (isFree && !dismissed) {
    return (
      <div className="relative rounded-2xl border border-border bg-card px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
          <Phone className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">Not sure which plan is right for you?</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Book a free 15-min call — we&apos;ll walk through your business and recommend the best fit.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={markScheduled}
          >
            <Button size="sm" className="gap-1.5">
              <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
              Schedule Free Call
              <ExternalLink className="h-3 w-3 opacity-60" aria-hidden="true" />
            </Button>
          </a>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    )
  }

  // Paid user — overdue (> 7 days, not scheduled)
  if (isPaid && !marked && daysSinceSubscribed !== null && daysSinceSubscribed > 7) {
    return (
      <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800 px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 shrink-0">
          <CalendarClock className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-amber-900 dark:text-amber-200">Your onboarding call is overdue</p>
          <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
            We recommend scheduling within the first 7 days so your bookkeeper can get you set up quickly.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
            <Button size="sm" variant="outline" className="border-amber-400 text-amber-800 hover:bg-amber-100 dark:text-amber-200 gap-1.5">
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              Schedule Now
            </Button>
          </a>
          <Button size="sm" variant="ghost" onClick={markScheduled} disabled={pending} className="text-xs text-amber-700">
            {pending ? "Saving…" : "I already scheduled"}
          </Button>
        </div>
      </div>
    )
  }

  // Paid user — within 7 days, not yet scheduled (mandatory prompt)
  if (isPaid && !marked && daysSinceSubscribed !== null && daysSinceSubscribed <= 7) {
    const daysLeft = 7 - daysSinceSubscribed
    return (
      <div className="rounded-2xl border-2 border-primary/40 bg-primary/5 px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary shrink-0">
          <CalendarClock className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-sm">Schedule your onboarding call</p>
            <span className="inline-flex items-center rounded-full bg-primary/10 text-primary text-xs font-semibold px-2 py-0.5">
              {daysLeft === 0 ? "Due today" : `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Meet your dedicated bookkeeper to review your account, share documents, and set expectations.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
            <Button size="sm" className="gap-1.5">
              <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
              Book Call
              <ExternalLink className="h-3 w-3 opacity-60" aria-hidden="true" />
            </Button>
          </a>
          <Button size="sm" variant="ghost" onClick={markScheduled} disabled={pending} className="text-xs text-muted-foreground">
            {pending ? "Saving…" : "Already scheduled"}
          </Button>
        </div>
      </div>
    )
  }

  return null
}
