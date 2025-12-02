"use client";

import { useAuthStore } from "@/lib/auth/authStore";
import { getMockUserProgress } from "../lib/mockData";
import { LeaderboardCard } from "./LeaderboardCard";
import { ProgressCard } from "./ProgressCard";
import { StreakCard } from "./StreakCard";

export default function InfoPanel() {
  const { user } = useAuthStore();
  const userProgress = getMockUserProgress();

  // Get initials from user name or email
  const getInitials = () => {
    if (!user) {
      return "??";
    }
    if (user.name) {
      const names = user.name.split(" ");
      return names
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    // Use first two letters of email if no name
    return user.email.slice(0, 2).toUpperCase();
  };

  const displayName = user?.name || user?.email || "User";

  return (
    <aside className="w-1/4 bg-white border-l border-gray-200 h-screen sticky top-0 overflow-y-auto">
      <div className="p-6 space-y-6">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
            {getInitials()}
          </div>
          <h2 className="text-xl font-semibold text-gray-900">{displayName}</h2>
          <p className="text-sm text-gray-500">Level {userProgress.currentLevel}</p>
        </div>

        <ProgressCard progress={userProgress} />
        <StreakCard streak={userProgress.streak} />
        <LeaderboardCard />
      </div>
    </aside>
  );
}
