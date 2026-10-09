import type { Access, FieldAccess, PayloadRequest } from "payload";

/** Content areas that roles can be granted permissions on. */
export const RESOURCES = [
  { slug: "pages", label: "Pages" },
  { slug: "services", label: "Services" },
  { slug: "products", label: "Products" },
  { slug: "industries", label: "Industries" },
  { slug: "team", label: "Team" },
  { slug: "testimonials", label: "Testimonials" },
  { slug: "faqs", label: "FAQs" },
  { slug: "media", label: "Media library" },
  { slug: "settings", label: "Site settings" },
] as const;
export type Resource = (typeof RESOURCES)[number]["slug"];

/** What a role can do in each area. */
export const ACTIONS = [
  { name: "create", label: "Create drafts" },
  { name: "update", label: "Edit content" },
  { name: "seo", label: "Edit SEO" },
  { name: "approve", label: "Approve" },
  { name: "publish", label: "Publish" },
  { name: "delete", label: "Delete" },
] as const;
export type Action = (typeof ACTIONS)[number]["name"];

type RoleDoc = {
  fullAccess?: boolean | null;
  manageUsers?: boolean | null;
  viewAudit?: boolean | null;
  ownContentOnly?: boolean | null;
  permissions?: Partial<Record<Resource, Partial<Record<Action, boolean | null>>>> | null;
  allowedPages?: (string | number | { id: string | number })[] | null;
};
type UserDoc = { id: string | number; enabled?: boolean | null; role?: RoleDoc | string | number | null } | null | undefined;

const roleOf = (user: UserDoc): RoleDoc | null => {
  if (!user || user.enabled === false) return null;
  return user.role && typeof user.role === "object" ? user.role : null;
};

export const isActive = (user: UserDoc) => !!user && user.enabled !== false;
export const isAdmin = (user: UserDoc) => !!roleOf(user)?.fullAccess;
export const canManageUsers = (user: UserDoc) => { const r = roleOf(user); return !!(r?.fullAccess || r?.manageUsers); };
export const canViewAudit = (user: UserDoc) => { const r = roleOf(user); return !!(r?.fullAccess || r?.viewAudit); };

export function can(user: UserDoc, resource: Resource, action: Action): boolean {
  const r = roleOf(user);
  if (!r) return false;
  if (r.fullAccess) return true;
  return !!r.permissions?.[resource]?.[action];
}
export const canAny = (user: UserDoc, resource: Resource, actions: Action[]) => actions.some((a) => can(user, resource, a));

export const ownOnly = (user: UserDoc) => { const r = roleOf(user); return !!r && !r.fullAccess && !!r.ownContentOnly; };

/** Page IDs a user is limited to, or null for "all pages". */
export function allowedPageIds(user: UserDoc): (string | number)[] | null {
  const r = roleOf(user);
  if (!r || r.fullAccess || !r.allowedPages?.length) return null;
  return r.allowedPages.map((p) => (typeof p === "object" ? p.id : p));
}

const u = (req: PayloadRequest) => req.user as UserDoc;

/** Collection-level access for a content area. */
export function resourceAccess(resource: Resource, opts: { drafts?: boolean; scoped?: boolean } = {}) {
  const read: Access = ({ req }) => {
    if (isActive(u(req))) return true;
    // Public API reads only see published content
    return opts.drafts ? { _status: { equals: "published" } } : true;
  };
  const scope = (req: PayloadRequest) => {
    const and: Record<string, unknown>[] = [];
    if (opts.scoped) {
      const ids = allowedPageIds(u(req));
      if (ids) and.push({ id: { in: ids } });
    }
    if (opts.drafts && ownOnly(u(req))) and.push({ createdBy: { equals: u(req)!.id } });
    return and.length ? ({ and } as never) : true;
  };
  return {
    read,
    readVersions: (({ req }) => isActive(u(req))) as Access,
    create: (({ req }) => can(u(req), resource, "create")) as Access,
    update: (({ req }) => (canAny(u(req), resource, ["update", "seo", "approve", "publish"]) ? scope(req) : false)) as Access,
    delete: (({ req }) => (can(u(req), resource, "delete") ? scope(req) : false)) as Access,
  };
}

/** Field-level guards. */
export const contentField = (resource: Resource): { create: FieldAccess; update: FieldAccess } => ({
  create: ({ req }) => can(u(req), resource, "create") || can(u(req), resource, "update"),
  update: ({ req }) => can(u(req), resource, "update"),
});
export const seoField = (resource: Resource): { create: FieldAccess; update: FieldAccess } => ({
  create: ({ req }) => can(u(req), resource, "seo") || can(u(req), resource, "create"),
  update: ({ req }) => can(u(req), resource, "seo"),
});
