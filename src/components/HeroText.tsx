"use client";
import { motion, useReducedMotion } from "framer-motion";

export function HeroText({ title, lede }: { title: string; lede?: string }) {
  const reduce = useReducedMotion();
  const words = title.split(" ");
  return (
    <>
      <h1 aria-label={title}>
        {words.map((w, i) => (
          <span key={i}>
          <span aria-hidden="true" style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top", paddingBottom: "0.06em" }}>
            <motion.span
              style={{ display: "inline-block" }}
              initial={reduce ? false : { y: "105%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.05 + i * 0.05, ease: [0.2, 0.7, 0.1, 1] }}
            >
              {w}
            </motion.span>
          </span>
          {i < words.length - 1 ? " " : ""}
          </span>
        ))}
      </h1>
      {lede && (
        <motion.p className="lede" initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.35 }}>
          {lede}
        </motion.p>
      )}
    </>
  );
}
