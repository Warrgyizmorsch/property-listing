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
import { countryFormSchema } from "../schemas"
import { createCountryAction, updateCountryAction } from "../actions"
import { slugify } from "@/lib/slugify"
import { toast } from "@/components/ui/toast"

export default function CountryFormDialog({
  isOpen,
  onClose,
  country = null,
  onSuccess,
}) {
  const [isPending, startTransition] = useTransition()
  const [manualSlug, setManualSlug] = useState(false)

  const isEdit = !!country

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(countryFormSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  })

  const watchedName = watch("name")

  useEffect(() => {
    if (isOpen) {
      if (country) {
        reset({
          name: country.name,
          slug: country.slug,
        })
        setManualSlug(true)
      } else {
        reset({
          name: "",
          slug: "",
        })
        setManualSlug(false)
      }
    }
  }, [isOpen, country, reset])

  useEffect(() => {
    if (!manualSlug && !isEdit && watchedName) {
      setValue("slug", slugify(watchedName), { shouldValidate: true })
    }
  }, [watchedName, manualSlug, isEdit, setValue])

  const onSubmit = (data) => {
    startTransition(async () => {
      let result
      if (isEdit) {
        result = await updateCountryAction(country.id, data)
      } else {
        result = await createCountryAction(data)
      }

      if (result.success) {
        toast.success(
          isEdit
            ? "Country updated successfully."
            : "Country created successfully."
        )
        onSuccess?.()
        onClose()
      } else {
        toast.error(result.error || "Failed to save country.")
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-neutral-900 font-bold tracking-tight text-lg">
            {isEdit ? "Edit Country" : "Create Country"}
          </DialogTitle>
          <DialogDescription className="text-neutral-500 text-sm mt-1">
            {isEdit
              ? "Modify the name or URL slug of this country."
              : "Add a new top-level country for location directory tracking."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold text-neutral-700">
              Country Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="e.g. United States, Canada"
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
              placeholder="e.g. united-states, canada"
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
              {isPending ? "Saving..." : isEdit ? "Save Changes" : "Create Country"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
