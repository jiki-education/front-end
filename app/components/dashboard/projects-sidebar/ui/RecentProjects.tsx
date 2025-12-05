import { Project } from "../lib/mockData";
import styles from "../projects-sidebar.module.css";

interface RecentProjectsProps {
  projects: Project[];
  unlockedCount: number;
  onProjectClick?: (projectId: string) => void;
  onViewAllClick?: () => void;
}

function ProjectCard({ project, onClick }: { 
  project: Project; 
  onClick?: (projectId: string) => void; 
}) {
  const getStatusText = () => {
    if (project.status === 'not-started') return 'Not started';
    return `${project.progress}% done`;
  };

  const getStatusColor = () => {
    switch (project.status) {
      case 'in-progress': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'not-started': return 'bg-gray-300';
      default: return 'bg-gray-300';
    }
  };

  return (
    <button
      onClick={() => onClick?.(project.id)}
      className={styles.statCard}
      data-status={project.status}
    >
      {/* Project Icon */}
      <div className={styles.statCardEmoji}>
        <img 
          src={project.icon} 
          alt={project.name}
        />
      </div>

      {/* Project Title */}
      <div className={styles.statCardTitle}>{project.name}</div>

      {/* Progress Text */}
      <div className={styles.statCardProgress}>{getStatusText()}</div>

      {/* Progress Bar */}
      <div className={styles.cardProgressBar}>
        <div 
          className={styles.cardProgressFill}
          style={{ width: `${project.progress}%` }}
        />
      </div>
    </button>
  );
}

export function RecentProjects({ 
  projects, 
  unlockedCount, 
  onProjectClick, 
  onViewAllClick 
}: RecentProjectsProps) {
  return (
    <div className={styles.sectionBox}>
      {/* Section Header */}
      <div className={styles.sectionTitle}>
        Recent Projects
        <span className={styles.unlockedCount}>{unlockedCount} unlocked</span>
      </div>

      {/* Project Cards Grid */}
      <div className={styles.projectCards}>
        {projects.map((project) => (
          <ProjectCard 
            key={project.id} 
            project={project} 
            onClick={onProjectClick}
          />
        ))}
      </div>

      {/* View All Button */}
      <button
        onClick={onViewAllClick}
        className={styles.viewAllBtn}
      >
        View All Projects
      </button>
    </div>
  );
}