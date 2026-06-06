import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getFeaturedProperties } from "@/features/home/services/home.service";
import PropertyCard from "./PropertyCard";

export default async function FeaturedProperties() {
  const featured = await getFeaturedProperties(6);

  if (featured.length === 0) {
    return (
      <section className="bg-neutral-50 py-20 px-4 dark:bg-zinc-900/10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
              Featured Properties
            </h2>
            <p className="mt-4 text-lg text-neutral-500 dark:text-neutral-400">
              Our handpicked selection of premium property listings.
            </p>
          </div>
          {/* Empty State */}
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900/30">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <Star className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-neutral-900 dark:text-white">No Featured Listings</h3>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400 max-w-sm">
              We don't have handpicked listings available at this moment. Click below to explore all active properties or check back later!
            </p>
            <div className="mt-6 flex gap-3">
              <Link href="/properties">
                <Button size="sm" className="bg-indigo-600 text-white font-semibold hover:bg-indigo-700">
                  Explore Listings
                </Button>
              </Link>
              <Link href="/admin/login">
                <Button size="sm" variant="outline" className="font-semibold">
                  Add Property
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-neutral-50 py-20 px-4 dark:bg-zinc-900/10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Handpicked Deals
            </span>
            <h2 className="mt-2 font-heading text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
              Featured Properties
            </h2>
            <p className="mt-4 text-neutral-500 dark:text-neutral-400">
              Explore our collection of the most exclusive and highly demanded properties currently listed.
            </p>
          </div>
          <Link href="/properties?isFeatured=true" className="shrink-0">
            <Button variant="outline" className="group font-semibold gap-1.5 border-neutral-200 bg-white hover:bg-neutral-50 dark:border-zinc-800 dark:bg-zinc-900">
              View All Featured
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Button>
          </Link>
        </div>

        {/* Property Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

      </div>
    </section>
  );
}
