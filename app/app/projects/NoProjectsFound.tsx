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
        message = "You haven't started any projects yet.";
        break;
      case "not-started":
        message = "All projects have been started!";
        break;
      case "complete":
        message = "You haven't completed any projects yet.";
        break;
      case "locked":
        message = "No locked projects.";
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
