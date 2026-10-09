import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://redblink.com";
const WP = (process.env.WORDPRESS_URL || "").replace(/\/$/, "");
const proxyToWordPress = WP && WP !== SITE_URL.replace(/\/$/, "");

// Old WordPress page URLs -> new Next.js routes (permanent 301s keep SEO equity).
// Local SEO landing pages (Houston, Wilmington, Dubai/Abu Dhabi/Doha/Sharjah IT pages)
// are intentionally NOT redirected: they keep living on WordPress via the fallback proxy.
const legacy: [string, string][] = [
  ["/about-us", "/about/"],
  ["/our-portfolio", "/work/"],
  ["/ai-consulting-services", "/services/ai-consulting/"],
  ["/ai-software-development-company", "/services/ai-software-development/"],
  ["/generative-ai-integration-service", "/services/generative-ai-integration/"],
  ["/hire-chatgpt-developers", "/hire/"],
  ["/hire-machine-learning-engineers", "/hire/"],
  ["/machine-learning-development-service-company", "/services/machine-learning/"],
  ["/mobile-app-development-company", "/services/mobile-app-development/"],
  ["/mobile-app-development-company/:path*", "/services/mobile-app-development/"],
  ["/wordpress-development-services", "/services/wordpress-development/"],
  ["/full-stack-development", "/services/full-stack-development/"],
  ["/services/wordpress-security-products", "/services/wordpress-security/"],
  ["/web-design-company", "/services/ui-ux-design/"],
  ["/digital-marketing", "/services/digital-marketing/"],
  ["/seo", "/services/ai-seo/"],
  ["/ppc", "/services/ppc/"],
  ["/it-support", "/services/managed-it-support/"],
  ["/knolli", "/products/knolli/"],
  ["/prashn-ai", "/products/prashn-ai/"],
  ["/ai-grammar-checker-content-simplifier", "/products/aigram/"],
  ["/convert-ai-content-to-human-bypass-detection", "/products/aic2h/"],
];

const nextConfig: NextConfig = {
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = { ".cjs": [".cts", ".cjs"], ".js": [".ts", ".tsx", ".js", ".jsx"], ".mjs": [".mts", ".mjs"] };
    return webpackConfig;
  },
  trailingSlash: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "**.redblink.com" }, { protocol: "https", hostname: "redblink.com" }],
  },
  async redirects() {
    return legacy.map(([source, destination]) => ({ source, destination, permanent: true }));
  },
  async rewrites() {
    if (!proxyToWordPress) return { beforeFiles: [], afterFiles: [], fallback: [] };
    return {
      beforeFiles: [],
      afterFiles: [],
      // Runs only when no Next.js page matched: blog, posts, authors, categories, wp assets.
      fallback: [
        { source: "/wp-content/:path*", destination: `${WP}/wp-content/:path*` },
        { source: "/wp-includes/:path*", destination: `${WP}/wp-includes/:path*` },
        { source: "/wp-json/:path*", destination: `${WP}/wp-json/:path*` },
        { source: "/:path*/", destination: `${WP}/:path*/` },
      ],
    };
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
