import { type ProjectData } from "@/lib/api/projects";
import Link from "next/link";
import { ProjectIcon } from "@/components/ProjectIcon";
import styles from "./ProjectCard.module.css";

interface ProjectCardProps {
  project: ProjectData & {
    progress?: number; // 0-100 percentage
    iconUrl?: string;
    skills?: string;
  };
}
export function ProjectCard({ project }: ProjectCardProps) {
  const isClickable = project.status !== "locked";
  const progress = project.progress ?? 0;

  // Map status to display text to match HTML examples
  const statusConfig = {
    locked: { text: "Locked" },
    unlocked: { text: "Not started" },
    started: { text: "In Progress" },
    completed: { text: "Completed" }
  };

  // Map status to CSS data-state values
  const dataStateMap = {
    locked: "locked",
    unlocked: undefined, // No data-state for unlocked (default styling)
    started: "in-progress",
    completed: "complete"
  };

  const currentStatus = project.status ? statusConfig[project.status] : statusConfig.unlocked;
  const dataState = project.status ? dataStateMap[project.status] : undefined;

  const cardContent = (
    <div
      className={styles.card}
      data-state={dataState}
      style={{ "--target-width": `${progress}%` } as React.CSSProperties}
    >
      <div className={styles.statusBadge}>{currentStatus.text}</div>
      <div className={styles.hero}>
        <div className={styles.projectIcon}>
          <ProjectIcon slug={project.slug} />
        </div>
        <div className={styles.projectTitle}>{project.title}</div>
        <div className={styles.progressBar}>
          <div className={styles.progressFill}></div>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.projectTitle}>{project.title}</div>
        <div className={styles.description}>{project.description}</div>
        {project.skills && (
          <div className={styles.statsRow}>
            <span className={styles.skills}>{project.skills}</span>
          </div>
        )}
      </div>
      {isClickable && <div className={styles.actionLink}></div>}
    </div>
  );

  if (!isClickable) {
    return cardContent;
  }

  return <Link href={`/projects/${project.slug}`}>{cardContent}</Link>;
}
