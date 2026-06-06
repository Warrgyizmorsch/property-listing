import { db } from "@/lib/db";
import { slugify } from "@/lib/slugify";

/**
 * Fetches categories with search filtering, pagination, and soft-delete states.
 */
export async function getCategories({ search = "", page = 1, limit = 10, showDeleted = false } = {}) {
  try {
    const skip = (page - 1) * limit;

    const where = {
      deletedAt: showDeleted ? { not: null } : null,
      ...(search
        ? {
            OR: [
              { name: { contains: search } },
              { slug: { contains: search } },
            ],
          }
        : {}),
    };

    const [categories, total] = await Promise.all([
      db.category.findMany({
        where,
        skip,
        take: limit,
        include: {
          _count: {
            select: {
              properties: {
                where: { deletedAt: null }, // Only count active properties
              },
            },
          },
        },
        orderBy: { name: "asc" },
      }),
      db.category.count({ where }),
    ]);

    return {
      categories,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to load categories.");
  }
}

/**
 * Retrieves a single category by ID.
 */
export async function getCategoryById(id) {
  return db.category.findUnique({
    where: { id },
  });
}

/**
 * Creates a new category. Checks for unique name and slug first.
 */
export async function createCategory({ name, slug }) {
  const generatedSlug = slug ? slugify(slug) : slugify(name);

  // Check for duplicates (active or archived)
  const existing = await db.category.findFirst({
    where: {
      OR: [
        { name: { equals: name } },
        { slug: { equals: generatedSlug } },
      ],
    },
  });

  if (existing) {
    if (existing.deletedAt === null) {
      throw new Error(`A category with the name "${name}" or slug "${generatedSlug}" already exists.`);
    } else {
      throw new Error(`A category with the name "${name}" exists in the archive (deleted). Please restore it or use a different name.`);
    }
  }

  return db.category.create({
    data: {
      name,
      slug: generatedSlug,
    },
  });
}

/**
 * Updates an existing category name or slug.
 */
export async function updateCategory(id, { name, slug }) {
  const generatedSlug = slug ? slugify(slug) : slugify(name);

  // Check for duplicate name/slug in other categories
  const existing = await db.category.findFirst({
    where: {
      NOT: { id },
      OR: [
        { name: { equals: name } },
        { slug: { equals: generatedSlug } },
      ],
    },
  });

  if (existing) {
    if (existing.deletedAt === null) {
      throw new Error(`Another active category with the name "${name}" or slug "${generatedSlug}" already exists.`);
    } else {
      throw new Error(`A category with the name "${name}" exists in the archive (deleted). Please restore it or use a different name.`);
    }
  }

  return db.category.update({
    where: { id },
    data: {
      name,
      slug: generatedSlug,
    },
  });
}

/**
 * Soft deletes a category. Fails if active properties are assigned.
 */
export async function softDeleteCategory(id) {
  const category = await db.category.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          properties: {
            where: { deletedAt: null }, // Only active properties
          },
        },
      },
    },
  });

  if (!category) {
    throw new Error("Category not found.");
  }

  if (category._count.properties > 0) {
    throw new Error(`Cannot archive category "${category.name}". It contains ${category._count.properties} active properties.`);
  }

  return db.category.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  });
}

/**
 * Restores a soft-deleted category. Fails if name/slug conflicts with an active one.
 */
export async function restoreCategory(id) {
  const category = await db.category.findUnique({
    where: { id },
  });

  if (!category) {
    throw new Error("Category not found.");
  }

  // Check if restoring conflicts with any currently active categories
  const conflict = await db.category.findFirst({
    where: {
      deletedAt: null,
      OR: [
        { name: { equals: category.name } },
        { slug: { equals: category.slug } },
      ],
    },
  });

  if (conflict) {
    throw new Error(`Cannot restore. An active category with the name "${category.name}" or slug "${category.slug}" already exists.`);
  }

  return db.category.update({
    where: { id },
    data: {
      deletedAt: null,
    },
  });
}
