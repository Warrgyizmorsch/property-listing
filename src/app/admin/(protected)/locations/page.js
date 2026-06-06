import React from "react"
import Link from "next/link"
import PageHeader from "@/components/admin/PageHeader"
import { Button } from "@/components/ui/button"
import LocationFilters from "@/features/locations/components/LocationFilters"
import LocationPageHeader from "@/features/locations/components/LocationPageHeader"
import LocationTable from "@/features/locations/components/LocationTable"
import {
  getCountries,
  getStates,
  getCities,
} from "@/features/locations/services"

export const dynamic = "force-dynamic"

export default async function LocationsPage({ searchParams }) {
  const params = await searchParams
  const tab = params?.tab || "countries"
  const search = params?.search || ""
  const page = parseInt(params?.page || "1", 10)
  const isArchived = params?.archive === "true"
  const limit = 10

  // 1. Fetch relevant paginated lists depending on active location tier
  let listingData = []
  let total = 0
  let totalPages = 0

  if (tab === "countries") {
    const result = await getCountries({
      search,
      page,
      limit,
      showDeleted: isArchived,
    })
    listingData = result.countries
    total = result.total
    totalPages = result.totalPages
  } else if (tab === "states") {
    const result = await getStates({
      search,
      page,
      limit,
      showDeleted: isArchived,
    })
    listingData = result.states
    total = result.total
    totalPages = result.totalPages
  } else {
    const result = await getCities({
      search,
      page,
      limit,
      showDeleted: isArchived,
    })
    listingData = result.cities
    total = result.total
    totalPages = result.totalPages
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 2. Top Header & Add Button */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <PageHeader
          title="Location Directory"
          description="Configure hierarchical location directories (Countries, States/Provinces, Cities/Towns) for property listing lookups."
        />
        <LocationPageHeader tab={tab} />
      </div>

      {/* 3. Main Data Container */}
      <div className="bg-white rounded-lg border border-neutral-200 shadow-xs overflow-hidden">
        {/* Dynamic Filters Component */}
        <LocationFilters
          initialSearch={search}
          initialTab={tab}
          initialArchive={isArchived}
        />

        {/* Location Listings Grid */}
        <div className="p-6 pt-0">
          <LocationTable
            data={listingData}
            tab={tab}
            showDeleted={isArchived}
          />
        </div>

        {/* Pagination navigators */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-neutral-100 bg-white px-6 py-4">
            <div className="text-xs text-neutral-500">
              Showing{" "}
              <span className="font-semibold text-neutral-700">
                {(page - 1) * limit + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-neutral-700">
                {Math.min(page * limit, total)}
              </span>{" "}
              of <span className="font-semibold text-neutral-700">{total}</span>{" "}
              location entries
            </div>
            <div className="flex items-center gap-2">
              <PaginationLink
                page={page - 1}
                disabled={page <= 1}
                search={search}
                tab={tab}
                archive={isArchived}
              >
                Previous
              </PaginationLink>
              <PaginationLink
                page={page + 1}
                disabled={page >= totalPages}
                search={search}
                tab={tab}
                archive={isArchived}
              >
                Next
              </PaginationLink>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function PaginationLink({ page, disabled, search, tab, archive, children }) {
  if (disabled) {
    return (
      <Button variant="outline" size="sm" disabled className="text-xs h-8">
        {children}
      </Button>
    )
  }

  const query = new URLSearchParams()
  if (search) query.set("search", search)
  if (page > 1) query.set("page", page.toString())
  if (tab !== "countries") query.set("tab", tab)
  if (archive) query.set("archive", "true")

  const queryString = query.toString()
  const href = `/admin/locations${queryString ? `?${queryString}` : ""}`

  return (
    <Button variant="outline" size="sm" asChild className="text-xs h-8 text-neutral-700 border-neutral-200 hover:bg-neutral-50">
      <Link href={href}>{children}</Link>
    </Button>
  )
}
