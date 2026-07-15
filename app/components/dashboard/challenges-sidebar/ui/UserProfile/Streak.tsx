import type { UserProfileData } from "../UserProfile";
import Tooltip from "@/components/ui/Tooltip";
import { useTranslations } from "next-intl";
import style from "./Streak.module.css";

export function Streak({ profile }: { profile: UserProfileData }) {
  const t = useTranslations("dashboard.challengesSidebar.streak");
  let emoji: string;
  let variantClass: string;
  let count: number;
  let tooltipText: string;

  if (!profile.streaksEnabled) {
    emoji = "🎓";
    variantClass = style.activeDays;
    count = profile.totalActiveDays;
    tooltipText = t("activeDays", { count });
  } else if (profile.currentStreak === 0) {
    emoji = "😢";
    variantClass = style.noStreak;
    count = profile.currentStreak;
    tooltipText = t("noStreak");
  } else if (profile.currentStreak === 1) {
    emoji = "🚀";
    variantClass = style.oneDayStreak;
    count = profile.currentStreak;
    tooltipText = t("oneDayStreak");
  } else {
    emoji = "🔥";
    variantClass = style.multiDayStreak;
    count = profile.currentStreak;
    tooltipText = t("multiDayStreak", { count });
  }

  return (
    <Tooltip content={tooltipText} variant="dark">
      <div className={`${style.streak} ${variantClass}`}>
        <span className={style.streakIcon}>{emoji}</span>
        <span className={style.streakNumber}>{count}</span>
      </div>
    </Tooltip>
  );
}
