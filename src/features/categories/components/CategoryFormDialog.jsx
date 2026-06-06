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
import { categoryFormSchema } from "../schemas"
import { createCategoryAction, updateCategoryAction } from "../actions"
import { slugify } from "@/lib/slugify"
import { toast } from "@/components/ui/toast"

export default function CategoryFormDialog({
  isOpen,
  onClose,
  category = null,
  onSuccess,
}) {
  const [isPending, startTransition] = useTransition()
  const [manualSlug, setManualSlug] = useState(false)

  const isEdit = !!category

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  })

  // Watch the name input to auto-generate slug
  const watchedName = watch("name")

  // Reset form and manualSlug state when dialog opens or category changes
  useEffect(() => {
    if (isOpen) {
      if (category) {
        reset({
          name: category.name,
          slug: category.slug,
        })
        setManualSlug(true) // Editing usually means they want to retain or manually adjust slug
      } else {
        reset({
          name: "",
          slug: "",
        })
        setManualSlug(false)
      }
    }
  }, [isOpen, category, reset])

  // Generate slug automatically when name changes (unless manual override is checked)
  useEffect(() => {
    if (!manualSlug && !isEdit && watchedName) {
      setValue("slug", slugify(watchedName), { shouldValidate: true })
    }
  }, [watchedName, manualSlug, isEdit, setValue])

  const onSubmit = (data) => {
    startTransition(async () => {
      let result
      if (isEdit) {
        result = await updateCategoryAction(category.id, data)
      } else {
        result = await createCategoryAction(data)
      }

      if (result.success) {
        toast.success(
          isEdit
            ? "Category updated successfully."
            : "Category created successfully."
        )
        onSuccess?.()
        onClose()
      } else {
        toast.error(result.error || "Failed to save category.")
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-neutral-900 font-bold tracking-tight text-lg">
            {isEdit ? "Edit Category" : "Create Category"}
          </DialogTitle>
          <DialogDescription className="text-neutral-500 text-sm mt-1">
            {isEdit
              ? "Modify the name or URL slug of this property classification category."
              : "Add a new category classification for property listings."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold text-neutral-700">
              Category Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="e.g. Apartments, Commercial"
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
              placeholder="e.g. apartments, office-spaces"
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
              className="w-full sm:w-auto bg-neutral-950 text-white hover:bg-neutral-800"
            >
              {isPending ? "Saving..." : isEdit ? "Save Changes" : "Create Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
