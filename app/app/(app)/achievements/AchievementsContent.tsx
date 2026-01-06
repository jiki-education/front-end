"use client";

import { PageTabs } from "@/components/ui-kit/PageTabs";
import type { TabItem } from "@/components/ui-kit/PageTabs";
import { useEffect, useState } from "react";
import MedalIcon from "@static/icons/medal.svg";
import { CertificatesEmptyState } from "./CertificatesEmptyState";
import { BadgeCard } from "./BadgeCard";
import { showModal } from "@/lib/modal";
import { fetchBadges, revealBadge, type BadgeData } from "@/lib/api/badges";
import BadgesCssModule from "./BadgeCard.module.css";
// Badge interface for component props
export interface Badge {
  id: string;
  title: string;
  subtitle: string;
  iconSrc: string;
  iconAlt: string;
  state: "earned" | "locked";
  color?: "pink" | "gold" | "purple" | "teal" | "blue" | "green";
  isNew?: boolean;
  date: string;
}

const tabs: TabItem[] = [
  { id: "badges", label: "Badges", color: "blue" },
  { id: "certificates", label: "Certificates", color: "purple" }
];

// Transform API badge data to component interface
function transformBadgeData(apiBadge: BadgeData): Badge {
  const isEarned = apiBadge.state === "revealed" || apiBadge.state === "unrevealed";
  const isNew = apiBadge.state === "unrevealed";

  // Generate date text based on state
  let dateText = "Locked";
  if (apiBadge.unlocked_at) {
    const unlocked = new Date(apiBadge.unlocked_at);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - unlocked.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      dateText = "Earned today";
    } else if (diffDays === 1) {
      dateText = "Earned yesterday";
    } else if (diffDays < 7) {
      dateText = `Earned ${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      dateText = `Earned ${weeks} week${weeks > 1 ? "s" : ""} ago`;
    } else {
      const months = Math.floor(diffDays / 30);
      dateText = `Earned ${months} month${months > 1 ? "s" : ""} ago`;
    }
  }

  // Assign colors and fallback icons based on badge name/type
  const getBadgeProps = (name: string): { color: Badge["color"]; icon: string } => {
    const badgeMap: Record<string, { color: Badge["color"]; icon: string }> = {
      Member: { color: "pink", icon: "/static/images/achievement-icons/About-Us-1--Streamline-Manila.png" },
      "Maze Navigator": { color: "gold", icon: "/static/images/achievement-icons/About-Us-1--Streamline-Manila.png" },
      "Array Expert": { color: "purple", icon: "/static/images/achievement-icons/About-Us-1--Streamline-Manila.png" },
      "Loop Legend": { color: "teal", icon: "/static/images/achievement-icons/About-Us-1--Streamline-Manila.png" },
      "Function Pro": { color: "blue", icon: "/static/images/achievement-icons/About-Us-1--Streamline-Manila.png" },
      Debugger: { color: "purple", icon: "/static/images/achievement-icons/About-Us-1--Streamline-Manila.png" }
    };
    return (
      badgeMap[name] || { color: "blue", icon: "/static/images/achievement-icons/About-Us-1--Streamline-Manila.png" }
    );
  };

  const badgeProps = getBadgeProps(apiBadge.name);

  return {
    id: apiBadge.id.toString(),
    title: apiBadge.name,
    subtitle: apiBadge.description,
    iconSrc: badgeProps.icon,
    iconAlt: apiBadge.name,
    state: isEarned ? "earned" : "locked",
    color: badgeProps.color,
    isNew,
    date: dateText
  };
}

export function AchievementsContent() {
  const [activeTab, setActiveTab] = useState("badges");
  const [badges, setBadges] = useState<Badge[]>([]);
  const [badgeApiData, setBadgeApiData] = useState<BadgeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBadges() {
      try {
        setLoading(true);
        const response = await fetchBadges();
        setBadgeApiData(response.badges);
        const transformedBadges = response.badges.map(transformBadgeData);
        setBadges(transformedBadges);
      } catch (err) {
        console.error("Failed to fetch badges:", err);
        setError(err instanceof Error ? err.message : "Failed to load badges");
      } finally {
        setLoading(false);
      }
    }

    void loadBadges();
  }, []);

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

  if (loading) {
    return (
      <div className="max-w-screen-xl mx-auto py-32 px-48">
        <header className="ui-page-header">
          <h1>
            <MedalIcon />
            Achievements
          </h1>
          <p>Every badge tells a story of your coding journey.</p>
        </header>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading achievements...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-screen-xl mx-auto py-32 px-48">
        <header className="ui-page-header">
          <h1>
            <MedalIcon />
            Achievements
          </h1>
          <p>Every badge tells a story of your coding journey.</p>
        </header>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto py-32 px-48">
      <header className="ui-page-header">
        <h1>
          <MedalIcon />
          Achievements
        </h1>
        <p>Every badge tells a story of your coding journey.</p>
      </header>

      <PageTabs className="mb-16" tabs={tabs} activeTabId={activeTab} onTabChange={setActiveTab} />

      {activeTab === "badges" && (
        <div className={BadgesCssModule.badgesGallery}>
          {badges.map((badge) => (
            <BadgeCard key={badge.id} badge={badge} onClick={handleBadgeClick} />
          ))}
        </div>
      )}

      <CertificatesEmptyState show={activeTab === "certificates"} />
    </div>
  );
}
