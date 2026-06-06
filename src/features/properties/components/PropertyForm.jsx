"use client"

import React, { useEffect, useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { propertyFormSchema } from "../schemas"
import { createPropertyAction, updatePropertyAction } from "../actions"
import { getActiveStatesAction, getActiveCitiesAction } from "@/features/locations/actions"
import { slugify } from "@/lib/slugify"
import { toast } from "@/components/ui/toast"

export default function PropertyForm({ property = null, metadata = {} }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [manualSlug, setManualSlug] = useState(false)

  // Cascading Location States
  const [states, setStates] = useState([])
  const [cities, setCities] = useState([])
  const [selectedCountryId, setSelectedCountryId] = useState("")
  const [selectedStateId, setSelectedStateId] = useState("")
  const [isLoadingStates, setIsLoadingStates] = useState(false)
  const [isLoadingCities, setIsLoadingCities] = useState(false)

  const isEdit = !!property

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      price: "",
      address: "",
      bedrooms: 0,
      bathrooms: 0,
      areaSize: "",
      contactNumber: "",
      categoryId: "",
      purposeId: "",
      statusId: "",
      cityId: "",
      isFeatured: false,
    },
  })

  const watchedTitle = watch("title")

  // Sync / load form states on mounting/editing
  useEffect(() => {
    if (property) {
      const countryId = property.city?.state?.countryId || ""
      const stateId = property.city?.stateId || ""
      const cityId = property.cityId || ""

      setSelectedCountryId(countryId)
      setSelectedStateId(stateId)

      if (countryId) {
        setIsLoadingStates(true)
        getActiveStatesAction(countryId).then((data) => {
          setStates(data)
          setIsLoadingStates(false)
        })
      }
      if (stateId) {
        setIsLoadingCities(true)
        getActiveCitiesAction(stateId).then((data) => {
          setCities(data)
          setIsLoadingCities(false)
        })
      }

      reset({
        title: property.title,
        slug: property.slug,
        description: property.description,
        price: Number(property.price),
        address: property.address,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        areaSize: property.areaSize,
        contactNumber: property.contactNumber || "",
        categoryId: property.categoryId,
        purposeId: property.purposeId,
        statusId: property.statusId,
        cityId: property.cityId,
        isFeatured: property.isFeatured,
      })
      setManualSlug(true)
    } else {
      reset({
        title: "",
        slug: "",
        description: "",
        price: "",
        address: "",
        bedrooms: 0,
        bathrooms: 0,
        areaSize: "",
        contactNumber: "",
        categoryId: "",
        purposeId: "",
        statusId: "",
        cityId: "",
        isFeatured: false,
      })
      setManualSlug(false)
      setSelectedCountryId("")
      setSelectedStateId("")
      setStates([])
      setCities([])
    }
  }, [property, reset])

  // Handle auto slugification
  useEffect(() => {
    if (!manualSlug && !isEdit && watchedTitle) {
      setValue("slug", slugify(watchedTitle), { shouldValidate: true })
    }
  }, [watchedTitle, manualSlug, isEdit, setValue])

  // Handle Country Change
  const handleCountryChange = (e) => {
    const countryId = e.target.value
    setSelectedCountryId(countryId)
    setSelectedStateId("")
    setStates([])
    setCities([])
    setValue("cityId", "") // Reset city in form

    if (countryId) {
      setIsLoadingStates(true)
      getActiveStatesAction(countryId).then((data) => {
        setStates(data)
        setIsLoadingStates(false)
      })
    }
  }

  // Handle State Change
  const handleStateChange = (e) => {
    const stateId = e.target.value
    setSelectedStateId(stateId)
    setCities([])
    setValue("cityId", "") // Reset city in form

    if (stateId) {
      setIsLoadingCities(true)
      getActiveCitiesAction(stateId).then((data) => {
        setCities(data)
        setIsLoadingCities(false)
      })
    }
  }

  const onSubmit = (data) => {
    startTransition(async () => {
      let result
      if (isEdit) {
        result = await updatePropertyAction(property.id, data)
      } else {
        result = await createPropertyAction(data)
      }

      if (result.success) {
        toast.success(
          isEdit
            ? "Property listing updated successfully."
            : "Property listing created successfully."
        )
        router.push("/admin/properties")
        router.refresh()
      } else {
        toast.error(result.error || "Failed to save property listing.")
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white border border-neutral-200 rounded-lg p-6 shadow-xs">
      
      {/* 1. Basic Details Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400">Basic Details</h3>
        <hr className="border-neutral-100" />
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-semibold text-neutral-700">Property Title</Label>
            <Input
              id="title"
              type="text"
              placeholder="e.g. Luxury 3 Bedroom Penthouse"
              disabled={isPending}
              className={errors.title ? "border-red-500" : ""}
              {...register("title")}
            />
            {errors.title && (
              <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="slug" className="text-sm font-semibold text-neutral-700">SEO URL Slug</Label>
              {!isEdit && (
                <label className="flex items-center gap-1.5 text-xs text-neutral-500 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={manualSlug}
                    onChange={(e) => setManualSlug(e.target.checked)}
                    disabled={isPending}
                    className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-500"
                  />
                  <span>Manual Override</span>
                </label>
              )}
            </div>
            <Input
              id="slug"
              type="text"
              placeholder="e.g. luxury-3-bedroom-penthouse"
              disabled={isPending || (!manualSlug && !isEdit)}
              className={errors.slug ? "border-red-500" : ""}
              {...register("slug")}
            />
            {errors.slug && (
              <p className="text-xs text-red-500 mt-1">{errors.slug.message}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-semibold text-neutral-700">Detailed Description</Label>
          <textarea
            id="description"
            rows={5}
            disabled={isPending}
            placeholder="Describe the property highlights, specs, pricing, and viewing details..."
            className={`flex w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm outline-hidden focus:border-neutral-400 disabled:opacity-50 ${
              errors.description ? "border-red-500" : ""
            }`}
            {...register("description")}
          />
          {errors.description && (
            <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>
          )}
        </div>
      </div>

      {/* 2. Classification & Pricing */}
      <div className="space-y-4 pt-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400">Classification & Financials</h3>
        <hr className="border-neutral-100" />
        
        <div className="grid gap-6 md:grid-cols-4">
          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price" className="text-sm font-semibold text-neutral-700">Listing Price ($)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              placeholder="e.g. 250000"
              disabled={isPending}
              className={errors.price ? "border-red-500" : ""}
              {...register("price")}
            />
            {errors.price && (
              <p className="text-xs text-red-500 mt-1">{errors.price.message}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="categoryId" className="text-sm font-semibold text-neutral-700">Category</Label>
            <select
              id="categoryId"
              disabled={isPending}
              className={`flex w-full h-9 rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm outline-hidden focus:border-neutral-400 cursor-pointer ${
                errors.categoryId ? "border-red-500" : ""
              }`}
              {...register("categoryId")}
            >
              <option value="">Select Category...</option>
              {metadata.categories?.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-xs text-red-500 mt-1">{errors.categoryId.message}</p>
            )}
          </div>

          {/* Purpose */}
          <div className="space-y-2">
            <Label htmlFor="purposeId" className="text-sm font-semibold text-neutral-700">Purpose</Label>
            <select
              id="purposeId"
              disabled={isPending}
              className={`flex w-full h-9 rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm outline-hidden focus:border-neutral-400 cursor-pointer ${
                errors.purposeId ? "border-red-500" : ""
              }`}
              {...register("purposeId")}
            >
              <option value="">Select Purpose...</option>
              {metadata.purposes?.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            {errors.purposeId && (
              <p className="text-xs text-red-500 mt-1">{errors.purposeId.message}</p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="statusId" className="text-sm font-semibold text-neutral-700">Listing Status</Label>
            <select
              id="statusId"
              disabled={isPending}
              className={`flex w-full h-9 rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm outline-hidden focus:border-neutral-400 cursor-pointer ${
                errors.statusId ? "border-red-500" : ""
              }`}
              {...register("statusId")}
            >
              <option value="">Select Status...</option>
              {metadata.statuses?.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            {errors.statusId && (
              <p className="text-xs text-red-500 mt-1">{errors.statusId.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* 3. Specs & Contact */}
      <div className="space-y-4 pt-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400">Specifications & Contact</h3>
        <hr className="border-neutral-100" />
        
        <div className="grid gap-6 md:grid-cols-4">
          {/* Bedrooms */}
          <div className="space-y-2">
            <Label htmlFor="bedrooms" className="text-sm font-semibold text-neutral-700">Bedrooms</Label>
            <Input
              id="bedrooms"
              type="number"
              disabled={isPending}
              className={errors.bedrooms ? "border-red-500" : ""}
              {...register("bedrooms")}
            />
            {errors.bedrooms && (
              <p className="text-xs text-red-500 mt-1">{errors.bedrooms.message}</p>
            )}
          </div>

          {/* Bathrooms */}
          <div className="space-y-2">
            <Label htmlFor="bathrooms" className="text-sm font-semibold text-neutral-700">Bathrooms</Label>
            <Input
              id="bathrooms"
              type="number"
              disabled={isPending}
              className={errors.bathrooms ? "border-red-500" : ""}
              {...register("bathrooms")}
            />
            {errors.bathrooms && (
              <p className="text-xs text-red-500 mt-1">{errors.bathrooms.message}</p>
            )}
          </div>

          {/* Area Size */}
          <div className="space-y-2">
            <Label htmlFor="areaSize" className="text-sm font-semibold text-neutral-700">Area Size (Sq Ft)</Label>
            <Input
              id="areaSize"
              type="number"
              placeholder="e.g. 1500"
              disabled={isPending}
              className={errors.areaSize ? "border-red-500" : ""}
              {...register("areaSize")}
            />
            {errors.areaSize && (
              <p className="text-xs text-red-500 mt-1">{errors.areaSize.message}</p>
            )}
          </div>

          {/* Contact Number */}
          <div className="space-y-2">
            <Label htmlFor="contactNumber" className="text-sm font-semibold text-neutral-700">Contact Number</Label>
            <Input
              id="contactNumber"
              type="text"
              placeholder="e.g. +1 (555) 123-4567"
              disabled={isPending}
              className={errors.contactNumber ? "border-red-500" : ""}
              {...register("contactNumber")}
            />
            {errors.contactNumber && (
              <p className="text-xs text-red-500 mt-1">{errors.contactNumber.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* 4. Hierarchical Location Chain */}
      <div className="space-y-4 pt-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400">Location Details</h3>
        <hr className="border-neutral-100" />
        
        <div className="grid gap-6 md:grid-cols-4">
          {/* Country Selection */}
          <div className="space-y-2">
            <Label htmlFor="country" className="text-sm font-semibold text-neutral-700">Country</Label>
            <select
              id="country"
              value={selectedCountryId}
              onChange={handleCountryChange}
              disabled={isPending || isLoadingStates}
              className="flex w-full h-9 rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm outline-hidden focus:border-neutral-400 cursor-pointer"
            >
              <option value="">Select Country...</option>
              {metadata.countries?.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* State Selection */}
          <div className="space-y-2">
            <Label htmlFor="state" className="text-sm font-semibold text-neutral-700">State / Province</Label>
            <select
              id="state"
              value={selectedStateId}
              onChange={handleStateChange}
              disabled={isPending || isLoadingStates || isLoadingCities || !selectedCountryId}
              className="flex w-full h-9 rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm outline-hidden focus:border-neutral-400 cursor-pointer"
            >
              <option value="">
                {!selectedCountryId
                  ? "Select Country first..."
                  : isLoadingStates
                  ? "Loading states..."
                  : "Select State..."}
              </option>
              {states.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* City Selection */}
          <div className="space-y-2">
            <Label htmlFor="cityId" className="text-sm font-semibold text-neutral-700">City / Town</Label>
            <select
              id="cityId"
              disabled={isPending || isLoadingCities || !selectedStateId}
              className={`flex w-full h-9 rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm outline-hidden focus:border-neutral-400 cursor-pointer ${
                errors.cityId ? "border-red-500" : ""
              }`}
              {...register("cityId")}
            >
              <option value="">
                {!selectedStateId
                  ? "Select State first..."
                  : isLoadingCities
                  ? "Loading cities..."
                  : "Select City..."}
              </option>
              {cities.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {errors.cityId && (
              <p className="text-xs text-red-500 mt-1">{errors.cityId.message}</p>
            )}
          </div>

          {/* Address String */}
          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-semibold text-neutral-700">Street Address</Label>
            <Input
              id="address"
              type="text"
              placeholder="e.g. Suite 4B, 100 Main St"
              disabled={isPending}
              className={errors.address ? "border-red-500" : ""}
              {...register("address")}
            />
            {errors.address && (
              <p className="text-xs text-red-500 mt-1">{errors.address.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* 5. Toggles & Triggers */}
      <div className="pt-4 space-y-4">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isFeatured"
            disabled={isPending}
            className="h-4.5 w-4.5 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-500 cursor-pointer"
            {...register("isFeatured")}
          />
          <div className="space-y-0.5">
            <Label htmlFor="isFeatured" className="text-sm font-bold text-neutral-800 cursor-pointer select-none">
              Mark as Featured Property
            </Label>
            <p className="text-xs text-neutral-400">
              Featured properties appear highlighted on the home screen listing layouts.
            </p>
          </div>
        </div>
      </div>

      {/* 6. Form Footer buttons */}
      <div className="border-t border-neutral-100 pt-6 flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={() => router.push("/admin/properties")}
          className="w-full sm:w-auto h-10 border-neutral-200 hover:bg-neutral-50 cursor-pointer"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          className="w-full sm:w-auto h-10 bg-neutral-950 text-white hover:bg-neutral-800 cursor-pointer"
        >
          {isPending ? "Saving..." : isEdit ? "Save Changes" : "Publish Property"}
        </Button>
      </div>

    </form>
  )
}
