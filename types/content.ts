export type ContentControl = {
  visible: boolean;
  featured?: boolean;
  order: number;
  slug?: string;
};

export type CaseStudyDetail = {
  context: string;
  pressure: string;
  constraints: string[];
  decision: string;
  tradeoffs: { better: string; harder: string }[];
  architectureSummary: string;
  impact: string[];
  improveNow: string[];
  related: { kind: "system" | "project"; slug: string }[];
};
