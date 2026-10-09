"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUp, RotateCcw, Sparkles, Square } from "lucide-react";
import { services } from "@/data/services";

const chips: [string, string][] = [
  ["Support tickets", "Our support team answers the same 200 questions every week"],
  ["Invoice data entry", "We retype data from supplier invoices into NetSuite"],
  ["Lead research", "Sales reps spend hours researching leads before calls"],
  ["Missed calls", "We miss inbound calls after 6pm and lose bookings"],
];

const examples = [
  "Our support team answers the same 200 questions every week",
  "We retype data from supplier invoices into NetSuite",
  "Sales reps spend hours researching leads before calls",
  "We miss inbound calls after 6pm and lose bookings",
  "Our engineers can't find answers buried in Confluence",
];

export function AiPrompt({ onThinking }: { onThinking?: (v: boolean) => void }) {
  const [value, setValue] = useState("");
  const [ph, setPh] = useState("");
  const [answer, setAnswer] = useState("");
  const [asked, setAsked] = useState("");
  const [busy, setBusy] = useState(false);
  const [matched, setMatched] = useState<string[]>([]);
  const [error, setError] = useState("");
  const abort = useRef<AbortController | null>(null);
  const ta = useRef<HTMLTextAreaElement>(null);

  // Typewriter placeholder cycling through example problems
  useEffect(() => {
    if (value || answer) return;
    let i = 0, c = 0, del = false, t: ReturnType<typeof setTimeout>;
    const tick = () => {
      const s = examples[i];
      c += del ? -1 : 1;
      setPh(s.slice(0, c));
      if (!del && c === s.length) { del = true; t = setTimeout(tick, 1800); return; }
      if (del && c === 0) { del = false; i = (i + 1) % examples.length; }
      t = setTimeout(tick, del ? 18 : 38);
    };
    t = setTimeout(tick, 900);
    return () => clearTimeout(t);
  }, [value, answer]);

  useEffect(() => {
    const el = ta.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 132)}px`;
  }, [value]);

  async function ask(q?: string) {
    const prompt = (q ?? value).trim();
    if (prompt.length < 4 || busy) return;
    setAsked(prompt); setAnswer(""); setMatched([]); setError(""); setBusy(true); onThinking?.(true);
    abort.current = new AbortController();
    try {
      const r = await fetch("/api/architect/", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ prompt }), signal: abort.current.signal });
      if (!r.ok || !r.body) throw new Error(await r.text());
      setMatched((r.headers.get("X-Matched") || "").split(",").filter(Boolean));
      const reader = r.body.getReader();
      const dec = new TextDecoder();
      for (;;) {
        const { done, value: chunk } = await reader.read();
        if (done) break;
        setAnswer((a) => a + dec.decode(chunk, { stream: true }));
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") setError("We couldn't generate an outline just now. Tell us about it directly and an engineer will reply within one business day.");
    } finally {
      setBusy(false); onThinking?.(false);
    }
  }

  function reset() {
    abort.current?.abort();
    setAnswer(""); setAsked(""); setValue(""); setMatched([]); setError("");
    setTimeout(() => ta.current?.focus(), 50);
  }

  const lines = answer.split("\n").filter((l) => l.trim());
  const matchedServices = matched.map((m) => services.find((s) => s.slug === m)).filter(Boolean);

  return (
    <div className={`aip ${busy ? "busy" : ""}`}>
      <form className="aip-box" onSubmit={(e) => { e.preventDefault(); ask(); }}>
        <label htmlFor="aip-input" className="aip-label"><Sparkles size={14} aria-hidden="true" /> Describe a process you want AI to handle</label>
        <div className="aip-row">
          <textarea
            id="aip-input"
            ref={ta}
            rows={1}
            value={value}
            maxLength={600}
            placeholder={ph || "Describe the problem in your own words"}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); ask(); } }}
          />
          {busy ? (
            <button type="button" className="aip-send" aria-label="Stop" onClick={() => abort.current?.abort()}><Square size={14} fill="currentColor" /></button>
          ) : (
            <button type="submit" className="aip-send" aria-label="Get a solution outline" disabled={value.trim().length < 4}><ArrowUp size={18} /></button>
          )}
        </div>
        {!asked && (
          <div className="aip-chips">
            <span className="aip-try">Try:</span>
            {chips.map(([label, x]) => (
              <button type="button" key={label} className="aip-chip" onClick={() => { setValue(x); ask(x); }}>{label}</button>
            ))}
          </div>
        )}
      </form>

      <AnimatePresence>
        {asked && (
          <motion.div className="aip-out" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}>
            <div className="aip-out-inner" aria-live="polite">
              <div className="aip-out-head">
                <span><span className={`aip-dot ${busy ? "on" : ""}`} aria-hidden="true" /> {busy && !answer ? "Analyzing your workflow…" : busy ? "Drafting outline…" : "Solution outline"}</span>
                <button type="button" className="aip-reset" onClick={reset}><RotateCcw size={13} /> Ask another</button>
              </div>
              {error ? <p className="aip-error">{error}</p> : (
                <div className="aip-answer">
                  {lines.map((l, i) =>
                    l.startsWith("- ") ? <p key={i} className="aip-li">{l.slice(2)}</p>
                    : /:$/.test(l.trim()) ? <p key={i} className="aip-h">{l}</p>
                    : /^typical timeline/i.test(l) ? <p key={i} className="aip-time">{l}</p>
                    : <p key={i} className="aip-lead">{l}</p>
                  )}
                  {busy && <span className="aip-caret" aria-hidden="true" />}
                </div>
              )}
              {!busy && (matchedServices.length > 0 || error) && (
                <motion.div className="aip-next" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="aip-services">
                    {matchedServices.map((s) => <Link key={s!.slug} href={`/services/${s!.slug}/`}>{s!.title}</Link>)}
                  </div>
                  <Link href={`/contact/?brief=${encodeURIComponent(asked)}`} className="btn btn-red btn-sm">Scope this with an engineer <ArrowRight size={16} /></Link>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
