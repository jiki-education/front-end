"use client";

import { useState } from "react";
import { UserProfile } from "@/components/dashboard/projects-sidebar/ui/UserProfile";
import { UserProfileSkeleton } from "@/components/dashboard/projects-sidebar/ui/UserProfileSkeleton";
import { RecentProjects } from "@/components/dashboard/projects-sidebar/ui/RecentProjects";
import { RecentProjectsSkeleton } from "@/components/dashboard/projects-sidebar/ui/RecentProjectsSkeleton";
import { EmptyProjectsState } from "@/components/dashboard/projects-sidebar/ui/EmptyProjectsState";
import { ProjectsUpsellCard } from "@/components/dashboard/projects-sidebar/ui/ProjectsUpsellCard";
import { PremiumBox } from "@/components/dashboard/projects-sidebar/ui/PremiumBox";
import type { UserProfileData } from "@/components/dashboard/projects-sidebar/ui/UserProfile";
import type { BadgeData } from "@/lib/api/badges";
import type { ProjectData } from "@/lib/api/projects";
import styles from "@/components/dashboard/projects-sidebar/projects-sidebar.module.css";

type StateId =
  | "loading"
  | "free-user"
  | "premium-empty"
  | "premium-1-project"
  | "premium-2-projects"
  | "premium-with-projects";

const states: { id: StateId; label: string }[] = [
  { id: "loading", label: "Loading (Skeleton)" },
  { id: "free-user", label: "Free User" },
  { id: "premium-empty", label: "Premium — No Projects" },
  { id: "premium-1-project", label: "Premium — 1 Project" },
  { id: "premium-2-projects", label: "Premium — 2 Projects" },
  { id: "premium-with-projects", label: "Premium — 3 Projects" }
];

const mockProfile: UserProfileData = {
  name: "Jane Coder",
  handle: "janecoder",
  avatarUrl: "https://avatars.githubusercontent.com/u/1?v=4",
  icon: "default",
  streaksEnabled: true,
  currentStreak: 7
};

const mockBadges: BadgeData[] = [
  {
    id: 1,
    name: "First Steps",
    slug: "first-steps",
    description: "Completed first exercise",
    fun_fact: "",
    state: "revealed",
    num_awardees: 1000,
    unlocked_at: "2024-01-01"
  },
  {
    id: 2,
    name: "Streak Starter",
    slug: "streak-starter",
    description: "3-day streak",
    fun_fact: "",
    state: "revealed",
    num_awardees: 500,
    unlocked_at: "2024-01-05"
  },
  {
    id: 3,
    name: "Curious Mind",
    slug: "curious-mind",
    description: "Explored 5 concepts",
    fun_fact: "",
    state: "unrevealed",
    num_awardees: 300
  }
];

const mockProjects1: ProjectData[] = [
  { slug: "snake", title: "Snake", description: "Build the classic Snake game", status: "started" },
  { slug: "calculator", title: "Calculator", description: "Build a calculator app", status: "locked" },
  { slug: "todo-list", title: "Todo List", description: "Build a todo list app", status: "locked" }
];

const mockProjects2: ProjectData[] = [
  { slug: "snake", title: "Snake", description: "Build the classic Snake game", status: "started" },
  { slug: "calculator", title: "Calculator", description: "Build a calculator app", status: "unlocked" },
  { slug: "todo-list", title: "Todo List", description: "Build a todo list app", status: "locked" }
];

const mockProjects3: ProjectData[] = [
  { slug: "snake", title: "Snake", description: "Build the classic Snake game", status: "started" },
  { slug: "calculator", title: "Calculator", description: "Build a calculator app", status: "unlocked" },
  { slug: "todo-list", title: "Todo List", description: "Build a todo list app", status: "started" }
];

export default function ProjectsSidebarDevPage() {
  const [selectedState, setSelectedState] = useState<StateId>("premium-1-project");

  const renderSidebarContent = () => {
    switch (selectedState) {
      case "loading":
        return (
          <>
            <UserProfileSkeleton />
            <RecentProjectsSkeleton />
          </>
        );

      case "free-user":
        return (
          <>
            <UserProfile profile={mockProfile} badges={mockBadges} loading={false} />
            <ProjectsUpsellCard onUpgradeClick={() => console.debug("Upgrade clicked")} />
            <PremiumBox onUpgradeClick={() => console.debug("Upgrade clicked")} />
          </>
        );

      case "premium-empty":
        return (
          <>
            <UserProfile profile={mockProfile} badges={mockBadges} loading={false} />
            <EmptyProjectsState />
          </>
        );

      case "premium-1-project":
        return (
          <>
            <UserProfile profile={mockProfile} badges={mockBadges} loading={false} />
            <RecentProjects
              projects={mockProjects1}
              unlockedCount={1}
              onProjectClick={(id) => console.debug("Project clicked:", id)}
              onViewAllClick={() => console.debug("View all clicked")}
              loading={false}
            />
          </>
        );

      case "premium-2-projects":
        return (
          <>
            <UserProfile profile={mockProfile} badges={mockBadges} loading={false} />
            <RecentProjects
              projects={mockProjects2}
              unlockedCount={2}
              onProjectClick={(id) => console.debug("Project clicked:", id)}
              onViewAllClick={() => console.debug("View all clicked")}
              loading={false}
            />
          </>
        );

      case "premium-with-projects":
        return (
          <>
            <UserProfile profile={mockProfile} badges={mockBadges} loading={false} />
            <RecentProjects
              projects={mockProjects3}
              unlockedCount={5}
              onProjectClick={(id) => console.debug("Project clicked:", id)}
              onViewAllClick={() => console.debug("View all clicked")}
              loading={false}
            />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-4 bg-white border-b border-gray-200">
        <h1 className="text-xl font-bold mb-4">Projects Sidebar States</h1>
        <div className="flex flex-wrap gap-2">
          {states.map((state) => (
            <button
              key={state.id}
              onClick={() => setSelectedState(state.id)}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                selectedState === state.id ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {state.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-8 flex justify-center">
        <div className="bg-gray-50" style={{ width: 480 }}>
          <aside className={styles.projectsSidebar} style={{ width: "100%", height: "auto", position: "static" }}>
            <div>{renderSidebarContent()}</div>
          </aside>
        </div>
      </div>
    </div>
  );
}
