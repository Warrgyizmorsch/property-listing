import { db } from "../../../lib/db";

/**
 * Fetches the custom SEO configuration for a specific PageType and optional entity ID.
 */
export async function getSeoSettingByPageType(pageType, entityId = null) {
  try {
    const targetEntityId = entityId || "";
    return await db.seoSetting.findUnique({
      where: {
        pageType_entityId: {
          pageType,
          entityId: targetEntityId,
        },
      },
    });
  } catch (error) {
    console.error(`Error in getSeoSettingByPageType for ${pageType}:`, error);
    return null;
  }
}

/**
 * Upserts a custom SEO configuration.
 */
export async function upsertSeoSetting(pageType, entityId = null, data) {
  const targetEntityId = entityId || "";
  try {
    return await db.seoSetting.upsert({
      where: {
        pageType_entityId: {
          pageType,
          entityId: targetEntityId,
        },
      },
      update: {
        metaTitle: data.metaTitle || null,
        metaDescription: data.metaDescription || null,
        metaKeywords: data.metaKeywords || null,
        ogTitle: data.ogTitle || null,
        ogDescription: data.ogDescription || null,
        ogImage: data.ogImage || null,
        canonicalUrl: data.canonicalUrl || null,
      },
      create: {
        pageType,
        entityId: targetEntityId,
        metaTitle: data.metaTitle || null,
        metaDescription: data.metaDescription || null,
        metaKeywords: data.metaKeywords || null,
        ogTitle: data.ogTitle || null,
        ogDescription: data.ogDescription || null,
        ogImage: data.ogImage || null,
        canonicalUrl: data.canonicalUrl || null,
      },
    });
  } catch (error) {
    console.error(`Error in upsertSeoSetting for ${pageType}:`, error);
    throw new Error(`Failed to save SEO settings: ${error.message}`);
  }
}

/**
 * Retreives dynamic listings and metadata for sitemap generation.
 */
export async function getSitemapData() {
  try {
    const [properties, categories, countries, states, cities] = await Promise.all([
      db.property.findMany({
        where: { deletedAt: null },
        select: { slug: true, updatedAt: true },
      }),
      db.category.findMany({
        where: { deletedAt: null },
        select: { slug: true, updatedAt: true },
      }),
      db.country.findMany({
        where: { deletedAt: null },
        select: { slug: true, updatedAt: true },
      }),
      db.state.findMany({
        where: { deletedAt: null },
        select: { slug: true, countryId: true, updatedAt: true },
      }),
      db.city.findMany({
        where: { deletedAt: null },
        select: { slug: true, stateId: true, updatedAt: true },
      }),
    ]);

    return {
      properties,
      categories,
      countries,
      states,
      cities,
    };
  } catch (error) {
    console.error("Error in getSitemapData:", error);
    return {
      properties: [],
      categories: [],
      countries: [],
      states: [],
      cities: [],
    };
  }
}
