"use client";
import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "framer-motion";
import { processSteps } from "@/data/site";
import { Reveal } from "./Reveal";

/** Delivery steps that light up one by one as a signal travels down the rail on scroll. */
export function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 55%"] });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });
  const top = useTransform(p, (v) => `${Math.min(100, Math.max(0, v * 100))}%`);
  const [active, setActive] = useState(-1);
  useMotionValueEvent(p, "change", (v) => setActive(Math.min(processSteps.length - 1, Math.floor(v * processSteps.length + 0.15))));

  return (
    <div className="steps" ref={ref}>
      <div className="steps-rail" aria-hidden="true">
        <motion.div className="steps-fill" style={{ scaleY: p }} />
        <motion.span className="steps-packet" style={{ top }} />
      </div>
      <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "grid" }}>
        {processSteps.map((s, i) => (
          <Reveal as="li" key={s.title} className={`step ${i <= active ? "active" : ""}`} delay={i * 0.05}>
            <span className="step-num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
            <div className="step-head">
              <h3>{s.title}</h3>
              <span className="step-time">{s.time}</span>
            </div>
            <p>{s.body}</p>
          </Reveal>
        ))}
      </ol>
    </div>
  );
}
