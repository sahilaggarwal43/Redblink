import type { CollectionConfig, Field } from "payload";
import { guarded, seoGroup } from "./fields";
import { resourceAccess, type Resource } from "./permissions";
import { auditAfterChange, auditAfterDelete, workflowBeforeChange, workflowFields } from "./workflow";
import { previewUrl } from "./preview";

type Opts = {
  slug: string;
  resource: Resource;
  labels: { singular: string; plural: string };
  titleField: string;
  fields: Field[];
  group: string;
  seo?: boolean;
  scoped?: boolean;
  path?: (doc: Record<string, unknown>) => string;
  defaultColumns?: string[];
  description?: string;
  orderable?: boolean;
};

/** A content type with drafts, version history, document locking, approval workflow, audit log and preview. */
export function contentCollection(o: Opts): CollectionConfig {
  return {
    slug: o.slug,
    labels: o.labels,
    orderable: o.orderable,
    admin: {
      useAsTitle: o.titleField,
      group: o.group,
      description: o.description,
      defaultColumns: o.defaultColumns ?? [o.titleField, "workflowStatus", "_status", "updatedAt"],
      ...(o.path ? { preview: (doc) => previewUrl(o.path!(doc as Record<string, unknown>)) } : {}),
    },
    access: resourceAccess(o.resource, { drafts: true, scoped: o.scoped }),
    versions: { drafts: { autosave: false, validate: false }, maxPerDoc: 100 },
    lockDocuments: { duration: 600 },
    fields: [...guarded(o.resource, o.fields), ...(o.seo ? [seoGroup(o.resource)] : []), ...workflowFields],
    hooks: {
      beforeChange: [
        ...(o.slug === "pages" && o.path ? [({ data }: { data: Record<string, unknown> }) => ({ ...data, path: o.path!(data) })] : []),
        workflowBeforeChange(o.resource),
      ],
      afterChange: [auditAfterChange(o.resource, o.titleField)],
      afterDelete: [auditAfterDelete(o.resource, o.titleField)],
    },
  };
}
