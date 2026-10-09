import type { CollectionConfig, Field } from "payload";
import { ACTIONS, RESOURCES, canManageUsers, isActive } from "../permissions";

const permissionGroups: Field[] = RESOURCES.map((r) => ({
  name: r.slug,
  type: "group",
  label: r.label,
  fields: [{ type: "row", fields: ACTIONS.map((a) => ({ name: a.name, type: "checkbox", label: a.label })) as Field[] }],
}));

export const Roles: CollectionConfig = {
  slug: "roles",
  labels: { singular: "Role", plural: "Roles" },
  admin: { useAsTitle: "name", group: "Administration", defaultColumns: ["name", "fullAccess", "description"] },
  access: {
    read: ({ req }) => isActive(req.user as never),
    create: ({ req }) => canManageUsers(req.user as never),
    update: ({ req }) => canManageUsers(req.user as never),
    delete: ({ req }) => canManageUsers(req.user as never),
  },
  fields: [
    { name: "name", type: "text", required: true, unique: true },
    { name: "description", type: "textarea" },
    { name: "fullAccess", type: "checkbox", label: "Full access (Administrator)", admin: { description: "Grants every permission below, including managing users and roles." } },
    {
      type: "collapsible",
      label: "Administration",
      admin: { condition: (d) => !d?.fullAccess },
      fields: [
        { type: "row", fields: [
          { name: "manageUsers", type: "checkbox", label: "Manage users and roles" },
          { name: "viewAudit", type: "checkbox", label: "View activity log" },
          { name: "ownContentOnly", type: "checkbox", label: "Only edit items they created" },
        ] },
        { name: "allowedPages", type: "relationship", relationTo: "pages", hasMany: true, label: "Limit to these pages", admin: { description: "Leave empty to allow all pages." } },
      ],
    },
    {
      name: "permissions",
      type: "group",
      label: "Permissions by area",
      admin: { condition: (d) => !d?.fullAccess, description: "Pick exactly what this role may do in each area. Publishing always requires an approved change." },
      fields: permissionGroups,
    },
  ],
};
