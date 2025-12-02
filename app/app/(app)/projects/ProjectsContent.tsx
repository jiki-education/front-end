"use client";

import { fetchProjects, type ProjectData, type ProjectsResponse } from "@/lib/api/projects";
import { PageTabs } from "@/components/ui-kit/PageTabs";
import type { TabItem } from "@/components/ui-kit/PageTabs";
import { useEffect, useState } from "react";
import AllIcon from "@static/icons/all.svg";
import InProgressIcon from "@static/icons/in-progress.svg";
import CompleteIcon from "@static/icons/complete.svg";
import LockedIcon from "@static/icons/locked.svg";
import ProjectsIcon from "@static/icons/projects.svg";
import { ProjectCard } from "./ProjectCard";
import { mockProjects } from "./mockProjects";
import { NoProjectsFound } from "./NoProjectsFound";

const tabs: TabItem[] = [
  { id: "all", label: "All", icon: <AllIcon />, color: "blue" },
  { id: "in-progress", label: "In Progress", icon: <InProgressIcon />, color: "purple" },
  { id: "not-started", label: "Not Started", icon: <ProjectsIcon />, color: "blue" },
  { id: "complete", label: "Complete", icon: <CompleteIcon />, color: "green" },
  { id: "locked", label: "Locked", icon: <LockedIcon />, color: "gray" }
];

export function ProjectsContent() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectsError, setProjectsError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

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

  if (projectsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
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

  return (
    <div className="max-w-screen-xl mx-auto py-32 px-48">
      <header className="ui-page-header">
        <h1>
          <ProjectsIcon />
          Projects
        </h1>
        <p>Build real applications and games to practice your coding skills.</p>
      </header>

      <PageTabs className="mb-16" tabs={tabs} activeTabId={activeTab} onTabChange={setActiveTab} />

      {filteredProjects.length === 0 ? (
        <NoProjectsFound totalProjectsCount={projects.length} activeTabId={activeTab} />
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
          {mockProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
