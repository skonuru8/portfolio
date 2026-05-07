export type ContentControl = {
  visible: boolean;
  featured?: boolean;
  order: number;
  slug?: string;
};

export type ArchitectureFlowStep = {
  label: string;
  detail?: string;
};

export type CaseStudyDetail = {
  context: string;
  pressure: string;
  constraints: string[];
  decision: string;
  tradeoffs: { better: string; harder: string }[];
  architectureSummary: string;
  /** Case-specific flow; rendered instead of generic ingress/core/data/delivery. */
  architectureFlow?: ArchitectureFlowStep[];
  impact: string[];
  improveNow: string[];
  related: { kind: "system" | "project"; slug: string }[];
};
