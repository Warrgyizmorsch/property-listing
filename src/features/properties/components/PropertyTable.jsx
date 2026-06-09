"use client"

import React, { useState, useTransition } from "react"
import Link from "next/link"
import { Edit2, Archive, RotateCcw, Building2, Check, Star, Image } from "lucide-react"
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
import PropertyStatusBadge from "./PropertyStatusBadge"
import DeleteConfirmationModal from "@/features/categories/components/DeleteConfirmationModal"
import {
  softDeletePropertyAction,
  restorePropertyAction,
  togglePropertyFeaturedAction,
  changePropertyStatusAction,
} from "../actions"
import { toast } from "@/components/ui/toast"
import { formatCurrency } from "@/lib/format"

export default function PropertyTable({
  properties = [],
  statuses = [],
  showDeleted = false,
}) {
  const [isPending, startTransition] = useTransition()
  
  // Archive state modal
  const [deletingProperty, setDeletingProperty] = useState(null)

  const handleFeaturedToggle = (id) => {
    startTransition(async () => {
      const result = await togglePropertyFeaturedAction(id)
      if (result.success) {
        toast.success("Property featured status updated.")
      } else {
        toast.error(result.error || "Failed to update featured status.")
      }
    })
  }

  const handleStatusChange = (id, newStatusId) => {
    startTransition(async () => {
      const result = await changePropertyStatusAction(id, newStatusId)
      if (result.success) {
        toast.success("Property status updated successfully.")
      } else {
        toast.error(result.error || "Failed to update property status.")
      }
    })
  }

  const handleRestore = (id, title) => {
    startTransition(async () => {
      const result = await restorePropertyAction(id)
      if (result.success) {
        toast.success(`"${title}" restored successfully.`)
      } else {
        toast.error(result.error || "Failed to restore property.")
      }
    })
  }

  const handleConfirmDelete = () => {
    if (!deletingProperty) return

    startTransition(async () => {
      const result = await softDeletePropertyAction(deletingProperty.id)
      if (result.success) {
        toast.success(`"${deletingProperty.title}" archived successfully.`)
        setDeletingProperty(null)
      } else {
        toast.error(result.error || "Failed to archive property.")
      }
    })
  }

  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border border-dashed border-neutral-200 bg-white rounded-lg text-center">
        <Building2 className="h-10 w-10 text-neutral-300 mb-3" />
        <h3 className="text-sm font-semibold text-neutral-900">No properties found</h3>
        <p className="text-xs text-neutral-500 mt-1 max-w-sm">
          {showDeleted
            ? "There are no archived properties in the system."
            : "Click 'Publish Property' to list your first property directory entry."}
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
              <TableHead className="font-semibold text-neutral-700">Property</TableHead>
              <TableHead className="font-semibold text-neutral-700">Category</TableHead>
              <TableHead className="font-semibold text-neutral-700">Project</TableHead>
              <TableHead className="font-semibold text-neutral-700">Location</TableHead>
              <TableHead className="font-semibold text-neutral-700">Price</TableHead>
              <TableHead className="font-semibold text-neutral-700">Purpose</TableHead>
              <TableHead className="font-semibold text-neutral-700">Featured</TableHead>
              <TableHead className="font-semibold text-neutral-700">Status</TableHead>
              <TableHead className="font-semibold text-neutral-700">Created Date</TableHead>
              <TableHead className="text-right font-semibold text-neutral-700">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {properties.map((property) => (
              <TableRow key={property.id} className="hover:bg-neutral-50/50 transition-colors">
                {/* Title */}
                <TableCell className="font-medium text-neutral-900 max-w-[200px]">
                  <div className="truncate font-semibold">{property.title}</div>
                  <div className="text-xs text-neutral-400 font-mono truncate">{property.slug}</div>
                </TableCell>

                {/* Category */}
                <TableCell className="text-neutral-600 text-sm">
                  {property.category?.name || "Uncategorized"}
                </TableCell>

                {/* Project */}
                <TableCell className="text-neutral-600 text-sm font-semibold max-w-[150px] truncate">
                  {property.project?.projectName || <span className="text-red-500 italic">No Project</span>}
                </TableCell>

                {/* Location */}
                <TableCell className="text-neutral-600 text-sm max-w-[150px]">
                  <div className="truncate font-medium">{property.city?.name || "Unknown"}</div>
                  <div className="text-xs text-neutral-400 truncate">
                    {property.city?.state?.name || ""}, {property.city?.state?.country?.name || ""}
                  </div>
                </TableCell>

                {/* Price */}
                <TableCell className="text-neutral-900 font-bold text-sm">
                  {/* formatCurrency handles decimals and currency symbols */}
                  {formatCurrency ? formatCurrency(property.price) : `$${Number(property.price).toLocaleString()}`}
                </TableCell>

                {/* Purpose */}
                <TableCell className="text-neutral-600 text-sm">
                  <span className="inline-flex items-center rounded-md bg-neutral-50 px-2 py-1 text-xs font-semibold text-neutral-600 ring-1 ring-inset ring-neutral-500/10">
                    {property.purpose?.name || "None"}
                  </span>
                </TableCell>

                {/* Featured Checkbox toggle */}
                <TableCell>
                  {!showDeleted ? (
                    <button
                      onClick={() => handleFeaturedToggle(property.id)}
                      disabled={isPending}
                      className={`p-1 rounded-md transition-colors cursor-pointer outline-hidden hover:bg-neutral-100 ${
                        property.isFeatured ? "text-amber-500" : "text-neutral-300"
                      }`}
                    >
                      <Star className={`h-4.5 w-4.5 ${property.isFeatured ? "fill-amber-500" : ""}`} />
                      <span className="sr-only">Toggle Featured</span>
                    </button>
                  ) : (
                    <span className="text-xs text-neutral-400">
                      {property.isFeatured ? "Yes" : "No"}
                    </span>
                  )}
                </TableCell>

                {/* Status Dropdown / Badge */}
                <TableCell>
                  {!showDeleted && statuses.length > 0 ? (
                    <div className="relative w-fit">
                      <select
                        value={property.statusId}
                        onChange={(e) => handleStatusChange(property.id, e.target.value)}
                        disabled={isPending}
                        className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                      >
                        {statuses.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                      <PropertyStatusBadge status={property.status} />
                    </div>
                  ) : (
                    <PropertyStatusBadge status={property.status} />
                  )}
                </TableCell>

                {/* Created Date */}
                <TableCell className="text-neutral-500 text-sm">
                  {new Date(property.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {!showDeleted ? (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                          className="h-8 w-8 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
                        >
                          <Link href={`/admin/properties/${property.id}/edit`}>
                            <Edit2 className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                          className="h-8 w-8 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
                        >
                          <Link href={`/admin/properties/${property.id}/images`}>
                            <Image className="h-4 w-4" />
                            <span className="sr-only">Manage Images</span>
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeletingProperty(property)}
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
                        onClick={() => handleRestore(property.id, property.title)}
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

      {/* Archive Confirmation dialog */}
      <DeleteConfirmationModal
        isOpen={!!deletingProperty}
        onClose={() => setDeletingProperty(null)}
        onConfirm={handleConfirmDelete}
        isPending={isPending}
        title={`Archive ${deletingProperty?.title || "Property"}`}
        description={`Are you sure you want to archive "${deletingProperty?.title}"? You can restore it later.`}
      />
    </>
  )
}
