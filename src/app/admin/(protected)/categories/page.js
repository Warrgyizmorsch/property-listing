import React from "react"
import Link from "next/link"
import { getCategories } from "@/features/categories/services"
import PageHeader from "@/components/admin/PageHeader"
import { Button } from "@/components/ui/button"
import CategoryTable from "@/features/categories/components/CategoryTable"
import CategoryFilters from "@/features/categories/components/CategoryFilters"
import CategoryPageHeader from "@/features/categories/components/CategoryPageHeader"

export const dynamic = "force-dynamic"

export default async function CategoriesPage({ searchParams }) {
  // Parse and normalize parameters
  const params = await searchParams
  const search = params?.search || ""
  const page = parseInt(params?.page || "1", 10)
  const tab = params?.tab || "active"
  const limit = 10

  const showDeleted = tab === "archived"

  // Fetch paginated results from Prisma
  const { categories, total, totalPages } = await getCategories({
    search,
    page,
    limit,
    showDeleted,
  })

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <PageHeader
          title="Property Categories"
          description="Manage property categories, taxonomy classifications, and SEO URL slugs."
        />
        {/* Client side add button and dialog */}
        <CategoryPageHeader />
      </div>

      {/* Main Filter & Listing Section */}
      <div className="bg-white rounded-lg border border-neutral-200 shadow-xs overflow-hidden">
        {/* Client side search and tabs filters */}
        <CategoryFilters initialSearch={search} initialTab={tab} />

        {/* Categories Table Component */}
        <div className="p-6 pt-0">
          <CategoryTable
            categories={categories}
            showDeleted={showDeleted}
            onRefresh={undefined} // Next.js router.refresh() handles table updates automatically on database mutation
          />
        </div>

        {/* Pagination Controls */}
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
              categories
            </div>
            <div className="flex items-center gap-2">
              <PaginationLink
                page={page - 1}
                disabled={page <= 1}
                search={search}
                tab={tab}
              >
                Previous
              </PaginationLink>
              <PaginationLink
                page={page + 1}
                disabled={page >= totalPages}
                search={search}
                tab={tab}
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

function PaginationLink({ page, disabled, search, tab, children }) {
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
  if (tab !== "active") query.set("tab", tab)

  const queryString = query.toString()
  const href = `/admin/categories${queryString ? `?${queryString}` : ""}`

  return (
    <Button variant="outline" size="sm" asChild className="text-xs h-8 text-neutral-700 border-neutral-200 hover:bg-neutral-50">
      <Link href={href}>{children}</Link>
    </Button>
  )
}
