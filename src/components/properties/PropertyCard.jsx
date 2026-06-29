import Link from "next/link";
import Image from "next/image";
import { Bed, Bath, Square, MapPin } from "lucide-react";
import { formatCurrency, formatArea } from "@/lib/format";

export default function PropertyCard({ property }) {
  const mainImage = property.images?.[0]?.url || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800";
  const locationText = `${property.city?.name || ""}, ${property.city?.state?.name || ""}`;

  const isBuy = property.purpose?.name?.toLowerCase() === "buy";

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/40 brand-card-motion">

      {/* Featured image */}
      <div className="relative aspect-video w-full overflow-hidden bg-neutral-100 dark:bg-zinc-800">
        <Image
          src={mainImage}
          alt={property.title}
          fill
          sizes="(max-w-7xl) 33vw, (max-w-md) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Purpose and Status Badges */}
        <div className="absolute left-3.5 top-3.5 flex flex-wrap gap-2 z-10">
          <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-bold shadow-sm ${isBuy
              ? "bg-[var(--brand-primary)] text-white"
              : "bg-[var(--brand-secondary)] text-[#0B1F3A]"
            }`}>
            For {property.purpose?.name || "Sale"}
          </span>

          {property.status && (
            <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-bold border shadow-xs ${property.status.colorClass || "bg-white text-neutral-800 border-neutral-200"}`}>
              {property.status.name}
            </span>
          )}
        </div>

        {/* Featured Ribbon */}
        {property.isFeatured && (
          <span className="absolute right-3.5 top-3.5 inline-flex items-center rounded-lg bg-[var(--brand-secondary)] px-2.5 py-1 text-xs font-bold text-[#0B1F3A] shadow-sm z-10">
            ★ Featured
          </span>
        )}
      </div>

      {/* Card Details */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-bold tracking-wider text-[var(--brand-secondary)] uppercase">
            {property.category?.name}
          </span>
          <span className="text-lg font-bold text-neutral-900 dark:text-neutral-50 font-heading">
            {formatCurrency(property.price)}
          </span>
        </div>

        {/* Title */}
        <h3 className="mb-2 line-clamp-1 text-base font-bold text-neutral-900 hover:text-[var(--brand-primary)] dark:text-white dark:hover:text-[var(--brand-secondary)]">
          <Link href={`/properties/${property.slug}`}>
            {property.title}
          </Link>
        </h3>

        {/* Address */}
        <p className="mb-4 flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-neutral-400 dark:text-zinc-500" />
          <span>{property.address}, {locationText}</span>
        </p>

        {/* Technical Specs */}
        <div className="mt-auto border-t border-neutral-100 pt-4 dark:border-neutral-800/80">
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold text-neutral-600 dark:text-neutral-300">

            <div className="flex flex-col items-center justify-center gap-1 border-r border-neutral-100 dark:border-neutral-800/85">
              <span className="flex items-center gap-1.5 text-neutral-400">
                <Bed className="h-4 w-4" />
              </span>
              <span>{property.bedrooms} Beds</span>
            </div>

            <div className="flex flex-col items-center justify-center gap-1 border-r border-neutral-100 dark:border-neutral-800/85">
              <span className="flex items-center gap-1.5 text-neutral-400">
                <Bath className="h-4 w-4" />
              </span>
              <span>{property.bathrooms} Baths</span>
            </div>

            <div className="flex flex-col items-center justify-center gap-1">
              <span className="flex items-center gap-1.5 text-neutral-400">
                <Square className="h-3.5 w-3.5" />
              </span>
              <span className="truncate">{formatArea(property.areaSize)}</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
