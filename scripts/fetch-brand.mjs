// Pulls the official RedBlink logo, favicon, brand red and team photos from the live
// WordPress site into this project. Runs automatically before every build (see "prebuild" in package.json)
// and is skipped once the files exist. Force a refresh with: node scripts/fetch-brand.mjs --force
import { writeFile, readFile, mkdir, access } from "node:fs/promises";
import path from "node:path";
import { inflateSync } from "node:zlib";
import { readdir } from "node:fs/promises";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const SOURCE = process.env.BRAND_SOURCE_URL || "https://redblink.com/";
const BRAND_JSON = path.join(ROOT, "src/data/brand.json");
const PUBLIC_DIR = path.join(ROOT, "public/brand");
const force = process.argv.includes("--force");
const UA = { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 Chrome/126 Safari/537.36" };

const exists = (p) => access(p).then(() => true, () => false);
const get = async (url, as = "text") => {
  const r = await fetch(url, { headers: UA, signal: AbortSignal.timeout(10000), redirect: "follow" });
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return as === "text" ? r.text() : Buffer.from(await r.arrayBuffer());
};
const attr = (tag, name) => (tag.match(new RegExp(`\\s${name}=["']([^"']+)["']`, "i")) || [])[1];
const imgSrc = (tag) => {
  for (const a of ["data-lazy-src", "data-src", "src"]) {
    const v = attr(tag, a);
    if (v && !v.startsWith("data:")) return v;
  }
  const set = attr(tag, "data-lazy-srcset") || attr(tag, "srcset");
  return set ? set.split(",")[0].trim().split(" ")[0] : null;
};
const abs = (u) => new URL(u, SOURCE).href;
const extOf = (u) => (path.extname(new URL(u).pathname).toLowerCase() || ".png").replace(".jpeg", ".jpg");

function pngSize(buf) {
  if (buf.slice(1, 4).toString() !== "PNG") return null;
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}
function svgSize(buf) {
  const s = buf.toString("utf8", 0, 2000);
  const vb = s.match(/viewBox=["'][\d.\-]+[\s,]+[\d.\-]+[\s,]+([\d.]+)[\s,]+([\d.]+)/i);
  return vb ? { width: Math.round(+vb[1]), height: Math.round(+vb[2]) } : null;
}

// Average brightness of visible pixels (0 = black, 1 = white) and share of red pixels.
// Used to tell the coloured logo apart from white/inverted variants.
function pngTone(buf) {
  try {
    if (buf.slice(1, 4).toString() !== "PNG") return null;
    const w = buf.readUInt32BE(16), h = buf.readUInt32BE(20), depth = buf[24], type = buf[25], interlace = buf[28];
    if (depth !== 8 || interlace !== 0 || ![2, 6].includes(type)) return null;
    const bpp = type === 6 ? 4 : 3;
    const chunks = []; let o = 8, plte = null;
    while (o < buf.length) {
      const len = buf.readUInt32BE(o), t = buf.toString("ascii", o + 4, o + 8);
      if (t === "IDAT") chunks.push(buf.slice(o + 8, o + 8 + len));
      if (t === "IEND") break;
      o += 12 + len;
    }
    const raw = inflateSync(Buffer.concat(chunks)), stride = w * bpp, out = Buffer.alloc(h * stride);
    for (let y = 0; y < h; y++) {
      const f = raw[y * (stride + 1)], line = raw.slice(y * (stride + 1) + 1, (y + 1) * (stride + 1));
      for (let x = 0; x < stride; x++) {
        const a = x >= bpp ? out[y * stride + x - bpp] : 0, b = y ? out[(y - 1) * stride + x] : 0, c = x >= bpp && y ? out[(y - 1) * stride + x - bpp] : 0;
        let v = line[x];
        if (f === 1) v += a; else if (f === 2) v += b; else if (f === 3) v += (a + b) >> 1;
        else if (f === 4) { const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c); v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c; }
        out[y * stride + x] = v & 255;
      }
    }
    let lum = 0, n = 0, red = 0;
    for (let i = 0; i < out.length; i += bpp) {
      if (bpp === 4 && out[i + 3] < 128) continue;
      const r = out[i], g = out[i + 1], bl = out[i + 2];
      lum += (0.2126 * r + 0.7152 * g + 0.0722 * bl) / 255; n++;
      if (r > 150 && g < 90 && bl < 90) red++;
    }
    return n ? { lum: lum / n, red: red / n } : null;
  } catch { return null; }
}

// Most frequent strong red used across the site's HTML and CSS.
function pickRed(texts) {
  const counts = new Map();
  for (const t of texts) {
    for (const m of t.matchAll(/#([0-9a-f]{6})\b/gi)) {
      const hex = m[1].toLowerCase();
      const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
      if (r >= 170 && g <= 70 && b <= 80 && r - Math.max(g, b) >= 130) counts.set(hex, (counts.get(hex) || 0) + 1);
    }
  }
  const best = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
  return best ? `#${best[0]}` : null;
}

async function syncBrand() {
  const current = JSON.parse(await readFile(BRAND_JSON, "utf8"));
  // A logo file you drop into public/brand/ named "official-logo.(svg|png|webp)" always wins.
  const local = (await readdir(PUBLIC_DIR).catch(() => [])).find((f) => /^official-logo\.(svg|png|webp|jpe?g)$/i.test(f));
  if (local) {
    const buf = await readFile(path.join(PUBLIC_DIR, local));
    const size = local.endsWith(".png") ? pngSize(buf) : local.endsWith(".svg") ? svgSize(buf) : null;
    await writeFile(BRAND_JSON, JSON.stringify({ ...current, logo: `/brand/${local}`, width: size?.width || 0, height: size?.height || 0, source: "local file" }, null, 2) + "\n");
    console.log(`[brand] Using your file public/brand/${local} as the logo.`);
    if (!force) return;
  }
  if (!force && current.logo && (await exists(path.join(ROOT, "public", current.logo)))) {
    console.log("[brand] Logo already present, skipping.");
    return;
  }
  console.log(`[brand] Fetching brand assets from ${SOURCE}`);
  const html = await get(SOURCE);
  await mkdir(PUBLIC_DIR, { recursive: true });

  // Header logo: images inside the first link to the homepage that carry alt="Redblink".
  const links = [...html.matchAll(/<a[^>]+href=["']https?:\/\/(?:www\.)?redblink\.com\/?["'][^>]*>([\s\S]*?)<\/a>/gi)];
  const imgs = [];
  for (const l of links) {
    for (const t of l[1].match(/<img[^>]*>/gi) || []) {
      const src = imgSrc(t);
      if (src && /redblink/i.test(attr(t, "alt") || src)) imgs.push(abs(src));
    }
    if (imgs.length) break;
  }
  const unique = [...new Set(imgs)];
  if (!unique.length) throw new Error("Logo image not found in site header.");
  await mkdir(PUBLIC_DIR, { recursive: true });

  // Download every candidate and judge it by its pixels, not its position in the HTML.
  const cands = [];
  for (const u of unique) {
    try {
      const buf = await get(u, "buffer");
      const ext = extOf(u);
      const tone = ext === ".png" ? pngTone(buf) : null;
      const svgText = ext === ".svg" ? buf.toString("utf8") : "";
      const svgWhite = ext === ".svg" && /fill:?\s*["']?#?(fff\b|ffffff|white)/i.test(svgText) && !/#(?!fff)[0-9a-f]{3,6}/i.test(svgText.replace(/#fff(fff)?/gi, ""));
      const isLight = (tone && tone.lum > 0.82 && tone.red < 0.02) || svgWhite || /white|light|footer/i.test(u);
      cands.push({ u, buf, ext, tone, isLight });
      console.log(`[brand]   candidate ${u.split("/").pop()}  ${tone ? `brightness ${(tone.lum * 100).toFixed(0)}%, red ${(tone.red * 100).toFixed(0)}%` : ext}${isLight ? "  (light version)" : ""}`);
    } catch (e) { console.warn(`[brand]   skipped ${u} (${e.message})`); }
  }
  if (!cands.length) throw new Error("Could not download any logo candidate.");
  const coloured = cands.filter((c) => !c.isLight).sort((a, b) => (b.tone?.red || 0) - (a.tone?.red || 0));
  const primary = coloured[0] || cands[0];
  const light = cands.find((c) => c.isLight && c !== primary);

  const out = { ...current, source: SOURCE };
  const save = async (c, name) => {
    const file = `${name}${c.ext}`;
    await writeFile(path.join(PUBLIC_DIR, file), c.buf);
    return `/brand/${file}`;
  };
  out.logo = await save(primary, "redblink-logo");
  const size = primary.ext === ".png" ? pngSize(primary.buf) : primary.ext === ".svg" ? svgSize(primary.buf) : null;
  out.width = size?.width || 0;
  out.height = size?.height || 0;
  out.logoLight = light ? await save(light, "redblink-logo-light") : null;
  console.log(`[brand] Logo saved: ${out.logo}${out.logoLight ? ` (+ ${out.logoLight})` : ""}`);

  // Favicon / app icon.
  const iconHref =
    [...html.matchAll(/<link[^>]+rel=["'][^"']*(?:apple-touch-icon|icon)[^"']*["'][^>]*>/gi)]
      .map((m) => attr(m[0], "href"))
      .filter(Boolean)
      .sort((a, b) => (parseInt((b.match(/(\d+)x\d+/) || [])[1] || 0) - parseInt((a.match(/(\d+)x\d+/) || [])[1] || 0)))[0];
  if (iconHref) {
    try {
      const buf = await get(abs(iconHref), "buffer");
      if (pngSize(buf)) {
        await writeFile(path.join(ROOT, "src/app/icon.png"), buf);
        await writeFile(path.join(ROOT, "src/app/apple-icon.png"), buf);
        console.log("[brand] Favicon saved.");
      }
    } catch (e) {
      console.warn(`[brand] Favicon skipped: ${e.message}`);
    }
  }

  // Brand red from the site's own styles.
  const cssUrls = [...html.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]*>/gi)]
    .map((m) => attr(m[0], "href"))
    .filter((h) => h && /redblink\.com|^\//.test(h) && /theme|elementor|custom|style|post-\d+/i.test(h))
    .slice(0, 12);
  const css = await Promise.all(cssUrls.map((u) => get(abs(u)).catch(() => "")));
  out.red = pickRed([html, ...css]) || current.red;
  if (out.red) console.log(`[brand] Brand red: ${out.red}`);

  await writeFile(BRAND_JSON, JSON.stringify(out, null, 2) + "\n");
}

// ---------- Team photos ----------
const TEAM_JSON = path.join(ROOT, "src/data/team-photos.json");
const TEAM_DIR = path.join(ROOT, "public/team");
const slugify = (n) => n.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// Largest candidate from srcset, else the plain (or lazy-load) src.
function bestImg(tag) {
  const set = attr(tag, "data-lazy-srcset") || attr(tag, "data-srcset") || attr(tag, "srcset");
  if (set) {
    const best = set.split(",").map((x) => x.trim().split(/\s+/)).map(([u, w]) => [u, parseInt(w) || 0])
      .filter(([u]) => u && !u.startsWith("data:")).sort((a, b) => b[1] - a[1])[0];
    if (best) return best[0];
  }
  return imgSrc(tag);
}

async function syncTeam() {
  const teamSrc = await readFile(path.join(ROOT, "src/data/site.ts"), "utf8");
  const block = teamSrc.slice(teamSrc.indexOf("export const team"), teamSrc.indexOf("];", teamSrc.indexOf("export const team")));
  const names = [...block.matchAll(/name:\s*"([^"]+)"/g)].map((m) => m[1]);
  const current = JSON.parse(await readFile(TEAM_JSON, "utf8").catch(() => "{}"));
  const missing = [];
  for (const n of names) {
    const slug = slugify(n);
    if (force || !current[slug] || !(await exists(path.join(ROOT, "public", current[slug])))) missing.push([n, slug]);
  }
  if (!missing.length) { console.log("[team] All team photos present, skipping."); return; }
  await mkdir(TEAM_DIR, { recursive: true });

  // Photos linked from the About page: <a href=".../team/<slug>/"> ... <img> ... </a>
  const fromAbout = {};
  try {
    const about = await get(new URL("about-us/", SOURCE).href);
    for (const m of about.matchAll(/<a[^>]+href=["'][^"']*\/team\/([a-z0-9-]+)\/?["'][^>]*>([\s\S]*?)<\/a>/gi)) {
      const img = (m[2].match(/<img[^>]*>/i) || [])[0];
      const src = img && bestImg(img);
      if (src && !fromAbout[m[1]]) fromAbout[m[1]] = abs(src);
    }
  } catch (e) { console.warn(`[team] About page not readable (${e.message}).`); }

  let saved = 0;
  for (const [name, slug] of missing) {
    let url = fromAbout[slug];
    if (!url) {
      // Fall back to the member's profile page and its share image.
      try {
        const page = await get(new URL(`team/${slug}/`, SOURCE).href);
        const og = (page.match(/<meta[^>]+property=["']og:image["'][^>]*>/i) || [])[0];
        const u = og && attr(og, "content");
        if (u && !/logo|favicon|header/i.test(u)) url = abs(u);
        if (!url) {
          const img = (page.match(/<img[^>]+(?:wp-post-image|team|member)[^>]*>/i) || [])[0];
          if (img) url = abs(bestImg(img));
        }
      } catch { /* no profile page */ }
    }
    if (!url) { console.warn(`[team] No photo found for ${name}.`); continue; }
    try {
      const buf = await get(url, "buffer");
      const file = `${slug}${extOf(url)}`;
      await writeFile(path.join(TEAM_DIR, file), buf);
      current[slug] = `/team/${file}`;
      saved++;
    } catch (e) { console.warn(`[team] Could not download photo for ${name} (${e.message}).`); }
  }
  await writeFile(TEAM_JSON, JSON.stringify(current, null, 2) + "\n");
  console.log(`[team] Saved ${saved} of ${missing.length} team photos.`);
}

// Never block a build: anything that can't be fetched falls back gracefully
// (text wordmark, default red, initials instead of photos).
(async () => {
  await syncBrand().catch((e) => console.warn(`[brand] Could not fetch brand assets (${e.message}). Using fallback wordmark.`));
  await syncTeam().catch((e) => console.warn(`[team] Could not fetch team photos (${e.message}). Using initials.`));
})();
