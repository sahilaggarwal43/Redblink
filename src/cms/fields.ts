import type { Field } from "payload";
import { contentField, seoField, type Resource } from "./permissions";

/** Applies the "Edit content" permission to every top-level content field. */
export function guarded(resource: Resource, fields: Field[]): Field[] {
  return fields.map((f) => {
    if ("name" in f && f.name) return { ...f, access: { ...contentField(resource), ...("access" in f ? f.access : {}) } } as Field;
    if ((f.type === "row" || f.type === "collapsible") && "fields" in f) return { ...f, fields: guarded(resource, f.fields) } as Field;
    return f;
  });
}

/** Per-document SEO controls, editable only by roles with the "Edit SEO" permission. */
export function seoGroup(resource: Resource): Field {
  return {
    name: "seo",
    type: "group",
    label: "SEO",
    access: seoField(resource),
    admin: { description: "Search and social settings. Leave a field empty to use the default." },
    fields: [
      { name: "metaTitle", type: "text", label: "Meta title", admin: { description: "Shown in search results and the browser tab. Aim for 50–60 characters." } },
      { name: "metaDescription", type: "textarea", label: "Meta description", admin: { description: "Shown under the title in search results. Aim for 140–160 characters." } },
      { name: "keywords", type: "text", label: "Meta keywords", admin: { description: "Comma-separated. Optional; most search engines ignore this." } },
      { name: "canonical", type: "text", label: "Canonical URL", admin: { description: "Full URL of the preferred version of this page. Leave empty to use this page's own URL." } },
      {
        type: "row",
        fields: [
          { name: "noIndex", type: "checkbox", label: "Hide from search engines (noindex)" },
          { name: "noFollow", type: "checkbox", label: "Don't follow links (nofollow)" },
          { name: "excludeFromSitemap", type: "checkbox", label: "Exclude from sitemap" },
        ],
      },
      { name: "ogTitle", type: "text", label: "Social share title (Open Graph)" },
      { name: "ogDescription", type: "textarea", label: "Social share description (Open Graph)" },
      { name: "ogImage", type: "upload", relationTo: "media", label: "Social share image", admin: { description: "1200 × 630 px recommended." } },
      { name: "jsonLd", type: "code", label: "Extra structured data (JSON-LD)", admin: { language: "json", description: "Advanced. Added to the page in addition to the built-in schema." } },
    ],
  };
}
