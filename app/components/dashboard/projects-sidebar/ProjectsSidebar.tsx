"use client";

import { fetchBadges, type BadgeData } from "@/lib/api/badges";
import { fetchProfile, type ProfileData } from "@/lib/api/profile";
import { fetchProjects, type ProjectData } from "@/lib/api/projects";
import { useAuthStore } from "@/lib/auth/authStore";
import { useProfileStore } from "@/lib/profile/profileStore";
import { showModal } from "@/lib/modal";
import premiumModalStyles from "@/lib/modal/modals/PremiumUpgradeModal/PremiumUpgradeModal.module.css";
import { tierIncludes } from "@/lib/pricing";
import { useEffect, useMemo, useState } from "react";
import styles from "./projects-sidebar.module.css";
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
  const avatarUrl = useProfileStore((state) => state.avatarUrl);
  const setAvatarUrl = useProfileStore((state) => state.setAvatarUrl);
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
      avatarUrl: avatarUrl ?? null
    };

    if (profileData.streaks_enabled) {
      return { ...base, streaksEnabled: true as const, currentStreak: profileData.current_streak };
    }

    return { ...base, streaksEnabled: false as const, totalActiveDays: profileData.total_active_days };
  }, [user, profileData, avatarUrl]);

  useEffect(() => {
    async function loadData() {
      try {
        setProfileLoading(true);
        const profileResponse = await fetchProfile();
        setProfileData(profileResponse.profile);
        setAvatarUrl(profileResponse.profile.avatar_url || null);
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
  }, [user, isPremium, setAvatarUrl]);

  // Filter to get recent/in-progress projects, padded to 3 with locked projects - only computed for premium users
  const recentProjects = useMemo(() => {
    if (!isPremium) {
      return [];
    }
    const active = projects.filter((p) => p.status === "started" || p.status === "unlocked").slice(0, 3);
    if (active.length < 3) {
      const activeSlugs = new Set(active.map((p) => p.slug));
      const locked = projects.filter((p) => p.status === "locked" && !activeSlugs.has(p.slug));
      return [...active, ...locked.slice(0, 3 - active.length)];
    }
    return active;
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
        <UserProfile
          profile={userProfile}
          badges={badges}
          onBadgeRevealed={(badgeId) =>
            setBadges((prev) => prev.map((b) => (b.id === badgeId ? { ...b, state: "revealed" } : b)))
          }
          loading={profileLoading || badgesLoading}
          isPremium={isPremium}
        />

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
          <ProjectsUpsellCard onUpgradeClick={handleUpgradeClick} />
        )}
      </div>
    </aside>
  );
}

export default ProjectsSidebar;
