import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getVisibleSystems, getSystemBySlug } from "@/data/systems";
import { CaseStudyPage } from "@/components/case-study/CaseStudyPage";
import { loadSystemMdx } from "@/lib/load-mdx";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getVisibleSystems().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getSystemBySlug(slug);
  if (!item) {
    return { title: "Case Study Not Found | Sarath Konuru" };
  }
  return {
    title: `${item.title} | Sarath Konuru`,
    description: item.summary,
  };
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
