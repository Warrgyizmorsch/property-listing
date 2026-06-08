import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getEnquiries } from "@/features/enquiries/services/enquiry.service";

// Prevent prerendering - this route is always dynamic
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    // 1. Authenticate session manually to prevent Next.js redirect throws in API routes
    const session = await auth();
    if (
      !session?.user ||
      (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")
    ) {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized. Admin permissions required." }),
        { status: 401, headers: { "Content-Type": "application/json" } },
      );
    }

    // 2. Parse search parameters from request URL
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const propertyId = searchParams.get("propertyId") || "";
    const startDate = searchParams.get("startDate") || "";
    const endDate = searchParams.get("endDate") || "";

    // 3. Fetch matching leads with a high limit to get all records
    const result = await getEnquiries({
      search,
      status,
      propertyId,
      startDate,
      endDate,
      page: 1,
      limit: 100000,
    });

    const enquiries = result.enquiries || [];

    // 4. Generate CSV
    const headers = [
      "ID",
      "Lead Name",
      "Email",
      "Phone",
      "Message",
      "Internal Notes",
      "Status",
      "Associated Property",
      "Created Date",
    ];

    const escapeCSV = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val);
      // Double up any quotes and wrap in quotes
      return `"${str.replace(/"/g, '""')}"`;
    };

    const csvRows = [headers.join(",")];

    for (const enquiry of enquiries) {
      const row = [
        escapeCSV(enquiry.id),
        escapeCSV(enquiry.name),
        escapeCSV(enquiry.email),
        escapeCSV(enquiry.phone),
        escapeCSV(enquiry.message),
        escapeCSV(enquiry.notes),
        escapeCSV(enquiry.status),
        escapeCSV(enquiry.property?.title || "N/A"),
        escapeCSV(
          new Date(enquiry.createdAt).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
        ),
      ];
      csvRows.push(row.join(","));
    }

    const csvString = csvRows.join("\r\n");

    // 5. Return native attachment download response
    const filename = `leads_export_${new Date().toISOString().slice(0, 10)}.csv`;
    return new NextResponse(csvString, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("CSV Export API error:", error);
    return new NextResponse(
      JSON.stringify({ error: error.message || "Failed to export leads." }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
