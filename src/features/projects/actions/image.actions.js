"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-helpers";
import { generateUploadSignature, deleteFromCloudinary } from "@/lib/cloudinary";
import { propertyImageSchema } from "@/features/properties/schemas/image.schema"; // Reuse validation schema
import {
  addProjectImage,
  deleteProjectImage,
  setProjectImageFeatured,
  updateProjectImagesSortOrder,
} from "../services/image.service";

/**
 * Action: Generates a Cloudinary signature for direct-to-cloud uploads.
 * @param {string} projectId 
 */
export async function getUploadSignatureAction(projectId) {
  try {
    await requireAdmin();
    if (!projectId) {
      return { success: false, error: "Project ID is required." };
    }

    const folder = `property-listing/projects/${projectId}`;
    const credentials = generateUploadSignature(folder);

    return { success: true, credentials, folder };
  } catch (error) {
    console.error("Action error generating signature:", error);
    return { success: false, error: error.message || "Failed to generate upload signature." };
  }
}

/**
 * Action: Saves uploaded image metadata to database.
 * @param {string} projectId 
 * @param {object} payload - contains { url, publicId }
 */
export async function saveUploadedImageAction(projectId, payload) {
  try {
    await requireAdmin();
    if (!projectId) {
      return { success: false, error: "Project ID is required." };
    }

    const validated = propertyImageSchema.safeParse(payload);
    if (!validated.success) {
      const msg = validated.error.errors.map((e) => e.message).join(" ");
      return { success: false, error: msg || "Invalid image details." };
    }

    const newImage = await addProjectImage(projectId, validated.data);

    revalidatePath(`/admin/projects/${projectId}/images`);
    revalidatePath(`/admin/projects/${projectId}`);
    revalidatePath("/admin/projects");

    return { success: true, image: newImage };
  } catch (error) {
    console.error("Action error saving image metadata:", error);
    return { success: false, error: error.message || "Failed to save image." };
  }
}

/**
 * Action: Deletes an image record and destroys the asset on Cloudinary.
 * @param {string} id - Database image record ID
 * @param {string} projectId - Project ID context for revalidation
 */
export async function deleteImageAction(id, projectId) {
  try {
    await requireAdmin();
    if (!id || !projectId) {
      return { success: false, error: "Image ID and Project ID are required." };
    }

    const deletedImage = await deleteProjectImage(id);

    try {
      if (deletedImage.publicId) {
        await deleteFromCloudinary(deletedImage.publicId);
      }
    } catch (cloudError) {
      console.error("Warning: Failed to destroy remote Cloudinary asset:", cloudError);
    }

    revalidatePath(`/admin/projects/${projectId}/images`);
    revalidatePath(`/admin/projects/${projectId}`);
    revalidatePath("/admin/projects");

    return { success: true };
  } catch (error) {
    console.error("Action error deleting image:", error);
    return { success: false, error: error.message || "Failed to delete image." };
  }
}

/**
 * Action: Sets an image as featured.
 */
export async function setImageFeaturedAction(projectId, imageId) {
  try {
    await requireAdmin();
    if (!projectId || !imageId) {
      return { success: false, error: "Project ID and Image ID are required." };
    }

    await setProjectImageFeatured(projectId, imageId);

    revalidatePath(`/admin/projects/${projectId}/images`);
    revalidatePath(`/admin/projects/${projectId}`);
    revalidatePath("/admin/projects");

    return { success: true };
  } catch (error) {
    console.error("Action error setting featured image:", error);
    return { success: false, error: error.message || "Failed to set featured image." };
  }
}

/**
 * Action: Updates sortOrder sequence of images.
 */
export async function updateImagesOrderAction(projectId, imageIds) {
  try {
    await requireAdmin();
    if (!projectId || !Array.isArray(imageIds)) {
      return { success: false, error: "Project ID and image list are required." };
    }

    await updateProjectImagesSortOrder(projectId, imageIds);

    revalidatePath(`/admin/projects/${projectId}/images`);

    return { success: true };
  } catch (error) {
    console.error("Action error updating images sort order:", error);
    return { success: false, error: error.message || "Failed to update images order." };
  }
}
