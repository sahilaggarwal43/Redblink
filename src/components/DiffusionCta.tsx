"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Phone } from "lucide-react";
import { site } from "@/data/site";

/**
 * CTA whose headline is "generated" like a diffusion model: particles start as noise
 * and are denoised into the words. The cursor adds noise back in.
 */
const DEFAULT_LINES = ["Let's build", "what's next."];

export function DiffusionCta({ lines = DEFAULT_LINES, body }: { lines?: string[]; body?: string }) {
  const key = lines.join("\n");
  const ref = useRef<HTMLCanvasElement>(null);
  const [step, setStep] = useState(50);

  useEffect(() => {
    const canvas = ref.current, ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const red = getComputedStyle(document.documentElement).getPropertyValue("--red").trim() || "#ed1c24";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let parts: { tx: number; ty: number; nx: number; ny: number; hot: boolean; s: number }[] = [];
    let w = 0, h = 0, raf = 0, start = 0, visible = false, lastStep = 50;
    const mouse = { x: -1e4, y: -1e4 };
    const local = new Map<number, number>();

    const build = async () => {
      await document.fonts?.ready;
      const r = canvas.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
      w = r.width; h = r.height; canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const W = Math.floor(w), H = Math.floor(h);
      const off = document.createElement("canvas"); off.width = W; off.height = H;
      const o = off.getContext("2d")!;
      const fs = Math.min(w / (Math.max(...lines.map((l) => l.length)) * 0.56), h / (lines.length * 1.15));
      o.font = `700 ${fs}px "Plus Jakarta Sans Variable", "Plus Jakarta Sans", sans-serif`;
      o.textBaseline = "top"; o.fillStyle = "#000";
      lines.forEach((l, i) => o.fillText(l, 0, i * fs * 1.08 + fs * 0.05));
      const data = o.getImageData(0, 0, W, H).data;
      const gap = w < 600 ? 3 : 4;
      parts = [];
      for (let y = 0; y < H; y += gap) for (let x = 0; x < W; x += gap) {
        if (data[(y * W + x) * 4 + 3] > 128) parts.push({ tx: x, ty: y, nx: Math.random() * w, ny: Math.random() * h, hot: y > fs * 1.05, s: Math.random() });
      }
    };

    const frame = (now: number) => {
      ctx.clearRect(0, 0, w, h);
      const t = start ? Math.min(1, (now - start) / 2600) : 0;
      const sigma = Math.pow(1 - t, 2.2); // noise schedule
      const st = Math.round(sigma * 50);
      if (st !== lastStep) { lastStep = st; setStep(st); }
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        const dm = Math.hypot(p.tx - mouse.x, p.ty - mouse.y);
        let l = local.get(i) || 0;
        if (dm < 70) l = Math.min(1, l + 0.18);
        l *= 0.94; if (l < 0.01) local.delete(i); else local.set(i, l);
        const s = Math.min(1, sigma + l);
        const jitter = s * 3 * Math.sin(now / 200 + p.s * 20);
        const x = p.tx + (p.nx - p.tx) * s + jitter, y = p.ty + (p.ny - p.ty) * s - jitter;
        ctx.fillStyle = p.hot ? red : "#fff";
        ctx.globalAlpha = 0.35 + (1 - s) * 0.65;
        ctx.fillRect(x, y, 2, 2);
      }
      ctx.globalAlpha = 1;
      if (visible && !reduce) raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => { const r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; };
    const onLeave = () => { mouse.x = mouse.y = -1e4; };
    build().then(() => { if (reduce) { start = -1e9; frame(performance.now()); } });
    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      if (visible) { if (!start) start = performance.now(); cancelAnimationFrame(raf); raf = requestAnimationFrame(frame); }
    }, { threshold: 0.35 });
    io.observe(canvas);
    const ro = new ResizeObserver(() => build()); ro.observe(canvas);
    canvas.addEventListener("pointermove", onMove); canvas.addEventListener("pointerleave", onLeave);
    return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); canvas.removeEventListener("pointermove", onMove); canvas.removeEventListener("pointerleave", onLeave); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return (
    <section className="section" aria-labelledby="diff-title">
      <div className="container">
        <div className="diff">
          <div className="diff-meta" aria-hidden="true"><span className="diff-dot" /> {step > 0 ? `Denoising, step ${step}` : "Generated"}<span className="diff-hint">Move your cursor over the words</span></div>
          <h2 id="diff-title" className="sr-only">{lines.join(" ")}</h2>
          <canvas ref={ref} className="diff-canvas" aria-hidden="true" />
          <div className="diff-foot">
            <p>{body || "Book a free 30-minute consultation with a senior engineer. You'll leave with an honest view of what's feasible, what it costs and how fast it can ship."}</p>
            <div className="cta-actions">
              <Link href="/contact/" className="btn btn-red">Book a consultation <ArrowRight size={18} /></Link>
              <a href={site.phoneHref} className="btn btn-ghost"><Phone size={18} /> {site.phone}</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
