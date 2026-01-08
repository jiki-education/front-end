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

const tabs: TabItem[] = [
  { id: "badges", label: "Badges", color: "blue" },
  { id: "certificates", label: "Certificates", color: "purple" }
];

export function AchievementsContent() {
  const [activeTab, setActiveTab] = useState("badges");
  const [badges, setBadges] = useState<BadgeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBadges() {
      try {
        setLoading(true);
        const response = await fetchBadges();
        setBadges(response.badges);
      } catch (err) {
        console.error("Failed to fetch badges:", err);
        setError(err instanceof Error ? err.message : "Failed to load badges");
      } finally {
        setLoading(false);
      }
    }

    void loadBadges();
  }, []);

  const { handleBadgeClick } = useBadgeActions(badges, setBadges);

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
        <div className={BadgesCssModule.badgesGallery}>
          {badges.map((badge) => (
            <BadgeCard key={badge.id} badge={badge} onClick={handleBadgeClick} />
          ))}
        </div>
      )}

      <CertificatesEmptyState show={activeTab === "certificates"} />
    </PageHeader>
  );
}
