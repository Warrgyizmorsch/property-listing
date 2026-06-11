import { Bed, Bath, Square, Home, Sparkles, Tag, Compass } from "lucide-react";
import { formatArea } from "@/lib/format";

export default function PropertyOverview({ property }) {
  const items = [
    {
      label: "Bedrooms",
      value: `${property.bedrooms} Beds`,
      icon: <Bed className="h-5 w-5 text-neutral-400" />,
    },
    {
      label: "Bathrooms",
      value: `${property.bathrooms} Baths`,
      icon: <Bath className="h-5 w-5 text-neutral-400" />,
    },
    {
      label: "Area Size",
      value: formatArea(property.areaSize),
      icon: <Square className="h-5 w-5 text-neutral-400" />,
    },
    {
      label: "Property Type",
      value: property.category?.name || "Apartment",
      icon: <Home className="h-5 w-5 text-neutral-400" />,
    },
    {
      label: "Purpose",
      value: `For ${property.purpose?.name || "Sale"}`,
      icon: <Tag className="h-5 w-5 text-neutral-400" />,
    },
    {
      label: "Facing",
      value: property.facing || "Not specified",
      icon: <Compass className="h-5 w-5 text-neutral-400" />,
    },
    {
      label: "Corner Property",
      value: property.isCorner ? "Yes" : "No",
      icon: <Home className="h-5 w-5 text-neutral-400" />,
    },
    {
      label: "Status",
      value: property.status?.name || "Available",
      icon: <Sparkles className="h-5 w-5 text-neutral-400" />,
    },
  ];

  return (
    <div className="py-8 border-b border-neutral-100 dark:border-neutral-850 space-y-6">
      <div>
        <h2 className="section-heading">
          Overview
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3.5 p-2 shadow-sm rounded-xl border border-neutral-100 bg-neutral-50/40 dark:border-zinc-800 dark:bg-zinc-900/10"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white border border-neutral-100 dark:bg-zinc-850 dark:border-zinc-800">
                {item.icon}
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  {item.label}
                </p>
                <p className="text-sm font-bold text-neutral-850 dark:text-neutral-200 mt-0.5">
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {property.specifications?.length > 0 && (
        <div className="pt-6 border-t border-neutral-100 dark:border-neutral-850">
          <h3 className="section-heading">
            Unit Specifications
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {property.specifications.map((spec) => (
              <div
                key={spec.id}
                className="flex flex-col p-2 shadow-sm rounded-xl bg-slate-50/50 dark:bg-zinc-900/20 border border-slate-100/50 dark:border-zinc-850"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {spec.title}
                </span>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
