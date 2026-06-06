import Navbar from "@/components/frontend/Navbar";
import Footer from "@/components/frontend/Footer";

export default function DetailLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-50/20 dark:bg-zinc-950 font-sans">
      <Navbar />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl animate-pulse">
          
          {/* Back button skeleton */}
          <div className="h-9 w-32 rounded-lg bg-neutral-200 dark:bg-zinc-800 mb-6" />

          {/* Grid skeleton */}
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            
            {/* Left column skeletons */}
            <div className="flex-1 w-full flex flex-col gap-6">
              
              {/* Header skeleton */}
              <div className="space-y-3 pb-6 border-b border-neutral-100 dark:border-neutral-850">
                <div className="h-4 w-40 rounded bg-neutral-200 dark:bg-zinc-800" />
                <div className="h-9 w-3/4 rounded bg-neutral-200 dark:bg-zinc-800" />
                <div className="h-4 w-1/2 rounded bg-neutral-200 dark:bg-zinc-800" />
              </div>

              {/* Media gallery skeleton */}
              <div className="aspect-video w-full rounded-2xl bg-neutral-200 dark:bg-zinc-800" />
              <div className="flex gap-3 mt-1">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-video h-16 rounded-xl bg-neutral-105 dark:bg-zinc-900" />
                ))}
              </div>

              {/* Overview skeleton */}
              <div className="py-6 border-b border-neutral-100 dark:border-neutral-850">
                <div className="h-5 w-24 rounded bg-neutral-200 dark:bg-zinc-800 mb-4" />
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-16 rounded-xl bg-neutral-100 dark:bg-zinc-900" />
                  ))}
                </div>
              </div>

            </div>

            {/* Right column skeleton */}
            <aside className="w-full lg:w-96 shrink-0 flex flex-col gap-6">
              <div className="h-[400px] rounded-2xl bg-white border border-neutral-100 dark:border-zinc-800 dark:bg-zinc-900/40 p-6">
                <div className="h-5 w-32 rounded bg-neutral-200 dark:bg-zinc-800 mb-4" />
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="space-y-1">
                      <div className="h-3 w-16 rounded bg-neutral-200 dark:bg-zinc-800" />
                      <div className="h-10 rounded-xl bg-neutral-100 dark:bg-zinc-900" />
                    </div>
                  ))}
                </div>
              </div>
            </aside>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
