import React from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import PageHeader from "@/components/admin/PageHeader"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import ProjectImageUploader from "@/features/projects/components/ProjectImageUploader"
import ProjectImageGallery from "@/features/projects/components/ProjectImageGallery"
import { getProjectById } from "@/features/projects/services"
import { getProjectImages } from "@/features/projects/services/image.service"

export const dynamic = "force-dynamic"

export default async function ProjectImagesPage({ params }) {
  const resolvedParams = await params
  const { id } = resolvedParams

  const [project, images] = await Promise.all([
    getProjectById(id),
    getProjectImages(id),
  ])

  if (!project) {
    notFound()
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <PageHeader
          title="Project Photos"
          description={`Manage image gallery, reorder display sequences, and set cover image for "${project.projectName}".`}
        />
        
        <Button
          variant="outline"
          asChild
          className="border-neutral-200 hover:bg-neutral-50 h-10 text-xs font-semibold text-neutral-700 cursor-pointer self-start md:self-auto"
        >
          <Link href="/admin/projects">
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Link>
        </Button>
      </div>

      {/* Upload Zone */}
      <div className="bg-white border border-neutral-200 rounded-lg p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-neutral-800 uppercase tracking-wider">
          Upload New Photos
        </h3>
        <ProjectImageUploader projectId={id} currentCount={images.length} />
      </div>

      {/* Gallery Grid */}
      <div className="bg-white border border-neutral-200 rounded-lg p-6 shadow-xs">
        <ProjectImageGallery images={images} projectId={id} />
      </div>

    </div>
  )
}
