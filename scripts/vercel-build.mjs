// Vercel build: sync brand assets, apply database migrations when the CMS is configured, then build.
import { execSync } from "node:child_process";

const run = (cmd) => execSync(cmd, { stdio: "inherit", env: process.env });
const db = process.env.DATABASE_URI || process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL;

run("node scripts/fetch-brand.mjs");
if (db && process.env.PAYLOAD_SECRET) {
  process.env.DATABASE_URI = db;
  console.log("[build] CMS database configured: applying migrations");
  run("npx payload migrate");
} else {
  console.log(`[build] CMS not configured (${!db ? "no database URL" : "no PAYLOAD_SECRET"}): building with built-in content.`);
}
run("npx next build");
