import Link from "next/link";
import { getSystemBySlug } from "@/data/systems";

type ExperienceCardProps = {
  company: string;
  role: string;
  location: string;
  start: string;
  end: string;
  summary: string;
  stack: string[];
  linkedSystems?: string[];
};

export function ExperienceCard({
  company,
  role,
  location,
  start,
  end,
  summary,
  stack,
  linkedSystems,
}: ExperienceCardProps) {
  return (
    <article className="relative border-l-2 border-accent/40 pl-6">
      <div className="absolute -left-[5px] top-1 h-2 w-2 rounded-full bg-accent" aria-hidden />
      <h3 className="font-display text-xl uppercase tracking-wide text-ink">{company}</h3>
      <p className="font-mono-label text-[10px] uppercase tracking-wider text-signal">
        {role}
      </p>
      <p className="mt-1 text-xs text-ink-muted">
        {location} · {start} – {end}
      </p>
      <p className="mt-3 text-sm text-ink-muted">{summary}</p>
      <p className="mt-3 text-xs text-ink-muted">{stack.join(" · ")}</p>
      {linkedSystems?.length ? (
        <ul className="mt-3 flex flex-wrap gap-2">
          {linkedSystems.map((slug) => {
            const system = getSystemBySlug(slug);
            return (
              <li key={slug}>
                <Link
                  href={`/systems/${slug}`}
                  className="focus-ring font-mono-label text-[10px] uppercase tracking-wider text-signal hover:text-accent"
                >
                  {system?.title ?? slug}
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}
    </article>
  );
}
