"use client"

import React, { useTransition } from "react"
import { useRouter } from "next/navigation"
import { Image as ImageIcon } from "lucide-react"
import PropertyImageCard from "./PropertyImageCard"
import {
  deleteImageAction,
  setImageFeaturedAction,
  updateImagesOrderAction,
} from "../actions/image.actions"
import { toast } from "@/components/ui/toast"

export default function PropertyImageGallery({ images = [], propertyId }) {
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
      const result = await updateImagesOrderAction(propertyId, reorderedIds)
      if (result.success) {
        toast.success("Image sort order updated.")
        router.refresh()
      } else {
        toast.error(result.error || "Failed to update image order.")
      }
    })
  }

  const handleDelete = (id, url) => {
    // Confirm delete trigger
    const confirm = window.confirm("Are you sure you want to delete this image? This will permanently remove it from Cloudinary and the database.")
    if (!confirm) return

    startTransition(async () => {
      const result = await deleteImageAction(id, propertyId)
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
      const result = await setImageFeaturedAction(propertyId, imageId)
      if (result.success) {
        toast.success("Featured image updated.")
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
        <h3 className="text-sm font-semibold text-neutral-900">No images uploaded</h3>
        <p className="text-xs text-neutral-500 mt-1 max-w-sm">
          Use the dropzone above to upload property photos. Up to 10 photos can be configured.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
        <h3 className="text-sm font-bold text-neutral-800 uppercase tracking-wider">
          Property Photo Gallery ({images.length} / 10)
        </h3>
        <span className="text-xs text-neutral-400 font-medium">
          Drag/reorder controls update sequence numbers automatically.
        </span>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {images.map((image, index) => (
          <PropertyImageCard
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
