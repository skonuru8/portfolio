import Link from "next/link";

type NoteCardProps = {
  title: string;
  category: string;
  date: string;
  summary: string;
  tags: string[];
  href: string;
};

export function NoteCard({ title, category, date, summary, tags, href }: NoteCardProps) {
  return (
    <Link
      href={href}
      className="focus-ring block rounded-xl border border-line bg-panel/60 p-5 outline-none transition-colors hover:border-signal/40"
    >
      <p className="font-mono-label text-[10px] uppercase tracking-widest text-signal">
        {category} · {date}
      </p>
      <h3 className="mt-2 font-display text-xl uppercase tracking-wide text-ink">{title}</h3>
      <p className="mt-2 text-sm text-ink-muted">{summary}</p>
      <p className="mt-3 text-[10px] text-ink-muted">{tags.join(" · ")}</p>
    </Link>
  );
}
