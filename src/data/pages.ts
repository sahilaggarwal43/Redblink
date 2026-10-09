import type { SeoFields } from "./products";

// Default text and SEO for each page. The CMS (/admin → Pages) overrides any of it.
export type PageSection = { key: string; kicker?: string | null; heading?: string | null; body?: string | null; cta?: { label?: string | null; href?: string | null } | null; image?: string | null };
export type PageContent = {
  key: string;
  title: string;
  path: string;
  hero: { eyebrow?: string | null; title?: string | null; lede?: string | null; primary?: { label?: string | null; href?: string | null } | null; secondary?: { label?: string | null; href?: string | null } | null; image?: string | null };
  sections: PageSection[];
  seo: SeoFields;
};

const s = (key: string, kicker: string, heading: string, body = ""): PageSection => ({ key, kicker, heading, body });

export const defaultPages: PageContent[] = [
  {
    key: "home", title: "Home", path: "/",
    hero: {
      eyebrow: "AI SOFTWARE ENGINEERING / DANVILLE, CALIFORNIA",
      title: "Enterprise AI, engineered for production.",
      lede: "We design, build and run AI agents, LLM applications and custom software for US companies. Try it: describe a process and watch our solution architect outline it.",
    },
    sections: [
      s("demo", "Agents at work", "AI that does the work, with a human in the loop.", "Our agents read the request, pull context from your systems, decide what to do and wait for approval on anything that matters. Pick a workflow and approve the action yourself."),
      s("capabilities", "Capabilities", "One partner from strategy to scale.", "Services across five practices, delivered by one team with shared standards for security, quality and speed."),
      s("production", "Production-grade AI", "Pilots are easy. Production is the work.", "Most AI projects stall between demo and deployment. We engineer for the hard part from day one."),
      s("track-record", "Track record", "Software we've built is used by millions of people every day."),
      s("process", "How we deliver", "Working software in weeks, not quarters.", "You see results on your own data before committing to a full build. Every sprint ends with a demo, not a status report."),
      s("industries", "Industries", "Find your use case in our map of what works.", "Every engagement teaches us where AI pays off. Hover a cluster to see the strongest use cases in your industry, with HIPAA, SOC 2 and PCI DSS designed in from the first sprint."),
      s("products", "Our platforms", "We run AI products of our own.", "Operating our own platforms means we live with the same problems you do: model costs, reliability and real users at scale."),
      s("leadership", "Leadership", "The people accountable for your project.", "Senior leaders stay involved from scoping to launch, so decisions get made quickly and nothing gets lost in hand-offs."),
      s("testimonials", "Client outcomes", "What clients say after launch."),
      s("insights", "Insights", "Field notes from our engineers."),
      s("faq", "FAQ", "Questions buyers ask us first."),
      s("cta", "", "Let's build what's next.", "Book a free 30-minute consultation with a senior engineer. You'll leave with an honest view of what's feasible, what it costs and how fast it can ship."),
    ],
    seo: { metaTitle: "RedBlink | AI Software Development Company in California", metaDescription: "RedBlink is a California-based AI software development company. We design, build and run AI agents, LLM applications, machine learning systems and custom software for US businesses." },
  },
  {
    key: "services", title: "Services", path: "/services/",
    hero: { title: "Every service you need to put AI to work.", lede: "Thirty-one services across five practices, delivered by one team with shared standards for security, quality and speed." },
    sections: [],
    seo: { metaTitle: "AI, Software & Digital Services", metaDescription: "AI agent development, generative AI, RAG, machine learning, web and mobile apps, cloud, cybersecurity and AI SEO services for US businesses. Explore RedBlink's full service catalog." },
  },
  {
    key: "industries", title: "Industries", path: "/industries/",
    hero: { title: "AI that understands how your industry works.", lede: "Compliance requirements, legacy systems and the way your customers buy are different in every sector. We design for those realities from day one." },
    sections: [],
    seo: { metaTitle: "AI Solutions by Industry", metaDescription: "AI agents, automation and custom software for healthcare, financial services, retail, real estate, logistics, legal, education and SaaS companies in the US." },
  },
  {
    key: "products", title: "Products", path: "/products/",
    hero: { eyebrow: "Built and run by RedBlink", title: "Products we build and run ourselves.", lede: "Our own platforms keep us honest. Every lesson about model costs, uptime and real users goes straight back into client work." },
    sections: [
      s("featured", "Flagship platforms", "Where we put our own engineering to work."),
      s("more", "More from RedBlink", "Focused tools for specific jobs."),
      s("cta", "", "Want a product like these, for your business?", "We bring the same engineering we use on our own platforms to yours. Tell us what you want to build."),
    ],
    seo: { metaTitle: "Our AI Products", metaDescription: "CodeConductor, Knolli, Prashn AI, WP Hacked Help and more: AI products built and run by RedBlink." },
  },
  {
    key: "work", title: "Work", path: "/work/",
    hero: { title: "Work that moved a number.", lede: "A selection of client projects and the products we run ourselves. Ask us for detailed case studies in your industry; many clients prefer we share them privately." },
    sections: [],
    seo: { metaTitle: "Our Work and Client Stories", metaDescription: "AI chatbots, predictive analytics, LLM content tools and recommendation engines RedBlink has built for clients, plus the AI products we run ourselves." },
  },
  {
    key: "hire", title: "Hire engineers", path: "/hire/",
    hero: { title: "Hire AI engineers who've shipped real products.", lede: "ChatGPT and LLM developers, machine learning engineers, full-stack and mobile developers: add one specialist or a full team, managed by people who've done this for years." },
    sections: [],
    seo: { metaTitle: "Hire AI, ChatGPT & Machine Learning Engineers", metaDescription: "Hire vetted AI engineers, ChatGPT and LLM developers, machine learning engineers and full-stack developers. Dedicated teams or staff augmentation with US time-zone overlap." },
  },
  {
    key: "about", title: "About", path: "/about/",
    hero: { title: "Engineers who care how the story ends.", lede: "RedBlink is an AI software development and digital growth company. We combine deep expertise in large language models, machine learning, NLP and computer vision with practical business sense, so the things we build get used." },
    sections: [],
    seo: { metaTitle: "About RedBlink", metaDescription: "RedBlink Technologies is an AI software development and digital growth company headquartered in Danville, California, with teams in Dubai and India." },
  },
  {
    key: "careers", title: "Careers", path: "/careers/",
    hero: { title: "Build what's next with a team of thinkers.", lede: "We look for curious, skilled people and give them continuous training, interesting problems and real ownership." },
    sections: [],
    seo: { metaTitle: "Careers at RedBlink", metaDescription: "Join RedBlink to build AI agents, LLM applications and modern software for US clients. We hire engineers, designers, project managers and marketers." },
  },
  {
    key: "contact", title: "Contact", path: "/contact/",
    hero: { title: "Let's talk about what you want to build.", lede: "Free 30-minute consultation with a senior engineer. Tell us where you are, and we'll tell you honestly what it would take." },
    sections: [],
    seo: { metaTitle: "Contact RedBlink | Book a Free AI Consultation", metaDescription: "Talk to RedBlink about AI agents, generative AI, machine learning or custom software. Call +1 415-779-2793 or send a message. Reply within one business day." },
  },
  { key: "privacy", title: "Privacy policy", path: "/privacy-policy/", hero: { title: "Privacy policy", lede: "Last updated: October 2026" }, sections: [], seo: { metaTitle: "Privacy Policy", metaDescription: "How RedBlink collects, uses and protects personal information, including your California privacy rights." } },
  { key: "terms", title: "Terms", path: "/terms-conditions/", hero: { title: "Terms and conditions", lede: "Last updated: October 2026" }, sections: [], seo: { metaTitle: "Terms and Conditions", metaDescription: "Terms that govern use of the RedBlink website." } },
  { key: "accessibility", title: "Accessibility", path: "/accessibility/", hero: { title: "Accessibility statement" }, sections: [], seo: { metaTitle: "Accessibility Statement", metaDescription: "RedBlink's commitment to an accessible website that meets WCAG 2.2 AA." } },
];
