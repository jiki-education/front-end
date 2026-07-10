"use client";

import { ChallengesUpsellCard } from "@/components/dashboard/challenges-sidebar/ui/ChallengesUpsellCard";
import { EmptyChallengesState } from "@/components/dashboard/challenges-sidebar/ui/EmptyChallengesState";
import { RecentChallenges } from "@/components/dashboard/challenges-sidebar/ui/RecentChallenges";
import { RecentChallengesSkeleton } from "@/components/dashboard/challenges-sidebar/ui/RecentChallengesSkeleton";
import type { UserProfileData } from "@/components/dashboard/challenges-sidebar/ui/UserProfile";
import { UserProfile } from "@/components/dashboard/challenges-sidebar/ui/UserProfile";
import { UserProfileSkeleton } from "@/components/dashboard/challenges-sidebar/ui/UserProfileSkeleton";
import styles from "@/components/dashboard/challenges-sidebar/ChallengesSidebar.module.css";
import type { BadgeData } from "@/lib/api/badges";
import type { ChallengeData } from "@/lib/api/challenges";
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
    name: "First Steps",
    slug: "first-steps",
    description: "Completed first exercise",
    fun_fact: "",
    state: "revealed",
    num_awardees: 1000,
    unlocked_at: "2024-01-01"
  },
  {
    id: 2,
    name: "Streak Starter",
    slug: "streak-starter",
    description: "3-day streak",
    fun_fact: "",
    state: "revealed",
    num_awardees: 500,
    unlocked_at: "2024-01-05"
  },
  {
    id: 3,
    name: "Curious Mind",
    slug: "curious-mind",
    description: "Explored 5 concepts",
    fun_fact: "",
    state: "unrevealed",
    num_awardees: 300
  }
];

const mockChallenges1: ChallengeData[] = [
  { slug: "snake", title: "Snake", description: "Build the classic Snake game", status: "started" },
  { slug: "calculator", title: "Calculator", description: "Build a calculator app", status: "locked" },
  { slug: "todo-list", title: "Todo List", description: "Build a todo list app", status: "locked" }
];

const mockChallenges2: ChallengeData[] = [
  { slug: "snake", title: "Snake", description: "Build the classic Snake game", status: "started" },
  { slug: "calculator", title: "Calculator", description: "Build a calculator app", status: "unlocked" },
  { slug: "todo-list", title: "Todo List", description: "Build a todo list app", status: "locked" }
];

const mockChallenges3: ChallengeData[] = [
  { slug: "snake", title: "Snake", description: "Build the classic Snake game", status: "started" },
  { slug: "calculator", title: "Calculator", description: "Build a calculator app", status: "unlocked" },
  { slug: "todo-list", title: "Todo List", description: "Build a todo list app", status: "started" }
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
            <UserProfile profile={mockProfile} badges={mockBadges} loading={false} isPremium={false} />
            <ChallengesUpsellCard onUpgradeClick={() => console.debug("Upgrade clicked")} />
          </>
        );

      case "premium-empty":
        return (
          <>
            <UserProfile profile={mockProfile} badges={mockBadges} loading={false} isPremium={true} />
            <EmptyChallengesState />
          </>
        );

      case "premium-1-challenge":
        return (
          <>
            <UserProfile profile={mockProfile} badges={mockBadges} loading={false} isPremium={true} />
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
            <UserProfile profile={mockProfile} badges={mockBadges} loading={false} isPremium={true} />
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
            <UserProfile profile={mockProfile} badges={mockBadges} loading={false} isPremium={true} />
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
    <div className="min-h-screen bg-gray-100">
      <div className="p-4 bg-white border-b border-gray-200">
        <h1 className="text-xl font-bold mb-4">Challenges Sidebar States</h1>
        <div className="flex flex-wrap gap-2">
          {states.map((state) => (
            <button
              key={state.id}
              onClick={() => setSelectedState(state.id)}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                selectedState === state.id ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {state.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-8 flex justify-center">
        <div className="bg-gray-50" style={{ width: 480 }}>
          <aside className={styles.challengesSidebar} style={{ width: "100%", height: "auto", position: "static" }}>
            <div>{renderSidebarContent()}</div>
          </aside>
        </div>
      </div>
    </div>
  );
}
