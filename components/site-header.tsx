"use client"

import Link from "next/link"
import { BookOpenCheck, Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"

export function SiteHeader() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"))
  }, [])

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark")
    setIsDark((d) => !d)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BookOpenCheck aria-hidden="true" className="h-4 w-4" />
          </div>
          <span className="text-lg font-bold tracking-tight text-primary dark:text-foreground">
            BookKeeping<span className="font-normal opacity-60">.business</span>
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-8">
          {[
            { href: "/why-us", label: "Why Us" },
            { href: "/services", label: "Services" },
            { href: "/bookkeeping", label: "Bookkeeping" },
            { href: "/about", label: "About" },
            { href: "/faqs", label: "FAQs" },
            { href: "/contact", label: "Contact" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="hidden sm:flex h-8 w-8 items-center justify-center rounded-lg text-foreground/60 hover:text-foreground transition-colors"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <Link
            href="/client-portal"
            className="hidden sm:flex items-center px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 transition-colors"
          >
            Platform
          </Link>
          <Link
            href="/contact"
            className="flex items-center px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  )
}
