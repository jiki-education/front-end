"use client";

import { useState, useMemo, useEffect } from "react";
import { useAuthStore } from "@/lib/auth/authStore";
import { fetchProjects, type ProjectData } from "@/lib/api/projects";
import { getMockUserProfile, type StatusOption, type UserProfile as UserProfileType } from "./lib/mockData";
import { UserProfile } from "./ui/UserProfile";
import { RecentProjects } from "./ui/RecentProjects";
import { PremiumBox } from "./ui/PremiumBox";
import styles from "./projects-sidebar.module.css";

interface ProjectsSidebarProps {
  onStatusChange?: (status: StatusOption) => void;
  onProjectClick?: (projectId: string) => void;
  onViewAllProjectsClick?: () => void;
  _onBadgeClick?: (badgeId: string) => void;
  _onViewAllBadgesClick?: () => void;
  onUpgradeClick?: () => void;
}

export function ProjectsSidebar({
  onStatusChange,
  onProjectClick,
  onViewAllProjectsClick,
  _onBadgeClick,
  _onViewAllBadgesClick,
  onUpgradeClick
}: ProjectsSidebarProps = {}) {
  const user = useAuthStore((state) => state.user);
  const mockProfile = getMockUserProfile();
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);

  // Merge real user data with mock data for now
  const userProfile = useMemo<UserProfileType>(
    () => ({
      ...mockProfile,
      name: user?.name || mockProfile.name,
      handle: user?.handle || mockProfile.handle
    }),
    [user, mockProfile]
  );

  const [currentStatus, setCurrentStatus] = useState<StatusOption>(mockProfile.currentStatus);

  // Load real projects
  useEffect(() => {
    async function loadProjects() {
      try {
        setProjectsLoading(true);
        const response = await fetchProjects({ per: 100 }); // Get all projects
        setProjects(response.results);
      } catch (error) {
        console.error("Failed to load projects:", error);
      } finally {
        setProjectsLoading(false);
      }
    }

    if (user) {
      void loadProjects();
    }
  }, [user]);

  // Filter to get recent/in-progress projects (up to 3)
  const recentProjects = useMemo(() => {
    return projects.filter((p) => p.status === "started" || p.status === "unlocked").slice(0, 3);
  }, [projects]);

  // Count unlocked projects
  const unlockedCount = useMemo(() => {
    return projects.filter((p) => p.status !== "locked").length;
  }, [projects]);
  //const globalActivity = getMockGlobalActivity();

  const handleStatusChange = (status: StatusOption) => {
    setCurrentStatus(status);
    onStatusChange?.(status);
  };

  return (
    <aside className={styles.projectsSidebar}>
      <div>
        {/* User Profile Card */}
        <UserProfile profile={{ ...userProfile, currentStatus }} onStatusChange={handleStatusChange} />

        {/* Recent Projects */}
        <RecentProjects
          projects={recentProjects}
          unlockedCount={unlockedCount}
          onProjectClick={onProjectClick}
          onViewAllClick={onViewAllProjectsClick}
          loading={projectsLoading}
        />

        {/* Premium Box */}
        <PremiumBox onUpgradeClick={onUpgradeClick} />
      </div>
    </aside>
  );
}

export default ProjectsSidebar;
