import { getPage, pageMetadata } from "@/lib/content";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { Stats } from "@/components/Stats";
import { Cta } from "@/components/Cta";
import { products, testimonials } from "@/data/site";

export const generateMetadata = () => pageMetadata("work");

const stories = [
  { ...testimonials[0], challenge: "Support volume was growing faster than the team.", built: "An LLM chatbot trained on their help content, with handoff to live agents.", service: "ai-chatbot-development" },
  { ...testimonials[1], challenge: "Plenty of data, but no way to see what was coming.", built: "A predictive analytics tool that forecasts trends from their operational data.", service: "predictive-analytics" },
  { ...testimonials[2], challenge: "Content deadlines kept slipping.", built: "An AI writing assistant on large language models, tuned to their voice.", service: "generative-ai-integration" },
  { ...testimonials[3], challenge: "Every shopper saw the same products.", built: "A recommendation engine driven by customer behavior.", service: "machine-learning" },
];

export default async function WorkPage() {
  const page = await getPage("work");
  return (
    <>
      <PageHero
        title={page.hero.title || "Work that moved a number."}
        lede={page.hero.lede || "A selection of client projects and the products we run ourselves. Ask us for detailed case studies in your industry; many clients prefer we share them privately."}
        crumbs={[{ name: "Work", path: "/work/" }]}
      />
      <section className="section-tight">
        <div className="container"><div className="grid-2" style={{ alignItems: "stretch" }}>
          {stories.map((s, i) => (
            <Reveal key={s.name} delay={(i % 2) * 0.08} className="card">
              <span className="tag">{s.topic}</span>
              <h2 className="h-sm">{s.challenge}</h2>
              <p><strong style={{ color: "var(--ink)" }}>What we built:</strong> {s.built}</p>
              <blockquote style={{ margin: ".4rem 0 0", paddingLeft: "1rem", borderLeft: "3px solid var(--red)", color: "var(--ink-2)", fontStyle: "italic" }}>
                &ldquo;{s.quote}&rdquo;
                <footer style={{ fontStyle: "normal", marginTop: ".5rem", fontWeight: 600, color: "var(--ink)" }}>{s.name}, {s.role}</footer>
              </blockquote>
              <Link href={`/services/${s.service}/`} className="link-arrow" style={{ marginTop: ".4rem" }}>About this service <ArrowRight size={16} /></Link>
            </Reveal>
          ))}
        </div></div>
      </section>
      <section className="section">
        <div className="container"><Stats /></div>
      </section>
      <section className="section-tight">
        <div className="container">
          <h2 className="h-md" style={{ marginBottom: "1.5rem" }}>Our own products</h2>
          <div className="prod-grid">
            {products.slice(0, 3).map((p) => (
              <div key={p.id} className="prod">
                <span className="prod-kind">{p.kind}</span>
                <h3>{p.name}</h3>
                <p>{p.body}</p>
                <Link href={`/products/#${p.id}`} className="link-arrow">Learn more <ArrowRight size={16} /></Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Cta />
    </>
  );
}
