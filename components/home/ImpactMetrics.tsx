import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { MetricCard } from "@/components/cards/MetricCard";
import { metrics } from "@/data/metrics";
import { Reveal } from "@/components/motion/Reveal";

export function ImpactMetrics() {
  const visible = metrics.filter((m) => m.visible).sort((a, b) => a.order - b.order).slice(0, 6);

  return (
    <Section id="impact" ariaLabel="Impact metrics">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <SectionHeader
          eyebrow="Proof"
          title="Impact"
          description="Numbers as evidence. Each card links to the case study behind it."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((m, i) => (
            <Reveal key={m.label} delay={i * 0.05}>
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
