import { Suspense } from "react";
import Image from "next/image";
import Navbar from "@/components/frontend/Navbar";
import Footer from "@/components/frontend/Footer";
import ProjectFilters from "@/components/projects/ProjectFilters";
import ProjectSearch from "@/components/projects/ProjectSearch";
import ProjectSort from "@/components/projects/ProjectSort";
import ProjectPagination from "@/components/projects/ProjectPagination";
import MobileFilterButton from "@/components/projects/MobileFilterButton";
import { ProjectCardSkeleton } from "@/components/projects/ProjectCard";
import { PropertyCard } from "@/components/home/PropertyCards";
import { FolderOpen } from "lucide-react";
import {
  getPublicProjects,
  getPublicFiltersMetadata,
} from "@/features/projects/public/services/public-project.service";
import { generatePageMetadata } from "@/lib/seo/metadata";
import {
  getBreadcrumbSchema,
} from "@/lib/seo/schemas";

// Dynamic SEO metadata generator based on active query filters
export async function generateMetadata({ searchParams }) {
  const params = await searchParams;
  const category = params.category
    ? params.category.charAt(0).toUpperCase() + params.category.slice(1)
    : "";
  const city = params.city
    ? params.city.charAt(0).toUpperCase() + params.city.slice(1)
    : "";
  const status = params.status
    ? params.status.charAt(0).toUpperCase() + params.status.slice(1).toLowerCase()
    : "";

  let fallbackTitle = "Premium Real Estate Projects | Property Expert";
  if (category || city || status) {
    const parts = [status, category, "Projects", city ? `in ${city}` : ""].filter(Boolean);
    fallbackTitle = `${parts.join(" ")} | Property Expert`;
  }

  const fallbackDescription = `Explore the finest selection of premium ${status || ""} ${category || "real estate"} projects ${city ? `in ${city}` : ""} on Property Expert. Find your next masterpiece development.`;

  return await generatePageMetadata({
    pageType: "PROPERTY_LISTING", // Use listing configuration type fallback
    fallbackData: {
      title: fallbackTitle,
      description: fallbackDescription,
      path: "/projects",
    },
  });
}

function LoadingGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {[...Array(count)].map((_, i) => (
        <ProjectCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Separate component for server-side async query resolution to enable streaming loader pages
async function ListingGridContainer({ searchParamsResolved }) {
  const page = parseInt(searchParamsResolved.page || "1", 10);
  const limit = 6;

  // Fetch results based on resolved URL parameters
  const { projects, total, totalPages } = await getPublicProjects({
    search: searchParamsResolved.search || "",
    category: searchParamsResolved.category || "",
    city: searchParamsResolved.city || "",
    state: searchParamsResolved.state || "",
    country: searchParamsResolved.country || "",
    status: searchParamsResolved.status || "",
    bhk: searchParamsResolved.bhk || "",
    isFeatured: searchParamsResolved.isFeatured || undefined,
    sortBy: searchParamsResolved.sortBy || "latest",
    page,
    limit,
  });

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Projects", url: "/projects" },
  ]);

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 border border-dashed border-neutral-200 bg-white rounded-2xl text-center shadow-xs dark:border-zinc-800 dark:bg-zinc-900/40">
        <FolderOpen className="h-12 w-12 text-neutral-400 mb-4" />
        <h3 className="text-base font-bold text-neutral-800 dark:text-white">No Projects Found</h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2 max-w-sm">
          We couldn&apos;t find any real estate projects matching your current parameters. Reset your search criteria or explore other locations!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Structured JSON-LD Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Search status header */}
      <div className="flex items-center justify-between border-b border-neutral-100 pb-4 dark:border-zinc-800">
        <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest dark:text-neutral-400">
          Showing {projects.length} of {total}{" "}
          {total === 1 ? "project match" : "project matches"}
        </p>
      </div>

      {/* Projects card grid — 2 columns to fit sidebar layout */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {projects.map((project) => (
          <PropertyCard key={project.id} project={project} />
        ))}
      </div>

      {/* Server-side Pagination */}
      <ProjectPagination page={page} totalPages={totalPages} />
    </div>
  );
}

export default async function ProjectsPage({ searchParams }) {
  // Await searchParams before reading properties (Next.js 15 App Router requirement)
  const resolvedSearchParams = await searchParams;

  // Fetch filter metadata on the server
  const filtersMetadata = await getPublicFiltersMetadata();

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950 font-sans">
      <Navbar />

      <main className="flex-grow">
        {/* ─── Hero Section ─── */}
        <section className="relative w-full min-h-[50vh] md:min-h-[60vh] flex items-center justify-center overflow-hidden">
          {/* Background image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/project/Project-hero.png"
              alt="Explore Our Projects"
              fill
              className="object-cover"
              priority
            />
            {/* Dark overlay using global brand-primary color */}
            <div className="absolute inset-0 bg-[var(--brand-primary)]/60 mix-blend-multiply z-10" />
          </div>

          {/* Hero content */}
          <div className="relative z-20 text-center px-6 md:px-8 max-w-3xl mx-auto flex flex-col items-center brand-reveal">
            {/* Gold rule */}
            <div className="w-16 h-[2px] bg-[#C8A45D] mb-6" />

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4 font-heading">
              Explore Our Projects
            </h1>
            <p className="text-base md:text-lg text-white/90 max-w-xl leading-relaxed">
              Discover architectural masterpieces and exclusive residential developments tailored for the discerning few.
            </p>
          </div>
        </section>

        {/* ─── Main Content ─── */}
        <div className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {/* Main Layout Grid: Sidebar + Content */}
            <div className="flex flex-col lg:flex-row gap-8 items-start">

              {/* Desktop Left Sidebar Filters */}
              <aside className="hidden lg:block w-72 shrink-0 border border-neutral-100 bg-white p-6 rounded-2xl shadow-xs dark:border-zinc-800 dark:bg-zinc-900/40">
                <div className="border-b border-neutral-100 pb-4 mb-4 dark:border-zinc-800">
                  <h2 className="text-sm font-bold tracking-widest text-neutral-900 uppercase dark:text-white">
                    Filter Projects
                  </h2>
                </div>
                <ProjectFilters metadata={filtersMetadata} />
              </aside>

              {/* Main Listing View (Search + Grid) */}
              <div className="flex-1 w-full flex flex-col gap-6">
                {/* Search bar & Sorting selector */}
                <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-neutral-100 bg-white dark:border-zinc-800 dark:bg-zinc-900/20">
                  <div className="flex-grow max-w-md">
                    <ProjectSearch />
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Mobile Filters Trigger Drawer */}
                    <MobileFilterButton metadata={filtersMetadata} />

                    {/* Sort Control */}
                    <ProjectSort />
                  </div>
                </div>

                {/* Streaming dynamic projects matching filters */}
                <Suspense
                  key={JSON.stringify(resolvedSearchParams)}
                  fallback={<LoadingGrid count={6} />}
                >
                  <ListingGridContainer
                    searchParamsResolved={resolvedSearchParams}
                  />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
