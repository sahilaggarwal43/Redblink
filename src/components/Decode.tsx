"use client";
import { useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>_#";

/** Text that "decodes" from random glyphs into the final copy, like a model resolving an answer. */
export function Decode({ text, delay = 0, duration = 900, className }: { text: string; delay?: number; duration?: number; className?: string }) {
  const [out, setOut] = useState(text);
  const started = useRef(false);
  useEffect(() => {
    if (started.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    started.current = true;
    let raf = 0;
    const t0 = performance.now() + delay;
    const tick = (now: number) => {
      const p = Math.max(0, (now - t0) / duration);
      const n = Math.floor(p * text.length);
      setOut(text.split("").map((ch, i) => (i < n || ch === " " ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0])).join(""));
      if (p < 1) raf = requestAnimationFrame(tick); else setOut(text);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, delay, duration]);
  return <span className={className} aria-label={text}><span aria-hidden="true">{out}</span></span>;
}

/** Decodes every section label (.kicker) the first time it scrolls into view. Mounted once in the layout. */
export function DecodeKickers() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const run = (el: HTMLElement) => {
      const text = el.textContent || "";
      if (!text.trim() || el.dataset.decoded) return;
      el.dataset.decoded = "1";
      const t0 = performance.now();
      const dur = Math.min(900, 300 + text.length * 25);
      const tick = (now: number) => {
        const p = (now - t0) / dur;
        const n = Math.floor(p * text.length);
        el.textContent = text.split("").map((ch, i) => (i < n || ch === " " ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0])).join("");
        if (p < 1) requestAnimationFrame(tick); else el.textContent = text;
      };
      requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { run(e.target as HTMLElement); io.unobserve(e.target); } }), { rootMargin: "-10% 0px" });
    const observe = () => document.querySelectorAll<HTMLElement>(".kicker:not([data-decoded])").forEach((el) => io.observe(el));
    observe();
    const mo = new MutationObserver(observe);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); };
  }, []);
  return null;
}

const SPOT = ".on-dark, .hero-ai, .page-hero, .cta, .card, .svc, .cap, .person, .ind-tile, .prod, .related a, .cat-links a, .model, .console, .flow, .grid-2 > *, .grid-3 > *";

/**
 * Site-wide micro-interactions, mounted once in the layout:
 * a cursor-following glow on cards and dark sections, and magnetic primary buttons.
 */
export function DarkSpotlight() {
  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let mag: HTMLElement | null = null;
    const onMove = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      let el = t?.closest?.(SPOT) as HTMLElement | null;
      while (el) {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
        el = el.parentElement?.closest?.(SPOT) as HTMLElement | null;
      }
      if (reduce) return;
      const b = t?.closest?.(".btn-red, .btn-light, .aip-send") as HTMLElement | null;
      if (mag && mag !== b) { mag.style.transform = ""; mag = null; }
      if (b) {
        const r = b.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.18, y = (e.clientY - r.top - r.height / 2) * 0.28;
        b.style.transform = `translate(${x}px, ${y}px)`;
        mag = b;
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  return null;
}
