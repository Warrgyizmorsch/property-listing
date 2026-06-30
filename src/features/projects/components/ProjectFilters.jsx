"use client"

import React, { useState, useEffect } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Search, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

export default function ProjectFilters({ metadata = {}, initialFilters = {} }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(initialFilters.search || "")
  const [categoryId, setCategoryId] = useState(initialFilters.categoryId || "")
  const [status, setStatus] = useState(initialFilters.status || "")

  // Sync state with url changes
  useEffect(() => {
    setSearch(initialFilters.search || "")
    setCategoryId(initialFilters.categoryId || "")
    setStatus(initialFilters.status || "")
  }, [initialFilters])

  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams)
    
    if (search) params.set("search", search)
    else params.delete("search")

    if (categoryId) params.set("categoryId", categoryId)
    else params.delete("categoryId")

    if (status) params.set("status", status)
    else params.delete("status")

    params.set("page", "1") // reset to first page on filter change

    router.push(`${pathname}?${params.toString()}`)
  }

  const handleReset = () => {
    setSearch("")
    setCategoryId("")
    setStatus("")
    router.push(pathname)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleApplyFilters()
    }
  }

  return (
    <div className="p-6 border-b border-neutral-100 bg-neutral-50/50 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-neutral-400" />
          <Input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-10 h-10 border-neutral-200 focus:border-neutral-400 bg-white"
          />
        </div>

        {/* Category */}
        <div>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger className="h-10 px-3 py-2 text-sm rounded-md border border-neutral-200 bg-white font-normal text-neutral-800 dark:border-neutral-200 dark:bg-white dark:text-neutral-800 focus:border-neutral-400 focus:ring-0 focus:ring-offset-0">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {metadata.categories?.map((cat) => (
                <SelectItem key={cat.id} value={cat.id.toString()}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Project Status */}
        <div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-10 px-3 py-2 text-sm rounded-md border border-neutral-200 bg-white font-normal text-neutral-800 dark:border-neutral-200 dark:bg-white dark:text-neutral-800 focus:border-neutral-400 focus:ring-0 focus:ring-offset-0">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="ONGOING">Ongoing</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="UPCOMING">Upcoming</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={handleApplyFilters}
            className="flex-1 bg-primary text-white hover:bg-primary/90 text-xs font-semibold h-10 cursor-pointer"
          >
            Apply Filters
          </Button>
          <Button
            variant="outline"
            onClick={handleReset}
            className="border-neutral-200 hover:bg-neutral-50 p-2.5 h-10 text-neutral-500 cursor-pointer"
            title="Reset Filters"
          >
            <RotateCcw className="h-4.5 w-4.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
