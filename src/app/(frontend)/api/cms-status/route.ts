import { diagnose } from "@/cms/diagnose";

export const dynamic = "force-dynamic";

export async function GET() {
  const r = await diagnose();
  return Response.json(r, { status: r.ok ? 200 : 503, headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } });
}
