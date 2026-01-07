import { showModal } from "@/lib/modal";
import { revealBadge, type BadgeData } from "@/lib/api/badges";
import type { Badge } from "../AchievementsContent";

export function useBadgeActions(
  badges: Badge[],
  badgeApiData: BadgeData[],
  setBadges: React.Dispatch<React.SetStateAction<Badge[]>>
) {
  const handleBadgeClick = async (badgeId: string) => {
    const badge = badges.find((b) => b.id === badgeId);
    const apiBadge = badgeApiData.find((b) => b.id.toString() === badgeId);

    if (!badge || !apiBadge) {
      return;
    }

    // If badge is unrevealed (new), reveal it first
    if (badge.isNew) {
      try {
        await revealBadge(parseInt(badgeId));
        // Update local state to mark as revealed
        setBadges((prev) => prev.map((b) => (b.id === badgeId ? { ...b, isNew: false } : b)));
      } catch (err) {
        console.error("Failed to reveal badge:", err);
      }
    }

    // Create modal data from badge info with real stats
    const modalData = {
      title: badge.title,
      date: badge.date,
      description: badge.subtitle,
      stat: `${apiBadge.num_awardees} learners have earned this badge`,
      color: badge.color as "pink" | "gold" | "purple" | "teal" | "blue",
      icon: badge.iconSrc,
      isNew: badge.isNew
    };

    // Use flip modal for new badges, regular modal for others
    const modalType = badge.isNew ? "flip-badge-modal" : "badge-modal";
    showModal(modalType, { badgeData: modalData });
  };

  return { handleBadgeClick };
}