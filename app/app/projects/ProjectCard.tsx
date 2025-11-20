import { type ProjectData } from "@/lib/api/projects";
import Link from "next/link";
import { ProjectIcon } from "@/components/ProjectIcon";
import "./projects.css";

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
    <div className="card" data-state={dataState} style={{ "--target-width": `${progress}%` } as React.CSSProperties}>
      <div className="status-badge">{currentStatus.text}</div>
      <div className="hero">
        <div className="project-icon">
          <ProjectIcon slug={project.slug} />
        </div>
        <div className="project-title">{project.title}</div>
        <div className="progress-bar">
          <div className="progress-fill"></div>
        </div>
      </div>
      <div className="content">
        <div className="project-title">{project.title}</div>
        <div className="description">{project.description}</div>
        {project.skills && (
          <div className="stats-row">
            <span className="skills">{project.skills}</span>
          </div>
        )}
      </div>
      {isClickable && <div className="action-link"></div>}
    </div>
  );

  if (!isClickable) {
    return cardContent;
  }

  return <Link href={`/projects/${project.slug}`}>{cardContent}</Link>;
}
