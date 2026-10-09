import type { MetadataRoute } from "next";
import { SITE_URL } from "@/data/site";
import { getContent } from "@/lib/content";

// Built from the CMS: pages marked "noindex" or "exclude from sitemap" are left out.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const c = await getContent();
  const now = new Date();
  const skip = (seo?: { noIndex?: boolean | null; excludeFromSitemap?: boolean | null } | null) => !!(seo?.noIndex || seo?.excludeFromSitemap);
  const pages = Object.values(c.pages).filter((p) => !skip(p.seo));
  return [
    ...pages.map((p) => ({ url: `${SITE_URL}${p.path}`, lastModified: now, changeFrequency: "weekly" as const, priority: p.path === "/" ? 1 : p.key === "services" ? 0.9 : 0.7 })),
    ...c.services.filter((s) => !skip(s.seo)).map((s) => ({ url: `${SITE_URL}/services/${s.slug}/`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...c.products.filter((p) => !skip(p.seo)).map((p) => ({ url: `${SITE_URL}/products/${p.slug}/`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
