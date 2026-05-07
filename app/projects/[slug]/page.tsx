import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getVisibleProjects, getProjectBySlug } from "@/data/projects";
import { CaseStudyPage } from "@/components/case-study/CaseStudyPage";
import { loadProjectMdx } from "@/lib/load-mdx";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getVisibleProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getProjectBySlug(slug);
  if (!item) {
    return { title: "Project Not Found | Sarath Konuru" };
  }
  return {
    title: `${item.title} | Sarath Konuru`,
    description: item.summary,
  };
}

export default async function ProjectCaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const mdxContent = await loadProjectMdx(slug);

  return (
    <CaseStudyPage
      kind="project"
      title={project.title}
      meta={`${project.type} · ${project.domain} · ${project.status}`}
      summary={project.summary}
      stack={project.stack}
      detail={project.detail}
      mdxContent={mdxContent}
    />
  );
}
