import { getPage, pageMetadata } from "@/lib/content";
import { PageHero } from "@/components/PageHero";
import { site } from "@/data/site";

export const generateMetadata = () => pageMetadata("terms");

export default async function Terms() {
  const page = await getPage("terms");
  return (
    <>
      <PageHero title={page.hero.title || "Terms and conditions"} lede={page.hero.lede || "Last updated: October 2026"} crumbs={[{ name: "Terms", path: "/terms-conditions/" }]} />
      <section className="section-tight" style={{ paddingTop: 0 }}>
        <div className="container prose">
          <p>By using redblink.com you agree to these terms. Client engagements are governed by the separate agreement signed for each project.</p>
          <h2>Use of the site</h2>
          <p>You may use this site for lawful purposes. Do not attempt to disrupt it, access it without authorization or copy its content for commercial use without permission.</p>
          <h2>Content and intellectual property</h2>
          <p>Site content, logos and product names belong to RedBlink Technologies or their respective owners. Third-party names and trademarks are used for identification only.</p>
          <h2>No warranty</h2>
          <p>Information on this site is provided &ldquo;as is&rdquo; for general purposes and may change without notice. It is not legal, financial or professional advice.</p>
          <h2>Limitation of liability</h2>
          <p>To the extent permitted by law, RedBlink is not liable for indirect or consequential damages arising from use of this site.</p>
          <h2>Governing law</h2>
          <p>These terms are governed by the laws of the State of California, without regard to conflict-of-law rules.</p>
          <h2>Contact</h2>
          <p>Questions? Email <a href={`mailto:${site.email}`}>{site.email}</a>.</p>
        </div>
      </section>
    </>
  );
}
