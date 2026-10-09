"use client";
import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { stats as staticStats } from "@/data/site";

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();
  const [v, setV] = useState(to); // server renders the final number for crawlers
  useEffect(() => {
    if (!inView || reduce) return;
    const c = animate(0, to, { duration: 1.8, ease: [0.2, 0.7, 0.1, 1], onUpdate: (n) => setV(Math.round(n)) });
    return () => c.stop();
  }, [inView, to, reduce]);
  return (
    <strong ref={ref}>
      {v.toLocaleString("en-US")}
      <em>{suffix}</em>
    </strong>
  );
}

export function Stats({ stats = staticStats }: { stats?: { value: number; suffix: string; label: string }[] }) {
  return (
    <div className="stats">
      {stats.map((s) => (
        <div className="stat" key={s.label}>
          <Counter to={s.value} suffix={s.suffix} />
          <span>{s.label}</span>
        </div>
      ))}
    </div>
  );
}
