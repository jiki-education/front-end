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

export function getBadgeColor(badge: BadgeData): "blue" | "gold" {
  if (badge.state === "unrevealed") {
    return "gold";
  }
  return "blue";
}

export function getBadgeIconSrc(badge: BadgeData): string {
  // Use backend icon if available, fallback to placeholder
  if (!badge.icon) {
    return "/static/images/achievement-icons/About-Us-1--Streamline-Manila.png";
  }

  // If icon is a relative path (doesn't start with / or http), make it absolute
  if (!badge.icon.startsWith("/") && !badge.icon.startsWith("http")) {
    return `/static/images/achievement-icons/${badge.icon}.png`;
  }

  return badge.icon;
}
