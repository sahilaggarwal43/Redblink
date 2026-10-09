import { databaseUrl } from "./env";

export type Check = { label: string; ok: boolean; level?: "error" | "warn"; detail: string };

/** Plain-language health checks for the CMS. Never returns secrets or connection strings. */
export async function diagnose(): Promise<{ ok: boolean; checks: Check[] }> {
  const checks: Check[] = [];
  const url = databaseUrl();
  const secret = process.env.PAYLOAD_SECRET || "";

  checks.push({ label: "Database connection string", ok: !!url, detail: url ? "Found." : "Missing. Add Neon Postgres under Vercel → Storage (it sets DATABASE_URL), or set DATABASE_URI yourself." });
  checks.push({ label: "PAYLOAD_SECRET", ok: secret.length >= 16, detail: secret ? (secret.length >= 16 ? "Set." : "Too short. Use at least 32 random characters.") : "Missing. Add a long random string in Vercel → Settings → Environment Variables." });

  if (url) {
    let client: import("pg").Client | null = null;
    try {
      const pg = (await import("pg")).default;
      const c = new pg.Client({ connectionString: url, connectionTimeoutMillis: 6000, ssl: /localhost|127\.0\.0\.1/.test(url) ? undefined : { rejectUnauthorized: false } });
      client = c;
      await c.connect();
      checks.push({ label: "Database reachable", ok: true, detail: "Connected." });
      const t = await c.query("select to_regclass('public.payload_migrations') as m, to_regclass('public.users') as u, to_regclass('public.pages') as p");
      const row = t.rows[0] || {};
      const tables = !!row.m && !!row.u && !!row.p;
      checks.push({
        label: "Database tables",
        ok: tables,
        detail: tables ? "Created." : "Not created yet. Redeploy so the build runs `payload migrate` (vercel.json must use `npm run vercel-build`).",
      });
      if (tables) {
        const users = await c.query("select count(*)::int as n from users");
        const n = Number(users.rows[0]?.n || 0);
        checks.push({
          label: "Administrator account",
          ok: n > 0 || (!!process.env.ADMIN_EMAIL && !!process.env.ADMIN_PASSWORD),
          level: "warn",
          detail: n > 0 ? `${n} user${n === 1 ? "" : "s"}.` : process.env.ADMIN_EMAIL ? "Will be created from ADMIN_EMAIL on first load." : "No users yet. You'll be asked to create the first account (it becomes Administrator).",
        });
      }
    } catch (e) {
      const msg = String((e as Error).message || "");
      const why = /password authentication|auth/i.test(msg) ? "the username or password in the connection string was rejected"
        : /ENOTFOUND|getaddrinfo/i.test(msg) ? "the database host name couldn't be found"
        : /timeout|ETIMEDOUT|ECONNREFUSED/i.test(msg) ? "the database didn't respond"
        : /does not exist/i.test(msg) ? "the database name doesn't exist"
        : "the connection failed";
      checks.push({ label: "Database reachable", ok: false, detail: `No: ${why}. Check the connection string in Vercel's environment variables.` });
    } finally {
      await client?.end().catch(() => {});
    }
  }

  checks.push({
    label: "Image storage (Vercel Blob)",
    ok: !!process.env.BLOB_READ_WRITE_TOKEN,
    level: "warn",
    detail: process.env.BLOB_READ_WRITE_TOKEN ? "Connected." : "Not connected. The CMS works, but uploaded images won't be kept on Vercel. Add a Blob store under Vercel → Storage.",
  });

  return { ok: checks.every((c) => c.ok || c.level === "warn"), checks };
}

/** True when Payload can start and query the database, so the admin can render safely. */
export async function cmsReady(): Promise<boolean> {
  try {
    const [{ getPayload }, config] = await Promise.all([import("payload"), import("@payload-config").then((m) => m.default)]);
    const payload = await getPayload({ config });
    await payload.count({ collection: "users", overrideAccess: true });
    return true;
  } catch (e) {
    console.error("[admin] CMS not ready:", (e as Error).message);
    return false;
  }
}
