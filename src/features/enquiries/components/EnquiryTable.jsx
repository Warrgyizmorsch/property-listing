"use client"

import React from "react"
import Link from "next/link"
import { Eye, Mail, Phone, Calendar, Building2 } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import TableWrapper from "@/components/admin/TableWrapper"

export function EnquiryStatusBadge({ status }) {
  const styles = {
    NEW: "bg-amber-50 text-amber-700 ring-amber-600/10",
    CONTACTED: "bg-blue-50 text-blue-700 ring-blue-600/10",
    NEGOTIATION: "bg-indigo-50 text-indigo-700 ring-indigo-600/10",
    CLOSED: "bg-red-50 text-red-700 ring-red-600/10",
    CONVERTED: "bg-green-50 text-green-700 ring-green-600/10",
    RESOLVED: "bg-neutral-50 text-neutral-600 ring-neutral-500/10",
  }

  const label = status || "NEW"
  const styleClass = styles[label] || styles.NEW

  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold ring-1 ring-inset ${styleClass}`}>
      {label}
    </span>
  )
}

export default function EnquiryTable({ enquiries = [] }) {
  if (enquiries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border border-dashed border-neutral-200 bg-white rounded-lg text-center">
        <Mail className="h-10 w-10 text-neutral-300 mb-3" />
        <h3 className="text-sm font-semibold text-neutral-900">No leads found</h3>
        <p className="text-xs text-neutral-500 mt-1 max-w-sm">
          There are no lead enquiries matching your search or filters.
        </p>
      </div>
    )
  }

  return (
    <TableWrapper>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="font-semibold text-neutral-700">Lead Name</TableHead>
            <TableHead className="font-semibold text-neutral-700">Phone</TableHead>
            <TableHead className="font-semibold text-neutral-700">Email</TableHead>
            <TableHead className="font-semibold text-neutral-700">Property</TableHead>
            <TableHead className="font-semibold text-neutral-700">Status</TableHead>
            <TableHead className="font-semibold text-neutral-700">Created Date</TableHead>
            <TableHead className="text-right font-semibold text-neutral-700">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {enquiries.map((enquiry) => (
            <TableRow key={enquiry.id} className="hover:bg-neutral-50/50 transition-colors">
              {/* Lead Name */}
              <TableCell className="font-semibold text-neutral-900">
                {enquiry.name}
              </TableCell>

              {/* Phone */}
              <TableCell className="text-neutral-600 text-sm">
                <div className="flex items-center gap-1.5 font-mono">
                  <Phone className="h-3.5 w-3.5 text-neutral-400" />
                  <span>{enquiry.phone}</span>
                </div>
              </TableCell>

              {/* Email */}
              <TableCell className="text-neutral-600 text-sm">
                <div className="flex items-center gap-1.5 font-mono">
                  <Mail className="h-3.5 w-3.5 text-neutral-400" />
                  <span>{enquiry.email}</span>
                </div>
              </TableCell>

              {/* Property */}
              <TableCell className="text-neutral-900 text-sm max-w-[200px]">
                {enquiry.property ? (
                  <Link
                    href={`/admin/properties/${enquiry.property.id}/edit`}
                    className="flex items-center gap-1.5 text-neutral-900 hover:text-neutral-700 transition-colors font-medium"
                  >
                    <Building2 className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                    <span className="truncate">{enquiry.property.title}</span>
                  </Link>
                ) : (
                  <span className="text-neutral-400 italic">Deleted Property</span>
                )}
              </TableCell>

              {/* Status */}
              <TableCell>
                <EnquiryStatusBadge status={enquiry.status} />
              </TableCell>

              {/* Created Date */}
              <TableCell className="text-neutral-500 text-sm">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-neutral-400" />
                  <span>
                    {new Date(enquiry.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </TableCell>

              {/* Actions */}
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  className="h-8 w-8 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
                >
                  <Link href={`/admin/enquiries/${enquiry.id}`}>
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View details</span>
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableWrapper>
  )
}
