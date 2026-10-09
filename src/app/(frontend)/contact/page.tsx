import { getPage, pageMetadata } from "@/lib/content";
import { Suspense } from "react";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { ContactForm } from "@/components/ContactForm";
import { BriefAnalyzer } from "@/components/BriefAnalyzer";
import { site } from "@/data/site";

export const generateMetadata = () => pageMetadata("contact");

export default async function ContactPage() {
  const page = await getPage("contact");
  return (
    <>
      <PageHero
        title={page.hero.title || "Let's talk about what you want to build."}
        lede={page.hero.lede || "Free 30-minute consultation with a senior engineer. Tell us where you are, and we'll tell you honestly what it would take."}
        crumbs={[{ name: "Contact", path: "/contact/" }]}
      />
      <section className="section-tight" style={{ paddingTop: 0 }}>
        <div className="container contact-grid">
          <Suspense fallback={<div className="form" style={{ minHeight: 600 }} />}>
            <ContactForm />
          </Suspense>
          <div className="contact-side">
            <BriefAnalyzer />
            <div className="card">
              <span className="tag">Call sales</span>
              <a href={site.phoneHref} style={{ display: "flex", gap: ".6rem", alignItems: "center", fontSize: "var(--t-lg)", fontWeight: 600 }}><Phone size={20} /> {site.phone}</a>
              <p style={{ display: "flex", gap: ".5rem", alignItems: "center" }}><Clock size={16} /> {site.hours}</p>
            </div>
            <div className="card">
              <span className="tag">Email</span>
              <a href={`mailto:${site.salesEmail}`} style={{ display: "flex", gap: ".6rem", alignItems: "center" }}><Mail size={18} /> {site.salesEmail}</a>
              <a href={`mailto:${site.email}`} style={{ display: "flex", gap: ".6rem", alignItems: "center" }}><Mail size={18} /> {site.email}</a>
            </div>
            <div className="card">
              <span className="tag">Headquarters</span>
              <a href={site.address.mapUrl} target="_blank" rel="noopener noreferrer" style={{ display: "flex", gap: ".6rem" }}>
                <MapPin size={18} style={{ flex: "none", marginTop: 3 }} />
                <span>{site.address.street}<br />{site.address.city}, {site.address.region} {site.address.postal}</span>
              </a>
              <p>Also in Dubai (DIFC) and Mohali, India.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
