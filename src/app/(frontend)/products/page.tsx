import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { Cta } from "@/components/Cta";
import { ProductVisual } from "@/components/ProductVisual";
import { JsonLd } from "@/components/JsonLd";
import { getContent, getPage, pageMetadata, section, extraJsonLd } from "@/lib/content";
import { SITE_URL } from "@/data/site";

export const generateMetadata = () => pageMetadata("products");

export default async function ProductsPage() {
  const [c, page] = await Promise.all([getContent(), getPage("products")]);
  const featured = c.products.filter((p) => p.featured);
  const rest = c.products.filter((p) => !p.featured);
  const sFeat = section(page, "featured"), sMore = section(page, "more"), sCta = section(page, "cta");
  const ld = {
    "@context": "https://schema.org", "@type": "ItemList", name: "RedBlink products",
    itemListElement: c.products.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE_URL}/products/${p.slug}/`, name: p.name })),
  };
  return (
    <>
      <PageHero title={page.hero.title || ""} lede={page.hero.lede || ""} crumbs={[{ name: "Products", path: "/products/" }]}>
        <nav className="pjump" aria-label="Jump to a product">
          {c.products.map((p) => <Link key={p.slug} href={`/products/${p.slug}/`}>{p.name}</Link>)}
        </nav>
      </PageHero>

      <section className="section" aria-labelledby="feat-title">
        <div className="container">
          <Reveal className="sec-head">
            <span className="kicker">{sFeat.kicker}</span>
            <h2 id="feat-title" className="h-lg">{sFeat.heading}</h2>
          </Reveal>
          <div className="pfeat-list">
            {featured.map((p, i) => (
              <Reveal key={p.slug} className={`pfeat ${i % 2 ? "flip" : ""}`}>
                <div className="pfeat-copy">
                  <span className="prod-kind">{p.kind}</span>
                  <h3 className="h-lg">{p.name}</h3>
                  <p className="pfeat-tag">{p.tagline}</p>
                  <p className="pfeat-sum">{p.summary}</p>
                  <ul className="pfeat-points">
                    {p.features.slice(0, 4).map((f) => <li key={f.title}><b>{f.title}</b><span>{f.body}</span></li>)}
                  </ul>
                  <div className="hero-ctas">
                    <Link href={`/products/${p.slug}/`} className="btn btn-red">Explore {p.name} <ArrowRight size={18} /></Link>
                    <a href={p.href} className="link-arrow" {...(p.href.startsWith("http") ? { target: "_blank", rel: "noopener" } : {})}>{p.ctaLabel} <ArrowUpRight size={16} /></a>
                  </div>
                </div>
                <div className="pfeat-visual"><ProductVisual p={p} /></div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {rest.length > 0 && (
        <section className="section on-canvas" aria-labelledby="more-title">
          <div className="container">
            <Reveal className="sec-head">
              <span className="kicker">{sMore.kicker}</span>
              <h2 id="more-title" className="h-lg">{sMore.heading}</h2>
            </Reveal>
            <div className="pcards">
              {rest.map((p, i) => (
                <Reveal key={p.slug} delay={(i % 3) * 0.06}>
                  <Link href={`/products/${p.slug}/`} className="pcard">
                    <span className="pcard-top"><span className="pv-mono sm">{p.name.replace(/[^A-Za-z0-9]/g, "").slice(0, 2)}</span><span className="prod-kind">{p.kind}</span></span>
                    <h3>{p.name}</h3>
                    <p className="pcard-tag">{p.tagline}</p>
                    <p>{p.summary}</p>
                    <span className="link-arrow">See {p.name} <ArrowRight size={16} /></span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <Cta title={sCta.heading || ""} body={sCta.body || ""} />
      <JsonLd data={[ld, ...(extraJsonLd(page.seo) ? [extraJsonLd(page.seo)!] : [])]} />
    </>
  );
}
