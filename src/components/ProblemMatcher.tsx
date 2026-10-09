"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Search } from "lucide-react";
import { services } from "@/data/services";
import { matchServices } from "@/lib/match";

const presets = [
  "Our support team is drowning in tickets",
  "We miss calls after hours",
  "We retype data from invoices",
  "We don't know where AI fits",
  "We need to forecast demand",
  "We want to show up in ChatGPT answers",
];

export function ProblemMatcher() {
  const [q, setQ] = useState("");
  const [active, setActive] = useState<string | null>(null);

  const results = useMemo(() => matchServices(q), [q]);

  const pick = (p: string) => {
    setActive(p);
    setQ(p);
  };

  return (
    <div className="matcher">
      <span className="kicker" style={{ color: "var(--red)" }}>Find the right service</span>
      <h2 className="h-md" style={{ marginTop: "1rem", maxWidth: "20ch" }}>Tell us what&rsquo;s slowing you down.</h2>
      <p className="muted" style={{ marginTop: ".8rem", maxWidth: "56ch" }}>Describe the problem in your own words, or tap an example. We&rsquo;ll show the services that fit.</p>
      <form className="matcher-input" onSubmit={(e) => e.preventDefault()} role="search">
        <Search size={20} style={{ alignSelf: "center", opacity: 0.6 }} aria-hidden="true" />
        <label htmlFor="problem" className="hp">Describe your problem</label>
        <input id="problem" value={q} onChange={(e) => { setQ(e.target.value); setActive(null); }} placeholder="e.g. We spend hours answering the same customer emails" autoComplete="off" />
        {q && (
          <button type="button" className="btn btn-light btn-sm" onClick={() => { setQ(""); setActive(null); }}>Clear</button>
        )}
      </form>
      <div className="chips">
        {presets.map((p) => (
          <button key={p} type="button" className="chip" aria-pressed={active === p} onClick={() => pick(p)}>{p}</button>
        ))}
      </div>
      <div aria-live="polite">
        <AnimatePresence mode="popLayout">
          {results.length > 0 && (
            <motion.div className="matches" key={results.map((r) => r.slug).join()} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {results.map((r, i) => (
                <motion.div key={r.slug} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.45 }}>
                  <Link href={`/services/${r.slug}/`} className="match" style={{ height: "100%" }}>
                    <span className="score">{i === 0 ? "Best match" : `Also relevant`}</span>
                    <h3>{r.title}</h3>
                    <p>{r.short}</p>
                    <span className="link-arrow">See how it works <ArrowRight size={16} /></span>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
