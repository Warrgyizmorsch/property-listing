import React from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import PageHeader from "@/components/admin/PageHeader"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Mail,
  Phone,
  User,
  Calendar,
  Building,
  DollarSign,
  MapPin,
  Maximize2,
  BedDouble,
  Bath,
} from "lucide-react"
import { getEnquiryById } from "@/features/enquiries/services/enquiry.service"
import EnquiryStatusSelector from "@/features/enquiries/components/EnquiryStatusSelector"
import EnquiryNotesForm from "@/features/enquiries/components/EnquiryNotesForm"
import { EnquiryStatusBadge } from "@/features/enquiries/components/EnquiryTable"
import { formatCurrency } from "@/lib/format"

export const dynamic = "force-dynamic"

export default async function EnquiryDetailPage({ params }) {
  const resolvedParams = await params
  const { id } = resolvedParams

  const enquiry = await getEnquiryById(id)

  if (!enquiry) {
    notFound()
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-300">
      
      {/* Page Header with Back Navigation */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <PageHeader
          title={`Lead: ${enquiry.name}`}
          description="View submitted lead questions, contact information, and modify tracking state."
        />
        
        <Button
          variant="outline"
          asChild
          className="border-neutral-200 hover:bg-neutral-50 h-10 text-xs font-semibold text-neutral-700 cursor-pointer self-start md:self-auto"
        >
          <Link href="/admin/enquiries">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Leads
          </Link>
        </Button>
      </div>

      {/* Main Grid Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Left Column: Lead Info and Message (Takes up 2/3 of grid) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Lead Contact Info Card */}
          <div className="bg-white border border-neutral-200 rounded-lg p-6 shadow-xs space-y-6">
            <h3 className="text-sm font-bold text-neutral-800 uppercase tracking-wider border-b border-neutral-100 pb-2">
              Contact Details
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Name */}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-neutral-50 rounded-md text-neutral-500 shrink-0">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                    Full Name
                  </div>
                  <div className="text-sm font-semibold text-neutral-900">{enquiry.name}</div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-neutral-50 rounded-md text-neutral-500 shrink-0">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                    Processing Stage
                  </div>
                  <div className="mt-0.5">
                    <EnquiryStatusBadge status={enquiry.status} />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-neutral-50 rounded-md text-neutral-500 shrink-0">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                    Email Address
                  </div>
                  <a
                    href={`mailto:${enquiry.email}`}
                    className="text-sm font-mono text-neutral-900 hover:text-neutral-700 transition-colors underline break-all"
                  >
                    {enquiry.email}
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-neutral-50 rounded-md text-neutral-500 shrink-0">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                    Phone Number
                  </div>
                  <a
                    href={`tel:${enquiry.phone}`}
                    className="text-sm font-mono text-neutral-900 hover:text-neutral-700 transition-colors underline"
                  >
                    {enquiry.phone}
                  </a>
                </div>
              </div>

              {/* Created Date */}
              <div className="flex items-center gap-3 sm:col-span-2">
                <div className="p-2 bg-neutral-50 rounded-md text-neutral-500 shrink-0">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                    Submitted On
                  </div>
                  <div className="text-sm text-neutral-700">
                    {new Date(enquiry.createdAt).toLocaleString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submitted Message Card */}
          <div className="bg-white border border-neutral-200 rounded-lg p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-neutral-800 uppercase tracking-wider border-b border-neutral-100 pb-2">
              Customer Message
            </h3>
            <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-100">
              <p className="text-sm text-neutral-800 whitespace-pre-wrap leading-relaxed">
                {enquiry.message}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Status Pipeline, Property Profile, Internal Notes */}
        <div className="space-y-6">
          
          {/* Status Stepper Card */}
          <div className="bg-white border border-neutral-200 rounded-lg p-6 shadow-xs">
            <EnquiryStatusSelector enquiryId={enquiry.id} currentStatus={enquiry.status} />
          </div>

          {/* Internal Notes Card */}
          <div className="bg-white border border-neutral-200 rounded-lg p-6 shadow-xs">
            <EnquiryNotesForm enquiryId={enquiry.id} initialNotes={enquiry.notes} />
          </div>

          {/* Associated Property Details Card */}
          <div className="bg-white border border-neutral-200 rounded-lg p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-neutral-800 uppercase tracking-wider border-b border-neutral-100 pb-2">
              Property Context
            </h3>

            {enquiry.property ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-neutral-900 leading-snug">
                    {enquiry.property.title}
                  </h4>
                  <p className="text-xs text-neutral-400 font-mono mt-0.5">
                    {enquiry.property.slug}
                  </p>
                </div>

                <div className="space-y-2.5 text-xs text-neutral-600">
                  {/* Price */}
                  <div className="flex items-center gap-2 font-bold text-neutral-900">
                    <DollarSign className="h-4 w-4 text-neutral-400" />
                    <span>
                      {formatCurrency
                        ? formatCurrency(enquiry.property.price)
                        : `$${Number(enquiry.property.price).toLocaleString()}`}
                    </span>
                  </div>

                  {/* Category / Purpose */}
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-neutral-400" />
                    <span>
                      {enquiry.property.category?.name || "Uncategorized"}
                    </span>
                  </div>

                  {/* Address */}
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-neutral-400 shrink-0" />
                    <span className="truncate">{enquiry.property.address}</span>
                  </div>

                  {/* City/State */}
                  <div className="flex items-center gap-2 pl-6 text-[11px] text-neutral-400">
                    <span>
                      {enquiry.property.city?.name},{" "}
                      {enquiry.property.city?.state?.name || ""},{" "}
                      {enquiry.property.city?.state?.country?.name || ""}
                    </span>
                  </div>

                  {/* Specs Grid */}
                  <div className="grid grid-cols-3 gap-2 border-t border-neutral-100 pt-3 mt-3 text-center">
                    <div className="bg-neutral-50 p-2 rounded-md">
                      <BedDouble className="h-3.5 w-3.5 text-neutral-500 mx-auto mb-1" />
                      <span className="font-semibold text-neutral-950 block text-[11px]">
                        {enquiry.property.bedrooms}
                      </span>
                      <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                        Beds
                      </span>
                    </div>
                    <div className="bg-neutral-50 p-2 rounded-md">
                      <Bath className="h-3.5 w-3.5 text-neutral-500 mx-auto mb-1" />
                      <span className="font-semibold text-neutral-950 block text-[11px]">
                        {enquiry.property.bathrooms}
                      </span>
                      <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                        Baths
                      </span>
                    </div>
                    <div className="bg-neutral-50 p-2 rounded-md">
                      <Maximize2 className="h-3.5 w-3.5 text-neutral-500 mx-auto mb-1" />
                      <span className="font-semibold text-neutral-950 block text-[11px]">
                        {enquiry.property.areaSize}
                      </span>
                      <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                        Sq Ft
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    variant="outline"
                    asChild
                    className="w-full border-neutral-200 hover:bg-neutral-50 h-9 text-xs font-semibold text-neutral-700 cursor-pointer"
                  >
                    <Link href={`/admin/properties/${enquiry.property.id}/edit`}>
                      Edit Property Profile
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-neutral-500 italic">
                This enquiry is linked to a property record that has been deleted.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
