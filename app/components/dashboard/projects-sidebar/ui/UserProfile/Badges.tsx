"use client";

import type { BadgeModalData } from "@/app/(app)/achievements/badgeData";
import {
  getBadgeColor,
  getBadgeDate,
  isEarnedBadge,
  isNewBadge,
  isRecentBadge,
  sortBadges
} from "@/app/(app)/achievements/lib/badgeUtils";
import { BadgeIcon } from "@/components/icons/BadgeIcon";
import { BadgeNewLabel } from "@/components/ui/BadgeNewLabel";
import UnlockIcon from "@/icons/unlocked.svg";
import type { BadgeData } from "@/lib/api/badges";
import { revealBadge } from "@/lib/api/badges";
import { showModal } from "@/lib/modal";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import style from "./Badges.module.css";

interface BadgesProps {
  badges?: BadgeData[];
  onBadgeRevealed?: (badgeId: number) => void;
}

export function Badges({ badges, onBadgeRevealed }: BadgesProps) {
  const [revealingId, setRevealingId] = useState<number | null>(null);
  const [lockedDisplayIds, setLockedDisplayIds] = useState<number[] | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const timeoutRef2 = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Lock in the display order once on first render with data
  useEffect(() => {
    if (lockedDisplayIds !== null || !badges?.length) return;
    const earned = badges.filter(isEarnedBadge);
    const ids = sortBadges(earned)
      .slice(0, 3)
      .map((b) => b.id);
    setLockedDisplayIds(ids);
  }, [badges, lockedDisplayIds]);

  const handleBadgeClick = async (badge: BadgeData) => {
    if (!isEarnedBadge(badge)) {
      return;
    }

    const wasNewBadge = isNewBadge(badge);
    let revealSucceeded = false;

    if (wasNewBadge) {
      try {
        await revealBadge(badge.id);
        revealSucceeded = true;
      } catch (err) {
        console.error("Failed to reveal badge:", err);
      }
    }

    const modalData: BadgeModalData = {
      title: badge.name,
      date: getBadgeDate(badge),
      description: badge.description,
      funFact: badge.fun_fact,
      color: getBadgeColor(badge),
      slug: badge.slug,
      isNew: wasNewBadge
    };

    showModal("badge-modal", {
      badgeData: modalData,
      firstTime: wasNewBadge,
      onClose:
        wasNewBadge && revealSucceeded
          ? () => {
              setRevealingId(badge.id);
              if (timeoutRef.current) clearTimeout(timeoutRef.current);
              if (timeoutRef2.current) clearTimeout(timeoutRef2.current);
              // Swap content at midpoint (while faded out)
              timeoutRef.current = setTimeout(() => {
                onBadgeRevealed?.(badge.id);
              }, 300);
              // Clear animation class after it completes
              timeoutRef2.current = setTimeout(() => {
                setRevealingId(null);
              }, 600);
            }
          : undefined
    });
  };

  const earnedBadges = badges ? badges.filter(isEarnedBadge) : [];
  const totalEarnedBadges = earnedBadges.length;

  const badgeMap = new Map(earnedBadges.map((b) => [b.id, b]));
  const displayBadges = lockedDisplayIds
    ? lockedDisplayIds.map((id) => badgeMap.get(id)).filter((b): b is BadgeData => b !== undefined)
    : sortBadges(earnedBadges).slice(0, 3);

  return (
    <div className={style.badgesSection}>
      <div className={style.badgesTitle}>Badges</div>
      <div className={style.badges}>
        {displayBadges.length > 0 ? (
          <>
            {displayBadges.map((badge) => {
              const isUnrevealed = badge.state === "unrevealed";
              const isNew = isUnrevealed || isRecentBadge(badge);
              const isRevealing = revealingId === badge.id;
              const badgeColor = getBadgeColor(badge);
              return (
                <div
                  key={badge.id}
                  className={`${style.badge} ${isUnrevealed ? style.unrevealed : ""} ${isNew && !isUnrevealed ? style.new : ""} ${isRevealing ? style.revealing : ""} ${style[badgeColor]}`}
                  onClick={() => handleBadgeClick(badge)}
                  style={{ cursor: "pointer" }}
                >
                  {isNew && <BadgeNewLabel className={style.newLabel} />}
                  {isUnrevealed ? (
                    <div className={style.cardBack}>
                      <UnlockIcon className={style.unlockIcon} />
                    </div>
                  ) : (
                    <div className={style.badgeIconWrapper}>
                      <BadgeIcon slug={badge.slug} />
                    </div>
                  )}
                </div>
              );
            })}
            {totalEarnedBadges > 3 && (
              <Link href="/achievements" className={`${style.badge} ${style.empty}`}>
                <span className={style.badgeMore}>+{totalEarnedBadges - 3}</span>
              </Link>
            )}
          </>
        ) : (
          <Link href="/achievements" className={`${style.badge} ${style.empty}`}>
            <span className={style.badgeMore}>→</span>
          </Link>
        )}
      </div>
    </div>
  );
}
