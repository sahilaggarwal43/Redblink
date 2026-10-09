import { NextResponse } from "next/server";

// Validates the contact form and forwards it to CONTACT_WEBHOOK_URL (Zapier, Make, Slack, HubSpot, n8n...).
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
  if (body.website) return NextResponse.json({ ok: true }); // honeypot: silently accept bots
  const name = String(body.name || "").trim().slice(0, 200);
  const email = String(body.email || "").trim().slice(0, 200);
  const message = String(body.message || "").trim().slice(0, 5000);
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 10) {
    return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 422 });
  }
  const payload = {
    name, email, message,
    company: String(body.company || "").slice(0, 200),
    phone: String(body.phone || "").slice(0, 50),
    interests: Array.isArray(body.interests) ? body.interests.slice(0, 20) : [],
    budget: String(body.budget || ""),
    source: String(body.source || ""),
    page: String(body.page || ""),
    receivedAt: new Date().toISOString(),
    // Slack-compatible summary line
    text: `New RedBlink lead: ${name} <${email}>${body.company ? ` (${body.company})` : ""}, budget ${body.budget || "n/a"}\n${message}`,
  };
  const hook = process.env.CONTACT_WEBHOOK_URL;
  if (hook) {
    try {
      const r = await fetch(hook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!r.ok) throw new Error(String(r.status));
    } catch (e) {
      console.error("Contact webhook failed", e);
      return NextResponse.json({ ok: false, error: "Delivery failed" }, { status: 502 });
    }
  } else {
    console.log("[contact] CONTACT_WEBHOOK_URL not set. Lead:", payload);
  }
  return NextResponse.json({ ok: true });
}
