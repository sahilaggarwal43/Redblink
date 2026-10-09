"use client";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { NeuralSphere } from "./NeuralSphere";
import { AiPrompt } from "./AiPrompt";
import { Decode } from "./Decode";

const ease = [0.16, 1, 0.3, 1] as const;
const platforms = ["OpenAI", "Anthropic", "Google Gemini", "Meta Llama", "Mistral", "AWS Bedrock", "Azure AI", "Google Cloud", "Hugging Face", "LangChain", "Pinecone", "Databricks"];

export function Hero({ eyebrow = "AI SOFTWARE ENGINEERING / DANVILLE, CALIFORNIA", title = "Enterprise AI, engineered for production.", lede = "" }: { eyebrow?: string; title?: string; lede?: string }) {
  const cut = title.indexOf(", ");
  const [l1, l2] = cut > 0 ? [title.slice(0, cut + 1), title.slice(cut + 2)] : [title, ""];
  const hl = (t: string) => t.split(/(\bAI\b)/).map((part, i) => (part === "AI" ? <span key={i} className="shine">AI</span> : part));
  const reduce = useReducedMotion();
  const [thinking, setThinking] = useState(false);
  const rise = (d: number) => (reduce ? {} : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, delay: d, ease } });

  return (
    <section className="hero-ai" aria-labelledby="hero-title">
      <div className="hero-ai-grid-bg" aria-hidden="true" />
      <div className="container hero-ai-inner">
        <div className="hero-ai-copy">
          <motion.p className="hero-ai-eyebrow" {...rise(0)}>
            <span className="live" aria-hidden="true" />
            <Decode text={eyebrow} delay={250} duration={1100} />
          </motion.p>
          <h1 id="hero-title" aria-label={title}>
            <span className="line" aria-hidden="true">
              <motion.span initial={reduce ? false : { y: "110%" }} animate={{ y: 0 }} transition={{ duration: 1, delay: 0.15, ease }}>
                {hl(l1)}
              </motion.span>
            </span>
            <span className="line" aria-hidden="true">
              <motion.span initial={reduce ? false : { y: "110%" }} animate={{ y: 0 }} transition={{ duration: 1, delay: 0.27, ease }}>
                {l2}
              </motion.span>
            </span>
          </h1>
          <motion.p className="hero-ai-lede" {...rise(0.5)}>
            {lede || "We design, build and run AI agents, LLM applications and custom software for US companies. Try it: describe a process and watch our solution architect outline it."}
          </motion.p>
          <motion.div {...rise(0.7)}>
            <AiPrompt onThinking={setThinking} />
          </motion.div>
        </div>

        <motion.div className="hero-ai-visual" initial={reduce ? false : { opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.6, delay: 0.2, ease }}>
          <NeuralSphere mode={thinking ? "thinking" : "idle"} />
          <div className={`hero-ai-status ${thinking ? "on" : ""}`} aria-hidden="true">
            <span className="dot" /> {thinking ? "Reasoning" : "Model online"}
          </div>
        </motion.div>
      </div>

      <div className="hero-ai-marquee" aria-label="Platforms we engineer with">
        <span className="hero-ai-marquee-label">Engineering with</span>
        <div className="marquee">
          <ul className="marquee-track">
            {[...platforms, ...platforms].map((p, i) => <li key={i} aria-hidden={i >= platforms.length}>{p}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}
