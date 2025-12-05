"use client";

import {
  getMockUserProfile,
  getMockProjects,
  getMockBadges,
  getMockGlobalActivity,
  type StatusOption
} from "./lib/mockData";
import { UserProfile } from "./ui/UserProfile";
import { RecentProjects } from "./ui/RecentProjects";
import { PremiumBox } from "./ui/PremiumBox";
import { GlobalActivity } from "./ui/GlobalActivity";
import styles from "./projects-sidebar.module.css";

interface ProjectsSidebarProps {
  onStatusChange?: (status: StatusOption) => void;
  onProjectClick?: (projectId: string) => void;
  onViewAllProjectsClick?: () => void;
  onBadgeClick?: (badgeId: string) => void;
  onViewAllBadgesClick?: () => void;
  onUpgradeClick?: () => void;
}

export function ProjectsSidebar({
  onStatusChange,
  onProjectClick,
  onViewAllProjectsClick,
  onBadgeClick,
  onViewAllBadgesClick,
  onUpgradeClick,
}: ProjectsSidebarProps = {}) {
  const userProfile = getMockUserProfile();
  const { projects, unlockedCount } = getMockProjects();
  const globalActivity = getMockGlobalActivity();

  return (
    <aside className={styles.projectsSidebar}>
      <div>
        {/* User Profile Card */}
        <UserProfile
          profile={userProfile}
          onStatusChange={onStatusChange}
        />

        {/* Recent Projects */}
        <RecentProjects
          projects={projects}
          unlockedCount={unlockedCount}
          onProjectClick={onProjectClick}
          onViewAllClick={onViewAllProjectsClick}
        />


        {/* Premium Box */}
        <PremiumBox onUpgradeClick={onUpgradeClick} />

        {/* Global Activity */}
        <GlobalActivity activity={globalActivity} />
      </div>
    </aside>
  );
}

export default ProjectsSidebar;