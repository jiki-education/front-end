"use client";

import { PageHeader } from "@/components/ui-kit/PageHeader";
import type { TabItem } from "@/components/ui-kit/PageTabs";
import { PageTabs } from "@/components/ui-kit/PageTabs";
import AllIcon from "@/icons/all.svg";
import CompleteIcon from "@/icons/complete.svg";
import InProgressIcon from "@/icons/in-progress.svg";
import LockedIcon from "@/icons/locked.svg";
import NotStartedIcon from "@/icons/not-started.svg";
import ChallengesIcon from "@/icons/challenges.svg";
import { trackEvent } from "@/lib/analytics";
import { fetchChallenges, type ChallengeData, type ChallengesResponse } from "@/lib/api/challenges";
import { RequestAbortedError } from "@/lib/api/client";
import { useAuthStore } from "@/lib/auth/authStore";
import { useDelayedLoading } from "@/lib/hooks/useDelayedLoading";
import { tierIncludes } from "@/lib/pricing";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { ChallengeCard } from "./ChallengeCard";
import { ChallengeCardsLoadingSkeleton } from "./ChallengeCardSkeleton";
import { NoChallengesFound } from "./NoChallengesFound";
import { PremiumChallengeCard } from "./PremiumChallengeCard";

export function ChallengesContent() {
  const t = useTranslations("challenges");
  const tabs: TabItem[] = [
    { id: "all", label: t("tabAll"), icon: <AllIcon />, color: "blue" },
    { id: "in-progress", label: t("tabInProgress"), icon: <InProgressIcon />, color: "purple" },
    { id: "not-started", label: t("tabNotStarted"), icon: <NotStartedIcon />, color: "blue" },
    { id: "complete", label: t("tabComplete"), icon: <CompleteIcon />, color: "green" },
    { id: "locked", label: t("tabLocked"), icon: <LockedIcon />, color: "gray" }
  ];
  const user = useAuthStore((state) => state.user);
  const isPremium = !!user && tierIncludes(user.membership_type, "premium");
  const [challenges, setChallenges] = useState<ChallengeData[]>([]);
  const [challengesLoading, setChallengesLoading] = useState(true);
  const [challengesError, setChallengesError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  // Deferred loading pattern:
  // - Only show skeleton if loading takes longer than 300ms
  // - If data arrives within 300ms, skip the skeleton entirely (no flash)
  // - This applies to ALL loads (initial and subsequent)
  const showSkeleton = useDelayedLoading(challengesLoading, 300);

  const getFilteredChallenges = () => {
    if (activeTab === "all") {
      return challenges;
    }

    const statusMap = {
      "in-progress": "started",
      "not-started": "unlocked",
      complete: "completed",
      locked: "locked"
    };

    const targetStatus = statusMap[activeTab as keyof typeof statusMap];
    return challenges.filter((challenge) => challenge.status === targetStatus);
  };

  const filteredChallenges = getFilteredChallenges();

  useEffect(() => {
    async function loadChallenges() {
      try {
        setChallengesLoading(true);
        const response: ChallengesResponse = await fetchChallenges();
        setChallenges(response.results);
      } catch (error) {
        // Request aborted because the user navigated away mid-fetch - expected,
        // not a real error. Leave the loading state as-is; the component is unmounting.
        if (error instanceof RequestAbortedError) {
          return;
        }
        console.error("Failed to fetch challenges:", error);
        setChallengesError(error instanceof Error ? error.message : "Failed to load challenges");
      } finally {
        setChallengesLoading(false);
      }
    }

    void loadChallenges();
  }, []);

  // Free users see the challenges page as a wall of locked premium cards.
  // Fire premium_feature_blocked once per page view (after data loads) so
  // we can measure passive exposure to the paywall, not just clicks.
  useEffect(() => {
    if (challengesLoading || challengesError || isPremium || challenges.length === 0) return;
    trackEvent("premium_feature_blocked", { feature: "challenges_page" });
  }, [challengesLoading, challengesError, isPremium, challenges.length]);

  const renderContent = () => {
    if (showSkeleton) {
      return <ChallengeCardsLoadingSkeleton />;
    }

    if (challengesError) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">{t("error", { error: challengesError })}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {t("retry")}
            </button>
          </div>
        </div>
      );
    }

    if (!isPremium) {
      return (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(265px,1fr))] gap-28">
          {challenges.map((challenge) => (
            <PremiumChallengeCard key={challenge.slug} challenge={challenge} />
          ))}
        </div>
      );
    }

    if (filteredChallenges.length === 0) {
      return <NoChallengesFound challenges={challenges} activeTabId={activeTab} />;
    }

    return (
      <div className="grid grid-cols-[repeat(auto-fill,minmax(265px,1fr))] gap-28">
        {filteredChallenges.map((challenge) => (
          <ChallengeCard key={challenge.slug} challenge={challenge} />
        ))}
      </div>
    );
  };

  return (
    <PageHeader icon={<ChallengesIcon />} title={t("title")} description={t("description")}>
      {isPremium && <PageTabs className="mb-16" tabs={tabs} activeTabId={activeTab} onTabChange={setActiveTab} />}
      {renderContent()}
    </PageHeader>
  );
}
