import Link from "next/link";
import { ProjectIcon } from "@/components/icons/ProjectIcon";
import type { ProjectData } from "@/lib/api/projects";
import styles from "../projects-sidebar.module.css";

interface ProjectCardProps {
  project: ProjectData;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const getStatusText = () => {
    switch (project.status) {
      case "locked":
        return "Locked";
      case "unlocked":
        return "Not started";
      case "started":
        return "In progress";
      case "completed":
        return "Completed";
      case undefined:
      default:
        return "Available";
    }
  };

  return (
    <Link href={`/projects/${project.slug}`} className={styles.statCard} data-status={project.status}>
      <div className={styles.statCardEmoji}>
        <ProjectIcon slug={project.slug} width={24} height={24} />
      </div>

      <div className={styles.statCardTitle}>{project.title}</div>

      <div className={styles.statCardProgress}>{getStatusText()}</div>

      <div className={styles.cardProgressBar}>
        <div
          className={styles.cardProgressFill}
          style={{
            width: project.status === "completed" ? "100%" : project.status === "started" ? "50%" : "0%"
          }}
        />
      </div>
    </Link>
  );
}
