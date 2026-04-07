"use client";

import type { BadgeData } from "@/lib/api/badges";
import { useDelayedLoading } from "@/lib/hooks/useDelayedLoading";
import { resolveApiAssetUrl } from "@/lib/api/config";
import { showModal } from "@/lib/modal";
import { useProfileStore } from "@/lib/profile/profileStore";
import PencilIcon from "@/icons/pencil.svg";
import PremiumStarIcon from "@/icons/premium-star.svg";
import style from "./UserProfile.module.css";
import { Badges } from "./UserProfile/Badges";
import { Streak } from "./UserProfile/Streak";
import { UserProfileSkeleton } from "./UserProfileSkeleton";

interface UserProfileBase {
  name: string;
  handle: string;
  avatarUrl: string | null;
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
  const setAvatarUrl = useProfileStore((state) => state.setAvatarUrl);

  const handleAvatarClick = () => {
    showModal("avatar-edit-modal", {
      onAvatarChange: (url: string | null) => setAvatarUrl(url)
    });
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={profile.avatarUrl ? resolveApiAssetUrl(profile.avatarUrl) : undefined}
            alt="User Avatar"
            onError={(e) => {
              e.currentTarget.src =
                "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";
            }}
          />
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
