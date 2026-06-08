import React from "react";
import {
  Building,
  Activity,
  IndianRupee,
  Mail,
  AlertCircle,
  Phone,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { getDashboardStats } from "@/features/dashboard/queries";
import PageHeader from "@/components/admin/PageHeader";
import DashboardCard from "@/components/admin/DashboardCard";
import EmptyState from "@/components/admin/EmptyState";
import TableWrapper from "@/components/admin/TableWrapper";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/db";
import Link from "next/link";

// Force Next.js to run this page as dynamic server-rendered, fetching fresh data on each load
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // 1. Fetch concurrent metrics from MySQL database via Prisma queries
  const stats = await getDashboardStats();

  // 2. Fetch the 5 most recent enquiries (if any) to populate the dashboard summary list
  const recentEnquiries = await db.enquiry
    .findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        property: {
          select: {
            title: true,
            slug: true,
          },
        },
      },
    })
    .catch(() => []); // Fallback to empty array if table migrations/database are not populated

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page header */}
      <PageHeader
        title="Dashboard Overview"
        description="Real-time monitoring of your properties directory and lead enquiries."
      />

      {/* Property Portfolio Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
          Property Portfolio
        </h3>
        <div className="grid gap-6 md:grid-cols-3">
          <DashboardCard
            title="Total Listings"
            value={stats.totalProperties}
            icon={<Building className="h-5 w-5 text-neutral-600" />}
            description="Total database property listings"
          />
          <DashboardCard
            title="Available"
            value={stats.availableProperties}
            icon={<Activity className="h-5 w-5 text-green-600" />}
            description="Active and visible properties"
            className="border-l-4 border-l-green-500"
          />
          <DashboardCard
            title="Sold / Inactive"
            value={stats.soldProperties}
            icon={<IndianRupee className="h-5 w-5 text-neutral-600" />}
            description="Properties marked as Sold"
          />
        </div>
      </div>

      {/* Leads & Sales Pipeline Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
          Leads & Sales Pipeline
        </h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          <DashboardCard
            title="Total Leads"
            value={stats.totalLeads}
            icon={<Mail className="h-5 w-5 text-neutral-600" />}
            description="Total customer lead enquiries"
          />
          <DashboardCard
            title="New Leads"
            value={stats.newLeads}
            icon={<AlertCircle className="h-5 w-5 text-amber-600" />}
            description="Unprocessed lead contact requests"
            className="border-l-4 border-l-amber-500"
          />
          <DashboardCard
            title="Contacted"
            value={stats.contactedLeads}
            icon={<Phone className="h-5 w-5 text-blue-600" />}
            description="Leads actively contacted"
            className="border-l-4 border-l-blue-500"
          />
          <DashboardCard
            title="Converted"
            value={stats.convertedLeads}
            icon={<CheckCircle className="h-5 w-5 text-green-600" />}
            description="Successfully converted buyer leads"
            className="border-l-4 border-l-green-500"
          />
          <DashboardCard
            title="Closed"
            value={stats.closedLeads}
            icon={<XCircle className="h-5 w-5 text-red-600" />}
            description="Leads marked as closed"
            className="border-l-4 border-l-red-500"
          />
        </div>
      </div>

      {/* Recent Enquiries Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-neutral-900 tracking-tight">
            Recent Enquiries
          </h2>
          <Link
            href="/admin/enquiries"
            className="text-xs font-semibold text-neutral-600 hover:text-neutral-900 hover:underline transition-colors"
          >
            View All Enquiries
          </Link>
        </div>

        {recentEnquiries.length === 0 ? (
          <EmptyState
            icon={<Mail className="h-6 w-6 text-neutral-400" />}
            title="No enquiries found"
            description="When customers submit lead sheets on property dynamic pages, they will appear here."
          />
        ) : (
          <TableWrapper>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[150px] font-semibold text-neutral-700">
                    Name
                  </TableHead>
                  <TableHead className="font-semibold text-neutral-700">
                    Email
                  </TableHead>
                  <TableHead className="font-semibold text-neutral-700">
                    Phone
                  </TableHead>
                  <TableHead className="font-semibold text-neutral-700">
                    Associated Property
                  </TableHead>
                  <TableHead className="w-[100px] text-right font-semibold text-neutral-700">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentEnquiries.map((enquiry) => (
                  <TableRow
                    key={enquiry.id}
                    className="hover:bg-neutral-50/50 transition-colors"
                  >
                    <TableCell className="font-medium text-neutral-900">
                      <Link
                        href={`/admin/enquiries/${enquiry.id}`}
                        className="hover:underline hover:text-neutral-700"
                      >
                        {enquiry.name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-neutral-500 font-mono text-xs">
                      {enquiry.email}
                    </TableCell>
                    <TableCell className="text-neutral-500 font-mono text-xs">
                      {enquiry.phone}
                    </TableCell>
                    <TableCell className="text-neutral-900 font-medium">
                      {enquiry.property?.title || "Unknown Property"}
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          enquiry.status === "NEW"
                            ? "bg-amber-100 text-amber-800"
                            : enquiry.status === "CONTACTED"
                              ? "bg-blue-100 text-blue-800"
                              : enquiry.status === "NEGOTIATION"
                                ? "bg-indigo-100 text-indigo-800"
                                : enquiry.status === "CLOSED"
                                  ? "bg-red-100 text-red-800"
                                  : enquiry.status === "CONVERTED"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-neutral-100 text-neutral-800"
                        }`}
                      >
                        {enquiry.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableWrapper>
        )}
      </div>
    </div>
  );
}
