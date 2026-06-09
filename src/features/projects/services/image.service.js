import { db } from "@/lib/db";

/**
 * Retrieves all images for a specific project sorted by display order.
 */
export async function getProjectImages(projectId) {
  return db.projectImage.findMany({
    where: { projectId },
    orderBy: { sortOrder: "asc" },
  });
}

/**
 * Saves a new project gallery image record.
 */
export async function addProjectImage(projectId, { url, publicId }) {
  // Check if this is the first image, set as featured if so
  const count = await db.projectImage.count({
    where: { projectId },
  });

  const isFeatured = count === 0;

  return db.projectImage.create({
    data: {
      url,
      publicId,
      isFeatured,
      sortOrder: count,
      projectId,
    },
  });
}

/**
 * Deletes an image record from DB. Re-allocates featured flag to next image if deleted was featured.
 */
export async function deleteProjectImage(id) {
  const image = await db.projectImage.findUnique({
    where: { id },
  });

  if (!image) throw new Error("Image not found.");

  await db.projectImage.delete({
    where: { id },
  });

  // If deleted image was featured, shift featured flag to another image
  if (image.isFeatured) {
    const nextImage = await db.projectImage.findFirst({
      where: { projectId: image.projectId },
      orderBy: { sortOrder: "asc" },
    });

    if (nextImage) {
      await db.projectImage.update({
        where: { id: nextImage.id },
        data: { isFeatured: true },
      });
    }
  }

  return image;
}

/**
 * Designates a single image as featured, clearing it for all other sibling images.
 */
export async function setProjectImageFeatured(projectId, imageId) {
  return db.$transaction([
    db.projectImage.updateMany({
      where: { projectId, isFeatured: true },
      data: { isFeatured: false },
    }),
    db.projectImage.update({
      where: { id: imageId },
      data: { isFeatured: true },
    }),
  ]);
}

/**
 * Updates sortOrder values for an ordered sequence of images.
 */
export async function updateProjectImagesSortOrder(projectId, imageIds) {
  const updates = imageIds.map((id, index) =>
    db.projectImage.update({
      where: { id, projectId },
      data: { sortOrder: index },
    })
  );

  return db.$transaction(updates);
}
