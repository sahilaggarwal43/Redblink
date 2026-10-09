"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Search } from "lucide-react";
import { services as staticServices, type Service } from "@/data/services";
import { signals } from "@/lib/match";

const tries = ["answer customer questions 24/7", "read invoices automatically", "predict which customers will churn", "show up in ChatGPT answers", "secure our WordPress site"];
const stop = new Set(["the", "a", "an", "to", "and", "or", "of", "for", "our", "we", "in", "on", "with", "is", "are", "my", "i", "want", "need", "how", "can", "do", "that", "it"]);
const tok = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter((w) => w.length > 2 && !stop.has(w));

/** Search that ranks services by meaning-like relevance and shows the score for each match. */
export function SemanticSearch({ services = staticServices }: { services?: Service[] }) {
  const [q, setQ] = useState("");
  const [ph, setPh] = useState(tries[0]);
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => { i = (i + 1) % tries.length; setPh(tries[i]); }, 2600);
    return () => clearInterval(t);
  }, []);

  const results = useMemo(() => {
    const words = tok(q);
    if (!words.length) return [];
    const text = q.toLowerCase();
    return services
      .map((s) => {
        const hay = tok(`${s.title} ${s.short} ${s.keywords.join(" ")} ${s.capabilities.map((c) => c.t).join(" ")}`);
        let score = 0;
        for (const w of words) for (const h of hay) { if (h === w) score += 3; else if (h.startsWith(w.slice(0, 5)) || w.startsWith(h.slice(0, 5))) score += 1.2; }
        const qw = words.map((w) => w.slice(0, 6));
        for (const sig of signals[s.slug] || []) {
          if (text.includes(sig) || (!sig.includes(" ") && sig.length > 4 && qw.includes(sig.slice(0, 6)))) score += sig.includes(" ") ? 12 : 9;
        }
        return { s, score };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((r, _, arr) => ({ ...r, pct: Math.round(58 + 41 * (r.score / arr[0].score)) }));
  }, [q, services]);

  return (
    <div className="sem">
      <div className="sem-box">
        <Search size={18} aria-hidden="true" />
        <label htmlFor="sem-q" className="sr-only">Describe what you need</label>
        <input id="sem-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Try "${ph}"`} autoComplete="off" />
        {q && <span className="sem-count">{results.length} matches</span>}
      </div>
      <AnimatePresence initial={false}>
        {q && (
          <motion.ol className="sem-results" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
            {results.length === 0 && <li className="sem-empty">No close match yet. Describe the outcome you want, or <Link href="/contact/">ask an engineer</Link>.</li>}
            {results.map(({ s, pct }, i) => (
              <motion.li key={s.slug} layout initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                <Link href={`/services/${s.slug}/`} className="sem-item">
                  <span className="sem-title">{s.title}<span className="sem-short">{s.short}</span></span>
                  <span className="sem-score" aria-label={`${pct}% relevance`}>
                    <span className="sem-bar"><motion.span initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} /></span>
                    <b>{(pct / 100).toFixed(2)}</b>
                  </span>
                  <ArrowRight size={16} className="sem-go" aria-hidden="true" />
                </Link>
              </motion.li>
            ))}
          </motion.ol>
        )}
      </AnimatePresence>
    </div>
  );
}
