import { Suspense } from "react";
import Navbar from "@/components/frontend/Navbar";
import Footer from "@/components/frontend/Footer";
import PropertyFilters from "@/components/properties/PropertyFilters";
import PropertySearch from "@/components/properties/PropertySearch";
import PropertySort from "@/components/properties/PropertySort";
import PropertyGrid from "@/components/properties/PropertyGrid";
import PropertyPagination from "@/components/properties/PropertyPagination";
import MobileFilterButton from "@/components/properties/MobileFilterButton";
import LoadingState from "@/components/properties/LoadingState";
import { getPublicProperties, getPublicFiltersMetadata } from "@/features/properties/public/services/public.service";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { getBreadcrumbSchema, getCollectionPageSchema } from "@/lib/seo/schemas";

// Dynamic SEO metadata generator based on active query filters
export async function generateMetadata({ searchParams }) {
  const params = await searchParams;
  const category = params.category ? params.category.charAt(0).toUpperCase() + params.category.slice(1) : "";
  const city = params.city ? params.city.charAt(0).toUpperCase() + params.city.slice(1) : "";
  const purpose = params.purpose ? `For ${params.purpose.charAt(0).toUpperCase() + params.purpose.slice(1)}` : "";

  let fallbackTitle = "Premium Property Catalog | LuxeEstates";
  if (category || city || purpose) {
    const parts = [category, purpose, city].filter(Boolean);
    fallbackTitle = `${parts.join(" ")} Listings | LuxeEstates`;
  }

  const fallbackDescription = `Explore the finest selection of premium ${category || "real estate"} listings ${purpose || ""} in ${city || "top regions"} on LuxeEstates. Find your next masterpiece home today.`;

  return await generatePageMetadata({
    pageType: "PROPERTY_LISTING",
    fallbackData: {
      title: fallbackTitle,
      description: fallbackDescription,
      path: "/properties",
    },
  });
}

// Separate component for async data resolution to enable streaming loaders
async function ListingGridContainer({ searchParamsResolved }) {
  const page = parseInt(searchParamsResolved.page || "1", 10);
  const limit = 9;

  // Fetch results based on resolved URL parameters
  const { properties, total, totalPages } = await getPublicProperties({
    search: searchParamsResolved.search || "",
    category: searchParamsResolved.category || "",
    city: searchParamsResolved.city || "",
    state: searchParamsResolved.state || "",
    country: searchParamsResolved.country || "",
    status: searchParamsResolved.status || "",
    purpose: searchParamsResolved.purpose || "",
    minPrice: searchParamsResolved.priceMin || undefined,
    maxPrice: searchParamsResolved.priceMax || undefined,
    bedrooms: searchParamsResolved.bedrooms || undefined,
    bathrooms: searchParamsResolved.bathrooms || undefined,
    isFeatured: searchParamsResolved.isFeatured || undefined,
    sortBy: searchParamsResolved.sortBy || "latest",
    page,
    limit,
  });

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Properties", url: "/properties" },
  ]);
  const collectionSchema = getCollectionPageSchema(properties);

  return (
    <div className="flex flex-col gap-6">
      {/* Structured JSON-LD Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      {/* Search status header */}
      <div className="flex items-center justify-between border-b border-neutral-100 pb-4 dark:border-neutral-850">
        <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest">
          Showing {properties.length} of {total} {total === 1 ? "listing match" : "listing matches"}
        </p>
      </div>

      {/* Renders property grid or empty state */}
      <PropertyGrid properties={properties} />

      {/* Server-side Pagination */}
      <PropertyPagination page={page} totalPages={totalPages} />
    </div>
  );
}

export default async function PropertiesPage({ searchParams }) {
  // Await searchParams before reading properties (Next.js 15 App Router requirement)
  const resolvedSearchParams = await searchParams;
  
  // Fetch filter metadata on the server
  const filtersMetadata = await getPublicFiltersMetadata();

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50/20 dark:bg-zinc-950 font-sans">
      <Navbar />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          
          {/* Headline Section */}
          <div className="mb-10 text-left">
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Premium Listings
            </span>
            <h1 className="mt-2 font-heading text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
              Explore Our Properties
            </h1>
            <p className="mt-2 text-neutral-500 dark:text-neutral-400 max-w-2xl text-sm leading-6">
              Browse apartments, villas, and commercial real estate suited to your custom parameters. Use the advanced filters to isolate your target choices.
            </p>
          </div>

          {/* Main Layout Grid */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Desktop Left Sidebar Filters */}
            <aside className="hidden lg:block w-72 shrink-0 border border-neutral-100 bg-white p-6 rounded-2xl shadow-xs dark:border-zinc-800 dark:bg-zinc-900/40">
              <div className="border-b border-neutral-100 pb-4 mb-4 dark:border-neutral-850">
                <h2 className="text-sm font-extrabold tracking-widest text-neutral-900 uppercase dark:text-white">
                  Filter Properties
                </h2>
              </div>
              <PropertyFilters metadata={filtersMetadata} />
            </aside>

            {/* Main Listing View (Search + Grid) */}
            <div className="flex-1 w-full flex flex-col gap-6">
              {/* Search bar & Sorting selector */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-neutral-100 bg-white dark:border-zinc-800 dark:bg-zinc-900/20">
                <div className="flex-grow max-w-md">
                  <PropertySearch />
                </div>
                
                <div className="flex items-center gap-3">
                  {/* Mobile Filters Trigger Drawer */}
                  <MobileFilterButton metadata={filtersMetadata} />
                  
                  {/* Sort Control */}
                  <PropertySort />
                </div>
              </div>

              {/* Streaming dynamic properties matching filters */}
              <Suspense key={JSON.stringify(resolvedSearchParams)} fallback={<LoadingState count={6} />}>
                <ListingGridContainer searchParamsResolved={resolvedSearchParams} />
              </Suspense>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
