import type { CollectionConfig } from "payload";
import { resourceAccess } from "../permissions";
import { auditAfterChange, auditAfterDelete } from "../workflow";

export const Media: CollectionConfig = {
  slug: "media",
  labels: { singular: "Image", plural: "Media library" },
  admin: { group: "Content", useAsTitle: "alt" },
  access: { ...resourceAccess("media"), read: () => true },
  upload: {
    mimeTypes: ["image/*"],
    imageSizes: [
      { name: "thumb", width: 400 },
      { name: "card", width: 900 },
      { name: "og", width: 1200, height: 630, position: "centre" },
    ],
    adminThumbnail: "thumb",
  },
  fields: [{ name: "alt", type: "text", required: true, label: "Alt text", admin: { description: "Describe the image for screen readers and search engines." } }],
  hooks: { afterChange: [auditAfterChange("media", "alt")], afterDelete: [auditAfterDelete("media", "alt")] },
};
