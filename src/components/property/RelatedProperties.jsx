import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { getRelatedProperties } from "@/features/property-details/services/detail.service";

export default async function RelatedProperties({ property }) {
  // Query related listings on the server
  const related = await getRelatedProperties({
    propertyId: property.id,
    categoryId: property.categoryId,
    cityId: property.cityId,
    limit: 4,
  });

  if (related.length === 0) return null; // Hide the section if no related properties are found

  return (
    <div className="py-12 border-t border-neutral-100 dark:border-neutral-850">
      <h2 className="font-heading text-lg font-bold text-neutral-900 uppercase tracking-widest mb-8 dark:text-white">
        Similar Listings You May Like
      </h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {related.map((p) => {
          const thumbnail = p.images?.[0]?.url || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800";
          const locationText = `${p.city?.name || ""}, ${p.city?.state?.name || ""}`;

          return (
            <div
              key={p.id}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/40"
            >
              {/* Image Aspect ratio container */}
              <div className="relative aspect-video w-full overflow-hidden bg-neutral-100 dark:bg-zinc-800">
                <Image
                  src={thumbnail}
                  alt={p.title}
                  fill
                  sizes="(max-w-7xl) 25vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-103"
                />

                {/* Badges */}
                <div className="absolute left-2.5 top-2.5 flex flex-wrap gap-1.5 z-10">
                  <span className="inline-flex items-center rounded-md bg-indigo-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                    For {p.purpose?.name || "Sale"}
                  </span>
                  {p.status && (
                    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold border shadow-xs ${p.status.colorClass || "bg-white text-neutral-800 border-neutral-200"}`}>
                      {p.status.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Contents */}
              <div className="flex flex-1 flex-col p-4">
                <span className="text-[10px] font-bold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase">
                  {p.category?.name}
                </span>

                <h3 className="mt-1 mb-1.5 line-clamp-1 text-sm font-bold text-neutral-900 hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400">
                  <Link href={`/properties/${p.slug}`}>
                    {p.title}
                  </Link>
                </h3>

                <p className="mb-3 flex items-center gap-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                  <MapPin className="h-3 w-3 shrink-0 text-neutral-400" />
                  <span className="truncate">{locationText}</span>
                </p>

                <div className="mt-auto pt-3 border-t border-neutral-50 dark:border-neutral-850/80">
                  <span className="font-heading text-base font-black text-indigo-600 dark:text-indigo-400">
                    {formatCurrency(p.price)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
