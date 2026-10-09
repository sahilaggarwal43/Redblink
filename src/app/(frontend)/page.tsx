import Link from "next/link";
import { ArrowRight, Check, Gauge, ShieldCheck, Activity, Lock } from "lucide-react";
import { Hero } from "@/components/Hero";
import { AgentConsole } from "@/components/AgentConsole";
import { CapabilityIndex } from "@/components/CapabilityIndex";
import { AgentFlow } from "@/components/AgentFlow";
import { Stats } from "@/components/Stats";
import { Process } from "@/components/Process";
import { Testimonials } from "@/components/Testimonials";
import { Faq } from "@/components/Faq";
import { DiffusionCta } from "@/components/DiffusionCta";
import { EmbeddingMap } from "@/components/EmbeddingMap";
import { TrainingCurve } from "@/components/TrainingCurve";
import { LatestPosts } from "@/components/LatestPosts";
import { Reveal } from "@/components/Reveal";
import { JsonLd } from "@/components/JsonLd";
import { site } from "@/data/site";
import { getContent, getPage, pageMetadata, section, extraJsonLd } from "@/lib/content";
import { TeamCard } from "@/components/TeamCard";
import { faqLd, localBusinessLd } from "@/lib/seo";

export const revalidate = 3600;

const productionPoints = [
  { icon: Gauge, t: "Evaluated before it ships", d: "Every agent and model runs against a test suite built from your real cases, with accuracy and cost per task tracked on each release." },
  { icon: ShieldCheck, t: "Guardrails and human approval", d: "Spend limits, permission scopes and approval steps for anything that touches money, customers or records." },
  { icon: Activity, t: "Observable in production", d: "Tracing, drift alerts and dashboards your team can read, with a named engineer accountable after launch." },
  { icon: Lock, t: "Your data stays yours", d: "Zero-retention model agreements, private deployments in your cloud, and NDAs or BAAs when you need them." },
];

export const generateMetadata = () => pageMetadata("home");

export default async function Home() {
  const [c, page] = await Promise.all([getContent(), getPage("home")]);
  const S = (k: string) => section(page, k);
  const services = c.services, products = c.products, team = c.team.filter((m) => m.showOnHome).slice(0, 4), homeFaqs = c.faqs;
  return (
    <>
      <Hero eyebrow={page.hero.eyebrow || undefined} title={page.hero.title || undefined} lede={page.hero.lede || undefined} />

      <section className="section" aria-labelledby="demo-title">
        <div className="container demo">
          <Reveal>
            <span className="kicker">{S("demo").kicker}</span>
            <h2 id="demo-title" className="h-lg" style={{ marginTop: "1.25rem" }}>{S("demo").heading}</h2>
            <p className="lede" style={{ marginTop: "1.25rem" }}>{S("demo").body}</p>
            <ul className="demo-points">
              <li><b><Check size={15} strokeWidth={3} /></b><span>Connects to the tools you already use: Zendesk, Salesforce, NetSuite, Stripe and more.</span></li>
              <li><b><Check size={15} strokeWidth={3} /></b><span>Every step is logged and explainable, so audits and reviews are simple.</span></li>
              <li><b><Check size={15} strokeWidth={3} /></b><span>Risky actions always wait for a person. You set the rules.</span></li>
            </ul>
          </Reveal>
          <Reveal delay={0.15}><AgentConsole /></Reveal>
        </div>
      </section>

      <section className="section on-canvas" id="capabilities" aria-labelledby="cap-title">
        <div className="container capx">
          <div className="capx-intro">
            <span className="kicker">{S("capabilities").kicker}</span>
            <h2 id="cap-title" className="h-md">{S("capabilities").heading}</h2>
            <p className="lede">{S("capabilities").body}</p>
            <div><Link href="/services/" className="btn btn-dark">All services <ArrowRight size={18} /></Link></div>
          </div>
          <CapabilityIndex services={services} />
        </div>
      </section>

      <section className="section on-dark" aria-labelledby="prodn-title">
        <div className="container prod-sec">
          <Reveal>
            <span className="kicker">{S("production").kicker}</span>
            <h2 id="prodn-title" className="h-lg" style={{ marginTop: "1.25rem", color: "#fff" }}>{S("production").heading}</h2>
            <p className="lede" style={{ marginTop: "1.5rem" }}>{S("production").body}</p>
            <ul className="prod-points">
              {productionPoints.map(({ icon: Icon, t, d }) => (
                <li key={t}><Icon size={20} aria-hidden="true" /><div><strong>{t}</strong><span>{d}</span></div></li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.15}><AgentFlow /></Reveal>
        </div>
      </section>

      <section className="section on-red band-red" aria-labelledby="scale-title">
        <div className="container">
          <span className="kicker">{S("track-record").kicker}</span>
          <h2 id="scale-title" className="band-statement" style={{ marginTop: "1.5rem" }}>{S("track-record").heading}</h2>
          <Stats stats={c.settings.stats} />
        </div>
      </section>

      <section className="section on-canvas" aria-labelledby="process-title">
        <div className="container process">
          <div className="process-sticky">
            <span className="kicker">{S("process").kicker}</span>
            <h2 id="process-title" className="h-lg">{S("process").heading}</h2>
            <p className="lede">{S("process").body}</p>
            <div><Link href="/contact/" className="btn btn-red">Start with discovery <ArrowRight size={18} /></Link></div>
            <TrainingCurve />
          </div>
          <Process />
        </div>
      </section>

      <section className="section" aria-labelledby="ind-title">
        <div className="container">
          <Reveal className="sec-head split">
            <div style={{ display: "grid", gap: "1.25rem" }}>
              <span className="kicker">{S("industries").kicker}</span>
              <h2 id="ind-title" className="h-lg">{S("industries").heading}</h2>
            </div>
            <p className="lede">{S("industries").body}</p>
          </Reveal>
          <EmbeddingMap industries={c.industries} />
        </div>
      </section>

      <section className="section on-dark" aria-labelledby="prod-title">
        <div className="container">
          <Reveal className="sec-head split">
            <div style={{ display: "grid", gap: "1.25rem" }}>
              <span className="kicker">{S("products").kicker}</span>
              <h2 id="prod-title" className="h-lg" style={{ color: "#fff" }}>{S("products").heading}</h2>
            </div>
            <p className="lede">{S("products").body}</p>
          </Reveal>
          <div className="prod-grid">
            {products.slice(0, 5).map((p, i) => (
              <div key={p.slug} className={`prod ${i === 0 ? "feature" : ""}`}>
                <span className="prod-kind">{p.kind}</span>
                <h3>{p.name}</h3>
                <p>{p.summary}</p>
                <Link href={`/products/${p.slug}/`} className="link-arrow">Learn more <ArrowRight size={16} /></Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="team-title">
        <div className="container">
          <Reveal className="sec-head split">
            <div style={{ display: "grid", gap: "1.25rem" }}>
              <span className="kicker">{S("leadership").kicker}</span>
              <h2 id="team-title" className="h-lg">{S("leadership").heading}</h2>
            </div>
            <div style={{ display: "grid", gap: "1.25rem", justifyItems: "start" }}>
              <p className="lede">{S("leadership").body}</p>
              <Link href="/about/" className="link-arrow">Meet the full team <ArrowRight size={16} /></Link>
            </div>
          </Reveal>
          <div className="people">
            {team.slice(0, 4).map((m, i) => (
              <Reveal key={m.name} delay={i * 0.06} y={16}><TeamCard m={m} /></Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section on-canvas" aria-labelledby="quotes-title">
        <div className="container faq">
          <div style={{ display: "grid", gap: "1.25rem", alignContent: "start" }}>
            <span className="kicker">{S("testimonials").kicker}</span>
            <h2 id="quotes-title" className="h-md">{S("testimonials").heading}</h2>
          </div>
          <Testimonials testimonials={c.testimonials} />
        </div>
      </section>

      <section className="section" aria-labelledby="blog-title">
        <div className="container">
          <Reveal className="sec-head split">
            <div style={{ display: "grid", gap: "1.25rem" }}>
              <span className="kicker">{S("insights").kicker}</span>
              <h2 id="blog-title" className="h-md">{S("insights").heading}</h2>
            </div>
            <div style={{ justifySelf: "end" }}>
              <a href={site.blogUrl} className="btn btn-ghost">All insights <ArrowRight size={18} /></a>
            </div>
          </Reveal>
          <LatestPosts />
        </div>
      </section>

      <section className="section" aria-labelledby="faq-title">
        <div className="container faq">
          <div style={{ display: "grid", gap: "1.25rem", alignContent: "start" }}>
            <span className="kicker">{S("faq").kicker}</span>
            <h2 id="faq-title" className="h-md">{S("faq").heading}</h2>
            <p className="muted">Something else on your mind? <Link href="/contact/" className="link-arrow">Ask an engineer</Link></p>
          </div>
          <Faq items={homeFaqs} />
        </div>
      </section>

      <DiffusionCta body={S("cta").body || undefined} />
      <JsonLd data={[localBusinessLd(), faqLd(homeFaqs), ...(extraJsonLd(page.seo) ? [extraJsonLd(page.seo)!] : [])]} />
    </>
  );
}
