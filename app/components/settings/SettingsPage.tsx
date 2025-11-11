"use client";

import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useRequireAuth } from "@/lib/auth/hooks";
import type { MembershipTier } from "@/lib/pricing";
import SubscriptionSection from "./subscription/SubscriptionSection";
import SubscriptionErrorBoundary from "./subscription/SubscriptionErrorBoundary";
import SettingsSidebar from "./SettingsSidebar";

export default function SettingsPage() {
  const { isAuthenticated, isLoading: authLoading, user } = useRequireAuth();
  const { refreshUser } = useAuthStore();

  // State for checkout flows
  const [selectedTier, setSelectedTier] = useState<MembershipTier | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("subscription");

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
    <div className="flex min-h-screen bg-bg-secondary theme-transition">
      <SettingsSidebar activeSection={activeSection} setActiveSection={setActiveSection} />

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="space-y-6">
          {activeSection === "subscription" && (
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
          )}
        </div>
      </main>
    </div>
  );
}
