import { showModal } from "@/lib/modal";
import { revealBadge, type BadgeData } from "@/lib/api/badges";
import { isNewBadge, getBadgeDate, getBadgeColor, getBadgeIconSrc } from "./badgeUtils";

export function useBadgeActions(badges: BadgeData[], setBadges: React.Dispatch<React.SetStateAction<BadgeData[]>>) {
  const handleBadgeClick = async (badgeId: string) => {
    const badge = badges.find((b) => b.id.toString() === badgeId);

    if (!badge) {
      return;
    }

    // If badge is unrevealed (new), reveal it first
    if (isNewBadge(badge)) {
      try {
        await revealBadge(badge.id);
        // Update local state to mark as revealed
        setBadges((prev) => prev.map((b) => (b.id === badge.id ? { ...b, state: "revealed" } : b)));
      } catch (err) {
        console.error("Failed to reveal badge:", err);
      }
    }

    // Create modal data from badge info with real stats
    const modalData = {
      title: badge.name,
      date: getBadgeDate(badge),
      description: badge.description,
      stat: `${badge.num_awardees} learners have earned this badge`,
      color: getBadgeColor(badge),
      icon: getBadgeIconSrc(badge),
      isNew: isNewBadge(badge)
    };

    // Use flip modal for new badges, regular modal for others
    const modalType = isNewBadge(badge) ? "flip-badge-modal" : "badge-modal";
    showModal(modalType, { badgeData: modalData });
  };

  return { handleBadgeClick };
}
