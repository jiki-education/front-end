import Link from "next/link";
import type { ProjectData } from "@/lib/api/projects";
import { ProjectCard } from "./ProjectCard";
import { EmptyProjectsState } from "./EmptyProjectsState";
import styles from "../projects-sidebar.module.css";

interface RecentProjectsProps {
  projects: ProjectData[];
  unlockedCount: number;
  onProjectClick?: (projectId: string) => void;
  onViewAllClick?: () => void;
  loading?: boolean;
}

export function RecentProjects({ projects, unlockedCount, loading }: RecentProjectsProps) {
  // If loading, show loading state in a section box
  if (loading) {
    return (
      <div className={styles.sectionBox}>
        <div className={styles.sectionTitle}>Recent Projects</div>
        <div className={styles.projectCards}>
          <div className={styles.loadingPlaceholder}>Loading projects...</div>
        </div>
      </div>
    );
  }

  // If no projects, show empty state without wrapper
  if (projects.length === 0) {
    return <EmptyProjectsState />;
  }

  // If has projects, show them in section box
  return (
    <div className={styles.sectionBox}>
      <div className={styles.sectionTitle}>
        Recent Projects
        {unlockedCount > 0 && <span className={styles.unlockedCount}>{unlockedCount} unlocked</span>}
      </div>

      <div className={styles.projectCards}>
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>

      <Link href="/projects" className={styles.viewAllBtn}>
        View All Projects
      </Link>
    </div>
  );
}
