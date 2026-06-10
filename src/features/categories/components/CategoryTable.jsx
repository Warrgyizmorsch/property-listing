"use client"

import React, { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Edit2, Archive, RotateCcw, Building } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import TableWrapper from "@/components/admin/TableWrapper"
import CategoryFormDialog from "./CategoryFormDialog"
import DeleteConfirmationModal from "./DeleteConfirmationModal"
import { softDeleteCategoryAction, restoreCategoryAction } from "../actions"
import { toast } from "@/components/ui/toast"

export default function CategoryTable({
  categories = [],
  showDeleted = false,
  onRefresh,
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // Modal / Dialog States
  const [editingCategory, setEditingCategory] = useState(null)
  const [deletingCategory, setDeletingCategory] = useState(null)

  const handleRestore = (category) => {
    startTransition(async () => {
      const result = await restoreCategoryAction(category.id)
      if (result.success) {
        toast.success(`Category "${category.name}" restored successfully.`)
        onRefresh?.()
      } else {
        toast.error(result.error || "Failed to restore category.")
      }
    })
  }

  const handleConfirmDelete = async () => {
    if (!deletingCategory) return

    startTransition(async () => {
      const result = await softDeleteCategoryAction(deletingCategory.id)
      if (result.success) {
        toast.success(`Category "${deletingCategory.name}" archived successfully.`)
        setDeletingCategory(null)
        onRefresh?.()
      } else {
        toast.error(result.error || "Failed to archive category.")
      }
    })
  }

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border border-dashed border-neutral-200 bg-white rounded-lg text-center">
        <Building className="h-10 w-10 text-neutral-300 mb-3" />
        <h3 className="text-sm font-semibold text-neutral-900">No categories found</h3>
        <p className="text-xs text-neutral-500 mt-1 max-w-sm">
          {showDeleted
            ? "There are no archived categories in the system."
            : "Get started by adding your first property classification category."}
        </p>
      </div>
    )
  }

  return (
    <>
      <TableWrapper>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold text-neutral-700">Category Name</TableHead>
              <TableHead className="font-semibold text-neutral-700">SEO Slug</TableHead>
              <TableHead className="font-semibold text-neutral-700">Active Properties</TableHead>
              <TableHead className="font-semibold text-neutral-700">Created Date</TableHead>
              <TableHead className="text-right font-semibold text-neutral-700">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id} className="hover:bg-neutral-50/50 transition-colors">
                <TableCell className="font-medium text-neutral-900 flex items-center gap-3">
                  {category.coverImage ? (
                    <img
                      src={category.coverImage}
                      alt={category.name}
                      className="h-8 w-8 rounded-md object-cover border border-neutral-250 shrink-0"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-md bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-400 shrink-0">
                      <Building className="h-4 w-4" />
                    </div>
                  )}
                  <span>{category.name}</span>
                </TableCell>
                <TableCell className="font-mono text-xs text-neutral-500">
                  {category.slug}
                </TableCell>
                <TableCell className="text-neutral-600">
                  <span className="inline-flex items-center rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-800">
                    {category._count?.properties ?? 0} properties
                  </span>
                </TableCell>
                <TableCell className="text-neutral-500 text-sm">
                  {new Date(category.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {!showDeleted ? (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingCategory(category)}
                          className="h-8 w-8 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
                        >
                          <Edit2 className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeletingCategory(category)}
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Archive className="h-4 w-4" />
                          <span className="sr-only">Archive</span>
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isPending}
                        onClick={() => handleRestore(category)}
                        className="flex items-center gap-1.5 h-8 text-neutral-700 border-neutral-200 hover:bg-neutral-50"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span>Restore</span>
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableWrapper>

      {/* Edit Form Dialog */}
      <CategoryFormDialog
        isOpen={!!editingCategory}
        onClose={() => setEditingCategory(null)}
        category={editingCategory}
        onSuccess={onRefresh}
      />

      {/* Delete/Archive Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={!!deletingCategory}
        onClose={() => setDeletingCategory(null)}
        onConfirm={handleConfirmDelete}
        isPending={isPending}
        title={`Archive ${deletingCategory?.name || "Category"}`}
        description={`Are you sure you want to archive "${deletingCategory?.name}"? You can restore it later if needed.`}
      />
    </>
  )
}
