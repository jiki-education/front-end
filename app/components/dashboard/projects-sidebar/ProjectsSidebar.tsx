"use client";

import { fetchBadges, type BadgeData } from "@/lib/api/badges";
import { fetchProfile, type ProfileData } from "@/lib/api/profile";
import { fetchProjects, type ProjectData } from "@/lib/api/projects";
import { useAuthStore } from "@/lib/auth/authStore";
import { showModal } from "@/lib/modal";
import premiumModalStyles from "@/lib/modal/modals/PremiumUpgradeModal/PremiumUpgradeModal.module.css";
import { tierIncludes } from "@/lib/pricing";
import { useEffect, useMemo, useState } from "react";
import styles from "./projects-sidebar.module.css";
import { PremiumBox } from "./ui/PremiumBox";
import { RecentProjects } from "./ui/RecentProjects";
import { UserProfile, type UserProfileData } from "./ui/UserProfile";

interface ProjectsSidebarProps {
  onProjectClick?: (projectId: string) => void;
  onViewAllProjectsClick?: () => void;
  onUpgradeClick?: () => void;
}

export function ProjectsSidebar({ onProjectClick, onViewAllProjectsClick, onUpgradeClick }: ProjectsSidebarProps = {}) {
  const user = useAuthStore((state) => state.user)!;
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [badges, setBadges] = useState<BadgeData[]>([]);
  const [badgesLoading, setBadgesLoading] = useState(true);

  const userProfile = useMemo<UserProfileData | null>(() => {
    if (!profileData) {
      return null;
    }

    return {
      name: user.name || user.handle,
      handle: user.handle,
      avatarUrl: profileData.avatar_url,
      icon: profileData.icon,
      streaksEnabled: profileData.streaks_enabled,
      streakCount: profileData.streaks_enabled ? profileData.current_streak : profileData.total_active_days
    };
  }, [user, profileData]);

  useEffect(() => {
    async function loadData() {
      try {
        setProfileLoading(true);
        const profileResponse = await fetchProfile();
        setProfileData(profileResponse.profile);
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setProfileLoading(false);
      }

      try {
        setProjectsLoading(true);
        const projectResponse = await fetchProjects({ per: 100 });
        setProjects(projectResponse.results);
      } catch (error) {
        console.error("Failed to load projects:", error);
      } finally {
        setProjectsLoading(false);
      }

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

  const handleUpgradeClick = () => {
    if (onUpgradeClick) {
      onUpgradeClick();
    } else {
      showModal("premium-upgrade-modal", {}, undefined, premiumModalStyles.premiumModalWidth);
    }
  };

  return (
    <aside className={styles.projectsSidebar}>
      <div>
        {/* User Profile Card */}
        <UserProfile profile={userProfile} badges={badges} loading={profileLoading || badgesLoading} />

        {/* Recent Projects */}
        <RecentProjects
          projects={recentProjects}
          unlockedCount={unlockedCount}
          onProjectClick={onProjectClick}
          onViewAllClick={onViewAllProjectsClick}
          loading={projectsLoading}
        />

        {/* Premium Box - only show for non-premium users */}
        {!tierIncludes(user.membership_type, "premium") && <PremiumBox onUpgradeClick={handleUpgradeClick} />}
      </div>
    </aside>
  );
}

export default ProjectsSidebar;
