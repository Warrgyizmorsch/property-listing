import { getPublicProjects } from "@/features/projects/public/services/public-project.service";
import PropertyCards from "./PropertyCards";

export default async function HomeProperties() {
  // Query featured, ongoing, upcoming, and completed projects concurrently on the server
  const [
    { projects: featured },
    { projects: ongoing },
    { projects: upcoming },
    { projects: completed }
  ] = await Promise.all([
    getPublicProjects({ isFeatured: true, limit: 6, skipCount: true }),
    getPublicProjects({ status: "ONGOING", limit: 6, skipCount: true }),
    getPublicProjects({ status: "UPCOMING", limit: 6, skipCount: true }),
    getPublicProjects({ status: "COMPLETED", limit: 6, skipCount: true })
  ]);

  // Helper to sanitize project objects before sending across Client/Server boundary to avoid Decimal issues
  const sanitize = (projectList) => {
    return projectList.map((p) => ({
      ...p,
      properties: [], // Omit nested properties to avoid passing Prisma Decimal fields to Client Components
    }));
  };

  return (
    <div className="bg-neutral-50/50 dark:bg-zinc-900/10 px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* 1. Featured Projects Section */}
        {featured.length > 0 && (
          <PropertyCards
            title="Discover Our Best Deals"
            description="Explore our hand-picked collection of the most exclusive luxury properties."
            projects={sanitize(featured)}
            isBestDeal={true}
          />
        )}

        {/* 2. Ongoing Projects Section */}
        {ongoing.length > 0 && (
          <PropertyCards
            title="Ongoing Projects"
            description="Real estate developments under active construction in premier localities."
            projects={sanitize(ongoing)}
            isBestDeal={false}
          />
        )}

        {/* 3. Upcoming Projects Section */}
        {upcoming.length > 0 && (
          <PropertyCards
            title="Upcoming Projects"
            description="Be the first to explore and register interest for upcoming pre-launches."
            projects={sanitize(upcoming)}
            isBestDeal={false}
          />
        )}

        {/* 4. Completed Projects Section */}
        {completed.length > 0 && (
          <PropertyCards
            title="Completed Projects"
            description="Finished developments with keys ready to be delivered to buyers."
            projects={sanitize(completed)}
            isBestDeal={false}
          />
        )}
      </div>
    </div>
  );
}
