"use client";

import React, { useEffect, useState, useTransition } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { propertyFormSchema } from "../schemas";
import { createPropertyAction, updatePropertyAction } from "../actions";
import { slugify } from "@/lib/slugify";
import { toast } from "@/components/ui/toast";
import SeoPreview from "@/components/seo/SeoPreview";
import PropertyImageUploader from "./PropertyImageUploader";
import PropertyImageGallery from "./PropertyImageGallery";
import { LayoutGrid, Globe, Info, Image as ImageIcon, ListPlus, Plus, Trash2, Layers } from "lucide-react";

export default function PropertyForm({ property = null, metadata = {}, defaultProjectId = "" }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [manualSlug, setManualSlug] = useState(false);
  const [activeFormTab, setActiveFormTab] = useState("basic");
  const [createModeImages, setCreateModeImages] = useState([]);

  const isEdit = !!property;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      price: "",
      bedrooms: 0,
      bathrooms: 0,
      areaSize: "",
      contactNumber: "",
      projectId: "",
      statusId: "",
      isFeatured: false,
      metaTitle: "",
      metaDescription: "",
      propertyCode: "",
      unitType: "1 BHK",
      specifications: [],
      images: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "specifications",
  });

  const watchedTitle = watch("title");
  const watchedSlug = watch("slug");
  const watchedMetaTitle = watch("metaTitle");
  const watchedMetaDescription = watch("metaDescription");

  // Sync / load form states on mounting/editing
  useEffect(() => {
    if (property) {
      reset({
        title: property.title,
        slug: property.slug,
        description: property.description,
        price: Number(property.price),
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        areaSize: property.areaSize,
        contactNumber: property.contactNumber || "",
        projectId: property.projectId || "",
        statusId: property.statusId,
        isFeatured: property.isFeatured,
        metaTitle: property.metaTitle || "",
        metaDescription: property.metaDescription || "",
        propertyCode: property.propertyCode || "",
        unitType: property.unitType || "1 BHK",
        specifications: property.specifications || [],
        images: [],
      });
      setManualSlug(true);
      setActiveFormTab("basic"); // Default to basic info tab on edit
    } else {
      reset({
        title: "",
        slug: "",
        description: "",
        price: "",
        bedrooms: 0,
        bathrooms: 0,
        areaSize: "",
        contactNumber: "",
        projectId: defaultProjectId || "",
        statusId: "",
        isFeatured: false,
        metaTitle: "",
        metaDescription: "",
        propertyCode: "",
        unitType: "1 BHK",
        specifications: [],
        images: [],
      });
      setManualSlug(false);
      setActiveFormTab("basic"); // Default to basic info tab on create
      setCreateModeImages([]); // Reset local temp images state
    }
  }, [property, reset, defaultProjectId]);

  const handleCreateModeImageUpload = (newImg) => {
    setCreateModeImages((prev) => {
      const isFeatured = prev.length === 0;
      const nextImages = [
        ...prev,
        {
          id: Math.random().toString(36).substring(2, 9),
          url: newImg.url,
          publicId: newImg.publicId,
          isFeatured,
          sortOrder: prev.length,
        },
      ];
      setValue("images", nextImages);
      return nextImages;
    });
  };

  const handleCreateModeImageDelete = (id) => {
    setCreateModeImages((prev) => {
      const filtered = prev.filter((img) => img.id !== id);
      const updated = filtered.map((img, idx) => ({
        ...img,
        sortOrder: idx,
      }));
      const wasFeaturedDeleted = prev.find((img) => img.id === id)?.isFeatured;
      if (wasFeaturedDeleted && updated.length > 0) {
        updated[0].isFeatured = true;
      }
      setValue("images", updated);
      return updated;
    });
  };

  const handleCreateModeImageReorder = (index, direction) => {
    const targetIndex = direction === "left" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= createModeImages.length) return;

    setCreateModeImages((prev) => {
      const next = [...prev];
      const temp = next[index];
      next[index] = next[targetIndex];
      next[targetIndex] = temp;

      const updated = next.map((img, idx) => ({
        ...img,
        sortOrder: idx,
      }));
      setValue("images", updated);
      return updated;
    });
  };

  const handleCreateModeImageSetFeatured = (id) => {
    setCreateModeImages((prev) => {
      const updated = prev.map((img) => ({
        ...img,
        isFeatured: img.id === id,
      }));
      setValue("images", updated);
      return updated;
    });
  };

  // Handle auto slugification
  useEffect(() => {
    if (!manualSlug && !isEdit && watchedTitle) {
      setValue("slug", slugify(watchedTitle), { shouldValidate: true });
    }
  }, [watchedTitle, manualSlug, isEdit, setValue]);

  const onSubmit = (data) => {
    startTransition(async () => {
      let result;
      if (isEdit) {
        result = await updatePropertyAction(property.id, data);
      } else {
        result = await createPropertyAction(data);
      }

      if (result.success) {
        toast.success(
          isEdit
            ? "Property listing updated successfully."
            : "Property listing created successfully."
        );
        router.push("/admin/properties");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to save property listing.");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Tabs Selector */}
      <div className="flex flex-wrap border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveFormTab("basic")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all -mb-px ${
            activeFormTab === "basic"
              ? "border-slate-900 text-slate-900 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <Layers className="h-4 w-4" />
          Basic Info
        </button>
        <button
          type="button"
          onClick={() => setActiveFormTab("details")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all -mb-px ${
            activeFormTab === "details"
              ? "border-slate-900 text-slate-900 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <LayoutGrid className="h-4 w-4" />
          Property Details
        </button>
        <button
          type="button"
          onClick={() => setActiveFormTab("specs")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all -mb-px ${
            activeFormTab === "specs"
              ? "border-slate-900 text-slate-900 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <ListPlus className="h-4 w-4" />
          Specifications
        </button>
        <button
          type="button"
          onClick={() => setActiveFormTab("seo")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all -mb-px ${
            activeFormTab === "seo"
              ? "border-slate-900 text-slate-900 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <Globe className="h-4 w-4" />
          SEO Overrides
        </button>
        <button
          type="button"
          onClick={() => setActiveFormTab("images")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all -mb-px ${
            activeFormTab === "images"
              ? "border-slate-900 text-slate-900 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <ImageIcon className="h-4 w-4" />
          Images
        </button>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
      >


        {/* Tab 2: Basic Information Content */}
        <div className={activeFormTab === "basic" ? "space-y-6 block" : "hidden"}>
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Basic Association & Information
            </h3>
            <hr className="border-slate-100" />

            <div className="grid gap-6 md:grid-cols-2">
              {/* Parent Project */}
              <div className="space-y-2">
                <Label htmlFor="projectId" className="text-sm font-semibold text-slate-700">
                  Parent Project
                </Label>
                <select
                  id="projectId"
                  disabled={isPending}
                  className={`flex w-full h-10 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-hidden focus:border-slate-400 focus:ring-1 focus:ring-slate-950 cursor-pointer ${
                    errors.projectId ? "border-red-500" : ""
                  }`}
                  {...register("projectId")}
                >
                  <option value="">Select Project...</option>
                  {metadata.projects?.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.projectName}
                    </option>
                  ))}
                </select>
                {errors.projectId && (
                  <p className="text-xs text-red-500 mt-1">{errors.projectId.message}</p>
                )}
                <p className="text-[10px] text-slate-400">
                  Location (City, Country, Address) and Category details are automatically inherited from the parent project.
                </p>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="statusId" className="text-sm font-semibold text-slate-700">
                  Listing Status
                </Label>
                <select
                  id="statusId"
                  disabled={isPending}
                  className={`flex w-full h-10 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-hidden focus:border-slate-400 focus:ring-1 focus:ring-slate-950 cursor-pointer ${
                    errors.statusId ? "border-red-500" : ""
                  }`}
                  {...register("statusId")}
                >
                  <option value="">Select Status...</option>
                  {metadata.statuses?.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                {errors.statusId && (
                  <p className="text-xs text-red-500 mt-1">{errors.statusId.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-semibold text-slate-700">
                  Property Title
                </Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="e.g. Ultra Luxury 3 BHK Unit"
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
                  <Label htmlFor="slug" className="text-sm font-semibold text-slate-700">
                    SEO URL Slug
                  </Label>
                  {!isEdit && (
                    <label className="flex items-center gap-1.5 text-xs text-slate-500 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={manualSlug}
                        onChange={(e) => setManualSlug(e.target.checked)}
                        disabled={isPending}
                        className="rounded border-slate-300 text-slate-900 focus:ring-slate-500"
                      />
                      <span>Manual Override</span>
                    </label>
                  )}
                </div>
                <Input
                  id="slug"
                  type="text"
                  placeholder="e.g. ultra-luxury-3-bhk-unit"
                  disabled={isPending || (!manualSlug && !isEdit)}
                  className={errors.slug ? "border-red-500" : ""}
                  {...register("slug")}
                />
                {errors.slug && (
                  <p className="text-xs text-red-500 mt-1">{errors.slug.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {/* Unit Code */}
              <div className="space-y-2">
                <Label htmlFor="propertyCode" className="text-sm font-semibold text-slate-700">
                  Property / Unit Code
                </Label>
                <Input
                  id="propertyCode"
                  type="text"
                  placeholder="e.g. UNIT-302"
                  disabled={isPending}
                  className={errors.propertyCode ? "border-red-500" : ""}
                  {...register("propertyCode")}
                />
                {errors.propertyCode && (
                  <p className="text-xs text-red-500 mt-1">{errors.propertyCode.message}</p>
                )}
              </div>

              {/* Unit Type */}
              <div className="space-y-2">
                <Label htmlFor="unitType" className="text-sm font-semibold text-slate-700">
                  Unit Type
                </Label>
                <Input
                  id="unitType"
                  type="text"
                  placeholder="e.g. 3 BHK, Studio, Penthouse"
                  disabled={isPending}
                  className={errors.unitType ? "border-red-500" : ""}
                  {...register("unitType")}
                />
                {errors.unitType && (
                  <p className="text-xs text-red-500 mt-1">{errors.unitType.message}</p>
                )}
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price" className="text-sm font-semibold text-slate-700">
                  Listing Price (₹)
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="e.g. 15000000"
                  disabled={isPending}
                  className={errors.price ? "border-red-500" : ""}
                  {...register("price")}
                />
                {errors.price && (
                  <p className="text-xs text-red-500 mt-1">{errors.price.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="isFeatured"
                disabled={isPending}
                className="h-4.5 w-4.5 rounded border-slate-300 text-slate-900 focus:ring-slate-500 cursor-pointer"
                {...register("isFeatured")}
              />
              <div className="space-y-0.5">
                <Label
                  htmlFor="isFeatured"
                  className="text-sm font-bold text-slate-800 cursor-pointer select-none"
                >
                  Mark as Featured Property
                </Label>
                <p className="text-xs text-slate-400">
                  Featured properties appear highlighted on the home screen listing layouts.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab 3: Property Details Content */}
        <div className={activeFormTab === "details" ? "space-y-6 block" : "hidden"}>
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Property Details & Contact
            </h3>
            <hr className="border-slate-100" />

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold text-slate-700">
                Detailed Description
              </Label>
              <textarea
                id="description"
                rows={6}
                disabled={isPending}
                placeholder="Describe the unit layout, view highlights, styling details..."
                className={`flex w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-hidden focus:border-slate-400 focus:ring-1 focus:ring-slate-950 disabled:opacity-50 ${
                  errors.description ? "border-red-500" : ""
                }`}
                {...register("description")}
              />
              {errors.description && (
                <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>
              )}
            </div>

            <div className="grid gap-6 md:grid-cols-4">
              {/* Bedrooms */}
              <div className="space-y-2">
                <Label htmlFor="bedrooms" className="text-sm font-semibold text-slate-700">
                  Bedrooms
                </Label>
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
                <Label htmlFor="bathrooms" className="text-sm font-semibold text-slate-700">
                  Bathrooms
                </Label>
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
                <Label htmlFor="areaSize" className="text-sm font-semibold text-slate-700">
                  Area Size (Sq Ft)
                </Label>
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
                <Label htmlFor="contactNumber" className="text-sm font-semibold text-slate-700">
                  Contact Number
                </Label>
                <Input
                  id="contactNumber"
                  type="text"
                  placeholder="e.g. +91 98765 43210"
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
        </div>

        {/* Tab 4: Specifications Content */}
        <div className={activeFormTab === "specs" ? "space-y-6 block" : "hidden"}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                  Technical Specifications
                </h3>
                <p className="text-xs text-slate-500">
                  Define technical details, dimensions, and custom specifications for this specific property.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ title: "", value: "" })}
                className="h-9 border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Specification
              </Button>
            </div>
            <hr className="border-slate-100" />

            {fields.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center">
                <ListPlus className="h-8 w-8 text-slate-300 mb-2" />
                <p className="text-xs font-semibold text-slate-600">No specifications added yet</p>
                <p className="text-[10px] text-slate-400 mt-1">
                  Click the button above to define specifications (e.g., "Parking", "Floor Level", "Furnishing Status").
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-4 items-start bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                    <div className="flex-1 grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Input
                          placeholder="e.g. Floor Level"
                          className={errors.specifications?.[index]?.title ? "border-red-500" : ""}
                          {...register(`specifications.${index}.title`)}
                        />
                        {errors.specifications?.[index]?.title && (
                          <p className="text-[10px] text-red-500">{errors.specifications[index].title.message}</p>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <Input
                          placeholder="e.g. 15th Floor"
                          className={errors.specifications?.[index]?.value ? "border-red-500" : ""}
                          {...register(`specifications.${index}.value`)}
                        />
                        {errors.specifications?.[index]?.value && (
                          <p className="text-[10px] text-red-500">{errors.specifications[index].value.message}</p>
                        )}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      className="text-slate-400 hover:text-red-500 hover:bg-red-50 cursor-pointer shrink-0 mt-0.5"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tab 5: SEO Overrides Content */}
        <div className={activeFormTab === "seo" ? "block space-y-6" : "hidden"}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-4">
              <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 mb-4 flex items-start gap-2.5">
                <Info className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
                <p className="text-xs leading-normal text-slate-500">
                  If meta overrides are left blank, search engines will automatically construct meta tags utilizing the property details (Title, Price, Location, etc.). Customize these inputs to optimize SERP ranking.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaTitle">Custom Meta Title</Label>
                <Input
                  id="metaTitle"
                  placeholder="e.g. Luxury 3 BHK Penthouse For Sale"
                  disabled={isPending}
                  {...register("metaTitle")}
                />
                {errors.metaTitle && (
                  <p className="text-xs text-red-500">{errors.metaTitle.message}</p>
                )}
                <p className="text-[10px] text-slate-400">
                  Recommended length: &le; 60 characters. Max limit is 60.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDescription">Custom Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  placeholder="e.g. Beautiful apartment featuring modular kitchen, spacious balcony, and modern styling details. Available in prime project..."
                  rows={4}
                  disabled={isPending}
                  {...register("metaDescription")}
                />
                {errors.metaDescription && (
                  <p className="text-xs text-red-500">{errors.metaDescription.message}</p>
                )}
                <p className="text-[10px] text-slate-400">
                  Recommended length: &le; 160 characters. Max limit is 160.
                </p>
              </div>
            </div>

            <div className="lg:col-span-5">
              <SeoPreview
                title={watchedMetaTitle || watchedTitle || "Property Title"}
                description={watchedMetaDescription || watchedTitle}
                slug={watchedSlug}
                pageType="PROPERTY"
              />
            </div>
          </div>
        </div>

        {/* Tab 5: Images Content */}
        <div className={activeFormTab === "images" ? "space-y-8 block" : "hidden"}>
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-800">Gallery Images</h3>
              <p className="text-xs text-slate-500">
                Upload up to 10 images. Drag/reorder to change sorting order. Set one image as featured cover photo.
              </p>
            </div>
            
            <div className="bg-slate-50/50 border border-slate-200/60 rounded-xl p-5">
              <PropertyImageUploader
                propertyId={isEdit ? property.id : "temp"}
                currentCount={isEdit ? (property.images?.length || 0) : createModeImages.length}
                isEdit={isEdit}
                onUploadSuccess={!isEdit ? handleCreateModeImageUpload : undefined}
              />
            </div>
            
            <div className="bg-white border border-slate-200/60 rounded-xl p-5">
              <PropertyImageGallery
                images={isEdit ? (property.images || []) : createModeImages}
                propertyId={isEdit ? property.id : "temp"}
                isEdit={isEdit}
                onDelete={!isEdit ? handleCreateModeImageDelete : undefined}
                onReorder={!isEdit ? handleCreateModeImageReorder : undefined}
                onSetFeatured={!isEdit ? handleCreateModeImageSetFeatured : undefined}
              />
            </div>
          </div>
        </div>

        {/* Form Footer Buttons */}
        <div className="border-t border-slate-100 pt-6 flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => router.push("/admin/properties")}
            className="w-full sm:w-auto h-10 border-slate-200 hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="w-full sm:w-auto h-10 bg-slate-950 text-white hover:bg-slate-800 cursor-pointer"
          >
            {isPending
              ? "Saving..."
              : isEdit
                ? "Save Changes"
                : "Publish Property"}
          </Button>
        </div>
      </form>
    </div>
  );
}
