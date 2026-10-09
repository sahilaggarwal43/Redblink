export type Post = { title: string; link: string; date: string; excerpt: string; image?: string };

// Reads the latest posts from the WordPress REST API. WordPress stays the blog engine.
const WP = (process.env.WORDPRESS_URL || "https://redblink.com").replace(/\/$/, "");
const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://redblink.com").replace(/\/$/, "");
// Origin readers should land on for posts (the public domain once WordPress is proxied).
const PUBLIC_BLOG_ORIGIN = process.env.WORDPRESS_URL ? SITE : "https://redblink.com";

const fallback: Post[] = [
  { title: "AI Coding Dictionary: 30+ Essential AI Terms for Developers", link: `${PUBLIC_BLOG_ORIGIN}/ai-coding-dictonary/`, date: "2026-10-01", excerpt: "The vocabulary every developer working with AI tools should know, explained in plain language." },
  { title: "What Is Retrieve-for-Train (R4T)? How Google Speeds Up Complex AI Search", link: `${PUBLIC_BLOG_ORIGIN}/retrieve-for-train-r4t/`, date: "2026-09-21", excerpt: "A look at how retrieval during training makes complex AI search faster." },
  { title: "Top TypeSafe Jev AI Alternatives for Local & Open-Source AI", link: `${PUBLIC_BLOG_ORIGIN}/typesafe-jev-ai-alternatives/`, date: "2026-09-19", excerpt: "Open-source and local options compared for teams that want control over their AI stack." },
];

const strip = (html: string) =>
  html.replace(/<[^>]+>/g, "").replace(/&#8217;/g, "'").replace(/&#8211;/g, "–").replace(/&amp;/g, "&").replace(/&#038;/g, "&").replace(/\[&hellip;\]|&hellip;/g, "…").replace(/&[a-z0-9#]+;/gi, " ").trim();

export async function getLatestPosts(count = 3): Promise<Post[]> {
  try {
    const res = await fetch(`${WP}/wp-json/wp/v2/posts?per_page=${count}&_embed=wp:featuredmedia`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error(String(res.status));
    const data = (await res.json()) as any[];
    return data.map((p) => ({
      title: strip(p.title?.rendered || ""),
      // Show the link on the public domain even if WordPress lives on a subdomain.
      link: String(p.link || "").replace(WP, PUBLIC_BLOG_ORIGIN),
      date: p.date,
      excerpt: strip(p.excerpt?.rendered || "").slice(0, 160),
      image: p._embedded?.["wp:featuredmedia"]?.[0]?.source_url,
    }));
  } catch {
    return fallback.slice(0, count);
  }
}
