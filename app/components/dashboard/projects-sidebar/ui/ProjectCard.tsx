import Link from "next/link";
import Image from "next/image";
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

  const getProjectIcon = () => {
    return `/static/images/project-icons/icon-${project.slug}.png`;
  };

  return (
    <Link href={`/projects/${project.slug}`} className={styles.statCard} data-status={project.status}>
      <div className={styles.statCardEmoji}>
        <Image
          src={getProjectIcon()}
          alt={project.title}
          width={24}
          height={24}
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/static/images/project-icons/icon-default.png";
          }}
        />
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
