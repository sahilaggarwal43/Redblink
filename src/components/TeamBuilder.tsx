"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { engagementModels } from "@/data/site";

const roles = ["AI / ML engineer", "LLM & agent developer", "Full-stack developer", "Mobile developer", "Data engineer", "UI/UX designer", "QA engineer", "Project manager"];

export function TeamBuilder() {
  const [model, setModel] = useState(1);
  const [counts, setCounts] = useState<Record<string, number>>({ "AI / ML engineer": 1, "Full-stack developer": 1, "Project manager": 1 });
  const total = useMemo(() => Object.values(counts).reduce((a, b) => a + b, 0), [counts]);
  const set = (r: string, d: number) => setCounts((c) => ({ ...c, [r]: Math.max(0, Math.min(10, (c[r] || 0) + d)) }));
  const summary = Object.entries(counts).filter(([, n]) => n > 0).map(([r, n]) => `${n} x ${r}`).join(", ");
  const href = `/contact/?service=${encodeURIComponent("Hire engineers")}&message=${encodeURIComponent(`Engagement: ${engagementModels[model].name}. Team: ${summary}.`)}`;

  return (
    <>
      <div className="models" role="group" aria-label="Engagement model">
        {engagementModels.map((m, i) => (
          <button key={m.name} type="button" className="model" aria-pressed={model === i} onClick={() => setModel(i)}>
            <small>Best for: {m.best}</small>
            <h3>{m.name}</h3>
            <p>{m.body}</p>
          </button>
        ))}
      </div>
      <div className="builder">
        <div>
          <h3 className="h-sm" style={{ marginBottom: "1rem" }}>Build your team</h3>
          <div className="roles">
            {roles.map((r) => (
              <div className="role" key={r}>
                <span>{r}</span>
                <div className="stepper">
                  <button type="button" aria-label={`Remove one ${r}`} disabled={!counts[r]} onClick={() => set(r, -1)}>−</button>
                  <output aria-live="polite">{counts[r] || 0}</output>
                  <button type="button" aria-label={`Add one ${r}`} onClick={() => set(r, 1)}>+</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="team-total">
          <span className="muted">Your team</span>
          <motion.strong key={total} initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>{total}</motion.strong>
          <span className="muted">{total === 1 ? "person" : "people"}, {engagementModels[model].name.toLowerCase()}</span>
          <Link href={total ? href : "#"} aria-disabled={!total} className="btn btn-red" style={{ marginTop: ".8rem", pointerEvents: total ? "auto" : "none", opacity: total ? 1 : 0.5 }}>
            Request this team <ArrowRight size={18} />
          </Link>
          <small className="muted">Candidates matched in about a week.</small>
        </div>
      </div>
    </>
  );
}
