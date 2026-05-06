import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { AwardCard } from "@/components/cards/AwardCard";
import { getVisibleAwards } from "@/data/awards";

export function RecognitionPreview() {
  const awards = getVisibleAwards();

  return (
    <Section id="recognition" ariaLabel="Recognition and awards">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <SectionHeader
          eyebrow="Recognition"
          title="Awards wall"
          description="Credible, calm proof of how teams experienced the work—not a certificate dump."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {awards.map((a) => (
            <AwardCard
              key={a.title + a.year}
              title={a.title}
              organization={a.organization}
              year={a.year}
              description={a.description}
              image={a.image}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}
