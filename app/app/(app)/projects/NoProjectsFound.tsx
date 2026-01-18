interface NoProjectsFoundProps {
  totalProjectsCount: number;
  activeTabId: string;
}

export function NoProjectsFound({ totalProjectsCount, activeTabId }: NoProjectsFoundProps) {
  let message: string;

  if (totalProjectsCount === 0) {
    message = "No projects available yet.";
  } else {
    switch (activeTabId) {
      case "all":
        message = "No projects available.";
        break;
      case "in-progress":
        message = "No projects in progress. Start a project to see it here!";
        break;
      case "not-started":
        message = "No projects waiting to be started. Great job keeping up!";
        break;
      case "complete":
        message = "No completed projects yet. Keep working to finish your first project!";
        break;
      case "locked":
        message = "All projects are unlocked! You have access to everything.";
        break;
      default:
        message = "No projects found.";
    }
  }

  return (
    <div className="text-center py-12">
      <p className="text-gray-500 text-lg">{message}</p>
    </div>
  );
}
