import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getFeaturedProperties } from "@/features/home/services/home.service";
import { getLatestProperties } from "@/features/home/services/home.service";
import PropertyCard from "./PropertyCard";

export default async function HomeProperties() {
  const featured = await getFeaturedProperties(9);
  const latest = await getLatestProperties(12);

  return (
    <section className="bg-neutral-50 py-20 px-4 dark:bg-zinc-900/10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-600 dark:text-indigo-400">
              Listings Spotlight
            </span>
            <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
              Explore Featured & Latest Properties
            </h2>
            <p className="mt-4 text-neutral-500 dark:text-neutral-400">
              A curated view of our premium listings plus the newest additions.
            </p>
          </div>
          <Link href="/properties" className="shrink-0">
            <Button
              variant="outline"
              className="group font-semibold gap-1.5 border-neutral-200 bg-white hover:bg-neutral-50 dark:border-zinc-800 dark:bg-zinc-900"
            >
              View All Listings
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Button>
          </Link>
        </div>

        {/* Featured Grid */}
        <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>

        {/* Latest Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">
              Newest Listings
            </h3>
            <Link
              href="/properties"
              className="text-sm text-indigo-600 hover:underline"
            >
              See all
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {latest.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
