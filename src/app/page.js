import { Suspense } from "react";
import Navbar from "@/components/frontend/Navbar";
import Footer from "@/components/frontend/Footer";
import HeroSection from "@/components/home/HeroSection";
import HomeProperties from "@/components/home/HomeProperties";
import CategorySection from "@/components/home/CategorySection";
import LocationSection from "@/components/home/LocationSection";
import HowItWorks from "@/components/home/HowItWorks";
import BgImageSection from "@/components/home/BgImageSection";
import WhyYouShouldWorkWithUs from "@/components/home/WhyYouShouldWorkWithUs";
import { ProjectCardSkeleton } from "@/components/projects/ProjectCard";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { getOrganizationSchema, getWebSiteSchema } from "@/lib/seo/schemas";

// Dynamic Next.js 15 SEO Metadata
export async function generateMetadata() {
  return await generatePageMetadata({
    pageType: "HOME",
    fallbackData: {
      title: "Property Expert | Premium Real Estate Projects & Luxury Developments",
      description:
        "Discover exceptional residential projects, luxury villa developments, penthouses, and premier commercial projects. Property Expert provides curated real estate catalogs and developer contact channels.",
      keywords:
        "real estate, property expert, luxury projects, buy flats, residential complexes, villa communities, commercial projects",
      path: "/",
    },
  });
}

function SectionSkeleton() {
  return (
    <div className="mx-auto max-w-7xl py-12 px-6 animate-pulse">
      <div className="h-6 w-48 rounded bg-neutral-200 dark:bg-zinc-800" />
      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-24 rounded-xl bg-neutral-100 dark:bg-zinc-900"
          />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const orgSchema = getOrganizationSchema();
  const websiteSchema = getWebSiteSchema();

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950 font-sans">
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

      <main className="grow">
        {/* 1. Hero Section & Filter Search Form */}
        <Suspense
          fallback={
            <div className="relative flex min-h-[85vh] flex-col items-center justify-center bg-neutral-900 animate-pulse">
              <div className="h-8 w-64 rounded bg-neutral-800" />
            </div>
          }
        >
          <HeroSection />
        </Suspense>

        {/* Padding container to balance floating absolute elements in Hero Section */}
        <div className="h-10 md:h-16"></div>

        <div className="max-w-[1500px] mx-auto space-y-10">
          {/* 2. Browse By Category */}
          <Suspense fallback={<SectionSkeleton />}>
            <CategorySection />
          </Suspense>

          {/* 3. Main Properties (Featured + Status Lists) */}
          <Suspense
            fallback={
              <div className="mx-auto max-w-7xl py-8 px-6">
                <div className="h-8 w-48 rounded bg-neutral-200 dark:bg-zinc-800 mb-5" />
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {[...Array(3)].map((_, i) => (
                    <ProjectCardSkeleton key={i} />
                  ))}
                </div>
              </div>
            }
          >
            <HomeProperties />
          </Suspense>

          {/* 4. Browse By Location */}
          <Suspense fallback={<SectionSkeleton />}>
            <LocationSection />
          </Suspense>

          {/* 5. How It Works */}
          <div className="px-6 lg:px-8">
            <HowItWorks />
          </div>

          {/* 6. Background Promo Banner */}
          <div className="px-6 lg:px-8">
            <BgImageSection />
          </div>

          {/* 7. Why You Should Work With Us */}
          <div className="px-6 lg:px-8 pb-16">
            <WhyYouShouldWorkWithUs />
          </div>
        </div>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
