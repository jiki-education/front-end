import Link from "next/link";
import type { ProjectStatus } from "@/lib/api/projects";
import { ProjectIcon } from "@/components/icons/ProjectIcon";
import styles from "./RelatedExercises.module.css";
import type { ProjectInfo } from "@/types/concepts";

interface RelatedProjectsProps {
  projects: ProjectInfo[];
  getStatus: (slug: string) => ProjectStatus | "locked";
}

export function RelatedProjects({ projects, getStatus }: RelatedProjectsProps) {
  if (projects.length === 0) {
    return null;
  }

  return (
    <div className={styles.card}>
      <h3 className={styles.header}>Related Projects</h3>
      <p className={styles.description}>These projects let you put this concept into practice on a bigger build.</p>
      <div className={styles.list}>
        {projects.map((p) => (
          <ProjectItem key={p.slug} project={p} status={getStatus(p.slug)} />
        ))}
      </div>
    </div>
  );
}

function ProjectItem({ project, status }: { project: ProjectInfo; status: ProjectStatus | "locked" }) {
  const stateClass = statusToClass(status);
  const className = `${styles.item} ${stateClass}`;

  if (status === "locked") {
    return (
      <span className={className} title="This project is locked">
        <ProjectIcon slug={project.slug} width={48} height={48} />
        <span className={styles.itemName}>{project.title}</span>
      </span>
    );
  }

  return (
    <Link href={`/projects/${project.slug}`} className={className}>
      <ProjectIcon slug={project.slug} width={48} height={48} />
      <span className={styles.itemName}>{project.title}</span>
    </Link>
  );
}

function statusToClass(status: ProjectStatus | "locked"): string {
  switch (status) {
    case "completed":
      return styles.completed;
    case "started":
      return styles.inProgress;
    case "unlocked":
      return styles.available;
    case "locked":
      return styles.locked;
    default:
      status satisfies never;
      return styles.available;
  }
}
