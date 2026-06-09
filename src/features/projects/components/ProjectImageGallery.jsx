"use client"

import React, { useTransition } from "react"
import { useRouter } from "next/navigation"
import { Image as ImageIcon } from "lucide-react"
import ProjectImageCard from "./ProjectImageCard"
import {
  deleteImageAction,
  setImageFeaturedAction,
  updateImagesOrderAction,
} from "../actions/image.actions"
import { toast } from "@/components/ui/toast"

export default function ProjectImageGallery({ images = [], projectId }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleMove = (index, direction) => {
    const targetIndex = direction === "left" ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= images.length) return

    // Create a swapped array of IDs
    const reorderedIds = images.map((img) => img.id)
    const temp = reorderedIds[index]
    reorderedIds[index] = reorderedIds[targetIndex]
    reorderedIds[targetIndex] = temp

    startTransition(async () => {
      const result = await updateImagesOrderAction(projectId, reorderedIds)
      if (result.success) {
        toast.success("Project image order updated.")
        router.refresh()
      } else {
        toast.error(result.error || "Failed to update image order.")
      }
    })
  }

  const handleDelete = (id, url) => {
    const confirm = window.confirm("Are you sure you want to delete this project photo? This will permanently remove it from Cloudinary and database records.")
    if (!confirm) return

    startTransition(async () => {
      const result = await deleteImageAction(id, projectId)
      if (result.success) {
        toast.success("Image deleted successfully.")
        router.refresh()
      } else {
        toast.error(result.error || "Failed to delete image.")
      }
    })
  }

  const handleSetFeatured = (imageId) => {
    startTransition(async () => {
      const result = await setImageFeaturedAction(projectId, imageId)
      if (result.success) {
        toast.success("Featured project cover image updated.")
        router.refresh()
      } else {
        toast.error(result.error || "Failed to set featured image.")
      }
    })
  }

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border border-dashed border-neutral-200 bg-white rounded-lg text-center">
        <ImageIcon className="h-10 w-10 text-neutral-300 mb-3" />
        <h3 className="text-sm font-semibold text-neutral-900">No gallery images uploaded</h3>
        <p className="text-xs text-neutral-500 mt-1 max-w-sm">
          Use the direct dropzone uploader above to attach project photos. Up to 10 photos can be configured.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
        <h3 className="text-sm font-bold text-neutral-800 uppercase tracking-wider">
          Project Photo Gallery ({images.length} / 10)
        </h3>
        <span className="text-xs text-neutral-400 font-medium">
          Sequence numbers update automatically on moving left/right.
        </span>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {images.map((image, index) => (
          <ProjectImageCard
            key={image.id}
            image={image}
            isFirst={index === 0}
            isLast={index === images.length - 1}
            onMoveLeft={() => handleMove(index, "left")}
            onMoveRight={() => handleMove(index, "right")}
            onDelete={() => handleDelete(image.id, image.url)}
            onSetFeatured={() => handleSetFeatured(image.id)}
            disabled={isPending}
          />
        ))}
      </div>
    </div>
  )
}
