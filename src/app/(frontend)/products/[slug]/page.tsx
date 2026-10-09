import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { Cta } from "@/components/Cta";
import { Faq } from "@/components/Faq";
import { ProductVisual } from "@/components/ProductVisual";
import { JsonLd } from "@/components/JsonLd";
import { getContent, buildMetadata, extraJsonLd } from "@/lib/content";
import { productList } from "@/data/products";
import { SITE_URL } from "@/data/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const c = await getContent().catch(() => null);
  return (c?.products || productList).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const p = (await getContent()).products.find((x) => x.slug === slug);
  if (!p) return {};
  return buildMetadata({ seo: p.seo, title: `${p.name}: ${p.kind}`, description: p.summary, path: `/products/${p.slug}/` });
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const c = await getContent();
  const p = c.products.find((x) => x.slug === slug);
  if (!p) notFound();
  const external = p.href.startsWith("http");
  const others = c.products.filter((x) => x.slug !== p.slug).slice(0, 3);
  const ld = {
    "@context": "https://schema.org", "@type": "SoftwareApplication", name: p.name, applicationCategory: "BusinessApplication",
    description: p.description || p.summary, url: `${SITE_URL}/products/${p.slug}/`, publisher: { "@id": `${SITE_URL}/#organization` },
  };
  return (
    <>
      <PageHero
        title={p.name}
        lede={p.tagline}
        crumbs={[{ name: "Products", path: "/products/" }, { name: p.name, path: `/products/${p.slug}/` }]}
        aside={<ProductVisual p={p} />}
      >
        <span className="prod-kind" style={{ display: "block", marginTop: "1rem" }}>{p.kind}</span>
        <div className="hero-ctas">
          <a href={p.href} className="btn btn-red" {...(external ? { target: "_blank", rel: "noopener" } : {})}>{p.ctaLabel} {external ? <ArrowUpRight size={18} /> : <ArrowRight size={18} />}</a>
          <Link href={`/contact/?topic=${encodeURIComponent(p.name)}`} className="btn btn-ghost">Talk to our team</Link>
        </div>
      </PageHero>

      <section className="section-tight">
        <div className="container pdetail-overview">
          <Reveal><span className="kicker">Overview</span></Reveal>
          <Reveal delay={0.05}><p className="pdetail-lead">{p.description || p.summary}</p></Reveal>
        </div>
      </section>

      {p.features.length > 0 && (
        <section className="section on-canvas" aria-labelledby="pf-title">
          <div className="container">
            <Reveal className="sec-head"><span className="kicker">Features</span><h2 id="pf-title" className="h-lg">What {p.name} does for you.</h2></Reveal>
            <div className="pfeatures">
              {p.features.map((f, i) => (
                <Reveal key={f.title} delay={(i % 2) * 0.06} className="pfeature">
                  <span className="pfeature-n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  <h3>{f.title}</h3>
                  <p>{f.body}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {(p.steps.length > 0 || p.audiences.length > 0) && (
        <section className="section" aria-label="How it works and who it's for">
          <div className="container psplit">
            {p.steps.length > 0 && (
              <div>
                <Reveal><span className="kicker">How it works</span><h2 className="h-md" style={{ marginTop: "1.25rem" }}>{["", "One step", "Two steps", "Three steps", "Four steps", "Five steps"][p.steps.length] || `${p.steps.length} steps`} to get going.</h2></Reveal>
                <ol className="psteps">
                  {p.steps.map((s, i) => (
                    <Reveal key={s.title} delay={i * 0.08}><li><span className="psteps-n">{i + 1}</span><div><h3>{s.title}</h3><p>{s.body}</p></div></li></Reveal>
                  ))}
                </ol>
              </div>
            )}
            {p.audiences.length > 0 && (
              <Reveal delay={0.1} className="paud">
                <span className="kicker">Who it&rsquo;s for</span>
                <ul>{p.audiences.map((a) => <li key={a}><Check size={18} aria-hidden="true" />{a}</li>)}</ul>
                <a href={p.href} className="btn btn-red" {...(external ? { target: "_blank", rel: "noopener" } : {})}>{p.ctaLabel} <ArrowUpRight size={18} /></a>
              </Reveal>
            )}
          </div>
        </section>
      )}

      {p.faqs.length > 0 && (
        <section className="section on-canvas" aria-labelledby="pq-title">
          <div className="container faq">
            <div style={{ display: "grid", gap: "1.25rem", alignContent: "start" }}><span className="kicker">FAQ</span><h2 id="pq-title" className="h-md">{p.name} questions.</h2></div>
            <Faq items={p.faqs} />
          </div>
        </section>
      )}

      <section className="section" aria-labelledby="more-p">
        <div className="container">
          <Reveal className="sec-head"><span className="kicker">More from RedBlink</span><h2 id="more-p" className="h-md">Other products we run.</h2></Reveal>
          <div className="pcards">
            {others.map((o) => (
              <Link key={o.slug} href={`/products/${o.slug}/`} className="pcard">
                <span className="pcard-top"><span className="pv-mono sm">{o.name.replace(/[^A-Za-z0-9]/g, "").slice(0, 2)}</span><span className="prod-kind">{o.kind}</span></span>
                <h3>{o.name}</h3>
                <p>{o.summary}</p>
                <span className="link-arrow">See {o.name} <ArrowRight size={16} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Cta title={`Want something like ${p.name}, built for your business?`} body="We bring the same engineering we use on our own platforms to yours. Tell us what you want to build." />
      <JsonLd data={[ld, ...(extraJsonLd(p.seo) ? [extraJsonLd(p.seo)!] : [])]} />
    </>
  );
}
