"use client";

import { useTranslations } from "next-intl";
import { ConceptsLayout } from "@/components/concepts";
import LearningComputerIcon from "@/icons/learning-computer.svg";
import type { ProjectMeta } from "@/lib/content/types";
import ProjectCard from "@/components/projects/ProjectCard";
import styles from "./BuildHubPage.module.css";
import { UpcomingStreams } from "./UpcomingStreams";

interface BuildHubPageProps {
  projects: ProjectMeta[];
  locale: string;
}

export default function BuildHubPage({ projects, locale }: BuildHubPageProps) {
  const t = useTranslations("build.hub");
  return (
    <ConceptsLayout>
      <header className={styles.header}>
        <h1 className={styles.title}>
          <LearningComputerIcon />
          {t("title")}
        </h1>
        <p className={styles.description}>{t("description")}</p>
      </header>
      <div className={styles.layout}>
        <div className={styles.main}>
          <div className={styles.projectsList}>
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} locale={locale} />
            ))}
          </div>
        </div>
        <aside className={styles.sidebar}>
          <UpcomingStreams projects={projects} />
        </aside>
      </div>
    </ConceptsLayout>
  );
}
