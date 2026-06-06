"use client"

import React, { useState, useEffect, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function CategoryFilters({ initialSearch = "", initialTab = "active" }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchVal, setSearchVal] = useState(initialSearch)
  const [isPending, startTransition] = useTransition()

  // Keep search input value in sync if query param changes externally
  useEffect(() => {
    setSearchVal(initialSearch)
  }, [initialSearch])

  // Update query params when searchVal changes (debounced)
  useEffect(() => {
    const handler = setTimeout(() => {
      // Avoid pushing to router if searchVal hasn't actually changed from the URL state
      if (searchVal === initialSearch) return

      startTransition(() => {
        const params = new URLSearchParams(searchParams.toString())
        if (searchVal) {
          params.set("search", searchVal)
        } else {
          params.delete("search")
        }
        params.delete("page") // Reset to page 1 on new search
        router.push(`/admin/categories?${params.toString()}`)
      })
    }, 400) // Debounce search input by 400ms

    return () => clearTimeout(handler)
  }, [searchVal, initialSearch, router, searchParams])

  const handleTabChange = (newTab) => {
    if (newTab === initialTab) return

    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString())
      params.set("tab", newTab)
      params.delete("page") // Reset to page 1 on tab change
      router.push(`/admin/categories?${params.toString()}`)
    })
  }

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-neutral-100 p-6 gap-4 bg-white">
      {/* 1. Tabs */}
      <div className="flex border-b border-neutral-200 w-fit shrink-0">
        <button
          onClick={() => handleTabChange("active")}
          className={`pb-2.5 px-4 text-sm font-semibold border-b-2 transition-colors cursor-pointer outline-hidden ${
            initialTab === "active"
              ? "border-neutral-950 text-neutral-950"
              : "border-transparent text-neutral-400 hover:text-neutral-600"
          }`}
        >
          Active Categories
        </button>
        <button
          onClick={() => handleTabChange("archived")}
          className={`pb-2.5 px-4 text-sm font-semibold border-b-2 transition-colors cursor-pointer outline-hidden ${
            initialTab === "archived"
              ? "border-neutral-950 text-neutral-950"
              : "border-transparent text-neutral-400 hover:text-neutral-600"
          }`}
        >
          Archived / Deleted
        </button>
      </div>

      {/* 2. Search box */}
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-[50%] h-4 w-4 translate-y-[-50%] text-neutral-400 pointer-events-none" />
        <Input
          type="text"
          placeholder="Search categories..."
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          className="pl-9 h-9 border-neutral-200 hover:border-neutral-300 focus-visible:ring-neutral-400"
        />
      </div>
    </div>
  )
}
