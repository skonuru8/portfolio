export const transformations = [
  {
    slug: "nokia-cpq",
    title: "Nokia CPQ Contract Engine",
    category: "Enterprise System",
    domain: "Telecom",
    before: "Contract processing was slow, tightly coupled, and deployment-heavy.",
    decision:
      "Split the overloaded Contract Case service at ownership boundaries and optimized high-latency API paths.",
    after: "Contract processing dropped from 7 minutes to under 1 minute.",
    impact: [
      "85% processing reduction",
      "55% API latency reduction",
      "10+ microservices touched",
    ],
    link: "/systems/nokia-cpq",
    motionType: "pressure-dolly" as const,
    visible: true,
    featured: true,
    order: 1,
  },
  {
    slug: "job-hunter",
    title: "Autonomous Job Intelligence Pipeline",
    category: "Independent System",
    domain: "AI Automation",
    before:
      "Manual job review across multiple boards consumed 3+ hours daily with inconsistent triage quality.",
    decision:
      "Turn role-fit judgment into a scoring pipeline that ranks opportunities and generates tailored application artifacts.",
    after:
      "Daily review dropped to under 30 minutes while low-fit apply-queue noise fell by over 70%.",
    impact: [
      "3+ hours to under 30 minutes",
      "70% less apply-queue noise",
      "20 min to under 2 min artifact generation",
    ],
    link: "/projects/job-hunter",
    motionType: "noise-collapse" as const,
    visible: true,
    featured: true,
    order: 2,
  },
  {
    slug: "privacy-guard",
    title: "AI Privacy Enforcement Extension",
    category: "Independent System",
    domain: "Developer Tooling / Security",
    before:
      "The tool designed to prevent leaks risked leaking raw diffs to external AI providers.",
    decision:
      "Sanitize before intelligence: run local checks first, scrub outbound payloads, then use LLM reasoning only when needed.",
    after:
      "Unnecessary LLM calls dropped by 60%, and outbound payloads were sanitized before transmission.",
    impact: [
      "60% fewer unnecessary LLM calls",
      "100% outbound payload sanitization",
      "3 regulatory frameworks covered",
    ],
    link: "/projects/privacy-guard",
    motionType: "risk-to-control" as const,
    visible: true,
    featured: true,
    order: 3,
  },
];
