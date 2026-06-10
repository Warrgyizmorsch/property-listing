import { getHomeLocations } from "@/features/home/services/home.service";
import ExploreCards from "./ExploreCards";

export default async function LocationSection() {
  const locations = await getHomeLocations(8);

  if (locations.length === 0) {
    return null;
  }

  const exploreCityData = {
    title: "Explore Cities",
    description: "Discover exceptional real estate projects across top regions.",
    cardData: locations.map((city) => ({
      title: city.name,
      count: city._count?.projects ?? 0,
      image: city.coverImage || null,
      href: `/projects?country=${city.state?.country?.slug}&state=${city.state?.slug}&city=${city.slug}`,
      subtext: `${city.state?.name || ""}, ${city.state?.country?.name || ""}`,
    })),
  };

  return (
    <section className="bg-neutral-50 py-12 px-6 lg:px-8 dark:bg-zinc-900/10">
      <div className="mx-auto max-w-7xl">
        <ExploreCards exploreCardData={exploreCityData} isProperty={false} />
      </div>
    </section>
  );
}
