import InProgressIcon from "@/icons/in-progress.svg";
import NotStartedIcon from "@/icons/not-started.svg";
import CompleteIcon from "@/icons/complete.svg";
import { ProjectsEmptyState } from "./ProjectsEmptyState";

interface NoProjectsFoundProps {
  totalProjectsCount: number;
  activeTabId: string;
}

export function NoProjectsFound({ totalProjectsCount, activeTabId }: NoProjectsFoundProps) {
  if (totalProjectsCount === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No projects available yet.</p>
      </div>
    );
  }

  switch (activeTabId) {
    case "in-progress":
      return (
        <ProjectsEmptyState
          variant="purple"
          icon={<InProgressIcon />}
          title="No projects in progress"
          description={
            'You haven\'t started any projects yet. Browse available projects and click "Get started" to begin your first project.'
          }
        />
      );
    case "not-started":
      return (
        <ProjectsEmptyState
          variant="blue"
          icon={<NotStartedIcon />}
          title="All projects have been started"
          description="Great progress! You've started working on all available projects. Keep going to complete them."
        />
      );
    case "complete":
      return (
        <ProjectsEmptyState
          variant="green"
          icon={<CompleteIcon />}
          title="No completed projects yet"
          description="Complete your first project to see it here. Keep working on your in-progress projects to reach this milestone."
        />
      );
    default:
      return (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No projects found.</p>
        </div>
      );
  }
}
