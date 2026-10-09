import type { MetadataRoute } from "next";
import { SITE_URL } from "@/data/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/admin", "/cms-api/"] }],
    // WordPress keeps publishing its own post sitemap; list both so crawlers find blog posts.
    sitemap: [`${SITE_URL}/sitemap.xml`, `${SITE_URL}/wp-sitemap.xml`],
    host: SITE_URL,
  };
}
