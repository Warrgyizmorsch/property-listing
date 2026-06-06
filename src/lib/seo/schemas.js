import { getAbsoluteUrl } from "./helpers";

/**
 * Renders the corporate Organization schema payload.
 */
export function getOrganizationSchema() {
  const url = getAbsoluteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${url}#organization`,
    "name": "Warrgyizmorsch Property Listing",
    "url": url,
    "logo": getAbsoluteUrl("/logo.png"),
    "sameAs": [
      "https://facebook.com",
      "https://twitter.com",
      "https://instagram.com"
    ]
  };
}

/**
 * Renders the Website search-box integrated schema payload.
 */
export function getWebSiteSchema() {
  const url = getAbsoluteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${url}#website`,
    "url": url,
    "name": "Warrgyizmorsch Property Listing",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${url}/properties?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };
}

/**
 * Renders Breadcrumb schemas for page navigation trails.
 */
export function getBreadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": getAbsoluteUrl(item.url)
    }))
  };
}

/**
 * Renders CollectionPage lists mapping dynamic sets of listings.
 */
export function getCollectionPageSchema(properties) {
  const url = getAbsoluteUrl("/properties");
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#collection`,
    "url": url,
    "name": "Properties Collection",
    "description": "List of available residential and commercial properties.",
    "hasPart": properties.map((prop) => ({
      "@type": "RealEstateListing",
      "name": prop.title,
      "url": getAbsoluteUrl(`/properties/${prop.slug}`),
      "price": prop.price,
      "priceCurrency": "INR"
    }))
  };
}

/**
 * Renders single RealEstateListing metadata.
 */
export function getRealEstateListingSchema(property) {
  const url = getAbsoluteUrl(`/properties/${property.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "@id": `${url}#listing`,
    "url": url,
    "name": property.title,
    "datePosted": property.createdAt,
    "price": property.price,
    "priceCurrency": "INR"
  };
}

/**
 * Renders the physical residence/accommodation details.
 */
export function getResidenceSchema(property) {
  const url = getAbsoluteUrl(`/properties/${property.slug}`);
  const featuredImage = property.images?.find(img => img.isFeatured)?.url || property.images?.[0]?.url;

  return {
    "@context": "https://schema.org",
    "@type": "Residence",
    "@id": `${url}#residence`,
    "name": property.title,
    "description": property.description,
    "image": featuredImage || getAbsoluteUrl("/placeholder.jpg"),
    "address": {
      "@type": "PostalAddress",
      "streetAddress": property.address,
      "addressLocality": property.city?.name || "",
      "addressRegion": property.city?.state?.name || "",
      "addressCountry": property.city?.state?.country?.name || ""
    },
    "numberOfRooms": (property.bedrooms || 0) + (property.bathrooms || 0),
    "numberOfBedrooms": property.bedrooms || 0,
    "numberOfBathrooms": property.bathrooms || 0,
    "floorSize": {
      "@type": "QuantitativeValue",
      "value": property.areaSize,
      "unitCode": "FTK"
    }
  };
}
