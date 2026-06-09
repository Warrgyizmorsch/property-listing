import { notFound } from "next/navigation";
import { ArrowLeft, MapPin } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/frontend/Navbar";
import Footer from "@/components/frontend/Footer";
import PropertyHeader from "@/components/property/PropertyHeader";
import PropertyGallery from "@/components/property/PropertyGallery";
import PropertyOverview from "@/components/property/PropertyOverview";
import PropertyDescription from "@/components/property/PropertyDescription";
import PropertyFeatures from "@/components/property/PropertyFeatures";
import PropertyBuilderInfo from "@/components/property/PropertyBuilderInfo";
import PropertyLocation from "@/components/property/PropertyLocation";
import StickySidebar from "@/components/property/StickySidebar";
import RelatedProperties from "@/components/property/RelatedProperties";
import { getPropertyDetails } from "@/features/property-details/services/detail.service";
import { generatePageMetadata } from "@/lib/seo/metadata";
import {
  getBreadcrumbSchema,
  getRealEstateListingSchema,
  getResidenceSchema,
} from "@/lib/seo/schemas";

// Dynamic metadata generator for SEO and OpenGraph attributes (resolves params dynamically)
export async function generateMetadata({ params }) {
  const { slug } = await params; // Await params is a Next.js 15 requirement
  const property = await getPropertyDetails(slug);

  if (!property) {
    return {
      title: "Property Not Found | Property Expert",
      description:
        "The requested property listing could not be found or has been archived.",
    };
  }

  return await generatePageMetadata({
    pageType: "PROPERTY",
    entityId: property.id,
    fallbackData: {
      title: property.title,
      description: property.description,
    },
  });
}

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

export default async function PropertyDetailPage({ params }) {
  const { slug } = await params; // Await params is a Next.js 15 requirement
  const property = await getPropertyDetails(slug);

  if (!property) {
    notFound(); // Redirects to the custom not-found page
  }

  // Construct structured JSON-LD schemas dynamically for RealEstateListing, Residence, and Breadcrumbs
  const realEstateSchema = getRealEstateListingSchema(property);
  const residenceSchema = getResidenceSchema(property);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    property.project
      ? { name: property.project.projectName, url: `/projects/${property.project.slug}` }
      : { name: "Projects", url: "/projects" },
    { name: property.title, url: `/properties/${property.slug}` },
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50/20 dark:bg-zinc-950 font-sans">
      {/* Dynamic Structured SEO Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(realEstateSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(residenceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Navbar />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Back Navigation Button */}
          <div className="mb-6">
            <Link href={property.project ? `/projects/${property.project.slug}` : "/projects"}>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 font-semibold text-neutral-650 dark:text-neutral-350 hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                {property.project ? `Back to ${property.project.projectName}` : "Back to Projects"}
              </Button>
            </Link>
          </div>

          {/* Core Layout Grid */}
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            {/* Left Column: Media Gallery, Info Overview, Description, and Features */}
            <div className="flex-1 w-full flex flex-col gap-6">
              {/* Header Details */}
              <PropertyHeader property={property} />

              {/* Media Gallery with Lightbox */}
              <PropertyGallery images={property.images} />

              {/* Technical Specifications Overview */}
              <PropertyOverview property={property} />

              {/* Builder & Listing Details */}
              {/* <PropertyBuilderInfo property={property} /> */}

              {/* Body Description */}
              <PropertyDescription description={property.description} />

              {/* Amenities Grid */}
              {/* <PropertyFeatures property={property} /> */}

              {/* Location Cascades */}
              <PropertyLocation property={property} />
            </div>

            {/* Right Column: Sticky Contact Sidebar & Project Card */}
            <aside className="w-full lg:w-96 shrink-0 space-y-6">
              {property.project && (
                <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/30 space-y-4">
                  <div className="relative h-32 w-full rounded-xl overflow-hidden bg-neutral-900">
                    <img
                      src={property.project.mainImage || property.project.bannerImage || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=400"}
                      alt={property.project.projectName}
                      className="h-full w-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold border shadow-xs ${getStatusBadgeClass(property.project.status)}`}>
                        {getStatusLabel(property.project.status)}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-650 dark:text-indigo-400">Part of Project</p>
                    <h4 className="text-base font-bold text-neutral-900 dark:text-white mt-1 hover:underline">
                      <Link href={`/projects/${property.project.slug}`}>
                        {property.project.projectName}
                      </Link>
                    </h4>
                    <p className="text-xs text-neutral-500 mt-1">
                      Developed by <span className="font-bold text-neutral-700 dark:text-neutral-300">{property.project.builderName}</span>
                    </p>
                  </div>

                  <hr className="border-slate-100 dark:border-zinc-850" />

                  <div className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 shrink-0 text-neutral-400 mt-0.5" />
                      <span>
                        {property.project.address || `${property.project.city?.name}, ${property.project.city?.state?.name || ""}`}
                      </span>
                    </div>
                  </div>

                  <Link href={`/projects/${property.project.slug}`} className="block w-full">
                    <Button size="sm" className="w-full gap-1 h-9 text-xs font-bold bg-slate-950 text-white hover:bg-slate-800 rounded-xl cursor-pointer">
                      View Project Details
                    </Button>
                  </Link>
                </div>
              )}

              <StickySidebar property={property} />
            </aside>
          </div>

          {/* Related Listings section */}
          <RelatedProperties property={property} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
