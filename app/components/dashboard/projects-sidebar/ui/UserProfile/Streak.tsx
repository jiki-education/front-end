import type { UserProfileData } from "../UserProfile";
import Tooltip from "@/components/ui/Tooltip";
import style from "./Streak.module.css";

export function Streak({ profile }: { profile: UserProfileData }) {
  let emoji: string;
  let variantClass: string;
  let count: number;
  let tooltipText: string;

  if (!profile.streaksEnabled) {
    emoji = "🎓";
    variantClass = style.activeDays;
    count = profile.totalActiveDays;
    tooltipText = `You studied for ${count} day${count === 1 ? "" : "s"} in total.`;
  } else if (profile.currentStreak === 0) {
    emoji = "😢";
    variantClass = style.noStreak;
    count = profile.currentStreak;
    tooltipText = "Practice today to kick off your streak!";
  } else if (profile.currentStreak === 1) {
    emoji = "🚀";
    variantClass = style.oneDayStreak;
    count = profile.currentStreak;
    tooltipText = "Practice daily to build a streak!";
  } else {
    emoji = "🔥";
    variantClass = style.multiDayStreak;
    count = profile.currentStreak;
    tooltipText = `You have a ${count} day streak!`;
  }

  return (
    <Tooltip content={tooltipText} variant="dark" arrow>
      <div className={`${style.streak} ${variantClass}`}>
        <span className={style.streakIcon}>{emoji}</span>
        <span className={style.streakNumber}>{count}</span>
      </div>
    </Tooltip>
  );
}
