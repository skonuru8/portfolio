import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  className,
}: SectionHeaderProps) {
  return (
    <header className={cn("mb-10 max-w-3xl md:mb-14", className)}>
      <p className="font-mono-label text-xs uppercase tracking-[0.2em] text-signal">
        {eyebrow}
      </p>
      <h2 className="font-display mt-2 text-4xl uppercase tracking-wide text-ink md:text-5xl lg:text-6xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base text-ink-muted md:text-lg">{description}</p>
      ) : null}
    </header>
  );
}
