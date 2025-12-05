/* eslint-disable @next/next/no-img-element */
"use client";

import type { UserProfile as UserProfileType, StatusOption } from "../lib/mockData";
import { StatusSelector } from "./StatusSelector";
import style from "./user-profile.module.css";

interface UserProfileProps {
  profile: UserProfileType;
  onStatusChange?: (status: StatusOption) => void;
}

export function UserProfile({ profile, onStatusChange }: UserProfileProps) {
  return (
    <div className={style.userProfileCard}>
      <div className={style.userProfileHeader}>
        <div className={style.userAvatar}>
          <img src={profile.avatar} alt="User Avatar" />
          <div className={style.countryBadge}>{profile.countryFlag}</div>
        </div>
        <div className={style.userInfo}>
          <div className={style.userNameRow}>
            <div className={style.userName}>{profile.name}</div>
            <StatusSelector currentStatus={profile.currentStatus} onStatusChange={onStatusChange} />
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
          {profile.badges.slice(0, 3).map((badge) => (
            <div
              key={badge.id}
              className={`${style.profileBadge} ${badge.variant === "new" ? style.new : badge.variant === "purple" ? style.purple : ""}`}
            >
              {badge.isNew && <span className={style.badgeNewTag}>NEW</span>}
              <img src={badge.image} alt={badge.alt} />
            </div>
          ))}
          {profile.badges.length > 3 && (
            <div className={`${style.profileBadge} ${style.empty}`}>
              <span className={style.badgeMore}>+{profile.badges.length - 3}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
