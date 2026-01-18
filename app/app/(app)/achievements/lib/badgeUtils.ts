import { formatDistanceToNow, differenceInDays } from "date-fns";
import type { BadgeData } from "@/lib/api/badges";

export function isNewBadge(badge: BadgeData): boolean {
  return badge.state === "unrevealed";
}

export function isEarnedBadge(badge: BadgeData): boolean {
  return badge.state === "revealed" || badge.state === "unrevealed";
}

export function isRecentBadge(badge: BadgeData): boolean {
  // Check if badge is revealed and earned within the last 7 days
  if (badge.state !== "revealed" || !badge.unlocked_at) {
    return false;
  }

  const unlockedDate = new Date(badge.unlocked_at);
  const daysSinceUnlock = differenceInDays(new Date(), unlockedDate);

  return daysSinceUnlock <= 7;
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

export function getBadgeColor(badge: BadgeData): "blue" | "gold" {
  if (badge.state === "unrevealed") {
    return "gold";
  }
  return "blue";
}
