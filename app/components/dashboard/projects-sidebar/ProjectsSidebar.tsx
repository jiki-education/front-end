"use client";

import { fetchBadges, type BadgeData } from "@/lib/api/badges";
import { fetchProfile, type ProfileData } from "@/lib/api/profile";
import { fetchProjects, type ProjectData } from "@/lib/api/projects";
import { useAuthStore } from "@/lib/auth/authStore";
import { showPremiumUpgradeModal } from "@/lib/modal/app";
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

function ProjectsSidebar({ onProjectClick, onViewAllProjectsClick, onUpgradeClick }: ProjectsSidebarProps = {}) {
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
      handle: user.handle
    };

    if (profileData.streaks_enabled) {
      return { ...base, streaksEnabled: true as const, currentStreak: profileData.current_streak };
    }

    return { ...base, streaksEnabled: false as const, totalActiveDays: profileData.total_active_days };
  }, [user, profileData]);

  useEffect(() => {
    setProfileLoading(true);
    setBadgesLoading(true);
    if (isPremium) {
      setProjectsLoading(true);
    }

    void fetchProfile()
      .then((res) => setProfileData(res.profile))
      .catch((error) => console.error("Failed to load profile:", error))
      .finally(() => setProfileLoading(false));

    void fetchBadges()
      .then((res) => setBadges(res.badges))
      .catch((error) => console.error("Failed to load badges:", error))
      .finally(() => setBadgesLoading(false));

    if (isPremium) {
      void fetchProjects({ per: 100 })
        .then((res) => setProjects(res.results))
        .catch((error) => console.error("Failed to load projects:", error))
        .finally(() => setProjectsLoading(false));
    }
  }, [user, isPremium]);

  // Filter to get recent/in-progress projects, padded to 3 with locked projects - only computed for premium users
  const recentProjects = useMemo(() => {
    if (!isPremium) {
      return [];
    }
    const active = projects.filter((p) => p.status === "started" || p.status === "unlocked").slice(0, 3);
    if (active.length >= 3) {
      return active;
    }
    const usedSlugs = new Set(active.map((p) => p.slug));
    const completed = projects.filter((p) => p.status === "completed" && !usedSlugs.has(p.slug));
    const withCompleted = [...active, ...completed.slice(0, 3 - active.length)];
    if (withCompleted.length >= 3) {
      return withCompleted;
    }
    withCompleted.forEach((p) => usedSlugs.add(p.slug));
    const locked = projects.filter((p) => p.status === "locked" && !usedSlugs.has(p.slug));
    return [...withCompleted, ...locked.slice(0, 3 - withCompleted.length)];
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
      showPremiumUpgradeModal("upgrade_cta_projects_sidebar");
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
