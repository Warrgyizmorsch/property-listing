import { MapPin, Sparkles } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import PropertyStatusBadge from "./PropertyStatusBadge";

export default function PropertyHeader({ property }) {
  const isBuy = property.purpose?.name?.toLowerCase() === "buy";
  const locationText = `${property.city?.name || ""}, ${property.city?.state?.name || ""}, ${property.city?.state?.country?.name || ""}`;

  return (
    <div className="flex flex-col gap-4 border-b border-neutral-100 pb-6 dark:border-neutral-850">

      {/* Badges Row */}
      <div className="flex flex-wrap items-center gap-2">
        <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-bold text-white shadow-sm ${isBuy ? "bg-indigo-600" : "bg-emerald-600"
          }`}>
          For {property.purpose?.name || "Sale"}
        </span>
        <PropertyStatusBadge status={property.status} />

        {property.isFeatured && (
          <span className="inline-flex items-center rounded-lg bg-amber-500 px-2.5 py-1 text-xs font-bold text-white shadow-xs">
            ★ Featured Listing
          </span>
        )}
      </div>

      {/* Title & Price */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white sm:text-3xl md:text-4xl leading-tight">
            {property.title}
          </h1>
          <p className="flex items-center gap-1.5 text-sm font-semibold text-neutral-500 dark:text-neutral-400">
            <MapPin className="h-4 w-4 shrink-0 text-neutral-400" />
            <span>{property.address}, {locationText}</span>
          </p>
        </div>

        <div className="shrink-0 flex flex-col md:items-end">
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Asking Price</span>
          <span className="font-heading text-3xl font-semibold text-(--primary)">
            {formatCurrency(property.price)}
          </span>
        </div>
      </div>

    </div>
  );
}
