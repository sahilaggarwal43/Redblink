import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import brand from "@/data/brand.json";

export const alt = "RedBlink, enterprise AI software engineering";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  const red = brand.red || "#ff352c";
  let logo: string | null = null;
  if (brand.logo) {
    try {
      const buf = await readFile(path.join(process.cwd(), "public", brand.logo));
      logo = `data:image/${brand.logo.endsWith(".svg") ? "svg+xml" : "png"};base64,${buf.toString("base64")}`;
    } catch { /* fall back to text */ }
  }
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 80, background: "#ffffff", color: "#15171c", borderLeft: `18px solid ${red}` }}>
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo} width={brand.width ? 420 : 420} height={brand.width ? Math.round((420 * brand.height) / brand.width) : 92} alt="" />
        ) : (
          <div style={{ display: "flex", fontSize: 48, fontWeight: 700 }}><span style={{ color: red }}>Red</span>Blink</div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ fontSize: 82, fontWeight: 700, lineHeight: 1.02, letterSpacing: -2 }}>Enterprise AI, engineered for production.</div>
          <div style={{ fontSize: 30, color: "#5b606b" }}>AI agents, LLM applications and custom software. Danville, California.</div>
        </div>
      </div>
    ),
    size
  );
}
