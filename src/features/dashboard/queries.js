import { db } from "@/lib/db";

/**
 * Retrieves aggregate metrics for the admin dashboard screen concurrently.
 * @returns {Promise<{
 *   totalProperties: number,
 *   availableProperties: number,
 *   soldProperties: number,
 *   totalEnquiries: number,
 *   newEnquiries: number
 * }>}
 */
export async function getDashboardStats() {
  try {
    const [
      totalProperties,
      availableProperties,
      soldProperties,
      totalLeads,
      newLeads,
      contactedLeads,
      convertedLeads,
      closedLeads,
    ] = await Promise.all([
      // 1. Count all non-deleted listings
      db.property.count({
        where: { deletedAt: null },
      }),

      // 2. Count all listings marked as Available
      db.property.count({
        where: {
          deletedAt: null,
          status: {
            name: {
              equals: "Available"
            }
          }
        },
      }),

      // 3. Count all listings marked as Sold
      db.property.count({
        where: {
          deletedAt: null,
          status: {
            name: {
              equals: "Sold"
            }
          }
        },
      }),

      // 4. Count all active client contact leads
      db.enquiry.count({
        where: { deletedAt: null },
      }),

      // 5. Count new unprocessed contact leads
      db.enquiry.count({
        where: {
          deletedAt: null,
          status: "NEW",
        },
      }),

      // 6. Count contacted leads
      db.enquiry.count({
        where: {
          deletedAt: null,
          status: "CONTACTED",
        },
      }),

      // 7. Count converted leads
      db.enquiry.count({
        where: {
          deletedAt: null,
          status: "CONVERTED",
        },
      }),

      // 8. Count closed leads
      db.enquiry.count({
        where: {
          deletedAt: null,
          status: "CLOSED",
        },
      }),
    ]);

    return {
      totalProperties,
      availableProperties,
      soldProperties,
      totalEnquiries: totalLeads, // legacy map compatibility
      newEnquiries: newLeads, // legacy map compatibility
      totalLeads,
      newLeads,
      contactedLeads,
      convertedLeads,
      closedLeads,
    };
  } catch (error) {
    console.error("Failed to query dashboard statistics metrics:", error);
    return {
      totalProperties: 0,
      availableProperties: 0,
      soldProperties: 0,
      totalEnquiries: 0,
      newEnquiries: 0,
      totalLeads: 0,
      newLeads: 0,
      contactedLeads: 0,
      convertedLeads: 0,
      closedLeads: 0,
    };
  }
}
