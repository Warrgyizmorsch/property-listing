import React from "react"
import PageHeader from "@/components/admin/PageHeader"
import PropertyForm from "@/features/properties/components/PropertyForm"
import { getPropertyFormMetadata } from "@/features/properties/services"

export const dynamic = "force-dynamic"

export default async function CreatePropertyPage() {
  // Fetch dropdown dependencies to populate selectors
  const metadata = await getPropertyFormMetadata()

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300">
      <PageHeader
        title="Publish Property"
        description="Add a new property listing details, locations, classifications, and features to the public directory."
      />
      <PropertyForm metadata={metadata} />
    </div>
  )
}
