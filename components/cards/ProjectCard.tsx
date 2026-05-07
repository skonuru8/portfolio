import Link from "next/link";
import { cn } from "@/lib/utils";

type ProjectCardProps = {
  title: string;
  type: string;
  domain: string;
  summary: string;
  impact: string[];
  stack: string[];
  link?: string;
  tags: string[];
  status?: string;
};

export function ProjectCard({
  title,
  type,
  domain,
  summary,
  impact,
  stack,
  link,
  tags,
  status,
}: ProjectCardProps) {
  const inner = (
    <>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display text-xl uppercase tracking-wide text-ink">{title}</h3>
        {status ? (
          <span className="font-mono-label text-[10px] uppercase text-signal">{status}</span>
        ) : null}
      </div>
      <p className="mt-1 font-mono-label text-[10px] uppercase tracking-wider text-ink-muted">
        {type} · {domain}
      </p>
      <p className="mt-3 text-sm text-ink-muted">{summary}</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {impact.slice(0, 3).map((i) => (
          <li
            key={i}
            className="rounded border border-line bg-bg px-2 py-0.5 font-mono-label text-[9px] uppercase tracking-wider text-ink-muted"
          >
            {i}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-ink-muted">{stack.slice(0, 6).join(" · ")}</p>
      <p className="mt-2 text-[10px] text-ink-muted">{tags.join(" · ")}</p>
    </>
  );

  const shell =
    "card-hover block h-full rounded-xl border border-line bg-panel/70 p-5 hover:border-signal/35";

  if (link) {
    return (
      <Link href={link} className={cn(shell, "focus-ring outline-none")}>
        {inner}
      </Link>
    );
  }

  return <div className={shell}>{inner}</div>;
}
