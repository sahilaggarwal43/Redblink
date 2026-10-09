import type { Payload } from "payload";
import { RESOURCES, type Action, type Resource } from "./permissions";
import { defaultPages } from "../data/pages";
import { services } from "../data/services";
import { productList } from "../data/products";
import { industries, team, testimonials, homeFaqs, site, stats } from "../data/site";
import { PAGE_KEYS } from "./collections/content";

const ctx = { seed: true };
const content: Resource[] = ["pages", "services", "products", "industries", "team", "testimonials", "faqs", "media"];
const grant = (areas: Resource[], actions: Action[]) =>
  Object.fromEntries(RESOURCES.map((r) => [r.slug, Object.fromEntries(actions.map((a) => [a, areas.includes(r.slug)]))]));

export const DEFAULT_ROLES = [
  { name: "Administrator", description: "Full access to everything, including users, roles and settings.", fullAccess: true },
  { name: "Editor", description: "Creates and edits content and submits it for approval. Cannot approve or publish.", permissions: grant(content, ["create", "update"]) },
  { name: "Creator", description: "Creates new drafts and edits only their own items. Cannot approve or publish.", ownContentOnly: true, permissions: grant(content.filter((c) => c !== "pages"), ["create", "update"]) },
  { name: "SEO Specialist", description: "Manages meta titles, descriptions, canonical URLs, Open Graph and indexing on every page.", permissions: { ...grant([...content, "settings"], ["seo"]), media: { create: true, update: true, seo: true } } },
  { name: "Approver", description: "Reviews changes, approves them and publishes approved changes.", viewAudit: true, permissions: grant([...content, "settings"], ["approve", "publish"]) },
];

const published = { _status: "published" as const, workflowStatus: "published" };
const vals = (a: string[]) => a.map((value) => ({ value }));

export async function seed(payload: Payload) {
  // Roles
  for (const r of DEFAULT_ROLES) {
    const found = await payload.find({ collection: "roles", where: { name: { equals: r.name } }, limit: 1, overrideAccess: true });
    if (!found.docs.length) await payload.create({ collection: "roles", data: r as never, overrideAccess: true, context: ctx });
  }

  // First administrator from environment variables (optional; otherwise use the "create first user" screen)
  const users = await payload.count({ collection: "users", overrideAccess: true });
  if (!users.totalDocs && process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    const admin = await payload.find({ collection: "roles", where: { name: { equals: "Administrator" } }, limit: 1, overrideAccess: true });
    await payload.create({ collection: "users", data: { email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD, name: process.env.ADMIN_NAME || "Administrator", role: admin.docs[0].id, enabled: true } as never, overrideAccess: true, context: ctx });
    payload.logger.info(`Created administrator ${process.env.ADMIN_EMAIL}`);
  }

  const empty = async (collection: string) => (await payload.count({ collection: collection as never, overrideAccess: true })).totalDocs === 0;
  const create = (collection: string, data: Record<string, unknown>) =>
    payload.create({ collection: collection as never, data: { ...data, ...published } as never, overrideAccess: true, context: ctx, draft: false });

  if (await empty("pages")) {
    for (const p of defaultPages) {
      await create("pages", { key: p.key, title: p.title, path: PAGE_KEYS.find((k) => k.value === p.key)?.path, hero: p.hero, sections: p.sections, seo: p.seo });
    }
  }
  if (await empty("services")) {
    for (const sv of services) {
      await create("services", {
        title: sv.title, slug: sv.slug, category: sv.category, short: sv.short, headline: sv.headline, intro: sv.intro, isNew: !!sv.isNew,
        capabilities: sv.capabilities, useCases: vals(sv.useCases), stack: vals(sv.stack), faqs: sv.faqs, keywords: vals(sv.keywords),
        seo: { metaTitle: sv.title, metaDescription: sv.short, keywords: sv.keywords.join(", ") },
      });
    }
  }
  if (await empty("products")) {
    for (const p of productList) {
      await create("products", { ...p, image: undefined, audiences: vals(p.audiences), seo: { metaTitle: `${p.name}: ${p.kind}`, metaDescription: p.summary } });
    }
  }
  if (await empty("industries")) {
    for (const i of industries) await create("industries", { name: i.name, slug: i.id, body: i.body, examples: vals(i.examples) });
  }
  if (await empty("team")) {
    const slug = (n: string) => n.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    for (const [i, m] of team.entries()) await create("team", { name: m.name, role: m.role, linkedin: m.linkedin, photoPath: `/team/${slug(m.name)}.jpg`, showOnHome: i < 4 });
  }
  if (await empty("testimonials")) for (const t of testimonials) await create("testimonials", { quote: t.quote, name: t.name, role: t.role, topic: t.topic });
  if (await empty("faqs")) for (const f of homeFaqs) await create("faqs", { q: f.q, a: f.a, placement: "home" });

  const settings = (await payload.findGlobal({ slug: "settings", overrideAccess: true })) as { phone?: string };
  if (!settings?.phone) {
    await payload.updateGlobal({
      slug: "settings",
      data: {
        phone: site.phone, phoneHref: site.phoneHref, email: site.email, salesEmail: site.salesEmail, hours: site.hours,
        address: { street: site.address.street, city: site.address.city, region: site.address.region, postal: site.address.postal, mapUrl: site.address.mapUrl },
        stats: stats.map((x) => ({ value: x.value, suffix: x.suffix, label: x.label })),
        social: site.social,
        seo: { metaTitle: "RedBlink | AI Software Development Company in California", metaDescription: site.description },
        ...published,
      } as never,
      overrideAccess: true, context: ctx, draft: false,
    });
  }
}
