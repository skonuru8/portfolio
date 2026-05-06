import { notFound } from "next/navigation";
import Link from "next/link";
import { getVisibleNotes, getNoteBySlug } from "@/data/notes";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getVisibleNotes().map((n) => ({ slug: n.slug }));
}

export default async function NotePage({ params }: Props) {
  const { slug } = await params;
  const note = getNoteBySlug(slug);
  if (!note) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6">
      <p className="font-mono-label text-[10px] uppercase tracking-widest text-signal">
        System notes · {note.category}
      </p>
      <h1 className="font-display mt-3 text-4xl uppercase tracking-wide text-ink md:text-5xl">
        {note.title}
      </h1>
      <p className="mt-2 text-sm text-ink-muted">{note.date}</p>
      <p className="mt-6 text-ink-muted">{note.summary}</p>
      <p className="mt-4 text-xs text-ink-muted/80">{note.tags.join(" · ")}</p>
      <p className="mt-10 text-sm text-ink-muted">
        Full MDX body can be wired when this note is published.
      </p>
      <Link href="/#work" className="mt-8 inline-block text-signal hover:underline">
        ← Work index
      </Link>
    </div>
  );
}
