import Link from "next/link";
import Image from "next/image";
import type { ProjectData } from "@/lib/api/projects";
import styles from "../projects-sidebar.module.css";

interface RecentProjectsProps {
  projects: ProjectData[];
  unlockedCount: number;
  onProjectClick?: (projectId: string) => void;
  onViewAllClick?: () => void;
  loading?: boolean;
}

function ProjectCard({ project }: { project: ProjectData }) {
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
    // Return path to project icon image
    return `/static/images/project-icons/icon-${project.slug}.png`;
  };

  return (
    <Link href={`/projects/${project.slug}`} className={styles.statCard} data-status={project.status}>
      {/* Project Icon */}
      <div className={styles.statCardEmoji}>
        <Image
          src={getProjectIcon()}
          alt={project.title}
          width={24}
          height={24}
          onError={(e) => {
            // Fallback to a default icon if project-specific icon doesn't exist
            (e.target as HTMLImageElement).src = "/static/images/project-icons/icon-default.png";
          }}
        />
      </div>

      {/* Project Title */}
      <div className={styles.statCardTitle}>{project.title}</div>

      {/* Progress Text */}
      <div className={styles.statCardProgress}>{getStatusText()}</div>

      {/* Progress Bar - simplified for now since we don't have progress % */}
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

export function RecentProjects({ projects, unlockedCount, loading }: RecentProjectsProps) {
  return (
    <div className={styles.sectionBox}>
      {/* Section Header */}
      <div className={styles.sectionTitle}>
        Recent Projects
        {unlockedCount > 0 && <span className={styles.unlockedCount}>{unlockedCount} unlocked</span>}
      </div>

      {/* Loading state */}
      {loading ? (
        <div className={styles.projectCards}>
          <div className={styles.loadingPlaceholder}>Loading projects...</div>
        </div>
      ) : projects.length > 0 ? (
        /* Project Cards Grid */
        <div className={styles.projectCards}>
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      ) : (
        /* No projects placeholder */
        <div className={styles.noProjectsPlaceholder}>
          <div className={styles.noProjectsIcon}>🚀</div>
          <div className={styles.noProjectsText}>Continue your journey to unlock projects</div>
        </div>
      )}

      {/* View All Button - only show if there are projects */}
      {projects.length > 0 && (
        <Link href="/projects" className={styles.viewAllBtn}>
          View All Projects
        </Link>
      )}
    </div>
  );
}
