import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { thinking, thinkingSequence } from "@/data/thinking";
import { Reveal } from "@/components/motion/Reveal";
import { ThinkingTrace } from "@/components/motion/ThinkingTrace";

export function HowIThink() {
  const cards = thinking.filter((t) => t.visible).sort((a, b) => a.order - b.order);

  return (
    <Section id="thinking" ariaLabel="How I think">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <SectionHeader
          eyebrow="Mindset"
          title="How I think"
          description="Professional, direct, and bottleneck-driven—without the generic resume adjectives."
        />

        <div className="mb-12 hidden max-w-6xl md:grid md:grid-cols-[minmax(0,140px)_1fr] md:gap-10 lg:gap-14">
          <ThinkingTrace />
          <ol className="max-w-3xl space-y-3 self-center border-l border-line pl-6">
            {thinkingSequence.map((line, i) => (
              <Reveal key={line} delay={i * 0.04}>
                <li className="flex gap-4">
                  <span className="font-mono-label text-xs text-signal">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-ink-muted">{line}</span>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>

        <ol className="mb-12 max-w-3xl space-y-3 md:hidden">
          {thinkingSequence.map((line, i) => (
            <Reveal key={line} delay={i * 0.04}>
              <li className="flex gap-4 border-l border-line pl-4">
                <span className="font-mono-label text-xs text-signal">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-ink-muted">{line}</span>
              </li>
            </Reveal>
          ))}
        </ol>

        <div className="grid gap-4 md:grid-cols-3">
          {cards.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.06}>
              <article className="card-hover h-full rounded-xl border border-line bg-panel/60 p-5">
                <h3 className="font-display text-xl uppercase tracking-wide text-ink">{c.title}</h3>
                <p className="mt-3 text-sm text-ink-muted">{c.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
