import type { GlobalConfig } from "payload";
import { guarded, seoGroup } from "../fields";
import { can, isActive } from "../permissions";
import { auditGlobalAfterChange, workflowFields, workflowGlobalBeforeChange } from "../workflow";
import { previewUrl } from "../preview";

export const Settings: GlobalConfig = {
  slug: "settings",
  label: "Site settings",
  admin: { group: "Content", preview: () => previewUrl("/") },
  access: {
    read: () => true,
    readVersions: ({ req }) => isActive(req.user as never),
    update: ({ req }) => ["update", "seo", "approve", "publish"].some((a) => can(req.user as never, "settings", a as never)),
  },
  versions: { drafts: { autosave: false }, max: 100 },
  lockDocuments: { duration: 600 },
  fields: [
    ...guarded("settings", [
      { type: "row", fields: [{ name: "phone", type: "text" }, { name: "phoneHref", type: "text", label: "Phone link (tel:)" }] },
      { type: "row", fields: [{ name: "email", type: "text" }, { name: "salesEmail", type: "text" }] },
      { name: "hours", type: "text" },
      { name: "address", type: "group", fields: [
        { name: "street", type: "text" },
        { type: "row", fields: [{ name: "city", type: "text" }, { name: "region", type: "text" }, { name: "postal", type: "text" }] },
        { name: "mapUrl", type: "text" },
      ] },
      { name: "stats", type: "array", label: "Track record numbers", fields: [{ type: "row", fields: [{ name: "value", type: "number", required: true }, { name: "suffix", type: "text" }, { name: "label", type: "text", required: true }] }] },
      { name: "social", type: "group", fields: [{ type: "row", fields: [{ name: "linkedin", type: "text" }, { name: "twitter", type: "text" }, { name: "facebook", type: "text" }, { name: "instagram", type: "text" }] }] },
    ]),
    seoGroup("settings"),
    ...workflowFields,
  ],
  hooks: { beforeChange: [workflowGlobalBeforeChange("settings")], afterChange: [auditGlobalAfterChange("settings", "Site settings")] },
};
