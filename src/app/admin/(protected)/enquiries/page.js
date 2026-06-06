import React from "react"
import Link from "next/link"
import PageHeader from "@/components/admin/PageHeader"
import { Button } from "@/components/ui/button"
import EnquiryTable from "@/features/enquiries/components/EnquiryTable"
import EnquiryFilters from "@/features/enquiries/components/EnquiryFilters"
import { getEnquiries } from "@/features/enquiries/services/enquiry.service"
import { db } from "@/lib/db"

export const dynamic = "force-dynamic"

export default async function EnquiriesPage({ searchParams }) {
  const params = await searchParams
  const search = params?.search || ""
  const status = params?.status || ""
  const propertyId = params?.propertyId || ""
  const startDate = params?.startDate || ""
  const endDate = params?.endDate || ""
  const page = parseInt(params?.page || "1", 10)
  const limit = 10

  // 1. Fetch filtered leads and active properties lists concurrently
  const [enquiriesResult, properties] = await Promise.all([
    getEnquiries({
      search,
      status,
      propertyId,
      startDate,
      endDate,
      page,
      limit,
    }),
    db.property.findMany({
      where: { deletedAt: null },
      select: { id: true, title: true },
      orderBy: { title: "asc" },
    }),
  ])

  // Coordinate active filters to preserve values on filter changes
  const activeFilters = {
    search,
    status,
    propertyId,
    startDate,
    endDate,
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <PageHeader
        title="Enquiry Leads"
        description="Monitor prospective buyer leads, view submitted questions, and manage your status pipeline."
      />

      {/* Main Filter & Listing Container */}
      <div className="bg-white rounded-lg border border-neutral-200 shadow-xs overflow-hidden">
        {/* Enquiry Filter & CSV Export Panel */}
        <EnquiryFilters properties={properties} initialFilters={activeFilters} />

        {/* Lead Table Grid */}
        <div className="p-6 pt-0">
          <EnquiryTable enquiries={enquiriesResult.enquiries} />
        </div>

        {/* Pagination controls */}
        {enquiriesResult.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-neutral-100 bg-white px-6 py-4">
            <div className="text-xs text-neutral-500">
              Showing{" "}
              <span className="font-semibold text-neutral-700">
                {(page - 1) * limit + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-neutral-700">
                {Math.min(page * limit, enquiriesResult.total)}
              </span>{" "}
              of <span className="font-semibold text-neutral-700">{enquiriesResult.total}</span>{" "}
              leads
            </div>
            <div className="flex items-center gap-2">
              <PaginationLink
                page={page - 1}
                disabled={page <= 1}
                filters={activeFilters}
              >
                Previous
              </PaginationLink>
              <PaginationLink
                page={page + 1}
                disabled={page >= enquiriesResult.totalPages}
                filters={activeFilters}
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

function PaginationLink({ page, disabled, filters, children }) {
  if (disabled) {
    return (
      <Button variant="outline" size="sm" disabled className="text-xs h-8">
        {children}
      </Button>
    )
  }

  const query = new URLSearchParams()
  if (filters.search) query.set("search", filters.search)
  if (filters.status) query.set("status", filters.status)
  if (filters.propertyId) query.set("propertyId", filters.propertyId)
  if (filters.startDate) query.set("startDate", filters.startDate)
  if (filters.endDate) query.set("endDate", filters.endDate)
  if (page > 1) query.set("page", page.toString())

  const queryString = query.toString()
  const href = `/admin/enquiries${queryString ? `?${queryString}` : ""}`

  return (
    <Button
      variant="outline"
      size="sm"
      asChild
      className="text-xs h-8 text-neutral-700 border-neutral-200 hover:bg-neutral-50 cursor-pointer"
    >
      <Link href={href}>{children}</Link>
    </Button>
  )
}
