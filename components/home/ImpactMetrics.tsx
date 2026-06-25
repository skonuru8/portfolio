"use client";

import { useRef } from "react";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { MetricCard } from "@/components/cards/MetricCard";
import { metrics } from "@/data/metrics";
import { Reveal } from "@/components/motion/Reveal";

export function ImpactMetrics() {
  const visible = metrics.filter((m) => m.visible).sort((a, b) => a.order - b.order).slice(0, 6);
  const gridRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const grid = gridRef.current;
    const spotlight = spotlightRef.current;
    if (!grid || !spotlight) return;
    const rect = grid.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    spotlight.style.background = `radial-gradient(circle 280px at ${x}px ${y}px, rgba(56,189,248,0.07), transparent 70%)`;
    spotlight.style.opacity = "1";
  };

  const onMouseLeave = () => {
    const spotlight = spotlightRef.current;
    if (spotlight) spotlight.style.opacity = "0";
  };

  return (
    <Section id="impact" ariaLabel="Impact metrics">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <SectionHeader
          eyebrow="Proof"
          title="Impact"
          description="Numbers as evidence. Each card links to the case study behind it."
        />
        <div
          ref={gridRef}
          className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
        >
          {/* Spotlight layer */}
          <div
            ref={spotlightRef}
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              opacity: 0,
              transition: "opacity 300ms ease",
              zIndex: 0,
            }}
          />
          {visible.map((m, i) => (
            <Reveal key={m.label} delay={i * 0.05} direction="left">
              <MetricCard
                value={m.value}
                label={m.label}
                description={m.description}
                linkedTo={m.linkedTo}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
