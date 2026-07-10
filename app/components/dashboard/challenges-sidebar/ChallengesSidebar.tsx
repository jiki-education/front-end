"use client";

import { fetchBadges, type BadgeData } from "@/lib/api/badges";
import { fetchChallenges, type ChallengeData } from "@/lib/api/challenges";
import { RequestAbortedError } from "@/lib/api/client";
import { fetchProfile, type ProfileData } from "@/lib/api/profile";
import { useAuthStore } from "@/lib/auth/authStore";
import { showPremiumUpgradeModal } from "@/lib/modal/app";
import { tierIncludes } from "@/lib/pricing";
import { useEffect, useMemo, useState } from "react";
import styles from "./ChallengesSidebar.module.css";
import { ChallengesUpsellCard } from "./ui/ChallengesUpsellCard";
import { RecentChallenges } from "./ui/RecentChallenges";
import { UserProfile, type UserProfileData } from "./ui/UserProfile";

interface ChallengesSidebarProps {
  onChallengeClick?: (challengeId: string) => void;
  onViewAllChallengesClick?: () => void;
  onUpgradeClick?: () => void;
}

function ChallengesSidebar({
  onChallengeClick,
  onViewAllChallengesClick,
  onUpgradeClick
}: ChallengesSidebarProps = {}) {
  const user = useAuthStore((state) => state.user)!;
  const isPremium = tierIncludes(user.membership_type, "premium");
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [challenges, setChallenges] = useState<ChallengeData[]>([]);
  const [challengesLoading, setChallengesLoading] = useState(isPremium);
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
      setChallengesLoading(true);
    }

    void fetchProfile()
      .then((res) => setProfileData(res.profile))
      .catch(logUnlessAborted("Failed to load profile:"))
      .finally(() => setProfileLoading(false));

    void fetchBadges()
      .then((res) => setBadges(res.badges))
      .catch(logUnlessAborted("Failed to load badges:"))
      .finally(() => setBadgesLoading(false));

    if (isPremium) {
      void fetchChallenges({ per: 100 })
        .then((res) => setChallenges(res.results))
        .catch(logUnlessAborted("Failed to load challenges:"))
        .finally(() => setChallengesLoading(false));
    }
  }, [user, isPremium]);

  // Filter to get recent/in-progress challenges, padded to 3 with locked challenges - only computed for premium users
  const recentChallenges = useMemo(() => {
    if (!isPremium) {
      return [];
    }
    const active = challenges.filter((p) => p.status === "started" || p.status === "unlocked").slice(0, 3);
    if (active.length >= 3) {
      return active;
    }
    const usedSlugs = new Set(active.map((p) => p.slug));
    const completed = challenges.filter((p) => p.status === "completed" && !usedSlugs.has(p.slug));
    const withCompleted = [...active, ...completed.slice(0, 3 - active.length)];
    if (withCompleted.length >= 3) {
      return withCompleted;
    }
    withCompleted.forEach((p) => usedSlugs.add(p.slug));
    const locked = challenges.filter((p) => p.status === "locked" && !usedSlugs.has(p.slug));
    return [...withCompleted, ...locked.slice(0, 3 - withCompleted.length)];
  }, [isPremium, challenges]);

  // Count unlocked challenges - only computed for premium users
  const unlockedCount = useMemo(() => {
    if (!isPremium) {
      return 0;
    }
    return challenges.filter((p) => p.status !== "locked").length;
  }, [isPremium, challenges]);

  const handleUpgradeClick = () => {
    if (onUpgradeClick) {
      onUpgradeClick();
    } else {
      showPremiumUpgradeModal("upgrade_cta_challenges_sidebar");
    }
  };

  return (
    <aside className={styles.challengesSidebar}>
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

        {/* Challenges section - upsell for non-premium, recent challenges for premium */}
        {isPremium ? (
          <RecentChallenges
            challenges={recentChallenges}
            unlockedCount={unlockedCount}
            onChallengeClick={onChallengeClick}
            onViewAllClick={onViewAllChallengesClick}
            loading={challengesLoading}
          />
        ) : (
          <ChallengesUpsellCard onUpgradeClick={handleUpgradeClick} />
        )}
      </div>
    </aside>
  );
}

// Logs a fetch failure unless it was aborted because the user navigated away
// mid-request (expected, not a real error - don't log or report it to Sentry).
function logUnlessAborted(message: string) {
  return (error: unknown) => {
    if (error instanceof RequestAbortedError) {
      return;
    }
    console.error(message, error);
  };
}

export default ChallengesSidebar;
