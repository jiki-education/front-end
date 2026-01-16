import { useRef } from "react";
import { showModal } from "@/lib/modal";
import { revealBadge, type BadgeData } from "@/lib/api/badges";
import { isNewBadge, getBadgeDate, getBadgeColor, getBadgeIconSrc } from "./badgeUtils";

export function useBadgeActions(
  badges: BadgeData[],
  setBadges: React.Dispatch<React.SetStateAction<BadgeData[]>>,
  setSpinningBadgeId: React.Dispatch<React.SetStateAction<number | null>>,
  setRecentlyRevealedIds: React.Dispatch<React.SetStateAction<Set<number>>>
) {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const handleBadgeClick = async (badgeId: string) => {
    const badge = badges.find((b) => b.id.toString() === badgeId);

    if (!badge) {
      return;
    }

    // Capture isNew status before potentially updating badge state
    const wasNewBadge = isNewBadge(badge);

    // Track whether the reveal API call succeeded
    let revealSucceeded = false;

    // If badge is unrevealed (new), reveal it via API but don't update state yet
    if (wasNewBadge) {
      try {
        await revealBadge(badge.id);
        revealSucceeded = true;
        // Don't update the badge state yet - wait for modal to close
      } catch (err) {
        console.error("Failed to reveal badge:", err);
        // revealSucceeded remains false
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
    showModal(modalType, {
      badgeData: modalData,
      onClose: wasNewBadge
        ? () => {
            // Only update state if the reveal API call succeeded
            if (revealSucceeded) {
              // When modal closes for a new badge, trigger spin animation then update state
              setSpinningBadgeId(badge.id);
              // Clear any existing timeout before setting a new one
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
              }
              timeoutRef.current = setTimeout(() => {
                setBadges((prev) => prev.map((b) => (b.id === badge.id ? { ...b, state: "revealed" } : b)));
                setRecentlyRevealedIds((prev) => new Set(prev).add(badge.id));
                setSpinningBadgeId(null);
              }, 1500); // Match the animation duration
            }
          }
        : undefined
    });
  };

  const cleanup = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  return { handleBadgeClick, cleanup };
}
