import { formatDistanceToNow } from "date-fns";
import type { BadgeData } from "@/lib/api/badges";

export function isNewBadge(badge: BadgeData): boolean {
  return badge.state === "unrevealed";
}

export function isEarnedBadge(badge: BadgeData): boolean {
  return badge.state === "revealed" || badge.state === "unrevealed";
}

export function getBadgeDate(badge: BadgeData): string {
  if (!badge.unlocked_at) {
    return "Locked";
  }

  const unlocked = new Date(badge.unlocked_at);
  const distance = formatDistanceToNow(unlocked, { addSuffix: true });

  // Convert "X ago" to "Earned X ago" for better UX
  return distance.replace("ago", "").trim() === "today" ? "Earned today" : `Earned ${distance}`;
}

export function getBadgeColor(badge: BadgeData): "pink" | "gold" | "purple" | "teal" | "blue" | "green" {
  // TODO: These colors should probably come from the backend instead of hardcoded mapping
  const colorMap: Record<string, "pink" | "gold" | "purple" | "teal" | "blue" | "green"> = {
    Member: "pink",
    "Maze Navigator": "gold",
    "Array Expert": "purple",
    "Loop Legend": "teal",
    "Function Pro": "blue",
    Debugger: "purple"
  };
  return colorMap[badge.name] ?? "blue";
}

export function getBadgeIconSrc(badge: BadgeData): string {
  // Use backend icon if available, fallback to placeholder
  return badge.icon || "/static/images/achievement-icons/About-Us-1--Streamline-Manila.png";
}
