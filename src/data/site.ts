export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://redblink.com").replace(/\/$/, "");

export const site = {
  name: "RedBlink",
  legalName: "RedBlink Technologies",
  tagline: "AI software development company",
  description:
    "RedBlink is a California-based AI software development company. We design, build and run AI agents, LLM applications, machine learning systems and custom software for US businesses.",
  phone: "+1 415-779-2793",
  phoneHref: "tel:+14157792793",
  email: "info@redblink.com",
  salesEmail: "sales@redblink.com",
  careersEmail: "info@redblink.com",
  hours: "Mon–Fri, 8am–6pm PT",
  address: {
    street: "23 Railroad Avenue, Unit 971",
    city: "Danville",
    region: "CA",
    postal: "94526",
    country: "US",
    mapUrl: "https://maps.google.com/maps?ll=37.823317,-122.004223&z=16&t=m&cid=9853242703988642861",
    geo: { lat: 37.823317, lng: -122.004223 },
  },
  offices: [
    { label: "Headquarters", lines: ["23 Railroad Avenue, Unit 971", "Danville, CA 94526"] },
    { label: "Middle East", lines: ["DIFC", "Dubai, UAE"] },
    { label: "Delivery center", lines: ["Mohali, Punjab", "India"] },
  ],
  social: {
    linkedin: "https://www.linkedin.com/company/redblink-technologies/",
    twitter: "https://twitter.com/redblinktech",
    facebook: "https://www.facebook.com/RedBlink-822179794481323",
    instagram: "https://www.instagram.com/redblink_technologies/",
  },
  // Works today against the current WordPress site. After launch with WORDPRESS_URL proxying, set NEXT_PUBLIC_BLOG_URL=/blog/
  blogUrl: process.env.NEXT_PUBLIC_BLOG_URL || "https://redblink.com/blog/",
};

// NOTE: the live site renders these counters with JavaScript (they read "0+" to crawlers).
// Confirm the real figures before launch and edit them here — every page reads from this list.
export const stats = [
  { value: 12, suffix: "+", label: "Years building software" },
  { value: 500, suffix: "+", label: "Clients served" },
  { value: 1000, suffix: "+", label: "Projects delivered" },
  { value: 10, suffix: "M+", label: "End users on products we built" },
];

export const processSteps = [
  {
    title: "Discover",
    time: "Week 1–2",
    body: "We map the workflow, the data you already have and the result that would make the project worth it. You get a written plan, an estimate and the risks we see.",
  },
  {
    title: "Prototype",
    time: "Week 2–4",
    body: "A working slice on your real data, not slides. You test it with your team and we measure accuracy, cost per task and speed before anything is scaled.",
  },
  {
    title: "Build",
    time: "Sprints of 2 weeks",
    body: "Production engineering with demos every sprint: integrations, security reviews, evaluation suites and the admin tools your team will actually use.",
  },
  {
    title: "Run and improve",
    time: "Ongoing",
    body: "Monitoring, model and prompt updates, cost tuning and a named team on call. We stay accountable for the numbers after launch.",
  },
];

export const testimonials = [
  {
    name: "Lisa M.",
    role: "Customer support leader",
    quote:
      "RedBlink built an AI chatbot on large language models that answers most of our customers' questions without a human stepping in. It saved our team time and our satisfaction scores went up.",
    topic: "AI chatbot",
  },
  {
    name: "John P.",
    role: "Operations director",
    quote:
      "Our business runs on data, but we struggled to make sense of it. RedBlink built a tool that analyzes it and predicts what's coming, so we plan ahead with confidence.",
    topic: "Predictive analytics",
  },
  {
    name: "Mark R.",
    role: "Head of content",
    quote:
      "We wanted to create high-quality content fast. Their LLM writing assistant sounds natural, exceeded our expectations and gets us through tight deadlines.",
    topic: "Generative AI",
  },
  {
    name: "Sarah T.",
    role: "eCommerce manager",
    quote:
      "The recommendation engine RedBlink built personalizes shopping for every visitor. Since launch we've seen a clear lift in both sales and engagement.",
    topic: "Recommendation engine",
  },
];

export const team = [
  { name: "Sahil Aggarwal", role: "Director of Delivery & Operations", linkedin: "https://www.linkedin.com/in/sahil-aggarwal-794971a3/" },
  { name: "Navdeep Dhaliwal", role: "Product Head", linkedin: "https://www.linkedin.com/in/navdeepgosal/" },
  { name: "Sunil Jain", role: "General Manager", linkedin: "https://www.linkedin.com/in/suniljains" },
  { name: "Loveneet Singh", role: "Director of Digital Marketing", linkedin: "https://www.linkedin.com/in/loveneet-singh" },
  { name: "Pradeep Kumar", role: "Technical Team Manager", linkedin: "https://www.linkedin.com/in/pradeep-kumar-b2723b9b" },
  { name: "Puneet Uppal", role: "Technical Team Manager", linkedin: "https://www.linkedin.com/in/puneet-uppal-533977a3" },
  { name: "Maheep Singh", role: "Technical Project Manager", linkedin: "https://www.linkedin.com/in/maheeptathgur" },
  { name: "Amit Babbar", role: "Lead Project Manager", linkedin: "https://www.linkedin.com/in/amitbabbar911" },
  { name: "Abhilash Kahlon", role: "Senior Project Manager", linkedin: "https://in.linkedin.com/in/abhilash-kahlon-6ba75860" },
  { name: "Shekhar Singh", role: "PPC Team Lead", linkedin: "https://www.linkedin.com/in/shekhar-singh-b307301a9" },
  { name: "Deepak Goel", role: "QA Team Lead", linkedin: "https://in.linkedin.com/in/deepak-goel-7a4691114" },
];

export const values = [
  { title: "Inspire and be inspired", body: "Fresh ideas come from curiosity. We share what we learn and keep experimenting." },
  { title: "Customer success first", body: "A shipped feature isn't the goal. The result it creates for your business is." },
  { title: "Respect and teamwork", body: "Close collaboration with your team, honest estimates and no surprises." },
  { title: "Lead with innovation", body: "We use the newest models and tools when they're ready for production, not before." },
  { title: "Trust and quality", body: "Code reviews, tests and security checks on every release." },
];

export const products = [
  {
    id: "codeconductor",
    name: "CodeConductor",
    kind: "AI software development platform",
    body: "Describe the app you need and CodeConductor plans, generates and deploys production-ready code with an AI engineering team behind it.",
    href: "https://codeconductor.ai/",
  },
  {
    id: "knolli",
    name: "Knolli",
    kind: "AI copilots for knowledge",
    body: "Turn documents, guides and videos into branded AI copilots without code. Creators can sell access by subscription; teams use it for support and training. Your content is never used to train outside models.",
    href: "https://knolli.ai/",
  },
  {
    id: "prashn-ai",
    name: "Prashn AI",
    kind: "AI question answering",
    body: "An AI assistant that answers questions from your own sources with citations, built for teams that need reliable answers fast.",
    href: "/contact/?topic=Prashn%20AI",
  },
  {
    id: "wp-hacked-help",
    name: "WP Hacked Help",
    kind: "WordPress security",
    body: "Malware removal, hack recovery and ongoing protection for WordPress sites, with fast turnaround when a site is down.",
    href: "https://secure.wphackedhelp.com/",
  },
  {
    id: "aigram",
    name: "AIGRAM",
    kind: "Grammar and readability",
    body: "An AI grammar checker that also simplifies dense writing so it reads clearly for any audience.",
    href: "/contact/?topic=AIGRAM",
  },
  {
    id: "aic2h",
    name: "AIC2H",
    kind: "AI content humanizer",
    body: "Rewrites AI-generated drafts so they read naturally, in your voice.",
    href: "/contact/?topic=AIC2H",
  },
  {
    id: "383-media",
    name: "383 Media",
    kind: "Digital media",
    body: "Our sister media brand for content and digital publishing.",
    href: "http://383media.com/",
  },
];

export const industries = [
  {
    id: "healthcare",
    name: "Healthcare",
    body: "Clinical documentation assistants, patient intake automation and claims processing, built with HIPAA-aligned data handling and BAAs with model providers.",
    examples: ["Ambient note summarization", "Prior-authorization automation", "Patient support agents"],
  },
  {
    id: "financial-services",
    name: "Financial services",
    body: "Fraud signals, underwriting support, KYC document checks and advisor copilots, with audit trails your compliance team can review.",
    examples: ["Fraud and anomaly detection", "Loan document extraction", "Advisor research copilots"],
  },
  {
    id: "retail",
    name: "Retail and eCommerce",
    body: "Recommendations, AI shopping assistants, demand forecasting and product content at catalog scale.",
    examples: ["Personalized recommendations", "Product description generation", "Inventory forecasting"],
  },
  {
    id: "real-estate",
    name: "Real estate and PropTech",
    body: "Lead qualification agents, listing generation, lease abstraction and valuation models for brokerages and property managers.",
    examples: ["Lead response agents", "Lease abstraction", "Comparable-property models"],
  },
  {
    id: "logistics",
    name: "Logistics and supply chain",
    body: "Route and load optimization, shipment exception agents and document processing for bills of lading and invoices.",
    examples: ["Exception triage agents", "Freight document OCR", "ETA prediction"],
  },
  {
    id: "legal",
    name: "Legal and professional services",
    body: "Private research assistants, contract review and intake automation that keep client data inside your environment.",
    examples: ["Contract clause review", "Matter intake bots", "Knowledge search over case files"],
  },
  {
    id: "education",
    name: "Education and EdTech",
    body: "Tutoring assistants, course content generation and learner analytics designed with FERPA and COPPA in mind.",
    examples: ["AI tutors", "Assessment generation", "Learner risk signals"],
  },
  {
    id: "saas",
    name: "SaaS and technology",
    body: "AI features inside your product: copilots, semantic search, agents and the evaluation pipeline to ship them safely.",
    examples: ["In-app copilots", "Semantic search", "Usage-based AI billing"],
  },
];

export const engagementModels = [
  {
    name: "Fixed-scope project",
    best: "Defined scope and deadline",
    body: "We agree the scope, milestones and price up front. Good for MVPs, prototypes and well-understood builds.",
  },
  {
    name: "Dedicated team",
    best: "Ongoing product work",
    body: "A full-time pod of engineers, a PM and QA that works as part of your team, on your tools, in your time zone overlap.",
  },
  {
    name: "Staff augmentation",
    best: "Filling specific skill gaps",
    body: "Add vetted AI, ML, full-stack or mobile engineers to your team. Start in about a week; scale up or down monthly.",
  },
];

export const techStack = [
  "OpenAI", "Anthropic Claude", "Google Gemini", "Llama", "Mistral", "LangChain", "LangGraph", "LlamaIndex",
  "Hugging Face", "PyTorch", "TensorFlow", "Pinecone", "Weaviate", "pgvector", "AWS", "Azure", "Google Cloud",
  "Kubernetes", "Python", "Node.js", "Next.js", "React Native", "Flutter", "Swift", "Kotlin", "PostgreSQL",
];

export const homeFaqs = [
  {
    q: "How much does an AI project cost?",
    a: "Most first projects land between a two-week paid discovery and a 6–12 week build. A focused prototype on your data usually starts in the low five figures; production systems depend on integrations, compliance needs and scale. We give you a written estimate after a free consultation.",
  },
  {
    q: "Can you work with our existing data and systems?",
    a: "Yes. We connect to the tools you already run, such as Salesforce, HubSpot, SharePoint, Google Workspace, Zendesk, Snowflake and custom databases, through their APIs or secure connectors.",
  },
  {
    q: "Is our data used to train public AI models?",
    a: "No. We use enterprise model agreements with zero data retention where available, can deploy open-source models in your own cloud, and sign NDAs and BAAs when needed.",
  },
  {
    q: "Do you work in US time zones?",
    a: "Our headquarters is in Danville, California, and our delivery teams keep daily overlap with US Pacific and Eastern hours for standups, demos and support.",
  },
  {
    q: "What happens after launch?",
    a: "We monitor quality, cost and uptime, update prompts and models as better ones ship, and handle support under a monthly plan. You own all code and IP.",
  },
];
