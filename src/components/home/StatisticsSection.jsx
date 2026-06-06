import { Building2, Key, Users, Landmark } from "lucide-react";
import { getHomeStats } from "@/features/home/services/home.service";

export default async function StatisticsSection() {
  const stats = await getHomeStats();

  const metrics = [
    {
      label: "Total Properties Listed",
      value: stats.totalProperties,
      icon: <Building2 className="h-6 w-6" />,
      color: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900/30",
    },
    {
      label: "Properties Sold",
      value: stats.soldProperties,
      icon: <Key className="h-6 w-6" />,
      color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/30",
    },
    {
      label: "Active Listings Available",
      value: stats.activeProperties,
      icon: <Landmark className="h-6 w-6" />,
      color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-100 dark:border-blue-900/30",
    },
    {
      label: "Happy Clients Served",
      value: stats.happyClients,
      icon: <Users className="h-6 w-6" />,
      color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900/30",
    },
  ];

  return (
    <section className="bg-neutral-900 py-16 px-4 dark:bg-zinc-950 border-t border-b border-neutral-800/20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {metrics.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center text-center p-6 rounded-2xl border border-neutral-800 bg-neutral-900/40 shadow-xs dark:border-zinc-800 dark:bg-zinc-950/40"
            >
              {/* Icon */}
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${item.color} shadow-xs`}>
                {item.icon}
              </div>

              {/* Numerical Value */}
              <span className="mt-4 font-heading text-3xl font-extrabold text-white sm:text-4xl tracking-tight">
                {item.value}
              </span>

              {/* Label */}
              <span className="mt-2 text-xs font-semibold text-neutral-400 uppercase tracking-widest">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
