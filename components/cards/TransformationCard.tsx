"use client";

import Link from "next/link";
import { PressureDollyZoom, type DollyVariant } from "@/components/motion/PressureDollyZoom";
import { Reveal } from "@/components/motion/Reveal";
import { ConnectorArrow } from "@/components/motion/ConnectorArrow";
import { cn } from "@/lib/utils";
import { useDeviceTier } from "@/lib/device-tier";
import { TiltCard } from "@/components/motion/TiltCard";

export type TransformationCardProps = {
  title: string;
  category: string;
  before: string;
  decision: string;
  after: string;
  impact: string[];
  link: string;
  motionType?: "pressure-dolly" | "noise-collapse" | "risk-to-control" | "none";
  pressureLabel?: string;
};

const dollyLabels: Record<string, string> = {
  "pressure-dolly": "Pressure moment: seven-minute contract bottleneck compressing into a focused decision.",
  "noise-collapse": "Pressure moment: hours of manual job review collapsing into a ranked pipeline.",
  "risk-to-control": "Pressure moment: raw diff exposure risk tightening into controlled, sanitized review.",
};

export function TransformationCard({
  title,
  category,
  before,
  decision,
  after,
  impact,
  link,
  motionType = "none",
}: TransformationCardProps) {
  const tier = useDeviceTier();
  const useDolly = motionType === "pressure-dolly" || motionType === "noise-collapse" || motionType === "risk-to-control";
  const label = dollyLabels[motionType] ?? "Transformation narrative";
  const variant: DollyVariant | undefined = useDolly ? (motionType as DollyVariant) : undefined;

  const body = (
    <TiltCard>
    <article className="group card-hover rounded-2xl border border-line bg-bg-soft/90 p-6 md:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="font-display text-2xl uppercase tracking-wide text-ink md:text-3xl">
          {title}
        </h3>
        <span className="font-mono-label text-[10px] uppercase tracking-widest text-ink-muted">
          {category}
        </span>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {/* Before panel — animated noise blob on Tier A, static on Tier B/C */}
        <div
          className={cn(
            "relative overflow-hidden rounded-lg border border-line/80 bg-panel/50 p-4 transition-all duration-300",
            "group-hover:opacity-75 group-hover:[filter:blur(0.5px)]",
            motionType !== "none" && "md:opacity-95",
          )}
        >
          <div
            className={tier === "a" ? "liquid-blob-before" : "liquid-blob-static"}
            aria-hidden
          />
          <p className="relative font-mono-label text-[10px] uppercase tracking-widest text-accent">Before</p>
          <p className="relative mt-2 text-sm text-ink-muted">{before}</p>
        </div>

        {/* Decision panel — 3px --lock left border marks where the decision was made */}
        <div
          className="rounded-lg border border-signal/30 bg-signal-soft/30 p-4"
          style={{ borderLeftColor: "var(--lock)", borderLeftWidth: "3px" }}
        >
          <p className="font-mono-label text-[10px] uppercase tracking-widest text-signal">Decision</p>
          <p className="mt-2 text-sm text-ink">{decision}</p>
        </div>

        {/* After panel */}
        <div className="rounded-lg border border-line/80 bg-panel/50 p-4 transition-all duration-300 group-hover:border-signal/40 group-hover:bg-signal-soft/20">
          <p className="font-mono-label text-[10px] uppercase tracking-widest text-accent">After</p>
          <p className="mt-2 text-sm text-ink-muted">{after}</p>
        </div>
      </div>

      {/* Connector arrow — draws itself once on viewport entry; hidden on mobile */}
      <ConnectorArrow />

      <ul className="mt-6 flex flex-wrap gap-2">
        {impact.map((i) => (
          <li
            key={i}
            className="rounded-full border border-line bg-bg px-3 py-1 font-mono-label text-[10px] uppercase tracking-wider text-ink-muted"
          >
            {i}
          </li>
        ))}
      </ul>

      <Link
        href={link}
        className="focus-ring mt-6 inline-flex items-center font-mono-label text-xs uppercase tracking-widest text-signal hover:text-accent"
      >
        Full case study
      </Link>
    </article>
    </TiltCard>
  );

  return (
    <Reveal>
      {useDolly && variant ? (
        <PressureDollyZoom label={label} variant={variant}>
          {body}
        </PressureDollyZoom>
      ) : (
        body
      )}
    </Reveal>
  );
}
