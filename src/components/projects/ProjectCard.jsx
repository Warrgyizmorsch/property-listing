import Link from "next/link";
import { MapPin, Building2, Star, Layers, Calendar, ChevronRight } from "lucide-react";
import { formatCurrency, formatArea } from "@/lib/format";
import { Button } from "@/components/ui/button";

export default function ProjectCard({ project }) {
  // Safe extraction of the primary image url with fallback
  const coverImage =
    project.mainImage ||
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800";

  const locationText = `${project.city?.name || "Unknown Location"}, ${project.city?.state?.name || ""}`;

  // Formatting for price range
  const priceDisplay =
    project.startingPrice && project.startingPrice > 0
      ? `Starting ₹${formatCurrency(project.startingPrice).replace("₹", "")}`
      : "Price on Request";

  // Formatting for area range
  let areaDisplay = "Area on Request";
  if (project.minArea && project.minArea > 0) {
    if (project.maxArea && project.maxArea > project.minArea) {
      areaDisplay = `${formatArea(project.minArea)} - ${formatArea(project.maxArea)}`;
    } else {
      areaDisplay = formatArea(project.minArea);
    }
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "ONGOING":
        return "bg-blue-600 text-white";
      case "COMPLETED":
        return "bg-emerald-600 text-white";
      case "UPCOMING":
        return "bg-amber-500 text-white";
      default:
        return "bg-slate-650 text-white";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "ONGOING":
        return "Ongoing";
      case "COMPLETED":
        return "Completed";
      case "UPCOMING":
        return "Upcoming";
      default:
        return status;
    }
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xs transition-all duration-350 hover:-translate-y-1.5 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900/40">
      {/* Project Cover Image */}
      <div className="relative aspect-video w-full overflow-hidden bg-neutral-100 dark:bg-zinc-800">
        <img
          src={coverImage}
          alt={project.projectName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent opacity-60" />

        {/* Floating status badge */}
        <div className="absolute right-3.5 top-3.5">
          <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-bold shadow-md ${getStatusBadgeClass(project.status)}`}>
            {getStatusLabel(project.status)}
          </span>
        </div>

        {/* Floating featured badge */}
        {project.isFeatured && (
          <div className="absolute left-3.5 top-3.5">
            <span className="inline-flex items-center gap-1 rounded-lg bg-amber-500 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
              <Star className="h-3 w-3 fill-white" />
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Project Content */}
      <div className="flex flex-1 flex-col p-5">
        {/* Category & Starting Price */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[10px] font-bold tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 px-2.5 py-1 rounded-md uppercase">
            {project.category?.name || "Real Estate"}
          </span>
          <span className="text-base font-bold text-neutral-900 dark:text-neutral-50 font-heading">
            {priceDisplay}
          </span>
        </div>

        {/* Project Title */}
        <h3 className="mb-2 line-clamp-1 text-lg font-bold text-slate-900 hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400 transition-colors">
          <Link href={`/projects/${project.slug}`}>{project.projectName}</Link>
        </h3>

        {/* Builder Name */}
        <div className="mb-3.5 flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
          <Building2 className="h-3.5 w-3.5 text-neutral-400" />
          <span>By {project.builderName}</span>
        </div>

        {/* Location Address */}
        <p className="mb-4 flex items-start gap-1.5 text-xs text-neutral-600 dark:text-neutral-350 leading-relaxed">
          <MapPin className="h-4 w-4 shrink-0 text-neutral-400 dark:text-zinc-500 mt-0.5" />
          <span className="line-clamp-2">
            {project.address}, {locationText}
          </span>
        </p>

        {/* Stats Section */}
        <div className="mt-auto border-t border-slate-100 pt-4 dark:border-zinc-800">
          <div className="grid grid-cols-2 gap-4 mb-4 text-xs font-semibold text-slate-650 dark:text-slate-350">
            <div className="flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-slate-400" />
              <span>{project.availableProps} / {project.totalProps} units</span>
            </div>
            <div className="flex items-center gap-1.5 justify-end">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span>{areaDisplay}</span>
            </div>
          </div>

          {/* Action button */}
          <Link href={`/projects/${project.slug}`} className="block w-full">
            <Button
              className="w-full justify-between items-center bg-slate-950 hover:bg-slate-800 text-white font-bold h-10 px-4 rounded-xl cursor-pointer"
            >
              <span>View Project Details</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs animate-pulse dark:border-zinc-850 dark:bg-zinc-900/40">
      <div className="aspect-video w-full rounded-xl bg-neutral-200 dark:bg-zinc-800" />
      <div className="mt-4 flex justify-between">
        <div className="h-4 w-1/4 rounded bg-neutral-200 dark:bg-zinc-800" />
        <div className="h-4 w-1/3 rounded bg-neutral-200 dark:bg-zinc-800" />
      </div>
      <div className="mt-4 h-6 w-3/4 rounded bg-neutral-200 dark:bg-zinc-800" />
      <div className="mt-2 h-4 w-1/2 rounded bg-neutral-200 dark:bg-zinc-800" />
      <div className="mt-6 border-t border-neutral-100 pt-4 dark:border-neutral-800">
        <div className="grid grid-cols-2 gap-4">
          <div className="h-6 rounded bg-neutral-200 dark:bg-zinc-800" />
          <div className="h-6 rounded bg-neutral-200 dark:bg-zinc-800" />
        </div>
      </div>
    </div>
  );
}
