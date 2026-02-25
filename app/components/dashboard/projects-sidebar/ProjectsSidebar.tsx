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
import { ProjectsUpsellCard } from "./ui/ProjectsUpsellCard";
import { RecentProjects } from "./ui/RecentProjects";
import { UserProfile, type UserProfileData } from "./ui/UserProfile";

interface ProjectsSidebarProps {
  onProjectClick?: (projectId: string) => void;
  onViewAllProjectsClick?: () => void;
  onUpgradeClick?: () => void;
}

export function ProjectsSidebar({ onProjectClick, onViewAllProjectsClick, onUpgradeClick }: ProjectsSidebarProps = {}) {
  const user = useAuthStore((state) => state.user)!;
  const isPremium = tierIncludes(user.membership_type, "premium");
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(isPremium);
  const [badges, setBadges] = useState<BadgeData[]>([]);
  const [badgesLoading, setBadgesLoading] = useState(true);

  const userProfile = useMemo<UserProfileData | null>(() => {
    if (!profileData) {
      return null;
    }

    const base = {
      name: user.name || user.handle,
      handle: user.handle,
      avatarUrl: profileData.avatar_url,
      icon: profileData.icon
    };

    if (profileData.streaks_enabled) {
      return { ...base, streaksEnabled: true as const, currentStreak: profileData.current_streak };
    }

    return { ...base, streaksEnabled: false as const, totalActiveDays: profileData.total_active_days };
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

      if (isPremium) {
        try {
          setProjectsLoading(true);
          const projectResponse = await fetchProjects({ per: 100 });
          setProjects(projectResponse.results);
        } catch (error) {
          console.error("Failed to load projects:", error);
        } finally {
          setProjectsLoading(false);
        }
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
  }, [user, isPremium]);

  // Filter to get recent/in-progress projects (up to 3) - only computed for premium users
  const recentProjects = useMemo(() => {
    if (!isPremium) {
      return [];
    }
    return projects.filter((p) => p.status === "started" || p.status === "unlocked").slice(0, 3);
  }, [isPremium, projects]);

  // Count unlocked projects - only computed for premium users
  const unlockedCount = useMemo(() => {
    if (!isPremium) {
      return 0;
    }
    return projects.filter((p) => p.status !== "locked").length;
  }, [isPremium, projects]);

  const handleUpgradeClick = () => {
    if (onUpgradeClick) {
      onUpgradeClick();
    } else {
      showModal(
        "premium-upgrade-modal",
        {},
        premiumModalStyles.premiumModalOverlay,
        premiumModalStyles.premiumModalWidth
      );
    }
  };

  return (
    <aside className={styles.projectsSidebar}>
      <div>
        {/* User Profile Card */}
        <UserProfile profile={userProfile} badges={badges} loading={profileLoading || badgesLoading} />

        {/* Projects section - upsell for non-premium, recent projects for premium */}
        {isPremium ? (
          <RecentProjects
            projects={recentProjects}
            unlockedCount={unlockedCount}
            onProjectClick={onProjectClick}
            onViewAllClick={onViewAllProjectsClick}
            loading={projectsLoading}
          />
        ) : (
          <>
            <ProjectsUpsellCard onUpgradeClick={handleUpgradeClick} />
            <PremiumBox onUpgradeClick={handleUpgradeClick} />
          </>
        )}
      </div>
    </aside>
  );
}

export default ProjectsSidebar;
