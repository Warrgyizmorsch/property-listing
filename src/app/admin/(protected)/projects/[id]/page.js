import React from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import PageHeader from "@/components/admin/PageHeader"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit2, ShieldCheck, MapPin, Phone, Mail, Award, CheckSquare, Hammer, Bookmark, LayoutGrid, Calendar, HelpCircle, User, Image as ImageIcon } from "lucide-react"
import { getProjectById } from "@/features/projects/services"
import { formatCurrency } from "@/lib/format"

export const dynamic = "force-dynamic"

export default async function ProjectDetailsPage({ params }) {
  const resolvedParams = await params
  const { id } = resolvedParams

  const project = await getProjectById(id)

  if (!project) {
    notFound()
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "ONGOING":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "COMPLETED":
        return "bg-green-100 text-green-800 border-green-200"
      case "UPCOMING":
        return "bg-amber-100 text-amber-800 border-amber-200"
      default:
        return "bg-neutral-100 text-neutral-800 border-neutral-200"
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case "ONGOING":
        return "Ongoing"
      case "COMPLETED":
        return "Completed"
      case "UPCOMING":
        return "Upcoming"
      default:
        return status
    }
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in duration-300">
      
      {/* Top Header Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            asChild
            className="border-neutral-200 hover:bg-neutral-50 h-9 text-xs font-semibold text-neutral-700 cursor-pointer"
          >
            <Link href="/admin/projects">
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              Back to Projects
            </Link>
          </Button>
        </div>

        <Button
          asChild
          className="bg-neutral-950 text-white hover:bg-neutral-800 h-9 text-xs font-semibold px-4 cursor-pointer self-start sm:self-auto"
        >
          <Link href={`/admin/projects/${project.id}/edit`}>
            <Edit2 className="h-4 w-4 mr-1.5" />
            Edit Project
          </Link>
        </Button>
      </div>

      {/* Hero Banner Section */}
      <div className="relative h-64 md:h-80 w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-sm flex items-end">
        {project.bannerImage ? (
          <img
            src={project.bannerImage}
            alt={`${project.projectName} Banner`}
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 to-slate-800 opacity-80" />
        )}
        
        {/* Project Title and Stats overlay */}
        <div className="relative z-10 p-6 md:p-8 text-white w-full flex flex-col md:flex-row md:items-end md:justify-between gap-4 bg-gradient-to-t from-slate-950/90 to-transparent">
          <div className="space-y-2">
            <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-bold ring-1 ring-inset ring-white/10 ${getStatusBadgeClass(project.status)}`}>
              {getStatusLabel(project.status)}
            </span>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">{project.projectName}</h1>
            <div className="flex items-center gap-1.5 text-sm font-medium text-slate-300">
              <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
              <span>{project.address}, {project.city?.name}, {project.city?.state?.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {project.brochureFile && (
              <Button
                variant="outline"
                asChild
                className="bg-white/10 text-white border-white/20 hover:bg-white/20 h-9 text-xs font-bold"
              >
                <a href={project.brochureFile} target="_blank" rel="noopener noreferrer">
                  Download Brochure
                </a>
              </Button>
            )}
            <Button
              asChild
              className="bg-white text-slate-950 hover:bg-slate-100 h-9 text-xs font-bold border-none"
            >
              <Link href={`/admin/projects/${project.id}/images`}>
                <ImageIcon className="h-4 w-4 mr-1.5 text-slate-900" />
                Gallery
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Grid Info Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Left Column: Project Stats & Builder */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Quick Metrics */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="h-4 w-4 text-slate-500" />
              Project Statistics
            </h3>
            <hr className="border-slate-100" />

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-slate-50 rounded-xl">
                <div className="text-xl font-extrabold text-slate-950">{project.totalProperties}</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase mt-1">Total</div>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl">
                <div className="text-xl font-extrabold text-emerald-700">{project.availableProperties}</div>
                <div className="text-[10px] text-emerald-500 font-bold uppercase mt-1">Available</div>
              </div>
              <div className="p-3 bg-red-50 rounded-xl">
                <div className="text-xl font-extrabold text-red-700">{project.soldProperties}</div>
                <div className="text-[10px] text-red-500 font-bold uppercase mt-1">Sold</div>
              </div>
            </div>
            
            <div className="space-y-2.5 pt-2 text-xs font-semibold text-slate-600">
              <div className="flex justify-between">
                <span>Category:</span>
                <span className="text-slate-900 font-bold">{project.category?.name || "Unspecified"}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Budget:</span>
                <span className="text-slate-900 font-bold">
                  {project.projectBudget ? formatCurrency(project.projectBudget) : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Land Area:</span>
                <span className="text-slate-900 font-bold">
                  {project.areaSize ? `${project.areaSize.toLocaleString()} Sq Ft` : "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Builder Details */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <User className="h-4 w-4 text-slate-500" />
              Builder Information
            </h3>
            <hr className="border-slate-100" />

            <div className="space-y-3.5 text-slate-700">
              <div className="font-bold text-slate-900 text-base">{project.builderName}</div>
              
              {project.builderPhone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>{project.builderPhone}</span>
                </div>
              )}
              {project.builderEmail && (
                <div className="flex items-center gap-2 text-sm truncate">
                  <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>{project.builderEmail}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Descriptions & Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Details Tabs */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
            
            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Description</h3>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {project.description}
              </p>
            </div>

            {/* Highlights */}
            {project.highlights && project.highlights.length > 0 && (
              <div className="space-y-2 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Bookmark className="h-3.5 w-3.5" />
                  Highlights
                </h3>
                <div className="flex flex-wrap gap-2 pt-1">
                  {project.highlights.map((h) => (
                    <span
                      key={h.id}
                      className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-800 ring-1 ring-inset ring-slate-500/10"
                    >
                      {h.text}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Amenities */}
            {project.amenities && project.amenities.length > 0 && (
              <div className="space-y-2 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <CheckSquare className="h-3.5 w-3.5" />
                  Amenities
                </h3>
                <div className="flex flex-wrap gap-2 pt-1">
                  {project.amenities.map((a) => (
                    <span
                      key={a.id}
                      className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 ring-1 ring-inset ring-emerald-700/10"
                    >
                      {a.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Specifications */}
            {project.specifications && project.specifications.length > 0 && (
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Hammer className="h-3.5 w-3.5" />
                  Specifications
                </h3>
                
                <div className="border border-slate-100 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-slate-100 text-left text-xs">
                    <thead className="bg-slate-50 font-bold text-slate-700">
                      <tr>
                        <th className="px-4 py-2">Item</th>
                        <th className="px-4 py-2">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white text-slate-600 font-medium">
                      {project.specifications.map((s) => (
                        <tr key={s.id}>
                          <td className="px-4 py-2.5 font-bold text-slate-800">{s.title}</td>
                          <td className="px-4 py-2.5">{s.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Google Map */}
            {project.googleMapIframe && (
              <div className="space-y-2 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Location Map</h3>
                <div
                  className="w-full h-64 rounded-xl overflow-hidden border border-slate-100"
                  dangerouslySetInnerHTML={{
                    __html: project.googleMapIframe
                      .replace(/width="\d+"/, 'width="100%"')
                      .replace(/height="\d+"/, 'height="100%"'),
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Properties List Table under this Project */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Properties Under Project ({project.properties?.length || 0})
          </h3>
          <Button
            asChild
            variant="outline"
            className="border-neutral-200 hover:bg-neutral-50 h-8 text-xs font-bold cursor-pointer"
          >
            <Link href={`/admin/properties/create?projectId=${project.id}`}>
              + Add Property to Project
            </Link>
          </Button>
        </div>

        <div className="overflow-hidden border border-slate-100 rounded-xl">
          <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
            <thead className="bg-slate-50 font-bold text-slate-700">
              <tr>
                <th className="px-4 py-3">Property</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white text-slate-600 font-medium">
              {project.properties?.map((property) => (
                <tr key={property.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 font-bold text-slate-800">
                    <div>{property.title}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{property.slug}</div>
                  </td>
                  <td className="px-4 py-3">{property.category?.name || "Uncategorized"}</td>
                  <td className="px-4 py-3 font-bold text-slate-900">
                    {formatCurrency(property.price)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold ${
                      property.status?.name === "Available"
                        ? "bg-green-50 text-green-700 ring-1 ring-green-600/20"
                        : property.status?.name === "Sold"
                        ? "bg-red-50 text-red-700 ring-1 ring-red-600/20"
                        : "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20"
                    }`}>
                      {property.status?.name || "No Status"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="text-indigo-600 hover:text-indigo-900 font-bold text-xs h-7 hover:bg-indigo-50"
                    >
                      <Link href={`/admin/properties/${property.id}/edit`}>
                        Edit Property
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}
              {(!project.properties || project.properties.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-400 italic">
                    No properties have been mapped to this project yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
