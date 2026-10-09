import { APIError, type CollectionAfterChangeHook, type CollectionBeforeChangeHook, type Field, type GlobalAfterChangeHook, type GlobalBeforeChangeHook } from "payload";
import { can, type Resource } from "./permissions";

export const STATUSES = [
  { label: "Draft", value: "draft" },
  { label: "Pending approval", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Published", value: "published" },
] as const;

/** Sidebar fields that track where a change is in the review process. */
export const workflowFields: Field[] = [
  {
    name: "workflowStatus",
    type: "select",
    label: "Review status",
    defaultValue: "draft",
    options: STATUSES as unknown as { label: string; value: string }[],
    admin: {
      position: "sidebar",
      description: "Edit → Save draft → Preview → set to Pending approval → an approver sets Approved → a publisher clicks Publish.",
    },
  },
  { name: "reviewNote", type: "textarea", label: "Note for reviewer", admin: { position: "sidebar" } },
  { name: "createdBy", type: "relationship", relationTo: "users", label: "Created by", admin: { position: "sidebar", readOnly: true } },
  { name: "lastEditedBy", type: "relationship", relationTo: "users", label: "Last edited by", admin: { position: "sidebar", readOnly: true } },
  { name: "approvedBy", type: "relationship", relationTo: "users", label: "Approved by", admin: { position: "sidebar", readOnly: true } },
  { name: "approvedAt", type: "date", label: "Approved at", admin: { position: "sidebar", readOnly: true, date: { pickerAppearance: "dayAndTime" } } },
  { name: "publishedBy", type: "relationship", relationTo: "users", label: "Published by", admin: { position: "sidebar", readOnly: true } },
  { name: "publishedAt", type: "date", label: "Published at", admin: { position: "sidebar", readOnly: true, date: { pickerAppearance: "dayAndTime" } } },
];

type Data = Record<string, unknown> & { _status?: string; workflowStatus?: string };
type Ctx = { seed?: boolean };

/**
 * Enforces Edit → Draft → Preview → Approve → Publish.
 * Nothing goes live unless it was approved by someone with "Approve" permission
 * and published by someone with "Publish" permission. Edits after approval need re-approval.
 */
function enforce(resource: Resource, data: Data, original: Data | undefined, user: Parameters<typeof can>[0], context: Ctx, isCreate = false): Data {
  if (context?.seed || !user) return data; // system tasks (seeding, migrations)
  const now = new Date().toISOString();
  data.lastEditedBy = user.id;
  if (isCreate) data.createdBy = user.id;
  const prev = (original?.workflowStatus as string) || "draft";
  let next = (data.workflowStatus as string) || prev;

  if (data._status === "published") {
    if (!can(user, resource, "publish")) {
      throw new APIError("You don't have permission to publish. Save as a draft and set the status to \"Pending approval\".", 403, null, true);
    }
    if (prev !== "approved") {
      throw new APIError("This change hasn't been approved yet. An approver must set the review status to \"Approved\" and save before it can be published.", 400, null, true);
    }
    data.workflowStatus = "published";
    data.publishedBy = user.id;
    data.publishedAt = now;
    return data;
  }

  // Saving a draft
  if (next === "published") next = "draft"; // "Published" can only be set by publishing
  if (next === "approved" && prev !== "approved") {
    if (!can(user, resource, "approve")) throw new APIError("Only users with approval permission can approve changes.", 403, null, true);
    data.approvedBy = user.id;
    data.approvedAt = now;
  } else if (prev === "approved" && next === "approved" && !can(user, resource, "approve")) {
    next = "draft"; // someone changed approved content: it needs approving again
    data.approvedBy = null;
    data.approvedAt = null;
  } else if (next !== "approved") {
    data.approvedBy = null;
    data.approvedAt = null;
  }
  data.workflowStatus = next;
  return data;
}

export const workflowBeforeChange =
  (resource: Resource): CollectionBeforeChangeHook =>
  ({ data, originalDoc, req, context, operation }) =>
    enforce(resource, data as Data, originalDoc as Data, req.user as never, context as Ctx, operation === "create");

export const workflowGlobalBeforeChange =
  (resource: Resource): GlobalBeforeChangeHook =>
  ({ data, originalDoc, req, context }) =>
    enforce(resource, data as Data, originalDoc as Data, req.user as never, context as Ctx);

/** Writes an audit-log entry and refreshes the live site when something is published. */
async function record(req: Parameters<CollectionAfterChangeHook>[0]["req"], entry: { resource: string; docId: string; title: string; status: string; action: string }) {
  try {
    if (!req.user) return;
    await req.payload.create({
      collection: "audit-log",
      data: { user: req.user.id, userEmail: (req.user as { email?: string }).email, ...entry },
      req,
      overrideAccess: true,
    });
  } catch (e) {
    req.payload.logger.warn(`Audit log write failed: ${(e as Error).message}`);
  }
}

async function revalidate() {
  try {
    const { revalidatePath } = await import("next/cache");
    revalidatePath("/", "layout");
  } catch {
    /* outside Next.js (scripts) */
  }
}

function actionFor(doc: Data, previous: Data | undefined, operation: string) {
  if (doc._status === "published" && previous?._status !== "published") return "Published";
  if (doc.workflowStatus === "published") return "Published";
  if (operation === "create") return "Created";
  if (doc.workflowStatus !== previous?.workflowStatus && !(doc.workflowStatus === "draft" && previous?.workflowStatus === "published")) {
    return doc.workflowStatus === "approved" ? "Approved" : doc.workflowStatus === "pending" ? "Submitted for approval" : "Returned to draft";
  }
  return "Saved draft";
}

export const auditAfterChange =
  (resource: Resource, titleField = "title"): CollectionAfterChangeHook =>
  async ({ doc, previousDoc, req, operation, context }) => {
    if ((context as Ctx)?.seed) return doc;
    const action = actionFor(doc as Data, previousDoc as Data, operation);
    await record(req, { resource, docId: String(doc.id), title: String(doc[titleField] ?? doc.id), status: String(doc.workflowStatus ?? doc._status ?? ""), action });
    if (doc._status === "published" || !("_status" in doc)) await revalidate();
    return doc;
  };

export const auditGlobalAfterChange =
  (resource: Resource, label: string): GlobalAfterChangeHook =>
  async ({ doc, previousDoc, req, context }) => {
    if ((context as Ctx)?.seed) return doc;
    const action = actionFor(doc as Data, previousDoc as Data, "update");
    await record(req as never, { resource, docId: resource, title: label, status: String(doc.workflowStatus ?? ""), action });
    if (doc._status === "published") await revalidate();
    return doc;
  };

export const auditAfterDelete =
  (resource: Resource, titleField = "title") =>
  async ({ doc, req }: { doc: Record<string, unknown>; req: Parameters<CollectionAfterChangeHook>[0]["req"] }) => {
    await record(req, { resource, docId: String(doc.id), title: String(doc[titleField] ?? doc.id), status: "deleted", action: "Deleted" });
    await revalidate();
  };
