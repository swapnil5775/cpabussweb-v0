"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"

export function SiteHeader() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark")
    setIsDark(isDarkMode)
  }, [])

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark")
    setIsDark(!isDark)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-semibold tracking-tight">BookKeeping.business</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/why-us"
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              Why Us
            </Link>
            <Link
              href="/services"
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              Services
            </Link>
            <Link
              href="/bookkeeping"
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              Bookkeeping
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              About
            </Link>
            <Link
              href="/faqs"
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              FAQs
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              Contact
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="hidden sm:inline-flex"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Link href="/client-portal">
            <Button variant="outline" size="sm">
              Client Portal
            </Button>
          </Link>
          <Link href="/contact">
            <Button size="sm" className="hidden sm:inline-flex">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
