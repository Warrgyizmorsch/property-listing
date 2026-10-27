export default function ProjectDetailLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-50/20 dark:bg-zinc-950 font-sans animate-pulse">
      {/* Top Navbar spacer */}
      <div className="h-16 w-full border-b border-neutral-200/50 dark:border-zinc-800 bg-white dark:bg-zinc-900" />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="h-6 md:h-8" />
        <div className="mx-auto max-w-7xl">

          {/* Breadcrumbs skeleton */}
          <div className="mb-4 flex items-center gap-2">
            <div className="h-4 w-12 rounded bg-neutral-200 dark:bg-zinc-800" />
            <span className="text-neutral-300">/</span>
            <div className="h-4 w-16 rounded bg-neutral-200 dark:bg-zinc-800" />
            <span className="text-neutral-300">/</span>
            <div className="h-4 w-20 rounded bg-neutral-200 dark:bg-zinc-800" />
            <span className="text-neutral-300">/</span>
            <div className="h-4 w-32 rounded bg-neutral-300 dark:bg-zinc-700" />
          </div>

          {/* Header Identity & Pricing Skeleton */}
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-8">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-2">
                <div className="h-6 w-24 rounded-lg bg-emerald-100 dark:bg-emerald-950/40" />
                <div className="h-6 w-20 rounded-lg bg-amber-100 dark:bg-amber-950/40" />
              </div>
              <div className="h-9 w-3/4 max-w-md rounded-lg bg-neutral-300 dark:bg-zinc-700" />
              <div className="flex items-center gap-3">
                <div className="h-4 w-28 rounded bg-neutral-200 dark:bg-zinc-800" />
                <div className="h-4 w-4 rounded-full bg-neutral-200 dark:bg-zinc-800" />
                <div className="h-4 w-48 rounded bg-neutral-200 dark:bg-zinc-800" />
              </div>
              <div className="h-8 w-44 rounded-xl bg-neutral-200 dark:bg-zinc-800 mt-2" />
            </div>

            {/* Pricing card skeleton */}
            <div className="w-full sm:w-72 lg:w-80 p-5 rounded-2xl border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 space-y-3">
              <div className="h-3 w-20 rounded bg-neutral-200 dark:bg-zinc-800" />
              <div className="h-8 w-40 rounded bg-neutral-300 dark:bg-zinc-700" />
              <div className="h-4 w-32 rounded bg-neutral-200 dark:bg-zinc-800" />
              <div className="flex gap-2 pt-2">
                <div className="h-10 flex-1 rounded-xl bg-neutral-200 dark:bg-zinc-800" />
                <div className="h-10 flex-1 rounded-xl bg-[var(--brand-primary)] opacity-40" />
              </div>
            </div>
          </div>

          {/* Hero Gallery Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 h-[360px] md:h-[480px]">
            <div className="md:col-span-3 h-full rounded-3xl bg-neutral-200 dark:bg-zinc-800" />
            <div className="hidden md:flex flex-col gap-4 h-full">
              <div className="flex-1 rounded-2xl bg-neutral-200 dark:bg-zinc-800" />
              <div className="flex-1 rounded-2xl bg-neutral-200 dark:bg-zinc-800" />
            </div>
          </div>

          {/* Core Content Grid */}
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            {/* Left Column */}
            <div className="flex-grow w-full space-y-8">
              {/* 4-Stat Overview Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-20 rounded-2xl border border-neutral-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-900/40 p-4" />
                ))}
              </div>

              {/* About description block */}
              <div className="rounded-2xl border border-neutral-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-900/40 p-6 space-y-4">
                <div className="h-6 w-48 rounded bg-neutral-300 dark:bg-zinc-700" />
                <div className="space-y-2">
                  <div className="h-4 w-full rounded bg-neutral-200 dark:bg-zinc-800" />
                  <div className="h-4 w-5/6 rounded bg-neutral-200 dark:bg-zinc-800" />
                  <div className="h-4 w-4/6 rounded bg-neutral-200 dark:bg-zinc-800" />
                </div>
              </div>

              {/* Unit configurations skeleton */}
              <div className="rounded-2xl border border-neutral-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-900/40 p-6 space-y-4">
                <div className="h-6 w-44 rounded bg-neutral-300 dark:bg-zinc-700" />
                <div className="h-40 rounded-xl bg-neutral-100 dark:bg-zinc-900/60" />
              </div>
            </div>

            {/* Right Column (Enquiry card) */}
            <aside className="w-full lg:w-96 shrink-0 space-y-6">
              <div className="rounded-3xl border border-neutral-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-900/40 p-6 space-y-5">
                <div className="h-6 w-36 rounded bg-neutral-300 dark:bg-zinc-700" />
                <div className="h-4 w-full rounded bg-neutral-200 dark:bg-zinc-800" />
                <div className="space-y-3 pt-2">
                  <div className="h-10 rounded-xl bg-neutral-100 dark:bg-zinc-800" />
                  <div className="h-10 rounded-xl bg-neutral-100 dark:bg-zinc-800" />
                  <div className="h-10 rounded-xl bg-neutral-100 dark:bg-zinc-800" />
                  <div className="h-20 rounded-xl bg-neutral-100 dark:bg-zinc-800" />
                  <div className="h-11 rounded-xl bg-[var(--brand-primary)] opacity-60" />
                </div>
              </div>
            </aside>
          </div>

        </div>
      </main>
    </div>
  );
}
