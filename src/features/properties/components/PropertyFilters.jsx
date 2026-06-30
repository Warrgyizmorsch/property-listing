"use client"

import React, { useState, useEffect, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Search, SlidersHorizontal, RotateCcw } from "lucide-react"
import { getActiveStatesAction, getActiveCitiesAction } from "@/features/locations/actions"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

export default function PropertyFilters({
  metadata = {},
  initialFilters = {},
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // Filter States
  const [search, setSearch] = useState(initialFilters.search || "")
  const [categoryId, setCategoryId] = useState(initialFilters.categoryId || "")
  const [purposeId, setPurposeId] = useState(initialFilters.purposeId || "")
  const [statusId, setStatusId] = useState(initialFilters.statusId || "")
  const [minPrice, setMinPrice] = useState(initialFilters.minPrice || "")
  const [maxPrice, setMaxPrice] = useState(initialFilters.maxPrice || "")
  const [isFeatured, setIsFeatured] = useState(initialFilters.isFeatured || "")
  const [sortBy, setSortBy] = useState(initialFilters.sortBy || "createdAt")
  const [sortOrder, setSortOrder] = useState(initialFilters.sortOrder || "desc")

  // Cascading Location States
  const [countryId, setCountryId] = useState(initialFilters.countryId || "")
  const [stateId, setStateId] = useState(initialFilters.stateId || "")
  const [cityId, setCityId] = useState(initialFilters.cityId || "")
  const [states, setStates] = useState([])
  const [cities, setCities] = useState([])

  // Load locations on mount if editing or query params exist
  useEffect(() => {
    if (countryId) {
      getActiveStatesAction(countryId).then(setStates)
    } else {
      setStates([])
    }
  }, [countryId])

  useEffect(() => {
    if (stateId) {
      getActiveCitiesAction(stateId).then(setCities)
    } else {
      setCities([])
    }
  }, [stateId])

  const handleCountryChange = (val) => {
    setCountryId(val)
    setStateId("")
    setCityId("")
    setStates([])
    setCities([])
    if (val) {
      getActiveStatesAction(val).then(setStates)
    }
  }

  const handleStateChange = (val) => {
    setStateId(val)
    setCityId("")
    setCities([])
    if (val) {
      getActiveCitiesAction(val).then(setCities)
    }
  }

  const applyFilters = () => {
    startTransition(() => {
      const params = new URLSearchParams()

      if (search) params.set("search", search)
      if (categoryId) params.set("categoryId", categoryId)
      if (purposeId) params.set("purposeId", purposeId)
      if (statusId) params.set("statusId", statusId)
      if (countryId) params.set("countryId", countryId)
      if (stateId) params.set("stateId", stateId)
      if (cityId) params.set("cityId", cityId)
      if (minPrice) params.set("minPrice", minPrice)
      if (maxPrice) params.set("maxPrice", maxPrice)
      if (isFeatured) params.set("isFeatured", isFeatured)
      if (sortBy) params.set("sortBy", sortBy)
      if (sortOrder) params.set("sortOrder", sortOrder)

      // Retain archive status tab
      const archiveVal = searchParams.get("archive")
      if (archiveVal) params.set("archive", archiveVal)

      router.push(`/admin/properties?${params.toString()}`)
    })
  }

  const resetFilters = () => {
    setSearch("")
    setCategoryId("")
    setPurposeId("")
    setStatusId("")
    setCountryId("")
    setStateId("")
    setCityId("")
    setMinPrice("")
    setMaxPrice("")
    setIsFeatured("")
    setSortBy("createdAt")
    setSortOrder("desc")
    setStates([])
    setCities([])

    startTransition(() => {
      const params = new URLSearchParams()
      const archiveVal = searchParams.get("archive")
      if (archiveVal) params.set("archive", archiveVal)

      router.push(`/admin/properties?${params.toString()}`)
    })
  }

  return (
    <div className="bg-neutral-50/50 p-6 border-b border-neutral-200 space-y-6">
      {/* Search and Sort row */}
      <div className="grid gap-4 md:grid-cols-12 items-center">
        {/* Search */}
        <div className="md:col-span-6 relative">
          <Search className="absolute left-3 top-[50%] h-4 w-4 translate-y-[-50%] text-neutral-400 pointer-events-none" />
          <Input
            type="text"
            placeholder="Search by title, description or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 border-neutral-200 bg-white"
          />
        </div>

        {/* Sort By */}
        <div className="md:col-span-3">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="h-9 px-3 py-1 text-sm rounded-md border border-neutral-200 bg-white font-normal text-neutral-800 dark:border-neutral-200 dark:bg-white dark:text-neutral-800 focus:border-neutral-400 focus:ring-0 focus:ring-offset-0">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Sort by Date Created</SelectItem>
              <SelectItem value="price">Sort by Price</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort Order */}
        <div className="md:col-span-3">
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="h-9 px-3 py-1 text-sm rounded-md border border-neutral-200 bg-white font-normal text-neutral-800 dark:border-neutral-200 dark:bg-white dark:text-neutral-800 focus:border-neutral-400 focus:ring-0 focus:ring-offset-0">
              <SelectValue placeholder="Sort Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Descending</SelectItem>
              <SelectItem value="asc">Ascending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Advanced filters toggles */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
        {/* Category */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-neutral-500">Category</Label>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger className="h-8.5 px-2 py-1 text-xs rounded-md border border-neutral-200 bg-white font-normal text-neutral-800 dark:border-neutral-200 dark:bg-white dark:text-neutral-800 focus:border-neutral-400 focus:ring-0 focus:ring-offset-0">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {metadata.categories?.map((c) => (
                <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Purpose */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-neutral-500">Purpose</Label>
          <Select value={purposeId} onValueChange={setPurposeId}>
            <SelectTrigger className="h-8.5 px-2 py-1 text-xs rounded-md border border-neutral-200 bg-white font-normal text-neutral-800 dark:border-neutral-200 dark:bg-white dark:text-neutral-800 focus:border-neutral-400 focus:ring-0 focus:ring-offset-0">
              <SelectValue placeholder="All Purposes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Purposes</SelectItem>
              {metadata.purposes?.map((p) => (
                <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-neutral-500">Status</Label>
          <Select value={statusId} onValueChange={setStatusId}>
            <SelectTrigger className="h-8.5 px-2 py-1 text-xs rounded-md border border-neutral-200 bg-white font-normal text-neutral-800 dark:border-neutral-200 dark:bg-white dark:text-neutral-800 focus:border-neutral-400 focus:ring-0 focus:ring-offset-0">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              {metadata.statuses?.map((s) => (
                <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Featured */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-neutral-500">Featured</Label>
          <Select value={isFeatured} onValueChange={setIsFeatured}>
            <SelectTrigger className="h-8.5 px-2 py-1 text-xs rounded-md border border-neutral-200 bg-white font-normal text-neutral-800 dark:border-neutral-200 dark:bg-white dark:text-neutral-800 focus:border-neutral-400 focus:ring-0 focus:ring-offset-0">
              <SelectValue placeholder="All Featured" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Featured</SelectItem>
              <SelectItem value="true">Featured Only</SelectItem>
              <SelectItem value="false">Non-Featured Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Min Price */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-neutral-500">Min Price ($)</Label>
          <Input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="h-8.5 text-xs bg-white border-neutral-200"
          />
        </div>

        {/* Max Price */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-neutral-500">Max Price ($)</Label>
          <Input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="h-8.5 text-xs bg-white border-neutral-200"
          />
        </div>
      </div>

      {/* Cascading location filters */}
      <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 items-end">
        {/* Country */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-neutral-500">Country</Label>
          <Select value={countryId} onValueChange={handleCountryChange}>
            <SelectTrigger className="h-8.5 px-2 py-1 text-xs rounded-md border border-neutral-200 bg-white font-normal text-neutral-800 dark:border-neutral-200 dark:bg-white dark:text-neutral-800 focus:border-neutral-400 focus:ring-0 focus:ring-offset-0">
              <SelectValue placeholder="All Countries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Countries</SelectItem>
              {metadata.countries?.map((c) => (
                <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* State */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-neutral-500">State</Label>
          <Select value={stateId} onValueChange={handleStateChange} disabled={!countryId}>
            <SelectTrigger className="h-8.5 px-2 py-1 text-xs rounded-md border border-neutral-200 bg-white font-normal text-neutral-800 dark:border-neutral-200 dark:bg-white dark:text-neutral-800 focus:border-neutral-400 focus:ring-0 focus:ring-offset-0">
              <SelectValue placeholder="All States" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All States</SelectItem>
              {states.map((s) => (
                <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* City */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-neutral-500">City</Label>
          <Select value={cityId} onValueChange={setCityId} disabled={!stateId}>
            <SelectTrigger className="h-8.5 px-2 py-1 text-xs rounded-md border border-neutral-200 bg-white font-normal text-neutral-800 dark:border-neutral-200 dark:bg-white dark:text-neutral-800 focus:border-neutral-400 focus:ring-0 focus:ring-offset-0">
              <SelectValue placeholder="All Cities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Cities</SelectItem>
              {cities.map((c) => (
                <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Action Row buttons */}
        <div className="sm:col-span-3 flex items-center gap-2 justify-end w-full">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={resetFilters}
            className="flex items-center gap-1.5 h-8.5 text-xs text-neutral-500 border-neutral-200 hover:bg-neutral-50 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </Button>

          <Button
            type="button"
            disabled={isPending}
            onClick={applyFilters}
            className="flex items-center gap-1.5 h-8.5 text-xs bg-primary text-white hover:bg-primary/90 cursor-pointer"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>{isPending ? "Filtering..." : "Apply Filters"}</span>
          </Button>
        </div>
      </div>

    </div>
  )
}
