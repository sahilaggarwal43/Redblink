import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, Phone, Mail } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { BuildTerminal } from "@/components/BuildTerminal";
import { Reveal } from "@/components/Reveal";
import { Faq } from "@/components/Faq";
import { Cta } from "@/components/Cta";
import { Process } from "@/components/Process";
import { JsonLd } from "@/components/JsonLd";
import { categories, services as staticServices } from "@/data/services";
import { getContent, buildMetadata, extraJsonLd } from "@/lib/content";
import { site } from "@/data/site";
import { faqLd, serviceLd } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const c = await getContent().catch(() => null);
  return (c?.services || staticServices).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const s = (await getContent()).services.find((x) => x.slug === slug);
  if (!s) return {};
  return buildMetadata({
    seo: s.seo,
    title: `${s.title} Services`,
    description: `${s.short} ${s.intro.split(". ")[0]}.`.slice(0, 158),
    path: `/services/${s.slug}/`,
    keywords: s.keywords,
  });
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const { services } = await getContent();
  const s = services.find((x) => x.slug === slug);
  if (!s) notFound();
  const cat = categories.find((c) => c.id === s.category)!;
  const related = services.filter((x) => x.category === s.category && x.slug !== s.slug).slice(0, 3);

  return (
    <>
      <PageHero title={s.headline} lede={s.intro} crumbs={[{ name: "Services", path: "/services/" }, { name: s.title, path: `/services/${s.slug}/` }]} aside={<BuildTerminal slug={s.slug} title={s.title} stack={s.stack} capabilities={s.capabilities.map((c) => c.t)} />}>
        <div className="hero-ctas">
          <Link href={`/contact/?service=${encodeURIComponent(s.title)}`} className="btn btn-red">Discuss your project <ArrowRight size={18} /></Link>
          <Link href={`/services/#${cat.id}`} className="btn btn-ghost">All {cat.name} services</Link>
        </div>
      </PageHero>

      <section className="section" style={{ paddingTop: "1rem" }}>
        <div className="container svc-detail">
          <div>
            <div className="block">
              <h2>What we deliver</h2>
              <div className="caps">
                {s.capabilities.map((c, i) => (
                  <Reveal key={c.t} className="cap" delay={i * 0.05} y={18}>
                    <h3>{c.t}</h3>
                    <p>{c.d}</p>
                  </Reveal>
                ))}
              </div>
            </div>
            <div className="block">
              <h2>Where clients use it</h2>
              <ul className="uses">
                {s.useCases.map((u) => (
                  <li key={u}><CheckCircle2 size={20} aria-hidden="true" /> {u}</li>
                ))}
              </ul>
            </div>
            <div className="block">
              <h2>Tools and platforms</h2>
              <div className="stack">{s.stack.map((t) => <span key={t}>{t}</span>)}</div>
            </div>
            <div className="block">
              <h2>How an engagement runs</h2>
              <Process />
            </div>
            <div className="block">
              <h2>{s.title} FAQ</h2>
              <Faq items={s.faqs} />
            </div>
          </div>
          <aside className="aside-card" aria-label="Talk to us">
            <h2 className="h-sm">Talk to a {s.category === "growth" ? "strategist" : "senior engineer"}</h2>
            <p>Free 30-minute consultation. We&rsquo;ll tell you honestly whether this is the right fit for your goals and what it would take.</p>
            <Link href={`/contact/?service=${encodeURIComponent(s.title)}`} className="btn btn-light">Book a consultation</Link>
            <hr />
            <a className="plain" href={site.phoneHref}><Phone size={16} /> {site.phone}</a>
            <a className="plain" href={`mailto:${site.salesEmail}?subject=${encodeURIComponent(s.title)}`}><Mail size={16} /> {site.salesEmail}</a>
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section-tight">
          <div className="container">
            <h2 className="h-sm" style={{ marginBottom: "1.2rem" }}>Related services</h2>
            <div className="related">
              {related.map((r) => (
                <Link key={r.slug} href={`/services/${r.slug}/`}>
                  <strong>{r.title}</strong>
                  <span>{r.short}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      <Cta title={`Ready to scope your ${s.title} project?`} />
      <JsonLd data={[serviceLd(s), faqLd(s.faqs), ...(extraJsonLd(s.seo) ? [extraJsonLd(s.seo)!] : [])]} />
    </>
  );
}
