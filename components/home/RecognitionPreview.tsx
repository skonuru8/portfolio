import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { AwardCard } from "@/components/cards/AwardCard";
import { Reveal } from "@/components/motion/Reveal";
import { getVisibleAwards } from "@/data/awards";

// Ripple from center: center card (index 1) first, then outer cards
// Delay order for 3-col grid: [0.06, 0, 0.12]
const RIPPLE_DELAYS = [0.06, 0, 0.12];

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
          {awards.map((a, i) => (
            <Reveal
              key={a.title + a.year}
              delay={RIPPLE_DELAYS[i] ?? i * 0.06}
              direction="center"
            >
              <AwardCard
                title={a.title}
                organization={a.organization}
                year={a.year}
                description={a.description}
                image={a.image}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
