import BuildHubPage from "@/components/build/BuildHubPage";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { getAllProjects } from "@/lib/content";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("seo.build");
  return { title: t("title"), description: t("description") };
}

export default async function BuildPage({ params }: Props) {
  const { locale } = await params;
  const projects = getAllProjects(locale);

  return (
    <SidebarLayout activeItem="build">
      <BuildHubPage projects={projects} locale={locale} />
    </SidebarLayout>
  );
}
