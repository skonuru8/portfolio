import { notFound } from "next/navigation";
import { getVisibleSystems, getSystemBySlug } from "@/data/systems";
import { CaseStudyPage } from "@/components/case-study/CaseStudyPage";
import { loadSystemMdx } from "@/lib/load-mdx";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getVisibleSystems().map((s) => ({ slug: s.slug }));
}

export default async function SystemCaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const system = getSystemBySlug(slug);
  if (!system) notFound();

  const mdxContent = await loadSystemMdx(slug);

  return (
    <CaseStudyPage
      kind="system"
      title={system.title}
      meta={`${system.company} · ${system.timeframe} · ${system.role}`}
      summary={system.summary}
      stack={system.stack}
      detail={system.detail}
      mdxContent={mdxContent}
    />
  );
}
