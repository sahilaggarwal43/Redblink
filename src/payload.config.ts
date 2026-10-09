import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import sharp from "sharp";
import { Users } from "./cms/collections/Users";
import { Roles } from "./cms/collections/Roles";
import { Media } from "./cms/collections/Media";
import { AuditLog } from "./cms/collections/AuditLog";
import { Pages, Services, Products, Industries, Team, Testimonials, Faqs } from "./cms/collections/content";
import { Settings } from "./cms/globals/Settings";
import { seed } from "./cms/seed";
import { databaseUrl } from "./cms/env";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || "dev-only-change-me",
  routes: { admin: "/admin", api: "/cms-api", graphQL: "/cms-api/graphql", graphQLPlayground: "/cms-api/graphql-playground" },
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: " | RedBlink CMS", icons: [{ url: "/icon.png" }] },
    avatar: "default",
    components: { graphics: { Logo: "/cms/admin/Logo#Logo", Icon: "/cms/admin/Logo#Icon" }, beforeDashboard: ["/cms/admin/Welcome#Welcome"] },
  },
  collections: [Pages, Services, Products, Industries, Team, Testimonials, Faqs, Media, Users, Roles, AuditLog],
  globals: [Settings],
  editor: lexicalEditor(),
  db: postgresAdapter({
    pool: { connectionString: databaseUrl() },
    migrationDir: path.resolve(dirname, "migrations"),
    push: false,
  }),
  sharp,
  plugins: [
    vercelBlobStorage({
      enabled: !!process.env.BLOB_READ_WRITE_TOKEN,
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN || "",
    }),
  ],
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
  graphQL: { disable: true },
  telemetry: false,
  onInit: async (payload) => {
    if (process.env.CMS_SKIP_SEED === "1") return;
    await seed(payload).catch((e) => payload.logger.error(`Seed failed: ${(e as Error).message}`));
  },
});
