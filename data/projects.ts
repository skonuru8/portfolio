import type { CaseStudyDetail } from "@/types/content";

export type ProjectEntry = {
  slug: string;
  title: string;
  type: string;
  domain: string;
  status: string;
  summary: string;
  problem: string;
  decision: string;
  impact: string[];
  stack: string[];
  githubUrl: string;
  demoUrl: string;
  screenshots: string[];
  tags: string[];
  visible: boolean;
  featured?: boolean;
  order: number;
  detail: CaseStudyDetail;
};

export const projects: ProjectEntry[] = [
  {
    slug: "job-hunter",
    title: "Autonomous Job Intelligence Pipeline",
    type: "Independent System",
    domain: "AI Automation",
    status: "Active",
    summary:
      "Built a pipeline that discovers jobs, scores role fit, generates tailored resumes and cover letters, and routes applications through a React review UI.",
    problem:
      "Manual job discovery and resume tailoring consumed hours every day with inconsistent triage quality.",
    decision:
      "Designed a multi-signal semantic scoring pipeline and dual-artifact generation engine calibrated against extracted job requirements.",
    impact: [
      "Reduced daily review time from 3+ hours to under 30 minutes",
      "Reduced apply-queue noise by over 70%",
      "Cut resume and cover-letter generation from 20 minutes to under 2 minutes",
    ],
    stack: ["TypeScript", "Node.js", "Python", "PostgreSQL", "Redis", "React"],
    githubUrl: "",
    demoUrl: "",
    screenshots: [],
    tags: ["AI Automation", "Full-Stack", "Productivity", "React", "Independent Systems", "AI Tooling"],
    visible: true,
    featured: true,
    order: 1,
    detail: {
      context:
        "Job search is a repeated decision pipeline: discover, compare, tailor, apply. Manual triage does not scale when boards diverge and roles are noisy.",
      pressure:
        "Three or more hours daily went to reading low-signal postings. Tailored artifacts took twenty-plus minutes each.",
      constraints: [
        "Need human review before anything sends",
        "Semantic matching must be explainable enough to trust",
        "Cost control on model usage",
      ],
      decision:
        "Multi-signal scoring (structure + semantic fit), Redis-backed queues for review, React surface for approvals, generation only after acceptance.",
      tradeoffs: [
        {
          better: "Dramatically less time in the apply queue; higher precision on what reaches submission.",
          harder: "Scoring models need periodic calibration as job formats shift.",
        },
      ],
      architectureSummary:
        "Node ingestion workers, Python scoring services, PostgreSQL for artifacts, Redis for ephemeral ranking state, React operator UI.",
      impact: [
        "3+ hours to <30 minutes daily review",
        ">70% reduction in low-fit noise",
        "Artifact generation 20m → <2m",
      ],
      improveNow: [
        "Explicit evaluation harness for scoring drift",
        "Stronger explainability cards in the review UI",
      ],
      related: [{ kind: "project", slug: "privacy-guard" }],
    },
  },
  {
    slug: "privacy-guard",
    title: "AI Privacy Enforcement Extension",
    type: "Independent System",
    domain: "Developer Tooling / Security",
    status: "Active",
    summary:
      "Built a VS Code extension that scans staged diffs before commits to catch credentials, PII, and privacy violations.",
    problem:
      "Credential leaks and PII exposure could slip through code review, while sending raw diffs to external AI providers created a separate privacy risk.",
    decision:
      "Combined local static analysis, outbound sanitization, and selective LLM reasoning through hot-swappable AI providers.",
    impact: [
      "Reduced unnecessary LLM API calls by 60%",
      "Sanitized 100% of outbound payloads before transmission",
      "Extended enforcement across source code and npm dependency risk profiles",
    ],
    stack: ["TypeScript", "Node.js", "VS Code Extension API", "Anthropic", "OpenAI"],
    githubUrl: "",
    demoUrl: "",
    screenshots: [],
    tags: ["Security", "AI Tooling", "Developer Tools", "VS Code", "Independent Systems"],
    visible: true,
    featured: true,
    order: 2,
    detail: {
      context:
        "Developers need fast feedback before secrets or PII ship. AI-assisted review must not become a new exfiltration path.",
      pressure:
        "Raw diffs to cloud models amplify risk. Over-calling models is slow and expensive.",
      constraints: [
        "Local-first for sensitive detection",
        "Must work in the pre-commit window",
        "Provider flexibility without rewriting rules",
      ],
      decision:
        "Local static passes first, aggressive redaction on outbound payloads, LLM invoked only when heuristics are inconclusive.",
      tradeoffs: [
        {
          better: "Lower leak risk and fewer tokens spent.",
          harder: "Tuning false positives without training users to ignore the tool.",
        },
      ],
      architectureSummary:
        "VS Code extension host, Node analysis workers, provider adapters with shared sanitization layer.",
      impact: ["60% fewer LLM calls", "100% outbound sanitization", "Coverage across code and dependency surfaces"],
      improveNow: [
        "Team policies for custom secret patterns",
        "Inline fix suggestions with safe previews",
      ],
      related: [{ kind: "project", slug: "job-hunter" }],
    },
  },
];

export function getVisibleProjects() {
  return projects.filter((p) => p.visible).sort((a, b) => a.order - b.order);
}

export function getProjectBySlug(slug: string) {
  return projects.find((p) => p.slug === slug && p.visible);
}
