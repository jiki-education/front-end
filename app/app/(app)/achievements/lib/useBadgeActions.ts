import { showModal } from "@/lib/modal";
import { revealBadge, type BadgeData } from "@/lib/api/badges";
import { isNewBadge, getBadgeDate, getBadgeColor, getBadgeIconSrc } from "./badgeUtils";

export function useBadgeActions(badges: BadgeData[], setBadges: React.Dispatch<React.SetStateAction<BadgeData[]>>) {
  const handleBadgeClick = async (badgeId: string) => {
    const badge = badges.find((b) => b.id.toString() === badgeId);

    if (!badge) {
      return;
    }

    // Capture isNew status before potentially updating badge state
    const wasNewBadge = isNewBadge(badge);

    // If badge is unrevealed (new), reveal it first
    if (wasNewBadge) {
      try {
        await revealBadge(badge.id);
        // Update local state to mark as revealed only after successful API call
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
      isNew: wasNewBadge
    };

    // Use flip modal for new badges, regular modal for others
    const modalType = wasNewBadge ? "flip-badge-modal" : "badge-modal";
    showModal(modalType, { badgeData: modalData });
  };

  return { handleBadgeClick };
}
