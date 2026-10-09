"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2, Send } from "lucide-react";

const interests = ["AI agents", "Generative AI / LLM apps", "RAG & knowledge search", "Chatbot or voice AI", "Machine learning", "Automation", "Web or mobile app", "Hire engineers", "Cloud & security", "AI SEO & marketing", "Not sure yet"];
const budgets = ["Under $25k", "$25k–$50k", "$50k–$100k", "$100k–$250k", "$250k+"];

type Errors = Partial<Record<"name" | "email" | "message" | "consent", string>>;

export function ContactForm() {
  const params = useSearchParams();
  const [picked, setPicked] = useState<string[]>([]);
  const [budget, setBudget] = useState(1);
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [prefill, setPrefill] = useState("");
  const [serviceParam, setServiceParam] = useState("");

  useEffect(() => {
    const svc = params.get("service") || params.get("topic") || params.get("industry") || "";
    setServiceParam(svc);
    const msg = params.get("message") || (params.get("brief") ? `From the solution outline on the homepage: ${params.get("brief")}` : null);
    if (msg) setPrefill(msg);
    else if (svc) setPrefill(`I'd like to talk about ${svc}.`);
  }, [params]);

  const toggle = (x: string) => setPicked((p) => (p.includes(x) ? p.filter((y) => y !== x) : [...p, x]));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries()) as Record<string, string>;
    const errs: Errors = {};
    if (!data.name?.trim()) errs.name = "Enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email || "")) errs.email = "Enter a valid work email, like name@company.com.";
    if ((data.message || "").trim().length < 10) errs.message = "Tell us a little about the project (at least 10 characters).";
    if (!data.consent) errs.consent = "Please agree so we can contact you.";
    setErrors(errs);
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0];
      (e.currentTarget.elements.namedItem(first) as HTMLElement | null)?.focus();
      return;
    }
    setState("sending");
    try {
      const res = await fetch("/api/contact/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, interests: picked, budget: budgets[budget], source: serviceParam, page: typeof window !== "undefined" ? window.location.href : "" }),
      });
      if (!res.ok) throw new Error();
      setState("done");
    } catch {
      setState("error");
    }
  }

  return (
    <div className="form" style={{ position: "relative" }}>
      <AnimatePresence mode="wait">
        {state === "done" ? (
          <motion.div key="ok" className="form-ok" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} role="status">
            <motion.span className="tick" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.1 }}><Check size={36} /></motion.span>
            <h2 className="h-sm">Message sent.</h2>
            <p className="muted measure">A senior team member will reply within one business day, usually much sooner. Need us now? Call +1 415-779-2793.</p>
            <Link href="/services/" className="btn btn-ghost">Browse services while you wait</Link>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={onSubmit} noValidate style={{ display: "grid", gap: "1.3rem" }} exit={{ opacity: 0 }}>
            <div className="form-row">
              <div className="field">
                <label htmlFor="name">Full name <span className="req" aria-hidden="true">*</span></label>
                <input id="name" name="name" autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-err" : undefined} required />
                {errors.name && <span id="name-err" className="err">{errors.name}</span>}
              </div>
              <div className="field">
                <label htmlFor="email">Work email <span className="req" aria-hidden="true">*</span></label>
                <input id="email" name="email" type="email" autoComplete="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-err" : undefined} required />
                {errors.email && <span id="email-err" className="err">{errors.email}</span>}
              </div>
            </div>
            <div className="form-row">
              <div className="field">
                <label htmlFor="company">Company</label>
                <input id="company" name="company" autoComplete="organization" />
              </div>
              <div className="field">
                <label htmlFor="phone">Phone</label>
                <input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="(415) 555-0123" />
              </div>
            </div>
            <fieldset className="field">
              <legend>What can we help with?</legend>
              <div className="pick">
                {interests.map((x) => (
                  <button key={x} type="button" aria-pressed={picked.includes(x)} onClick={() => toggle(x)}>{x}</button>
                ))}
              </div>
            </fieldset>
            <div className="field">
              <label htmlFor="budget">Estimated budget: <output className="range-out" htmlFor="budget">{budgets[budget]}</output></label>
              <input id="budget" type="range" min={0} max={budgets.length - 1} step={1} value={budget} onChange={(e) => setBudget(Number(e.target.value))} aria-valuetext={budgets[budget]} />
            </div>
            <div className="field">
              <label htmlFor="message">Project details <span className="req" aria-hidden="true">*</span></label>
              <textarea id="message" name="message" key={prefill} defaultValue={prefill} placeholder="What are you trying to achieve, and by when?" aria-invalid={!!errors.message} aria-describedby={errors.message ? "message-err" : undefined} required />
              {errors.message && <span id="message-err" className="err">{errors.message}</span>}
            </div>
            <div className="hp" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input id="website" name="website" tabIndex={-1} autoComplete="off" />
            </div>
            <div className="field">
              <label className="consent">
                <input type="checkbox" name="consent" value="yes" aria-invalid={!!errors.consent} />
                <span>I agree to RedBlink contacting me about my inquiry and to the <Link href="/privacy-policy/">privacy policy</Link>. We never sell your information.</span>
              </label>
              {errors.consent && <span className="err">{errors.consent}</span>}
            </div>
            {state === "error" && <p className="form-error" role="alert">The message didn&rsquo;t send. Check your connection and try again, or email info@redblink.com.</p>}
            <div>
              <button className="btn btn-red" type="submit" disabled={state === "sending"}>
                {state === "sending" ? <><Loader2 size={18} className="spin" /> Sending</> : <>Send message <Send size={18} /></>}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
