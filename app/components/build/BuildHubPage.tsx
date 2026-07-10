"use client";

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
  return (
    <ConceptsLayout>
      <header className={styles.header}>
        <h1 className={styles.title}>
          <LearningComputerIcon />
          Learn to Build
        </h1>
        <p className={styles.description}>Join Jeremy as he builds real projects from scratch, episode by episode.</p>
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
