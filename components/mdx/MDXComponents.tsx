import type { MDXComponents as MDXComponentsType } from "mdx/types";
import { SimpleFlowDiagram } from "@/components/diagrams/SimpleFlowDiagram";
import { BeforeAfterDiagram } from "@/components/diagrams/BeforeAfterDiagram";
import { DecisionPath } from "@/components/diagrams/DecisionPath";

export const mdxComponents: MDXComponentsType = {
  SimpleFlowDiagram,
  BeforeAfterDiagram,
  DecisionPath,
  h2: (props) => (
    <h2 className="font-display mt-10 text-3xl uppercase tracking-wide text-ink" {...props} />
  ),
  p: (props) => <p className="mt-3 text-ink-muted leading-relaxed" {...props} />,
  ul: (props) => <ul className="mt-3 list-disc space-y-2 pl-5 text-ink-muted" {...props} />,
  strong: (props) => <strong className="text-ink" {...props} />,
};
