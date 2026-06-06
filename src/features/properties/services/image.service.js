import { db } from "@/lib/db";

/**
 * Fetches all images for a property ordered by sortOrder.
 * @param {string} propertyId 
 */
export async function getPropertyImages(propertyId) {
  return db.propertyImage.findMany({
    where: { propertyId },
    orderBy: { sortOrder: "asc" },
  });
}

/**
 * Adds an image metadata record to a property.
 * @param {string} propertyId 
 * @param {{ url: string, publicId: string }} imageData 
 */
export async function addPropertyImage(propertyId, { url, publicId }) {
  // 1. Enforce max 10 images limit
  const count = await db.propertyImage.count({
    where: { propertyId },
  });

  if (count >= 10) {
    throw new Error("Maximum limit of 10 images per property reached.");
  }

  // 2. Determine if this is the first image (to mark as featured automatically)
  const isFeatured = count === 0;

  // 3. Determine next sort order index
  const maxSort = await db.propertyImage.aggregate({
    where: { propertyId },
    _max: { sortOrder: true },
  });
  const nextSort = (maxSort._max?.sortOrder ?? -1) + 1;

  // 4. Create the image record
  return db.propertyImage.create({
    data: {
      url,
      publicId,
      isFeatured,
      sortOrder: nextSort,
      propertyId,
    },
  });
}

/**
 * Deletes an image record from the database.
 * If the deleted image was featured, automatically designates the next available image as featured.
 * @param {string} id - The image record ID
 * @returns {Promise<object>} - Returns the deleted image object
 */
export async function deletePropertyImage(id) {
  // Find the image first
  const image = await db.propertyImage.findUnique({
    where: { id },
  });

  if (!image) throw new Error("Image not found.");

  // Delete the record
  await db.propertyImage.delete({
    where: { id },
  });

  // If we deleted the featured image, designate the next available image as featured
  if (image.isFeatured) {
    const nextFeatured = await db.propertyImage.findFirst({
      where: { propertyId: image.propertyId },
      orderBy: { sortOrder: "asc" },
    });

    if (nextFeatured) {
      await db.propertyImage.update({
        where: { id: nextFeatured.id },
        data: { isFeatured: true },
      });
    }
  }

  return image;
}

/**
 * Designates a target image as the single featured image for the property.
 * @param {string} propertyId 
 * @param {string} imageId 
 */
export async function setPropertyFeatured(propertyId, imageId) {
  // Verify image exists
  const image = await db.propertyImage.findUnique({
    where: { id: imageId },
  });

  if (!image || image.propertyId !== propertyId) {
    throw new Error("Image not associated with this property.");
  }

  // Set all images to non-featured, and toggle target to featured inside a transaction
  return db.$transaction([
    db.propertyImage.updateMany({
      where: { propertyId },
      data: { isFeatured: false },
    }),
    db.propertyImage.update({
      where: { id: imageId },
      data: { isFeatured: true },
    }),
  ]);
}

/**
 * Updates the sortOrder for property images sequentially based on the provided list of IDs.
 * @param {string} propertyId 
 * @param {string[]} imageIds - Ordered array of image IDs
 */
export async function updateImagesSortOrder(propertyId, imageIds) {
  return db.$transaction(
    imageIds.map((id, index) =>
      db.propertyImage.update({
        where: { id, propertyId },
        data: { sortOrder: index },
      })
    )
  );
}
