import type { UserProfileData } from "../UserProfile";
import style from "./Streak.module.css";

export function Streak({ profile }: { profile: UserProfileData }) {
  let emoji: string;
  let variantClass: string;
  let count: number;

  if (!profile.streaksEnabled) {
    emoji = "🎓";
    variantClass = style.activeDays;
    count = profile.totalActiveDays;
  } else if (profile.currentStreak === 0) {
    emoji = "😢";
    variantClass = style.noStreak;
    count = profile.currentStreak;
  } else if (profile.currentStreak === 1) {
    emoji = "🚀";
    variantClass = style.oneDayStreak;
    count = profile.currentStreak;
  } else {
    emoji = "🔥";
    variantClass = style.multiDayStreak;
    count = profile.currentStreak;
  }

  return (
    <div className={`${style.streak} ${variantClass}`}>
      <span className={style.streakIcon}>{emoji}</span>
      <span className={style.streakNumber}>{count}</span>
    </div>
  );
}
