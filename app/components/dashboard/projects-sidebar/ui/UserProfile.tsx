"use client";

import type { BadgeData } from "@/lib/api/badges";
import { useDelayedLoading } from "@/lib/hooks/useDelayedLoading";
import { showModal } from "@/lib/modal";
import UserAvatar from "@/components/common/UserAvatar";
import PencilIcon from "@/icons/pencil.svg";
import PremiumStarIcon from "@/icons/premium-star.svg";
import style from "./UserProfile.module.css";
import { Badges } from "./UserProfile/Badges";
import { Streak } from "./UserProfile/Streak";
import { UserProfileSkeleton } from "./UserProfileSkeleton";

interface UserProfileBase {
  name: string;
  handle: string;
}

interface UserProfileWithStreaks extends UserProfileBase {
  streaksEnabled: true;
  currentStreak: number;
}

interface UserProfileWithActiveDays extends UserProfileBase {
  streaksEnabled: false;
  totalActiveDays: number;
}

export type UserProfileData = UserProfileWithStreaks | UserProfileWithActiveDays;

interface UserProfileProps {
  profile: UserProfileData | null;
  badges?: BadgeData[];
  onBadgeRevealed?: (badgeId: number) => void;
  loading?: boolean;
  isPremium?: boolean;
}

export function UserProfile({ profile, badges, onBadgeRevealed, loading, isPremium = false }: UserProfileProps) {
  const shouldShowSkeleton = useDelayedLoading(loading ?? false);

  const handleAvatarClick = () => {
    showModal("avatar-edit-modal", {});
  };

  if (shouldShowSkeleton || !profile) {
    return <UserProfileSkeleton />;
  }

  return (
    <div className={`${style.card}${isPremium ? ` ${style.cardPremium}` : ""}`}>
      <div className={style.header}>
        <button
          type="button"
          onClick={handleAvatarClick}
          className={`${style.avatarButton}${isPremium ? ` ${style.avatarButtonPremium}` : ""}`}
        >
          <UserAvatar />
          <div className={style.avatarOverlay}>
            <PencilIcon className={style.avatarOverlayIcon} />
          </div>
          {isPremium && (
            <div className={style.starBadge}>
              <div className={style.starTooltip}>Premium Member</div>
              <PremiumStarIcon />
            </div>
          )}
        </button>
        <div className={style.info}>
          <div className={style.name}>{profile.name}</div>
          <div className={style.handle}>{profile.handle}</div>
        </div>
        <Streak profile={profile} />
      </div>
      <Badges badges={badges} onBadgeRevealed={onBadgeRevealed} />
    </div>
  );
}
