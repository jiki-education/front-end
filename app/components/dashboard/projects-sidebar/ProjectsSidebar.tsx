"use client";

import { useState, useMemo, useEffect } from "react";
import { useAuthStore } from "@/lib/auth/authStore";
import { fetchProjects, type ProjectData } from "@/lib/api/projects";
import { fetchBadges, type BadgeData } from "@/lib/api/badges";
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
  const [badges, setBadges] = useState<BadgeData[]>([]);
  const [badgesLoading, setBadgesLoading] = useState(true);

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

  // Load real projects and badges
  useEffect(() => {
    async function loadData() {
      if (!user) {
        return;
      }

      // Load projects
      try {
        setProjectsLoading(true);
        const projectResponse = await fetchProjects({ per: 100 }); // Get all projects
        setProjects(projectResponse.results);
      } catch (error) {
        console.error("Failed to load projects:", error);
      } finally {
        setProjectsLoading(false);
      }

      // Load badges
      try {
        setBadgesLoading(true);
        const badgeResponse = await fetchBadges();
        setBadges(badgeResponse.badges);
      } catch (error) {
        console.error("Failed to load badges:", error);
      } finally {
        setBadgesLoading(false);
      }
    }

    void loadData();
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
        <UserProfile
          profile={{ ...userProfile, currentStatus }}
          onStatusChange={handleStatusChange}
          realBadges={badges}
          badgesLoading={badgesLoading}
        />

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
