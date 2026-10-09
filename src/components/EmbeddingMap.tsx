"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { industries as staticIndustries } from "@/data/site";

// Cluster centres in normalised space (0..1)
const centres: [number, number][] = [[0.2, 0.28], [0.47, 0.18], [0.78, 0.26], [0.86, 0.62], [0.62, 0.78], [0.33, 0.8], [0.12, 0.6], [0.5, 0.5]];

/**
 * Industries plotted as clusters in an embedding space. A query point searches for its
 * nearest neighbours, and hovering a cluster lights it up.
 */
export function EmbeddingMap({ industries = staticIndustries }: { industries?: { id: string; name: string; examples: string[] }[] }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const userRef = useRef(false);
  activeRef.current = active;
  const list = industries.slice(0, 8);

  useEffect(() => {
    const canvas = ref.current, ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const red = getComputedStyle(document.documentElement).getPropertyValue("--red").trim() || "#ed1c24";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rnd = (s: number) => { const x = Math.sin(s * 9301 + 49297) * 233280; return x - Math.floor(x); };
    const gauss = (s: number) => (rnd(s) + rnd(s + 1) + rnd(s + 2) - 1.5) * 0.9;
    const pts = centres.flatMap(([cx, cy], k) => Array.from({ length: 46 }, (_, i) => ({ k, x: cx + gauss(k * 100 + i) * 0.085, y: cy + gauss(k * 100 + i + 50) * 0.085, ph: rnd(k * 7 + i) * 6.28 })));
    const noise = Array.from({ length: 70 }, (_, i) => ({ k: -1, x: rnd(i + 999), y: rnd(i + 1999), ph: rnd(i) * 6.28 }));
    const all = [...pts, ...noise];
    const q = { x: 0.5, y: 0.5 };
    let w = 0, h = 0, raf = 0, visible = true;

    const resize = () => {
      const r = canvas.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
      w = r.width; h = r.height; canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const draw = (now: number) => {
      const a = activeRef.current, [tx, ty] = centres[a];
      q.x += (tx - q.x) * 0.045; q.y += (ty - q.y) * 0.045;
      ctx.clearRect(0, 0, w, h);
      // grid
      ctx.strokeStyle = "rgba(21,23,28,.05)"; ctx.lineWidth = 1;
      for (let gx = 0; gx <= 10; gx++) { ctx.beginPath(); ctx.moveTo((gx / 10) * w, 0); ctx.lineTo((gx / 10) * w, h); ctx.stroke(); }
      for (let gy = 0; gy <= 7; gy++) { ctx.beginPath(); ctx.moveTo(0, (gy / 7) * h); ctx.lineTo(w, (gy / 7) * h); ctx.stroke(); }
      const qx = q.x * w, qy = q.y * h;
      // nearest neighbours of the query point
      const near = pts.filter((p) => p.k === a).map((p) => ({ p, d: Math.hypot(p.x * w - qx, p.y * h - qy) })).sort((m, n) => m.d - n.d).slice(0, 7);
      ctx.setLineDash([3, 4]); ctx.strokeStyle = red; ctx.globalAlpha = 0.55;
      for (const { p } of near) {
        const px = (p.x + Math.sin(now / 1500 + p.ph) * 0.004) * w, py = (p.y + Math.cos(now / 1700 + p.ph) * 0.004) * h;
        ctx.beginPath(); ctx.moveTo(qx, qy); ctx.lineTo(px, py); ctx.stroke();
      }
      ctx.setLineDash([]); ctx.globalAlpha = 1;
      for (const p of all) {
        const px = (p.x + Math.sin(now / 1500 + p.ph) * 0.004) * w, py = (p.y + Math.cos(now / 1700 + p.ph) * 0.004) * h;
        const on = p.k === a;
        ctx.fillStyle = on ? red : p.k < 0 ? "rgba(21,23,28,.12)" : "rgba(21,23,28,.28)";
        ctx.beginPath(); ctx.arc(px, py, on ? 3.2 : 2.2, 0, Math.PI * 2); ctx.fill();
      }
      // query point
      const pulse = 0.5 + 0.5 * Math.sin(now / 300);
      ctx.strokeStyle = red; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.35 + pulse * 0.3;
      ctx.beginPath(); ctx.arc(qx, qy, 14 + pulse * 6, 0, Math.PI * 2); ctx.stroke(); ctx.globalAlpha = 1;
      ctx.fillStyle = "#15171c"; ctx.beginPath(); ctx.arc(qx, qy, 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(qx, qy, 2.4, 0, Math.PI * 2); ctx.fill();
      if (!reduce && visible) raf = requestAnimationFrame(draw);
    };
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect(), mx = (e.clientX - r.left) / r.width, my = (e.clientY - r.top) / r.height;
      let best = 0, bd = 9;
      centres.forEach(([cx, cy], k) => { const d = Math.hypot(cx - mx, cy - my); if (d < bd) { bd = d; best = k; } });
      if (bd < 0.16) { userRef.current = true; setActive(best); }
    };
    resize();
    const ro = new ResizeObserver(() => { resize(); if (reduce) draw(0); }); ro.observe(canvas);
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible && !reduce) { cancelAnimationFrame(raf); raf = requestAnimationFrame(draw); } }); io.observe(canvas);
    canvas.addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(draw);
    const cycle = setInterval(() => { if (!userRef.current) setActive((x) => (x + 1) % centres.length); }, 3000);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); canvas.removeEventListener("pointermove", onMove); clearInterval(cycle); };
  }, []);

  const ind = list[active];
  return (
    <div className="emb">
      <div className="emb-plot">
        <canvas ref={ref} aria-hidden="true" />
        {list.map((x, k) => (
          <button key={x.id} className={`emb-label ${k === active ? "on" : ""}`} style={{ left: `${centres[k][0] * 100}%`, top: `${centres[k][1] * 100}%` }} onMouseEnter={() => { userRef.current = true; setActive(k); }} onFocus={() => setActive(k)} onClick={() => setActive(k)}>
            {x.name}
          </button>
        ))}
        <span className="emb-axis x">dim 1</span><span className="emb-axis y">dim 2</span>
      </div>
      <div className="emb-panel" aria-live="polite">
        <span className="emb-q">Query: &ldquo;AI use cases for my business&rdquo;</span>
        <AnimatePresence mode="wait">
          <motion.div key={ind.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
            <h3>{ind.name}</h3>
            <ul>{ind.examples.map((e, i) => <li key={e}><span className="emb-sim">{(0.94 - i * 0.05).toFixed(2)}</span>{e}</li>)}</ul>
            <Link href={`/industries/#${ind.id}`} className="link-arrow">Explore {ind.name} <ArrowRight size={16} /></Link>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
