import Link from "next/link";
import {
  Building,
  Home,
  Briefcase,
  Map,
  Hotel,
  ArrowRight,
} from "lucide-react";
import { getHomeCategories } from "@/features/home/services/home.service";

export default async function CategorySection() {
  const categories = await getHomeCategories();

  // Helper to map category slugs/names to appropriate Lucide icons
  const getIcon = (slug) => {
    switch (slug?.toLowerCase()) {
      case "apartment":
        return <Building className="h-6 w-6" />;
      case "villa":
        return <Home className="h-6 w-6" />;
      case "commercial":
        return <Briefcase className="h-6 w-6" />;
      case "land":
        return <Map className="h-6 w-6" />;
      case "penthouse":
        return <Hotel className="h-6 w-6" />;
      default:
        return <Building className="h-6 w-6" />;
    }
  };

  // Predefined custom color themes for categories to create rich visual diversity
  const colors = {
    apartment:
      "from-blue-500/10 to-indigo-500/10 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/30",
    villa:
      "from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30",
    commercial:
      "from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30",
    land: "from-sky-500/10 to-cyan-500/10 text-sky-600 dark:text-sky-400 border-sky-100 dark:border-sky-900/30",
    penthouse:
      "from-violet-500/10 to-purple-500/10 text-violet-600 dark:text-violet-400 border-violet-100 dark:border-violet-900/30",
  };

  return (
    <section className="bg-white py-20 px-4 dark:bg-zinc-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-600 dark:text-indigo-400">
            Categorized Listings
          </span>
          <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
            Browse By Category
          </h2>
          <p className="mt-4 text-neutral-500 dark:text-neutral-400 text-base">
            Find the perfect matching layout type for your residential,
            investment, or commercial operations.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-5">
          {categories.map((category) => {
            const slug = category.slug || "";
            const theme =
              colors[slug.toLowerCase()] ||
              "from-neutral-500/10 to-slate-500/10 text-neutral-600 dark:text-neutral-400 border-neutral-100 dark:border-neutral-800";
            const count = category._count?.properties ?? 0;

            return (
              <Link
                key={category.id}
                href={`/properties?categoryId=${category.id}`}
                className="group relative flex flex-col items-center text-center p-6 rounded-2xl border border-neutral-100 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-indigo-100 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/20 dark:hover:border-zinc-700/80"
              >
                {/* Icon Container */}
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br border ${theme} transition-transform duration-300 group-hover:scale-105 shadow-xs`}
                >
                  {getIcon(category.slug)}
                </div>

                {/* Name */}
                <h3 className="mt-5 text-sm font-semibold text-neutral-950 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {category.name}
                </h3>

                {/* Active counts */}
                <p className="mt-1.5 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                  {count} {count === 1 ? "Listing" : "Listings"}
                </p>

                {/* Arrow slide-in effect */}
                <div className="mt-4 flex h-6 w-6 translate-y-1 items-center justify-center rounded-full bg-neutral-50 text-neutral-400 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:opacity-100 dark:bg-zinc-850 dark:text-zinc-500 dark:group-hover:bg-indigo-950 dark:group-hover:text-indigo-400">
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
