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
  DollarSign,
  Info,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/frontend/Navbar";
import Footer from "@/components/frontend/Footer";
import PropertyEnquiryForm from "@/components/enquiry/PropertyEnquiryForm";
import ProjectHeroGallery from "@/components/projects/ProjectHeroGallery";
import ProjectConfigurationsTabs from "@/components/projects/ProjectConfigurationsTabs";
import { getPublicProjectDetails, getRelatedProjects } from "@/features/projects/public/services/public-project.service";
import { generatePageMetadata } from "@/lib/seo/metadata";
import StickyNavigationTabs from "@/components/frontend/StickyNavigationTabs";
import { formatCurrency, formatArea } from "@/lib/format";
import { PropertyCard } from "@/components/home/PropertyCards";
import { WhatsappIcon } from "@/components/icons/la-whatsapp";

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
    pageType: "PROPERTY", 
    entityId: project.id,
    fallbackData: {
      title: `${project.projectName} | Premium Real Estate Project by ${project.builderName}`,
      description: project.shortDescription || project.description,
    },
  });
}

// Map common amenities to luxury styled icons
const getAmenityIcon = (name) => {
  const n = name?.toLowerCase();
  if (n.includes("pool") || n.includes("swimming")) return <Waves className="h-5 w-5 text-[#C8A45D]" />;
  if (n.includes("gym") || n.includes("fitness") || n.includes("workout")) return <Dumbbell className="h-5 w-5 text-[#C8A45D]" />;
  if (n.includes("security") || n.includes("cctv") || n.includes("guard")) return <Shield className="h-5 w-5 text-[#C8A45D]" />;
  if (n.includes("parking") || n.includes("garage") || n.includes("car")) return <Car className="h-5 w-5 text-[#C8A45D]" />;
  if (n.includes("park") || n.includes("garden") || n.includes("green") || n.includes("lawn")) return <Trees className="h-5 w-5 text-[#C8A45D]" />;
  if (n.includes("club") || n.includes("lounge") || n.includes("dining") || n.includes("cafe")) return <Utensils className="h-5 w-5 text-[#C8A45D]" />;
  return <HeartHandshake className="h-5 w-5 text-[#C8A45D]" />;
};

const getStatusBadgeClass = (status) => {
  switch (status) {
    case "ONGOING":
      return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30";
    case "COMPLETED":
      return "bg-[var(--brand-primary-soft)] text-[var(--brand-primary)] border-[var(--brand-border)] dark:bg-[var(--brand-secondary-soft)] dark:text-[var(--brand-secondary)] dark:border-[var(--brand-border)]";
    case "UPCOMING":
      return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200 dark:bg-zinc-900/30 dark:text-zinc-400 dark:border-zinc-800";
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case "ONGOING":
      return "Under Construction";
    case "COMPLETED":
      return "Ready to Move";
    case "UPCOMING":
      return "New Launch";
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

  const brochureUrl = project.brochureFile?.includes("res.cloudinary.com") &&
    project.brochureFile.includes("/image/upload/") &&
    !project.brochureFile.toLowerCase().endsWith(".pdf")
    ? `${project.brochureFile}.pdf`
    : project.brochureFile;

  // Fetch related projects
  const relatedProjects = await getRelatedProjects({
    projectId: project.id,
    categoryId: project.categoryId,
    cityId: project.cityId,
    limit: 3,
  });

  // Calculate prices range
  const prices = project.properties?.map(p => Number(p.price)).filter(Boolean) || [];
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

  let priceRangeDisplay = "Price on Request";
  if (minPrice > 0) {
    if (maxPrice > minPrice) {
      priceRangeDisplay = `${formatCurrency(minPrice)} - ${formatCurrency(maxPrice)}`;
    } else {
      priceRangeDisplay = formatCurrency(minPrice);
    }
  }

  // Area range formatting
  let areaDisplay = "Area on Request";
  if (project.minArea && project.minArea > 0) {
    if (project.maxArea && project.maxArea > project.minArea) {
      areaDisplay = `${formatArea(project.minArea)} - ${formatArea(project.maxArea)}`;
    } else {
      areaDisplay = formatArea(project.minArea);
    }
  }

  // Dynamic BHK List
  const bhkList = [...new Set(project.properties?.map(p => p.unitType || (p.bedrooms ? `${p.bedrooms} BHK` : null)).filter(Boolean))];
  bhkList.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));
  const bhkSummaryText = bhkList.length > 0 ? `${bhkList.join(", ")} Apartments` : project.category?.name || "Apartments";

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "configurations", label: "Configurations" },
    ...(project.amenities?.length > 0 ? [{ id: "amenities", label: "Amenities" }] : []),
    ...(project.specifications?.length > 0 ? [{ id: "specifications", label: "Specifications" }] : []),
    { id: "builder", label: "Developer" },
    { id: "location", label: "Location" }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50/20 dark:bg-zinc-950 font-sans">
      <Navbar />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="h-12 md:h-16"></div>
        <div className="mx-auto max-w-7xl">

          {/* Breadcrumbs Navigation */}
          <nav className="mb-4 text-xs font-semibold text-neutral-400 flex items-center gap-1.5 flex-wrap">
            <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/projects" className="hover:text-slate-900 dark:hover:text-white transition-colors">Projects</Link>
            <span>/</span>
            <span className="hover:text-slate-900 dark:hover:text-white transition-colors">{project.city?.name || "Unknown Location"}</span>
            <span>/</span>
            <span className="text-slate-900 dark:text-white font-bold">{project.projectName}</span>
          </nav>

          {/* Redesigned Identity Header Block (Housing.com Style) */}
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-8">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-bold shadow-xs ${getStatusBadgeClass(project.status)}`}>
                  {getStatusLabel(project.status)}
                </span>
                {project.isFeatured && (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-[var(--brand-secondary)] px-2.5 py-1 text-xs font-bold text-[#0B1F3A] shadow-xs">
                    ★ Featured
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-semibold text-[#0B1F3A] dark:text-white tracking-tight leading-tight">
                {project.projectName}
              </h1>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm text-neutral-500 dark:text-zinc-400 font-semibold">
                <span className="text-[var(--brand-primary)] dark:text-[var(--brand-secondary)]">By {project.builderName}</span>
                <span className="hidden sm:inline text-neutral-300 dark:text-zinc-800">•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 shrink-0 text-neutral-400" />
                  {project.address}
                </span>
              </div>

              <div className="inline-flex items-center gap-2 rounded-xl bg-slate-100/80 dark:bg-zinc-900/60 px-3.5 py-2 border border-slate-200/40 dark:border-zinc-800/40 text-xs font-bold text-slate-800 dark:text-zinc-200 mt-2">
                <svg className="h-4 w-4 text-[#C8A45D]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6h1.5m-1.5 3h1.5m-1.5 3h1.5m-1.5 3h1.5M13.5 6H15m-1.5 3H15m-1.5 3H15m-1.5 3H15" />
                      </svg>
                <span>Config: {bhkSummaryText}</span>
              </div>
            </div>

            {/* Pricing Info & Action Card */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between sm:justify-start lg:justify-end gap-4 shrink-0 bg-white dark:bg-zinc-900/40 p-5 rounded-2xl border border-neutral-200/80 dark:border-zinc-800 shadow-sm">
              <div className="space-y-0.5 text-left lg:text-right">
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Price Range</p>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#0B1F3A] dark:text-white font-heading">{priceRangeDisplay}</h3>
                {minPrice > 0 && (
                  <p className="text-xs text-[var(--brand-primary)] dark:text-[var(--brand-secondary)] font-bold">
                    EMI starts at ₹{formatCurrency(Math.round(minPrice * 0.007)).replace("₹", "")}/month*
                  </p>
                )}
              </div>
              <div className="flex gap-2.5 w-full sm:w-auto">
                {brochureUrl && (
                  <a href={brochureUrl} target="_blank" rel="noopener noreferrer" className="secondary-btn text-xs font-bold h-10 px-4 flex items-center gap-1.5 cursor-pointer">
                    <FileDown className="h-4 w-4" />
                    Brochure
                  </a>
                )}
                <a 
                  href="#enquiry-card" 
                  className="primary-btn text-xs font-bold h-10 px-5 flex items-center justify-center cursor-pointer"
                >
                  Register Interest
                </a>
              </div>
            </div>
          </div>

          {/* Integrated Top Hero Gallery Grid */}
          <ProjectHeroGallery images={project.images} bannerImage={project.bannerImage} fallbackImage={project.mainImage} />

          {/* Sticky Anchor Navigation Bar */}
          <StickyNavigationTabs tabs={tabs} />

          {/* Core Layout Grid */}
          <div className="flex flex-col lg:flex-row gap-10 items-start">

            {/* Left Column: Details, Highlights, Specifications, Gallery */}
            <div className="flex-grow w-full space-y-10">

              {/* Overview Section */}
              <section id="overview" className="scroll-mt-36 space-y-6">
                {/* Redesigned Key Info Grid with Custom Premium SVGs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Configurations */}
                  <div className="bg-white border border-neutral-200/80 rounded-2xl p-1 sm:p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/30 flex items-center gap-3 sm:gap-4">
                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-[#C8A45D] shrink-0">
                      <svg className="h-6 w-6 text-[#C8A45D]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold uppercase text-neutral-450 tracking-wider">Configurations</p>
                      <p className="text-xs font-bold text-neutral-900 dark:text-white mt-0.5 line-clamp-1" title={bhkList.length > 0 ? bhkList.join(", ") : "Apartments"}>{bhkList.length > 0 ? bhkList.join(", ") : "Apartments"}</p>
                    </div>
                  </div>

                  {/* Area Range */}
                  <div className="bg-white border border-neutral-200/80 rounded-2xl p-1 sm:p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/30 flex items-center gap-2 sm:gap-3">
                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-[#C8A45D] shrink-0">
                      <svg className="h-6 w-6 text-[#C8A45D]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v16.5m0-16.5h16.5m-16.5 0l16.5 16.5M20.25 3.75v16.5m0-16.5H3.75" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold uppercase text-neutral-450 tracking-wider">Size Range</p>
                      <p className="text-xs font-bold text-neutral-900 dark:text-white mt-0.5 " title={areaDisplay}>{areaDisplay}</p>
                    </div>
                  </div>

                  {/* Total Properties */}
                  <div className="bg-white border border-neutral-200/80 rounded-2xl p-1 sm:p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/30 flex items-center gap-3 sm:gap-4">
                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-[#C8A45D] shrink-0">
                      <svg className="h-6 w-6 text-[#C8A45D]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6h1.5m-1.5 3h1.5m-1.5 3h1.5m-1.5 3h1.5M13.5 6H15m-1.5 3H15m-1.5 3H15m-1.5 3H15" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold uppercase text-neutral-450 tracking-wider">Total Units</p>
                      <p className="text-xs font-bold text-neutral-900 dark:text-white mt-0.5 " title={`${project.totalProps} Properties`}>{project.totalProps} Properties</p>
                    </div>
                  </div>

                  {/* Project Status */}
                  <div className="bg-white border border-neutral-200/80 rounded-2xl p-1 sm:p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/30 flex items-center gap-3 sm:gap-4">
                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-[#C8A45D] shrink-0">
                      <svg className="h-6 w-6 text-[#C8A45D]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold uppercase text-neutral-450 tracking-wider">Status</p>
                      <p className="text-xs font-bold text-neutral-900 dark:text-white mt-0.5 " title={getStatusLabel(project.status)}>{getStatusLabel(project.status)}</p>
                    </div>
                  </div>
                </div>

                {/* About Content */}
                <div className="bg-white border border-neutral-200/80 rounded-2xl p-3 md:p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/30 space-y-4">
                  <h2 className="section-heading text-left text-neutral-900 dark:text-white font-heading">
                    About {project.projectName}
                  </h2>
                  <div className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed whitespace-pre-line pt-2">
                    {project.description}
                  </div>
                </div>
              </section>

              {/* Highlights */}
              {project.highlights?.length > 0 && (
                <div className="bg-white border border-neutral-200/80 rounded-2xl p-3 md:p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/30 space-y-6">
                  <div>
                    <h2 className="section-heading text-left text-neutral-900 dark:text-white font-heading">
                      Key Highlights
                    </h2>
                  </div>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-neutral-700 dark:text-neutral-350">
                    {project.highlights.map((h) => (
                      <li key={h.id} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-[#C8A45D] mt-0.5" />
                        <span className="font-semibold text-neutral-700 dark:text-neutral-350">{h.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Configurations List (Client Interactive Tabs) */}
              <section id="configurations" className="scroll-mt-36 space-y-6">
                <div className="bg-white border border-neutral-200/80 rounded-2xl p-3 md:p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/30 space-y-6">
                  <div>
                    <h2 className="section-heading text-left text-neutral-900 dark:text-white font-heading">
                      Unit Configurations
                    </h2>
                  </div>
                  <ProjectConfigurationsTabs properties={project.properties} />
                </div>
              </section>

              {/* Amenities */}
              {project.amenities?.length > 0 && (
                <section id="amenities" className="scroll-mt-36">
                  <div className="bg-white border border-neutral-200/80 rounded-2xl p-3 md:p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/30 space-y-6">
                    <div>
                      <h2 className="section-heading text-left text-neutral-900 dark:text-white font-heading">
                        Luxury Amenities
                      </h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {project.amenities.map((a) => (
                        <div key={a.id} className="flex items-center gap-3.5 p-4 rounded-xl border border-neutral-200/60 bg-white shadow-sm dark:border-zinc-850 dark:bg-zinc-900/20 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-[#C8A45D] flex items-center justify-center">
                            {getAmenityIcon(a.name)}
                          </div>
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-350">{a.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {/* Specifications */}
              {project.specifications?.length > 0 && (
                <section id="specifications" className="scroll-mt-36">
                  <div className="bg-white border border-neutral-200/80 rounded-2xl p-3 md:p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/30 space-y-6">
                    <div>
                      <h2 className="section-heading text-left text-neutral-900 dark:text-white font-heading">
                        Project Specifications
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {project.specifications.map((spec) => (
                        <div key={spec.id} className="flex flex-col p-4 rounded-xl bg-slate-50/40 dark:bg-zinc-900/20 border border-slate-100 dark:border-zinc-850">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-450">{spec.title}</span>
                          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {/* Builder Information Section */}
              <section id="builder" className="scroll-mt-36">
                <div className="bg-white border border-neutral-200/80 rounded-2xl p-3 md:p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/30 space-y-6">
                  <div>
                    <h2 className="section-heading">
                      About Developer
                    </h2>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 rounded-2xl border border-neutral-100 bg-neutral-50/20 dark:border-zinc-850 dark:bg-zinc-900/5">
                    <div className="space-y-1.5">
                      <p className="text-lg font-bold text-neutral-900 dark:text-white font-heading">
                        {project.builderName || "Premium Developer"}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 font-semibold">
                        <Info className="h-4 w-4 text-[#C8A45D]" />
                        <span>Developer Sales Representative Office</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {project.builderPhone && (
                        <Button asChild className="secondary-btn flex items-center gap-2 text-xs font-bold py-2 h-9 px-4">
                          <a href={`tel:${project.builderPhone}`}>
                            <Phone className="h-3.5 w-3.5" />
                            {project.builderPhone}
                          </a>
                        </Button>
                      )}
                      {project.builderEmail && (
                        <Button asChild className="secondary-btn flex items-center gap-2 text-xs font-bold py-2 h-9 px-4">
                          <a href={`mailto:${project.builderEmail}`}>
                            <Mail className="h-3.5 w-3.5" />
                            Email Office
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/* Location Map Section */}
              <section id="location" className="scroll-mt-36">
                <div className="bg-white border border-neutral-200/80 rounded-2xl p-3 md:p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/30 space-y-6">
                  <div>
                    <h2 className="section-heading text-left text-neutral-900 dark:text-white font-heading">
                      Location
                    </h2>
                    <p className="text-xs text-neutral-400 font-medium mt-1">
                      Geographic location details.
                    </p>
                  </div>
                  
                  {/* Address info & map button */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-1">
                    <div className="flex items-start gap-2.5 text-sm text-neutral-750 dark:text-neutral-350 font-semibold">
                      <MapPin className="h-5 w-5 shrink-0 text-[#C8A45D] mt-0.5" />
                      <span>{project.address}</span>
                    </div>
                    {project.address && (
                      <Button asChild className="secondary-btn text-xs font-bold py-2 h-9 px-4 flex items-center justify-center gap-2 shrink-0">
                        <a 
                          href={`https://maps.google.com/?q=${encodeURIComponent(project.address)}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <span>Open in Google Maps</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </a>
                      </Button>
                    )}
                  </div>

                  {/* Locality map structure (full width) */}
                  <div className="w-full pt-2">
                    {project.googleMapIframe ? (
                      <div className="w-full h-[360px] rounded-2xl overflow-hidden shadow-inner border border-slate-100 dark:border-zinc-850"
                        dangerouslySetInnerHTML={{ __html: project.googleMapIframe }}
                      />
                    ) : project.address ? (
                      <div className="w-full h-[360px] rounded-2xl overflow-hidden shadow-inner border border-slate-100 dark:border-zinc-850">
                        <iframe
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          allowFullScreen=""
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          src={`https://maps.google.com/maps?q=${encodeURIComponent(project.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                        />
                      </div>
                    ) : (
                      <div className="flex h-[360px] w-full items-center justify-center rounded-2xl bg-slate-50 text-slate-400 text-xs italic dark:bg-zinc-900/20 border border-slate-150">
                        No address or locality map configured.
                      </div>
                    )}
                  </div>
                </div>
              </section>

            </div>

            {/* Right Column: Sticky Enquiry Form & CTAs */}
            <aside className="w-full lg:w-96 shrink-0 space-y-6 lg:sticky lg:top-8">

              {/* Brochure Download Card */}
              {brochureUrl && (
                <div className="md:p-6 p-3 rounded-2xl border border-neutral-200/80 bg-white shadow-sm dark:border-zinc-850 dark:bg-zinc-900/40 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-50 text-[#C8A45D] dark:bg-amber-950/20">
                      <FileDown className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-neutral-800 dark:text-white">Project Brochure</h4>
                      <p className="text-[10px] text-neutral-400">PDF, floor layouts & details</p>
                    </div>
                  </div>
                  <Button asChild className="primary-btn text-xs font-bold py-1.5 px-4 h-9 cursor-pointer">
                    <a href={brochureUrl} target="_blank" rel="noopener noreferrer">
                      Download
                    </a>
                  </Button>
                </div>
              )}

              {/* Enquiry Form */}
              <div id="enquiry-card" className="bg-white border border-neutral-200/80 rounded-3xl p-3 md:p-6 shadow-md dark:border-zinc-850 dark:bg-zinc-900/40 space-y-5">
                <div className="space-y-1 border-b border-neutral-100 dark:border-zinc-800 pb-3">
                  <h3 className="text-base font-bold text-neutral-800 dark:text-white font-heading">Register Interest</h3>
                  <p className="text-xs text-neutral-450 leading-normal">Submit details to receive callback, inventory brochures and viewings schedule.</p>
                </div>
                <PropertyEnquiryForm
                  projectId={project.id}
                  projectTitle={project.projectName}
                />
              </div>

              {/* Quick Communication Box */}
              <div className="rounded-3xl md:p-6 p-3 space-y-4 shadow-lg flex flex-col">
                <h3 className="text-base font-bold font-heading">Direct Consultation</h3>
                <p className="text-xs leading-relaxed">Speak directly with developer sales consultants regarding allocations, discounts, and floor customization.</p>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Button asChild className="secondary-btn w-full gap-1.5 h-10 text-xs font-bold border-white/20 bg-transparent hover:bg-white/10 rounded-xl cursor-pointer flex items-center justify-center">
                    <a href={`tel:${project.builderPhone || "+912240404040"}`}>
                      <Phone className="h-3.5 w-3.5" />
                      Call Sales
                    </a>
                  </Button>
                  <Button asChild className="primary-btn w-full gap-1.5 h-10 text-xs font-bold rounded-xl cursor-pointer flex items-center justify-center">
                    <a href={`https://wa.me/${project.builderPhone || "912240404040"}?text=Hi, I am interested in ${encodeURIComponent(project.projectName)}`} target="_blank" rel="noopener noreferrer">
                      <WhatsappIcon size={16} strokeWidth={2} className="h-4 w-4" />
                      WhatsApp
                    </a>
                  </Button>
                </div>

                <div className="pt-2 text-center border-t border-white/5">
                  <p className="text-[9px] text-slate-500 font-medium">Sales Helpline: {project.builderPhone || "+91 (22) 4040-4040"}</p>
                </div>
              </div>

            </aside>

          </div>

          {/* Related Projects Section */}
          {relatedProjects.length > 0 && (
            <div className="mt-8 pt-8 border-t border-slate-250/20 dark:border-zinc-800">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
                <div>
                  <span className="section-subheading">Related Developments</span>
                  <h3 className="section-heading">Other Projects You May Like</h3>
                </div>
                <Link href="/projects" className="text-xs font-bold text-[var(--brand-primary)] dark:text-[var(--brand-secondary)] hover:underline flex items-center gap-1.5">
                  <span>Explore all projects</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {console.log(relatedProjects,'....dre')}
                {relatedProjects.map((proj) => (
                  <PropertyCard
                    key={proj.id}
                    project={proj}
                    isBestDeal={false}
                  />
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
