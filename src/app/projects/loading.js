import { ProjectCardSkeleton } from "@/components/projects/ProjectCard";

export default function ProjectsLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950 font-sans animate-pulse">
      {/* ─── Hero Section Skeleton ─── */}
      <section className="relative w-full min-h-[50vh] md:min-h-[60vh] flex items-center justify-center overflow-hidden bg-neutral-900">
        <div className="relative z-20 text-center px-6 md:px-8 max-w-3xl mx-auto flex flex-col items-center">
          <div className="w-16 h-[2px] bg-[#C8A45D]/40 mb-6" />
          <div className="h-10 md:h-12 w-72 md:w-96 rounded-xl bg-neutral-800 mb-4" />
          <div className="h-5 w-64 md:w-80 rounded-lg bg-neutral-800/60" />
        </div>
      </section>

      {/* ─── Main Content Skeleton ─── */}
      <div className="py-12 px-4 sm:px-6 lg:px-8 flex-grow">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Desktop Left Sidebar Filters Skeleton */}
            <aside className="hidden lg:block w-72 shrink-0 border border-neutral-100 bg-white p-6 rounded-2xl shadow-xs dark:border-zinc-800 dark:bg-zinc-900/40 space-y-6">
              <div className="border-b border-neutral-100 pb-4 dark:border-zinc-800">
                <div className="h-4 w-32 rounded bg-neutral-200 dark:bg-zinc-800" />
              </div>
              <div className="space-y-4">
                <div className="h-4 w-24 rounded bg-neutral-200 dark:bg-zinc-800" />
                <div className="h-10 w-full rounded-xl bg-neutral-100 dark:bg-zinc-800/60" />
              </div>
              <div className="space-y-4">
                <div className="h-4 w-20 rounded bg-neutral-200 dark:bg-zinc-800" />
                <div className="h-10 w-full rounded-xl bg-neutral-100 dark:bg-zinc-800/60" />
              </div>
              <div className="space-y-4">
                <div className="h-4 w-28 rounded bg-neutral-200 dark:bg-zinc-800" />
                <div className="h-10 w-full rounded-xl bg-neutral-100 dark:bg-zinc-800/60" />
              </div>
            </aside>

            {/* Main Listing View Skeleton (Search + Grid) */}
            <div className="flex-1 w-full min-w-0 flex flex-col gap-6">
              {/* Search bar & Sorting skeleton */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl border border-neutral-100 bg-white dark:border-zinc-800 dark:bg-zinc-900/20">
                <div className="h-10 w-full sm:max-w-md rounded-xl bg-neutral-100 dark:bg-zinc-800" />
                <div className="h-10 w-36 rounded-xl bg-neutral-100 dark:bg-zinc-800" />
              </div>

              {/* Projects card grid skeleton (2 columns) */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {[...Array(6)].map((_, i) => (
                  <ProjectCardSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
