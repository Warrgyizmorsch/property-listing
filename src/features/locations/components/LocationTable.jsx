"use client"

import React, { useState, useTransition } from "react"
import { Edit2, Archive, RotateCcw, MapPin } from "lucide-react"
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
import CountryFormDialog from "./CountryFormDialog"
import StateFormDialog from "./StateFormDialog"
import CityFormDialog from "./CityFormDialog"
import DeleteConfirmationModal from "@/features/categories/components/DeleteConfirmationModal"
import {
  softDeleteCountryAction,
  restoreCountryAction,
  softDeleteStateAction,
  restoreStateAction,
  softDeleteCityAction,
  restoreCityAction,
} from "../actions"
import { toast } from "@/components/ui/toast"

export default function LocationTable({
  data = [],
  tab = "countries",
  showDeleted = false,
  onRefresh,
}) {
  const [isPending, startTransition] = useTransition()

  // Edit dialog state
  const [editRecord, setEditRecord] = useState(null)
  
  // Archive confirmation dialog state
  const [deleteRecord, setDeleteRecord] = useState(null)

  const handleRestore = (record) => {
    startTransition(async () => {
      let result
      if (tab === "countries") result = await restoreCountryAction(record.id)
      else if (tab === "states") result = await restoreStateAction(record.id)
      else result = await restoreCityAction(record.id)

      if (result.success) {
        toast.success(`"${record.name}" restored successfully.`)
        onRefresh?.()
      } else {
        toast.error(result.error || "Failed to restore location.")
      }
    })
  }

  const handleConfirmDelete = () => {
    if (!deleteRecord) return

    startTransition(async () => {
      let result
      if (tab === "countries") result = await softDeleteCountryAction(deleteRecord.id)
      else if (tab === "states") result = await softDeleteStateAction(deleteRecord.id)
      else result = await softDeleteCityAction(deleteRecord.id)

      if (result.success) {
        toast.success(`"${deleteRecord.name}" archived successfully.`)
        setDeleteRecord(null)
        onRefresh?.()
      } else {
        toast.error(result.error || "Failed to archive location.")
      }
    })
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border border-dashed border-neutral-200 bg-white rounded-lg text-center">
        <MapPin className="h-10 w-10 text-neutral-300 mb-3" />
        <h3 className="text-sm font-semibold text-neutral-900">No locations found</h3>
        <p className="text-xs text-neutral-500 mt-1 max-w-sm">
          {showDeleted
            ? `There are no archived ${tab} in the system.`
            : `Add your first ${tab.substring(0, tab.length - 1)} to populate the directory layout.`}
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
              <TableHead className="font-semibold text-neutral-700">Name</TableHead>
              <TableHead className="font-semibold text-neutral-700">SEO Slug</TableHead>
              {tab === "states" && (
                <TableHead className="font-semibold text-neutral-700">Country</TableHead>
              )}
              {tab === "cities" && (
                <TableHead className="font-semibold text-neutral-700">State / Country</TableHead>
              )}
              <TableHead className="font-semibold text-neutral-700">
                {tab === "countries" && "Active States"}
                {tab === "states" && "Active Cities"}
                {tab === "cities" && "Properties"}
              </TableHead>
              <TableHead className="font-semibold text-neutral-700">Created Date</TableHead>
              <TableHead className="text-right font-semibold text-neutral-700">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((record) => (
              <TableRow key={record.id} className="hover:bg-neutral-50/50 transition-colors">
                <TableCell className="font-medium text-neutral-900 flex items-center gap-3">
                  {tab === "cities" && (
                    record.coverImage ? (
                      <img
                        src={record.coverImage}
                        alt={record.name}
                        className="h-8 w-8 rounded-md object-cover border border-neutral-250 shrink-0"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-md bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-400 shrink-0">
                        <MapPin className="h-4 w-4" />
                      </div>
                    )
                  )}
                  <span>{record.name}</span>
                </TableCell>
                <TableCell className="font-mono text-xs text-neutral-500">{record.slug}</TableCell>
                {tab === "states" && (
                  <TableCell className="text-neutral-600">{record.country?.name || "Unknown"}</TableCell>
                )}
                {tab === "cities" && (
                  <TableCell className="text-neutral-600 text-sm">
                    {record.state?.name || "Unknown"}
                    <span className="text-xs text-neutral-400 font-light block">
                      {record.state?.country?.name || ""}
                    </span>
                  </TableCell>
                )}
                <TableCell className="text-neutral-600">
                  <span className="inline-flex items-center rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-800">
                    {tab === "countries" && `${record._count?.states ?? 0} states`}
                    {tab === "states" && `${record._count?.cities ?? 0} cities`}
                    {tab === "cities" && `${record._count?.properties ?? 0} properties`}
                  </span>
                </TableCell>
                <TableCell className="text-neutral-500 text-sm">
                  {new Date(record.createdAt).toLocaleDateString("en-US", {
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
                          onClick={() => setEditRecord(record)}
                          className="h-8 w-8 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
                        >
                          <Edit2 className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteRecord(record)}
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
                        onClick={() => handleRestore(record)}
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

      {/* Edit Modals depending on current tab */}
      {tab === "countries" && (
        <CountryFormDialog
          isOpen={!!editRecord}
          onClose={() => setEditRecord(null)}
          country={editRecord}
          onSuccess={onRefresh}
        />
      )}
      {tab === "states" && (
        <StateFormDialog
          isOpen={!!editRecord}
          onClose={() => setEditRecord(null)}
          stateRecord={editRecord}
          onSuccess={onRefresh}
        />
      )}
      {tab === "cities" && (
        <CityFormDialog
          isOpen={!!editRecord}
          onClose={() => setEditRecord(null)}
          cityRecord={editRecord}
          onSuccess={onRefresh}
        />
      )}

      {/* Reusable Delete Modal */}
      <DeleteConfirmationModal
        isOpen={!!deleteRecord}
        onClose={() => setDeleteRecord(null)}
        onConfirm={handleConfirmDelete}
        isPending={isPending}
        title={`Archive ${deleteRecord?.name || "Location"}`}
        description={`Are you sure you want to archive "${deleteRecord?.name}"? You can restore it later if its parent structures remain active.`}
      />
    </>
  )
}
