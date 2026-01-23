"use client";

import { PageTabs } from "@/components/ui-kit/PageTabs";
import type { TabItem } from "@/components/ui-kit/PageTabs";
import { PageHeader } from "@/components/ui-kit/PageHeader";
import { useEffect, useState } from "react";
import MedalIcon from "@static/icons/medal.svg";
import { CertificatesEmptyState } from "./CertificatesEmptyState";
import { BadgeCard } from "./BadgeCard";
import { fetchBadges, type BadgeData } from "@/lib/api/badges";
import BadgesCssModule from "./BadgeCard.module.css";
import { useBadgeActions } from "./lib/useBadgeActions";
import { AchievementsLoadingState } from "./ui/AchievementsLoadingState";
import { AchievementsErrorState } from "./ui/AchievementsErrorState";
import { isRecentBadge } from "./lib/badgeUtils";

const tabs: TabItem[] = [
  { id: "badges", label: "Badges", color: "blue" },
  { id: "certificates", label: "Certificates", color: "blue" }
];

export function AchievementsContent() {
  const [activeTab, setActiveTab] = useState("badges");
  const [badges, setBadges] = useState<BadgeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [spinningBadgeId, setSpinningBadgeId] = useState<number | null>(null);
  const [recentlyRevealedIds, setRecentlyRevealedIds] = useState<Set<number>>(new Set());
  const [sortedBadgeIds, setSortedBadgeIds] = useState<number[]>([]);

  useEffect(() => {
    async function loadBadges() {
      try {
        setLoading(true);
        const response = await fetchBadges();
        setBadges(response.badges);
        // Sort badges once and lock in the order to prevent jumping when badges are revealed
        const sorted = sortBadgesInitial(response.badges);
        setSortedBadgeIds(sorted.map((b) => b.id));
      } catch (err) {
        console.error("Failed to fetch badges:", err);
        setError(err instanceof Error ? err.message : "Failed to load badges");
      } finally {
        setLoading(false);
      }
    }

    void loadBadges();
  }, []);

  const { handleBadgeClick, cleanup } = useBadgeActions(badges, setBadges, setSpinningBadgeId, setRecentlyRevealedIds);

  useEffect(() => {
    // Cleanup on unmount
    return cleanup;
  }, [cleanup]);

  if (loading) {
    return <AchievementsLoadingState />;
  }

  if (error) {
    return <AchievementsErrorState error={error} />;
  }

  return (
    <PageHeader
      icon={<MedalIcon />}
      title="Achievements"
      description="Every badge tells a story of your coding journey."
    >
      <PageTabs className="mb-16" tabs={tabs} activeTabId={activeTab} onTabChange={setActiveTab} />

      {activeTab === "badges" && (
        <div className={BadgesCssModule.gallery}>
          {sortBadgesByLockedOrder(badges, sortedBadgeIds).map((badge) => (
            <BadgeCard
              key={badge.id}
              badge={badge}
              onClick={handleBadgeClick}
              isSpinning={spinningBadgeId === badge.id}
              showNewRibbon={recentlyRevealedIds.has(badge.id) || isRecentBadge(badge)}
            />
          ))}
        </div>
      )}

      <CertificatesEmptyState show={activeTab === "certificates"} />
    </PageHeader>
  );
}

function sortBadgesInitial(badges: BadgeData[]): BadgeData[] {
  return badges.toSorted((a, b) => {
    // Determine category for each badge
    // Priority: 1=unrevealed, 2=new (less than a week old), 3=revealed, 4=locked
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
      // badge.state === "locked"
      return 4;
    };

    const categoryA = getCategory(a);
    const categoryB = getCategory(b);

    // Primary sort by category
    if (categoryA !== categoryB) {
      return categoryA - categoryB;
    }

    // Secondary sort by unlock date (most recent first for earned badges)
    // For locked badges, they don't have dates so they stay in their original order
    if (a.unlocked_at && b.unlocked_at) {
      return new Date(b.unlocked_at).getTime() - new Date(a.unlocked_at).getTime();
    }

    // If only one has a date, the one with date comes first
    if (a.unlocked_at && !b.unlocked_at) {
      return -1;
    }
    if (!a.unlocked_at && b.unlocked_at) {
      return 1;
    }

    // Keep original order if no dates
    return 0;
  });
}

function sortBadgesByLockedOrder(badges: BadgeData[], sortedIds: number[]): BadgeData[] {
  // Create a map for quick lookup
  const badgeMap = new Map(badges.map((b) => [b.id, b]));

  // Return badges in the locked order, filtering out any that no longer exist
  return sortedIds.map((id) => badgeMap.get(id)).filter((badge): badge is BadgeData => badge !== undefined);
}
