import { db } from "@/lib/db";

/**
 * Fetches an active property listing by its slug, including category,
 * purpose, status, location tree (city -> state -> country), and gallery images.
 * Serializes Decimal price field to standard Number.
 */
export async function getPropertyDetails(slug) {
  if (!slug) return null;

  try {
    const property = await db.property.findFirst({
      where: {
        slug,
        deletedAt: null,
      },
      include: {
        category: true,
        purpose: true,
        status: true,
        city: {
          include: {
            state: {
              include: {
                country: true,
              },
            },
          },
        },
        images: {
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    if (!property) return null;

    return {
      ...property,
      price: property.price ? Number(property.price) : 0,
    };
  } catch (error) {
    console.error("Error fetching property details by slug:", error);
    return null;
  }
}

/**
 * Fetches up to 'limit' related properties matching the category ID or city ID
 * of the current property, excluding the current property itself.
 * Prioritizes featured listings, then newer listings.
 */
export async function getRelatedProperties({
  propertyId,
  categoryId,
  cityId,
  limit = 4,
} = {}) {
  if (!propertyId) return [];

  try {
    const properties = await db.property.findMany({
      where: {
        deletedAt: null,
        id: { not: propertyId },
        OR: [
          { categoryId },
          { cityId },
        ],
      },
      take: limit,
      include: {
        category: { select: { id: true, name: true } },
        purpose: { select: { id: true, name: true } },
        status: { select: { id: true, name: true, colorClass: true } },
        city: {
          select: {
            id: true,
            name: true,
            state: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        images: {
          orderBy: [
            { isFeatured: "desc" },
            { sortOrder: "asc" }
          ],
          take: 1,
        },
      },
      orderBy: [
        { isFeatured: "desc" },
        { createdAt: "desc" },
      ],
    });

    return properties.map((property) => ({
      ...property,
      price: property.price ? Number(property.price) : 0,
    }));
  } catch (error) {
    console.error("Error fetching related properties:", error);
    return [];
  }
}
