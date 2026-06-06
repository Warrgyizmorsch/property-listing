"use client"

import React, { useState, useEffect, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function LocationFilters({
  initialSearch = "",
  initialTab = "countries",
  initialArchive = false,
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchVal, setSearchVal] = useState(initialSearch)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    setSearchVal(initialSearch)
  }, [initialSearch])

  // Debounce search update
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchVal === initialSearch) return

      startTransition(() => {
        const params = new URLSearchParams(searchParams.toString())
        if (searchVal) {
          params.set("search", searchVal)
        } else {
          params.delete("search")
        }
        params.delete("page") // Reset pagination
        router.push(`/admin/locations?${params.toString()}`)
      })
    }, 400)

    return () => clearTimeout(handler)
  }, [searchVal, initialSearch, router, searchParams])

  const handleTabChange = (newTab) => {
    if (newTab === initialTab) return

    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString())
      params.set("tab", newTab)
      params.delete("page") // Reset pagination
      router.push(`/admin/locations?${params.toString()}`)
    })
  }

  const handleArchiveChange = (showArchived) => {
    if (showArchived === initialArchive) return

    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (showArchived) {
        params.set("archive", "true")
      } else {
        params.delete("archive")
      }
      params.delete("page") // Reset pagination
      router.push(`/admin/locations?${params.toString()}`)
    })
  }

  return (
    <div className="flex flex-col gap-6 p-6 border-b border-neutral-100 bg-white">
      {/* 1. Location Tier Tabs Selector */}
      <div className="flex border-b border-neutral-200 w-full overflow-x-auto select-none shrink-0">
        {[
          { key: "countries", label: "Countries" },
          { key: "states", label: "States / Provinces" },
          { key: "cities", label: "Cities / Towns" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => handleTabChange(t.key)}
            className={`pb-2.5 px-5 text-sm font-semibold border-b-2 transition-colors cursor-pointer outline-hidden whitespace-nowrap ${
              initialTab === t.key
                ? "border-neutral-950 text-neutral-950"
                : "border-transparent text-neutral-400 hover:text-neutral-600"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 2. Search Box and Active/Archive Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Toggle between Active and Archived states */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-lg w-fit text-xs font-semibold select-none">
          <button
            onClick={() => handleArchiveChange(false)}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer outline-hidden ${
              !initialArchive
                ? "bg-white text-neutral-900 shadow-xs"
                : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => handleArchiveChange(true)}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer outline-hidden ${
              initialArchive
                ? "bg-white text-neutral-900 shadow-xs"
                : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            Archived / Deleted
          </button>
        </div>

        {/* Search Field */}
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-[50%] h-4 w-4 translate-y-[-50%] text-neutral-400 pointer-events-none" />
          <Input
            type="text"
            placeholder={`Search ${initialTab}...`}
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="pl-9 h-9 border-neutral-200 hover:border-neutral-300 focus-visible:ring-neutral-400"
          />
        </div>
      </div>
    </div>
  )
}
