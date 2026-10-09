import { getPage, pageMetadata } from "@/lib/content";
import { ArrowRight, Mail } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { site } from "@/data/site";

export const generateMetadata = () => pageMetadata("careers");

const tracks = [
  { t: "AI and ML engineering", d: "LLM apps, agents, RAG, fine-tuning, MLOps and data engineering." },
  { t: "Full-stack and mobile", d: "React, Next.js, Node.js, Python, React Native, Flutter, Swift and Kotlin." },
  { t: "Design", d: "Product design, UX research and design systems, including AI interfaces." },
  { t: "QA and DevOps", d: "Test automation, CI/CD, cloud infrastructure and security." },
  { t: "Delivery", d: "Project and product managers who keep US clients informed and projects on track." },
  { t: "Growth", d: "SEO, generative engine optimization, PPC and content." },
];

const perks = [
  "Continuous training on the newest models and tools",
  "Work on real products used by millions",
  "Direct collaboration with US clients",
  "Town halls, celebrations and a team that has fun",
];

export default async function CareersPage() {
  const page = await getPage("careers");
  return (
    <>
      <PageHero
        title={page.hero.title || "Build what's next with a team of thinkers."}
        lede={page.hero.lede || "We look for curious, skilled people and give them continuous training, interesting problems and real ownership."}
        crumbs={[{ name: "Careers", path: "/careers/" }]}
      >
        <div className="hero-ctas">
          <a className="btn btn-red" href={`mailto:${site.careersEmail}?subject=Job%20application`}><Mail size={18} /> Send your resume</a>
        </div>
      </PageHero>
      <section className="section-tight">
        <div className="container">
          <h2 className="h-md" style={{ marginBottom: "1.5rem" }}>Teams we hire for</h2>
          <div className="grid-3">
            {tracks.map((t, i) => (
              <Reveal key={t.t} className="card" delay={(i % 3) * 0.06}>
                <h3>{t.t}</h3>
                <p>{t.d}</p>
                <a className="link-arrow" href={`mailto:${site.careersEmail}?subject=${encodeURIComponent("Application: " + t.t)}`}>Apply <ArrowRight size={16} /></a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="section" style={{ background: "var(--canvas)" }}>
        <div className="container"><div className="grid-2">
          <div style={{ display: "grid", gap: "1rem" }}>
            <span className="kicker">Life at RedBlink</span>
            <h2 className="h-lg">Hard problems, good people.</h2>
            <p className="lede">Our selection process has several stages and we never compromise on skill. Once you&rsquo;re in, we invest in you.</p>
          </div>
          <ul className="uses">
            {perks.map((p) => <li key={p}>{p}</li>)}
          </ul>
        </div></div>
      </section>
    </>
  );
}
