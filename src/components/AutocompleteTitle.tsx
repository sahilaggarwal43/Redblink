"use client";
import { useEffect, useState } from "react";

/**
 * Headline that writes itself like an AI copilot: the start is typed,
 * a ghost suggestion appears, then gets accepted with a Tab keypress.
 */
export function AutocompleteTitle({ typed, suggestion }: { typed: string; suggestion: string }) {
  const full = typed + suggestion;
  const [n, setN] = useState(full.length);
  const [phase, setPhase] = useState<"typing" | "ghost" | "accept" | "done">("done");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setN(0); setPhase("typing");
    let i = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const type = () => {
      i++; setN(i);
      if (i < typed.length) timers.push(setTimeout(type, 45 + Math.random() * 55));
      else timers.push(setTimeout(() => setPhase("ghost"), 250), setTimeout(() => setPhase("accept"), 1500), setTimeout(() => { setN(full.length); setPhase("done"); }, 1850));
    };
    timers.push(setTimeout(type, 400));
    return () => timers.forEach(clearTimeout);
  }, [typed, full.length]);

  const shown = phase === "done" ? full : full.slice(0, Math.min(n, typed.length));
  return (
    <h1 className="ac-title" aria-label={full}>
      <span aria-hidden="true">
        {shown}
        {(phase === "ghost" || phase === "accept") && <span className={`ac-ghost ${phase === "accept" ? "in" : ""}`}>{suggestion}</span>}
        {phase !== "done" && <span className="ac-caret" />}
        {phase === "ghost" && <span className="ac-tab">Tab</span>}
      </span>
    </h1>
  );
}
