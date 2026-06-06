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
import { cityFormSchema } from "../schemas"
import {
  getActiveCountriesAction,
  getActiveStatesAction,
  createCityAction,
  updateCityAction,
} from "../actions"
import { slugify } from "@/lib/slugify"
import { toast } from "@/components/ui/toast"

export default function CityFormDialog({
  isOpen,
  onClose,
  cityRecord = null,
  onSuccess,
}) {
  const [isPending, startTransition] = useTransition()
  const [manualSlug, setManualSlug] = useState(false)
  
  // Selection States
  const [countries, setCountries] = useState([])
  const [states, setStates] = useState([])
  const [selectedCountryId, setSelectedCountryId] = useState("")
  const [isLoadingCountries, setIsLoadingCountries] = useState(false)
  const [isLoadingStates, setIsLoadingStates] = useState(false)

  const isEdit = !!cityRecord

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(cityFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      stateId: "",
    },
  })

  const watchedName = watch("name")

  // Load all countries on open
  useEffect(() => {
    if (isOpen) {
      setIsLoadingCountries(true)
      getActiveCountriesAction().then((data) => {
        setCountries(data)
        setIsLoadingCountries(false)
      })
    }
  }, [isOpen])

  // Initialize form state
  useEffect(() => {
    if (isOpen) {
      if (cityRecord) {
        const countryId = cityRecord.state?.countryId || cityRecord.state?.country?.id || ""
        setSelectedCountryId(countryId)
        reset({
          name: cityRecord.name,
          slug: cityRecord.slug,
          stateId: cityRecord.stateId,
        })
        setManualSlug(true)
      } else {
        setSelectedCountryId("")
        reset({
          name: "",
          slug: "",
          stateId: "",
        })
        setManualSlug(false)
        setStates([])
      }
    }
  }, [isOpen, cityRecord, reset])

  // Load States dynamically when Country changes
  useEffect(() => {
    if (selectedCountryId) {
      setIsLoadingStates(true)
      getActiveStatesAction(selectedCountryId).then((data) => {
        setStates(data)
        setIsLoadingStates(false)
      })
    } else {
      setStates([])
    }
  }, [selectedCountryId])

  // Automatic slug generation
  useEffect(() => {
    if (!manualSlug && !isEdit && watchedName) {
      setValue("slug", slugify(watchedName), { shouldValidate: true })
    }
  }, [watchedName, manualSlug, isEdit, setValue])

  const onSubmit = (data) => {
    startTransition(async () => {
      let result
      if (isEdit) {
        result = await updateCityAction(cityRecord.id, data)
      } else {
        result = await createCityAction(data)
      }

      if (result.success) {
        toast.success(
          isEdit
            ? "City updated successfully."
            : "City created successfully."
        )
        onSuccess?.()
        onClose()
      } else {
        toast.error(result.error || "Failed to save city.")
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-neutral-900 font-bold tracking-tight text-lg">
            {isEdit ? "Edit City" : "Create City"}
          </DialogTitle>
          <DialogDescription className="text-neutral-500 text-sm mt-1">
            {isEdit
              ? "Modify city configurations and SEO slug parameters."
              : "Add a new city bottom-level tier linked to a state."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-4">
          {/* Country Selection */}
          <div className="space-y-2">
            <Label htmlFor="countrySelect" className="text-sm font-semibold text-neutral-700">
              Country
            </Label>
            <select
              id="countrySelect"
              value={selectedCountryId}
              onChange={(e) => {
                setSelectedCountryId(e.target.value)
                setValue("stateId", "") // Reset state field when country changes
              }}
              disabled={isPending || isLoadingCountries}
              className="flex w-full h-9 rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm outline-hidden focus:border-neutral-400 disabled:opacity-50 cursor-pointer"
            >
              <option value="">
                {isLoadingCountries ? "Loading countries..." : "Select Country..."}
              </option>
              {countries.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* State Selection (Dependent Dropdown) */}
          <div className="space-y-2">
            <Label htmlFor="stateId" className="text-sm font-semibold text-neutral-700">
              Parent State
            </Label>
            <select
              id="stateId"
              disabled={isPending || isLoadingStates || !selectedCountryId}
              className={`flex w-full h-9 rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm outline-hidden focus:border-neutral-400 disabled:opacity-50 cursor-pointer ${
                errors.stateId ? "border-red-500" : ""
              }`}
              {...register("stateId")}
            >
              <option value="">
                {!selectedCountryId
                  ? "Select a Country first..."
                  : isLoadingStates
                  ? "Loading states..."
                  : "Select State..."}
              </option>
              {states.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            {errors.stateId && (
              <p className="text-xs font-medium text-red-500 mt-1">
                {errors.stateId.message}
              </p>
            )}
          </div>

          {/* City Name Input */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold text-neutral-700">
              City Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="e.g. Manhattan, Toronto"
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
              placeholder="e.g. manhattan, toronto"
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
              {isPending ? "Saving..." : isEdit ? "Save Changes" : "Create City"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
