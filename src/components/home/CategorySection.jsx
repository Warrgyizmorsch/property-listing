import { getHomeCategories } from "@/features/home/services/home.service";
import ExploreCards from "./ExploreCards";

export default async function CategorySection() {
  const categories = await getHomeCategories();

  const explorePropData = {
    title: "Explore Our Property",
    description: "Discover a variety of property categories to suit your needs.",
    cardData: categories.map((cat) => ({
      title: cat.name,
      count: cat._count?.projects ?? 0,
      image: cat.coverImage || null,
      href: `/projects?category=${cat.slug}`,
    })),
  };

  return (
    <section className="bg-white py-6 px-6 lg:px-8 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl">
        <ExploreCards exploreCardData={explorePropData} isProperty={true} />
      </div>
    </section>
  );
}
