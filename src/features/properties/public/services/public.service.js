import { db } from "@/lib/db";

/**
 * Fetches properties for the public listing page based on search parameters,
 * slugs, limits, sorting, and pagination. Resolves slugs directly in relational structures.
 */
export async function getPublicProperties({
  search = "",
  category = "",
  city = "",
  state = "",
  country = "",
  status = "",
  purpose = "",
  minPrice = undefined,
  maxPrice = undefined,
  bedrooms = undefined,
  bathrooms = undefined,
  isFeatured = undefined,
  sortBy = "latest",
  page = 1,
  limit = 9,
} = {}) {
  try {
    const skip = (page - 1) * limit;

    const where = {
      deletedAt: null,
    };

    // Text search matches title, description, or address
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { address: { contains: search } },
        { description: { contains: search } },
      ];
    }

    // Category filter by slug
    if (category) {
      where.category = { slug: category };
    }

    // Purpose filter by name/slug (buy/sell/rent) - case-insensitive
    if (purpose) {
      where.purpose = { name: { equals: purpose } };
    }

    // Status filter by name (Available/Sold/Under Offer)
    if (status) {
      where.status = { name: { equals: status } };
    }

    // Location hierarchical search by slug
    if (city) {
      where.city = { slug: city };
    } else if (state) {
      where.city = { state: { slug: state } };
    } else if (country) {
      where.city = { state: { country: { slug: country } } };
    }

    // Bedrooms count
    if (bedrooms !== undefined && bedrooms !== null && bedrooms !== "") {
      const bedsStr = bedrooms.toString();
      const bedsNum = parseInt(bedsStr, 10);
      if (!isNaN(bedsNum)) {
        if (bedsStr.includes("+")) {
          where.bedrooms = { gte: bedsNum };
        } else {
          where.bedrooms = bedsNum;
        }
      }
    }

    // Bathrooms count
    if (bathrooms !== undefined && bathrooms !== null && bathrooms !== "") {
      const bathsStr = bathrooms.toString();
      const bathsNum = parseInt(bathsStr, 10);
      if (!isNaN(bathsNum)) {
        if (bathsStr.includes("+")) {
          where.bathrooms = { gte: bathsNum };
        } else {
          where.bathrooms = bathsNum;
        }
      }
    }

    // Price range bounds
    if (minPrice !== undefined && minPrice !== null && minPrice !== "") {
      const minVal = parseFloat(minPrice);
      if (!isNaN(minVal)) {
        where.price = { ...where.price, gte: minVal };
      }
    }
    if (maxPrice !== undefined && maxPrice !== null && maxPrice !== "") {
      const maxVal = parseFloat(maxPrice);
      if (!isNaN(maxVal)) {
        where.price = { ...where.price, lte: maxVal };
      }
    }

    // Featured toggle
    if (isFeatured === true || isFeatured === "true") {
      where.isFeatured = true;
    }

    // Sorting logic mapping
    let orderBy = { createdAt: "desc" };
    if (sortBy === "oldest") {
      orderBy = { createdAt: "asc" };
    } else if (sortBy === "price-asc") {
      orderBy = { price: "asc" };
    } else if (sortBy === "price-desc") {
      orderBy = { price: "desc" };
    }

    const [properties, total] = await Promise.all([
      db.property.findMany({
        where,
        skip,
        take: limit,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          purpose: { select: { id: true, name: true } },
          status: { select: { id: true, name: true, colorClass: true } },
          city: {
            select: {
              id: true,
              name: true,
              slug: true,
              state: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  country: { select: { id: true, name: true, slug: true } },
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
        orderBy,
      }),
      db.property.count({ where }),
    ]);

    // Serialize Decimal price values to standard Number objects
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
    console.error("Error executing public properties service query:", error);
    return {
      properties: [],
      total: 0,
      page,
      limit,
      totalPages: 0,
    };
  }
}

/**
 * Retrieves lists of active categories (with properties count), purposes, statuses,
 * and hierarchical location layers to feed filter parameters.
 */
export async function getPublicFiltersMetadata() {
  try {
    const [categories, purposes, statuses, countries, states, cities] = await Promise.all([
      // Category listing with active property counts
      db.category.findMany({
        where: { deletedAt: null },
        include: {
          _count: {
            select: {
              properties: {
                where: { deletedAt: null },
              },
            },
          },
        },
        orderBy: { name: "asc" },
      }),

      // Purposes
      db.propertyPurpose.findMany({
        where: { deletedAt: null },
        orderBy: { name: "asc" },
      }),

      // Badges
      db.propertyStatus.findMany({
        where: { deletedAt: null },
        orderBy: { name: "asc" },
      }),

      // Location tiers
      db.country.findMany({
        where: { deletedAt: null },
        orderBy: { name: "asc" },
      }),
      db.state.findMany({
        where: { deletedAt: null },
        orderBy: { name: "asc" },
      }),
      db.city.findMany({
        where: { deletedAt: null },
        orderBy: { name: "asc" },
      }),
    ]);

    return {
      categories,
      purposes,
      statuses,
      countries,
      states,
      cities,
    };
  } catch (error) {
    console.error("Error executing public filters metadata query:", error);
    return {
      categories: [],
      purposes: [],
      statuses: [],
      countries: [],
      states: [],
      cities: [],
    };
  }
}
