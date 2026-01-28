"use client";

import type { BadgeModalData } from "@/app/(app)/achievements/badgeData";
import {
  getBadgeColor,
  getBadgeDate,
  isEarnedBadge,
  isNewBadge,
  isRecentBadge,
  sortBadges
} from "@/app/(app)/achievements/lib/badgeUtils";
import { BadgeIcon } from "@/components/icons/BadgeIcon";
import { ProfileIcon } from "@/components/icons/ProfileIcon";
import { BadgeNewLabel } from "@/components/ui/BadgeNewLabel";
import UnlockIcon from "@/icons/unlocked.svg";
import type { BadgeData } from "@/lib/api/badges";
import { useDelayedLoading } from "@/lib/hooks/useDelayedLoading";
import { showModal } from "@/lib/modal";
import Link from "next/link";
import style from "./UserProfile.module.css";
import { UserProfileSkeleton } from "./UserProfileSkeleton";

export interface UserProfileData {
  name: string;
  handle: string;
  avatarUrl: string;
  icon: string;
  streaksEnabled: boolean;
  streakCount: number;
}

interface UserProfileProps {
  profile: UserProfileData | null;
  badges?: BadgeData[];
  loading?: boolean;
}

export function UserProfile({ profile, badges, loading }: UserProfileProps) {
  const shouldShowSkeleton = useDelayedLoading(loading ?? false);

  if (shouldShowSkeleton || !profile) {
    return <UserProfileSkeleton />;
  }

  const handleBadgeClick = (badge: BadgeData) => {
    if (!isEarnedBadge(badge)) {
      return; // Only show modal for earned badges
    }

    // Map the badge data to BadgeModalData format
    const modalData: BadgeModalData = {
      title: badge.name,
      date: getBadgeDate(badge),
      description: badge.description,
      funFact: badge.fun_fact,
      color: getBadgeColor(badge),
      slug: badge.slug,
      isNew: isNewBadge(badge)
    };

    // Show the badge modal
    showModal("badge-modal", {
      badgeData: modalData
    });
  };

  const earnedBadges = badges ? badges.filter(isEarnedBadge) : [];
  const displayBadges = sortBadges(earnedBadges).slice(0, 3);
  const totalEarnedBadges = earnedBadges.length;

  return (
    <div className={style.card}>
      <div className={style.header}>
        <div className={style.avatar}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={profile.avatarUrl} alt="User Avatar" />
          <div className={style.iconBadge}>
            <ProfileIcon slug={profile.icon} />
          </div>
        </div>
        <div className={style.info}>
          <div className={style.name}>{profile.name}</div>
          <div className={style.handle}>{profile.handle}</div>
        </div>
        {Streak(profile)}
      </div>
      <div className={style.badgesSection}>
        <div className={style.badgesTitle}>Badges</div>
        <div className={style.badges}>
          {displayBadges.length > 0 ? (
            // Show real badges
            <>
              {displayBadges.map((badge) => {
                const isUnrevealed = badge.state === "unrevealed";
                const isNew = isUnrevealed || isRecentBadge(badge);
                const badgeColor = getBadgeColor(badge);
                return (
                  <div
                    key={badge.id}
                    className={`${style.badge} ${isUnrevealed ? style.unrevealed : ""} ${isNew && !isUnrevealed ? style.new : ""} ${style[badgeColor]}`}
                    onClick={() => handleBadgeClick(badge)}
                    style={{ cursor: "pointer" }}
                  >
                    {isNew && <BadgeNewLabel className={style.newLabel} />}
                    {isUnrevealed ? (
                      <div className={style.cardBack}>
                        <UnlockIcon className={style.unlockIcon} />
                      </div>
                    ) : (
                      <div className={style.badgeIconWrapper}>
                        <BadgeIcon slug={badge.slug} />
                      </div>
                    )}
                  </div>
                );
              })}
              {totalEarnedBadges > 3 && (
                <Link href="/achievements" className={`${style.badge} ${style.empty}`}>
                  <span className={style.badgeMore}>+{totalEarnedBadges - 3}</span>
                </Link>
              )}
            </>
          ) : (
            // No badges earned yet - show empty state
            <Link href="/achievements" className={`${style.badge} ${style.empty}`}>
              <span className={style.badgeMore}>→</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
function Streak(profile: UserProfileData) {
  let emoji: string;
  let variantClass: string;

  if (!profile.streaksEnabled) {
    emoji = "🎓";
    variantClass = style.activeDays;
  } else if (profile.streakCount === 0) {
    emoji = "😢";
    variantClass = style.noStreak;
  } else if (profile.streakCount === 1) {
    emoji = "🚀";
    variantClass = style.oneDayStreak;
  } else {
    emoji = "🔥";
    variantClass = style.multiDayStreak;
  }

  return (
    <div className={`${style.streak} ${variantClass}`}>
      <span className={style.streakIcon}>{emoji}</span>
      <span className={style.streakNumber}>{profile.streakCount}</span>
    </div>
  );
}
