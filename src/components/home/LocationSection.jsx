import Link from "next/link";
import { MapPin, Navigation } from "lucide-react";
import { getHomeLocations } from "@/features/home/services/home.service";

export default async function LocationSection() {
  const locations = await getHomeLocations(8);

  if (locations.length === 0) {
    return null; // Don't render if there are no locations with properties to maintain a clean layout
  }

  return (
    <section className="bg-neutral-50 py-20 px-4 dark:bg-zinc-900/10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-600 dark:text-indigo-400">
              Popular Cities
            </span>
            <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
              Browse By Location
            </h2>
            <p className="mt-4 text-neutral-500 dark:text-neutral-400">
              Explore projects across top regions.
            </p>
          </div>
        </div>

        {/* Location Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {locations.map((city) => {
            const count = city._count?.projects ?? 0;
            const subtext = `${city.state?.name || ""}, ${city.state?.country?.name || ""}`;

            return (
              <Link
                key={city.id}
                href={`/projects?country=${city.state?.country?.slug}&state=${city.state?.slug}&city=${city.slug}`}
                className="group relative flex items-center justify-between p-5 rounded-2xl border border-neutral-100 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/20"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 dark:bg-zinc-800 dark:text-indigo-400 dark:group-hover:bg-indigo-600 dark:group-hover:text-white">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {city.name}
                    </h3>
                    <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                      {subtext}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="inline-flex items-center rounded-lg bg-neutral-100 px-2.5 py-1 text-xs font-bold text-neutral-800 dark:bg-zinc-800 dark:text-neutral-200">
                    {count} {count === 1 ? "Project" : "Projects"}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
