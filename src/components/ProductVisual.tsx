/* eslint-disable @next/next/no-img-element */
import type { Product } from "@/data/products";

/** Product screenshot in a browser frame, or a branded preview card when no image is uploaded. */
export function ProductVisual({ p, size = "lg" }: { p: Product; size?: "lg" | "sm" }) {
  const host = p.href.startsWith("http") ? new URL(p.href).host.replace(/^www\./, "") : "redblink.com";
  return (
    <div className={`pv pv-${size} pv-${p.accent}`} aria-hidden={!p.image}>
      <div className="pv-bar"><span className="pv-dots"><i /><i /><i /></span><span className="pv-url">{host}</span></div>
      {p.image ? (
        <img src={p.image} alt={`${p.name} screenshot`} className="pv-img" loading="lazy" />
      ) : (
        <div className="pv-body">
          <div className="pv-brand"><span className="pv-mono">{p.name.replace(/[^A-Za-z0-9]/g, "").slice(0, 2)}</span><span><b>{p.name}</b><small>{p.kind}</small></span></div>
          <p className="pv-tag">{p.tagline}</p>
          <ul className="pv-list">
            {p.features.slice(0, 3).map((f, i) => (
              <li key={f.title} style={{ animationDelay: `${0.2 + i * 0.15}s` }}><span className="pv-check">✓</span>{f.title}</li>
            ))}
          </ul>
          <div className="pv-bars"><span style={{ width: "72%" }} /><span style={{ width: "48%" }} /><span style={{ width: "86%" }} /></div>
        </div>
      )}
    </div>
  );
}
