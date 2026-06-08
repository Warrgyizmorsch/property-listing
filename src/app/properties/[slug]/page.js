import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
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
    { name: "Properties", url: "/properties" },
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
            <Link href="/properties">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 font-semibold text-neutral-600 dark:text-neutral-450 hover:bg-neutral-100 dark:hover:bg-neutral-900"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Listings
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
              <PropertyBuilderInfo property={property} />

              {/* Body Description */}
              <PropertyDescription description={property.description} />

              {/* Amenities Grid */}
              <PropertyFeatures property={property} />

              {/* Location Cascades */}
              <PropertyLocation property={property} />
            </div>

            {/* Right Column: Sticky Contact Sidebar */}
            <aside className="w-full lg:w-96 shrink-0">
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
