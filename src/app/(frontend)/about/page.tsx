import { getContent, getPage, pageMetadata } from "@/lib/content";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { AutocompleteTitle } from "@/components/AutocompleteTitle";
import { Reveal } from "@/components/Reveal";
import { TeamCard } from "@/components/TeamCard";
import { Stats } from "@/components/Stats";
import { Cta } from "@/components/Cta";
import { site, values } from "@/data/site";

export const generateMetadata = () => pageMetadata("about");

export default async function AboutPage() {
  const page = await getPage("about");
  const { team, settings } = await getContent();
  const aboutTitle = page.hero.title || "Engineers who care how the story ends.";
  const aboutWords = aboutTitle.split(" ");
  const aboutCut = Math.max(1, Math.ceil(aboutWords.length / 2) - 1);
  return (
    <>
      <PageHero
        title={page.hero.title || "Engineers who care how the story ends."}
        titleNode={<AutocompleteTitle typed={aboutWords.slice(0, aboutCut).join(" ")} suggestion={" " + aboutWords.slice(aboutCut).join(" ")} />}
        lede={page.hero.lede || "RedBlink is an AI software development and digital growth company. We combine deep expertise in large language models, machine learning, NLP and computer vision with practical business sense, so the things we build get used."}
        crumbs={[{ name: "About", path: "/about/" }]}
      />
      <section className="section-tight">
        <div className="container"><div className="grid-2">
          <Reveal className="card" >
            <span className="tag">Mission</span>
            <h2 className="h-sm">Empower businesses worldwide with AI and machine learning that deliver real results.</h2>
          </Reveal>
          <Reveal className="card" delay={0.08}>
            <span className="tag">Vision</span>
            <h2 className="h-sm">Drive AI adoption for the next billion users.</h2>
          </Reveal>
        </div></div>
      </section>
      <section className="section">
        <div className="container"><Stats stats={settings.stats} /></div>
      </section>
      <section className="section" style={{ background: "var(--canvas)" }}>
        <div className="container">
          <div className="sec-head">
            <span className="kicker">What we value</span>
            <h2 className="h-lg">Five commitments we hold ourselves to.</h2>
          </div>
          <div className="grid-3">
            {values.map((v, i) => (
              <Reveal key={v.title} className="card" delay={(i % 3) * 0.06}>
                <h3>{v.title}</h3>
                <p>{v.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="sec-head split">
            <div style={{ display: "grid", gap: "1rem" }}>
              <span className="kicker">Leadership and team</span>
              <h2 className="h-lg">The people you&rsquo;ll work with.</h2>
            </div>
            <p className="lede">Experienced project leaders keep delivery on time and on standard, backed by specialists in LLMs, NLP, ML, computer vision and automation.</p>
          </div>
          <div className="people">
            {team.map((m, i) => (
              <Reveal key={m.name} delay={(i % 4) * 0.05} y={16}>
                <TeamCard m={m} />
              </Reveal>
            ))}
          </div>
          <div style={{ marginTop: "2.5rem" }}><Link className="btn btn-ghost" href="/careers/">Join the team <ArrowRight size={18} /></Link></div>
        </div>
      </section>
      <section className="section-tight">
        <div className="container">
          <div className="sec-head"><span className="kicker">Offices</span><h2 className="h-md">Where to find us.</h2></div>
          <div className="grid-3">
            {site.offices.map((o) => (
              <div key={o.label} className="card">
                <span className="tag">{o.label}</span>
                <p style={{ color: "var(--ink)", fontSize: "var(--t-md)" }}>{o.lines.map((l) => <span key={l} style={{ display: "block" }}>{l}</span>)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Cta />
    </>
  );
}
