import { getPage, pageMetadata } from "@/lib/content";
import { PageHero } from "@/components/PageHero";
import { site } from "@/data/site";

export const generateMetadata = () => pageMetadata("privacy");

export default async function Privacy() {
  const page = await getPage("privacy");
  return (
    <>
      <PageHero title={page.hero.title || "Privacy policy"} lede={page.hero.lede || "Last updated: October 2026"} crumbs={[{ name: "Privacy policy", path: "/privacy-policy/" }]} />
      <section className="section-tight" style={{ paddingTop: 0 }}>
        <div className="container prose">
          <p>RedBlink Technologies (&ldquo;RedBlink,&rdquo; &ldquo;we&rdquo;) respects your privacy. This policy explains what we collect when you visit redblink.com or contact us, how we use it and the choices you have.</p>
          <h2>Information we collect</h2>
          <ul>
            <li>Information you give us, such as your name, email, phone, company and project details when you fill out a form or email us.</li>
            <li>Usage information, such as pages viewed, device and browser type and approximate location, collected through cookies and analytics if you allow them.</li>
          </ul>
          <h2>How we use it</h2>
          <ul>
            <li>To respond to inquiries, provide proposals and deliver services.</li>
            <li>To improve our website and understand which content is useful.</li>
            <li>To send occasional updates if you opt in. You can unsubscribe at any time.</li>
          </ul>
          <h2>Sharing</h2>
          <p>We share information only with service providers who help us run our business (for example, email, CRM and hosting providers) under contracts that protect it, or when required by law. We do not sell personal information.</p>
          <h2 id="your-privacy-choices">Your privacy choices and California rights</h2>
          <p>If you are a California resident, the CCPA/CPRA gives you the right to know what personal information we collect, to request deletion or correction, to opt out of the sale or sharing of personal information and to not be discriminated against for exercising these rights. Residents of other states with privacy laws, such as Colorado, Connecticut, Virginia and Texas, have similar rights.</p>
          <p>We do not sell or share personal information for cross-context behavioral advertising. To make a request, email <a href={`mailto:${site.email}`}>{site.email}</a> or call {site.phone}. We honor Global Privacy Control browser signals.</p>
          <h2>Cookies</h2>
          <p>We use essential cookies to operate the site. Analytics cookies load only if you choose &ldquo;Accept all&rdquo; in the cookie banner. You can change this at any time with the Cookie settings link in the footer.</p>
          <h2>Security and retention</h2>
          <p>We use administrative, technical and physical safeguards to protect information and keep it only as long as needed for the purposes above or as required by law.</p>
          <h2>Children</h2>
          <p>Our website is not directed to children under 13, and we do not knowingly collect their information.</p>
          <h2>Contact</h2>
          <p>RedBlink Technologies, {site.address.street}, {site.address.city}, {site.address.region} {site.address.postal}. Email <a href={`mailto:${site.email}`}>{site.email}</a>.</p>
        </div>
      </section>
    </>
  );
}
