"use client";
import { useEffect, useRef } from "react";

type Mode = "idle" | "thinking";

/**
 * A rotating 3D neural network drawn on a 2D canvas (no WebGL needed).
 * Nodes sit on a sphere, nearest neighbours are wired together, and red signals
 * travel along the connections. The network tilts toward the cursor and speeds up
 * and fires more signals while the AI is "thinking".
 */
export function NeuralSphere({ mode = "idle" }: { mode?: Mode }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const modeRef = useRef<Mode>(mode);
  modeRef.current = mode;

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const red = getComputedStyle(document.documentElement).getPropertyValue("--red").trim() || "#ed1c24";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Build the network once
    const N = window.innerWidth < 700 ? 220 : 380;
    const pts: { x: number; y: number; z: number; hub: boolean; phase: number }[] = [];
    const ga = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = ga * i;
      const j = 1 + (Math.random() - 0.5) * 0.08;
      pts.push({ x: Math.cos(th) * r * j, y: y * j, z: Math.sin(th) * r * j, hub: Math.random() < 0.07, phase: Math.random() * Math.PI * 2 });
    }
    const edges: [number, number][] = [];
    const seen = new Set<string>();
    for (let i = 0; i < N; i++) {
      const d = pts.map((p, k) => [k, (p.x - pts[i].x) ** 2 + (p.y - pts[i].y) ** 2 + (p.z - pts[i].z) ** 2] as [number, number]).sort((a, b) => a[1] - b[1]);
      for (let k = 1; k <= 3; k++) {
        const a = Math.min(i, d[k][0]), b = Math.max(i, d[k][0]);
        const key = `${a}-${b}`;
        if (!seen.has(key)) { seen.add(key); edges.push([a, b]); }
      }
    }
    const pulses: { e: number; t: number; dir: 1 | -1; speed: number }[] = [];

    let w = 0, h = 0, raf = 0, rotY = 0, rotX = -0.25, visible = true, last = performance.now();
    const tilt = { x: 0, y: 0, tx: 0, ty: 0 };
    const mouse = { x: -1e4, y: -1e4 };
    const proj = new Float32Array(N * 3);

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const frame = (now: number) => {
      const dt = Math.min(50, now - last) / 16.67; last = now;
      const thinking = modeRef.current === "thinking";
      tilt.x += (tilt.tx - tilt.x) * 0.05; tilt.y += (tilt.ty - tilt.y) * 0.05;
      rotY += (thinking ? 0.012 : 0.0028) * dt;
      const ax = rotX + tilt.y * 0.35, ay = rotY + tilt.x * 0.5;
      const cx = w / 2, cy = h / 2, R = Math.min(w, h) * 0.38;
      const sx = Math.sin(ax), cxr = Math.cos(ax), sy = Math.sin(ay), cyr = Math.cos(ay);

      for (let i = 0; i < N; i++) {
        const p = pts[i];
        const x1 = p.x * cyr - p.z * sy, z1 = p.x * sy + p.z * cyr;
        const y2 = p.y * cxr - z1 * sx, z2 = p.y * sx + z1 * cxr;
        const s = 2.6 / (2.6 + z2);
        proj[i * 3] = cx + x1 * R * s; proj[i * 3 + 1] = cy + y2 * R * s; proj[i * 3 + 2] = z2;
      }

      ctx.clearRect(0, 0, w, h);

      // Soft core glow
      const g = ctx.createRadialGradient(cx, cy, R * 0.1, cx, cy, R * 1.5);
      g.addColorStop(0, thinking ? "rgba(255,53,44,.22)" : "rgba(255,53,44,.12)");
      g.addColorStop(1, "rgba(255,53,44,0)");
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);

      // Orbit rings
      ctx.save(); ctx.translate(cx, cy);
      for (let k = 0; k < 2; k++) {
        ctx.save(); ctx.rotate(k ? -0.5 + rotY * 0.2 : 0.35 - rotY * 0.15);
        ctx.beginPath(); ctx.ellipse(0, 0, R * (1.32 + k * 0.16), R * (0.34 + k * 0.08), 0, 0, Math.PI * 2);
        ctx.setLineDash([2, 7]); ctx.strokeStyle = "rgba(255,255,255,.14)"; ctx.lineWidth = 1; ctx.stroke(); ctx.setLineDash([]);
        const a = now / (k ? 2600 : 1900);
        ctx.beginPath(); ctx.arc(Math.cos(a) * R * (1.32 + k * 0.16), Math.sin(a) * R * (0.34 + k * 0.08), 2.4, 0, Math.PI * 2);
        ctx.fillStyle = k ? "#fff" : red; ctx.fill();
        ctx.restore();
      }
      ctx.restore();

      // Connections
      for (const [a, b] of edges) {
        const za = proj[a * 3 + 2], zb = proj[b * 3 + 2];
        const depth = 1 - ((za + zb) / 2 + 1) / 2; // 1 = front
        ctx.strokeStyle = `rgba(255,255,255,${0.04 + depth * 0.2})`;
        ctx.lineWidth = 0.6 + depth * 0.5;
        ctx.beginPath(); ctx.moveTo(proj[a * 3], proj[a * 3 + 1]); ctx.lineTo(proj[b * 3], proj[b * 3 + 1]); ctx.stroke();
      }

      // Nodes
      for (let i = 0; i < N; i++) {
        const x = proj[i * 3], y = proj[i * 3 + 1], depth = 1 - (proj[i * 3 + 2] + 1) / 2;
        const dm = Math.hypot(x - mouse.x, y - mouse.y);
        const near = dm < 120 ? 1 - dm / 120 : 0;
        const p = pts[i];
        if (p.hub) {
          const pulse = 0.5 + 0.5 * Math.sin(now / 500 + p.phase);
          ctx.fillStyle = red; ctx.globalAlpha = 0.35 + depth * 0.65;
          ctx.beginPath(); ctx.arc(x, y, 1.6 + depth * 2.2 + pulse * 1.2, 0, Math.PI * 2); ctx.fill();
          ctx.globalAlpha = (0.12 + depth * 0.2) * pulse;
          ctx.beginPath(); ctx.arc(x, y, 6 + depth * 8, 0, Math.PI * 2); ctx.fill();
          ctx.globalAlpha = 1;
        } else {
          ctx.fillStyle = `rgba(255,255,255,${0.25 + depth * 0.65 + near * 0.4})`;
          ctx.beginPath(); ctx.arc(x, y, 0.8 + depth * 1.4 + near * 1.6, 0, Math.PI * 2); ctx.fill();
        }
      }

      // Signals travelling along connections
      const spawn = thinking ? 1.4 : 0.22;
      if (Math.random() < spawn * dt) pulses.push({ e: (Math.random() * edges.length) | 0, t: 0, dir: Math.random() < 0.5 ? 1 : -1, speed: 0.02 + Math.random() * 0.03 });
      for (let k = pulses.length - 1; k >= 0; k--) {
        const q = pulses[k];
        q.t += q.speed * dt * (thinking ? 1.8 : 1);
        if (q.t >= 1) {
          // Hop onward to a connected edge so signals look like they propagate
          const end = q.dir === 1 ? edges[q.e][1] : edges[q.e][0];
          const next = edges.findIndex((ed, idx) => idx !== q.e && (ed[0] === end || ed[1] === end));
          if (next >= 0 && Math.random() < 0.7) { q.e = next; q.t = 0; q.dir = edges[next][0] === end ? 1 : -1; } else { pulses.splice(k, 1); continue; }
        }
        const [a, b] = edges[q.e];
        const f = q.dir === 1 ? q.t : 1 - q.t;
        const x = proj[a * 3] + (proj[b * 3] - proj[a * 3]) * f, y = proj[a * 3 + 1] + (proj[b * 3 + 1] - proj[a * 3 + 1]) * f;
        const depth = 1 - ((proj[a * 3 + 2] + proj[b * 3 + 2]) / 2 + 1) / 2;
        ctx.fillStyle = red; ctx.globalAlpha = 0.3 + depth * 0.7;
        ctx.beginPath(); ctx.arc(x, y, 1.6 + depth * 1.4, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 0.18 * depth; ctx.beginPath(); ctx.arc(x, y, 7, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
      }
      if (pulses.length > 140) pulses.splice(0, pulses.length - 140);

      if (!reduce && visible) raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      tilt.tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      tilt.ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    };

    resize();
    const ro = new ResizeObserver(() => { resize(); if (reduce) frame(performance.now()); });
    ro.observe(canvas);
    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      if (visible && !reduce) { cancelAnimationFrame(raf); last = performance.now(); raf = requestAnimationFrame(frame); }
    });
    io.observe(canvas);
    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); window.removeEventListener("pointermove", onMove); };
  }, []);

  return <canvas ref={ref} className="neural" aria-hidden="true" />;
}
