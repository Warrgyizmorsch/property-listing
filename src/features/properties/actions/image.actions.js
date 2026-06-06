"use server"

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-helpers";
import { generateUploadSignature, deleteFromCloudinary } from "@/lib/cloudinary";
import { propertyImageSchema } from "../schemas/image.schema";
import {
  addPropertyImage,
  deletePropertyImage,
  setPropertyFeatured,
  updateImagesSortOrder
} from "../services/image.service";

/**
 * Action: Generates a Cloudinary signature for direct-to-cloud uploads.
 * @param {string} propertyId 
 */
export async function getUploadSignatureAction(propertyId) {
  try {
    await requireAdmin();
    if (!propertyId) {
      return { success: false, error: "Property ID is required." };
    }

    const folder = `property-listing/properties/${propertyId}`;
    const credentials = generateUploadSignature(folder);
    
    return { success: true, credentials, folder };
  } catch (error) {
    console.error("Action error generating signature:", error);
    return { success: false, error: error.message || "Failed to generate upload signature." };
  }
}

/**
 * Action: Saves uploaded image metadata to database.
 * @param {string} propertyId 
 * @param {object} payload - contains { url, publicId }
 */
export async function saveUploadedImageAction(propertyId, payload) {
  try {
    await requireAdmin();
    if (!propertyId) {
      return { success: false, error: "Property ID is required." };
    }

    const validated = propertyImageSchema.safeParse(payload);
    if (!validated.success) {
      const msg = validated.error.errors.map((e) => e.message).join(" ");
      return { success: false, error: msg || "Invalid image details." };
    }

    const newImage = await addPropertyImage(propertyId, validated.data);

    revalidatePath(`/admin/properties/${propertyId}/images`);
    revalidatePath("/admin/properties");

    return { success: true, image: newImage };
  } catch (error) {
    console.error("Action error saving image metadata:", error);
    return { success: false, error: error.message || "Failed to save image." };
  }
}

/**
 * Action: Deletes an image record and destroys the asset on Cloudinary.
 * @param {string} id - Database image record ID
 * @param {string} propertyId - Property ID context for revalidation
 */
export async function deleteImageAction(id, propertyId) {
  try {
    await requireAdmin();
    if (!id || !propertyId) {
      return { success: false, error: "Image ID and Property ID are required." };
    }

    // 1. Delete database record (handles auto-featured fallback shifting internally)
    const deletedImage = await deletePropertyImage(id);

    // 2. Destroy asset on Cloudinary
    try {
      if (deletedImage.publicId) {
        await deleteFromCloudinary(deletedImage.publicId);
      }
    } catch (cloudError) {
      // Log Cloudinary deletion failure but do not crash the action since DB was already cleaned
      console.error("Warning: Failed to destroy remote Cloudinary asset:", cloudError);
    }

    revalidatePath(`/admin/properties/${propertyId}/images`);
    revalidatePath("/admin/properties");

    return { success: true };
  } catch (error) {
    console.error("Action error deleting image:", error);
    return { success: false, error: error.message || "Failed to delete image." };
  }
}

/**
 * Action: Sets an image as featured.
 */
export async function setImageFeaturedAction(propertyId, imageId) {
  try {
    await requireAdmin();
    if (!propertyId || !imageId) {
      return { success: false, error: "Property ID and Image ID are required." };
    }

    await setPropertyFeatured(propertyId, imageId);

    revalidatePath(`/admin/properties/${propertyId}/images`);
    revalidatePath("/admin/properties");

    return { success: true };
  } catch (error) {
    console.error("Action error setting featured image:", error);
    return { success: false, error: error.message || "Failed to set featured image." };
  }
}

/**
 * Action: Updates sortOrder sequence of images.
 */
export async function updateImagesOrderAction(propertyId, imageIds) {
  try {
    await requireAdmin();
    if (!propertyId || !Array.isArray(imageIds)) {
      return { success: false, error: "Property ID and image list are required." };
    }

    await updateImagesSortOrder(propertyId, imageIds);

    revalidatePath(`/admin/properties/${propertyId}/images`);

    return { success: true };
  } catch (error) {
    console.error("Action error updating images sort order:", error);
    return { success: false, error: error.message || "Failed to update images order." };
  }
}
