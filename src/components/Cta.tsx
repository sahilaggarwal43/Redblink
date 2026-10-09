import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { site } from "@/data/site";
import { Reveal } from "./Reveal";

export function Cta({ title = "Have an AI idea? Let's test it on your data.", body = "Book a free 30-minute consultation. You'll talk to a senior engineer, not a salesperson, and leave with a clear next step." }: { title?: string; body?: string }) {
  return (
    <section className="section-tight">
      <div className="container">
        <Reveal className="cta">
          <div className="cta-copy">
            <h2>{title}</h2>
            <p>{body}</p>
          </div>
          <div className="cta-actions">
            <Link href="/contact/" className="btn btn-light">Book a free consultation <ArrowRight size={18} /></Link>
            <a href={site.phoneHref} className="btn btn-ghost"><Phone size={18} /> {site.phone}</a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
