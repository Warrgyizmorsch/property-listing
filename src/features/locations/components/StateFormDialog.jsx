"use client"

import React, { useEffect, useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { stateFormSchema } from "../schemas"
import { getActiveCountriesAction, createStateAction, updateStateAction } from "../actions"
import { slugify } from "@/lib/slugify"
import { toast } from "@/components/ui/toast"

export default function StateFormDialog({
  isOpen,
  onClose,
  stateRecord = null,
  onSuccess,
}) {
  const [isPending, startTransition] = useTransition()
  const [manualSlug, setManualSlug] = useState(false)
  
  // Countries list for parent selection
  const [countries, setCountries] = useState([])
  const [isLoadingCountries, setIsLoadingCountries] = useState(false)

  const isEdit = !!stateRecord

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(stateFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      countryId: "",
    },
  })

  const watchedName = watch("name")

  // Load countries when dialog opens
  useEffect(() => {
    if (isOpen) {
      setIsLoadingCountries(true)
      getActiveCountriesAction().then((data) => {
        setCountries(data)
        setIsLoadingCountries(false)
      })
    }
  }, [isOpen])

  // Reset values when record changes or dialog opens
  useEffect(() => {
    if (isOpen) {
      if (stateRecord) {
        reset({
          name: stateRecord.name,
          slug: stateRecord.slug,
          countryId: stateRecord.countryId,
        })
        setManualSlug(true)
      } else {
        reset({
          name: "",
          slug: "",
          countryId: "",
        })
        setManualSlug(false)
      }
    }
  }, [isOpen, stateRecord, reset])

  useEffect(() => {
    if (!manualSlug && !isEdit && watchedName) {
      setValue("slug", slugify(watchedName), { shouldValidate: true })
    }
  }, [watchedName, manualSlug, isEdit, setValue])

  const onSubmit = (data) => {
    startTransition(async () => {
      let result
      if (isEdit) {
        result = await updateStateAction(stateRecord.id, data)
      } else {
        result = await createStateAction(data)
      }

      if (result.success) {
        toast.success(
          isEdit
            ? "State updated successfully."
            : "State created successfully."
        )
        onSuccess?.()
        onClose()
      } else {
        toast.error(result.error || "Failed to save state.")
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-neutral-900 font-bold tracking-tight text-lg">
            {isEdit ? "Edit State" : "Create State"}
          </DialogTitle>
          <DialogDescription className="text-neutral-500 text-sm mt-1">
            {isEdit
              ? "Modify state configurations and SEO slug."
              : "Add a new state mid-level tier linked to a country."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-4">
          {/* Country Select Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="countryId" className="text-sm font-semibold text-neutral-700">
              Parent Country
            </Label>
            <select
              id="countryId"
              disabled={isPending || isLoadingCountries}
              className={`flex w-full h-9 rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm outline-hidden focus:border-neutral-400 disabled:opacity-50 cursor-pointer ${
                errors.countryId ? "border-red-500" : ""
              }`}
              {...register("countryId")}
            >
              <option value="">
                {isLoadingCountries ? "Loading countries..." : "Select parent country..."}
              </option>
              {countries.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.countryId && (
              <p className="text-xs font-medium text-red-500 mt-1">
                {errors.countryId.message}
              </p>
            )}
          </div>

          {/* State Name Input */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold text-neutral-700">
              State Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="e.g. New York, Ontario"
              className={errors.name ? "border-red-500 focus-visible:ring-red-400" : ""}
              disabled={isPending}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs font-medium text-red-500 mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Slug URL Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="slug" className="text-sm font-semibold text-neutral-700">
                SEO Slug URL
              </Label>
              {!isEdit && (
                <label className="flex items-center gap-1.5 text-xs text-neutral-500 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={manualSlug}
                    onChange={(e) => setManualSlug(e.target.checked)}
                    className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-500"
                    disabled={isPending}
                  />
                  <span>Manual Slug Override</span>
                </label>
              )}
            </div>
            <Input
              id="slug"
              type="text"
              placeholder="e.g. new-york, ontario"
              className={errors.slug ? "border-red-500 focus-visible:ring-red-400" : ""}
              disabled={isPending || (!manualSlug && !isEdit)}
              {...register("slug")}
            />
            {errors.slug && (
              <p className="text-xs font-medium text-red-500 mt-1">
                {errors.slug.message}
              </p>
            )}
            {!manualSlug && !isEdit && (
              <p className="text-[11px] text-neutral-400">
                Auto-generated based on name.
              </p>
            )}
          </div>

          <DialogFooter className="pt-4 flex flex-col sm:flex-row justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="w-full sm:w-auto bg-primary text-white hover:bg-primary/90"
            >
              {isPending ? "Saving..." : isEdit ? "Save Changes" : "Create State"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
