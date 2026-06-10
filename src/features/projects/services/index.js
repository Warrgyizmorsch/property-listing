import { db } from "@/lib/db";
import { slugify } from "@/lib/slugify";

/**
 * Fetches projects with search filters, pagination, and sorting.
 */
export async function getProjects({
  search = "",
  categoryId = "",
  status = "",
  sortBy = "createdAt",
  sortOrder = "desc",
  page = 1,
  limit = 10,
  showDeleted = false,
} = {}) {
  try {
    const skip = (page - 1) * limit;

    const where = {
      deletedAt: showDeleted ? { not: null } : null,
    };

    // Text search
    if (search) {
      where.OR = [
        { projectName: { contains: search } },
        { description: { contains: search } },
        { address: { contains: search } },
        { builderName: { contains: search } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (status) {
      where.status = status;
    }

    const orderBy = {};
    if (sortBy === "displayOrder") {
      orderBy.displayOrder = sortOrder;
    } else {
      orderBy.createdAt = sortOrder;
    }

    const [projects, total] = await Promise.all([
      db.project.findMany({
        where,
        skip,
        take: limit,
        include: {
          category: { select: { id: true, name: true } },
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
          properties: {
            where: { deletedAt: null },
            select: {
              id: true,
              status: {
                select: { name: true }
              }
            }
          },
          _count: {
            select: {
              properties: { where: { deletedAt: null } },
            },
          },
        },
        orderBy,
      }),
      db.project.count({ where }),
    ]);

    return {
      projects,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw new Error("Failed to load projects list.");
  }
}

/**
 * Retrieves a single project by ID with its nested children and statistics.
 */
export async function getProjectById(id) {
  try {
    const project = await db.project.findUnique({
      where: { id },
      include: {
        category: true,
        city: {
          include: {
            state: {
              include: { country: true },
            },
          },
        },
        amenities: true,
        specifications: true,
        highlights: true,
        images: {
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    if (!project) return null;

    // Fetch dynamic project statistics
    const [totalProperties, availableProperties, soldProperties, properties] = await Promise.all([
      db.property.count({
        where: { projectId: id, deletedAt: null },
      }),
      db.property.count({
        where: {
          projectId: id,
          deletedAt: null,
          status: { name: { equals: "Available" } },
        },
      }),
      db.property.count({
        where: {
          projectId: id,
          deletedAt: null,
          status: { name: { equals: "Sold" } },
        },
      }),
      db.property.findMany({
        where: { projectId: id, deletedAt: null },
        include: {
          status: true,
          category: true,
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    // Format properties prices to numbers
    const serializedProperties = properties.map((property) => ({
      ...property,
      price: property.price ? Number(property.price) : 0,
    }));

    return {
      ...project,
      totalProperties,
      availableProperties,
      soldProperties,
      properties: serializedProperties,
    };
  } catch (error) {
    console.error("Error retrieving project details:", error);
    throw new Error("Failed to load project details.");
  }
}

/**
 * Ensures a unique slug for projects.
 */
async function getUniqueProjectSlug(baseTitle, excludeId = null) {
  const baseSlug = slugify(baseTitle);
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const conflict = await db.project.findFirst({
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
 * Creates a new project.
 */
export async function createProject(data, userId) {
  const finalSlug = data.slug
    ? await getUniqueProjectSlug(data.slug)
    : await getUniqueProjectSlug(data.projectName);

  const amenitiesList = data.amenities
    ? data.amenities
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean)
    : [];

  const highlightsList = data.highlights
    ? data.highlights
      .split(",")
      .map((h) => h.trim())
      .filter(Boolean)
    : [];

  return db.project.create({
    data: {
      projectName: data.projectName,
      slug: finalSlug,
      address: data.address,
      description: data.description,
      shortDescription: data.shortDescription || null,
      builderName: data.builderName,
      builderPhone: data.builderPhone || "",
      builderEmail: data.builderEmail || "",
      status: data.status,
      bannerImage: data.bannerImage || null,
      mainImage: data.mainImage || null,
      brochureFile: data.brochureFile || null,
      googleMapIframe: data.googleMapIframe || null,
      isFeatured: data.isFeatured || false,
      displayOrder: data.displayOrder || 0,
      category: {
        connect: { id: data.categoryId },
      },
      city: {
        connect: { id: data.cityId },
      },
      createdBy: {
        connect: { id: userId },
      },
      metaTitle: data.metaTitle || null,
      metaDescription: data.metaDescription || null,
      amenities: {
        create: amenitiesList.map((name) => ({ name })),
      },
      highlights: {
        create: highlightsList.map((text) => ({ text })),
      },
      specifications: {
        create: data.specifications || [],
      },
      images: {
        create: data.images && data.images.length > 0
          ? data.images.map((img, idx) => ({
              url: img.url,
              publicId: img.publicId,
              isFeatured: img.isFeatured || (idx === 0 && !data.images.some(i => i.isFeatured)),
              sortOrder: img.sortOrder !== undefined ? img.sortOrder : idx,
            }))
          : [],
      },
    },
  });
}

/**
 * Updates a project.
 */
export async function updateProject(id, data) {
  const finalSlug = data.slug
    ? await getUniqueProjectSlug(data.slug, id)
    : await getUniqueProjectSlug(data.projectName, id);

  const amenitiesList = data.amenities
    ? data.amenities
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean)
    : [];

  const highlightsList = data.highlights
    ? data.highlights
      .split(",")
      .map((h) => h.trim())
      .filter(Boolean)
    : [];

  return db.$transaction(async (tx) => {
    // 1. Delete previous relationships
    await tx.projectAmenity.deleteMany({ where: { projectId: id } });
    await tx.projectHighlight.deleteMany({ where: { projectId: id } });
    await tx.projectSpecification.deleteMany({ where: { projectId: id } });

    // 2. Perform main update
    return tx.project.update({
      where: { id },
      data: {
        projectName: data.projectName,
        slug: finalSlug,
        address: data.address,
        description: data.description,
        shortDescription: data.shortDescription || null,
        builderName: data.builderName,
        builderPhone: data.builderPhone || "",
        builderEmail: data.builderEmail || "",
        status: data.status,
        bannerImage: data.bannerImage || null,
        mainImage: data.mainImage || null,
        brochureFile: data.brochureFile || null,
        googleMapIframe: data.googleMapIframe || null,
        isFeatured: data.isFeatured || false,
        displayOrder: data.displayOrder || 0,
        category: {
          connect: { id: data.categoryId },
        },
        city: {
          connect: { id: data.cityId },
        },
        metaTitle: data.metaTitle || null,
        metaDescription: data.metaDescription || null,
        amenities: {
          create: amenitiesList.map((name) => ({ name })),
        },
        highlights: {
          create: highlightsList.map((text) => ({ text })),
        },
        specifications: {
          create: data.specifications || [],
        },
      },
    });
  });
}

/**
 * Soft deletes a project.
 */
export async function softDeleteProject(id) {
  // Check if there are active properties attached to this project
  const count = await db.property.count({
    where: { projectId: id, deletedAt: null },
  });

  if (count > 0) {
    throw new Error(
      `Cannot delete project. It still contains ${count} active properties. Please delete or move those properties first.`
    );
  }

  return db.project.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}

/**
 * Restores a project.
 */
export async function restoreProject(id) {
  return db.project.update({
    where: { id },
    data: { deletedAt: null },
  });
}

/**
 * Retrieves lists of active drop-down dependencies for project select options.
 */
export async function getProjectFormMetadata() {
  const [categories, countries, projects] = await Promise.all([
    db.category.findMany({
      where: { deletedAt: null },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    db.country.findMany({
      where: { deletedAt: null },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    db.project.findMany({
      where: { deletedAt: null },
      select: { id: true, projectName: true },
      orderBy: { projectName: "asc" },
    }),
  ]);

  return {
    categories,
    countries,
    projects,
  };
}
