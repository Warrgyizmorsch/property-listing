import Link from "next/link";
import { ArrowRight, Sparkles, Building2, Flame, Milestone, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPublicProjects } from "@/features/projects/public/services/public-project.service";
import ProjectCard from "../projects/ProjectCard";

export default async function HomeProperties() {
  // Query featured, ongoing, upcoming, and completed projects concurrently on the server
  const [
    { projects: featured },
    { projects: ongoing },
    { projects: upcoming },
    { projects: completed }
  ] = await Promise.all([
    getPublicProjects({ isFeatured: true, limit: 3 }),
    getPublicProjects({ status: "ONGOING", limit: 3 }),
    getPublicProjects({ status: "UPCOMING", limit: 3 }),
    getPublicProjects({ status: "COMPLETED", limit: 3 })
  ]);

  return (
    <div className="space-y-24 py-20 bg-neutral-50/50 dark:bg-zinc-900/10">
      {/* 1. Featured Projects Section */}
      {featured.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.25em] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 px-3 py-1 rounded-full mb-3">
                  <Sparkles className="h-3 w-3 fill-amber-500" />
                  Premium Collections
                </span>
                <h2 className="font-heading text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
                  Featured Projects
                </h2>
                <p className="mt-3 text-neutral-500 dark:text-neutral-400 max-w-2xl text-sm leading-relaxed">
                  Explore our collection of the most exclusive and highly demanded developments currently listed.
                </p>
              </div>
              <Link href="/projects?isFeatured=true" className="shrink-0">
                <Button
                  variant="outline"
                  className="group font-semibold gap-1.5 border-neutral-200 bg-white hover:bg-neutral-50 dark:border-zinc-800 dark:bg-zinc-900 cursor-pointer"
                >
                  View All Featured
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 2. Ongoing Projects Section */}
      {ongoing.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20 px-3 py-1 rounded-full mb-3">
                  <Flame className="h-3 w-3" />
                  Under Construction
                </span>
                <h2 className="font-heading text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
                  Ongoing Projects
                </h2>
                <p className="mt-3 text-neutral-500 dark:text-neutral-400 max-w-2xl text-sm leading-relaxed">
                  Real estate developments under active construction in premier localities.
                </p>
              </div>
              <Link href="/projects?status=ONGOING" className="shrink-0">
                <Button
                  variant="outline"
                  className="group font-semibold gap-1.5 border-neutral-200 bg-white hover:bg-neutral-50 dark:border-zinc-800 dark:bg-zinc-900 cursor-pointer"
                >
                  View Ongoing
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {ongoing.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. Upcoming Projects Section */}
      {upcoming.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 px-3 py-1 rounded-full mb-3">
                  <Milestone className="h-3.5 w-3.5" />
                  Exclusive Pre-Launches
                </span>
                <h2 className="font-heading text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
                  Upcoming Projects
                </h2>
                <p className="mt-3 text-neutral-500 dark:text-neutral-400 max-w-2xl text-sm leading-relaxed">
                  Be the first to explore and register interest for upcoming projects.
                </p>
              </div>
              <Link href="/projects?status=UPCOMING" className="shrink-0">
                <Button
                  variant="outline"
                  className="group font-semibold gap-1.5 border-neutral-200 bg-white hover:bg-neutral-50 dark:border-zinc-800 dark:bg-zinc-900 cursor-pointer"
                >
                  View Upcoming
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Completed Projects Section */}
      {completed.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-3 py-1 rounded-full mb-3">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Ready to Move In
                </span>
                <h2 className="font-heading text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
                  Completed Projects
                </h2>
                <p className="mt-3 text-neutral-500 dark:text-neutral-400 max-w-2xl text-sm leading-relaxed">
                  Finished developments with keys ready to be delivered to buyers.
                </p>
              </div>
              <Link href="/projects?status=COMPLETED" className="shrink-0">
                <Button
                  variant="outline"
                  className="group font-semibold gap-1.5 border-neutral-200 bg-white hover:bg-neutral-50 dark:border-zinc-800 dark:bg-zinc-900 cursor-pointer"
                >
                  View Completed
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {completed.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
