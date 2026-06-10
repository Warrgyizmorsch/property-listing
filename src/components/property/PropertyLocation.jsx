import { MapPin, Globe, Compass, Landmark } from "lucide-react";

export default function PropertyLocation({ property }) {
  const fields = [
    {
      label: "Address",
      value: property.address,
      icon: <MapPin className="h-4.5 w-4.5 text-neutral-400" />,
    },
    {
      label: "City",
      value: property.city?.name || "Mumbai",
      icon: <Compass className="h-4.5 w-4.5 text-neutral-400" />,
    },
    {
      label: "State",
      value: property.city?.state?.name || "Maharashtra",
      icon: <Landmark className="h-4.5 w-4.5 text-neutral-400" />,
    },
    {
      label: "Country",
      value: property.city?.state?.country?.name || "India",
      icon: <Globe className="h-4.5 w-4.5 text-neutral-400" />,
    },
  ];

  return (
    <div className="py-8 border-b border-neutral-100 dark:border-neutral-850">
      <h2 className="font-heading text-lg font-bold text-neutral-900 uppercase tracking-widest mb-5 dark:text-white">
        Location Information
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {fields.map((field, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3.5 p-4 rounded-xl border border-neutral-100 bg-neutral-50/20 dark:border-zinc-800 dark:bg-zinc-900/10"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white border border-neutral-100 dark:bg-zinc-850 dark:border-zinc-800">
              {field.icon}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                {field.label}
              </span>
              <p className="text-sm font-bold text-neutral-850 dark:text-neutral-200 mt-0.5 leading-6">
                {field.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
