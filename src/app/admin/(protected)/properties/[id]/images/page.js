import React from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import PageHeader from "@/components/admin/PageHeader"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import PropertyImageUploader from "@/features/properties/components/PropertyImageUploader"
import PropertyImageGallery from "@/features/properties/components/PropertyImageGallery"
import { getPropertyById } from "@/features/properties/services"
import { getPropertyImages } from "@/features/properties/services/image.service"

export const dynamic = "force-dynamic"

export default async function PropertyImagesPage({ params }) {
  const resolvedParams = await params
  const { id } = resolvedParams

  // 1. Fetch property and its associated images concurrently
  const [property, images] = await Promise.all([
    getPropertyById(id),
    getPropertyImages(id),
  ])

  if (!property) {
    notFound()
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <PageHeader
          title="Property Photos"
          description={`Manage image gallery, reorder display sequences, and set primary cover for "${property.title}".`}
        />

        <Button
          variant="outline"
          asChild
          className="border-neutral-200 hover:bg-neutral-50 h-10 text-xs font-semibold text-neutral-700 cursor-pointer self-start md:self-auto"
        >
          <Link href="/admin/properties" className="flex items-center">
            <ArrowLeft className="h-4 w-4" />
            Back to Listings
          </Link>
        </Button>
      </div>

      {/* 2. Drag & Drop Direct Uploader Dropzone */}
      <div className="bg-white border border-neutral-200 rounded-lg p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-neutral-800 uppercase tracking-wider">
          Upload New Photos
        </h3>
        <PropertyImageUploader propertyId={id} currentCount={images.length} />
      </div>

      {/* 3. Image Gallery Manager Grid */}
      <div className="bg-white border border-neutral-200 rounded-lg p-6 shadow-xs">
        <PropertyImageGallery images={images} propertyId={id} />
      </div>

    </div>
  )
}
