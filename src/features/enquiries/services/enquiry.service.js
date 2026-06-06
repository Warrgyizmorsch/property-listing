import { db } from "@/lib/db";

/**
 * Fetch enquiries with pagination, filters, and text search.
 */
export async function getEnquiries({
  search = "",
  status = "",
  propertyId = "",
  startDate = "",
  endDate = "",
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
        { name: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
        { message: { contains: search } },
      ];
    }

    // Status filter
    if (status) {
      where.status = status;
    }

    // Property ID filter
    if (propertyId) {
      where.propertyId = propertyId;
    }

    // Date range filter
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.createdAt.lte = end;
      }
    }

    const [enquiries, total] = await Promise.all([
      db.enquiry.findMany({
        where,
        skip,
        take: limit,
        include: {
          property: {
            select: {
              id: true,
              title: true,
              slug: true,
              price: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      db.enquiry.count({ where }),
    ]);

    // Serialize any decimal price on property relations
    const serializedEnquiries = enquiries.map((enquiry) => {
      if (enquiry.property) {
        return {
          ...enquiry,
          property: {
            ...enquiry.property,
            price: enquiry.property.price ? Number(enquiry.property.price) : 0,
          },
        };
      }
      return enquiry;
    });

    return {
      enquiries: serializedEnquiries,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("Error fetching enquiries:", error);
    throw new Error("Failed to load enquiries list.");
  }
}

/**
 * Retrieve a single enquiry by ID with property context.
 */
export async function getEnquiryById(id) {
  try {
    const enquiry = await db.enquiry.findUnique({
      where: { id },
      include: {
        property: {
          include: {
            category: { select: { name: true } },
            city: {
              include: {
                state: { include: { country: { select: { name: true } } } },
              },
            },
          },
        },
      },
    });

    if (!enquiry) return null;

    // Serialize decimal fields
    if (enquiry.property) {
      enquiry.property.price = enquiry.property.price ? Number(enquiry.property.price) : 0;
    }

    return enquiry;
  } catch (error) {
    console.error("Error retrieving enquiry by ID:", error);
    throw new Error("Failed to load enquiry details.");
  }
}

/**
 * Updates status of an enquiry.
 */
export async function updateEnquiryStatus(id, status) {
  return db.enquiry.update({
    where: { id },
    data: { status },
  });
}

/**
 * Updates internal notes for an enquiry.
 */
export async function updateEnquiryNotes(id, notes) {
  return db.enquiry.update({
    where: { id },
    data: { notes: notes || null },
  });
}

/**
 * Gets lead stats aggregate values.
 */
export async function getEnquiryStats() {
  try {
    const [
      totalLeads,
      newLeads,
      contactedLeads,
      convertedLeads,
      closedLeads,
    ] = await Promise.all([
      db.enquiry.count({ where: { deletedAt: null } }),
      db.enquiry.count({ where: { deletedAt: null, status: "NEW" } }),
      db.enquiry.count({ where: { deletedAt: null, status: "CONTACTED" } }),
      db.enquiry.count({ where: { deletedAt: null, status: "CONVERTED" } }),
      db.enquiry.count({ where: { deletedAt: null, status: "CLOSED" } }),
    ]);

    return {
      totalLeads,
      newLeads,
      contactedLeads,
      convertedLeads,
      closedLeads,
    };
  } catch (error) {
    console.error("Error fetching lead statistics:", error);
    return {
      totalLeads: 0,
      newLeads: 0,
      contactedLeads: 0,
      convertedLeads: 0,
      closedLeads: 0,
    };
  }
}

/**
 * Retrieve active properties list and their lead counts.
 */
export async function getPropertyWiseLeadCounts() {
  try {
    const properties = await db.property.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        title: true,
        slug: true,
        _count: {
          select: { enquiries: { where: { deletedAt: null } } },
        },
      },
      orderBy: {
        enquiries: {
          _count: "desc",
        },
      },
    });

    return properties.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      leadCount: p._count.enquiries,
    }));
  } catch (error) {
    console.error("Error fetching property lead counts:", error);
    return [];
  }
}
