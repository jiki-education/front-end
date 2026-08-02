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

export type BadgeDateInfo =
  | { status: "locked" }
  | { status: "earnedToday" }
  | { status: "earnedRelative"; distance: string };

// Returns the badge's earned-state so the consumer can translate the label.
// The `distance` is still date-fns' English relative time (e.g. "3 days ago");
// localizing that requires passing a date-fns locale and is tracked separately.
export function getBadgeDateInfo(badge: BadgeData): BadgeDateInfo {
  if (!badge.unlocked_at) {
    return { status: "locked" };
  }

  const unlocked = new Date(badge.unlocked_at);
  const distance = formatDistanceToNow(unlocked, { addSuffix: true });

  if (distance.replace("ago", "").trim() === "today") {
    return { status: "earnedToday" };
  }
  return { status: "earnedRelative", distance };
}

export function getBadgeColor(badge: BadgeData): "blue" | "gold" {
  if (badge.state === "unrevealed") {
    return "gold";
  }
  return "blue";
}

export function sortBadges(badges: BadgeData[]): BadgeData[] {
  // Not toSorted(): it needs Chrome 110+/Safari 16.4+ and crashes the dashboard
  // render on older browsers (JIKI-FRONT-END-14). Copy-then-sort is equivalent.
  return [...badges].sort((a, b) => {
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
