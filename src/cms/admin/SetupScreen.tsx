import type { Check } from "../diagnose";

/** Shown at /admin when the CMS can't start, explaining exactly what to fix. */
export function SetupScreen({ checks, standalone = true }: { checks: Check[]; standalone?: boolean }) {
  const body = (
    <main style={{ fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif", maxWidth: 720, margin: "64px auto", padding: "0 24px", color: "#15171c" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/official-logo.png" alt="RedBlink" style={{ height: 52 }} />
      <h1 style={{ fontSize: 28, margin: "32px 0 8px" }}>The CMS isn&rsquo;t ready yet</h1>
      <p style={{ color: "#474c57", lineHeight: 1.6, margin: 0 }}>The public website is working. The admin needs the items below before it can start. Fix any red item in Vercel, then redeploy.</p>
      <ul style={{ listStyle: "none", padding: 0, margin: "28px 0", border: "1px solid #e2e3e7" }}>
        {checks.map((c) => (
          <li key={c.label} style={{ display: "grid", gridTemplateColumns: "28px 1fr", gap: 12, padding: "16px 18px", borderBottom: "1px solid #e2e3e7" }}>
            <span style={{ width: 22, height: 22, display: "grid", placeItems: "center", color: "#fff", fontSize: 13, fontWeight: 700, background: c.ok ? "#16a34a" : c.level === "warn" ? "#d97706" : "#ff352c" }}>{c.ok ? "✓" : c.level === "warn" ? "!" : "✕"}</span>
            <span><strong style={{ display: "block" }}>{c.label}</strong><span style={{ color: "#474c57", fontSize: 14 }}>{c.detail}</span></span>
          </li>
        ))}
      </ul>
      <p style={{ color: "#757b87", fontSize: 14 }}>Machine-readable status: <code>/api/cms-status/</code></p>
    </main>
  );
  if (!standalone) return body;
  return (
    <html lang="en">
      <head><title>CMS setup | RedBlink</title><meta name="robots" content="noindex" /></head>
      <body style={{ margin: 0, background: "#fff" }}>{body}</body>
    </html>
  );
}
