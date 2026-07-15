"use client";

import type { BadgeData } from "@/lib/api/badges";
import { useDelayedLoading } from "@/lib/hooks/useDelayedLoading";
import { useTranslations } from "next-intl";
import { showAvatarEditModal } from "@/lib/modal/app";
import UserAvatar from "@/components/common/UserAvatar";
import { Icon } from "@/components/ui-kit/Icon";
import PencilIcon from "@/icons/pencil.svg";
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
  const t = useTranslations("dashboard.challengesSidebar.userProfile");
  const shouldShowSkeleton = useDelayedLoading(loading ?? false);

  const handleAvatarClick = () => {
    showAvatarEditModal();
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
              <div className={style.starTooltip}>{t("premiumMember")}</div>
              <Icon name="premium-star" size={17} />
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
