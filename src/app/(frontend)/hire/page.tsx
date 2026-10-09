import { getPage, pageMetadata } from "@/lib/content";
import { PageHero } from "@/components/PageHero";
import { TeamBuilder } from "@/components/TeamBuilder";
import { Reveal } from "@/components/Reveal";
import { Faq } from "@/components/Faq";
import { Cta } from "@/components/Cta";
import { JsonLd } from "@/components/JsonLd";
import { faqLd, pageMeta } from "@/lib/seo";

export const generateMetadata = () => pageMetadata("hire");

const faqs = [
  { q: "How fast can engineers start?", a: "Typically within one to two weeks of agreeing on the profile, after you interview and approve candidates." },
  { q: "Do engineers work US hours?", a: "Every engineer keeps a daily overlap with your team for standups and collaboration, usually covering US Pacific or Eastern mornings." },
  { q: "Who owns the work?", a: "You do. All code, IP and deliverables belong to you, covered by NDA and IP assignment." },
  { q: "Can we scale the team up or down?", a: "Yes, with 30 days' notice. Replacements are free if someone isn't the right fit." },
];

const why = [
  { t: "Vetted for AI work", d: "Every candidate passes practical tests on LLMs, retrieval, agents or ML, not just a resume screen." },
  { t: "Interview before you commit", d: "You meet and approve every engineer. No surprises." },
  { t: "Managed delivery", d: "A RedBlink delivery lead watches quality, so you get results, not just hours." },
];

export default async function HirePage() {
  const page = await getPage("hire");
  return (
    <>
      <PageHero
        title={page.hero.title || "Hire AI engineers who've shipped real products."}
        lede={page.hero.lede || "ChatGPT and LLM developers, machine learning engineers, full-stack and mobile developers: add one specialist or a full team, managed by people who've done this for years."}
        crumbs={[{ name: "Hire engineers", path: "/hire/" }]}
      />
      <section className="section-tight">
        <div className="container">
          <TeamBuilder />
        </div>
      </section>
      <section className="section">
        <div className="container">
          <h2 className="h-md" style={{ marginBottom: "1.5rem" }}>Why teams hire through RedBlink</h2>
          <div className="grid-3">
            {why.map((w, i) => (
              <Reveal key={w.t} className="card" delay={i * 0.06}><h3>{w.t}</h3><p>{w.d}</p></Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="section-tight">
        <div className="container faq">
          <h2 className="h-md">Hiring FAQ</h2>
          <Faq items={faqs} />
        </div>
      </section>
      <Cta />
      <JsonLd data={faqLd(faqs)} />
    </>
  );
}
