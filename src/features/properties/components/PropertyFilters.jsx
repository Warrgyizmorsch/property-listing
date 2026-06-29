"use client"

import React, { useState, useEffect, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Search, SlidersHorizontal, RotateCcw } from "lucide-react"
import { getActiveStatesAction, getActiveCitiesAction } from "@/features/locations/actions"

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

  const handleCountryChange = (e) => {
    const val = e.target.value
    setCountryId(val)
    setStateId("")
    setCityId("")
    setStates([])
    setCities([])
    if (val) {
      getActiveStatesAction(val).then(setStates)
    }
  }

  const handleStateChange = (e) => {
    const val = e.target.value
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
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="flex w-full h-9 rounded-md border border-neutral-200 bg-white px-3 py-1 text-sm focus:border-neutral-400 cursor-pointer"
          >
            <option value="createdAt">Sort by Date Created</option>
            <option value="price">Sort by Price</option>
          </select>
        </div>

        {/* Sort Order */}
        <div className="md:col-span-3">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="flex w-full h-9 rounded-md border border-neutral-200 bg-white px-3 py-1 text-sm focus:border-neutral-400 cursor-pointer"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>

      {/* Advanced filters toggles */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
        {/* Category */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-neutral-500">Category</Label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="flex w-full h-8.5 rounded-md border border-neutral-200 bg-white px-2 py-1 text-xs focus:border-neutral-400 cursor-pointer"
          >
            <option value="">All Categories</option>
            {metadata.categories?.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Purpose */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-neutral-500">Purpose</Label>
          <select
            value={purposeId}
            onChange={(e) => setPurposeId(e.target.value)}
            className="flex w-full h-8.5 rounded-md border border-neutral-200 bg-white px-2 py-1 text-xs focus:border-neutral-400 cursor-pointer"
          >
            <option value="">All Purposes</option>
            {metadata.purposes?.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-neutral-500">Status</Label>
          <select
            value={statusId}
            onChange={(e) => setStatusId(e.target.value)}
            className="flex w-full h-8.5 rounded-md border border-neutral-200 bg-white px-2 py-1 text-xs focus:border-neutral-400 cursor-pointer"
          >
            <option value="">All Statuses</option>
            {metadata.statuses?.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        {/* Featured */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-neutral-500">Featured</Label>
          <select
            value={isFeatured}
            onChange={(e) => setIsFeatured(e.target.value)}
            className="flex w-full h-8.5 rounded-md border border-neutral-200 bg-white px-2 py-1 text-xs focus:border-neutral-400 cursor-pointer"
          >
            <option value="">All Featured</option>
            <option value="true">Featured Only</option>
            <option value="false">Non-Featured Only</option>
          </select>
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
          <select
            value={countryId}
            onChange={handleCountryChange}
            className="flex w-full h-8.5 rounded-md border border-neutral-200 bg-white px-2 py-1 text-xs focus:border-neutral-400 cursor-pointer"
          >
            <option value="">All Countries</option>
            {metadata.countries?.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* State */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-neutral-500">State</Label>
          <select
            value={stateId}
            onChange={handleStateChange}
            disabled={!countryId}
            className="flex w-full h-8.5 rounded-md border border-neutral-200 bg-white px-2 py-1 text-xs focus:border-neutral-400 cursor-pointer disabled:opacity-50"
          >
            <option value="">All States</option>
            {states.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        {/* City */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-neutral-500">City</Label>
          <select
            value={cityId}
            onChange={(e) => setCityId(e.target.value)}
            disabled={!stateId}
            className="flex w-full h-8.5 rounded-md border border-neutral-200 bg-white px-2 py-1 text-xs focus:border-neutral-400 cursor-pointer disabled:opacity-50"
          >
            <option value="">All Cities</option>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
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
