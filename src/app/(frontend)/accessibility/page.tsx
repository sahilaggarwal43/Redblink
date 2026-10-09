import { getPage, pageMetadata } from "@/lib/content";
import { PageHero } from "@/components/PageHero";
import { site } from "@/data/site";

export const generateMetadata = () => pageMetadata("accessibility");

export default async function Accessibility() {
  const page = await getPage("accessibility");
  return (
    <>
      <PageHero title={page.hero.title || "Accessibility statement"} crumbs={[{ name: "Accessibility", path: "/accessibility/" }]} />
      <section className="section-tight" style={{ paddingTop: 0 }}>
        <div className="container prose">
          <p>RedBlink is committed to making our website usable by everyone, including people with disabilities. We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.2 Level AA.</p>
          <h2>What we do</h2>
          <ul>
            <li>Keyboard navigation with visible focus states and a skip-to-content link.</li>
            <li>Semantic headings, landmarks and labels for screen readers.</li>
            <li>Color contrast checked against AA ratios.</li>
            <li>Animations reduce automatically when your device asks for reduced motion.</li>
          </ul>
          <h2>Feedback</h2>
          <p>If something on this site is hard to use, email <a href={`mailto:${site.email}`}>{site.email}</a> or call {site.phone}. We aim to respond within two business days.</p>
        </div>
      </section>
    </>
  );
}
