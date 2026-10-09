"use client";
import { useEffect, useRef, useState } from "react";
import { Play, RotateCcw } from "lucide-react";

type Line = { t: string; kind?: "cmd" | "ok" | "info" | "metric" | "warn" };

/** A build log that "runs" a delivery pipeline for a specific service. */
export function BuildTerminal({ slug, title, stack, capabilities }: { slug: string; title: string; stack: string[]; capabilities: string[] }) {
  const script: Line[] = [
    { t: `redblink init ${slug} --client acme`, kind: "cmd" },
    { t: `Scaffolding ${title.toLowerCase().replace(/\bai\b/g, "AI").replace(/\bllm\b/g, "LLM")} workspace`, kind: "info" },
    ...stack.slice(0, 3).map((s) => ({ t: `Connected ${s}`, kind: "ok" as const })),
    { t: `redblink build --eval`, kind: "cmd" },
    ...capabilities.slice(0, 3).map((c) => ({ t: `${c}`, kind: "ok" as const })),
    { t: "Running evaluation suite: 412 test cases", kind: "info" },
    { t: "accuracy 96.8%   p95 latency 1.4s   cost/task $0.021", kind: "metric" },
    { t: "Guardrails: PII redaction, spend limit, human approval", kind: "ok" },
    { t: `redblink deploy --env production`, kind: "cmd" },
    { t: "Deployed. Monitoring and alerts active.", kind: "ok" },
  ];
  const [n, setN] = useState(0);
  const [chars, setChars] = useState(0);
  const [run, setRun] = useState(0);
  const body = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setN(script.length); return; }
    setN(0); setChars(0);
    let line = 0, c = 0;
    let t: ReturnType<typeof setTimeout>;
    const step = () => {
      const cur = script[line];
      if (!cur) return;
      if (cur.kind === "cmd" && c < cur.t.length) { c++; setChars(c); t = setTimeout(step, 28); return; }
      line++; c = 0; setN(line); setChars(0);
      t = setTimeout(step, cur.kind === "cmd" ? 380 : cur.kind === "info" ? 650 : 260);
    };
    t = setTimeout(step, 600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run]);

  useEffect(() => { body.current?.scrollTo({ top: body.current.scrollHeight, behavior: "smooth" }); }, [n, chars]);

  const done = n >= script.length;
  return (
    <div className="term" role="img" aria-label={`Example delivery pipeline for ${title}`}>
      <div className="term-bar">
        <span className="term-dots" aria-hidden="true"><i /><i /><i /></span>
        <span>example-build.log</span>
        <button className="term-btn" onClick={() => setRun((r) => r + 1)} aria-label="Run again">{done ? <RotateCcw size={13} /> : <Play size={13} />}</button>
      </div>
      <div className="term-body" ref={body} aria-hidden="true">
        {script.slice(0, n + 1).map((l, i) => {
          const typing = i === n && l.kind === "cmd";
          if (i === n && !typing) return null;
          return (
            <div key={i} className={`term-line ${l.kind || ""}`}>
              {l.kind === "cmd" ? <span className="term-p">$</span> : l.kind === "ok" ? <span className="term-ok">✓</span> : l.kind === "metric" ? <span className="term-m">▸</span> : <span className="term-i">›</span>}
              <span>{typing ? l.t.slice(0, chars) : l.t}{typing && <span className="term-caret" />}</span>
            </div>
          );
        })}
        {done && <div className="term-line"><span className="term-p">$</span><span><span className="term-caret" /></span></div>}
      </div>
    </div>
  );
}
