"use client";

import { useState } from "react";
import {
  getMockUserProfile,
  getMockProjects,
  type StatusOption,
  type UserProfile as UserProfileType
} from "./lib/mockData";
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
  const [userProfile, setUserProfile] = useState<UserProfileType>(getMockUserProfile());
  const { projects, unlockedCount } = getMockProjects();
  //const globalActivity = getMockGlobalActivity();

  const handleStatusChange = (status: StatusOption) => {
    setUserProfile((prev) => ({
      ...prev,
      currentStatus: status
    }));
    onStatusChange?.(status);
  };

  return (
    <aside className={styles.projectsSidebar}>
      <div>
        {/* User Profile Card */}
        <UserProfile profile={userProfile} onStatusChange={handleStatusChange} />

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
        {/*<GlobalActivity activity={globalActivity} />*/}
      </div>
    </aside>
  );
}

export default ProjectsSidebar;
