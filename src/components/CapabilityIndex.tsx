"use client";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Plus } from "lucide-react";
import { categories, services as staticServices, type CategoryId } from "@/data/services";

export function CapabilityIndex({ services = staticServices }: { services?: { slug: string; title: string; category: CategoryId }[] }) {
  const [open, setOpen] = useState<CategoryId | null>("genai");
  return (
    <div className="capx-list">
      {categories.map((c) => {
        const list = services.filter((s) => s.category === c.id);
        const isOpen = open === c.id;
        return (
          <div className={`capx-row ${isOpen ? "open" : ""}`} key={c.id}>
            <h3 style={{ margin: 0 }}>
              <button className="capx-head" aria-expanded={isOpen} aria-controls={`capx-${c.id}`} onClick={() => setOpen(isOpen ? null : c.id)}>
                <span className="capx-name">{c.name}</span>
                <span className="capx-count">{list.length} services</span>
                <span className="capx-toggle" aria-hidden="true"><Plus size={18} /></span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`capx-${c.id}`}
                  className="capx-body"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="capx-body-inner">
                    <div style={{ display: "grid", gap: "1.25rem", alignContent: "start" }}>
                      <p className="capx-blurb">{c.blurb}</p>
                      <Link href={`/services/#${c.id}`} className="link-arrow">Explore the practice <ArrowRight size={16} /></Link>
                    </div>
                    <ul className="capx-links">
                      {list.map((s) => (
                        <li key={s.slug}>
                          <Link href={`/services/${s.slug}/`}>{s.title} <ArrowRight size={15} /></Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
