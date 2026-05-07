import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  /** Sets `id` on the `<h2>` for `aria-labelledby`. */
  id?: string;
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
};

export function SectionHeader({
  id,
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
      <h2
        id={id}
        className="font-display mt-2 text-4xl uppercase tracking-wide text-ink md:text-5xl lg:text-6xl"
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base text-ink-muted md:text-lg">{description}</p>
      ) : null}
    </header>
  );
}
