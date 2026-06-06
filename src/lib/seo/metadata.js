import { db } from "@/lib/db";
import { getSeoSettingByPageType } from "@/features/seo/services/seo.service";
import { getAbsoluteUrl, truncateText } from "./helpers";

/**
 * Generates the Next.js Metadata API object dynamically based on page type,
 * entity overrides, and automatic fallbacks.
 */
export async function generatePageMetadata({ pageType, entityId = null, fallbackData = {} }) {
  let title = "";
  let description = "";
  let keywords = "";
  let canonical = "";
  let ogImage = "";
  let ogTitle = "";
  let ogDescription = "";

  if (pageType === "PROPERTY" && entityId) {
    // Fetch property details to resolve dynamic values
    const property = await db.property.findUnique({
      where: { id: entityId },
      include: {
        category: { select: { name: true } },
        city: { select: { name: true } },
        images: {
          orderBy: { sortOrder: "asc" },
          take: 1,
        },
      },
    });

    if (property) {
      // Priority strategy: use custom meta if defined, else auto-generate
      const formattedPrice = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(Number(property.price));

      const autoTitle = `${property.title} in ${property.city.name} | ${formattedPrice}`;
      const autoDescription = truncateText(property.description, 160);

      title = property.metaTitle || fallbackData.title || autoTitle;
      description = property.metaDescription || fallbackData.description || autoDescription;

      const defaultCanonical = getAbsoluteUrl(`/properties/${property.slug}`);
      canonical = defaultCanonical;

      // Find featured image or fallback to first image or placeholder
      const featuredImgObj = property.images.find(img => img.isFeatured) || property.images[0];
      ogImage = featuredImgObj?.url || getAbsoluteUrl("/placeholder.jpg");
    }
  } else {
    // Fetch static page settings from db
    const customSeo = await getSeoSettingByPageType(pageType, entityId);

    title = customSeo?.metaTitle || fallbackData.title || "Property Listing Platform";
    description = customSeo?.metaDescription || fallbackData.description || "Find your dream home with ease on our property listing portal.";
    keywords = customSeo?.metaKeywords || fallbackData.keywords || "";
    
    const defaultCanonical = fallbackData.path ? getAbsoluteUrl(fallbackData.path) : getAbsoluteUrl();
    canonical = customSeo?.canonicalUrl || defaultCanonical;

    ogTitle = customSeo?.ogTitle || title;
    ogDescription = customSeo?.ogDescription || description;
    ogImage = customSeo?.ogImage || fallbackData.ogImage || getAbsoluteUrl("/placeholder.jpg");
  }

  // Construct Next.js Metadata API object
  return {
    title,
    description,
    keywords: keywords ? keywords.split(",").map(k => k.trim()) : undefined,
    alternates: {
      canonical,
    },
    openGraph: {
      title: ogTitle || title,
      description: ogDescription || description,
      url: canonical,
      siteName: "Warrgyizmorsch Property Listing",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: ogTitle || title,
        },
      ],
      type: fallbackData.ogType || (pageType === "PROPERTY" ? "article" : "website"),
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle || title,
      description: ogDescription || description,
      images: [ogImage],
    },
  };
}
