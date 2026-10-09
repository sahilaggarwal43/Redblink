"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { testimonials as staticTestimonials } from "@/data/site";

export function Testimonials({ testimonials = staticTestimonials }: { testimonials?: { name: string; role: string; quote: string; topic: string }[] }) {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const go = (n: number) => {
    setDir(n > i || (i === testimonials.length - 1 && n === 0) ? 1 : -1);
    setI((n + testimonials.length) % testimonials.length);
  };
  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => go(i + 1), 7000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, paused]);
  const t = testimonials[i];
  return (
    <div className="quotes" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <div className="quote-stage" aria-roledescription="carousel" aria-label="Client testimonials">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.figure
            key={i}
            className="quote"
            style={{ margin: 0 }}
            custom={dir}
            initial={{ opacity: 0, x: dir * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -40 }}
            transition={{ duration: 0.45, ease: [0.2, 0.7, 0.1, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(_, info) => { if (info.offset.x < -60) go(i + 1); else if (info.offset.x > 60) go(i - 1); }}
          >
            <span className="kicker">{t.topic}</span>
            <blockquote style={{ marginTop: "1rem" }}>&ldquo;{t.quote}&rdquo;</blockquote>
            <figcaption>
              <span className="avatar" aria-hidden="true">{t.name[0]}</span>
              <span><strong>{t.name}</strong><span>{t.role}</span></span>
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>
      <div className="q-controls">
        <div className="q-dots">
          {testimonials.map((x, n) => (
            <button key={x.name} className="q-dot" aria-label={`Show testimonial ${n + 1}`} aria-current={n === i} onClick={() => go(n)} />
          ))}
        </div>
        <button className="q-btn" aria-label="Previous testimonial" onClick={() => go(i - 1)}><ArrowLeft size={20} /></button>
        <button className="q-btn" aria-label="Next testimonial" onClick={() => go(i + 1)}><ArrowRight size={20} /></button>
      </div>
    </div>
  );
}
