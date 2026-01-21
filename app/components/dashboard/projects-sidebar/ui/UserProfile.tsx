"use client";

import type { BadgeModalData } from "@/app/(app)/achievements/badgeData";
import {
  getBadgeColor,
  getBadgeDate,
  isEarnedBadge,
  isNewBadge,
  isRecentBadge
} from "@/app/(app)/achievements/lib/badgeUtils";
import { BadgeIcon } from "@/components/icons/BadgeIcon";
import { BadgeNewLabel } from "@/components/ui/BadgeNewLabel";
import UnlockIcon from "@/icons/unlocked-thin.svg";
import type { BadgeData } from "@/lib/api/badges";
import { showModal } from "@/lib/modal";
import Link from "next/link";
import type { StatusOption, UserProfile as UserProfileType } from "../lib/mockData";
import { UserProfileSkeleton } from "./UserProfileSkeleton";
import style from "./user-profile.module.css";

interface UserProfileProps {
  profile: UserProfileType;
  onStatusChange?: (status: StatusOption) => void;
  realBadges?: BadgeData[];
  badgesLoading?: boolean;
}

export function UserProfile({ profile, onStatusChange: _onStatusChange, realBadges, badgesLoading }: UserProfileProps) {
  // Show skeleton while loading
  if (badgesLoading) {
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
      stat: `${badge.num_awardees} learners have earned this badge`,
      color: getBadgeColor(badge),
      slug: badge.slug,
      isNew: isNewBadge(badge)
    };

    // Show the badge modal
    showModal("badge-modal", {
      badgeData: modalData
    });
  };

  // Sort badges the same way as achievements page: unrevealed, new, revealed
  const sortBadges = (badges: BadgeData[]): BadgeData[] => {
    return badges.toSorted((a, b) => {
      // Determine category for each badge
      // Priority: 1=unrevealed, 2=new (recently revealed or less than a week old), 3=revealed
      const getCategory = (badge: BadgeData): number => {
        if (badge.state === "unrevealed") {
          return 1;
        }
        if (badge.state === "revealed" && isRecentBadge(badge)) {
          return 2;
        }
        if (badge.state === "revealed") {
          return 3;
        }
        return 4; // locked badges (shouldn't appear in earned badges but for safety)
      };

      const categoryA = getCategory(a);
      const categoryB = getCategory(b);

      // Primary sort by category
      if (categoryA !== categoryB) {
        return categoryA - categoryB;
      }

      // Secondary sort by unlock date (most recent first for earned badges)
      if (a.unlocked_at && b.unlocked_at) {
        return new Date(b.unlocked_at).getTime() - new Date(a.unlocked_at).getTime();
      }

      // If only one has a date, the one with date comes first
      if (a.unlocked_at && !b.unlocked_at) {
        return -1;
      }
      if (!a.unlocked_at && b.unlocked_at) {
        return 1;
      }

      // Keep original order if no dates
      return 0;
    });
  };

  // Use real badges if available
  const displayBadges = realBadges ? sortBadges(realBadges.filter(isEarnedBadge)).slice(0, 3) : null;

  const totalEarnedBadges = realBadges ? realBadges.filter(isEarnedBadge).length : profile.badges.length;

  return (
    <div className={style.userProfileCard}>
      <div className={style.userProfileHeader}>
        <div className={style.userAvatar}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={profile.avatar} alt="User Avatar" />
          <div className={style.countryBadge}>{profile.countryFlag}</div>
        </div>
        <div className={style.userInfo}>
          <div className={style.userNameRow}>
            <div className={style.userName}>{profile.name}</div>
            {/*<StatusSelector currentStatus={profile.currentStatus} onStatusChange={onStatusChange} />*/}
          </div>
          <div className={style.userHandle}>{profile.handle}</div>
        </div>
        <div className={style.streakBadge}>
          <span className={style.streakIcon}>🔥</span>
          <span className={style.streakNumber}>{profile.streak.count}</span>
          <span className={style.streakText}>{profile.streak.unit}</span>
        </div>
      </div>
      <div className={style.profileBadgesSection}>
        <div className={style.profileBadgesTitle}>Badges</div>
        <div className={style.profileBadges}>
          {displayBadges && displayBadges.length > 0 ? (
            // Show real badges
            <>
              {displayBadges.map((badge) => {
                const isUnrevealed = badge.state === "unrevealed";
                const isNew = isUnrevealed || isRecentBadge(badge);
                const badgeColor = getBadgeColor(badge);
                return (
                  <div
                    key={badge.id}
                    className={`${style.profileBadge} ${isUnrevealed ? style.unrevealed : ""} ${isNew && !isUnrevealed ? style.new : ""} ${style[badgeColor]}`}
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
                <Link href="/achievements" className={`${style.profileBadge} ${style.empty}`}>
                  <span className={style.badgeMore}>+{totalEarnedBadges - 3}</span>
                </Link>
              )}
            </>
          ) : (
            // No badges earned yet - show empty state
            <Link href="/achievements" className={`${style.profileBadge} ${style.empty}`}>
              <span className={style.badgeMore}>→</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
