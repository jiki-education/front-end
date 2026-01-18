"use client";

import Link from "next/link";
import type { UserProfile as UserProfileType, StatusOption } from "../lib/mockData";
import type { BadgeData } from "@/lib/api/badges";
import style from "./user-profile.module.css";
import { showModal } from "@/lib/modal";
import type { BadgeModalData } from "@/app/(app)/achievements/badgeData";
import { getBadgeDate, getBadgeColor, isEarnedBadge, isNewBadge } from "@/app/(app)/achievements/lib/badgeUtils";
import { BadgeIcon } from "@/components/BadgeIcon";

interface UserProfileProps {
  profile: UserProfileType;
  onStatusChange?: (status: StatusOption) => void;
  realBadges?: BadgeData[];
  badgesLoading?: boolean;
}

export function UserProfile({ profile, onStatusChange: _onStatusChange, realBadges, badgesLoading }: UserProfileProps) {
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

  // Use real badges if available, otherwise fall back to mock data
  const displayBadges = realBadges && !badgesLoading ? realBadges.filter(isEarnedBadge).slice(0, 3) : null;

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
          {badgesLoading ? (
            // Show loading skeletons while badges are loading
            <>
              <div className={style.profileBadgeSkeleton} />
              <div className={style.profileBadgeSkeleton} />
              <div className={style.profileBadgeSkeleton} />
            </>
          ) : displayBadges && displayBadges.length > 0 ? (
            // Show real badges
            <>
              {displayBadges.map((badge) => (
                <div
                  key={badge.id}
                  className={`${style.profileBadge} ${isNewBadge(badge) ? style.new : ""}`}
                  onClick={() => handleBadgeClick(badge)}
                  style={{ cursor: "pointer" }}
                >
                  {isNewBadge(badge) && <span className={style.badgeNewTag}>NEW</span>}
                  <BadgeIcon slug={badge.slug} />
                </div>
              ))}
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
