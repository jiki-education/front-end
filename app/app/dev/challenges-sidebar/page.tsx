"use client";

import { ChallengesUpsellCard } from "@/components/dashboard/challenges-sidebar/ui/ChallengesUpsellCard";
import { EmptyChallengesState } from "@/components/dashboard/challenges-sidebar/ui/EmptyChallengesState";
import { RecentChallenges } from "@/components/dashboard/challenges-sidebar/ui/RecentChallenges";
import { RecentChallengesSkeleton } from "@/components/dashboard/challenges-sidebar/ui/RecentChallengesSkeleton";
import type { UserProfileData } from "@/components/dashboard/challenges-sidebar/ui/UserProfile";
import { UserProfile } from "@/components/dashboard/challenges-sidebar/ui/UserProfile";
import { UserProfileSkeleton } from "@/components/dashboard/challenges-sidebar/ui/UserProfileSkeleton";
import styles from "@/components/dashboard/challenges-sidebar/ChallengesSidebar.module.css";
import pageStyles from "./page.module.css";
import type { BadgeData } from "@/lib/api/badges";
import type { ChallengeWithCopy } from "@/lib/api/challenges";
import { useState } from "react";

type StateId =
  | "loading"
  | "free-user"
  | "premium-empty"
  | "premium-1-challenge"
  | "premium-2-challenges"
  | "premium-with-challenges";

const states: { id: StateId; label: string }[] = [
  { id: "loading", label: "Loading (Skeleton)" },
  { id: "free-user", label: "Free User" },
  { id: "premium-empty", label: "Premium — No Challenges" },
  { id: "premium-1-challenge", label: "Premium — 1 Challenge" },
  { id: "premium-2-challenges", label: "Premium — 2 Challenges" },
  { id: "premium-with-challenges", label: "Premium — 3 Challenges" }
];

const mockProfile: UserProfileData = {
  name: "Jane Coder",
  handle: "janecoder",
  streaksEnabled: true,
  currentStreak: 7
};

const mockBadges: BadgeData[] = [
  {
    id: 1,
    slug: "first-steps",
    state: "revealed",
    unlocked_at: "2024-01-01"
  },
  {
    id: 2,
    slug: "streak-starter",
    state: "revealed",
    unlocked_at: "2024-01-05"
  },
  {
    id: 3,
    slug: "curious-mind",
    state: "unrevealed"
  }
];

const mockBadgeCopy = {
  "first-steps": { name: "First Steps", description: "Completed first exercise", funFact: "" },
  "streak-starter": { name: "Streak Starter", description: "3-day streak", funFact: "" },
  "curious-mind": { name: "Curious Mind", description: "Explored 5 concepts", funFact: "" }
};

const mockChallenges1: ChallengeWithCopy[] = [
  { slug: "structured-house", title: "Snake", description: "Build the classic Snake game", status: "started" },
  { slug: "checkerboard", title: "Calculator", description: "Build a calculator app", status: "locked" },
  { slug: "acronym", title: "Todo List", description: "Build a todo list app", status: "locked" }
];

const mockChallenges2: ChallengeWithCopy[] = [
  { slug: "structured-house", title: "Snake", description: "Build the classic Snake game", status: "started" },
  { slug: "checkerboard", title: "Calculator", description: "Build a calculator app", status: "unlocked" },
  { slug: "acronym", title: "Todo List", description: "Build a todo list app", status: "locked" }
];

const mockChallenges3: ChallengeWithCopy[] = [
  { slug: "structured-house", title: "Snake", description: "Build the classic Snake game", status: "started" },
  { slug: "checkerboard", title: "Calculator", description: "Build a calculator app", status: "unlocked" },
  { slug: "acronym", title: "Todo List", description: "Build a todo list app", status: "started" }
];

export default function ChallengesSidebarDevPage() {
  const [selectedState, setSelectedState] = useState<StateId>("premium-1-challenge");

  const renderSidebarContent = () => {
    switch (selectedState) {
      case "loading":
        return (
          <>
            <UserProfileSkeleton />
            <RecentChallengesSkeleton />
          </>
        );

      case "free-user":
        return (
          <>
            <UserProfile
              badgeCopy={mockBadgeCopy}
              profile={mockProfile}
              badges={mockBadges}
              loading={false}
              isPremium={false}
            />
            <ChallengesUpsellCard onUpgradeClick={() => console.debug("Upgrade clicked")} />
          </>
        );

      case "premium-empty":
        return (
          <>
            <UserProfile
              badgeCopy={mockBadgeCopy}
              profile={mockProfile}
              badges={mockBadges}
              loading={false}
              isPremium={true}
            />
            <EmptyChallengesState />
          </>
        );

      case "premium-1-challenge":
        return (
          <>
            <UserProfile
              badgeCopy={mockBadgeCopy}
              profile={mockProfile}
              badges={mockBadges}
              loading={false}
              isPremium={true}
            />
            <RecentChallenges
              challenges={mockChallenges1}
              unlockedCount={1}
              onChallengeClick={(id) => console.debug("Challenge clicked:", id)}
              onViewAllClick={() => console.debug("View all clicked")}
              loading={false}
            />
          </>
        );

      case "premium-2-challenges":
        return (
          <>
            <UserProfile
              badgeCopy={mockBadgeCopy}
              profile={mockProfile}
              badges={mockBadges}
              loading={false}
              isPremium={true}
            />
            <RecentChallenges
              challenges={mockChallenges2}
              unlockedCount={2}
              onChallengeClick={(id) => console.debug("Challenge clicked:", id)}
              onViewAllClick={() => console.debug("View all clicked")}
              loading={false}
            />
          </>
        );

      case "premium-with-challenges":
        return (
          <>
            <UserProfile
              badgeCopy={mockBadgeCopy}
              profile={mockProfile}
              badges={mockBadges}
              loading={false}
              isPremium={true}
            />
            <RecentChallenges
              challenges={mockChallenges3}
              unlockedCount={5}
              onChallengeClick={(id) => console.debug("Challenge clicked:", id)}
              onViewAllClick={() => console.debug("View all clicked")}
              loading={false}
            />
          </>
        );
    }
  };

  return (
    <div className={pageStyles.page}>
      <div className={pageStyles.toolbar}>
        <h1 className={pageStyles.title}>Challenges Sidebar States</h1>
        <div className={pageStyles.stateButtons}>
          {states.map((state) => (
            <button
              key={state.id}
              onClick={() => setSelectedState(state.id)}
              className={pageStyles.stateButton}
              data-active={selectedState === state.id}
            >
              {state.label}
            </button>
          ))}
        </div>
      </div>

      <div className={pageStyles.preview}>
        <div className={pageStyles.previewInner} style={{ width: 480 }}>
          <aside className={styles.challengesSidebar} style={{ width: "100%", height: "auto", position: "static" }}>
            <div>{renderSidebarContent()}</div>
          </aside>
        </div>
      </div>
    </div>
  );
}
