import { services } from "@/data/services";
import { matchServices } from "@/lib/match";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Simple per-IP throttle (per server instance) to keep costs predictable.
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 8;
}

const SYSTEM = `You are the solution architect at RedBlink, a US AI software engineering company headquartered in Danville, California.
A prospective client describes a business problem. Reply with a short, concrete solution outline in plain text, no markdown symbols other than "- " for list items.
Format exactly:
<one sentence restating the opportunity in business terms>
How we'd approach it:
- <step 1, specific to their problem, mention systems/data involved>
- <step 2>
- <step 3>
Typical timeline: <realistic range, e.g. "2-week paid discovery, then 6-10 weeks to production">
Keep it under 110 words. Be specific and practical, never hype. Do not invent prices or client names.
Where relevant, name these RedBlink services exactly as written: ${services.map((s) => s.title).join(", ")}.`;

function outline(prompt: string) {
  const [a, b, c] = matchServices(prompt, 3);
  return [
    `The best starting point is ${a.title}. ${a.short}`,
    "How we'd approach it:",
    `- Map the current workflow, the systems involved and the data you already have, then agree the result worth paying for.`,
    `- Build a working ${a.capabilities[0]?.t.toLowerCase() || "prototype"} on your real data${b ? `, supported by ${b.title}` : ""}, and measure accuracy, speed and cost per task.`,
    `- Harden it for production${c ? ` with ${c.title}` : ""}: integrations, guardrails, human approval for risky actions and monitoring.`,
    "Typical timeline: a 2-week paid discovery, then 6 to 12 weeks to production depending on integrations.",
  ].join("\n");
}

function streamText(text: string) {
  const enc = new TextEncoder();
  const words = text.split(/(\s+)/);
  return new ReadableStream({
    async start(ctrl) {
      for (const w of words) {
        ctrl.enqueue(enc.encode(w));
        await new Promise((r) => setTimeout(r, w.trim() ? 28 : 0));
      }
      ctrl.close();
    },
  });
}

export async function POST(req: Request) {
  let prompt = "";
  try {
    prompt = String((await req.json())?.prompt || "").trim().slice(0, 600);
  } catch { /* fallthrough */ }
  if (prompt.length < 4) return new Response("Tell us a little more about the problem.", { status: 400 });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  const headers = { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store", "X-Matched": matchServices(prompt, 3).map((s) => s.slug).join(",") };
  if (limited(ip)) return new Response(streamText(outline(prompt)), { headers });

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return new Response(streamText(outline(prompt)), { headers });

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || "claude-haiku-4-5-20251001",
        max_tokens: 400,
        stream: true,
        system: SYSTEM,
        messages: [{ role: "user", content: prompt }],
      }),
      signal: AbortSignal.timeout(25_000),
    });
    if (!r.ok || !r.body) throw new Error(`Upstream ${r.status}`);

    const enc = new TextEncoder();
    const dec = new TextDecoder();
    const reader = r.body.getReader();
    const stream = new ReadableStream({
      async start(ctrl) {
        let buf = "";
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += dec.decode(value, { stream: true });
          const events = buf.split("\n\n");
          buf = events.pop() || "";
          for (const ev of events) {
            const line = ev.split("\n").find((l) => l.startsWith("data: "));
            if (!line) continue;
            try {
              const j = JSON.parse(line.slice(6));
              if (j.type === "content_block_delta" && j.delta?.text) ctrl.enqueue(enc.encode(j.delta.text.replace(/\*\*/g, "")));
            } catch { /* ignore keep-alives */ }
          }
        }
        ctrl.close();
      },
    });
    return new Response(stream, { headers: { ...headers, "X-Source": "ai" } });
  } catch {
    return new Response(streamText(outline(prompt)), { headers });
  }
}
