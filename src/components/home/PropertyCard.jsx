import Link from "next/link";
import Image from "next/image";
import { Bed, Bath, Square, MapPin } from "lucide-react";
import { formatCurrency, formatArea } from "@/lib/format";

export default function PropertyCard({ property }) {
  // Safe extraction of the primary image url with fallback
  const mainImage =
    property.images?.[0]?.url ||
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800";
  const locationText = `${property.city?.name}, ${property.city?.state?.name || ""}`;

  // Custom styling rules for Purpose badge
  const isBuy = property.purpose?.name?.toLowerCase() === "buy";

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/40">
      {/* Property Image & Badges */}
      <div className="relative aspect-video w-full overflow-hidden bg-neutral-100 dark:bg-zinc-800">
        <Image
          src={mainImage}
          alt={property.title}
          fill
          sizes="(max-w-7xl) 33vw, (max-w-md) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradients to improve text contrast on hover */}
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Badges container */}
        <div className="absolute left-3.5 top-3.5 flex flex-wrap gap-2">
          {/* Purpose Badge: Buy/Sell/Rent */}
          <span
            className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-bold shadow-sm ${
              isBuy ? "bg-indigo-600 text-white" : "bg-emerald-600 text-white"
            }`}
          >
            For {property.purpose?.name || "Sale"}
          </span>

          {/* Status Badge: Available, Sold, etc. */}
          {property.status && (
            <span
              className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-bold border shadow-xs ${property.status.colorClass || "bg-white text-neutral-800 border-neutral-200"}`}
            >
              {property.status.name}
            </span>
          )}
        </div>

        {/* Featured Property Ribbon */}
        {property.isFeatured && (
          <span className="absolute right-3.5 top-3.5 inline-flex items-center rounded-lg bg-amber-500 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
            ★ Featured
          </span>
        )}
      </div>

      {/* Property Content */}
      <div className="flex flex-1 flex-col p-5">
        {/* Category & Price */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-bold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase">
            {property.category?.name}
          </span>
          <span className="text-lg font-extrabold text-neutral-900 dark:text-neutral-50 font-heading">
            {formatCurrency(property.price)}
          </span>
        </div>

        {/* Title */}
        <h3 className="mb-2 line-clamp-1 text-base font-bold text-neutral-900 hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400">
          <Link href={`/properties/${property.slug}`}>{property.title}</Link>
        </h3>

        {/* Address */}
        <p className="mb-4 flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-neutral-400 dark:text-zinc-500" />
          <span>
            {property.address}, {locationText}
          </span>
        </p>

        {/* Features Divider */}
        <div className="mt-auto border-t border-neutral-100 pt-4 dark:border-neutral-800/80">
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold text-neutral-600 dark:text-neutral-300">
            {/* Bedrooms */}
            <div className="flex flex-col items-center justify-center gap-1 border-r border-neutral-100 dark:border-neutral-800/85">
              <span className="flex items-center gap-1.5 text-neutral-400">
                <Bed className="h-4 w-4" />
              </span>
              <span>{property.bedrooms} Beds</span>
            </div>

            {/* Bathrooms */}
            <div className="flex flex-col items-center justify-center gap-1 border-r border-neutral-100 dark:border-neutral-800/85">
              <span className="flex items-center gap-1.5 text-neutral-400">
                <Bath className="h-4 w-4" />
              </span>
              <span>{property.bathrooms} Baths</span>
            </div>

            {/* Area Size */}
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

export function PropertyCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-white p-5 shadow-xs animate-pulse dark:border-zinc-800 dark:bg-zinc-900/40">
      <div className="aspect-video w-full rounded-xl bg-neutral-200 dark:bg-zinc-800" />
      <div className="mt-4 flex justify-between">
        <div className="h-4 w-1/4 rounded bg-neutral-200 dark:bg-zinc-800" />
        <div className="h-4 w-1/3 rounded bg-neutral-200 dark:bg-zinc-800" />
      </div>
      <div className="mt-4 h-6 w-3/4 rounded bg-neutral-200 dark:bg-zinc-800" />
      <div className="mt-2 h-4 w-1/2 rounded bg-neutral-200 dark:bg-zinc-800" />
      <div className="mt-6 border-t border-neutral-100 pt-4 dark:border-neutral-800">
        <div className="grid grid-cols-3 gap-2">
          <div className="h-8 rounded bg-neutral-200 dark:bg-zinc-800" />
          <div className="h-8 rounded bg-neutral-200 dark:bg-zinc-800" />
          <div className="h-8 rounded bg-neutral-200 dark:bg-zinc-800" />
        </div>
      </div>
    </div>
  );
}
