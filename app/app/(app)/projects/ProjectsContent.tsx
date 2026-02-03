"use client";

import { fetchProjects, type ProjectData, type ProjectsResponse } from "@/lib/api/projects";
import { PageTabs } from "@/components/ui-kit/PageTabs";
import type { TabItem } from "@/components/ui-kit/PageTabs";
import { PageHeader } from "@/components/ui-kit/PageHeader";
import { useEffect, useState } from "react";
import AllIcon from "@static/icons/all.svg";
import InProgressIcon from "@static/icons/in-progress.svg";
import CompleteIcon from "@static/icons/complete.svg";
import LockedIcon from "@static/icons/locked.svg";
import ProjectsIcon from "@static/icons/projects.svg";
import { ProjectCard } from "./ProjectCard";
import { NoProjectsFound } from "./NoProjectsFound";
import { ProjectCardsLoadingSkeleton } from "./ProjectCardSkeleton";
import { useDelayedLoading } from "@/lib/hooks/useDelayedLoading";

const tabs: TabItem[] = [
  { id: "all", label: "All", icon: <AllIcon />, color: "blue" },
  { id: "in-progress", label: "In Progress", icon: <InProgressIcon />, color: "purple" },
  { id: "not-started", label: "Not Started", icon: <ProjectsIcon />, color: "blue" },
  { id: "complete", label: "Complete", icon: <CompleteIcon />, color: "green" },
  { id: "locked", label: "Locked", icon: <LockedIcon />, color: "gray" }
];

export function ProjectsContent() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  // Deferred loading pattern:
  // - Only show skeleton if loading takes longer than 300ms
  // - If data arrives within 300ms, skip the skeleton entirely (no flash)
  // - This applies to ALL loads (initial and subsequent)
  const showSkeleton = useDelayedLoading(projectsLoading, 300);

  const getFilteredProjects = () => {
    if (activeTab === "all") {
      return projects;
    }

    const statusMap = {
      "in-progress": "started",
      "not-started": "unlocked",
      complete: "completed",
      locked: "locked"
    };

    const targetStatus = statusMap[activeTab as keyof typeof statusMap];
    return projects.filter((project) => project.status === targetStatus);
  };

  const filteredProjects = getFilteredProjects();

  useEffect(() => {
    async function loadProjects() {
      try {
        setProjectsLoading(true);
        const response: ProjectsResponse = await fetchProjects();
        setProjects(response.results);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        setProjectsError(error instanceof Error ? error.message : "Failed to load projects");
      } finally {
        setProjectsLoading(false);
      }
    }

    void loadProjects();
  }, []);

  const renderContent = () => {
    if (showSkeleton) {
      return <ProjectCardsLoadingSkeleton />;
    }

    if (projectsError) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error: {projectsError}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    if (filteredProjects.length === 0) {
      return <NoProjectsFound totalProjectsCount={projects.length} activeTabId={activeTab} />;
    }

    return (
      <div className="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-6">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    );
  };

  return (
    <PageHeader
      icon={<ProjectsIcon />}
      title="Projects"
      description="Build real applications and games to practice your coding skills."
    >
      <PageTabs className="mb-16" tabs={tabs} activeTabId={activeTab} onTabChange={setActiveTab} />
      {renderContent()}
    </PageHeader>
  );
}
