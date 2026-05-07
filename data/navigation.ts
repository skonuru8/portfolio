export const workFilters = [
  "All",
  "Enterprise Systems",
  "Independent Systems",
  "Healthcare",
  "Telecom",
  "Automotive",
  "AI Tooling",
  "Backend",
  "Cloud",
  "Security",
] as const;

export type WorkFilter = (typeof workFilters)[number];

export const commandItems = [
  { label: "View Impact", href: "/#impact", keywords: "metrics proof" },
  { label: "View Transformations", href: "/#transformations", keywords: "stories" },
  { label: "Nokia CPQ", href: "/systems/nokia-cpq", keywords: "telecom contract" },
  { label: "Job Hunter", href: "/projects/job-hunter", keywords: "ai jobs" },
  { label: "Privacy Guard", href: "/projects/privacy-guard", keywords: "vscode security" },
  { label: "Work Index", href: "/#work", keywords: "projects systems" },
  { label: "Recognition", href: "/#recognition", keywords: "awards" },
  { label: "View Resume", href: "/resume", keywords: "pdf cv page" },
  { label: "Email Sarath", href: "mailto:konurusarath@gmail.com", keywords: "contact" },
  { label: "GitHub", href: "https://github.com/skonuru8", keywords: "code" },
  { label: "LinkedIn", href: "https://linkedin.com/in/konurusarath", keywords: "profile" },
] as const;
