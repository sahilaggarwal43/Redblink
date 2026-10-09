"use client";
import { useEffect, useState } from "react";

const inputs = [
  { label: "Email inbox", y: 70 },
  { label: "Support tickets", y: 190 },
  { label: "Contracts & PDFs", y: 310 },
];
const tools = [
  { label: "Salesforce CRM", y: 40 },
  { label: "ERP / billing", y: 130 },
  { label: "Knowledge base", y: 220 },
  { label: "Human approval", y: 310, gate: true },
];
const CX = 290, CY = 160, CW = 160, CH = 110;

function inPath(y: number) {
  const sy = y + 24, ey = CY + CH / 2;
  return `M190 ${sy} C 240 ${sy}, 240 ${ey}, ${CX} ${ey}`;
}
function outPath(y: number) {
  const sy = CY + CH / 2, ey = y + 24;
  return `M${CX + CW} ${sy} C ${CX + CW + 50} ${sy}, ${CX + CW + 40} ${ey}, 520 ${ey}`;
}

/** Example agent workflow diagram with live packets moving through it. */
export function AgentFlow() {
  const [done, setDone] = useState(1184);
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const a = setInterval(() => setDone((d) => d + 1), 1400);
    const b = setInterval(() => setStep((s) => (s + 1) % 4), 1800);
    return () => { clearInterval(a); clearInterval(b); };
  }, []);
  const states = ["Reading request", "Checking CRM record", "Drafting resolution", "Waiting for approval"];

  return (
    <figure className="flow" style={{ margin: 0 }}>
      <svg viewBox="0 0 720 390" role="img" aria-labelledby="flow-t flow-d">
        <title id="flow-t">Example AI agent workflow</title>
        <desc id="flow-d">Requests from email, tickets and documents flow into an orchestrator agent, which uses CRM, ERP and a knowledge base, and routes high-risk actions to a person for approval.</desc>
        <defs>
          <linearGradient id="fl-in" x1="0" x2="1"><stop offset="0" stopColor="rgba(255,255,255,.08)" /><stop offset="1" stopColor="rgba(255,255,255,.35)" /></linearGradient>
        </defs>

        {inputs.map((n) => <path key={n.label} id={`in-${n.y}`} d={inPath(n.y)} fill="none" stroke="url(#fl-in)" strokeWidth="1" />)}
        {tools.map((n) => <path key={n.label} id={`out-${n.y}`} d={outPath(n.y)} fill="none" stroke="rgba(255,255,255,.28)" strokeWidth="1" strokeDasharray={n.gate ? "4 4" : undefined} />)}

        {inputs.map((n, i) => (
          <circle key={`p${n.y}`} r="3.5" fill="var(--red)">
            <animateMotion dur="2.8s" begin={`${i * 0.9}s`} repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines=".4 0 .2 1"><mpath href={`#in-${n.y}`} /></animateMotion>
          </circle>
        ))}
        {tools.map((n, i) => (
          <circle key={`q${n.y}`} r="3.5" fill={n.gate ? "#fff" : "var(--red)"}>
            <animateMotion dur="2.4s" begin={`${1.2 + i * 0.7}s`} repeatCount="indefinite" calcMode="spline" keyPoints="0;1" keyTimes="0;1" keySplines=".4 0 .2 1"><mpath href={`#out-${n.y}`} /></animateMotion>
          </circle>
        ))}

        {inputs.map((n) => (
          <g key={n.label} transform={`translate(30 ${n.y})`}>
            <rect width="160" height="48" fill="#1a1c21" stroke="rgba(255,255,255,.18)" />
            <text x="16" y="29" fill="#f3f3f1" fontSize="13" fontWeight="500">{n.label}</text>
          </g>
        ))}

        <g transform={`translate(${CX} ${CY})`}>
          <rect width={CW} height={CH} fill="#2e323a" stroke="rgba(255,255,255,.3)" />
          <rect width={CW} height="3" fill="var(--red)" />
          <text x="16" y="34" fill="#fff" fontSize="15" fontWeight="600">Orchestrator</text>
          <text x="16" y="54" fill="#a8acb5" fontSize="11.5">Plans, calls tools, checks</text>
          <text x="16" y="70" fill="#a8acb5" fontSize="11.5">guardrails before acting</text>
          <circle cx="20" cy="91" r="3.5" fill="var(--red)"><animate attributeName="opacity" values="1;.25;1" dur="1.6s" repeatCount="indefinite" /></circle>
          <text x="30" y="95" fill="#f3f3f1" fontSize="11">{states[step]}</text>
        </g>

        {tools.map((n) => (
          <g key={n.label} transform={`translate(520 ${n.y})`}>
            <rect width="170" height="48" fill={n.gate ? "transparent" : "#1a1c21"} stroke={n.gate ? "var(--red)" : "rgba(255,255,255,.18)"} strokeDasharray={n.gate ? "4 3" : undefined} />
            <text x="16" y="29" fill="#f3f3f1" fontSize="13" fontWeight="500">{n.label}</text>
          </g>
        ))}

        <text x="30" y="40" fill="#a8acb5" fontSize="11" letterSpacing=".04em">INPUTS</text>
        <text x="520" y="22" fill="#a8acb5" fontSize="11" letterSpacing=".04em">SYSTEMS AND PEOPLE</text>
      </svg>
      <figcaption className="flow-caption">
        <span>Example workflow: invoice exception handling</span>
        <span>Simulated run <b>{done.toLocaleString("en-US")}</b> tasks resolved</span>
      </figcaption>
    </figure>
  );
}
