import type { Metadata, Viewport } from "next";
import "@fontsource-variable/plus-jakarta-sans";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CookieBanner } from "@/components/CookieBanner";
import { BackToTop } from "@/components/BackToTop";
import { DecodeKickers, DarkSpotlight } from "@/components/Decode";
import { JsonLd } from "@/components/JsonLd";
import { SITE_URL, site } from "@/data/site";
import { organizationLd, websiteLd } from "@/lib/seo";
import brand from "@/data/brand.json";
import { draftMode } from "next/headers";
import { getContent } from "@/lib/content";
import { PreviewBar } from "@/components/PreviewBar";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "RedBlink | AI Software Development Company in California",
    template: "%s | RedBlink",
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.legalName, url: SITE_URL }],
  alternates: { canonical: `${SITE_URL}/` },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_US",
    url: `${SITE_URL}/`,
    title: "RedBlink | AI Software Development Company in California",
    description: site.description,
  },
  twitter: { card: "summary_large_image", site: "@redblinktech" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  verification: {
    google: "oTpfyoQ0Q8K29Lhk1qSt3UvcZPavHRelgtIBep3dd-k",
    other: { "msvalidate.01": "40AFA824623A0F6180CDC0EC4365B869" },
  },
  formatDetection: { telephone: true },
};

export const viewport: Viewport = {
  themeColor: "#0d0e12",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const c = await getContent();
  const { isEnabled: preview } = await draftMode();
  const navServices = c.services.map(({ slug, title, category }) => ({ slug, title, category }));
  const navProducts = c.products.map((p) => ({ id: p.slug, name: p.name, kind: p.kind }));
  return (
    <html lang="en-US">
      <body>
        <noscript>
          <style>{`[style*="opacity:0"]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        {brand.red && <style>{`:root{--red:${brand.red}}`}</style>}
        <a href="#main" className="skip">Skip to content</a>
        {preview && <PreviewBar />}
        <Header site={c.settings} services={navServices} products={navProducts} />
        <main id="main">{children}</main>
        <Footer site={c.settings} />
        <CookieBanner />
        <BackToTop />
        <DecodeKickers />
        <DarkSpotlight />
        <JsonLd data={[organizationLd(), websiteLd()]} />
      </body>
    </html>
  );
}
