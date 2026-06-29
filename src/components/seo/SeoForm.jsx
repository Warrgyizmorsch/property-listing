"use client";

import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { seoSettingSchema } from "@/features/seo/schemas/seo.schema";
import { saveSeoSettingAction } from "@/features/seo/actions/seo.actions";
import SeoPreview from "./SeoPreview";
import { Globe, Share2, Loader2, Save } from "lucide-react";

export default function SeoForm({ pageType, initialData }) {
  const [activeTab, setActiveTab] = useState("meta");
  const [isPending, startTransition] = useTransition();

  // Initialize react-hook-form with Zod validation
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
    reset,
  } = useForm({
    resolver: zodResolver(seoSettingSchema),
    defaultValues: {
      metaTitle: initialData?.metaTitle || "",
      metaDescription: initialData?.metaDescription || "",
      metaKeywords: initialData?.metaKeywords || "",
      ogTitle: initialData?.ogTitle || "",
      ogDescription: initialData?.ogDescription || "",
      ogImage: initialData?.ogImage || "",
      canonicalUrl: initialData?.canonicalUrl || "",
    },
  });

  // Watch inputs for live Google snippet preview
  const watchedTitle = watch("metaTitle");
  const watchedDescription = watch("metaDescription");

  const onSubmit = (values) => {
    startTransition(async () => {
      const result = await saveSeoSettingAction(pageType, values);
      if (result.success) {
        toast.success(`${pageType.replace(/_/g, " ")} SEO settings updated successfully!`);
        // Reset to new values to clear isDirty state
        reset(values);
      } else {
        toast.error(result.error || "Failed to update SEO settings.");
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Edit Form Panel */}
      <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-7 space-y-6">
        <Card className="shadow-md border-slate-100 bg-white">
          <CardHeader className="border-b border-slate-100/80">
            <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Globe className="h-5 w-5 text-[var(--brand-secondary)]" />
              Configure Page SEO
            </CardTitle>
            <CardDescription>
              Set up metadata overrides for the {pageType.toLowerCase().replace(/_/g, " ")} page.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* Custom Tab Triggers */}
            <div className="flex border-b border-slate-200">
              <button
                type="button"
                onClick={() => setActiveTab("meta")}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-all -mb-px ${
                  activeTab === "meta"
                    ? "border-[var(--brand-secondary)] text-[var(--brand-primary)]"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                <Globe className="h-4 w-4" />
                Search Engines (Meta)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("og")}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-all -mb-px ${
                  activeTab === "og"
                    ? "border-[var(--brand-secondary)] text-[var(--brand-primary)]"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                <Share2 className="h-4 w-4" />
                Social Sharing (Open Graph)
              </button>
            </div>

            {/* Tab 1: Search Engine Options */}
            {activeTab === "meta" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="metaTitle">Meta Title</Label>
                  <Input
                    id="metaTitle"
                    placeholder="e.g. Luxury Homes & Villas For Sale | MyBrand"
                    {...register("metaTitle")}
                  />
                  {errors.metaTitle && (
                    <p className="text-xs text-red-500">{errors.metaTitle.message}</p>
                  )}
                  <p className="text-[11px] text-slate-400">
                    Recommended length is under 60 characters. Shows up as the clickable headline in search results.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea
                    id="metaDescription"
                    placeholder="e.g. Explore hundreds of exclusive luxury listings, premium apartments, and villas in prime neighborhoods."
                    rows={4}
                    {...register("metaDescription")}
                  />
                  {errors.metaDescription && (
                    <p className="text-xs text-red-500">{errors.metaDescription.message}</p>
                  )}
                  <p className="text-[11px] text-slate-400">
                    Recommended length is under 160 characters. Summarizes the page content under the headline in search results.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metaKeywords">Keywords</Label>
                  <Input
                    id="metaKeywords"
                    placeholder="e.g. villa for sale, real estate india, luxury apartments"
                    {...register("metaKeywords")}
                  />
                  {errors.metaKeywords && (
                    <p className="text-xs text-red-500">{errors.metaKeywords.message}</p>
                  )}
                  <p className="text-[11px] text-slate-400">
                    Optional. Enter comma-separated terms. (Note: Search engines mostly ignore keywords, but useful for tagging).
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="canonicalUrl">Canonical URL</Label>
                  <Input
                    id="canonicalUrl"
                    placeholder="e.g. https://www.yourdomain.com/custom-slug"
                    {...register("canonicalUrl")}
                  />
                  {errors.canonicalUrl && (
                    <p className="text-xs text-red-500">{errors.canonicalUrl.message}</p>
                  )}
                  <p className="text-[11px] text-slate-400">
                    Optional. Specify absolute URL to prevent duplicate content crawling penalties. Leaves blank to auto-resolve.
                  </p>
                </div>
              </div>
            )}

            {/* Tab 2: Social Media (Open Graph & Twitter) */}
            {activeTab === "og" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ogTitle">Social Sharing Title (og:title)</Label>
                  <Input
                    id="ogTitle"
                    placeholder="Overrides meta title on Facebook/Twitter previews"
                    {...register("ogTitle")}
                  />
                  {errors.ogTitle && (
                    <p className="text-xs text-red-500">{errors.ogTitle.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ogDescription">Social Sharing Description (og:description)</Label>
                  <Textarea
                    id="ogDescription"
                    placeholder="Overrides meta description on Facebook/Twitter previews"
                    rows={4}
                    {...register("ogDescription")}
                  />
                  {errors.ogDescription && (
                    <p className="text-xs text-red-500">{errors.ogDescription.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ogImage">Social Sharing Image URL (og:image)</Label>
                  <Input
                    id="ogImage"
                    placeholder="e.g. https://res.cloudinary.com/.../og-preview.jpg"
                    {...register("ogImage")}
                  />
                  {errors.ogImage && (
                    <p className="text-xs text-red-500">{errors.ogImage.message}</p>
                  )}
                  <p className="text-[11px] text-slate-400">
                    Recommended dimensions: 1200x630 pixels. Paste an absolute URL of a hosted image asset.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
          
          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-4 rounded-b-lg">
            <span className="text-xs text-slate-400 font-medium">
              {!isDirty ? "All settings up-to-date" : "Unsaved changes detect"}
            </span>
            <Button
              type="submit"
              disabled={isPending || (!isDirty)}
              className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white shrink-0 gap-2 font-medium transition-all"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save SEO Settings
                </>
              )}
            </Button>
          </div>
        </Card>
      </form>

      {/* Live Snippet Preview Panel */}
      <div className="lg:col-span-5 sticky top-6">
        <SeoPreview
          title={watchedTitle}
          description={watchedDescription}
          pageType={pageType}
        />
      </div>
    </div>
  );
}
