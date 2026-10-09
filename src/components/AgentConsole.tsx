"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Loader2, ShieldCheck, Inbox, Database, FileText, Send, CreditCard, Search, Mail } from "lucide-react";

type Step = { icon: typeof Check; text: string; tool: string };
type Scenario = {
  id: string;
  tab: string;
  from: string;
  request: string;
  steps: Step[];
  action: string;
  metrics: [string, string][];
};

// Illustrative scenarios shown in the hero. Values are examples, not client data.
const scenarios: Scenario[] = [
  {
    id: "support",
    tab: "Customer support",
    from: "Ticket #48213, Zendesk",
    request: "I was charged twice for my March subscription. Can you refund the duplicate?",
    steps: [
      { icon: Inbox, text: "Classified as billing dispute", tool: "Zendesk" },
      { icon: CreditCard, text: "Found duplicate charge of $49.00", tool: "Stripe" },
      { icon: Search, text: "Checked refund policy, eligible", tool: "Knowledge base" },
      { icon: Mail, text: "Drafted reply to customer", tool: "LLM" },
    ],
    action: "Refund $49.00 to card ending 4417 and send reply",
    metrics: [["Handled in", "38 sec"], ["Confidence", "97%"], ["Cost", "$0.03"]],
  },
  {
    id: "finance",
    tab: "Finance ops",
    from: "Invoice INV-20931, AP inbox",
    request: "Invoice from Northwind Freight doesn't match the purchase order. Please review.",
    steps: [
      { icon: FileText, text: "Extracted 14 line items from PDF", tool: "Document AI" },
      { icon: Database, text: "Matched against PO-7781", tool: "NetSuite" },
      { icon: Search, text: "Found fuel surcharge not on PO, $312.40", tool: "Rules" },
      { icon: Mail, text: "Drafted query to vendor", tool: "LLM" },
    ],
    action: "Hold payment and send vendor query",
    metrics: [["Handled in", "52 sec"], ["Confidence", "94%"], ["Cost", "$0.05"]],
  },
  {
    id: "sales",
    tab: "Sales",
    from: "Website form, inbound lead",
    request: "We're a 400-person logistics company exploring AI for dispatch. Who should we talk to?",
    steps: [
      { icon: Search, text: "Enriched company profile", tool: "Clearbit" },
      { icon: Database, text: "Scored lead: enterprise, high fit", tool: "Salesforce" },
      { icon: FileText, text: "Matched logistics case material", tool: "Knowledge base" },
      { icon: Send, text: "Proposed meeting times", tool: "Calendar" },
    ],
    action: "Route to enterprise AE and send intro email",
    metrics: [["Handled in", "21 sec"], ["Lead score", "92/100"], ["Cost", "$0.02"]],
  },
];

export function AgentConsole() {
  const reduce = useReducedMotion();
  const [s, setS] = useState(0);
  const [shown, setShown] = useState(reduce ? 99 : 0);
  const [approved, setApproved] = useState(false);
  const [paused, setPaused] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const sc = scenarios[s];
  const total = sc.steps.length;
  const ready = shown > total;

  useEffect(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setApproved(false);
    if (reduce) { setShown(99); return; }
    setShown(0);
    for (let i = 1; i <= total + 1; i++) timers.current.push(setTimeout(() => setShown(i), 700 + i * 900));
    return () => timers.current.forEach(clearTimeout);
  }, [s, total, reduce]);

  // Auto-advance once the action is ready, unless the visitor is interacting.
  useEffect(() => {
    if (!ready || paused || reduce) return;
    const t = setTimeout(() => approve(), 3200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, paused, reduce]);

  function approve() {
    setApproved(true);
    timers.current.push(setTimeout(() => setS((n) => (n + 1) % scenarios.length), 1400));
  }

  return (
    <div className="console" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="console-bar">
        <span className="console-title"><span className="console-dot" aria-hidden="true" /> RedBlink agent</span>
        <span className="console-env">Example workflow</span>
      </div>

      <div className="console-tabs" role="tablist" aria-label="Example agent workflows">
        {scenarios.map((x, i) => (
          <button key={x.id} role="tab" aria-selected={i === s} className="console-tab" onClick={() => setS(i)}>
            {x.tab}
            {i === s && <motion.span layoutId="console-tab-line" className="console-tab-line" />}
          </button>
        ))}
      </div>

      <div className="console-body" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div key={sc.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
            <div className="console-request">
              <span className="console-from">{sc.from}</span>
              <p>{sc.request}</p>
            </div>

            <ol className="console-steps">
              {sc.steps.map((st, i) => {
                const state = shown > i + 1 ? "done" : shown === i + 1 ? "run" : "wait";
                const Icon = st.icon;
                return (
                  <li key={st.text} className={`console-step ${state}`}>
                    <span className="console-ico" aria-hidden="true">
                      {state === "done" ? <Check size={14} strokeWidth={3} /> : state === "run" ? <Loader2 size={14} className="console-spin" /> : <Icon size={14} />}
                    </span>
                    <span className="console-text">{st.text}</span>
                    <span className="console-tool">{st.tool}</span>
                  </li>
                );
              })}
            </ol>

            <div className={`console-action ${ready ? "ready" : ""} ${approved ? "approved" : ""}`}>
              <div>
                <span className="console-from"><ShieldCheck size={13} aria-hidden="true" /> Needs approval</span>
                <p>{sc.action}</p>
              </div>
              <button className="console-approve" onClick={approve} disabled={!ready || approved}>
                {approved ? <><Check size={15} strokeWidth={3} /> Approved</> : "Approve"}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <dl className="console-metrics">
        {sc.metrics.map(([k, v]) => (
          <div key={k}><dt>{k}</dt><dd>{ready ? v : "…"}</dd></div>
        ))}
      </dl>
    </div>
  );
}
