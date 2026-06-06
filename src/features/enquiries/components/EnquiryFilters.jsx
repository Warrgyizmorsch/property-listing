"use client"

import React, { useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Search, SlidersHorizontal, RotateCcw, Download } from "lucide-react"
import { ENQUIRY_STATUSES } from "../schemas/enquiry.schema"

export default function EnquiryFilters({
  properties = [],
  initialFilters = {},
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // Filter States
  const [search, setSearch] = useState(initialFilters.search || "")
  const [status, setStatus] = useState(initialFilters.status || "")
  const [propertyId, setPropertyId] = useState(initialFilters.propertyId || "")
  const [startDate, setStartDate] = useState(initialFilters.startDate || "")
  const [endDate, setEndDate] = useState(initialFilters.endDate || "")

  const applyFilters = () => {
    startTransition(() => {
      const params = new URLSearchParams()

      if (search) params.set("search", search)
      if (status) params.set("status", status)
      if (propertyId) params.set("propertyId", propertyId)
      if (startDate) params.set("startDate", startDate)
      if (endDate) params.set("endDate", endDate)

      router.push(`/admin/enquiries?${params.toString()}`)
    })
  }

  const resetFilters = () => {
    setSearch("")
    setStatus("")
    setPropertyId("")
    setStartDate("")
    setEndDate("")

    startTransition(() => {
      router.push("/admin/enquiries")
    })
  }

  const handleExportCSV = () => {
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (status) params.set("status", status)
    if (propertyId) params.set("propertyId", propertyId)
    if (startDate) params.set("startDate", startDate)
    if (endDate) params.set("endDate", endDate)

    // Trigger native browser download by pointing window location to the API route
    window.location.href = `/api/admin/enquiries/export?${params.toString()}`
  }

  return (
    <div className="bg-neutral-50/50 p-6 border-b border-neutral-200 space-y-6">
      {/* Primary search and export row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3 top-[50%] h-4 w-4 translate-y-[-50%] text-neutral-400 pointer-events-none" />
          <Input
            type="text"
            placeholder="Search leads by name, email, phone or message content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 border-neutral-200 bg-white"
          />
        </div>

        {/* CSV Export Button */}
        <Button
          type="button"
          onClick={handleExportCSV}
          variant="outline"
          className="flex items-center gap-1.5 h-10 text-xs font-semibold text-neutral-700 border-neutral-200 hover:bg-neutral-50 cursor-pointer self-start md:self-auto shrink-0"
        >
          <Download className="h-4 w-4 text-neutral-500" />
          <span>Export Leads (CSV)</span>
        </Button>
      </div>

      {/* Advanced Filter Criteria dropdowns */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 items-end">
        {/* Status Dropdown */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-neutral-500">Status</Label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="flex w-full h-9 rounded-md border border-neutral-200 bg-white px-2 py-1 text-xs focus:border-neutral-400 cursor-pointer"
          >
            <option value="">All Statuses</option>
            {ENQUIRY_STATUSES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* Property Dropdown */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-neutral-500">Property</Label>
          <select
            value={propertyId}
            onChange={(e) => setPropertyId(e.target.value)}
            className="flex w-full h-9 rounded-md border border-neutral-200 bg-white px-2 py-1 text-xs focus:border-neutral-400 cursor-pointer"
          >
            <option value="">All Properties</option>
            {properties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>

        {/* Date From */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-neutral-500">Date From</Label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="h-9 text-xs bg-white border-neutral-200"
          />
        </div>

        {/* Date To */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-neutral-500">Date To</Label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="h-9 text-xs bg-white border-neutral-200"
          />
        </div>

        {/* Filter Action Buttons */}
        <div className="flex items-center gap-2 w-full">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={resetFilters}
            className="flex-1 flex items-center justify-center gap-1.5 h-9 text-xs text-neutral-500 border-neutral-200 hover:bg-neutral-50 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </Button>

          <Button
            type="button"
            disabled={isPending}
            onClick={applyFilters}
            className="flex-1 flex items-center justify-center gap-1.5 h-9 text-xs bg-neutral-950 text-white hover:bg-neutral-800 cursor-pointer"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>{isPending ? "..." : "Filter"}</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
