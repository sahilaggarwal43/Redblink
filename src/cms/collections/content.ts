import type { Field } from "payload";
import { contentCollection } from "../factory";

export const PAGE_KEYS = [
  { label: "Home", value: "home", path: "/" },
  { label: "Services (index)", value: "services", path: "/services/" },
  { label: "Industries", value: "industries", path: "/industries/" },
  { label: "Products (index)", value: "products", path: "/products/" },
  { label: "Work", value: "work", path: "/work/" },
  { label: "Hire engineers", value: "hire", path: "/hire/" },
  { label: "About", value: "about", path: "/about/" },
  { label: "Careers", value: "careers", path: "/careers/" },
  { label: "Contact", value: "contact", path: "/contact/" },
  { label: "Privacy policy", value: "privacy", path: "/privacy-policy/" },
  { label: "Terms", value: "terms", path: "/terms-conditions/" },
  { label: "Accessibility", value: "accessibility", path: "/accessibility/" },
] as const;

const cta = (name: string, label: string): Field => ({
  name, type: "group", label,
  fields: [{ type: "row", fields: [{ name: "label", type: "text" }, { name: "href", type: "text", label: "Link" }] }],
});

const list = (name: string, label: string, sub: Field[]): Field => ({ name, type: "array", label, fields: sub, admin: { initCollapsed: true } });

export const Pages = contentCollection({
  slug: "pages",
  resource: "pages",
  labels: { singular: "Page", plural: "Pages" },
  titleField: "title",
  group: "Content",
  seo: true,
  scoped: true,
  description: "Text and SEO for every page. Section keys connect each block to its place on the page.",
  defaultColumns: ["title", "path", "workflowStatus", "_status", "updatedAt"],
  path: (d) => PAGE_KEYS.find((k) => k.value === d.key)?.path || "/",
  fields: [
    { name: "title", type: "text", required: true, label: "Page name" },
    { type: "row", fields: [
      { name: "key", type: "select", required: true, unique: true, options: PAGE_KEYS.map(({ label, value }) => ({ label, value })), admin: { width: "50%" } },
      { name: "path", type: "text", admin: { readOnly: true, width: "50%" } },
    ] },
    {
      name: "hero", type: "group", label: "Hero",
      fields: [
        { name: "eyebrow", type: "text" },
        { name: "title", type: "text" },
        { name: "lede", type: "textarea", label: "Intro paragraph" },
        cta("primary", "Primary button"),
        cta("secondary", "Secondary button"),
        { name: "image", type: "upload", relationTo: "media" },
      ],
    },
    list("sections", "Sections", [
      { type: "row", fields: [
        { name: "key", type: "text", required: true, admin: { width: "40%", description: "Which block on the page this edits." } },
        { name: "kicker", type: "text", label: "Label", admin: { width: "60%" } },
      ] },
      { name: "heading", type: "text" },
      { name: "body", type: "textarea" },
      cta("cta", "Button"),
      { name: "image", type: "upload", relationTo: "media" },
    ]),
  ],
});

export const Services = contentCollection({
  slug: "services",
  resource: "services",
  labels: { singular: "Service", plural: "Services" },
  titleField: "title",
  group: "Content",
  seo: true,
  orderable: true,
  path: (d) => `/services/${d.slug}/`,
  defaultColumns: ["title", "category", "workflowStatus", "_status", "updatedAt"],
  fields: [
    { name: "title", type: "text", required: true },
    { type: "row", fields: [
      { name: "slug", type: "text", required: true, unique: true, admin: { width: "50%", description: "URL: /services/<slug>/" } },
      { name: "category", type: "select", required: true, admin: { width: "50%" }, options: [
        { label: "Generative & agentic AI", value: "genai" }, { label: "AI & machine learning", value: "ai" },
        { label: "Software engineering", value: "engineering" }, { label: "Cloud, security & IT", value: "cloud" }, { label: "Design & growth", value: "growth" },
      ] },
    ] },
    { name: "short", type: "textarea", required: true, label: "Short description (cards and menus)" },
    { name: "headline", type: "text", required: true, label: "Page headline" },
    { name: "intro", type: "textarea", required: true },
    list("capabilities", "What we deliver", [{ name: "t", type: "text", label: "Title", required: true }, { name: "d", type: "textarea", label: "Description" }]),
    list("useCases", "Where clients use it", [{ name: "value", type: "text", required: true }]),
    list("stack", "Tools and platforms", [{ name: "value", type: "text", required: true }]),
    list("faqs", "FAQs", [{ name: "q", type: "text", label: "Question", required: true }, { name: "a", type: "textarea", label: "Answer", required: true }]),
    list("keywords", "Search phrases", [{ name: "value", type: "text" }]),
    { name: "isNew", type: "checkbox", label: "Mark as new" },
  ],
});

export const Products = contentCollection({
  slug: "products",
  resource: "products",
  labels: { singular: "Product", plural: "Products" },
  titleField: "name",
  group: "Content",
  seo: true,
  orderable: true,
  path: (d) => `/products/${d.slug}/`,
  defaultColumns: ["name", "kind", "workflowStatus", "_status", "updatedAt"],
  fields: [
    { type: "row", fields: [{ name: "name", type: "text", required: true }, { name: "slug", type: "text", required: true, unique: true }] },
    { type: "row", fields: [{ name: "kind", type: "text", label: "Category label" }, { name: "accent", type: "select", defaultValue: "red", options: [{ label: "Red", value: "red" }, { label: "Graphite", value: "ink" }] }] },
    { name: "tagline", type: "text" },
    { name: "summary", type: "textarea", label: "Short summary (cards)" },
    { name: "description", type: "textarea", label: "Overview" },
    { name: "image", type: "upload", relationTo: "media", label: "Product image or screenshot" },
    { type: "row", fields: [{ name: "href", type: "text", label: "Button link" }, { name: "ctaLabel", type: "text", label: "Button label" }] },
    { name: "featured", type: "checkbox", label: "Feature on products page" },
    list("features", "Features", [{ name: "title", type: "text", required: true }, { name: "body", type: "textarea" }]),
    list("steps", "How it works", [{ name: "title", type: "text", required: true }, { name: "body", type: "textarea" }]),
    list("audiences", "Who it's for", [{ name: "value", type: "text", required: true }]),
    list("faqs", "FAQs", [{ name: "q", type: "text", required: true }, { name: "a", type: "textarea", required: true }]),
  ],
});

export const Industries = contentCollection({
  slug: "industries",
  resource: "industries",
  labels: { singular: "Industry", plural: "Industries" },
  titleField: "name",
  group: "Content",
  orderable: true,
  path: (d) => `/industries/#${d.slug}`,
  fields: [
    { type: "row", fields: [{ name: "name", type: "text", required: true }, { name: "slug", type: "text", required: true, unique: true }] },
    { name: "body", type: "textarea" },
    list("examples", "Example use cases", [{ name: "value", type: "text", required: true }]),
  ],
});

export const Team = contentCollection({
  slug: "team",
  resource: "team",
  labels: { singular: "Team member", plural: "Team" },
  titleField: "name",
  group: "Content",
  orderable: true,
  path: () => "/about/",
  defaultColumns: ["name", "role", "showOnHome", "workflowStatus", "_status"],
  fields: [
    { type: "row", fields: [{ name: "name", type: "text", required: true }, { name: "role", type: "text", required: true, label: "Job title" }] },
    { name: "photo", type: "upload", relationTo: "media" },
    { name: "photoPath", type: "text", label: "Built-in photo", admin: { readOnly: true, description: "Used when no photo is uploaded." } },
    { name: "linkedin", type: "text", label: "LinkedIn URL" },
    { name: "showOnHome", type: "checkbox", label: "Show in homepage leadership section" },
  ],
});

export const Testimonials = contentCollection({
  slug: "testimonials",
  resource: "testimonials",
  labels: { singular: "Testimonial", plural: "Testimonials" },
  titleField: "name",
  group: "Content",
  orderable: true,
  path: () => "/",
  fields: [
    { name: "quote", type: "textarea", required: true },
    { type: "row", fields: [{ name: "name", type: "text", required: true }, { name: "role", type: "text", label: "Title" }, { name: "topic", type: "text" }] },
  ],
});

export const Faqs = contentCollection({
  slug: "faqs",
  resource: "faqs",
  labels: { singular: "FAQ", plural: "FAQs" },
  titleField: "q",
  group: "Content",
  orderable: true,
  path: () => "/",
  fields: [
    { name: "q", type: "text", required: true, label: "Question" },
    { name: "a", type: "textarea", required: true, label: "Answer" },
    { name: "placement", type: "select", defaultValue: "home", options: [{ label: "Homepage", value: "home" }] },
  ],
});
