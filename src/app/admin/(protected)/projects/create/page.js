import React from "react"
import PageHeader from "@/components/admin/PageHeader"
import ProjectForm from "@/features/projects/components/ProjectForm"
import { getProjectFormMetadata } from "@/features/projects/services"

export const dynamic = "force-dynamic"

export default async function CreateProjectPage() {
  const metadata = await getProjectFormMetadata()

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300">
      <PageHeader
        title="Add Real Estate Project"
        description="Launch a new master development parent entity with specifications, brochure assets, and interactive location cascading."
      />
      <ProjectForm metadata={metadata} />
    </div>
  )
}
