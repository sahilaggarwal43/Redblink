export type CategoryId = "genai" | "ai" | "engineering" | "cloud" | "growth";

export const categories: { id: CategoryId; name: string; blurb: string }[] = [
  { id: "genai", name: "Generative & agentic AI", blurb: "Agents, LLM apps, RAG and copilots that do real work." },
  { id: "ai", name: "AI & machine learning", blurb: "Strategy, models, data and the operations to keep them accurate." },
  { id: "engineering", name: "Software engineering", blurb: "Web, mobile and full-stack products built to scale." },
  { id: "cloud", name: "Cloud, security & IT", blurb: "Infrastructure, protection and support that stays up." },
  { id: "growth", name: "Design & growth", blurb: "Interfaces people enjoy and marketing that gets found by AI search." },
];

export type Service = {
  slug: string;
  category: CategoryId;
  title: string;
  short: string;
  headline: string;
  intro: string;
  capabilities: { t: string; d: string }[];
  useCases: string[];
  stack: string[];
  faqs: { q: string; a: string }[];
  keywords: string[];
  isNew?: boolean;
  seo?: import("./products").SeoFields;
};

export const services: Service[] = [
  // ───────────── Generative & agentic AI ─────────────
  {
    slug: "ai-agent-development",
    category: "genai",
    isNew: true,
    title: "AI Agent Development",
    short: "Autonomous agents that plan, use your tools and finish multi-step work.",
    headline: "AI agents that take work off your team's plate",
    intro:
      "We design and build AI agents that read requests, call your systems, make decisions within guardrails you set and hand off to people when they should. Single agents for one workflow or multi-agent systems that coordinate across departments.",
    capabilities: [
      { t: "Workflow agents", d: "Agents that triage tickets, qualify leads, reconcile invoices or update records end to end." },
      { t: "Multi-agent orchestration", d: "Planner, researcher and reviewer agents built with LangGraph, CrewAI or custom runtimes." },
      { t: "Tool use and integrations", d: "Secure function calling into CRMs, ERPs, email, calendars and internal APIs." },
      { t: "Guardrails and evaluation", d: "Approval steps, spend limits, audit logs and automated test suites that score every release." },
    ],
    useCases: ["Customer support resolution agents", "Sales research and outreach agents", "Back-office reconciliation agents"],
    stack: ["LangGraph", "OpenAI Agents SDK", "Claude", "CrewAI", "MCP", "Temporal"],
    faqs: [
      { q: "How is an AI agent different from a chatbot?", a: "A chatbot answers. An agent acts: it can look things up, call APIs, update systems and complete a task across several steps, with checkpoints where a human approves." },
      { q: "How do you keep agents from making costly mistakes?", a: "Every agent ships with scoped permissions, approval gates for sensitive actions, spending caps, full action logs and an evaluation suite we run before each release." },
    ],
    keywords: ["ai agent development company", "agentic ai development", "multi-agent systems"],
  },
  {
    slug: "generative-ai-integration",
    category: "genai",
    title: "Generative AI Integration",
    short: "Add GPT, Claude or Gemini capabilities to the software you already run.",
    headline: "Generative AI inside the products and tools you already use",
    intro:
      "We integrate large language models into your apps, websites and internal systems: content generation, summarization, smart search and assistants that fit your existing workflows instead of replacing them.",
    capabilities: [
      { t: "Model selection", d: "We benchmark GPT, Claude, Gemini and open-source models on your tasks for quality, latency and cost." },
      { t: "Product integration", d: "LLM features built into web, mobile and SaaS products with streaming UX and fallbacks." },
      { t: "Prompt and context engineering", d: "Versioned prompts, structured outputs and context pipelines that stay reliable." },
      { t: "Cost controls", d: "Caching, routing to smaller models and usage dashboards so bills stay predictable." },
    ],
    useCases: ["Document and meeting summarization", "Product description and email generation", "In-app writing assistants"],
    stack: ["OpenAI", "Anthropic", "Gemini", "Azure OpenAI", "AWS Bedrock", "Vercel AI SDK"],
    faqs: [
      { q: "Which model should we use?", a: "It depends on the task. We test two to four models against your examples and recommend the one with the best balance of accuracy, speed and cost, often routing simple requests to cheaper models." },
      { q: "Can we switch models later?", a: "Yes. We build a model-agnostic layer so you can change providers without rewriting your product." },
    ],
    keywords: ["generative ai integration services", "llm integration", "chatgpt integration"],
  },
  {
    slug: "rag-development",
    category: "genai",
    isNew: true,
    title: "RAG & Enterprise Knowledge Systems",
    short: "AI that answers from your documents and data, with sources.",
    headline: "Answers grounded in your own knowledge, with citations",
    intro:
      "Retrieval-augmented generation connects a language model to your documents, wikis, tickets and databases so answers are accurate, current and traceable. We build the ingestion, search and permission layers that make it trustworthy at enterprise scale.",
    capabilities: [
      { t: "Ingestion pipelines", d: "Connectors for SharePoint, Google Drive, Confluence, Notion, Zendesk, PDFs and databases." },
      { t: "Hybrid search", d: "Vector plus keyword retrieval, re-ranking and chunking tuned to your content." },
      { t: "Access control", d: "Answers respect each user's existing document permissions." },
      { t: "Quality measurement", d: "Groundedness and accuracy scoring on real question sets, tracked over time." },
    ],
    useCases: ["Internal knowledge assistants", "Customer self-service search", "Policy and compliance Q&A"],
    stack: ["LlamaIndex", "pgvector", "Pinecone", "Weaviate", "Elasticsearch", "Cohere Rerank"],
    faqs: [
      { q: "Does RAG stop hallucinations?", a: "It sharply reduces them. We add citation requirements, answer refusal when sources are missing and automated groundedness checks." },
      { q: "How do you handle confidential documents?", a: "Data stays in your cloud or a dedicated tenant, encrypted at rest and in transit, and retrieval enforces your existing permissions." },
    ],
    keywords: ["rag development services", "enterprise knowledge base ai", "retrieval augmented generation"],
  },
  {
    slug: "llm-fine-tuning",
    category: "genai",
    isNew: true,
    title: "LLM Fine-Tuning & Custom Models",
    short: "Models trained on your data for your tone, domain and tasks.",
    headline: "Language models that speak your domain",
    intro:
      "When prompting isn't enough, we fine-tune open-source and commercial models on your data so they follow your formats, use your terminology and run faster and cheaper than general-purpose models.",
    capabilities: [
      { t: "Dataset preparation", d: "Cleaning, labeling and synthetic data generation with human review." },
      { t: "Fine-tuning", d: "LoRA and full fine-tunes for Llama, Mistral, Qwen and OpenAI models." },
      { t: "Private deployment", d: "Serve models in your own AWS, Azure or GCP account with autoscaling." },
      { t: "Benchmarking", d: "Side-by-side evaluation against base models on your real tasks." },
    ],
    useCases: ["Domain-specific classifiers", "Brand-voice content generation", "Low-latency on-premise assistants"],
    stack: ["Hugging Face", "PyTorch", "vLLM", "Unsloth", "SageMaker", "Vertex AI"],
    faqs: [
      { q: "When is fine-tuning worth it?", a: "When you need a consistent format or style, very high volume at low cost, or a model that runs privately. For knowledge questions, RAG is usually the better first step." },
      { q: "How much data do we need?", a: "Often a few hundred to a few thousand quality examples. We can help create them." },
    ],
    keywords: ["llm fine tuning services", "custom llm development", "private llm deployment"],
  },
  {
    slug: "ai-chatbot-development",
    category: "genai",
    title: "AI Chatbot Development",
    short: "Conversational assistants for support, sales and internal help desks.",
    headline: "Chatbots that resolve questions, not just deflect them",
    intro:
      "We build AI chatbots on large language models for your website, app, Slack, Microsoft Teams or WhatsApp. They answer from your knowledge, take actions like booking or order lookups, and hand off to a person with full context.",
    capabilities: [
      { t: "Website and in-app chat", d: "Branded chat widgets with streaming answers and rich cards." },
      { t: "Omnichannel", d: "One assistant across web, SMS, WhatsApp, Slack and Teams." },
      { t: "Live-agent handoff", d: "Smooth escalation to Zendesk, Intercom, Freshdesk or Salesforce." },
      { t: "Analytics", d: "Resolution rates, top questions and gaps in your content." },
    ],
    useCases: ["Customer support automation", "Lead capture and qualification", "HR and IT help desks"],
    stack: ["OpenAI", "Claude", "Dialogflow", "Twilio", "Intercom", "Zendesk"],
    faqs: [
      { q: "How long does it take to launch a chatbot?", a: "A focused support assistant on your existing help content typically launches in 3–6 weeks." },
      { q: "Can it take actions like checking an order?", a: "Yes. We connect it to your order, booking or account systems through secure APIs." },
    ],
    keywords: ["ai chatbot development company", "custom chatbot development", "llm chatbot"],
  },
  {
    slug: "voice-ai-agents",
    category: "genai",
    isNew: true,
    title: "Voice AI Agents",
    short: "Natural phone and voice assistants that answer, book and route calls.",
    headline: "Voice agents that pick up on the first ring",
    intro:
      "We build real-time voice AI that handles inbound and outbound calls: answering questions, scheduling, qualifying leads and routing to the right person, with natural speech and sub-second response times.",
    capabilities: [
      { t: "Inbound call handling", d: "24/7 answering, FAQs, scheduling and call routing." },
      { t: "Outbound calling", d: "Appointment reminders, follow-ups and surveys within TCPA rules." },
      { t: "Telephony integration", d: "Twilio, Vonage, RingCentral and SIP connections to your phone system." },
      { t: "Call analytics", d: "Transcripts, summaries and sentiment pushed to your CRM." },
    ],
    useCases: ["After-hours reception", "Appointment booking for clinics and services", "Order status lines"],
    stack: ["OpenAI Realtime", "Deepgram", "ElevenLabs", "Twilio", "LiveKit", "Vapi"],
    faqs: [
      { q: "Will callers know they're talking to AI?", a: "We recommend disclosing it, and many US states require it. Voices are natural, and a human transfer is always one request away." },
      { q: "Can it book into our calendar?", a: "Yes, with Google Calendar, Outlook, Calendly or your practice-management system." },
    ],
    keywords: ["voice ai agent development", "ai phone agent", "ai receptionist"],
  },
  {
    slug: "mcp-development",
    category: "genai",
    isNew: true,
    title: "MCP Server Development",
    short: "Connect Claude, ChatGPT and other assistants to your systems securely.",
    headline: "Give AI assistants safe access to your business systems",
    intro:
      "The Model Context Protocol lets AI assistants use your tools and data. We build secure MCP servers so Claude, ChatGPT, Copilot and your own agents can query and act on your platforms with proper authentication and permissions.",
    capabilities: [
      { t: "Custom MCP servers", d: "Expose your APIs, databases and SaaS tools as MCP tools and resources." },
      { t: "OAuth and permissions", d: "Per-user authentication, scopes and audit logging." },
      { t: "Hosting", d: "Remote MCP servers deployed on your cloud with monitoring." },
      { t: "Product integrations", d: "Ship an MCP server for your SaaS so customers can use it from their AI assistant." },
    ],
    useCases: ["Internal data access for Claude and ChatGPT", "SaaS product MCP connectors", "Agent tool layers"],
    stack: ["MCP", "TypeScript", "Python", "OAuth 2.1", "Cloudflare", "AWS Lambda"],
    faqs: [
      { q: "Why would our product need an MCP server?", a: "Your customers increasingly work inside AI assistants. An MCP server lets them use your product from there, which keeps you in their workflow." },
      { q: "Is it secure?", a: "We implement OAuth, least-privilege scopes, rate limits and full logging, and we review every tool for data exposure." },
    ],
    keywords: ["mcp server development", "model context protocol", "ai assistant integration"],
  },

  // ───────────── AI & machine learning ─────────────
  {
    slug: "ai-consulting",
    category: "ai",
    title: "AI Strategy & Consulting",
    short: "Find the AI use cases worth funding and a plan to deliver them.",
    headline: "Know where AI pays off before you spend on it",
    intro:
      "Our consultants work with your leadership and teams to find high-value use cases, assess data readiness, estimate ROI and build a practical roadmap, from first pilot to company-wide adoption.",
    capabilities: [
      { t: "Opportunity assessment", d: "Workshops and process reviews that rank use cases by value and feasibility." },
      { t: "Data readiness", d: "An honest look at the data you have, its quality and what's missing." },
      { t: "Build vs. buy", d: "Vendor and tool comparisons with total cost of ownership." },
      { t: "Roadmap and governance", d: "Phased plan, success metrics and an AI usage policy." },
    ],
    useCases: ["Executive AI roadmaps", "Proof-of-concept selection", "AI policy and training"],
    stack: ["Process mapping", "ROI modeling", "Vendor evaluation", "NIST AI RMF"],
    faqs: [
      { q: "What do we get at the end of a consulting engagement?", a: "A ranked use-case list with ROI estimates, an architecture recommendation, a phased roadmap with costs, and usually a working prototype of the top idea." },
      { q: "How long does it take?", a: "A focused assessment takes 2–4 weeks." },
    ],
    keywords: ["ai consulting services", "ai strategy consulting", "ai readiness assessment"],
  },
  {
    slug: "ai-software-development",
    category: "ai",
    title: "AI Software Development",
    short: "Custom AI-powered applications built end to end.",
    headline: "Custom AI software, from idea to production",
    intro:
      "We build complete AI-powered applications: the models, the data pipelines, the user interface and the cloud infrastructure, engineered for security and scale from day one.",
    capabilities: [
      { t: "AI-first product engineering", d: "Web and mobile apps with AI at the core, not bolted on." },
      { t: "Backend and APIs", d: "Scalable services, queues and model-serving infrastructure." },
      { t: "Security and compliance", d: "SOC 2-ready practices, encryption and access controls." },
      { t: "Ongoing support", d: "Monitoring, updates and feature development after launch." },
    ],
    useCases: ["AI-powered SaaS platforms", "Internal decision-support tools", "Customer-facing AI apps"],
    stack: ["Python", "FastAPI", "Node.js", "Next.js", "PostgreSQL", "AWS"],
    faqs: [
      { q: "Do we own the code?", a: "Yes. You own all source code, models trained on your data and documentation." },
      { q: "Can you start from our existing product?", a: "Yes. We regularly add AI capabilities to existing codebases after a short technical review." },
    ],
    keywords: ["ai software development company", "custom ai development", "ai app development"],
  },
  {
    slug: "machine-learning",
    category: "ai",
    title: "Machine Learning Development",
    short: "Predictive and classification models trained on your data.",
    headline: "Machine learning models that improve real decisions",
    intro:
      "From churn prediction to dynamic pricing, we build, train and deploy machine learning models that turn your historical data into reliable predictions, and we keep them accurate as your data changes.",
    capabilities: [
      { t: "Custom model development", d: "Classification, regression, clustering and time-series models." },
      { t: "Recommendation systems", d: "Personalization engines for products, content and offers." },
      { t: "Feature engineering", d: "Turning raw data into signals that models can learn from." },
      { t: "Deployment", d: "Real-time and batch inference with monitoring for drift." },
    ],
    useCases: ["Churn and lifetime-value prediction", "Dynamic pricing", "Product recommendations"],
    stack: ["scikit-learn", "XGBoost", "PyTorch", "TensorFlow", "Databricks", "SageMaker"],
    faqs: [
      { q: "How much historical data do we need?", a: "It varies by problem, but many useful models start with one to two years of transactional data. We'll assess yours in discovery." },
      { q: "How do you know the model works?", a: "We validate on held-out data, run A/B tests in production and report business metrics, not only accuracy." },
    ],
    keywords: ["machine learning development company", "ml development services", "custom machine learning models"],
  },
  {
    slug: "natural-language-processing",
    category: "ai",
    title: "Natural Language Processing",
    short: "Understand, classify and extract meaning from text at scale.",
    headline: "Turn unstructured text into structured answers",
    intro:
      "We build NLP systems that read emails, reviews, contracts and transcripts to classify, extract entities, detect sentiment and route work automatically.",
    capabilities: [
      { t: "Text classification", d: "Route tickets, tag content and detect intent." },
      { t: "Entity extraction", d: "Pull names, dates, amounts and clauses from text." },
      { t: "Sentiment and topic analysis", d: "Understand what customers say across channels." },
      { t: "Multilingual NLP", d: "Support for English, Spanish and 50+ other languages." },
    ],
    useCases: ["Support ticket routing", "Review and survey analysis", "Contract data extraction"],
    stack: ["spaCy", "Hugging Face", "OpenAI", "Claude", "BERT", "Elasticsearch"],
    faqs: [
      { q: "Is NLP still relevant now that LLMs exist?", a: "Yes. We combine LLMs with smaller specialized models so you get accuracy where it matters and low cost at high volume." },
      { q: "Can it handle Spanish?", a: "Yes, and many other languages, which matters for US customer bases." },
    ],
    keywords: ["nlp development services", "natural language processing company", "text analytics"],
  },
  {
    slug: "computer-vision",
    category: "ai",
    isNew: true,
    title: "Computer Vision",
    short: "Image and video AI for inspection, detection and analysis.",
    headline: "Systems that see what your team would miss",
    intro:
      "We develop computer vision solutions that detect objects, inspect quality, read documents and analyze video, deployed in the cloud or on edge devices on the factory floor or in the field.",
    capabilities: [
      { t: "Object detection", d: "Identify and count items, people or vehicles in images and video." },
      { t: "Visual inspection", d: "Spot defects and anomalies on production lines." },
      { t: "OCR and document vision", d: "Read text from scans, receipts, IDs and forms." },
      { t: "Edge deployment", d: "Run models on NVIDIA Jetson, mobile devices and cameras." },
    ],
    useCases: ["Manufacturing quality control", "Retail shelf analytics", "Property and insurance photo assessment"],
    stack: ["YOLO", "OpenCV", "PyTorch", "NVIDIA Jetson", "AWS Rekognition", "GPT-4o vision"],
    faqs: [
      { q: "Do we need thousands of labeled images?", a: "Not always. Modern vision foundation models and synthetic data cut labeling needs significantly." },
      { q: "Can it run without internet?", a: "Yes. We deploy optimized models on edge hardware that works offline." },
    ],
    keywords: ["computer vision development", "image recognition ai", "visual inspection ai"],
  },
  {
    slug: "predictive-analytics",
    category: "ai",
    isNew: true,
    title: "Predictive Analytics",
    short: "Forecast demand, risk and revenue with confidence.",
    headline: "See what's coming and plan for it",
    intro:
      "We combine your business data with forecasting models and clear dashboards so leaders can anticipate demand, spot risk early and act before problems show up in the numbers.",
    capabilities: [
      { t: "Demand forecasting", d: "Sales, inventory and staffing forecasts by location and product." },
      { t: "Risk scoring", d: "Credit, fraud, churn and operational risk models." },
      { t: "Dashboards", d: "Forecasts delivered in Power BI, Looker, Tableau or a custom app." },
      { t: "Scenario planning", d: "What-if tools to test pricing and supply decisions." },
    ],
    useCases: ["Inventory planning", "Cash-flow forecasting", "Customer churn early warning"],
    stack: ["Prophet", "XGBoost", "Snowflake", "dbt", "Power BI", "Looker"],
    faqs: [
      { q: "How accurate are forecasts?", a: "We report accuracy ranges on your historical data before launch and track them live, so you know how much to trust each forecast." },
      { q: "Can it use outside data like weather or holidays?", a: "Yes. External signals often improve forecasts noticeably." },
    ],
    keywords: ["predictive analytics services", "ai forecasting", "demand forecasting ai"],
  },
  {
    slug: "intelligent-document-processing",
    category: "ai",
    isNew: true,
    title: "Intelligent Document Processing",
    short: "Extract, validate and route data from invoices, forms and contracts.",
    headline: "Stop retyping data from documents",
    intro:
      "We automate document-heavy work with AI that reads PDFs, scans and emails, extracts the fields you need, validates them against your systems and routes exceptions to a person.",
    capabilities: [
      { t: "Data extraction", d: "Invoices, purchase orders, claims, IDs, bank statements and contracts." },
      { t: "Validation rules", d: "Cross-check extracted data against your ERP or CRM." },
      { t: "Human-in-the-loop review", d: "Simple review screens for low-confidence fields." },
      { t: "System integration", d: "Push clean data to QuickBooks, NetSuite, SAP or Salesforce." },
    ],
    useCases: ["Accounts payable automation", "Insurance claims intake", "Loan and KYC document review"],
    stack: ["Azure Document Intelligence", "AWS Textract", "GPT-4o", "Claude", "Python", "n8n"],
    faqs: [
      { q: "What accuracy can we expect?", a: "Typical field-level accuracy is 95%+ on standard documents, with low-confidence fields sent for quick human review." },
      { q: "Does it work with handwriting?", a: "Often yes, depending on legibility. We test on your samples first." },
    ],
    keywords: ["intelligent document processing", "invoice ocr automation", "document ai"],
  },
  {
    slug: "ai-automation",
    category: "ai",
    isNew: true,
    title: "AI Workflow Automation",
    short: "Automate repetitive processes across your apps with AI decision-making.",
    headline: "Automate the busywork between your apps",
    intro:
      "We combine workflow tools, RPA and language models to automate the repetitive tasks that eat your team's day, like data entry, report building, follow-ups and approvals, while keeping people in control of exceptions.",
    capabilities: [
      { t: "Process discovery", d: "Find the tasks with the most hours to save." },
      { t: "Workflow builds", d: "n8n, Make, Zapier, Power Automate or custom code." },
      { t: "AI decision steps", d: "Classify, summarize and draft responses inside workflows." },
      { t: "Monitoring", d: "Alerts, retries and run history for every automation." },
    ],
    useCases: ["Lead routing and CRM updates", "Weekly reporting", "Employee onboarding"],
    stack: ["n8n", "Make", "Zapier", "Power Automate", "UiPath", "OpenAI"],
    faqs: [
      { q: "Should we use no-code tools or custom code?", a: "We pick based on volume, complexity and who will maintain it. Many clients start with n8n or Make and move critical flows to code later." },
      { q: "How quickly do we see results?", a: "First automations often go live within two to three weeks." },
    ],
    keywords: ["ai automation services", "workflow automation ai", "rpa with ai"],
  },
  {
    slug: "mlops",
    category: "ai",
    isNew: true,
    title: "MLOps & LLMOps",
    short: "Deploy, monitor and maintain models reliably in production.",
    headline: "Keep AI accurate, fast and affordable after launch",
    intro:
      "We set up the pipelines, monitoring and governance that keep machine learning and LLM systems healthy: automated retraining, evaluation, prompt versioning, cost tracking and alerting.",
    capabilities: [
      { t: "CI/CD for models", d: "Automated training, testing and deployment pipelines." },
      { t: "LLM observability", d: "Trace every request, score quality and track token spend." },
      { t: "Drift detection", d: "Alerts when data or model behavior changes." },
      { t: "Model registry", d: "Versioning and rollback for models and prompts." },
    ],
    useCases: ["Production LLM monitoring", "Automated model retraining", "AI cost reduction"],
    stack: ["MLflow", "Langfuse", "LangSmith", "Kubeflow", "Weights & Biases", "Datadog"],
    faqs: [
      { q: "We already have models in production. Can you help?", a: "Yes. We audit what's running and add monitoring, evaluation and cost controls without disrupting it." },
      { q: "How much can LLMOps save?", a: "Caching, model routing and prompt optimization often cut LLM costs substantially while keeping quality steady." },
    ],
    keywords: ["mlops services", "llmops", "llm observability"],
  },
  {
    slug: "data-engineering",
    category: "ai",
    isNew: true,
    title: "Data Engineering for AI",
    short: "Clean, connected data pipelines that AI can rely on.",
    headline: "The data foundation every AI project needs",
    intro:
      "Most AI projects stall on data. We build the pipelines, warehouses and governance that bring your data together, keep it clean and make it ready for analytics, machine learning and LLM applications.",
    capabilities: [
      { t: "Pipelines and ETL", d: "Batch and streaming pipelines from SaaS tools and databases." },
      { t: "Modern data warehouse", d: "Snowflake, BigQuery, Redshift or Databricks lakehouse setups." },
      { t: "Data quality", d: "Testing, lineage and monitoring for trustworthy data." },
      { t: "Vector data", d: "Embedding pipelines and vector stores for AI search." },
    ],
    useCases: ["Single customer view", "Analytics modernization", "AI-ready data lakes"],
    stack: ["Snowflake", "Databricks", "BigQuery", "dbt", "Airflow", "Fivetran"],
    faqs: [
      { q: "Do we need a data warehouse before doing AI?", a: "Not always, but most companies benefit from one within the first year of AI work. We'll recommend the lightest setup that works." },
      { q: "Can you migrate from our legacy systems?", a: "Yes, including on-premise SQL Server and Oracle." },
    ],
    keywords: ["data engineering services", "ai data pipeline", "data warehouse consulting"],
  },
  {
    slug: "ai-governance",
    category: "ai",
    isNew: true,
    title: "AI Governance & Security",
    short: "Responsible, compliant and secure AI your legal team can sign off on.",
    headline: "AI you can explain to regulators and customers",
    intro:
      "We help you adopt AI responsibly with policies, risk assessments, red-teaming and technical safeguards aligned with the NIST AI Risk Management Framework, state privacy laws and industry rules like HIPAA.",
    capabilities: [
      { t: "AI risk assessments", d: "Map AI systems, data flows and risks across your company." },
      { t: "Red-teaming", d: "Test for prompt injection, data leakage and harmful outputs." },
      { t: "Policy and controls", d: "Acceptable-use policies, approval workflows and audit trails." },
      { t: "Privacy engineering", d: "PII redaction, data residency and retention controls." },
    ],
    useCases: ["Pre-launch AI security reviews", "Enterprise AI usage policies", "Customer security questionnaires"],
    stack: ["NIST AI RMF", "ISO 42001", "OWASP LLM Top 10", "Presidio", "Guardrails"],
    faqs: [
      { q: "Which regulations apply to our AI?", a: "It depends on your industry and states you operate in. Common ones include HIPAA, GLBA, CCPA/CPRA, Colorado's AI Act and FTC guidance. We map them for you; final legal review stays with your counsel." },
      { q: "What is prompt injection?", a: "An attack where hidden instructions in content trick an AI into doing something it shouldn't. We test for it and add defenses." },
    ],
    keywords: ["ai governance consulting", "responsible ai", "llm security testing"],
  },

  // ───────────── Software engineering ─────────────
  {
    slug: "web-app-development",
    category: "engineering",
    title: "Web App Development",
    short: "Fast, secure web applications and SaaS platforms.",
    headline: "Web applications your users enjoy and your team can grow",
    intro:
      "We design and engineer custom web applications, portals and SaaS products with modern frameworks, clean architecture and the performance standards US users expect.",
    capabilities: [
      { t: "SaaS platforms", d: "Multi-tenant apps with billing, roles and admin tools." },
      { t: "Customer portals", d: "Secure self-service for accounts, orders and documents." },
      { t: "API development", d: "REST and GraphQL APIs with documentation." },
      { t: "Performance and accessibility", d: "Core Web Vitals and WCAG 2.2 AA built in." },
    ],
    useCases: ["B2B SaaS products", "Booking and marketplace platforms", "Internal operations dashboards"],
    stack: ["Next.js", "React", "Node.js", "Laravel", "PostgreSQL", "Vercel"],
    faqs: [
      { q: "Do you build accessible (ADA-compliant) apps?", a: "Yes. We design and test against WCAG 2.2 AA, the standard US courts and agencies reference for ADA web accessibility." },
      { q: "Can you take over an existing app?", a: "Yes, after a code audit we'll give you a plan to stabilize and improve it." },
    ],
    keywords: ["web app development company", "custom web application development", "saas development"],
  },
  {
    slug: "mobile-app-development",
    category: "engineering",
    title: "Mobile App Development",
    short: "iOS, Android, cross-platform and progressive web apps.",
    headline: "Mobile apps people keep on their home screen",
    intro:
      "We build native iOS and Android apps, cross-platform apps with React Native and Flutter, and progressive web apps, including AI features like on-device intelligence and smart assistants.",
    capabilities: [
      { t: "iOS development", d: "Swift and SwiftUI apps built to Apple's guidelines." },
      { t: "Android development", d: "Kotlin and Jetpack Compose apps for every device size." },
      { t: "Cross-platform", d: "React Native and Flutter apps from one codebase." },
      { t: "Progressive web apps", d: "Installable, offline-ready web apps." },
    ],
    useCases: ["Consumer apps", "Field-service apps", "Healthcare and fitness apps"],
    stack: ["Swift", "Kotlin", "React Native", "Flutter", "Firebase", "Expo"],
    faqs: [
      { q: "Native or cross-platform?", a: "Cross-platform suits most business apps and saves budget. We recommend native for heavy graphics, advanced hardware access or platform-specific experiences." },
      { q: "Do you handle App Store submission?", a: "Yes, including review guidelines, privacy labels and release management." },
    ],
    keywords: ["mobile app development company", "ios app development", "android app development"],
  },
  {
    slug: "full-stack-development",
    category: "engineering",
    title: "Full Stack Development",
    short: "End-to-end engineering across frontend, backend and cloud.",
    headline: "One team for the whole stack",
    intro:
      "Our full-stack engineers handle everything from interface to database to deployment, so features move from idea to production without handoffs between vendors.",
    capabilities: [
      { t: "Frontend", d: "React, Next.js, Vue and Angular interfaces." },
      { t: "Backend", d: "Node.js, Python, PHP, .NET and Go services." },
      { t: "Databases", d: "PostgreSQL, MySQL, MongoDB and Redis design." },
      { t: "DevOps", d: "CI/CD, containers and infrastructure as code." },
    ],
    useCases: ["New product builds", "Legacy modernization", "Feature development teams"],
    stack: ["TypeScript", "React", "Node.js", "Python", "Docker", "Terraform"],
    faqs: [
      { q: "Can we hire full-stack developers by the month?", a: "Yes. See our Hire Engineers page for dedicated and augmented team options." },
      { q: "Do you write tests?", a: "Yes. Unit, integration and end-to-end tests are part of every sprint." },
    ],
    keywords: ["full stack development services", "full stack developers", "custom software development"],
  },
  {
    slug: "mvp-development",
    category: "engineering",
    isNew: true,
    title: "AI MVP & Product Development",
    short: "Launch an AI product in weeks, then scale what works.",
    headline: "From idea to paying users, fast",
    intro:
      "For startups and new business lines, we scope the smallest product that proves your idea, build it with AI at its core and help you launch, measure and iterate toward product-market fit.",
    capabilities: [
      { t: "Product scoping", d: "Define the core loop and cut everything else." },
      { t: "Rapid build", d: "Working MVP in 6–10 weeks with production-quality foundations." },
      { t: "Launch support", d: "Analytics, onboarding and App Store or web launch." },
      { t: "Investor-ready", d: "Clean code and documentation for due diligence." },
    ],
    useCases: ["Startup MVPs", "Corporate innovation pilots", "AI feature validation"],
    stack: ["Next.js", "Supabase", "OpenAI", "Claude", "Stripe", "Vercel"],
    faqs: [
      { q: "How much does an MVP cost?", a: "It depends on scope. We'll give a fixed-price quote after a short scoping session." },
      { q: "Can you use CodeConductor to move faster?", a: "Yes. Our CodeConductor platform accelerates scaffolding and routine code so more budget goes into what makes your product different." },
    ],
    keywords: ["ai mvp development", "startup app development", "product development company"],
  },
  {
    slug: "wordpress-development",
    category: "engineering",
    title: "WordPress Development",
    short: "Custom themes, plugins, headless WordPress and WooCommerce.",
    headline: "WordPress, built properly",
    intro:
      "We build fast, secure WordPress sites: custom themes, plugins, WooCommerce stores and headless setups where WordPress manages content and a modern frontend delivers it.",
    capabilities: [
      { t: "Custom themes", d: "Pixel-accurate, lightweight themes with block editor support." },
      { t: "Plugin development", d: "Custom functionality and third-party integrations." },
      { t: "Headless WordPress", d: "WordPress as a CMS with a Next.js frontend." },
      { t: "WooCommerce", d: "Stores, subscriptions and payment integrations." },
    ],
    useCases: ["Corporate websites", "Content and blog platforms", "eCommerce stores"],
    stack: ["WordPress", "PHP", "WooCommerce", "ACF", "WPGraphQL", "Next.js"],
    faqs: [
      { q: "Can you speed up our slow WordPress site?", a: "Yes. Performance audits, caching, image optimization and code cleanup usually bring big improvements." },
      { q: "What is headless WordPress?", a: "Your team keeps editing in WordPress, while visitors get a faster, more secure site built with a modern framework." },
    ],
    keywords: ["wordpress development services", "custom wordpress development", "headless wordpress"],
  },

  // ───────────── Cloud, security & IT ─────────────
  {
    slug: "cloud-computing",
    category: "cloud",
    title: "Cloud Computing",
    short: "Cloud migration, architecture and cost optimization on AWS, Azure and GCP.",
    headline: "Cloud infrastructure that scales and stays affordable",
    intro:
      "We plan and run cloud migrations, design resilient architectures and tune your spend across AWS, Microsoft Azure and Google Cloud, including GPU infrastructure for AI workloads.",
    capabilities: [
      { t: "Cloud migration", d: "Move on-premise apps and data with minimal downtime." },
      { t: "Architecture", d: "Well-architected, secure and highly available designs." },
      { t: "Cost optimization", d: "Rightsizing, reserved capacity and FinOps reporting." },
      { t: "AI infrastructure", d: "GPU clusters, model serving and vector databases." },
    ],
    useCases: ["Data center exits", "Kubernetes adoption", "Cloud cost reduction"],
    stack: ["AWS", "Azure", "Google Cloud", "Kubernetes", "Terraform", "Docker"],
    faqs: [
      { q: "Which cloud should we choose?", a: "We recommend based on your existing tools, team skills and workloads. Microsoft-heavy companies often fit Azure; many startups choose AWS or GCP." },
      { q: "Can you reduce our cloud bill?", a: "Most environments we review have meaningful savings available through rightsizing and commitments." },
    ],
    keywords: ["cloud computing services", "cloud migration services", "aws consulting"],
  },
  {
    slug: "managed-it-support",
    category: "cloud",
    title: "Managed IT Support",
    short: "Proactive IT management, help desk and monitoring.",
    headline: "IT that's handled, so your team can work",
    intro:
      "Our managed IT services cover help desk, device management, Microsoft 365 and Google Workspace administration, backups and 24/7 monitoring for growing businesses.",
    capabilities: [
      { t: "Help desk", d: "Fast ticket response for your employees." },
      { t: "Monitoring", d: "24/7 alerts for servers, networks and endpoints." },
      { t: "Workspace admin", d: "Microsoft 365 and Google Workspace management." },
      { t: "Backup and recovery", d: "Tested backups and disaster recovery plans." },
    ],
    useCases: ["Outsourced IT for SMBs", "Co-managed IT for internal teams", "Office moves and setups"],
    stack: ["Microsoft 365", "Intune", "Google Workspace", "NinjaOne", "Veeam"],
    faqs: [
      { q: "Do you offer onsite support in the US?", a: "Our support is primarily remote, with onsite help arranged through local partners when needed." },
      { q: "How are services priced?", a: "Usually per user or per device per month, with a clear scope." },
    ],
    keywords: ["managed it services", "it support company", "outsourced it"],
  },
  {
    slug: "cybersecurity",
    category: "cloud",
    title: "Cybersecurity Services",
    short: "Assessments, penetration testing and threat protection.",
    headline: "Find the gaps before attackers do",
    intro:
      "We protect your applications, cloud and people with security assessments, penetration testing, endpoint protection and compliance readiness for frameworks like SOC 2 and HIPAA.",
    capabilities: [
      { t: "Penetration testing", d: "Web, API, mobile and cloud testing with clear fixes." },
      { t: "Security assessments", d: "Gap analysis against NIST CSF and CIS controls." },
      { t: "Compliance readiness", d: "SOC 2, HIPAA and PCI DSS preparation." },
      { t: "Managed detection", d: "Endpoint protection and threat monitoring." },
    ],
    useCases: ["Pre-audit SOC 2 readiness", "Annual penetration tests", "Incident response planning"],
    stack: ["NIST CSF", "OWASP", "Burp Suite", "CrowdStrike", "Vanta", "Drata"],
    faqs: [
      { q: "How often should we run a penetration test?", a: "At least yearly and after major releases. Many customer contracts and frameworks require it." },
      { q: "Can you help us pass SOC 2?", a: "Yes, we prepare policies, controls and evidence, and work alongside your auditor." },
    ],
    keywords: ["cybersecurity services", "penetration testing company", "soc 2 readiness"],
  },
  {
    slug: "wordpress-security",
    category: "cloud",
    title: "WordPress Security",
    short: "Malware removal, hack recovery and hardening for WordPress.",
    headline: "Hacked WordPress site? We'll get it clean and keep it that way",
    intro:
      "Through our WP Hacked Help product, we remove malware, recover hacked sites, clear blacklists and harden WordPress against future attacks with monitoring and firewalls.",
    capabilities: [
      { t: "Malware removal", d: "Deep cleanup of files and databases." },
      { t: "Blacklist removal", d: "Google, Norton and McAfee delisting." },
      { t: "Hardening", d: "Firewall, login protection and updates." },
      { t: "Monitoring", d: "Ongoing scans and uptime alerts." },
    ],
    useCases: ["Emergency hack recovery", "SEO spam cleanup", "Ongoing site protection"],
    stack: ["WordPress", "Cloudflare", "Wordfence", "Sucuri", "PHP"],
    faqs: [
      { q: "How fast can you clean a hacked site?", a: "Most cleanups are completed within hours of access being granted." },
      { q: "Will my SEO recover?", a: "We remove spam pages and request reviews so search engines recrawl the clean site." },
    ],
    keywords: ["wordpress malware removal", "hacked wordpress repair", "wordpress security services"],
  },

  // ───────────── Design & growth ─────────────
  {
    slug: "ui-ux-design",
    category: "growth",
    title: "Product Design (UI/UX)",
    short: "Research-driven interfaces for web, mobile and AI products.",
    headline: "Products that feel obvious to use",
    intro:
      "Our designers research your users, map journeys and design interfaces and design systems for web, mobile and AI experiences, including the conversational and agent interfaces that are new to most teams.",
    capabilities: [
      { t: "UX research", d: "Interviews, usability tests and analytics reviews." },
      { t: "UI design", d: "High-fidelity screens and interactive prototypes." },
      { t: "Design systems", d: "Reusable components in Figma and code." },
      { t: "AI experience design", d: "Patterns for chat, agents, confidence and human review." },
    ],
    useCases: ["New product design", "App redesigns", "Design system creation"],
    stack: ["Figma", "Framer", "Maze", "Hotjar", "Storybook"],
    faqs: [
      { q: "Do you design for accessibility?", a: "Yes, to WCAG 2.2 AA: color contrast, keyboard use, screen readers and clear focus states." },
      { q: "Can you work with our developers?", a: "Yes. We hand off clean Figma files and specs, or our engineers build it." },
    ],
    keywords: ["ui ux design company", "product design agency", "app design services"],
  },
  {
    slug: "ai-seo",
    category: "growth",
    isNew: true,
    title: "AI SEO & Generative Engine Optimization",
    short: "Rank on Google and get cited by ChatGPT, Perplexity and AI Overviews.",
    headline: "Be the answer in Google and in AI search",
    intro:
      "Search now happens in Google, AI Overviews, ChatGPT, Perplexity and Gemini. We combine technical SEO, content strategy and generative engine optimization so your brand is found and cited wherever buyers ask.",
    capabilities: [
      { t: "Technical SEO", d: "Site speed, structured data, crawlability and Core Web Vitals." },
      { t: "Generative engine optimization", d: "Content and entity signals that AI assistants cite." },
      { t: "Content strategy", d: "Topic clusters and expert content that earns rankings." },
      { t: "Local SEO", d: "Google Business Profile and city pages for US markets." },
    ],
    useCases: ["B2B lead generation", "Local service businesses", "SaaS organic growth"],
    stack: ["Google Search Console", "Ahrefs", "Semrush", "Schema.org", "GA4"],
    faqs: [
      { q: "What is generative engine optimization (GEO)?", a: "Making your content easy for AI assistants to find, trust and cite, through clear answers, structured data, authoritative mentions and consistent entity information." },
      { q: "How long does SEO take?", a: "Technical fixes show results in weeks; content and authority typically build over three to six months." },
    ],
    keywords: ["ai seo services", "generative engine optimization", "seo company"],
  },
  {
    slug: "ppc",
    category: "growth",
    title: "PPC Management",
    short: "Google Ads, Microsoft Ads and paid social that pay for themselves.",
    headline: "Paid campaigns measured in pipeline, not clicks",
    intro:
      "We plan, launch and optimize paid search and social campaigns with AI-assisted bidding, conversion tracking and landing pages built to convert.",
    capabilities: [
      { t: "Paid search", d: "Google Ads and Microsoft Ads campaigns." },
      { t: "Paid social", d: "LinkedIn, Meta and YouTube advertising." },
      { t: "Conversion tracking", d: "GA4, server-side tagging and offline conversions." },
      { t: "Landing pages", d: "Fast, tested pages that lift conversion rates." },
    ],
    useCases: ["B2B lead generation", "eCommerce sales", "Local service calls"],
    stack: ["Google Ads", "Microsoft Ads", "LinkedIn Ads", "Meta Ads", "GA4", "Looker Studio"],
    faqs: [
      { q: "What budget do we need?", a: "It depends on your market and goals. We'll recommend a test budget and scale what performs." },
      { q: "Do you lock us into long contracts?", a: "No. Engagements are month to month after an initial setup period." },
    ],
    keywords: ["ppc management services", "google ads agency", "paid search agency"],
  },
  {
    slug: "digital-marketing",
    category: "growth",
    title: "Digital Marketing",
    short: "Full-funnel marketing powered by AI tools and data.",
    headline: "Marketing that compounds",
    intro:
      "We bring SEO, paid media, content, email and analytics together into one plan, using AI tools to move faster and data to decide where each dollar goes.",
    capabilities: [
      { t: "Strategy", d: "Channel plan, budgets and KPIs tied to revenue." },
      { t: "Content marketing", d: "Articles, case studies and video scripts." },
      { t: "Email and automation", d: "Nurture flows in HubSpot, Klaviyo or Mailchimp." },
      { t: "Analytics", d: "Dashboards and attribution you can trust." },
    ],
    useCases: ["Startup go-to-market", "B2B demand generation", "eCommerce growth"],
    stack: ["HubSpot", "GA4", "Klaviyo", "Semrush", "Looker Studio"],
    faqs: [
      { q: "Can you work alongside our in-house team?", a: "Yes. Many clients use us for specific channels or extra capacity." },
      { q: "How do you report results?", a: "A live dashboard plus a monthly review focused on leads, pipeline and revenue." },
    ],
    keywords: ["digital marketing agency", "ai marketing services", "b2b digital marketing"],
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
export const servicesIn = (c: CategoryId) => services.filter((s) => s.category === c);
