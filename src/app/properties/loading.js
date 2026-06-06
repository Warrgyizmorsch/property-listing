import Navbar from "@/components/frontend/Navbar";
import Footer from "@/components/frontend/Footer";
import LoadingState from "@/components/properties/LoadingState";

export default function PropertiesLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-50/20 dark:bg-zinc-950 font-sans">
      <Navbar />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl animate-pulse">
          
          {/* Header Skeleton */}
          <div className="mb-10 text-left">
            <div className="h-4 w-24 rounded bg-neutral-200 dark:bg-zinc-800" />
            <div className="mt-3 h-8 w-64 rounded bg-neutral-200 dark:bg-zinc-800" />
            <div className="mt-2 h-4 w-96 rounded bg-neutral-200 dark:bg-zinc-800" />
          </div>

          {/* Grid Layout Skeleton */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Sidebar Skeleton */}
            <aside className="hidden lg:block w-72 shrink-0 border border-neutral-100 bg-white p-6 rounded-2xl shadow-xs dark:border-zinc-800 dark:bg-zinc-900/40">
              <div className="h-5 w-32 rounded bg-neutral-200 dark:bg-zinc-800 mb-6" />
              {[...Array(6)].map((_, i) => (
                <div key={i} className="mb-5">
                  <div className="h-3 w-20 rounded bg-neutral-200 dark:bg-zinc-800 mb-2" />
                  <div className="h-9 w-full rounded-xl bg-neutral-100 dark:bg-zinc-900" />
                </div>
              ))}
            </aside>

            {/* Main Content Skeleton */}
            <div className="flex-1 w-full flex flex-col gap-6">
              {/* Toolbar Skeleton */}
              <div className="flex items-center justify-between p-4 rounded-2xl border border-neutral-100 bg-white dark:border-zinc-800 dark:bg-zinc-900/20">
                <div className="h-9 w-64 rounded-xl bg-neutral-100 dark:bg-zinc-900" />
                <div className="h-9 w-32 rounded-xl bg-neutral-100 dark:bg-zinc-900" />
              </div>

              {/* Card List Skeleton Grid */}
              <LoadingState count={6} />
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
