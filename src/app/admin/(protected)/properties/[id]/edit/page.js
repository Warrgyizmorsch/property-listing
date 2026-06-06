import React from "react"
import { notFound } from "next/navigation"
import PageHeader from "@/components/admin/PageHeader"
import PropertyForm from "@/features/properties/components/PropertyForm"
import { getPropertyById, getPropertyFormMetadata } from "@/features/properties/services"

export const dynamic = "force-dynamic"

export default async function EditPropertyPage({ params }) {
  const resolvedParams = await params
  const { id } = resolvedParams

  // Fetch dropdown metadata and target property record concurrently
  const [property, metadata] = await Promise.all([
    getPropertyById(id),
    getPropertyFormMetadata(),
  ])

  if (!property) {
    notFound()
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300">
      <PageHeader
        title="Edit Property Listing"
        description={`Modify information, pricing, location data, or specifications for "${property.title}".`}
      />
      <PropertyForm property={property} metadata={metadata} />
    </div>
  )
}
