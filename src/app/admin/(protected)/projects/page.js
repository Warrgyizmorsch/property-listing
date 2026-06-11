import React from "react"
import Link from "next/link"
import PageHeader from "@/components/admin/PageHeader"
import { Button } from "@/components/ui/button"
import ProjectTable from "@/features/projects/components/ProjectTable"
import ProjectFilters from "@/features/projects/components/ProjectFilters"
import { getProjects, getProjectFormMetadata } from "@/features/projects/services"
import { Plus, Archive, ShieldAlert } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function ProjectsPage({ searchParams }) {
  const params = await searchParams
  const search = params?.search || ""
  const categoryId = params?.categoryId || ""
  const status = params?.status || ""
  const page = parseInt(params?.page || "1", 10)
  const isArchived = params?.archive === "true"
  const limit = 10

  const [projectsResult, metadata] = await Promise.all([
    getProjects({
      search,
      categoryId,
      status,
      page,
      limit,
      showDeleted: isArchived,
    }),
    getProjectFormMetadata(),
  ])

  const activeFilters = {
    search,
    categoryId,
    status,
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <PageHeader
          title="Project Catalogues"
          description="Manage property development projects, builders, and parent specifications."
        />

        <div className="flex items-center gap-2">
          {/* Active / Archive Toggle */}

          {isArchived ? (
            <Link href="/admin/projects">
              <Button
                variant="outline"
                asChild
                className="border-neutral-200 hover:bg-neutral-50 h-10 text-xs font-semibold text-neutral-700 cursor-pointer"
              >
                <ShieldAlert className="h-4 w-4 mr-2 text-neutral-500" />
                Active Projects
              </Button>
            </Link>
          ) : (
            <Link href="/admin/projects?archive=true">
              <Button
                variant="outline"
                asChild
                className="border-neutral-200 hover:bg-neutral-50 h-10 text-xs font-semibold text-neutral-700 cursor-pointer"
              >
                <Archive className="h-4 w-4 mr-2 text-neutral-500" />
                Archived Projects
              </Button>
            </Link>
          )}


          <Link href="/admin/projects/create">
            <Button
              asChild
              className="bg-neutral-950 text-white hover:bg-neutral-800 h-10 text-xs font-semibold cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Add Project
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Filter & Listing Box */}
      <div className="bg-white rounded-lg border border-neutral-200 shadow-xs overflow-hidden">
        {/* Search Filter Panel */}
        <ProjectFilters
          metadata={metadata}
          initialFilters={activeFilters}
        />

        {/* Data Table */}
        <div className="p-6 pt-0">
          <ProjectTable
            projects={projectsResult.projects}
            showDeleted={isArchived}
          />
        </div>

        {/* Pagination */}
        {projectsResult.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-neutral-100 bg-white px-6 py-4">
            <div className="text-xs text-neutral-500">
              Showing{" "}
              <span className="font-semibold text-neutral-700">
                {(page - 1) * limit + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-neutral-700">
                {Math.min(page * limit, projectsResult.total)}
              </span>{" "}
              of <span className="font-semibold text-neutral-700">{projectsResult.total}</span>{" "}
              projects
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
                disabled={page >= projectsResult.totalPages}
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
  if (filters.status) query.set("status", filters.status)
  if (page > 1) query.set("page", page.toString())
  if (archive) query.set("archive", "true")

  const queryString = query.toString()
  const href = `/admin/projects${queryString ? `?${queryString}` : ""}`

  return (
    <Button variant="outline" size="sm" asChild className="text-xs h-8 text-neutral-700 border-neutral-200 hover:bg-neutral-50">
      <Link href={href}>{children}</Link>
    </Button>
  )
}
