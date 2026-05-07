import Link from "next/link";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { BeforeAfterDiagram } from "@/components/diagrams/BeforeAfterDiagram";
import { SimpleFlowDiagram } from "@/components/diagrams/SimpleFlowDiagram";
import { profile } from "@/data/profile";
import type { ArchitectureFlowStep, CaseStudyDetail } from "@/types/content";
import type { ReactNode } from "react";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { isResumePdfAvailable } from "@/lib/resume";

const FALLBACK_FLOW: ArchitectureFlowStep[] = [
  { label: "Ingress", detail: "Events & requests" },
  { label: "Core services", detail: "Domain logic" },
  { label: "Data", detail: "Durable state" },
  { label: "Delivery", detail: "CI/CD & observability" },
];

type CaseStudyPageProps = {
  kind: "system" | "project";
  title: string;
  meta: string;
  summary: string;
  stack: string[];
  detail: CaseStudyDetail;
  mdxContent: ReactNode | null;
};

export function CaseStudyPage({
  kind,
  title,
  meta,
  summary,
  stack,
  detail,
  mdxContent,
}: CaseStudyPageProps) {
  const pdfReady = isResumePdfAvailable();
  const flowSteps = detail.architectureFlow ?? FALLBACK_FLOW;

  return (
    <article className="relative">
      <header className="border-b border-line bg-bg-soft/50 py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <p className="font-mono-label text-[10px] uppercase tracking-[0.25em] text-signal">
            Case study · {kind === "system" ? "Enterprise system" : "Independent system"}
          </p>
          <h1 className="font-display mt-3 max-w-4xl text-5xl uppercase tracking-wide text-ink md:text-6xl">
            {title}
          </h1>
          <p className="mt-4 font-mono-label text-xs uppercase tracking-wider text-ink-muted">
            {meta}
          </p>
          <p className="mt-6 max-w-3xl text-lg text-ink-muted">{summary}</p>
          <p className="mt-6 text-xs text-ink-muted">{stack.join(" · ")}</p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-16 px-4 py-16 md:px-6">
        <section aria-labelledby="case-context-heading">
          <SectionHeader id="case-context-heading" eyebrow="01" title="Context" />
          <p className="max-w-3xl text-ink-muted">{detail.context}</p>
        </section>

        <section aria-labelledby="case-pressure-heading">
          <SectionHeader id="case-pressure-heading" eyebrow="02" title="Pressure / problem" />
          <p className="max-w-3xl text-ink-muted">{detail.pressure}</p>
        </section>

        <section aria-labelledby="case-constraints-heading">
          <SectionHeader id="case-constraints-heading" eyebrow="03" title="Constraints" />
          <ul className="max-w-3xl list-disc space-y-2 pl-5 text-ink-muted">
            {detail.constraints.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="case-decision-heading">
          <SectionHeader id="case-decision-heading" eyebrow="04" title="Decision" />
          <p className="max-w-3xl text-ink-muted">{detail.decision}</p>
        </section>

        <section aria-labelledby="case-tradeoffs-heading">
          <SectionHeader id="case-tradeoffs-heading" eyebrow="05" title="Tradeoffs" />
          <ul className="max-w-3xl space-y-4">
            {detail.tradeoffs.map((t, i) => (
              <li
                key={i}
                className="rounded-xl border border-line bg-panel/50 p-4 text-sm text-ink-muted"
              >
                <p>
                  <span className="font-mono-label text-signal">Better: </span>
                  {t.better}
                </p>
                <p className="mt-2">
                  <span className="font-mono-label text-accent">Harder: </span>
                  {t.harder}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="case-arch-heading">
          <SectionHeader id="case-arch-heading" eyebrow="06" title="Architecture / flow" />
          <p className="max-w-3xl text-ink-muted">{detail.architectureSummary}</p>
          <div className="mt-8">
            <SimpleFlowDiagram steps={flowSteps} />
          </div>
        </section>

        <section aria-labelledby="case-impact-heading">
          <SectionHeader id="case-impact-heading" eyebrow="07" title="Impact" />
          <BeforeAfterDiagram
            beforeLabel="What was breaking"
            afterLabel="Measured outcomes"
            beforeItems={[detail.pressure]}
            afterItems={detail.impact}
          />
        </section>

        <section aria-labelledby="case-improve-heading">
          <SectionHeader id="case-improve-heading" eyebrow="08" title="What I would improve now" />
          <ul className="max-w-3xl list-disc space-y-2 pl-5 text-ink-muted">
            {detail.improveNow.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </section>

        {mdxContent ? (
          <section aria-label="Extended narrative" className="mdx-content border-t border-line pt-12">
            {mdxContent}
          </section>
        ) : null}

        <section aria-labelledby="case-related-heading">
          <SectionHeader id="case-related-heading" eyebrow="09" title="Related work" />
          <ul className="flex flex-wrap gap-3">
            {detail.related.map((r) => (
              <li key={`${r.kind}-${r.slug}`}>
                <Link
                  href={`/${r.kind === "system" ? "systems" : "projects"}/${r.slug}`}
                  className="focus-ring card-hover rounded-full border border-line bg-panel px-4 py-2 font-mono-label text-[10px] uppercase tracking-wider text-signal hover:border-signal/60"
                >
                  {r.slug.replace(/-/g, " ")}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section
          className="rounded-2xl border border-line bg-panel/60 p-8"
          aria-labelledby="case-cta-heading"
        >
          <h2 id="case-cta-heading" className="font-display text-2xl uppercase tracking-wide text-ink">
            Continue the conversation
          </h2>
          <p className="mt-3 text-ink-muted">
            Ready for backend, full-stack, and cloud engineering roles where production ownership
            matters.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`mailto:${profile.email}`}
              className="focus-ring inline-flex rounded border border-signal bg-signal-soft px-4 py-2 font-mono-label text-xs uppercase tracking-wider text-ink"
            >
              Email
            </Link>
            <ExternalLink
              href={profile.linkedin}
              className="focus-ring inline-flex rounded border border-line px-4 py-2 font-mono-label text-xs uppercase tracking-wider text-ink-muted hover:text-ink"
            >
              LinkedIn
            </ExternalLink>
            <Link
              href="/resume"
              className="focus-ring inline-flex rounded border border-line px-4 py-2 font-mono-label text-xs uppercase tracking-wider text-ink-muted hover:text-ink"
            >
              View resume
            </Link>
            {pdfReady ? (
              <a
                href={profile.resumeUrl}
                className="focus-ring inline-flex rounded border border-accent/40 bg-accent-soft px-4 py-2 font-mono-label text-xs uppercase tracking-wider text-ink"
              >
                Download resume
              </a>
            ) : null}
          </div>
        </section>
      </div>
    </article>
  );
}
