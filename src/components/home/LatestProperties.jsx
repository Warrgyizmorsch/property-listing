import Link from "next/link";
import { ArrowRight, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getLatestProperties } from "@/features/home/services/home.service";
import PropertyCard from "./PropertyCard";

export default async function LatestProperties() {
  const latest = await getLatestProperties(8);

  if (latest.length === 0) {
    return (
      <section className="bg-white py-20 px-4 dark:bg-zinc-950 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
              Latest Listings
            </h2>
            <p className="mt-4 text-lg text-neutral-500 dark:text-neutral-400">
              Discover recently added listings on Property Expert.
            </p>
          </div>
          {/* Empty State */}
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-200 bg-neutral-50 p-12 text-center dark:border-zinc-800 dark:bg-zinc-900/10">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-200/50 text-neutral-400 dark:bg-zinc-800">
              <Inbox className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-neutral-900 dark:text-white">
              No Properties Found
            </h3>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400 max-w-sm">
              We couldn't find any property listings in the database. Head to
              the admin dashboard to add listings.
            </p>
            <Link href="/admin/login" className="mt-6">
              <Button
                size="sm"
                className="bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
              >
                Log In to Admin
              </Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-20 px-4 dark:bg-zinc-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-600 dark:text-indigo-400">
              Fresh Listings
            </span>
            <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
              Latest Properties
            </h2>
            <p className="mt-4 text-neutral-500 dark:text-neutral-400">
              Browse our newest apartments, villas, and commercial listings.
              Restocked daily.
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

        {/* Property Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {latest.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </section>
  );
}
