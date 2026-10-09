import { getContent, getPage, pageMetadata } from "@/lib/content";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { OpportunityRadar } from "@/components/OpportunityRadar";
import { Reveal } from "@/components/Reveal";
import { Cta } from "@/components/Cta";

export const generateMetadata = () => pageMetadata("industries");

export default async function IndustriesPage() {
  const page = await getPage("industries");
  const { industries } = await getContent();
  return (
    <>
      <PageHero
        title={page.hero.title || "AI that understands how your industry works."}
        lede={page.hero.lede || "Compliance requirements, legacy systems and the way your customers buy are different in every sector. We design for those realities from day one."}
        crumbs={[{ name: "Industries", path: "/industries/" }]}
        aside={<OpportunityRadar industries={industries} />}
      />
      <div className="jump">
        <div className="container jump-inner">
          {industries.map((i) => <a key={i.id} href={`#${i.id}`}>{i.name}</a>)}
        </div>
      </div>
      <section className="section-tight">
        <div className="container">
          {industries.map((ind) => (
            <Reveal key={ind.id}>
              <article id={ind.id} className="ind-detail">
                <h2>{ind.name}</h2>
                <div>
                  <p className="lede">{ind.body}</p>
                  <ul>{ind.examples.map((e) => <li key={e}>{e}</li>)}</ul>
                  <div style={{ marginTop: "1.4rem" }}>
                    <Link className="link-arrow" href={`/contact/?industry=${encodeURIComponent(ind.name)}`}>Discuss {ind.name} use cases <ArrowRight size={16} /></Link>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
      <Cta />
    </>
  );
}
