"use client";
import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

const pts = [[0, 132], [60, 118], [110, 82], [170, 58], [230, 34], [300, 22]];
const d = pts.map(([x, y], i) => (i ? `L${x} ${y}` : `M${x} ${y}`)).join(" ");

/** Accuracy curve that draws itself as the visitor scrolls through the delivery steps. */
export function TrainingCurve() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 15%"] });
  const p = useSpring(scrollYProgress, { stiffness: 80, damping: 22 });
  const acc = useTransform(p, [0, 1], [61, 97]);
  const label = useTransform(acc, (v) => `${v.toFixed(1)}%`);
  const dotX = useTransform(p, [0, 1], [0, 300]);
  const dotY = useTransform(p, (v) => {
    const x = v * 300;
    for (let i = 1; i < pts.length; i++) if (x <= pts[i][0]) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i]; return y0 + ((x - x0) / (x1 - x0)) * (y1 - y0); }
    return pts[pts.length - 1][1];
  });
  return (
    <div className="curve" ref={ref}>
      <div className="curve-top"><span>Task accuracy, example engagement</span><motion.b>{label}</motion.b></div>
      <svg viewBox="0 0 300 150" aria-hidden="true">
        {[30, 70, 110].map((y) => <line key={y} x1="0" x2="300" y1={y} y2={y} stroke="var(--line)" />)}
        <path d={d} fill="none" stroke="var(--line-strong)" strokeWidth="1.5" strokeDasharray="3 4" />
        <motion.path d={d} fill="none" stroke="var(--red)" strokeWidth="2.5" style={{ pathLength: p }} />
        <motion.circle r="5" fill="var(--red)" style={{ cx: dotX, cy: dotY }} />
      </svg>
      <div className="curve-x"><span>Discover</span><span>Prototype</span><span>Build</span><span>Run</span></div>
    </div>
  );
}
