"use client"

import { useEffect, useState, useTransition } from "react"
import { Building2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Organization = {
  id: string
  name: string
  country_code: string | null
}

export function OrganizationSwitcher() {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [activeOrganizationId, setActiveOrganizationId] = useState<string>("")
  const [showCreate, setShowCreate] = useState(false)
  const [newOrgName, setNewOrgName] = useState("")
  const [newOrgCountry, setNewOrgCountry] = useState("US")
  const [loading, setLoading] = useState(true)
  const [pending, startTransition] = useTransition()

  useEffect(() => {
    fetch("/api/organizations")
      .then((res) => res.json())
      .then((data) => {
        setOrganizations(data.organizations ?? [])
        setActiveOrganizationId(data.activeOrganizationId ?? "")
      })
      .finally(() => setLoading(false))
  }, [])

  function switchOrganization(orgId: string) {
    setActiveOrganizationId(orgId)
    startTransition(async () => {
      await fetch("/api/organizations/active", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organization_id: orgId }),
      })
      window.location.reload()
    })
  }

  function createOrganization() {
    if (!newOrgName.trim()) return
    startTransition(async () => {
      const res = await fetch("/api/organizations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newOrgName.trim(), country_code: newOrgCountry }),
      })
      if (res.ok) {
        window.location.reload()
      }
    })
  }

  if (loading) {
    return (
      <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
        <Building2 className="h-3.5 w-3.5" />
        Loading...
      </div>
    )
  }

  return (
    <div className="hidden md:flex items-center gap-2">
      <Building2 className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
      <select
        value={activeOrganizationId}
        onChange={(event) => switchOrganization(event.target.value)}
        className="h-8 rounded-md border border-border bg-background px-2 text-sm"
        disabled={pending || organizations.length === 0}
      >
        {organizations.map((org) => (
          <option key={org.id} value={org.id}>
            {org.name}
          </option>
        ))}
      </select>
      {!showCreate ? (
        <Button variant="outline" size="sm" className="h-8 gap-1.5 px-2 bg-transparent" onClick={() => setShowCreate(true)}>
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          Org
        </Button>
      ) : (
        <div className="flex items-center gap-2">
          <Input
            value={newOrgName}
            onChange={(event) => setNewOrgName(event.target.value)}
            placeholder="New organization"
            className="h-8 w-44"
          />
          <select
            value={newOrgCountry}
            onChange={(event) => setNewOrgCountry(event.target.value)}
            className="h-8 rounded-md border border-border bg-background px-2 text-xs"
          >
            <option value="US">US</option>
            <option value="CA">CA</option>
            <option value="AU">AU</option>
            <option value="IN">IN</option>
            <option value="GB">UK</option>
          </select>
          <Button size="sm" className="h-8" onClick={createOrganization} disabled={pending || !newOrgName.trim()}>
            Add
          </Button>
          <Button variant="ghost" size="sm" className="h-8" onClick={() => setShowCreate(false)}>
            Cancel
          </Button>
        </div>
      )}
    </div>
  )
}
