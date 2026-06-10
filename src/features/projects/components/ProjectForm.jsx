"use client";

import React, { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { projectFormSchema } from "../schemas";
import { createProjectAction, updateProjectAction } from "../actions";
import { getUploadSignatureAction } from "../actions/image.actions";
import {
  getActiveStatesAction,
  getActiveCitiesAction,
} from "@/features/locations/actions";
import { slugify } from "@/lib/slugify";
import { toast } from "@/components/ui/toast";
import SeoPreview from "@/components/seo/SeoPreview";
import ProjectImageUploader from "./ProjectImageUploader";
import ProjectImageGallery from "./ProjectImageGallery";
import { LayoutGrid, Globe, Info, Plus, Trash2, ArrowUpRight, UploadCloud, Loader2, Image as ImageIcon } from "lucide-react";

export default function ProjectForm({ project = null, metadata = {} }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [manualSlug, setManualSlug] = useState(false);
  const [activeFormTab, setActiveFormTab] = useState(project ? "gallery" : "basic");

  // Cascading Location States
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountryId, setSelectedCountryId] = useState("");
  const [selectedStateId, setSelectedStateId] = useState("");
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);

  // Upload States
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [isUploadingMain, setIsUploadingMain] = useState(false);
  const [isUploadingBrochure, setIsUploadingBrochure] = useState(false);

  // Dynamic Lists States
  const [highlightsList, setHighlightsList] = useState([]);
  const [newHighlight, setNewHighlight] = useState("");

  const [amenitiesList, setAmenitiesList] = useState([]);
  const [newAmenity, setNewAmenity] = useState("");

  const [specsList, setSpecsList] = useState([]);
  const [newSpecTitle, setNewSpecTitle] = useState("");
  const [newSpecValue, setNewSpecValue] = useState("");

  const isEdit = !!project;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      projectName: "",
      slug: "",
      address: "",
      description: "",
      shortDescription: "",
      builderName: "",
      builderPhone: "",
      builderEmail: "",
      status: "ONGOING",
      bannerImage: "",
      mainImage: "",
      brochureFile: "",
      googleMapIframe: "",
      isFeatured: false,
      displayOrder: 0,
      categoryId: "",
      cityId: "",
      metaTitle: "",
      metaDescription: "",
      amenities: "",
      highlights: "",
      specifications: [],
    },
  });

  const watchedProjectName = watch("projectName");
  const watchedSlug = watch("slug");
  const watchedMetaTitle = watch("metaTitle");
  const watchedMetaDescription = watch("metaDescription");
  const watchedBannerImage = watch("bannerImage");
  const watchedMainImage = watch("mainImage");
  const watchedBrochureFile = watch("brochureFile");

  // Sync edit model on mount
  useEffect(() => {
    if (project) {
      const countryId = project.city?.state?.countryId || "";
      const stateId = project.city?.stateId || "";

      setSelectedCountryId(countryId);
      setSelectedStateId(stateId);

      if (countryId) {
        setIsLoadingStates(true);
        getActiveStatesAction(countryId).then((data) => {
          setStates(data);
          setIsLoadingStates(false);
        });
      }
      if (stateId) {
        setIsLoadingCities(true);
        getActiveCitiesAction(stateId).then((data) => {
          setCities(data);
          setIsLoadingCities(false);
        });
      }

      // Populate interactive lists
      setHighlightsList(project.highlights?.map((h) => h.text) || []);
      setAmenitiesList(project.amenities?.map((a) => a.name) || []);
      setSpecsList(
        project.specifications?.map((s) => ({ title: s.title, value: s.value })) || []
      );

      reset({
        projectName: project.projectName,
        slug: project.slug,
        address: project.address,
        description: project.description,
        shortDescription: project.shortDescription || "",
        builderName: project.builderName,
        builderPhone: project.builderPhone || "",
        builderEmail: project.builderEmail || "",
        status: project.status,
        bannerImage: project.bannerImage || "",
        mainImage: project.mainImage || "",
        brochureFile: project.brochureFile || "",
        googleMapIframe: project.googleMapIframe || "",
        isFeatured: project.isFeatured || false,
        displayOrder: project.displayOrder || 0,
        categoryId: project.categoryId,
        cityId: project.cityId,
        metaTitle: project.metaTitle || "",
        metaDescription: project.metaDescription || "",
        amenities: project.amenities?.map((a) => a.name).join(", ") || "",
        highlights: project.highlights?.map((h) => h.text).join(", ") || "",
        specifications: project.specifications || [],
      });
      setManualSlug(true);
    }
  }, [project, reset]);

  // Auto slugify
  useEffect(() => {
    if (!manualSlug && !isEdit && watchedProjectName) {
      setValue("slug", slugify(watchedProjectName), { shouldValidate: true });
    }
  }, [watchedProjectName, manualSlug, isEdit, setValue]);

  // Sync interactive arrays to hook form
  useEffect(() => {
    setValue("highlights", highlightsList.join(", "));
  }, [highlightsList, setValue]);

  useEffect(() => {
    setValue("amenities", amenitiesList.join(", "));
  }, [amenitiesList, setValue]);

  useEffect(() => {
    setValue("specifications", specsList);
  }, [specsList, setValue]);

  // Handle Location Cascade
  const handleCountryChange = (e) => {
    const countryId = e.target.value;
    setSelectedCountryId(countryId);
    setSelectedStateId("");
    setStates([]);
    setCities([]);
    setValue("cityId", "");

    if (countryId) {
      setIsLoadingStates(true);
      getActiveStatesAction(countryId).then((data) => {
        setStates(data);
        setIsLoadingStates(false);
      });
    }
  };

  const handleStateChange = (e) => {
    const stateId = e.target.value;
    setSelectedStateId(stateId);
    setCities([]);
    setValue("cityId", "");

    if (stateId) {
      setIsLoadingCities(true);
      getActiveCitiesAction(stateId).then((data) => {
        setCities(data);
        setIsLoadingCities(false);
      });
    }
  };

  // Secure Cloudinary Upload Logic (No keys exposed)
  const handleFileUpload = async (e, fieldName, setUploading) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const uploadContextId = project?.id || "temp-project-id";
      const isDocument = fieldName === "brochureFile";
      const resourceType = isDocument ? "raw" : "auto";

      // Call server action to fetch signed parameters
      const signatureResult = await getUploadSignatureAction(uploadContextId, resourceType);
      if (!signatureResult.success) {
        throw new Error(signatureResult.error || "Failed to fetch secure signature.");
      }

      const { credentials, folder } = signatureResult;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", credentials.apiKey);
      formData.append("timestamp", credentials.timestamp);
      formData.append("signature", credentials.signature);
      formData.append("folder", folder);

      const endpoint = `https://api.cloudinary.com/v1_1/${credentials.cloudName}/${resourceType}/upload`;

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Direct Cloudinary upload request failed.");
      }

      const uploadData = await response.json();
      setValue(fieldName, uploadData.secure_url, { shouldValidate: true });
      toast.success(`${fieldName.replace("Image", " Image")} uploaded securely.`);
    } catch (err) {
      console.error(err);
      toast.error(`Upload error: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = (data) => {
    startTransition(async () => {
      let result;
      if (isEdit) {
        result = await updateProjectAction(project.id, data);
      } else {
        result = await createProjectAction(data);
      }

      if (result.success) {
        toast.success(
          isEdit
            ? "Project details updated successfully."
            : "New project listing created successfully."
        );
        router.push("/admin/projects");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to save project.");
      }
    });
  };

  // Lists Mutator Helpers
  const addHighlight = () => {
    if (newHighlight.trim() && !highlightsList.includes(newHighlight.trim())) {
      setHighlightsList([...highlightsList, newHighlight.trim()]);
      setNewHighlight("");
    }
  };

  const removeHighlight = (text) => {
    setHighlightsList(highlightsList.filter((item) => item !== text));
  };

  const addAmenity = () => {
    if (newAmenity.trim() && !amenitiesList.includes(newAmenity.trim())) {
      setAmenitiesList([...amenitiesList, newAmenity.trim()]);
      setNewAmenity("");
    }
  };

  const removeAmenity = (name) => {
    setAmenitiesList(amenitiesList.filter((item) => item !== name));
  };

  const addSpec = () => {
    if (newSpecTitle.trim() && newSpecValue.trim()) {
      setSpecsList([...specsList, { title: newSpecTitle.trim(), value: newSpecValue.trim() }]);
      setNewSpecTitle("");
      setNewSpecValue("");
    }
  };

  const removeSpec = (index) => {
    setSpecsList(specsList.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Form Tabs */}
      <div className="flex flex-wrap border-b border-slate-200">
        {[
          { id: "gallery", label: "Gallery", icon: ImageIcon },
          { id: "basic", label: "Basic Info", icon: LayoutGrid },
          { id: "builder", label: "Builder & Location", icon: Info },
          { id: "media", label: "Media & Attachments", icon: UploadCloud },
          { id: "details", label: "Details & Specifications", icon: Plus },
          { id: "seo", label: "SEO Overrides", icon: Globe },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFormTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all -mb-px ${activeFormTab === tab.id
                  ? "border-slate-900 text-slate-900"
                  : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
      >
        {/* TAB 0: GALLERY */}
        <div className={activeFormTab === "gallery" ? "space-y-8 block" : "hidden"}>
          {isEdit ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-800">Gallery Images</h3>
                <p className="text-xs text-slate-500 font-medium">
                  Upload up to 10 images. Drag/reorder to change sorting order. Set one image as featured cover photo.
                </p>
              </div>

              <div className="bg-slate-50/50 border border-slate-200/60 rounded-xl p-5">
                <ProjectImageUploader projectId={project.id} currentCount={project.images?.length || 0} />
              </div>

              <div className="bg-white border border-slate-200/60 rounded-xl p-5">
                <ProjectImageGallery images={project.images || []} projectId={project.id} />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
              <div className="p-4 bg-indigo-50 text-indigo-600 rounded-full mb-4 animate-bounce">
                <ImageIcon className="h-10 w-10" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Project Gallery Upload is Locked</h3>
              <p className="text-sm text-slate-500 mt-2 max-w-md">
                You can upload photos, change their sorting sequence, and set the featured cover photo once the project is created. Save the details first!
              </p>
              <Button
                type="button"
                onClick={() => setActiveFormTab("basic")}
                className="mt-6 bg-slate-950 text-white hover:bg-slate-800 cursor-pointer"
              >
                Proceed to Basic Info
              </Button>
            </div>
          )}
        </div>

        {/* TAB 1: BASIC INFORMATION */}
        <div className={activeFormTab === "basic" ? "space-y-6 block" : "hidden"}>
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Project Parameters
            </h3>
            <hr className="border-slate-100" />

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="projectName" className="text-sm font-semibold text-slate-700">
                  Project Name *
                </Label>
                <Input
                  id="projectName"
                  type="text"
                  placeholder="e.g. Green Meadows Estates"
                  disabled={isPending}
                  className={errors.projectName ? "border-red-500" : ""}
                  {...register("projectName")}
                />
                {errors.projectName && (
                  <p className="text-xs text-red-500 mt-1">{errors.projectName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="slug" className="text-sm font-semibold text-slate-700">
                    SEO Slug URL
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
                  placeholder="e.g. green-meadows-estates"
                  disabled={isPending || (!manualSlug && !isEdit)}
                  className={errors.slug ? "border-red-500" : ""}
                  {...register("slug")}
                />
                {errors.slug && (
                  <p className="text-xs text-red-500 mt-1">{errors.slug.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="categoryId" className="text-sm font-semibold text-slate-700">
                  Category *
                </Label>
                <select
                  id="categoryId"
                  disabled={isPending}
                  className={`flex w-full h-9 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm outline-hidden focus:border-slate-400 cursor-pointer ${errors.categoryId ? "border-red-500" : ""
                    }`}
                  {...register("categoryId")}
                >
                  <option value="">Select Category...</option>
                  {metadata.categories?.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className="text-xs text-red-500 mt-1">{errors.categoryId.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-semibold text-slate-700">
                  Project Status *
                </Label>
                <select
                  id="status"
                  disabled={isPending}
                  className="flex w-full h-9 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm outline-hidden focus:border-slate-400 cursor-pointer"
                  {...register("status")}
                >
                  <option value="ONGOING">Ongoing</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="UPCOMING">Upcoming</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectBudget" className="text-sm font-semibold text-slate-700">
                  Estimated Budget (₹)
                </Label>
                <Input
                  id="projectBudget"
                  type="number"
                  step="0.01"
                  placeholder="e.g. 50000000"
                  disabled={isPending}
                  {...register("projectBudget")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="areaSize" className="text-sm font-semibold text-slate-700">
                  Total Land Size (Sq Ft)
                </Label>
                <Input
                  id="areaSize"
                  type="number"
                  placeholder="e.g. 80000"
                  disabled={isPending}
                  {...register("areaSize")}
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 pt-2">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isFeatured"
                  disabled={isPending}
                  className="h-4.5 w-4.5 rounded border-slate-300 text-slate-900 focus:ring-slate-500 cursor-pointer"
                  {...register("isFeatured")}
                />
                <div className="space-y-0.5">
                  <Label htmlFor="isFeatured" className="text-sm font-bold text-slate-800 cursor-pointer select-none">
                    Featured Project
                  </Label>
                  <p className="text-xs text-slate-400">
                    Flag project to display on homepage grids.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayOrder" className="text-sm font-semibold text-slate-700">
                  Homepage Display Order
                </Label>
                <Input
                  id="displayOrder"
                  type="number"
                  placeholder="e.g. 0"
                  disabled={isPending}
                  {...register("displayOrder")}
                />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <Label htmlFor="shortDescription" className="text-sm font-semibold text-slate-700">
                Short Description (Catchy teaser)
              </Label>
              <Input
                id="shortDescription"
                type="text"
                placeholder="e.g. Premium ultra-luxury villas with private pool and sky terrace."
                disabled={isPending}
                {...register("shortDescription")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold text-slate-700">
                Full Project Description *
              </Label>
              <textarea
                id="description"
                rows={5}
                placeholder="Provide details about the architectural inspiration, layout options, locality updates..."
                disabled={isPending}
                className={`flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-hidden focus:border-slate-400 ${errors.description ? "border-red-500" : ""
                  }`}
                {...register("description")}
              />
              {errors.description && (
                <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* TAB 2: BUILDER INFO & LOCATION */}
        <div className={activeFormTab === "builder" ? "space-y-6 block" : "hidden"}>
          {/* Builder */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Builder / Developer Details
            </h3>
            <hr className="border-slate-100" />
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="builderName" className="text-sm font-semibold text-slate-700">
                  Builder Name *
                </Label>
                <Input
                  id="builderName"
                  type="text"
                  placeholder="e.g. Sunrise Realty Group"
                  disabled={isPending}
                  className={errors.builderName ? "border-red-500" : ""}
                  {...register("builderName")}
                />
                {errors.builderName && (
                  <p className="text-xs text-red-500 mt-1">{errors.builderName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="builderPhone" className="text-sm font-semibold text-slate-700">
                  Builder Phone
                </Label>
                <Input
                  id="builderPhone"
                  type="text"
                  placeholder="e.g. +91 99887 76655"
                  disabled={isPending}
                  {...register("builderPhone")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="builderEmail" className="text-sm font-semibold text-slate-700">
                  Builder Email
                </Label>
                <Input
                  id="builderEmail"
                  type="text"
                  placeholder="e.g. developer@sunrise.com"
                  disabled={isPending}
                  className={errors.builderEmail ? "border-red-500" : ""}
                  {...register("builderEmail")}
                />
                {errors.builderEmail && (
                  <p className="text-xs text-red-500 mt-1">{errors.builderEmail.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Project Location Tier
            </h3>
            <hr className="border-slate-100" />
            <div className="grid gap-6 md:grid-cols-3">
              {/* Country Selection */}
              <div className="space-y-2">
                <Label htmlFor="country" className="text-sm font-semibold text-slate-700">
                  Country *
                </Label>
                <select
                  id="country"
                  value={selectedCountryId}
                  onChange={handleCountryChange}
                  disabled={isPending || isLoadingStates}
                  className="flex w-full h-9 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm outline-hidden focus:border-slate-400 cursor-pointer"
                >
                  <option value="">Select Country...</option>
                  {metadata.countries?.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* State Selection */}
              <div className="space-y-2">
                <Label htmlFor="state" className="text-sm font-semibold text-slate-700">
                  State / Province *
                </Label>
                <select
                  id="state"
                  value={selectedStateId}
                  onChange={handleStateChange}
                  disabled={isPending || isLoadingStates || isLoadingCities || !selectedCountryId}
                  className="flex w-full h-9 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm outline-hidden focus:border-slate-400 cursor-pointer"
                >
                  <option value="">
                    {!selectedCountryId
                      ? "Select Country first..."
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
              </div>

              {/* City Selection */}
              <div className="space-y-2">
                <Label htmlFor="cityId" className="text-sm font-semibold text-slate-700">
                  City / Locality *
                </Label>
                <select
                  id="cityId"
                  disabled={isPending || isLoadingCities || !selectedStateId}
                  className={`flex w-full h-9 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm outline-hidden focus:border-slate-400 cursor-pointer ${errors.cityId ? "border-red-500" : ""
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
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {errors.cityId && (
                  <p className="text-xs text-red-500 mt-1">{errors.cityId.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 pt-2">
              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-semibold text-slate-700">
                  Detailed Street Address *
                </Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="e.g. Sector 12, Plot 45B, Hiranandani Gardens"
                  disabled={isPending}
                  className={errors.address ? "border-red-500" : ""}
                  {...register("address")}
                />
                {errors.address && (
                  <p className="text-xs text-red-500 mt-1">{errors.address.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="googleMapIframe" className="text-sm font-semibold text-slate-700">
                  Google Maps Embed Iframe Code
                </Label>
                <Input
                  id="googleMapIframe"
                  type="text"
                  placeholder='e.g. <iframe src="https://www.google.com/maps/embed?..." ...></iframe>'
                  disabled={isPending}
                  {...register("googleMapIframe")}
                />
              </div>
            </div>
          </div>
        </div>

        {/* TAB 3: MEDIA & ATTACHMENTS */}
        <div className={activeFormTab === "media" ? "space-y-6 block" : "hidden"}>
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Project Media Links & Signed Uploads
            </h3>
            <hr className="border-slate-100" />

            <div className="grid gap-6 md:grid-cols-2">
              {/* Banner Image */}
              <div className="space-y-3 p-4 border border-slate-100 rounded-xl bg-slate-50/30">
                <Label className="text-sm font-semibold text-slate-700">Banner Image URL</Label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Provide banner image URL..."
                    disabled={isPending}
                    {...register("bannerImage")}
                  />
                  <div className="relative">
                    <input
                      type="file"
                      id="banner-file"
                      accept=".jpg,.jpeg,.png,.webp"
                      onChange={(e) => handleFileUpload(e, "bannerImage", setIsUploadingBanner)}
                      disabled={isPending || isUploadingBanner}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      asChild
                      className="border-neutral-200 h-9 text-xs font-bold cursor-pointer"
                    >
                      <label htmlFor="banner-file">
                        {isUploadingBanner ? (
                          <Loader2 className="h-4 w-4 animate-spin text-neutral-600" />
                        ) : (
                          "Upload File"
                        )}
                      </label>
                    </Button>
                  </div>
                </div>
                {watchedBannerImage && (
                  <div className="relative aspect-[3/1] rounded-lg overflow-hidden border border-slate-200">
                    <img src={watchedBannerImage} alt="Banner Preview" className="object-cover w-full h-full" />
                  </div>
                )}
              </div>

              {/* Main Image */}
              <div className="space-y-3 p-4 border border-slate-100 rounded-xl bg-slate-50/30">
                <Label className="text-sm font-semibold text-slate-700">Main Cover Image URL</Label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Provide main image URL..."
                    disabled={isPending}
                    {...register("mainImage")}
                  />
                  <div className="relative">
                    <input
                      type="file"
                      id="main-file"
                      accept=".jpg,.jpeg,.png,.webp"
                      onChange={(e) => handleFileUpload(e, "mainImage", setIsUploadingMain)}
                      disabled={isPending || isUploadingMain}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      asChild
                      className="border-neutral-200 h-9 text-xs font-bold cursor-pointer"
                    >
                      <label htmlFor="main-file">
                        {isUploadingMain ? (
                          <Loader2 className="h-4 w-4 animate-spin text-neutral-600" />
                        ) : (
                          "Upload File"
                        )}
                      </label>
                    </Button>
                  </div>
                </div>
                {watchedMainImage && (
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-slate-200 max-w-[200px]">
                    <img src={watchedMainImage} alt="Main Cover Preview" className="object-cover w-full h-full" />
                  </div>
                )}
              </div>
            </div>

            {/* Brochure File */}
            <div className="p-4 border border-slate-100 rounded-xl bg-slate-50/30 space-y-3">
              <Label className="text-sm font-semibold text-slate-700 font-bold">Project Brochure Document URL (PDF/Word)</Label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="e.g. https://res.cloudinary.com/.../brochure.pdf"
                  disabled={isPending}
                  {...register("brochureFile")}
                />
                <div className="relative">
                  <input
                    type="file"
                    id="brochure-file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileUpload(e, "brochureFile", setIsUploadingBrochure)}
                    disabled={isPending || isUploadingBrochure}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    asChild
                    className="border-neutral-200 h-9 text-xs font-bold cursor-pointer"
                  >
                    <label htmlFor="brochure-file">
                      {isUploadingBrochure ? (
                        <Loader2 className="h-4 w-4 animate-spin text-neutral-600" />
                      ) : (
                        "Upload Doc"
                      )}
                    </label>
                  </Button>
                </div>
              </div>
              {watchedBrochureFile && (
                <div className="flex items-center gap-2 text-xs text-blue-600 font-semibold">
                  <ArrowUpRight className="h-4 w-4" />
                  <a href={watchedBrochureFile} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    View Uploaded Brochure
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* TAB 4: AMENITIES, HIGHLIGHTS & SPECS */}
        <div className={activeFormTab === "details" ? "space-y-6 block" : "hidden"}>
          {/* Highlights */}
          <div className="space-y-3 p-4 border border-slate-100 rounded-xl">
            <Label className="text-sm font-bold text-slate-800">Project Highlights / Key Selling Points</Label>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Add a key selling point (e.g. 5-Min to metro, Sea facing views)"
                value={newHighlight}
                onChange={(e) => setNewHighlight(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addHighlight();
                  }
                }}
              />
              <Button type="button" onClick={addHighlight} className="bg-slate-900 text-white hover:bg-slate-800 h-9 text-xs font-semibold cursor-pointer">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {highlightsList.map((item, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 ring-1 ring-inset ring-indigo-700/10"
                >
                  {item}
                  <button
                    type="button"
                    onClick={() => removeHighlight(item)}
                    className="text-indigo-400 hover:text-indigo-600 font-bold cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
              {highlightsList.length === 0 && (
                <p className="text-xs text-slate-400 italic">No highlights configured yet.</p>
              )}
            </div>
          </div>

          {/* Amenities */}
          <div className="space-y-3 p-4 border border-slate-100 rounded-xl">
            <Label className="text-sm font-bold text-slate-800">Project Amenities</Label>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Add an amenity (e.g. Club House, Infinity Pool, Rooftop Bar)"
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addAmenity();
                  }
                }}
              />
              <Button type="button" onClick={addAmenity} className="bg-slate-900 text-white hover:bg-slate-800 h-9 text-xs font-semibold cursor-pointer">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {amenitiesList.map((item, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-inset ring-emerald-700/10"
                >
                  {item}
                  <button
                    type="button"
                    onClick={() => removeAmenity(item)}
                    className="text-emerald-400 hover:text-emerald-600 font-bold cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
              {amenitiesList.length === 0 && (
                <p className="text-xs text-slate-400 italic">No amenities configured yet.</p>
              )}
            </div>
          </div>

          {/* Specifications */}
          <div className="space-y-4 p-4 border border-slate-100 rounded-xl">
            <Label className="text-sm font-bold text-slate-800">Project Technical Specifications</Label>
            <div className="grid gap-3 sm:grid-cols-3">
              <Input
                type="text"
                placeholder="Spec Title (e.g. Flooring)"
                value={newSpecTitle}
                onChange={(e) => setNewSpecTitle(e.target.value)}
              />
              <Input
                type="text"
                placeholder="Spec Details (e.g. Italian Marble)"
                value={newSpecValue}
                onChange={(e) => setNewSpecValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSpec();
                  }
                }}
              />
              <Button type="button" onClick={addSpec} className="bg-slate-900 text-white hover:bg-slate-800 h-9 text-xs font-semibold cursor-pointer">
                Add Specification
              </Button>
            </div>

            {/* Specifications list */}
            <div className="border border-slate-200 rounded-lg overflow-hidden mt-3">
              <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                <thead className="bg-slate-50 font-bold text-slate-700">
                  <tr>
                    <th className="px-4 py-2.5">Title</th>
                    <th className="px-4 py-2.5">Value</th>
                    <th className="px-4 py-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white text-slate-600 font-medium">
                  {specsList.map((item, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-2.5 font-bold text-slate-800">{item.title}</td>
                      <td className="px-4 py-2.5">{item.value}</td>
                      <td className="px-4 py-2.5 text-right">
                        <button
                          type="button"
                          onClick={() => removeSpec(idx)}
                          className="text-red-500 hover:text-red-700 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {specsList.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-4 py-4 text-center text-slate-400 italic">
                        No technical specifications added yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* TAB 5: SEO OVERRIDES */}
        <div className={activeFormTab === "seo" ? "space-y-6 block" : "hidden"}>
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              SEO Parameters
            </h3>
            <hr className="border-slate-100" />

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="metaTitle" className="text-sm font-semibold text-slate-700">
                    SEO Meta Title
                  </Label>
                  <Input
                    id="metaTitle"
                    type="text"
                    placeholder="Primary display title in search engine result tabs"
                    disabled={isPending}
                    className={errors.metaTitle ? "border-red-500" : ""}
                    {...register("metaTitle")}
                  />
                  {errors.metaTitle && (
                    <p className="text-xs text-red-500 mt-1">{errors.metaTitle.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metaDescription" className="text-sm font-semibold text-slate-700">
                    SEO Meta Description
                  </Label>
                  <Textarea
                    id="metaDescription"
                    rows={4}
                    placeholder="Search engine brief snippet descriptive content..."
                    disabled={isPending}
                    className={errors.metaDescription ? "border-red-500" : ""}
                    {...register("metaDescription")}
                  />
                  {errors.metaDescription && (
                    <p className="text-xs text-red-500 mt-1">{errors.metaDescription.message}</p>
                  )}
                </div>
              </div>

              {/* SEO Live Preview Widget */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                  Search Engine Results Snippet Preview
                </Label>
                <div className="border border-slate-100 rounded-xl bg-slate-50/50 p-4">
                  <SeoPreview
                    title={watchedMetaTitle || watchedProjectName || "New Project Listing"}
                    description={
                      watchedMetaDescription ||
                      "Explore property listings, location highlights, developer details and gallery specifications."
                    }
                    slug={watchedSlug || "project-details-slug"}
                    baseUrl="https://yourdomain.com/projects"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/projects")}
            disabled={isPending}
            className="border-neutral-200 hover:bg-neutral-50 h-10 text-xs font-semibold text-neutral-700 cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isPending || isUploadingBanner || isUploadingMain || isUploadingBrochure}
            className="bg-neutral-950 text-white hover:bg-neutral-800 h-10 text-xs font-semibold px-6 cursor-pointer"
          >
            {isPending ? (
              <span className="flex items-center gap-1.5">
                <Loader2 className="h-4.5 w-4.5 animate-spin" />
                Saving Project...
              </span>
            ) : isEdit ? (
              "Save Updates"
            ) : (
              "Create Project"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
