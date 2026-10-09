import { APIError, type CollectionConfig } from "payload";
import { canManageUsers, isActive } from "../permissions";

export const Users: CollectionConfig = {
  slug: "users",
  labels: { singular: "User", plural: "Users" },
  auth: { depth: 1, tokenExpiration: 60 * 60 * 8, maxLoginAttempts: 5, lockTime: 15 * 60 * 1000 },
  admin: { useAsTitle: "name", group: "Administration", defaultColumns: ["name", "email", "role", "enabled", "updatedAt"] },
  access: {
    read: ({ req }) => isActive(req.user as never),
    create: async ({ req }) => {
      if (canManageUsers(req.user as never)) return true;
      // Allow creating the very first account (becomes Administrator)
      const { totalDocs } = await req.payload.count({ collection: "users", overrideAccess: true });
      return totalDocs === 0;
    },
    update: ({ req }) => (canManageUsers(req.user as never) ? true : isActive(req.user as never) ? { id: { equals: req.user!.id } } : false),
    delete: ({ req }) => canManageUsers(req.user as never),
    unlock: ({ req }) => canManageUsers(req.user as never),
  },
  fields: [
    { name: "name", type: "text", required: true },
    {
      name: "role",
      type: "relationship",
      relationTo: "roles",
      required: true,
      admin: { position: "sidebar", description: "Controls what this person can see and do." },
      access: { update: ({ req }) => canManageUsers(req.user as never) },
    },
    {
      name: "enabled",
      type: "checkbox",
      defaultValue: true,
      label: "Account enabled",
      admin: { position: "sidebar", description: "Disabled users can't sign in." },
      access: { update: ({ req }) => canManageUsers(req.user as never) },
    },
  ],
  hooks: {
    beforeValidate: [
      async ({ data, req, operation }) => {
        if (operation !== "create" || !data || data.role) return data;
        const { totalDocs } = await req.payload.count({ collection: "users", overrideAccess: true });
        if (totalDocs === 0) {
          const admin = await req.payload.find({ collection: "roles", where: { name: { equals: "Administrator" } }, limit: 1, overrideAccess: true });
          if (admin.docs[0]) data.role = admin.docs[0].id;
        }
        return data;
      },
    ],
    beforeLogin: [
      ({ user }) => {
        if (user.enabled === false) throw new APIError("This account has been disabled. Contact an administrator.", 403, null, true);
        return user;
      },
    ],
  },
};
