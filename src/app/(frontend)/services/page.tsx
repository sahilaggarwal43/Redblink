import { getContent, getPage, pageMetadata } from "@/lib/content";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { Cta } from "@/components/Cta";
import { ProblemMatcher } from "@/components/ProblemMatcher";
import { SemanticSearch } from "@/components/SemanticSearch";
import { ServiceIcon } from "@/components/ServiceIcon";
import { JsonLd } from "@/components/JsonLd";
import { categories } from "@/data/services";
import { SITE_URL } from "@/data/site";

export const generateMetadata = () => pageMetadata("services");

export default async function ServicesPage() {
  const page = await getPage("services");
  const { services } = await getContent();
  return (
    <>
      <PageHero
        title={page.hero.title || "Every service you need to put AI to work."}
        lede={page.hero.lede || "Thirty-one services across five practices, delivered by one team with shared standards for security, quality and speed."}
        crumbs={[{ name: "Services", path: "/services/" }]}
      >
        <SemanticSearch services={services} />
      </PageHero>
      <div className="jump">
        <div className="container jump-inner">
          {categories.map((c) => (
            <a key={c.id} href={`#${c.id}`}>{c.name}</a>
          ))}
        </div>
      </div>
      <div className="container" style={{ paddingTop: "2rem" }}>
        {categories.map((c) => (
          <section key={c.id} id={c.id} className="cat-block" aria-labelledby={`h-${c.id}`}>
            <div>
              <span className="kicker">{services.filter((s) => s.category === c.id).length} services</span>
              <h2 id={`h-${c.id}`}>{c.name}</h2>
              <p className="muted">{c.blurb}</p>
            </div>
            <div className="cat-links">
              {services.filter((s) => s.category === c.id).map((s, i) => (
                <Reveal key={s.slug} delay={(i % 2) * 0.05} y={16}>
                  <Link href={`/services/${s.slug}/`}>
                    <strong>
                      <span style={{ color: "var(--red)" }}><ServiceIcon slug={s.slug} size={18} /></span>
                      {s.title}
                      
                    </strong>
                    <span>{s.short}</span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </section>
        ))}
      </div>
      <section className="section-tight">
        <div className="container"><ProblemMatcher /></div>
      </section>
      <Cta />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: services.map((s, i) => ({ "@type": "ListItem", position: i + 1, name: s.title, url: `${SITE_URL}/services/${s.slug}/` })),
        }}
      />
    </>
  );
}
