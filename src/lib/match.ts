import { services, type Service } from "@/data/services";

// Lightweight on-page matcher: keyword scores map a plain-language problem to services.
export const signals: Record<string, string[]> = {
  "ai-agent-development": ["agent", "automate", "autonomous", "workflow", "tasks", "busywork", "operations", "back office", "manual"],
  "ai-chatbot-development": ["chat", "chatbot", "support", "customers", "questions", "tickets", "faq", "help desk", "website"],
  "voice-ai-agents": ["phone", "calls", "call", "voice", "receptionist", "missed", "after hours", "booking"],
  "rag-development": ["documents", "knowledge", "search", "wiki", "policies", "find information", "answers", "sharepoint"],
  "intelligent-document-processing": ["invoice", "invoices", "pdf", "forms", "paperwork", "data entry", "extract", "contracts", "claims"],
  "predictive-analytics": ["forecast", "predict", "demand", "inventory", "churn", "planning", "trends", "data"],
  "machine-learning": ["model", "recommend", "recommendation", "pricing", "personalize", "predict", "fraud"],
  "ai-consulting": ["strategy", "where to start", "roadmap", "not sure", "ideas", "use cases", "leadership", "budget"],
  "generative-ai-integration": ["content", "writing", "summarize", "gpt", "chatgpt", "openai", "claude", "generate", "llm"],
  "ai-automation": ["automate", "zapier", "reports", "crm", "repetitive", "spreadsheets", "copy paste", "manual"],
  "mvp-development": ["startup", "mvp", "idea", "launch", "investors", "new product"],
  "mobile-app-development": ["app", "ios", "android", "mobile", "iphone"],
  "web-app-development": ["portal", "saas", "platform", "web app", "dashboard", "website"],
  "ai-seo": ["seo", "google", "traffic", "rank", "chatgpt search", "visibility", "leads", "found"],
  "cybersecurity": ["security", "hacked", "breach", "soc 2", "compliance", "penetration"],
  "computer-vision": ["camera", "images", "photos", "video", "inspection", "defects"],
  "mcp-development": ["mcp", "claude", "connect", "integrate", "assistant access"],
  "ai-governance": ["risk", "policy", "compliance", "hipaa", "governance", "responsible"],
  "cloud-computing": ["cloud", "aws", "azure", "servers", "hosting", "migrate"],
  "llm-fine-tuning": ["fine-tune", "fine tune", "custom model", "private model", "on-prem"],
};


/** Maps a plain-language business problem to the most relevant services. */
export function matchServices(input: string, max = 3): Service[] {
  const text = input.toLowerCase().trim();
  if (!text) return [];
  const scored = Object.entries(signals)
    .map(([slug, words]) => ({ slug, score: words.reduce((n, w) => n + (text.includes(w) ? (w.includes(" ") ? 2 : 1) : 0), 0) }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, max);
  const list = [...scored];
  for (const slug of ["ai-consulting", "ai-agent-development", "ai-automation", "generative-ai-integration"]) {
    if (list.length >= max) break;
    if (!list.some((x) => x.slug === slug)) list.push({ slug, score: 0 });
  }
  return list.map((s) => services.find((x) => x.slug === s.slug)).filter(Boolean) as Service[];
}
