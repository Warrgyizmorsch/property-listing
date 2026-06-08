import { Building2, Phone, MapPin, Compass, Sparkles } from "lucide-react";

export default function PropertyBuilderInfo({ property }) {
  const builderDetails = [
    {
      label: "Builder",
      value: property.builderName || "Not specified",
      icon: <Building2 className="h-5 w-5 text-neutral-400" />,
    },
    {
      label: "Builder Contact",
      value: property.builderPhone || "Not specified",
      icon: <Phone className="h-5 w-5 text-neutral-400" />,
    },
    {
      label: "Builder Address",
      value: property.builderAddress || "Not specified",
      icon: <MapPin className="h-5 w-5 text-neutral-400" />,
    },
    {
      label: "Facing",
      value: property.facing || "Not specified",
      icon: <Compass className="h-5 w-5 text-neutral-400" />,
    },
    {
      label: "Corner Property",
      value: property.isCorner ? "Yes" : "No",
      icon: <Sparkles className="h-5 w-5 text-neutral-400" />,
    },
  ];

  return (
    <div className="py-8 border-b border-neutral-100 dark:border-neutral-850">
      <h2 className="font-heading text-lg font-bold text-neutral-900 uppercase tracking-widest mb-5 dark:text-white">
        Builder & Listing Details
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {builderDetails.map((detail, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3.5 p-4 rounded-xl border border-neutral-100 bg-neutral-50/40 dark:border-zinc-800 dark:bg-zinc-900/10"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white border border-neutral-100 dark:bg-zinc-850 dark:border-zinc-800">
              {detail.icon}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                {detail.label}
              </span>
              <p className="text-sm font-extrabold text-neutral-850 dark:text-neutral-200 mt-0.5 leading-6">
                {detail.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
