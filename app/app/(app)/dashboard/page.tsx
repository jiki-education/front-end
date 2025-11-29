"use client";

import ExercisePath from "@/components/index-page/exercise-path/ExercisePath";
import InfoPanel from "@/components/index-page/info-panel/InfoPanel";
import Sidebar from "@/components/index-page/sidebar/Sidebar";
import { fetchLevelsWithProgress } from "@/lib/api/levels";
import { useRequireAuth } from "@/lib/auth/hooks";
import type { LevelWithProgress } from "@/types/levels";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { isAuthenticated, isLoading: authLoading, isReady } = useRequireAuth();
  const [levels, setLevels] = useState<LevelWithProgress[]>([]);
  const [levelsLoading, setLevelsLoading] = useState(true);
  const [levelsError, setLevelsError] = useState<string | null>(null);

  // Load levels when authenticated
  useEffect(() => {
    async function loadLevels() {
      if (!isReady) {
        return;
      }

      if (!isAuthenticated) {
        setLevelsLoading(false);
        return;
      }

      try {
        setLevelsLoading(true);
        const data = await fetchLevelsWithProgress();
        setLevels(data);
      } catch (error) {
        console.error("Failed to fetch levels:", error);
        // Auth/network/rate-limit errors never reach here (handled globally)
        // Only application errors (404, 500, validation) reach this catch block
        setLevelsError(error instanceof Error ? error.message : "Failed to load levels");
      } finally {
        setLevelsLoading(false);
      }
    }

    void loadLevels();
  }, [isAuthenticated, isReady]);

  if (authLoading || levelsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary theme-transition">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-link-primary mx-auto"></div>
          <p className="mt-4 text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (levelsError) {
    const handleClearSession = () => {
      // Clear all auth data
      sessionStorage.clear();
      localStorage.clear();
      // Clear cookies by setting them to expire
      document.cookie.split(";").forEach((c) => {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      // Redirect to login
      window.location.href = "/auth/login";
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary theme-transition">
        <div className="text-center">
          <p className="text-error-text mb-4">Error: {levelsError}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-button-primary-bg text-button-primary-text rounded hover:opacity-90 transition-opacity focus-ring"
            >
              Retry
            </button>
            <button
              onClick={handleClearSession}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:opacity-90 transition-opacity focus-ring"
            >
              Clear Session
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-secondary theme-transition">
      <Sidebar activeItem="learn" />
      <div className="flex ml-[260px]">
        <main className="flex-1 p-6">
          <ExercisePath levels={levels} />
        </main>
        <InfoPanel />
      </div>
    </div>
  );
}
