"use client";

import { ProfileIcon } from "@/components/icons/ProfileIcon";
import type { BadgeData } from "@/lib/api/badges";
import { useDelayedLoading } from "@/lib/hooks/useDelayedLoading";
import { resolveApiAssetUrl } from "@/lib/api/config";
import { showModal } from "@/lib/modal";
import { useProfileStore } from "@/lib/profile/profileStore";
import PencilIcon from "@/icons/pencil.svg";
import style from "./UserProfile.module.css";
import { Badges } from "./UserProfile/Badges";
import { Streak } from "./UserProfile/Streak";
import { UserProfileSkeleton } from "./UserProfileSkeleton";

interface UserProfileBase {
  name: string;
  handle: string;
  avatarUrl: string;
  icon: string;
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
  loading?: boolean;
}

export function UserProfile({ profile, badges, loading }: UserProfileProps) {
  const shouldShowSkeleton = useDelayedLoading(loading ?? false);
  const setAvatarUrl = useProfileStore((state) => state.setAvatarUrl);

  const handleAvatarClick = () => {
    showModal("avatar-edit-modal", {
      avatarUrl: profile?.avatarUrl ?? null,
      onAvatarChange: (url: string | null) => setAvatarUrl(url)
    });
  };

  if (shouldShowSkeleton || !profile) {
    return <UserProfileSkeleton />;
  }

  return (
    <div className={style.card}>
      <div className={style.header}>
        <button type="button" onClick={handleAvatarClick} className={style.avatarButton}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={resolveApiAssetUrl(profile.avatarUrl)}
            alt="User Avatar"
            onError={(e) => {
              e.currentTarget.src =
                "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";
            }}
          />
          <div className={style.avatarOverlay}>
            <PencilIcon className={style.avatarOverlayIcon} />
          </div>
          <div className={style.iconBadge}>
            <ProfileIcon slug={profile.icon} />
          </div>
        </button>
        <div className={style.info}>
          <div className={style.name}>{profile.name}</div>
          <div className={style.handle}>{profile.handle}</div>
        </div>
        <Streak profile={profile} />
      </div>
      <Badges badges={badges} />
    </div>
  );
}
