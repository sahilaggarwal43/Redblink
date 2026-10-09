"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { industries as staticIndustries } from "@/data/site";

const axes = ["Automation potential", "Data readiness", "Speed to ROI", "Compliance load", "Customer impact"];

// Our working view of where AI pays off first in each sector (0-100). Illustrative, not survey data.
const scores: Record<string, number[]> = {
  healthcare: [82, 58, 60, 95, 88],
  "financial-services": [86, 80, 72, 92, 70],
  retail: [78, 85, 88, 45, 92],
  "real-estate": [74, 55, 82, 40, 76],
  logistics: [90, 66, 80, 42, 64],
  legal: [84, 62, 70, 78, 58],
  education: [70, 52, 64, 60, 86],
  saas: [88, 90, 90, 55, 84],
};

const S = 300, C = S / 2, R = 108;
function point(i: number, v: number) {
  const a = -Math.PI / 2 + (i * 2 * Math.PI) / axes.length;
  return [C + Math.cos(a) * R * (v / 100), C + Math.sin(a) * R * (v / 100)];
}

/** Radar chart that morphs between industries. */
export function OpportunityRadar({ industries = staticIndustries }: { industries?: { id: string; name: string }[] }) {
  const list = industries.filter((i) => scores[i.id]);
  const [idx, setIdx] = useState(0);
  const [auto, setAuto] = useState(true);
  const cur = list[idx];
  const vals = scores[cur.id];

  useEffect(() => {
    if (!auto || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % list.length), 3200);
    return () => clearInterval(t);
  }, [auto, list.length]);

  const poly = vals.map((v, i) => point(i, v).join(",")).join(" ");
  return (
    <div className="radar" onMouseEnter={() => setAuto(false)}>
      <div className="radar-head">
        <span className="radar-label">AI opportunity profile</span>
        <motion.strong key={cur.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>{cur.name}</motion.strong>
      </div>
      <svg viewBox={`0 0 ${S} ${S}`} role="img" aria-label={`${cur.name}: ${axes.map((a, i) => `${a} ${vals[i]}`).join(", ")}`}>
        {[25, 50, 75, 100].map((r) => (
          <polygon key={r} points={axes.map((_, i) => point(i, r).join(",")).join(" ")} fill="none" stroke="var(--line)" strokeWidth="1" />
        ))}
        {axes.map((a, i) => {
          const [x, y] = point(i, 100);
          const [lx, ly] = point(i, 128);
          return (
            <g key={a}>
              <line x1={C} y1={C} x2={x} y2={y} stroke="var(--line)" />
              <text x={lx} y={ly} textAnchor={lx < C - 5 ? "end" : lx > C + 5 ? "start" : "middle"} dominantBaseline="middle" fontSize="10.5" fill="var(--ink-3)">{a}</text>
            </g>
          );
        })}
        <motion.polygon animate={{ points: poly }} initial={false} transition={{ type: "spring", stiffness: 90, damping: 16 }} fill="color-mix(in srgb, var(--red) 16%, transparent)" stroke="var(--red)" strokeWidth="2" />
        {vals.map((v, i) => {
          const [x, y] = point(i, v);
          return <motion.circle key={i} r="4" fill="#fff" stroke="var(--red)" strokeWidth="2" animate={{ cx: x, cy: y }} initial={false} transition={{ type: "spring", stiffness: 90, damping: 16 }} />;
        })}
      </svg>
      <div className="radar-tabs" role="tablist" aria-label="Choose an industry">
        {list.map((ind, i) => (
          <button key={ind.id} role="tab" aria-selected={i === idx} onClick={() => { setIdx(i); setAuto(false); }}>{ind.name.replace(" and ", " & ")}</button>
        ))}
      </div>
      <p className="radar-note">Our working view from client engagements. Illustrative, not survey data.</p>
    </div>
  );
}
