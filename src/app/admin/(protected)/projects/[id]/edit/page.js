import React from "react"
import { notFound } from "next/navigation"
import PageHeader from "@/components/admin/PageHeader"
import ProjectForm from "@/features/projects/components/ProjectForm"
import { getProjectById, getProjectFormMetadata } from "@/features/projects/services"

export const dynamic = "force-dynamic"

export default async function EditProjectPage({ params }) {
  const resolvedParams = await params
  const { id } = resolvedParams

  const [project, metadata] = await Promise.all([
    getProjectById(id),
    getProjectFormMetadata(),
  ])

  if (!project) {
    notFound()
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300">
      <PageHeader
        title="Edit Project Listing"
        description={`Modify information, builder information, files, specifications, or location details for "${project.projectName}".`}
      />
      <ProjectForm project={project} metadata={metadata} />
    </div>
  )
}
