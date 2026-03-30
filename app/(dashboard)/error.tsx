"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw, LogOut } from "lucide-react"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 mx-auto">
          <AlertCircle className="h-7 w-7 text-destructive" aria-hidden="true" />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-bold">Something went wrong</h1>
          <p className="text-sm text-muted-foreground">
            An unexpected error occurred. Try refreshing, or sign out and back in.
          </p>
          {error.digest && (
            <p className="text-xs text-muted-foreground font-mono">Ref: {error.digest}</p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Try Again
          </Button>
          <form action="/api/auth/signout" method="POST">
            <Button type="submit" variant="default" className="gap-2 w-full">
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sign Out
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
