import { cache } from "react";
import type { Metadata } from "next";
import { defaultPages, type PageContent, type PageSection } from "@/data/pages";
import { productList, type Product, type SeoFields } from "@/data/products";
import { services as staticServices, type Service, type CategoryId } from "@/data/services";
import { industries as staticIndustries, team as staticTeam, testimonials as staticTestimonials, homeFaqs, site as staticSite, stats as staticStats, SITE_URL } from "@/data/site";
import teamPhotos from "@/data/team-photos.json";

/**
 * Every page reads content through this module.
 * - With DATABASE_URI + PAYLOAD_SECRET set, content comes from the CMS (published versions, or drafts in preview mode).
 * - Without them, or if the database is unreachable, the built-in content is used, so the site never breaks.
 */

export type TeamMember = { name: string; role: string; linkedin: string; photo: string | null; showOnHome?: boolean };
export type Industry = { id: string; name: string; body: string; examples: string[] };
export type Testimonial = { name: string; role: string; quote: string; topic: string };
export type Faq = { q: string; a: string };
export type Stat = { value: number; suffix: string; label: string };
export type Settings = typeof staticSite & { stats: Stat[]; seo: SeoFields };
export type SiteContent = {
  pages: Record<string, PageContent>;
  services: Service[];
  products: Product[];
  industries: Industry[];
  team: TeamMember[];
  testimonials: Testimonial[];
  faqs: Faq[];
  settings: Settings;
  source: "cms" | "static";
};

export { cmsConfigured as cmsEnabled } from "@/cms/env";
import { cmsConfigured as cmsEnabled } from "@/cms/env";

const slugify = (n: string) => n.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const photos = teamPhotos as Record<string, string>;

function staticContent(): SiteContent {
  return {
    pages: Object.fromEntries(defaultPages.map((p) => [p.key, p])),
    services: staticServices,
    products: productList,
    industries: staticIndustries.map((i) => ({ id: i.id, name: i.name, body: i.body, examples: i.examples })),
    team: staticTeam.map((m, i) => ({ ...m, photo: photos[slugify(m.name)] || null, showOnHome: i < 4 })),
    testimonials: staticTestimonials.map((t) => ({ name: t.name, role: t.role, quote: t.quote, topic: t.topic })),
    faqs: homeFaqs,
    settings: { ...staticSite, stats: staticStats, seo: {} },
    source: "static",
  };
}

type Doc = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
const vals = (a?: { value?: string }[] | null) => (a || []).map((x) => x.value || "").filter(Boolean);
const media = (m: unknown): string | null => (m && typeof m === "object" && "url" in m ? ((m as { url?: string }).url ?? null) : null);
const has = (v: unknown) => v !== undefined && v !== null && v !== "";
const pick = <T,>(cms: T | null | undefined, fallback: T): T => (has(cms) ? (cms as T) : fallback);

function mapSeo(s: Doc | undefined | null): SeoFields {
  if (!s) return {};
  return { ...s, ogImage: media(s.ogImage) };
}

function mergePage(def: PageContent | undefined, doc: Doc): PageContent {
  const base: PageContent = def || { key: doc.key, title: doc.title, path: doc.path || "/", hero: {}, sections: [], seo: {} };
  const h = doc.hero || {};
  const sections = new Map<string, PageSection>(base.sections.map((s) => [s.key, s]));
  for (const s of (doc.sections || []) as Doc[]) {
    const prev: PageSection = sections.get(s.key) || { key: s.key };
    sections.set(s.key, {
      key: s.key,
      kicker: pick(s.kicker, prev.kicker ?? null),
      heading: pick(s.heading, prev.heading ?? null),
      body: pick(s.body, prev.body ?? null),
      cta: has(s.cta?.label) ? s.cta : prev.cta ?? null,
      image: media(s.image) ?? prev.image ?? null,
    });
  }
  const seo = mapSeo(doc.seo);
  return {
    ...base,
    title: pick(doc.title, base.title),
    hero: {
      eyebrow: pick(h.eyebrow, base.hero.eyebrow ?? null),
      title: pick(h.title, base.hero.title ?? null),
      lede: pick(h.lede, base.hero.lede ?? null),
      primary: has(h.primary?.label) ? h.primary : base.hero.primary ?? null,
      secondary: has(h.secondary?.label) ? h.secondary : base.hero.secondary ?? null,
      image: media(h.image) ?? base.hero.image ?? null,
    },
    sections: [...sections.values()],
    seo: Object.fromEntries(Object.entries({ ...base.seo, ...seo }).map(([k, v]) => [k, has(v) ? v : (base.seo as Doc)[k] ?? null])) as SeoFields,
  };
}

async function fromCms(draft: boolean): Promise<SiteContent> {
  const { getPayload } = await import("payload");
  const config = (await import("@payload-config")).default;
  const payload = await getPayload({ config });
  const q = { draft, depth: 1, limit: 300, overrideAccess: draft, pagination: false as const };
  const [pages, services, products, industries, team, testimonials, faqs, settings] = await Promise.all([
    payload.find({ collection: "pages", ...q }),
    payload.find({ collection: "services", sort: "_order", ...q }),
    payload.find({ collection: "products", sort: "_order", ...q }),
    payload.find({ collection: "industries", sort: "_order", ...q }),
    payload.find({ collection: "team", sort: "_order", ...q }),
    payload.find({ collection: "testimonials", sort: "_order", ...q }),
    payload.find({ collection: "faqs", sort: "_order", ...q }),
    payload.findGlobal({ slug: "settings", draft, depth: 1, overrideAccess: draft }),
  ]);
  const base = staticContent();
  const live = (docs: Doc[]) => (draft ? docs : docs.filter((d) => d._status !== "draft"));
  const or = <T,>(list: T[], fallback: T[]) => (list.length ? list : fallback);
  const s = settings as Doc;

  return {
    source: "cms",
    pages: Object.fromEntries(defaultPages.map((p) => [p.key, p]).concat(live(pages.docs as Doc[]).map((d) => [d.key, mergePage(base.pages[d.key], d)]))),
    services: or<Service>(live(services.docs as Doc[]).map((d) => ({
      slug: d.slug, category: d.category as CategoryId, title: d.title, short: d.short, headline: d.headline, intro: d.intro, isNew: !!d.isNew,
      capabilities: (d.capabilities || []).map((c: Doc) => ({ t: c.t, d: c.d || "" })), useCases: vals(d.useCases), stack: vals(d.stack),
      faqs: (d.faqs || []).map((f: Doc) => ({ q: f.q, a: f.a })), keywords: vals(d.keywords), seo: mapSeo(d.seo),
    })), base.services),
    products: or<Product>(live(products.docs as Doc[]).map((d) => ({
      slug: d.slug, name: d.name, kind: d.kind || "", tagline: d.tagline || "", summary: d.summary || "", description: d.description || "",
      href: d.href || "/contact/", ctaLabel: d.ctaLabel || `Ask about ${d.name}`, accent: d.accent || "red", image: media(d.image), featured: !!d.featured,
      features: (d.features || []).map((f: Doc) => ({ title: f.title, body: f.body || "" })), steps: (d.steps || []).map((f: Doc) => ({ title: f.title, body: f.body || "" })),
      audiences: vals(d.audiences), faqs: (d.faqs || []).map((f: Doc) => ({ q: f.q, a: f.a })), seo: mapSeo(d.seo),
    })), base.products),
    industries: or(live(industries.docs as Doc[]).map((d) => ({ id: d.slug, name: d.name, body: d.body || "", examples: vals(d.examples) })), base.industries),
    team: or<TeamMember>(live(team.docs as Doc[]).map((d) => ({ name: d.name, role: d.role, linkedin: d.linkedin || "", photo: media(d.photo) || d.photoPath || photos[slugify(d.name)] || null, showOnHome: !!d.showOnHome })), base.team),
    testimonials: or(live(testimonials.docs as Doc[]).map((d) => ({ name: d.name, role: d.role || "", quote: d.quote, topic: d.topic || "" })), base.testimonials),
    faqs: or(live(faqs.docs as Doc[]).filter((d) => (d.placement || "home") === "home").map((d) => ({ q: d.q, a: d.a })), base.faqs),
    settings: {
      ...base.settings,
      phone: pick(s.phone, base.settings.phone),
      phoneHref: pick(s.phoneHref, base.settings.phoneHref),
      email: pick(s.email, base.settings.email),
      salesEmail: pick(s.salesEmail, base.settings.salesEmail),
      hours: pick(s.hours, base.settings.hours),
      address: { ...base.settings.address, ...Object.fromEntries(Object.entries(s.address || {}).filter(([, v]) => has(v))) },
      social: { ...base.settings.social, ...Object.fromEntries(Object.entries(s.social || {}).filter(([, v]) => has(v))) },
      stats: (s.stats || []).length ? (s.stats as Doc[]).map((x) => ({ value: Number(x.value), suffix: x.suffix || "", label: x.label })) : base.settings.stats,
      seo: mapSeo(s.seo),
    },
  };
}

async function isDraft() {
  try {
    const { draftMode } = await import("next/headers");
    return (await draftMode()).isEnabled;
  } catch {
    return false;
  }
}

/** All site content for the current request (cached per request). */
export const getContent = cache(async (): Promise<SiteContent> => {
  if (!cmsEnabled()) return staticContent();
  try {
    return await fromCms(await isDraft());
  } catch (e) {
    console.error("[content] CMS unavailable, using built-in content:", (e as Error).message);
    return staticContent();
  }
});

export async function getPage(key: string): Promise<PageContent> {
  const c = await getContent();
  return c.pages[key] || defaultPages.find((p) => p.key === key)!;
}

export const section = (page: PageContent, key: string): PageSection => page.sections.find((s) => s.key === key) || { key };

/** Builds Next.js metadata from a document's SEO fields, with sensible fallbacks. */
export function buildMetadata({ seo = {}, title, description, path, keywords }: { seo?: SeoFields; title: string; description: string; path: string; keywords?: string[] }): Metadata {
  const t = seo.metaTitle || title;
  const d = seo.metaDescription || description;
  const url = seo.canonical || `${SITE_URL}${path}`;
  const ogImage = seo.ogImage ? (seo.ogImage.startsWith("http") ? seo.ogImage : `${SITE_URL}${seo.ogImage}`) : undefined;
  const kw = seo.keywords ? seo.keywords.split(",").map((k) => k.trim()).filter(Boolean) : keywords;
  return {
    title: path === "/" ? { absolute: t } : t,
    description: d,
    keywords: kw,
    alternates: { canonical: url },
    robots: { index: !seo.noIndex, follow: !seo.noFollow },
    openGraph: { title: seo.ogTitle || t, description: seo.ogDescription || d, url, siteName: "RedBlink", type: "website", locale: "en_US", ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630 }] } : {}) },
    twitter: { card: "summary_large_image", title: seo.ogTitle || t, description: seo.ogDescription || d, site: "@redblinktech", ...(ogImage ? { images: [ogImage] } : {}) },
  };
}

export async function pageMetadata(key: string): Promise<Metadata> {
  const p = await getPage(key);
  return buildMetadata({ seo: p.seo, title: p.seo.metaTitle || p.title, description: p.seo.metaDescription || p.hero.lede || "", path: p.path });
}

/** Extra JSON-LD an SEO specialist added in the CMS, if it parses. */
export function extraJsonLd(seo?: SeoFields | null): object | null {
  if (!seo?.jsonLd) return null;
  try { return JSON.parse(seo.jsonLd); } catch { return null; }
}
