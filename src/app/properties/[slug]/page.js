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
import PropertyLocation from "@/components/property/PropertyLocation";
import StickySidebar from "@/components/property/StickySidebar";
import RelatedProperties from "@/components/property/RelatedProperties";
import { getPropertyDetails } from "@/features/property-details/services/detail.service";

// Dynamic metadata generator for SEO and OpenGraph attributes (resolves params dynamically)
export async function generateMetadata({ params }) {
  const { slug } = await params; // Await params is a Next.js 15 requirement
  const property = await getPropertyDetails(slug);

  if (!property) {
    return {
      title: "Property Not Found | LuxeEstates",
      description: "The requested property listing could not be found or has been archived.",
    };
  }

  const title = `${property.title} | LuxeEstates`;
  const description = property.description.slice(0, 160);
  const imageUrl = property.images?.[0]?.url || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800";

  return {
    title,
    description,
    alternates: {
      canonical: `https://luxeestates.com/properties/${property.slug}`,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://luxeestates.com/properties/${property.slug}`,
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 600,
          alt: property.title,
        },
      ],
    },
  };
}

export default async function PropertyDetailPage({ params }) {
  const { slug } = await params; // Await params is a Next.js 15 requirement
  const property = await getPropertyDetails(slug);

  if (!property) {
    notFound(); // Redirects to the custom not-found page
  }

  // Construct structured JSON-LD schemas dynamically for RealEstateListing and Breadcrumbs
  const realEstateSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": property.title,
    "description": property.description.slice(0, 200),
    "datePosted": property.createdAt,
    "url": `https://luxeestates.com/properties/${property.slug}`,
    "image": property.images?.[0]?.url || "",
    "about": {
      "@type": "Accommodation",
      "name": property.title,
      "description": property.description.slice(0, 200),
      "address": {
        "@type": "PostalAddress",
        "streetAddress": property.address,
        "addressLocality": property.city?.name,
        "addressRegion": property.city?.state?.name,
        "addressCountry": property.city?.state?.country?.name,
      },
      "numberOfBedrooms": property.bedrooms,
      "numberOfBathrooms": property.bathrooms,
      "offers": {
        "@type": "Offer",
        "price": property.price,
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
      },
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://luxeestates.com",
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Properties",
        "item": "https://luxeestates.com/properties",
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": property.title,
        "item": `https://luxeestates.com/properties/${property.slug}`,
      },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50/20 dark:bg-zinc-950 font-sans">
      {/* Dynamic Structured SEO Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(realEstateSchema) }}
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

              {/* Body Description */}
              <PropertyDescription description={property.description} />

              {/* Amenities Grid */}
              <PropertyFeatures category={property.category} />

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
