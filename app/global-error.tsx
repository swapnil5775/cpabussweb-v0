"use client"

import { useEffect } from "react"

export default function GlobalError({
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
    <html>
      <body style={{ margin: 0, fontFamily: "sans-serif", background: "#f9fafb" }}>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
          <div style={{ maxWidth: "400px", width: "100%", textAlign: "center" }}>
            <h1 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>Something went wrong</h1>
            <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "24px" }}>
              An unexpected error occurred. Please try again.
            </p>
            {error.digest && (
              <p style={{ fontSize: "12px", color: "#9ca3af", fontFamily: "monospace", marginBottom: "24px" }}>
                Ref: {error.digest}
              </p>
            )}
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                onClick={reset}
                style={{ padding: "8px 20px", borderRadius: "8px", border: "1px solid #d1d5db", background: "#fff", cursor: "pointer", fontSize: "14px", fontWeight: 500 }}
              >
                Try Again
              </button>
              <form action="/api/auth/signout" method="POST" style={{ display: "inline" }}>
                <button
                  type="submit"
                  style={{ padding: "8px 20px", borderRadius: "8px", border: "none", background: "#111827", color: "#fff", cursor: "pointer", fontSize: "14px", fontWeight: 500 }}
                >
                  Sign Out
                </button>
              </form>
              <a
                href="/dashboard"
                style={{ padding: "8px 20px", borderRadius: "8px", border: "1px solid #d1d5db", background: "#fff", cursor: "pointer", fontSize: "14px", fontWeight: 500, textDecoration: "none", color: "inherit" }}
              >
                Go to Dashboard
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
