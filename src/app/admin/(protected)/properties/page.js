import React from "react"
import Link from "next/link"
import PageHeader from "@/components/admin/PageHeader"
import { Button } from "@/components/ui/button"
import PropertyTable from "@/features/properties/components/PropertyTable"
import PropertyFilters from "@/features/properties/components/PropertyFilters"
import { getProperties, getPropertyFormMetadata } from "@/features/properties/services"
import { Plus, Archive, ShieldAlert } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function PropertiesPage({ searchParams }) {
  const params = await searchParams
  const search = params?.search || ""
  const categoryId = params?.categoryId || ""
  const purposeId = params?.purposeId || ""
  const statusId = params?.statusId || ""
  const countryId = params?.countryId || ""
  const stateId = params?.stateId || ""
  const cityId = params?.cityId || ""
  const minPrice = params?.minPrice ? Number(params.minPrice) : undefined
  const maxPrice = params?.maxPrice ? Number(params.maxPrice) : undefined
  const isFeaturedVal = params?.isFeatured
  const isFeatured = isFeaturedVal === "true" ? true : isFeaturedVal === "false" ? false : undefined
  const sortBy = params?.sortBy || "createdAt"
  const sortOrder = params?.sortOrder || "desc"
  const page = parseInt(params?.page || "1", 10)
  const isArchived = params?.archive === "true"
  const limit = 10

  // 1. Fetch properties and drop-down metadata concurrently
  const [propertiesResult, metadata] = await Promise.all([
    getProperties({
      search,
      categoryId,
      purposeId,
      statusId,
      countryId,
      stateId,
      cityId,
      isFeatured,
      minPrice,
      maxPrice,
      sortBy,
      sortOrder,
      page,
      limit,
      showDeleted: isArchived,
    }),
    getPropertyFormMetadata(),
  ])

  // Coordinate active filters to pre-populate inputs on mount
  const activeFilters = {
    search,
    categoryId,
    purposeId,
    statusId,
    countryId,
    stateId,
    cityId,
    minPrice: params?.minPrice || "",
    maxPrice: params?.maxPrice || "",
    isFeatured: isFeaturedVal || "",
    sortBy,
    sortOrder,
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <PageHeader
          title="Property Directories"
          description="Manage property listings, toggle highlights, adjust badges, and manage details."
        />

        <div className="flex items-center gap-2">
          {/* Active / Archive toggler */}

          {isArchived ? (
            <Link href="/admin/properties">
              <Button
                variant="outline"
                asChild
                className="border-neutral-200 hover:bg-neutral-50 h-10 text-xs font-semibold text-neutral-700 cursor-pointer"
              >

                <ShieldAlert className="h-4 w-4 mr-2 text-neutral-500" />
                Active Listings
              </Button>
            </Link>
          ) : (
            <Link href="/admin/properties?archive=true">
              <Button
                variant="outline"
                asChild
                className="border-neutral-200 hover:bg-neutral-50 h-10 text-xs font-semibold text-neutral-700 cursor-pointer"
              >
                <Archive className="h-4 w-4 mr-2 text-neutral-500" />
                Archived Records
              </Button>
            </Link>
          )}

          <Link href="/admin/properties/create">
            <Button
              asChild
              className="bg-neutral-950 text-white hover:bg-neutral-800 h-10 text-xs font-semibold cursor-pointer"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Publish Property
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Filter & Listing Box */}
      <div className="bg-white rounded-lg border border-neutral-200 shadow-xs overflow-hidden">
        {/* Search Filter Panel */}
        <PropertyFilters
          metadata={metadata}
          initialFilters={activeFilters}
        />

        {/* Data Table */}
        <div className="p-6 pt-0">
          <PropertyTable
            properties={propertiesResult.properties}
            statuses={metadata.statuses}
            showDeleted={isArchived}
          />
        </div>

        {/* Pagination controls */}
        {propertiesResult.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-neutral-100 bg-white px-6 py-4">
            <div className="text-xs text-neutral-500">
              Showing{" "}
              <span className="font-semibold text-neutral-700">
                {(page - 1) * limit + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-neutral-700">
                {Math.min(page * limit, propertiesResult.total)}
              </span>{" "}
              of <span className="font-semibold text-neutral-700">{propertiesResult.total}</span>{" "}
              listings
            </div>
            <div className="flex items-center gap-2">
              <PaginationLink
                page={page - 1}
                disabled={page <= 1}
                filters={activeFilters}
                archive={isArchived}
              >
                Previous
              </PaginationLink>
              <PaginationLink
                page={page + 1}
                disabled={page >= propertiesResult.totalPages}
                filters={activeFilters}
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

function PaginationLink({ page, disabled, filters, archive, children }) {
  if (disabled) {
    return (
      <Button variant="outline" size="sm" disabled className="text-xs h-8">
        {children}
      </Button>
    )
  }

  const query = new URLSearchParams()
  if (filters.search) query.set("search", filters.search)
  if (filters.categoryId) query.set("categoryId", filters.categoryId)
  if (filters.purposeId) query.set("purposeId", filters.purposeId)
  if (filters.statusId) query.set("statusId", filters.statusId)
  if (filters.countryId) query.set("countryId", filters.countryId)
  if (filters.stateId) query.set("stateId", filters.stateId)
  if (filters.cityId) query.set("cityId", filters.cityId)
  if (filters.minPrice) query.set("minPrice", filters.minPrice)
  if (filters.maxPrice) query.set("maxPrice", filters.maxPrice)
  if (filters.isFeatured) query.set("isFeatured", filters.isFeatured)
  if (filters.sortBy) query.set("sortBy", filters.sortBy)
  if (filters.sortOrder) query.set("sortOrder", filters.sortOrder)
  if (page > 1) query.set("page", page.toString())
  if (archive) query.set("archive", "true")

  const queryString = query.toString()
  const href = `/admin/properties${queryString ? `?${queryString}` : ""}`

  return (
    <Button variant="outline" size="sm" asChild className="text-xs h-8 text-neutral-700 border-neutral-200 hover:bg-neutral-50">
      <Link href={href}>{children}</Link>
    </Button>
  )
}
