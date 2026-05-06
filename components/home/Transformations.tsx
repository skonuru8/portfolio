import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { TransformationCard } from "@/components/cards/TransformationCard";
import { transformations } from "@/data/transformations";

export function Transformations() {
  const items = transformations
    .filter((t) => t.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <Section id="transformations" ariaLabel="Transformation stories" className="bg-bg-soft/40">
      <div className="mx-auto max-w-6xl space-y-12 px-4 md:px-6">
        <SectionHeader
          eyebrow="Main narrative"
          title="Transformations"
          description="Before, decision, and after—how constraints turned into measurable outcomes."
        />
        <div className="flex flex-col gap-12">
          {items.map((t) => (
            <TransformationCard
              key={t.slug}
              title={t.title}
              category={t.category}
              before={t.before}
              decision={t.decision}
              after={t.after}
              impact={t.impact}
              link={t.link}
              motionType={t.motionType}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}
