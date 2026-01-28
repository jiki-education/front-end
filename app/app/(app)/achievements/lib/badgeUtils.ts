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

export function sortBadges(badges: BadgeData[]): BadgeData[] {
  return badges.toSorted((a, b) => {
    // Priority: 1=unrevealed, 2=new (recently revealed or less than a week old), 3=revealed, 4=locked
    const getCategory = (badge: BadgeData): number => {
      if (badge.state === "unrevealed") {
        return 1;
      }
      if (badge.state === "revealed" && isRecentBadge(badge)) {
        return 2;
      }
      if (badge.state === "revealed") {
        return 3;
      }
      return 4;
    };

    const categoryA = getCategory(a);
    const categoryB = getCategory(b);

    if (categoryA !== categoryB) {
      return categoryA - categoryB;
    }

    if (a.unlocked_at && b.unlocked_at) {
      return new Date(b.unlocked_at).getTime() - new Date(a.unlocked_at).getTime();
    }
    if (a.unlocked_at && !b.unlocked_at) {
      return -1;
    }
    if (!a.unlocked_at && b.unlocked_at) {
      return 1;
    }

    return 0;
  });
}
