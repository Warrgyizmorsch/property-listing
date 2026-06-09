import { notFound } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Building2,
  Calendar,
  Layers,
  Sparkles,
  ArrowLeft,
  Mail,
  Phone,
  FileDown,
  Dumbbell,
  Waves,
  Shield,
  Car,
  Trees,
  Utensils,
  HeartHandshake,
  ArrowRight,
  MessageSquare,
  Compass,
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/frontend/Navbar";
import Footer from "@/components/frontend/Footer";
import PropertyEnquiryForm from "@/components/enquiry/PropertyEnquiryForm";
import { getPublicProjectDetails, getRelatedProjects } from "@/features/projects/public/services/public-project.service";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { formatCurrency, formatArea } from "@/lib/format";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = await getPublicProjectDetails(slug);

  if (!project) {
    return {
      title: "Project Not Found | Property Expert",
      description: "The requested real estate project could not be found.",
    };
  }

  return await generatePageMetadata({
    pageType: "PROPERTY", // Reuse detail configuration structure fallback
    entityId: project.id,
    fallbackData: {
      title: `${project.projectName} | Premium Real Estate Project by ${project.builderName}`,
      description: project.shortDescription || project.description,
    },
  });
}

// Map common amenities to premium icon cards
const getAmenityIcon = (name) => {
  const n = name?.toLowerCase();
  if (n.includes("pool") || n.includes("swimming")) return <Waves className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />;
  if (n.includes("gym") || n.includes("fitness") || n.includes("workout")) return <Dumbbell className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />;
  if (n.includes("security") || n.includes("cctv") || n.includes("guard")) return <Shield className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />;
  if (n.includes("parking") || n.includes("garage") || n.includes("car")) return <Car className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />;
  if (n.includes("park") || n.includes("garden") || n.includes("green") || n.includes("lawn")) return <Trees className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />;
  if (n.includes("club") || n.includes("lounge") || n.includes("dining") || n.includes("cafe")) return <Utensils className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />;
  return <HeartHandshake className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />;
};

const getStatusBadgeClass = (status) => {
  switch (status) {
    case "ONGOING":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "COMPLETED":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "UPCOMING":
      return "bg-amber-50 text-amber-700 border-amber-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case "ONGOING":
      return "Ongoing";
    case "COMPLETED":
      return "Completed";
    case "UPCOMING":
      return "Upcoming";
    default:
      return status;
  }
};

export default async function ProjectDetailPage({ params }) {
  const { slug } = await params;
  const project = await getPublicProjectDetails(slug);

  if (!project) {
    notFound();
  }

  // Fetch related projects in same category/region
  const relatedProjects = await getRelatedProjects({
    projectId: project.id,
    categoryId: project.categoryId,
    cityId: project.cityId,
    limit: 3,
  });

  const priceDisplay =
    project.startingPrice && project.startingPrice > 0
      ? `Starting ₹${formatCurrency(project.startingPrice).replace("₹", "")}`
      : "Price on Request";

  let areaDisplay = "Area on Request";
  if (project.minArea && project.minArea > 0) {
    if (project.maxArea && project.maxArea > project.minArea) {
      areaDisplay = `${formatArea(project.minArea)} - ${formatArea(project.maxArea)}`;
    } else {
      areaDisplay = formatArea(project.minArea);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50/20 dark:bg-zinc-950 font-sans">
      <Navbar />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Back Button */}
          <div className="mb-6">
            <Link href="/projects">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 font-semibold text-neutral-650 dark:text-neutral-350 hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Projects
              </Button>
            </Link>
          </div>

          {/* Hero Banner Grid */}
          <div className="relative mb-10 overflow-hidden rounded-3xl border border-neutral-200/60 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40">
            <div className="relative h-64 sm:h-80 md:h-[400px] w-full overflow-hidden bg-neutral-950">
              <img
                src={project.bannerImage || project.mainImage || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800"}
                alt={project.projectName}
                className="h-full w-full object-cover object-center opacity-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              
              {/* Bottom Floating Info */}
              <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div className="space-y-2">
                  <span className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-bold shadow-xs ${getStatusBadgeClass(project.status)}`}>
                    {getStatusLabel(project.status)}
                  </span>
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-heading tracking-tight leading-none mt-1">
                    {project.projectName}
                  </h1>
                  <p className="text-slate-300 text-sm font-medium">
                    By {project.builderName}
                  </p>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Prices From</p>
                  <p className="text-xl sm:text-2xl font-extrabold text-white font-heading mt-0.5">{priceDisplay}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Info Bar */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10 p-5 rounded-2xl border border-neutral-200/80 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900/30">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-neutral-400">Category</p>
                <p className="text-sm font-bold text-neutral-900 dark:text-white truncate">{project.category?.name || "Uncategorized"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400">
                <Compass className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-neutral-400">Area Range</p>
                <p className="text-sm font-bold text-neutral-900 dark:text-white truncate">{areaDisplay}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-neutral-400">Total Units</p>
                <p className="text-sm font-bold text-neutral-900 dark:text-white">{project.totalProps} properties</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-neutral-400">Available Units</p>
                <p className="text-sm font-bold text-neutral-900 dark:text-white">{project.availableProps} properties</p>
              </div>
            </div>
            <div className="flex items-center gap-3 col-span-2 md:col-span-1">
              <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400">
                <DollarSign className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-neutral-400">City</p>
                <p className="text-sm font-bold text-neutral-900 dark:text-white truncate">{project.city?.name || "Unknown"}</p>
              </div>
            </div>
          </div>

          {/* Core Layout Grid */}
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            
            {/* Left Column: Details, Highlights, Specifications, Gallery */}
            <div className="flex-grow w-full space-y-10">
              
              {/* Overview Details */}
              <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/30 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-white font-heading">Project Overview</h2>
                  <hr className="border-slate-100 dark:border-zinc-800 mt-3" />
                </div>
                <div className="text-sm text-neutral-650 dark:text-neutral-300 leading-relaxed whitespace-pre-line">
                  {project.description}
                </div>
              </div>

              {/* Highlights */}
              {project.highlights?.length > 0 && (
                <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/30 space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white font-heading">Key Project Highlights</h2>
                    <hr className="border-slate-100 dark:border-zinc-800 mt-3" />
                  </div>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-neutral-750 dark:text-neutral-350">
                    {project.highlights.map((h) => (
                      <li key={h.id} className="flex items-start gap-2.5">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400 text-xs font-bold mt-0.5">
                          ✓
                        </span>
                        <span>{h.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Specifications */}
              {project.specifications?.length > 0 && (
                <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/30 space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white font-heading">Project Specifications</h2>
                    <hr className="border-slate-100 dark:border-zinc-800 mt-3" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.specifications.map((spec) => (
                      <div key={spec.id} className="flex flex-col p-3 rounded-xl bg-slate-50/50 dark:bg-zinc-900/20 border border-slate-100/50 dark:border-zinc-850">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-450">{spec.title}</span>
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Amenities */}
              {project.amenities?.length > 0 && (
                <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/30 space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white font-heading">Luxury Amenities</h2>
                    <hr className="border-slate-100 dark:border-zinc-800 mt-3" />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {project.amenities.map((a) => (
                      <div key={a.id} className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 bg-slate-50/20 dark:border-zinc-850 dark:bg-zinc-900/10">
                        <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400">
                          {getAmenityIcon(a.name)}
                        </div>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-350">{a.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Gallery Grid/Slider */}
              {project.images?.length > 0 && (
                <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/30 space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white font-heading">Project Photos Gallery</h2>
                    <hr className="border-slate-100 dark:border-zinc-800 mt-3" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {project.images.map((image) => (
                      <div key={image.id} className="group relative aspect-video overflow-hidden rounded-xl bg-slate-100">
                        <img
                          src={image.url}
                          alt="Project Layout"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Child Properties under Project */}
              <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/30 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-white font-heading">Available Property Units</h2>
                  <p className="text-xs text-neutral-500 mt-1">Explore different inventory layouts listed under this project development.</p>
                  <hr className="border-slate-100 dark:border-zinc-800 mt-3" />
                </div>
                {project.properties?.length === 0 ? (
                  <div className="text-center p-8 bg-slate-50 dark:bg-zinc-900/20 rounded-xl">
                    <p className="text-sm text-neutral-500 dark:text-neutral-450 italic">No property units are currently listed under this project. Check back soon!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {project.properties.map((property) => {
                      const propCover = property.images?.[0]?.url || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800";
                      return (
                        <div key={property.id} className="group border border-slate-200/60 hover:shadow-md hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900/10 flex flex-col justify-between">
                          <div className="relative aspect-video overflow-hidden bg-slate-100">
                            <img
                              src={propCover}
                              alt={property.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute right-3 top-3">
                              <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-bold border shadow-xs ${property.status?.colorClass || "bg-white text-neutral-800 border-neutral-205"}`}>
                                {property.status?.name || "Available"}
                              </span>
                            </div>
                          </div>
                          <div className="p-5 flex-grow flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-center gap-2 mb-2">
                                <span className="text-[10px] font-extrabold uppercase text-indigo-600 dark:text-indigo-400 bg-indigo-50 px-2 py-0.5 rounded">
                                  {property.unitType || "1 BHK"}
                                </span>
                                <span className="text-base font-extrabold text-neutral-900 dark:text-white font-heading">
                                  {property.price ? formatCurrency(property.price) : "Price on Request"}
                                </span>
                              </div>
                              <h4 className="text-sm font-bold text-neutral-950 dark:text-white group-hover:text-indigo-600 transition-colors line-clamp-1">{property.title}</h4>
                            </div>
                            <div className="mt-4 border-t border-slate-100 pt-3 flex items-center justify-between text-xs text-neutral-500 font-semibold">
                              <span>{property.bedrooms} Beds • {property.bathrooms} Baths</span>
                              <span>{formatArea(property.areaSize)}</span>
                            </div>
                            <Link href={`/properties/${property.slug}`} className="mt-4 block w-full">
                              <Button variant="outline" className="w-full h-9 text-xs font-bold border-slate-200 hover:bg-slate-50 cursor-pointer">
                                View Layout Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Location Map Section */}
              <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/30 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-white font-heading">Location Map</h2>
                  <hr className="border-slate-100 dark:border-zinc-800 mt-3" />
                </div>
                <div className="flex items-start gap-2.5 text-sm text-neutral-650 dark:text-neutral-350">
                  <MapPin className="h-5 w-5 shrink-0 text-slate-405 mt-0.5" />
                  <span>{project.address}</span>
                </div>
                {project.googleMapIframe ? (
                  <div className="w-full h-[320px] rounded-xl overflow-hidden shadow-inner border border-slate-100 dark:border-zinc-800"
                    dangerouslySetInnerHTML={{ __html: project.googleMapIframe }}
                  />
                ) : (
                  <div className="flex h-48 w-full items-center justify-center rounded-xl bg-slate-100 text-slate-400 text-xs italic dark:bg-zinc-900/40">
                    No map frame embedding configured.
                  </div>
                )}
              </div>

            </div>

            {/* Right Column: Sticky Enquiry Form & CTAs */}
            <aside className="w-full lg:w-96 shrink-0 space-y-6 lg:sticky lg:top-24">
              
              {/* Inquiry Lead Box */}
              <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 shadow-md dark:border-zinc-850 dark:bg-zinc-900/40 space-y-5">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-neutral-800 dark:text-white">Register Interest</h3>
                  <p className="text-xs text-neutral-500 leading-normal">Submit details to receive callback brochure, pricing layout sheets, and viewing itineraries.</p>
                </div>
                <PropertyEnquiryForm
                  projectId={project.id}
                  projectTitle={project.projectName}
                />
              </div>

              {/* Brochure Download Card */}
              {project.brochureFile && (
                <div className="p-5 rounded-2xl border border-neutral-200/80 bg-white shadow-xs dark:border-zinc-850 dark:bg-zinc-900/40 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400">
                      <FileDown className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-neutral-800 dark:text-white">Project Brochure</h4>
                      <p className="text-[10px] text-neutral-400">PDF, floor layouts & pricing</p>
                    </div>
                  </div>
                  <a href={project.brochureFile} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" className="bg-slate-950 text-white hover:bg-slate-800 cursor-pointer h-9 font-bold px-4 rounded-xl">
                      Download
                    </Button>
                  </a>
                </div>
              )}

              {/* Quick Communication Box */}
              <div className="bg-slate-950 text-white rounded-3xl p-6 space-y-4 shadow-lg flex flex-col">
                <h3 className="text-base font-bold font-heading">Direct Consultation</h3>
                <p className="text-xs text-slate-400 leading-relaxed">Speak directly with developer sales consultants regarding allocations, discounts, and custom floor customizations.</p>
                
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <a href={`tel:${project.builderPhone || "+912240404040"}`} className="block w-full">
                    <Button variant="outline" className="w-full gap-1.5 h-10 text-xs font-bold border-white/20 bg-transparent text-white hover:bg-white/10 rounded-xl cursor-pointer">
                      <Phone className="h-3.5 w-3.5" />
                      Call Sales
                    </Button>
                  </a>
                  <a href={`https://wa.me/${project.builderPhone || "912240404040"}?text=Hi, I am interested in ${encodeURIComponent(project.projectName)}`} target="_blank" rel="noopener noreferrer" className="block w-full">
                    <Button className="w-full gap-1.5 h-10 text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl cursor-pointer border-none">
                      <MessageSquare className="h-3.5 w-3.5 fill-white" />
                      WhatsApp
                    </Button>
                  </a>
                </div>

                <div className="pt-2 text-center">
                  <p className="text-[9px] text-slate-500 font-medium">Sales Line: {project.builderPhone || "+91 (22) 4040-4040"}</p>
                </div>
              </div>

            </aside>

          </div>

          {/* Related Projects Section */}
          {relatedProjects.length > 0 && (
            <div className="mt-16 pt-16 border-t border-slate-100 dark:border-zinc-800">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Related Developments</span>
                  <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mt-1 font-heading">Other Projects You May Like</h3>
                </div>
                <Link href="/projects" className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
                  <span>Explore all projects</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {relatedProjects.map((proj) => {
                  const coverImage = proj.mainImage || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800";
                  const startingPriceDisplay = proj.startingPrice > 0 ? `Starting ₹${formatCurrency(proj.startingPrice).replace("₹", "")}` : "Price on Request";
                  return (
                    <div key={proj.id} className="group border border-slate-200/60 hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900/10 flex flex-col justify-between">
                      <div className="relative aspect-video overflow-hidden bg-slate-100">
                        <img
                          src={coverImage}
                          alt={proj.projectName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-550"
                        />
                      </div>
                      <div className="p-5 flex-grow flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase text-indigo-600 dark:text-indigo-400">{proj.category?.name}</span>
                          <h4 className="text-base font-bold text-neutral-900 dark:text-white mt-2 group-hover:text-indigo-600 transition-colors truncate">{proj.projectName}</h4>
                          <p className="text-xs text-neutral-500 mt-1">By {proj.builderName}</p>
                        </div>
                        <div className="mt-4 border-t border-slate-100 pt-3 flex items-center justify-between text-xs">
                          <span className="font-bold text-neutral-900 dark:text-white">{startingPriceDisplay}</span>
                          <Link href={`/projects/${proj.slug}`} className="text-indigo-600 font-bold hover:underline flex items-center gap-0.5">
                            <span>Details</span>
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
