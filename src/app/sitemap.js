import { getSitemapData } from "@/features/seo/services/seo.service";
import { getAbsoluteUrl } from "@/lib/seo/helpers";

/**
 * Next.js sitemap generator (mapped to /sitemap.xml automatically)
 */
export default async function sitemap() {
  const data = await getSitemapData();
  const now = new Date();

  // 1. Static Pages
  const staticPages = [
    { url: getAbsoluteUrl("/"), lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: getAbsoluteUrl("/properties"), lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: getAbsoluteUrl("/about"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: getAbsoluteUrl("/contact"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: getAbsoluteUrl("/privacy-policy"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: getAbsoluteUrl("/terms"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: getAbsoluteUrl("/faq"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  // 2. Property Detail Pages
  const propertyPages = data.properties.map((prop) => ({
    url: getAbsoluteUrl(`/properties/${prop.slug}`),
    lastModified: new Date(prop.updatedAt),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // 3. Category Filter Pages
  const categoryPages = data.categories.map((cat) => ({
    url: getAbsoluteUrl(`/properties?category=${cat.slug}`),
    lastModified: new Date(cat.updatedAt),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // 4. Location Filter Pages (Countries, States, Cities)
  const countryPages = data.countries.map((c) => ({
    url: getAbsoluteUrl(`/properties?country=${c.slug}`),
    lastModified: new Date(c.updatedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const statePages = data.states.map((s) => ({
    url: getAbsoluteUrl(`/properties?state=${s.slug}`),
    lastModified: new Date(s.updatedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const cityPages = data.cities.map((c) => ({
    url: getAbsoluteUrl(`/properties?city=${c.slug}`),
    lastModified: new Date(c.updatedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...propertyPages,
    ...categoryPages,
    ...countryPages,
    ...statePages,
    ...cityPages,
  ];
}
