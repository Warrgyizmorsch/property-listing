import { db } from "@/lib/db";

/**
 * Fetches projects for the public catalog listing page based on search parameters,
 * slugs, limits, sorting, and pagination.
 */
export async function getPublicProjects({
  search = "",
  category = "",
  city = "",
  state = "",
  country = "",
  status = "",
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

    // Text search matches projectName, builderName, address, or description
    if (search) {
      where.OR = [
        { projectName: { contains: search } },
        { builderName: { contains: search } },
        { address: { contains: search } },
        { description: { contains: search } },
      ];
    }

    // Category filter by slug
    if (category) {
      where.category = { slug: category };
    }

    // Project status filter
    if (status) {
      where.status = status;
    }

    // Location hierarchical search by slug
    if (city) {
      where.city = { slug: city };
    } else if (state) {
      where.city = { state: { slug: state } };
    } else if (country) {
      where.city = { state: { country: { slug: country } } };
    }

    // Featured filter
    if (isFeatured === true || isFeatured === "true") {
      where.isFeatured = true;
    }

    // Sorting logic mapping
    let orderBy = { createdAt: "desc" };
    if (sortBy === "oldest") {
      orderBy = { createdAt: "asc" };
    } else if (sortBy === "order") {
      orderBy = { displayOrder: "asc" };
    } else if (sortBy === "name-asc") {
      orderBy = { projectName: "asc" };
    }

    const [projects, total] = await Promise.all([
      db.project.findMany({
        where,
        skip,
        take: limit,
        include: {
          category: { select: { id: true, name: true, slug: true } },
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
          properties: {
            where: { deletedAt: null },
            select: {
              id: true,
              price: true,
              areaSize: true,
              status: { select: { name: true } },
            },
          },
          images: {
            where: { isFeatured: true },
            take: 1,
          },
        },
        orderBy,
      }),
      db.project.count({ where }),
    ]);

    // Format and calculate dynamic properties metrics
    const formattedProjects = projects.map((project) => {
      const totalProps = project.properties?.length || 0;
      const availableProps = project.properties?.filter(p => p.status?.name === "Available").length || 0;
      
      // Calculate Starting Price (minimum price)
      const prices = project.properties?.map(p => Number(p.price)).filter(Boolean) || [];
      const startingPrice = prices.length > 0 ? Math.min(...prices) : 0;

      // Calculate Area Range
      const areas = project.properties?.map(p => p.areaSize).filter(Boolean) || [];
      const minArea = areas.length > 0 ? Math.min(...areas) : 0;
      const maxArea = areas.length > 0 ? Math.max(...areas) : 0;

      return {
        ...project,
        totalProps,
        availableProps,
        startingPrice,
        minArea,
        maxArea,
      };
    });

    // In-memory sort for price if sortBy is price-asc or price-desc
    if (sortBy === "price-asc") {
      formattedProjects.sort((a, b) => a.startingPrice - b.startingPrice);
    } else if (sortBy === "price-desc") {
      formattedProjects.sort((a, b) => b.startingPrice - a.startingPrice);
    }

    return {
      projects: formattedProjects,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("Error executing public projects service query:", error);
    return {
      projects: [],
      total: 0,
      page,
      limit,
      totalPages: 0,
    };
  }
}

/**
 * Retrieves lists of active categories, hierarchical location layers,
 * and status options to feed filter parameters on public projects catalog.
 */
export async function getPublicFiltersMetadata() {
  try {
    const [categories, countries, states, cities] = await Promise.all([
      // Categories with projects count
      db.category.findMany({
        where: { deletedAt: null },
        include: {
          _count: {
            select: {
              projects: {
                where: { deletedAt: null },
              },
            },
          },
        },
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
      countries,
      states,
      cities,
    };
  } catch (error) {
    console.error("Error executing public filters metadata query:", error);
    return {
      categories: [],
      countries: [],
      states: [],
      cities: [],
    };
  }
}

/**
 * Retrieves a single project by its slug, including category, location, gallery,
 * amenities, specifications, highlights, related child properties, and stats.
 */
export async function getPublicProjectDetails(slug) {
  if (!slug) return null;

  try {
    const project = await db.project.findFirst({
      where: {
        slug,
        deletedAt: null,
      },
      include: {
        category: true,
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
        amenities: true,
        specifications: true,
        highlights: true,
        properties: {
          where: { deletedAt: null },
          include: {
            status: true,
            images: {
              where: { isFeatured: true },
              take: 1,
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!project) return null;

    // Format properties prices to standard number
    const serializedProperties = (project.properties || []).map((property) => ({
      ...property,
      price: property.price ? Number(property.price) : 0,
    }));

    const totalProps = serializedProperties.length;
    const availableProps = serializedProperties.filter(p => p.status?.name === "Available").length;
    const soldProps = serializedProperties.filter(p => p.status?.name === "Sold").length;

    const prices = serializedProperties.map(p => p.price).filter(Boolean);
    const startingPrice = prices.length > 0 ? Math.min(...prices) : 0;

    const areas = serializedProperties.map(p => p.areaSize).filter(Boolean);
    const minArea = areas.length > 0 ? Math.min(...areas) : 0;
    const maxArea = areas.length > 0 ? Math.max(...areas) : 0;

    return {
      ...project,
      properties: serializedProperties,
      totalProps,
      availableProps,
      soldProps,
      startingPrice,
      minArea,
      maxArea,
    };
  } catch (error) {
    console.error("Error fetching public project details by slug:", error);
    return null;
  }
}

/**
 * Fetches related projects based on category or location similarity.
 */
export async function getRelatedProjects({
  projectId,
  categoryId,
  cityId,
  limit = 3,
} = {}) {
  if (!projectId) return [];

  try {
    const projects = await db.project.findMany({
      where: {
        deletedAt: null,
        id: { not: projectId },
        OR: [
          { categoryId },
          { cityId },
        ],
      },
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
              },
            },
          },
        },
        properties: {
          where: { deletedAt: null },
          select: { price: true },
        },
        images: {
          where: { isFeatured: true },
          take: 1,
        },
      },
      orderBy: [
        { isFeatured: "desc" },
        { createdAt: "desc" },
      ],
    });

    return projects.map((project) => {
      const prices = project.properties?.map(p => Number(p.price)).filter(Boolean) || [];
      const startingPrice = prices.length > 0 ? Math.min(...prices) : 0;
      return {
        ...project,
        startingPrice,
      };
    });
  } catch (error) {
    console.error("Error fetching related projects:", error);
    return [];
  }
}
