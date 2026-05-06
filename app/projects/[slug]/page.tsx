import { notFound } from "next/navigation";
import { getVisibleProjects, getProjectBySlug } from "@/data/projects";
import { CaseStudyPage } from "@/components/case-study/CaseStudyPage";
import { loadProjectMdx } from "@/lib/load-mdx";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getVisibleProjects().map((p) => ({ slug: p.slug }));
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
