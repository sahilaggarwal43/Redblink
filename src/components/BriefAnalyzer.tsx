"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ScanText } from "lucide-react";
import { matchServices } from "@/lib/match";
import { industries } from "@/data/site";

const industryWords: Record<string, string[]> = {
  healthcare: ["patient", "clinic", "hospital", "hipaa", "medical", "health", "ehr", "doctor"],
  "financial-services": ["bank", "loan", "fintech", "insurance", "kyc", "lending", "credit", "wealth"],
  retail: ["store", "ecommerce", "e-commerce", "shopify", "retail", "inventory", "products", "cart"],
  "real-estate": ["property", "real estate", "tenant", "lease", "realtor", "listing"],
  logistics: ["freight", "shipping", "logistics", "dispatch", "fleet", "warehouse", "delivery"],
  legal: ["law", "legal", "contract", "attorney", "matter", "firm"],
  education: ["school", "student", "course", "university", "learning", "teacher"],
  saas: ["saas", "subscription", "platform", "users", "product-led", "b2b"],
};
const tools = ["salesforce", "hubspot", "zendesk", "netsuite", "quickbooks", "stripe", "shopify", "slack", "sharepoint", "confluence", "jira", "sap", "epic", "twilio", "aws", "azure", "google"];

type Brief = { services: string[]; industry?: string; tools: string[]; timeline?: string; score: number };

function analyze(text: string): Brief {
  const t = text.toLowerCase();
  const svc = t.trim().length > 12 ? matchServices(t, 3).map((s) => s.title) : [];
  const ind = Object.entries(industryWords).find(([, w]) => w.some((x) => t.includes(x)))?.[0];
  const tl = t.match(/\b(asap|urgent|this (week|month|quarter)|next (week|month|quarter)|\d+\s*(weeks?|months?)|q[1-4]|by (january|february|march|april|may|june|july|august|september|october|november|december))\b/)?.[0];
  const found = tools.filter((x) => t.includes(x));
  const words = t.split(/\s+/).filter(Boolean).length;
  const score = Math.min(100, Math.round(Math.min(words, 60) / 60 * 45 + (svc.length ? 15 : 0) + (ind ? 15 : 0) + (tl ? 15 : 0) + (found.length ? 10 : 0)));
  return { services: svc, industry: industries.find((i) => i.id === ind)?.name, tools: found, timeline: tl, score };
}

/** Reads the contact form message as it is typed and shows what it understood. */
export function BriefAnalyzer() {
  const [b, setB] = useState<Brief>({ services: [], tools: [], score: 0 });
  const [active, setActive] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const read = () => {
      const msg = (document.getElementById("message") as HTMLTextAreaElement | null)?.value || "";
      setActive(msg.trim().length > 0);
      setB(analyze(msg));
    };
    const onInput = (e: Event) => {
      if ((e.target as HTMLElement)?.id !== "message") return;
      clearTimeout(timer); timer = setTimeout(read, 220);
    };
    document.addEventListener("input", onInput);
    const t0 = setTimeout(read, 600); // picks up prefilled briefs
    return () => { document.removeEventListener("input", onInput); clearTimeout(timer); clearTimeout(t0); };
  }, []);

  const tip = !active ? "Start typing your project details and we'll read along."
    : b.score < 40 ? "Add what you want to achieve and the systems involved."
    : b.score < 75 ? "Good. A timeline or the tools you use will sharpen the estimate."
    : "Great brief. An engineer can reply with specifics.";

  return (
    <div className={`brief ${active ? "on" : ""}`} aria-live="polite">
      <div className="brief-head"><ScanText size={16} aria-hidden="true" /> Live brief analysis</div>
      <div className="brief-meter">
        <div className="brief-meter-top"><span>Brief strength</span><b>{b.score}%</b></div>
        <div className="brief-track"><motion.span animate={{ width: `${b.score}%` }} transition={{ type: "spring", stiffness: 120, damping: 20 }} /></div>
      </div>
      <dl className="brief-list">
        <div><dt>Likely services</dt><dd><Tags items={b.services} /></dd></div>
        <div><dt>Industry</dt><dd><Tags items={b.industry ? [b.industry] : []} /></dd></div>
        <div><dt>Systems mentioned</dt><dd><Tags items={b.tools.map((x) => x[0].toUpperCase() + x.slice(1))} /></dd></div>
        <div><dt>Timeline</dt><dd><Tags items={b.timeline ? [b.timeline] : []} /></dd></div>
      </dl>
      <p className="brief-tip">{tip}</p>
    </div>
  );
}

function Tags({ items }: { items: string[] }) {
  if (!items.length) return <span className="brief-none">Not detected yet</span>;
  return (
    <span className="brief-tags">
      <AnimatePresence initial={false}>
        {items.map((x) => (
          <motion.span key={x} initial={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.3 }}>{x}</motion.span>
        ))}
      </AnimatePresence>
    </span>
  );
}
