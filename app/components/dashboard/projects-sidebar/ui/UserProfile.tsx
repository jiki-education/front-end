/* eslint-disable @next/next/no-img-element */
"use client";

import type { UserProfile as UserProfileType, StatusOption } from "../lib/mockData";
import { StatusSelector } from './StatusSelector';
import style from './user-profile.module.css'

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
            <StatusSelector 
              currentStatus={profile.currentStatus}
              onStatusChange={onStatusChange}
            />
          </div>
          <div className={style.userHandle}>{profile.handle}</div>
        </div>
        <div className={style.streakBadge}>
          <span className={style.streakIcon}>🔥</span>
          <span className={style.streakNumber}>{profile.streak.count}</span>
          <span className={style.streakText}>{profile.streak.unit}</span>
        </div>
      </div>
      <div className={style.userStats}>
        <div className={style.userStatItem}>
          <span className={style.userStatLabel}>Skills</span>
          <span className={style.userStatValue}>{profile.stats.skillsLearned} learned</span>
        </div>
        <div className={style.userStatItem}>
          <span className={style.userStatLabel}>Cohort</span>
          <span className={style.userStatValue}>{profile.stats.cohort}</span>
        </div>
      </div>
      <div className={style.userQuickStats}>
        <div className={style.quickStatItem}>
          <span className={style.quickStatIcon}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" opacity="0.24" />
              <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
          <span className={style.quickStatNumber}>{profile.quickStats.completedExercises}</span>
        </div>
        <div className={style.quickStatItem}>
          <span className={style.quickStatIcon}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
              <path d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z" fill="currentColor" opacity="0.24" />
              <path d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M8.21 13.89L7 23L12 20L17 23L15.79 13.88" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
          <span className={style.quickStatNumber}>{profile.quickStats.badges}</span>
        </div>
      </div>
      <div className={style.profileBadgesSection}>
        <div className={style.profileBadgesTitle}>Badges</div>
        <div className={style.profileBadges}>
          {profile.badges.slice(0, 3).map((badge) => (
            <div 
              key={badge.id}
              className={`${style.profileBadge} ${badge.variant === 'new' ? style.new : badge.variant === 'purple' ? style.purple : ''}`}
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