"use client"

import React, { useEffect, useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { UploadCloud, Loader2, Trash2 } from "lucide-react"
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
  getCityUploadSignatureAction,
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
  const [isUploading, setIsUploading] = useState(false)
  
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
      coverImage: "",
    },
  })

  const watchedName = watch("name")
  const watchedCoverImage = watch("coverImage")

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
          coverImage: cityRecord.coverImage || "",
        })
        setManualSlug(true)
      } else {
        setSelectedCountryId("")
        reset({
          name: "",
          slug: "",
          stateId: "",
          coverImage: "",
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

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const signatureResult = await getCityUploadSignatureAction()
      if (!signatureResult.success) {
        throw new Error(signatureResult.error || "Failed to fetch secure signature.")
      }

      const { credentials, folder } = signatureResult

      const formData = new FormData()
      formData.append("file", file)
      formData.append("api_key", credentials.apiKey)
      formData.append("timestamp", credentials.timestamp)
      formData.append("signature", credentials.signature)
      formData.append("folder", folder)

      const endpoint = `https://api.cloudinary.com/v1_1/${credentials.cloudName}/image/upload`

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Direct Cloudinary upload request failed.")
      }

      const uploadData = await response.json()
      setValue("coverImage", uploadData.secure_url, { shouldValidate: true })
      toast.success("City cover image uploaded securely.")
    } catch (err) {
      console.error(err)
      toast.error(`Upload error: ${err.message}`)
    } finally {
      setIsUploading(false)
    }
  }

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
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
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

          {/* Cover Image Upload */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-neutral-700">
              City Cover Image
            </Label>
            
            {watchedCoverImage ? (
              <div className="relative rounded-lg border border-neutral-200 overflow-hidden bg-neutral-50 h-32 flex items-center justify-center group">
                <img
                  src={watchedCoverImage}
                  alt="City Cover Preview"
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-102"
                />
                <button
                  type="button"
                  onClick={() => setValue("coverImage", "", { shouldValidate: true })}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-red-650/90 text-white hover:bg-red-700 hover:scale-110 transition-all shadow-md cursor-pointer border-none flex items-center justify-center"
                  title="Remove Image"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-neutral-200 rounded-lg p-5 text-center cursor-pointer hover:bg-neutral-50/50 hover:border-neutral-300 transition-all duration-200 min-h-[128px]">
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageUpload}
                  disabled={isUploading || isPending}
                  className="hidden"
                />
                {isUploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 text-neutral-800 animate-spin" />
                    <span className="text-xs font-semibold text-neutral-500 font-medium">Uploading to Cloudinary...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <UploadCloud className="h-8 w-8 text-neutral-400 mb-2" />
                    <span className="text-xs font-bold text-neutral-900">Upload Cover Image</span>
                    <span className="text-[10px] text-neutral-400 mt-1 font-medium">Supports JPG, PNG, WEBP (Max 5MB)</span>
                  </div>
                )}
              </label>
            )}
            {errors.coverImage && (
              <p className="text-xs font-medium text-red-500 mt-1">
                {errors.coverImage.message}
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
