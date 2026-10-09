import Link from "next/link";
import { Linkedin, Twitter, Facebook, Instagram, MapPin, Phone, Mail, Clock } from "lucide-react";
import { Logo } from "./Logo";
import { site as staticSite } from "@/data/site";
import { CookieSettingsButton } from "./CookieBanner";

const cols = [
  {
    title: "AI services",
    links: [
      ["AI agent development", "/services/ai-agent-development/"],
      ["Generative AI integration", "/services/generative-ai-integration/"],
      ["RAG & knowledge systems", "/services/rag-development/"],
      ["AI chatbots", "/services/ai-chatbot-development/"],
      ["Machine learning", "/services/machine-learning/"],
      ["AI consulting", "/services/ai-consulting/"],
    ],
  },
  {
    title: "Engineering",
    links: [
      ["Web apps", "/services/web-app-development/"],
      ["Mobile apps", "/services/mobile-app-development/"],
      ["AI MVPs", "/services/mvp-development/"],
      ["Cloud", "/services/cloud-computing/"],
      ["Cybersecurity", "/services/cybersecurity/"],
      ["AI SEO", "/services/ai-seo/"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About", "/about/"],
      ["Work", "/work/"],
      ["Industries", "/industries/"],
      ["Products", "/products/"],
      ["Careers", "/careers/"],
    ],
  },
];

export function Footer({ site = staticSite }: { site?: typeof staticSite }) {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="ft-top">
          <div className="ft-brand">
            <Logo />
            <p>AI engineering partner to US companies. We build, launch and operate AI products and custom software, from first workshop to production support.</p>
            <div className="ft-social">
              <a href={site.social.linkedin} aria-label="RedBlink on LinkedIn" target="_blank" rel="noopener noreferrer"><Linkedin size={17} /></a>
              <a href={site.social.twitter} aria-label="RedBlink on X (Twitter)" target="_blank" rel="noopener noreferrer"><Twitter size={17} /></a>
              <a href={site.social.facebook} aria-label="RedBlink on Facebook" target="_blank" rel="noopener noreferrer"><Facebook size={17} /></a>
              <a href={site.social.instagram} aria-label="RedBlink on Instagram" target="_blank" rel="noopener noreferrer"><Instagram size={17} /></a>
            </div>
          </div>
          {cols.map((c) => (
            <div className="ft-col" key={c.title}>
              <h2>{c.title}</h2>
              <ul>
                {c.links.map(([label, href]) => (
                  <li key={href}><Link href={href}>{label}</Link></li>
                ))}
                {c.title === "Company" && <li><a href={site.blogUrl}>Insights</a></li>}
              </ul>
            </div>
          ))}
          <div className="ft-col">
            <h2>Contact</h2>
            <address style={{ fontStyle: "normal" }}>
              <ul className="ft-contact">
                <li><MapPin size={15} /><a href={site.address.mapUrl} target="_blank" rel="noopener noreferrer">{site.address.street}<br />{site.address.city}, {site.address.region} {site.address.postal}</a></li>
                <li><Phone size={15} /><a href={site.phoneHref}>{site.phone}</a></li>
                <li><Mail size={15} /><a href={`mailto:${site.salesEmail}`}>{site.salesEmail}</a></li>
                <li><Clock size={15} /><span>{site.hours}</span></li>
              </ul>
            </address>
          </div>
        </div>
        <div className="ft-offices">
          {site.offices.map((o) => (
            <div key={o.label}><b>{o.label}</b>{o.lines.join(", ")}</div>
          ))}
        </div>
        <div className="ft-bottom">
          <span>© {new Date().getFullYear()} RedBlink Technologies. All rights reserved.</span>
          <ul className="ft-legal" aria-label="Legal">
            <li><Link href="/privacy-policy/">Privacy policy</Link></li>
            <li><Link href="/terms-conditions/">Terms</Link></li>
            <li><Link href="/privacy-policy/#your-privacy-choices">Do not sell or share my personal information</Link></li>
            <li><CookieSettingsButton /></li>
            <li><Link href="/accessibility/">Accessibility</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
