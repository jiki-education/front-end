import { notFound } from "next/navigation";
import ProjectPage from "@/components/projects/ProjectPage";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { getAllProjects, getProject } from "@/lib/content";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getAllProjects(locale).find((p) => p.slug === slug);
  if (!project) {
    return {};
  }
  return {
    title: `${project.title} - Jiki`,
    description: project.description
  };
}

export default async function LocaleProjectPage({ params }: Props) {
  const { locale, slug } = await params;

  let data;
  try {
    data = await getProject(slug, locale);
  } catch {
    notFound();
  }

  // Coming-soon projects (no episodes) have no detail page yet.
  if (data.episodes.length === 0) {
    notFound();
  }

  const otherProjects = getAllProjects(locale).filter((p) => p.slug !== slug);

  return (
    <SidebarLayout activeItem="build">
      <ProjectPage project={data.project} episodes={data.episodes} otherProjects={otherProjects} locale={locale} />
    </SidebarLayout>
  );
}
