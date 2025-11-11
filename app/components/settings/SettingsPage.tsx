"use client";

import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useRequireAuth } from "@/lib/auth/hooks";
import type { MembershipTier } from "@/lib/pricing";
import SubscriptionSection from "./subscription/SubscriptionSection";
import SubscriptionErrorBoundary from "./subscription/SubscriptionErrorBoundary";

export default function SettingsPage() {
  const { isAuthenticated, isLoading: authLoading, user } = useRequireAuth();
  const { refreshUser } = useAuthStore();

  // State for checkout flows
  const [selectedTier, setSelectedTier] = useState<MembershipTier | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  if (authLoading) {
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

  return (
    <div className="min-h-screen bg-bg-primary theme-transition">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <header className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">Settings</h1>
          <p className="text-text-secondary text-sm sm:text-base">Manage your account preferences and subscription</p>
        </header>

        <main className="space-y-6 sm:space-y-8">
          <SubscriptionErrorBoundary>
            <SubscriptionSection
              user={user}
              refreshUser={refreshUser}
              selectedTier={selectedTier}
              setSelectedTier={setSelectedTier}
              clientSecret={clientSecret}
              setClientSecret={setClientSecret}
            />
          </SubscriptionErrorBoundary>

          {/* Placeholder for future settings sections */}
          <div className="text-center py-8 text-text-secondary">
            <p className="text-sm">More settings sections coming soon...</p>
          </div>
        </main>
      </div>
    </div>
  );
}
