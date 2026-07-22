import { notFound } from "next/navigation";
import ProjectPage from "@/components/projects/ProjectPage";
import SidebarLayout from "@/components/layout/SidebarLayout";
import JsonLd from "@/components/seo/JsonLd";
import { getAllProjects, getProject } from "@/lib/content";
import { breadcrumbSchema, courseSchema } from "@/lib/seo/schemas";
import { staticAsset } from "@/lib/static-asset";
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

  const { project, episodes } = data;

  // Structured data: a project is a free online Course made of its episodes, plus
  // a Build > <project> breadcrumb.
  const jsonLd = [
    courseSchema({
      path: `/projects/${slug}`,
      locale,
      name: project.title,
      description: project.description,
      image: project.image ? staticAsset(`images/projects/covers/${project.image}`) : undefined,
      episodes: episodes.map((episode) => ({
        name: episode.title,
        path: `/projects/${slug}/episodes/${episode.slug}`,
        description: episode.excerpt
      }))
    }),
    breadcrumbSchema(
      [
        { name: "Build", path: "/build" },
        { name: project.title, path: `/projects/${slug}` }
      ],
      locale
    )
  ];

  return (
    <SidebarLayout activeItem="build">
      <JsonLd data={jsonLd} />
      <ProjectPage project={project} episodes={episodes} locale={locale} />
    </SidebarLayout>
  );
}
