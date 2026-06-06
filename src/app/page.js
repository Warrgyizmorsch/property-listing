import { Suspense } from "react";
import Navbar from "@/components/frontend/Navbar";
import Footer from "@/components/frontend/Footer";
import HeroSection from "@/components/home/HeroSection";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import LatestProperties from "@/components/home/LatestProperties";
import CategorySection from "@/components/home/CategorySection";
import LocationSection from "@/components/home/LocationSection";
import StatisticsSection from "@/components/home/StatisticsSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import TestimonialSection from "@/components/home/TestimonialSection";
import CTASection from "@/components/home/CTASection";
import { PropertyCardSkeleton } from "@/components/home/PropertyCard";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { getOrganizationSchema, getWebSiteSchema } from "@/lib/seo/schemas";

// Dynamic Next.js 15 SEO Metadata
export async function generateMetadata() {
  return await generatePageMetadata({
    pageType: "HOME",
    fallbackData: {
      title: "LuxeEstates | Premium Property Listings & Luxury Real Estate",
      description: "Discover exceptional luxury apartments, villas, penthouses, and commercial properties. LuxeEstates provides curated listings and transparent transaction pathways with certified agents.",
      keywords: "real estate, luxury villas, buy apartments, penthouses, commercial properties, property finder, property listing",
      path: "/",
    },
  });
}


// Loader skeletons for dynamic database sections
function PropertiesGridSkeleton({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(count)].map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  );
}

function SectionSkeleton() {
  return (
    <div className="mx-auto max-w-7xl py-12 px-4 animate-pulse">
      <div className="h-6 w-48 rounded bg-neutral-200 dark:bg-zinc-800" />
      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-neutral-100 dark:bg-zinc-900" />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const orgSchema = getOrganizationSchema();
  const websiteSchema = getWebSiteSchema();

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50/30 dark:bg-zinc-950 font-sans">
      {/* Structured JSON-LD Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      
      {/* Global Header */}
      <Navbar />

      <main className="flex-grow">
        {/* 1. Hero Section & Quick Search Form */}
        <Suspense fallback={
          <div className="relative flex min-h-[70vh] items-center justify-center bg-neutral-900 animate-pulse">
            <div className="h-8 w-64 rounded bg-neutral-800" />
          </div>
        }>
          <HeroSection />
        </Suspense>

        {/* 2. Browse By Category */}
        <Suspense fallback={<SectionSkeleton />}>
          <CategorySection />
        </Suspense>

        {/* 3. Featured Properties */}
        <Suspense fallback={
          <div className="mx-auto max-w-7xl py-20 px-4">
            <div className="h-8 w-48 rounded bg-neutral-200 dark:bg-zinc-800 mb-8" />
            <PropertiesGridSkeleton count={3} />
          </div>
        }>
          <FeaturedProperties />
        </Suspense>

        {/* 4. Why Choose Us */}
        <WhyChooseUs />

        {/* 5. Statistics Overview */}
        <Suspense fallback={
          <div className="w-full bg-neutral-900 py-16 animate-pulse">
            <div className="mx-auto max-w-7xl grid grid-cols-4 gap-6 px-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 rounded-xl bg-neutral-800" />
              ))}
            </div>
          </div>
        }>
          <StatisticsSection />
        </Suspense>

        {/* 6. Latest Listings */}
        <Suspense fallback={
          <div className="mx-auto max-w-7xl py-20 px-4">
            <div className="h-8 w-48 rounded bg-neutral-200 dark:bg-zinc-800 mb-8" />
            <PropertiesGridSkeleton count={4} />
          </div>
        }>
          <LatestProperties />
        </Suspense>

        {/* 7. Browse By Location */}
        <Suspense fallback={<SectionSkeleton />}>
          <LocationSection />
        </Suspense>

        {/* 8. Testimonials Section */}
        <TestimonialSection />

        {/* 9. Conversion CTA Section */}
        <CTASection />
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
