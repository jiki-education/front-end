import type { BadgeData } from "@/lib/api/badges";
import type { Badge } from "../AchievementsContent";

// Transform API badge data to component interface
export function transformBadgeData(apiBadge: BadgeData): Badge {
  const isEarned = apiBadge.state === "revealed" || apiBadge.state === "unrevealed";
  const isNew = apiBadge.state === "unrevealed";

  // Generate date text based on state
  let dateText = "Locked";
  if (apiBadge.unlocked_at) {
    const unlocked = new Date(apiBadge.unlocked_at);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - unlocked.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      dateText = "Earned today";
    } else if (diffDays === 1) {
      dateText = "Earned yesterday";
    } else if (diffDays < 7) {
      dateText = `Earned ${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      dateText = `Earned ${weeks} week${weeks > 1 ? "s" : ""} ago`;
    } else {
      const months = Math.floor(diffDays / 30);
      dateText = `Earned ${months} month${months > 1 ? "s" : ""} ago`;
    }
  }

  // Assign colors and fallback icons based on badge name/type
  const getBadgeProps = (name: string): { color: Badge["color"]; icon: string } => {
    const badgeMap: Record<string, { color: Badge["color"]; icon: string }> = {
      Member: { color: "pink", icon: "/static/images/achievement-icons/About-Us-1--Streamline-Manila.png" },
      "Maze Navigator": { color: "gold", icon: "/static/images/achievement-icons/About-Us-1--Streamline-Manila.png" },
      "Array Expert": { color: "purple", icon: "/static/images/achievement-icons/About-Us-1--Streamline-Manila.png" },
      "Loop Legend": { color: "teal", icon: "/static/images/achievement-icons/About-Us-1--Streamline-Manila.png" },
      "Function Pro": { color: "blue", icon: "/static/images/achievement-icons/About-Us-1--Streamline-Manila.png" },
      Debugger: { color: "purple", icon: "/static/images/achievement-icons/About-Us-1--Streamline-Manila.png" }
    };
    return (
      badgeMap[name] || { color: "blue", icon: "/static/images/achievement-icons/About-Us-1--Streamline-Manila.png" }
    );
  };

  const badgeProps = getBadgeProps(apiBadge.name);

  return {
    id: apiBadge.id.toString(),
    title: apiBadge.name,
    subtitle: apiBadge.description,
    iconSrc: badgeProps.icon,
    iconAlt: apiBadge.name,
    state: isEarned ? "earned" : "locked",
    color: badgeProps.color,
    isNew,
    date: dateText
  };
}