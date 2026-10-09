import {
  Bot, Sparkles, Library, SlidersHorizontal, MessagesSquare, Mic, Plug, Compass, Cpu, BrainCircuit, Languages,
  ScanEye, TrendingUp, FileScan, Workflow, Gauge, Database, ShieldCheck, Globe, Smartphone, Layers, Rocket,
  PanelsTopLeft, Cloud, Headset, Lock, ShieldAlert, PenTool, Search, MousePointerClick, Megaphone, type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  "ai-agent-development": Bot,
  "generative-ai-integration": Sparkles,
  "rag-development": Library,
  "llm-fine-tuning": SlidersHorizontal,
  "ai-chatbot-development": MessagesSquare,
  "voice-ai-agents": Mic,
  "mcp-development": Plug,
  "ai-consulting": Compass,
  "ai-software-development": Cpu,
  "machine-learning": BrainCircuit,
  "natural-language-processing": Languages,
  "computer-vision": ScanEye,
  "predictive-analytics": TrendingUp,
  "intelligent-document-processing": FileScan,
  "ai-automation": Workflow,
  mlops: Gauge,
  "data-engineering": Database,
  "ai-governance": ShieldCheck,
  "web-app-development": Globe,
  "mobile-app-development": Smartphone,
  "full-stack-development": Layers,
  "mvp-development": Rocket,
  "wordpress-development": PanelsTopLeft,
  "cloud-computing": Cloud,
  "managed-it-support": Headset,
  cybersecurity: Lock,
  "wordpress-security": ShieldAlert,
  "ui-ux-design": PenTool,
  "ai-seo": Search,
  ppc: MousePointerClick,
  "digital-marketing": Megaphone,
};

export function ServiceIcon({ slug, size = 22 }: { slug: string; size?: number }) {
  const Icon = map[slug] || Sparkles;
  return <Icon size={size} strokeWidth={1.8} aria-hidden="true" />;
}
