"use client"

import React, { useState, useTransition } from "react"
import Link from "next/link"
import { Edit2, Archive, RotateCcw, FolderOpen, Image as ImageIcon, Eye, MapPin, Building2, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import DeleteConfirmationModal from "@/features/categories/components/DeleteConfirmationModal"
import {
  softDeleteProjectAction,
  restoreProjectAction,
} from "../actions"
import { toast } from "@/components/ui/toast"

export default function ProjectTable({
  projects = [],
  showDeleted = false,
}) {
  const [isPending, startTransition] = useTransition()
  const [deletingProject, setDeletingProject] = useState(null)

  const handleRestore = (id, projectName) => {
    startTransition(async () => {
      const result = await restoreProjectAction(id)
      if (result.success) {
        toast.success(`"${projectName}" restored successfully.`)
      } else {
        toast.error(result.error || "Failed to restore project.")
      }
    })
  }

  const handleConfirmDelete = () => {
    if (!deletingProject) return

    startTransition(async () => {
      const result = await softDeleteProjectAction(deletingProject.id)
      if (result.success) {
        toast.success(`"${deletingProject.projectName}" archived successfully.`)
        setDeletingProject(null)
      } else {
        toast.error(result.error || "Failed to archive project.")
      }
    })
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "ONGOING":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "COMPLETED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200"
      case "UPCOMING":
        return "bg-amber-50 text-amber-700 border-amber-200"
      default:
        return "bg-slate-50 text-slate-700 border-slate-200"
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case "ONGOING":
        return "Ongoing"
      case "COMPLETED":
        return "Completed"
      case "UPCOMING":
        return "Upcoming"
      default:
        return status
    }
  }

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 border border-dashed border-slate-200 bg-white rounded-2xl text-center shadow-xs">
        <FolderOpen className="h-12 w-12 text-slate-300 mb-4" />
        <h3 className="text-base font-bold text-slate-900">No projects found</h3>
        <p className="text-sm text-slate-500 mt-2 max-w-sm">
          {showDeleted
            ? "There are no archived projects in the system."
            : "Click 'Add Project' to create your first real estate project catalog entries."}
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => {
          // Compute properties metrics
          const totalProps = project.properties?.length || 0
          const availableProps = project.properties?.filter(p => p.status?.name === "Available").length || 0
          const progressPercent = totalProps > 0 ? (availableProps / totalProps) * 100 : 0
          const coverImage = project.mainImage || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800"

          return (
            <div
              key={project.id}
              className="group bg-white border border-slate-200/80 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              {/* Cover Image Container */}
              <div className="relative aspect-video overflow-hidden bg-slate-100">
                <img
                  src={coverImage}
                  alt={project.projectName}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />

                {/* Floating Status Badge */}
                <div className="absolute top-3 right-3">
                  <span className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-semibold shadow-xs ${getStatusBadgeClass(project.status)}`}>
                    {getStatusLabel(project.status)}
                  </span>
                </div>

                {/* Floating Featured Badge */}
                {project.isFeatured && (
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1 rounded-lg bg-amber-500 text-white px-2.5 py-1 text-xs font-semibold shadow-sm">
                      <Star className="h-3 w-3 fill-white" />
                      Featured
                    </span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  {/* Category Name */}
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                    {project.category?.name || "Uncategorized"}
                  </span>

                  {/* Project Name */}
                  <h3 className="text-lg font-bold text-slate-900 mt-3 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {project.projectName}
                  </h3>

                  {/* Builder Name */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <Building2 className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <span className="truncate font-medium">{project.builderName || "No Builder Details"}</span>
                  </div>

                  {/* Location cascading address */}
                  <div className="flex items-start gap-1.5 text-xs text-slate-600 mt-3.5">
                    <MapPin className="h-4 w-4 shrink-0 text-slate-400 mt-0.5" />
                    <div className="line-clamp-2 leading-relaxed">
                      <span className="font-semibold block text-slate-800">
                        {project.city?.name || "Unknown Location"}
                      </span>
                      <span className="text-slate-400 text-[11px]">
                        {project.city?.state?.name ? `${project.city.state.name}, ` : ""}
                        {project.city?.state?.country?.name || ""}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Inventory Properties Stats */}
                <div className="mt-6 border-t border-slate-100 pt-4">
                  <div className="flex items-center justify-between text-xs font-semibold mb-2">
                    <span className="text-slate-500">Available Units</span>
                    <span className="text-slate-900 font-bold">
                      {availableProps} / {totalProps} properties
                    </span>
                  </div>

                  {totalProps > 0 ? (
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${availableProps === 0
                            ? "bg-red-500"
                            : availableProps < 3
                              ? "bg-amber-500"
                              : "bg-indigo-600"
                          }`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  ) : (
                    <div className="text-[10px] text-slate-400 font-medium italic">
                      No property units listed under this project yet.
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="bg-slate-50/50 border-t border-slate-100 p-4 flex items-center justify-between gap-2">
                {!showDeleted ? (
                  <>
                    <div className="flex gap-1.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="h-8 w-8 text-slate-500 hover:text-slate-950 hover:bg-slate-100 rounded-lg cursor-pointer"
                        title="View Project Detail"
                      >
                        <Link href={`/admin/projects/${project.id}`}>
                          <Eye className="h-4.5 w-4.5" />
                        </Link>
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="h-8 w-8 text-slate-500 hover:text-slate-950 hover:bg-slate-100 rounded-lg cursor-pointer"
                        title="Edit Project"
                      >
                        <Link href={`/admin/projects/${project.id}/edit`}>
                          <Edit2 className="h-4 w-4" />
                        </Link>
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="h-8 w-8 text-slate-500 hover:text-slate-950 hover:bg-slate-100 rounded-lg cursor-pointer"
                        title="Gallery Photos"
                      >
                        <Link href={`/admin/projects/${project.id}/images`}>
                          <ImageIcon className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeletingProject(project)}
                      className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer"
                      title="Archive Project"
                    >
                      <Archive className="h-4.5 w-4.5" />
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isPending}
                    onClick={() => handleRestore(project.id, project.projectName)}
                    className="flex items-center gap-1.5 h-8 text-xs font-semibold text-slate-700 border-slate-200 hover:bg-slate-50 rounded-lg cursor-pointer w-full justify-center"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Restore Project</span>
                  </Button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Delete/Archive confirmation modal */}
      <DeleteConfirmationModal
        isOpen={!!deletingProject}
        onClose={() => setDeletingProject(null)}
        onConfirm={handleConfirmDelete}
        isPending={isPending}
        title={`Archive ${deletingProject?.projectName || "Project"}`}
        description={`Are you sure you want to archive "${deletingProject?.projectName}"? You can restore it later.`}
      />
    </>
  )
}
