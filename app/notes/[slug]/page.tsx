import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getVisibleNotes, getNoteBySlug } from "@/data/notes";
import { loadNoteMdx } from "@/lib/load-mdx";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getVisibleNotes().map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const note = getNoteBySlug(slug);
  if (!note) {
    return { title: "Note Not Found | Sarath Konuru" };
  }
  return {
    title: `${note.title} | Sarath Konuru`,
    description: note.summary,
  };
}

export default async function NotePage({ params }: Props) {
  const { slug } = await params;
  const note = getNoteBySlug(slug);
  if (!note) notFound();

  const mdxContent = await loadNoteMdx(slug);

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 md:px-6">
      <p className="font-mono-label text-[10px] uppercase tracking-widest text-signal">
        System notes · {note.category}
      </p>
      <h1 className="font-display mt-3 text-4xl uppercase tracking-wide text-ink md:text-5xl">
        {note.title}
      </h1>
      <p className="mt-2 text-sm text-ink-muted">{note.date}</p>
      <p className="mt-6 text-ink-muted">{note.summary}</p>
      <p className="mt-4 text-xs text-ink-muted">{note.tags.join(" · ")}</p>
      {mdxContent ? (
        <div className="mdx-content mt-10 border-t border-line pt-10">{mdxContent}</div>
      ) : null}
      <Link href="/" className="mt-10 inline-block text-signal hover:underline">
        ← Home
      </Link>
    </article>
  );
}
