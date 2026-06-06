import { getAbsoluteUrl } from "@/lib/seo/helpers";

/**
 * Next.js robots configuration generator (mapped to /robots.txt automatically)
 */
export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/properties", "/categories", "/locations"],
      disallow: [
        "/admin",
        "/admin/*",
        "/login",
        "/dashboard",
        "/api/private",
        "/api/auth/*"
      ],
    },
    sitemap: getAbsoluteUrl("/sitemap.xml"),
  };
}
