"use client"

import { useEffect, useState } from "react"
import { Sparkles, X } from "lucide-react"

type Props = {
  planName: string
  firstName: string
}

export function PaidWelcome({ planName, firstName }: Props) {
  const [visible, setVisible] = useState(true)

  // Auto-dismiss after 12 seconds
  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 12000)
    return () => clearTimeout(t)
  }, [])

  if (!visible) return null

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground px-6 py-6">
      {/* Background sparkle blobs */}
      <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-white/5 blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-white/5 blur-3xl translate-y-1/2 -translate-x-1/2" />

      <button
        onClick={() => setVisible(false)}
        className="absolute top-4 right-4 text-primary-foreground/50 hover:text-primary-foreground transition-colors"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="relative flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 shrink-0">
          <Sparkles className="h-6 w-6" aria-hidden="true" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/60 mb-1">
            {planName} Plan — Active
          </p>
          <h2 className="text-xl font-bold leading-snug">
            {firstName ? `Welcome, ${firstName}! You're all set.` : "Welcome aboard! You're all set."}
          </h2>
          <p className="text-sm text-primary-foreground/75 mt-1 max-w-xl">
            Your dedicated bookkeeper will reach out within 1 business day. In the meantime, complete the checklist below to hit the ground running.
          </p>
        </div>
      </div>
    </div>
  )
}
