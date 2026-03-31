"use client"

import Link from "next/link"
import { CheckCircle2, Circle, CalendarClock, UserCircle, FileUp, Briefcase, MessageSquare, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

const CALENDLY_URL = "https://calendly.com/book1on1s/intake-call-business-book"

type Task = {
  id: string
  label: string
  description: string
  done: boolean
  href?: string
  externalHref?: string
  cta: string
  icon: React.ElementType
  required?: boolean
}

type Props = {
  callScheduled: boolean
  profileComplete: boolean
  hasDocument: boolean
  hasCpa: boolean
  hasSupport: boolean
}

export function OnboardingChecklist({ callScheduled, profileComplete, hasDocument, hasCpa, hasSupport }: Props) {
  const tasks: Task[] = [
    {
      id: "call",
      label: "Schedule your onboarding call",
      description: "Meet your bookkeeper — required within 7 days of joining.",
      done: callScheduled,
      externalHref: CALENDLY_URL,
      cta: "Book Now",
      icon: CalendarClock,
      required: true,
    },
    {
      id: "profile",
      label: "Complete your profile",
      description: "Add your name, business address, and personal mailing address.",
      done: profileComplete,
      href: "/dashboard/profile",
      cta: "Go to Profile",
      icon: UserCircle,
    },
    {
      id: "document",
      label: "Upload your first document",
      description: "Bank statement, tax return, or any relevant file to get started.",
      done: hasDocument,
      href: "/dashboard/documents",
      cta: "Upload Document",
      icon: FileUp,
    },
    {
      id: "cpa",
      label: "Add your CPA / prior bookkeeper",
      description: "Let us know who currently handles your books so we can coordinate.",
      done: hasCpa,
      href: "/dashboard/profile",
      cta: "Add Details",
      icon: Briefcase,
    },
    {
      id: "support",
      label: "Say hello to your team",
      description: "Send a quick message in the Support section — we're ready to help.",
      done: hasSupport,
      href: "/dashboard/support",
      cta: "Open Support",
      icon: MessageSquare,
    },
  ]

  const completedCount = tasks.filter((t) => t.done).length
  const percent = Math.round((completedCount / tasks.length) * 100)

  return (
    <div className="rounded-2xl border-2 border-primary/20 bg-primary/5 p-5 space-y-4">
      {/* Header + progress */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-base">Getting Started Checklist</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {completedCount} of {tasks.length} complete
          </p>
        </div>
        <div className="text-right shrink-0">
          <span className="text-2xl font-black text-primary">{percent}%</span>
        </div>
      </div>
      <div className="w-full bg-primary/10 rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Task list */}
      <ul className="space-y-2">
        {tasks.map((task) => {
          const Icon = task.icon
          return (
            <li
              key={task.id}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-colors ${
                task.done
                  ? "bg-background/50 opacity-60"
                  : task.required
                  ? "bg-background border-2 border-primary/30"
                  : "bg-background"
              }`}
            >
              {task.done ? (
                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" aria-hidden="true" />
              ) : (
                <Circle className={`h-5 w-5 shrink-0 ${task.required ? "text-primary" : "text-muted-foreground/40"}`} aria-hidden="true" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" aria-hidden="true" />
                  <p className={`text-sm font-semibold ${task.done ? "line-through text-muted-foreground" : ""}`}>
                    {task.label}
                  </p>
                  {task.required && !task.done && (
                    <span className="text-[10px] font-bold text-primary bg-primary/10 rounded px-1.5 py-0.5 shrink-0">Required</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{task.description}</p>
              </div>
              {!task.done && (
                task.externalHref ? (
                  <a href={task.externalHref} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" className="shrink-0 gap-1 text-xs h-7">
                      {task.cta}
                      <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </Button>
                  </a>
                ) : (
                  <Link href={task.href!}>
                    <Button size="sm" variant="outline" className="shrink-0 text-xs h-7 bg-transparent">
                      {task.cta}
                    </Button>
                  </Link>
                )
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
