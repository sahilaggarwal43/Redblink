import type { CollectionConfig } from "payload";
import { canViewAudit } from "../permissions";

export const AuditLog: CollectionConfig = {
  slug: "audit-log",
  labels: { singular: "Activity", plural: "Activity log" },
  admin: { group: "Administration", useAsTitle: "title", defaultColumns: ["createdAt", "userEmail", "action", "resource", "title", "status"], description: "Every change made in the CMS: who, what and when." },
  defaultSort: "-createdAt",
  access: { read: ({ req }) => canViewAudit(req.user as never), create: () => false, update: () => false, delete: () => false },
  fields: [
    { name: "user", type: "relationship", relationTo: "users" },
    { name: "userEmail", type: "text", label: "User" },
    { name: "action", type: "text" },
    { name: "resource", type: "text", label: "Area" },
    { name: "docId", type: "text", label: "Document ID" },
    { name: "title", type: "text", label: "Document" },
    { name: "status", type: "text" },
  ],
};
