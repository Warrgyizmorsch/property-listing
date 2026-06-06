import { db } from "@/lib/db";
import { slugify } from "@/lib/slugify";

/**
 * Fetches properties with search filters, pagination, and sorting.
 */
export async function getProperties({
  search = "",
  categoryId = "",
  purposeId = "",
  statusId = "",
  countryId = "",
  stateId = "",
  cityId = "",
  isFeatured = undefined,
  minPrice = undefined,
  maxPrice = undefined,
  sortBy = "createdAt",
  sortOrder = "desc",
  page = 1,
  limit = 10,
  showDeleted = false,
} = {}) {
  try {
    const skip = (page - 1) * limit;

    // Build the query where parameters
    const where = {
      deletedAt: showDeleted ? { not: null } : null,
    };

    // Text search
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { address: { contains: search } },
      ];
    }

    // Category / Purpose / Status
    if (categoryId) where.categoryId = categoryId;
    if (purposeId) where.purposeId = purposeId;
    if (statusId) where.statusId = statusId;

    // Hierarchical Location Query
    if (cityId) {
      where.cityId = cityId;
    } else if (stateId) {
      where.city = { stateId };
    } else if (countryId) {
      where.city = { state: { countryId } };
    }

    // Featured property toggle
    if (isFeatured !== undefined) {
      where.isFeatured = isFeatured;
    }

    // Price range bounds
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    // Build order parameters
    const orderBy = {};
    if (sortBy === "price") {
      orderBy.price = sortOrder;
    } else {
      orderBy.createdAt = sortOrder;
    }

    const [properties, total] = await Promise.all([
      db.property.findMany({
        where,
        skip,
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
                  country: { select: { id: true, name: true } },
                },
              },
            },
          },
          images: {
            where: { isFeatured: true },
            take: 1,
          },
        },
        orderBy,
      }),
      db.property.count({ where }),
    ]);

    const serializedProperties = properties.map((property) => ({
      ...property,
      price: property.price ? Number(property.price) : 0,
    }));

    return {
      properties: serializedProperties,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("Error fetching properties:", error);
    throw new Error("Failed to load properties list.");
  }
}

/**
 * Retrieves a single property by ID, including complete location tree structures.
 */
export async function getPropertyById(id) {
  const property = await db.property.findUnique({
    where: { id },
    include: {
      category: true,
      purpose: true,
      status: true,
      city: {
        include: {
          state: {
            include: { country: true },
          },
        },
      },
      images: true,
    },
  });

  if (!property) return null;

  return {
    ...property,
    price: property.price ? Number(property.price) : 0,
  };
}

/**
 * Ensures a unique slug by appending numeric suffixes if a duplicate slug is detected.
 */
async function getUniqueSlug(baseTitle, excludeId = null) {
  const baseSlug = slugify(baseTitle);
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const conflict = await db.property.findFirst({
      where: {
        slug,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
    });

    if (!conflict) break;
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

/**
 * Creates a new property listing with default placeholder image reference.
 */
export async function createProperty(data, userId) {
  const finalSlug = data.slug
    ? await getUniqueSlug(data.slug)
    : await getUniqueSlug(data.title);

  return db.property.create({
    data: {
      title: data.title,
      slug: finalSlug,
      description: data.description,
      price: data.price,
      address: data.address,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      areaSize: data.areaSize,
      contactNumber: data.contactNumber || null,
      isFeatured: data.isFeatured || false,
      categoryId: data.categoryId,
      purposeId: data.purposeId,
      statusId: data.statusId,
      cityId: data.cityId,
      createdById: userId,
      // Create mock placeholder image reference
      images: {
        create: {
          url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800",
          isFeatured: true,
          sortOrder: 0,
        },
      },
    },
  });
}

/**
 * Updates an existing property record.
 */
export async function updateProperty(id, data) {
  const finalSlug = data.slug
    ? await getUniqueSlug(data.slug, id)
    : await getUniqueSlug(data.title, id);

  return db.property.update({
    where: { id },
    data: {
      title: data.title,
      slug: finalSlug,
      description: data.description,
      price: data.price,
      address: data.address,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      areaSize: data.areaSize,
      contactNumber: data.contactNumber || null,
      isFeatured: data.isFeatured || false,
      categoryId: data.categoryId,
      purposeId: data.purposeId,
      statusId: data.statusId,
      cityId: data.cityId,
    },
  });
}

/**
 * Soft deletes a property.
 */
export async function softDeleteProperty(id) {
  return db.property.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}

/**
 * Restores a soft-deleted property.
 */
export async function restoreProperty(id) {
  return db.property.update({
    where: { id },
    data: { deletedAt: null },
  });
}

/**
 * Flips the featured property state of a listing.
 */
export async function togglePropertyFeatured(id) {
  const property = await db.property.findUnique({
    where: { id },
    select: { isFeatured: true },
  });
  if (!property) throw new Error("Property not found.");

  return db.property.update({
    where: { id },
    data: { isFeatured: !property.isFeatured },
  });
}

/**
 * Changes active status ID of a property.
 */
export async function changePropertyStatus(id, statusId) {
  return db.property.update({
    where: { id },
    data: { statusId },
  });
}

/**
 * Retrieves lists of active drop-down dependencies for select options.
 */
export async function getPropertyFormMetadata() {
  const [categories, purposes, statuses, countries] = await Promise.all([
    db.category.findMany({ where: { deletedAt: null }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
    db.propertyPurpose.findMany({ where: { deletedAt: null }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
    db.propertyStatus.findMany({ where: { deletedAt: null }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
    db.country.findMany({ where: { deletedAt: null }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);

  return {
    categories,
    purposes,
    statuses,
    countries,
  };
}
