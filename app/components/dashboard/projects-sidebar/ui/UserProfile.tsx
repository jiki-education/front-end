"use client";

import { ProfileIcon } from "@/components/icons/ProfileIcon";
import type { BadgeData } from "@/lib/api/badges";
import { useDelayedLoading } from "@/lib/hooks/useDelayedLoading";
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

  if (shouldShowSkeleton || !profile) {
    return <UserProfileSkeleton />;
  }

  return (
    <div className={style.card}>
      <div className={style.header}>
        <div className={style.avatar}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={profile.avatarUrl}
            alt="User Avatar"
            onError={(e) => {
              e.currentTarget.src =
                "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";
            }}
          />
          <div className={style.iconBadge}>
            <ProfileIcon slug={profile.icon} />
          </div>
        </div>
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
