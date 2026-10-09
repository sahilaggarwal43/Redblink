// Default product content. Editors can change all of it in the CMS (/admin → Products).
export type Product = {
  slug: string;
  name: string;
  kind: string;
  tagline: string;
  summary: string;
  description: string;
  href: string;
  ctaLabel: string;
  accent: "red" | "ink";
  image?: string | null;
  features: { title: string; body: string }[];
  steps: { title: string; body: string }[];
  audiences: string[];
  faqs: { q: string; a: string }[];
  featured?: boolean;
  seo?: SeoFields;
};

export type SeoFields = {
  metaTitle?: string | null;
  metaDescription?: string | null;
  keywords?: string | null;
  canonical?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: string | null;
  noIndex?: boolean | null;
  noFollow?: boolean | null;
  excludeFromSitemap?: boolean | null;
  jsonLd?: string | null;
};

export const productList: Product[] = [
  {
    slug: "codeconductor",
    name: "CodeConductor",
    kind: "AI software development platform",
    tagline: "Describe the software. Get production-ready code.",
    summary: "Describe the app you need and CodeConductor plans, generates and deploys production-ready code, with an AI engineering team behind it.",
    description:
      "CodeConductor turns a plain-language description into a working application. It plans the architecture, generates the code, sets up the database and deploys it, while our engineers review what ships. Teams use it to go from idea to a live product in weeks instead of quarters, and they own every line of code.",
    href: "https://codeconductor.ai/",
    ctaLabel: "Visit CodeConductor",
    accent: "red",
    featured: true,
    features: [
      { title: "Plans before it builds", body: "Turns your description into screens, data models and an architecture you can review and change before any code is written." },
      { title: "Production-ready code", body: "Generates maintainable code in mainstream frameworks, with tests, so your developers can keep building on it." },
      { title: "Deploys for you", body: "Sets up hosting, the database and environments, so the first version is live, not sitting in a repository." },
      { title: "Engineers in the loop", body: "Our AI engineering team reviews and extends what the platform generates when your product needs it." },
    ],
    steps: [
      { title: "Describe", body: "Explain what the app should do, who uses it and what data it handles." },
      { title: "Review the plan", body: "Check the generated screens, data model and architecture, and adjust anything." },
      { title: "Generate and deploy", body: "CodeConductor writes the code and ships a working version you can use and share." },
    ],
    audiences: ["Founders validating a new product", "Product teams clearing a backlog", "Companies replacing spreadsheets and legacy tools"],
    faqs: [
      { q: "Do we own the code?", a: "Yes. The generated code is yours, and you can export it and keep developing it with any team." },
      { q: "Is it only for prototypes?", a: "No. It is built to produce code that runs in production, with engineers available for the parts that need custom work." },
    ],
  },
  {
    slug: "knolli",
    name: "Knolli",
    kind: "AI copilots for knowledge",
    tagline: "Turn what you know into an AI copilot people can use.",
    summary: "Turn documents, guides and videos into branded AI copilots without code. Creators can sell access by subscription; teams use it for support and training.",
    description:
      "Knolli lets experts, creators and companies turn their content into an AI copilot that answers questions in their voice. Upload documents, guides and videos, set the tone, and share the copilot with customers, students or employees. Creators can charge for access, and your content is never used to train outside models.",
    href: "https://knolli.ai/",
    ctaLabel: "Visit Knolli",
    accent: "ink",
    featured: true,
    features: [
      { title: "No-code setup", body: "Upload PDFs, docs, web pages and videos and get a working copilot without engineering work." },
      { title: "Your brand and voice", body: "Customize the name, look and tone so the copilot feels like part of your business." },
      { title: "Earn from expertise", body: "Creators can offer paid subscriptions to their copilot and grow recurring revenue." },
      { title: "Private by design", body: "Your content stays yours and is never used to train outside models." },
    ],
    steps: [
      { title: "Add your content", body: "Upload the material your audience keeps asking about." },
      { title: "Shape the copilot", body: "Set its personality, branding and what it should and shouldn't answer." },
      { title: "Share or sell it", body: "Embed it, share a link, or put it behind a subscription." },
    ],
    audiences: ["Coaches, educators and creators", "Customer support teams", "HR and training teams"],
    faqs: [
      { q: "Do I need technical skills?", a: "No. Knolli is designed so anyone who can upload files can launch a copilot." },
      { q: "Is my content used to train AI models?", a: "No. Your content is only used to answer questions in your copilot." },
    ],
  },
  {
    slug: "prashn-ai",
    name: "Prashn AI",
    kind: "AI question answering",
    tagline: "Reliable answers from your own sources, with citations.",
    summary: "An AI assistant that answers questions from your own sources with citations, built for teams that need reliable answers fast.",
    description:
      "Prashn AI connects to the documents and knowledge your team already relies on and answers questions with citations back to the source. Every answer can be checked, so people trust it enough to use it for real work.",
    href: "/contact/?topic=Prashn%20AI",
    ctaLabel: "Ask about Prashn AI",
    accent: "red",
    features: [
      { title: "Answers with sources", body: "Every answer links back to the passage it came from, so it can be verified in seconds." },
      { title: "Works on your content", body: "Connects to your documents and knowledge bases instead of the open internet." },
      { title: "Fast for teams", body: "Gives everyone the same reliable answer instead of a search through folders." },
    ],
    steps: [
      { title: "Connect sources", body: "Point Prashn AI at the documents and knowledge bases that matter." },
      { title: "Ask in plain language", body: "Team members ask questions the way they would ask a colleague." },
      { title: "Check and act", body: "Open the cited source when you need certainty, then get on with the work." },
    ],
    audiences: ["Operations and support teams", "Research and compliance teams", "Growing companies with scattered knowledge"],
    faqs: [{ q: "Can it say when it doesn't know?", a: "Yes. When the sources don't contain an answer, it says so instead of guessing." }],
  },
  {
    slug: "wp-hacked-help",
    name: "WP Hacked Help",
    kind: "WordPress security",
    tagline: "Hacked WordPress site? Get it clean and back online fast.",
    summary: "Malware removal, hack recovery and ongoing protection for WordPress sites, with fast turnaround when a site is down.",
    description:
      "WP Hacked Help cleans infected WordPress sites, removes malware and backdoors, restores search visibility and hardens the site so it stays protected. When a site is down or blacklisted, speed matters, and that is what the service is built for.",
    href: "https://secure.wphackedhelp.com/",
    ctaLabel: "Visit WP Hacked Help",
    accent: "ink",
    features: [
      { title: "Malware removal", body: "Finds and removes malicious code, backdoors and injected spam across files and the database." },
      { title: "Blacklist recovery", body: "Helps get warnings removed from Google and security vendors after the clean-up." },
      { title: "Hardening", body: "Closes the holes that let attackers in, including outdated plugins and weak configurations." },
      { title: "Ongoing protection", body: "Monitoring and firewall options to keep the site clean after recovery." },
    ],
    steps: [
      { title: "Report the issue", body: "Tell us what you're seeing: redirects, warnings, spam or a site that won't load." },
      { title: "Clean and restore", body: "We remove the infection and bring the site back online." },
      { title: "Harden and monitor", body: "We secure the site so it doesn't happen again." },
    ],
    audiences: ["Small businesses on WordPress", "Agencies managing client sites", "eCommerce stores on WooCommerce"],
    faqs: [{ q: "How fast can you help?", a: "Hacked-site requests are prioritized, because every hour offline costs traffic and trust." }],
  },
  {
    slug: "aigram",
    name: "AIGRAM",
    kind: "Grammar and readability",
    tagline: "Correct grammar and clearer writing in one pass.",
    summary: "An AI grammar checker that also simplifies dense writing so it reads clearly for any audience.",
    description:
      "AIGRAM fixes grammar and spelling and then goes further, rewriting dense or technical passages so they are easy to read. Use it for emails, documentation, articles and anything that needs to be understood the first time.",
    href: "/contact/?topic=AIGRAM",
    ctaLabel: "Ask about AIGRAM",
    accent: "red",
    features: [
      { title: "Grammar and spelling", body: "Catches errors and suggests corrections in context." },
      { title: "Simplify dense text", body: "Rewrites complex passages into plain language without losing the meaning." },
      { title: "Keep your tone", body: "Improves clarity while keeping the writing sounding like you." },
    ],
    steps: [
      { title: "Paste your text", body: "Drop in an email, article or document section." },
      { title: "Review suggestions", body: "Accept corrections and simplified rewrites." },
      { title: "Publish with confidence", body: "Send writing that's correct and easy to read." },
    ],
    audiences: ["Marketing and content teams", "Technical writers", "Non-native English writers"],
    faqs: [],
  },
  {
    slug: "aic2h",
    name: "AIC2H",
    kind: "AI content humanizer",
    tagline: "Make AI-assisted drafts read naturally, in your voice.",
    summary: "Rewrites AI-generated drafts so they read naturally, in your voice.",
    description:
      "AIC2H takes AI-assisted drafts and rewrites them so they flow naturally and sound like a person wrote them, matching the voice you want for your brand.",
    href: "/contact/?topic=AIC2H",
    ctaLabel: "Ask about AIC2H",
    accent: "ink",
    features: [
      { title: "Natural rhythm", body: "Varies sentence structure and phrasing so text reads smoothly." },
      { title: "Brand voice", body: "Adapts tone to match how your business communicates." },
    ],
    steps: [
      { title: "Add a draft", body: "Paste the AI-assisted text you want to improve." },
      { title: "Choose a voice", body: "Pick the tone that fits your audience." },
      { title: "Refine and use", body: "Edit the result and publish." },
    ],
    audiences: ["Content teams", "Agencies", "Founders writing their own marketing"],
    faqs: [],
  },
  {
    slug: "383-media",
    name: "383 Media",
    kind: "Digital media",
    tagline: "Content and digital publishing.",
    summary: "Our sister media brand for content and digital publishing.",
    description: "383 Media is RedBlink's sister brand focused on content creation and digital publishing.",
    href: "http://383media.com/",
    ctaLabel: "Visit 383 Media",
    accent: "ink",
    features: [],
    steps: [],
    audiences: [],
    faqs: [],
  },
];

export const getProduct = (slug: string) => productList.find((p) => p.slug === slug);
